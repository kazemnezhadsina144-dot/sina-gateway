import { createServer } from "node:http";
import { readFile, writeFile, mkdir, stat } from "node:fs/promises";
import { createReadStream, existsSync, readFileSync } from "node:fs";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { OPTIONS, ROUTES, ROUTING_RULE_DEFINITIONS, enrichLead, routeCopy, validateLead } from "./gateway.js";
import { notifyLead } from "./notifications.js";
import { telegramConfigured } from "./telegram.js";
import { verifyTurnstileToken } from "./turnstile.js";
import { loadSinaEnv, resolveSupabaseEnv } from "../scripts/load-sina-env.js";

const root = join(fileURLToPath(new URL("..", import.meta.url)));
loadSinaEnv([join(root, ".env")]);
const supabaseEnv = () => resolveSupabaseEnv(process.env);

const publicDir = join(root, "public");
const dataDir = join(root, "data");
const dataFile = join(dataDir, "leads.json");
const packageJson = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
const appVersion = packageJson.version || "0.0.0";
const port = Number(process.env.PORT || 4173);
const isProduction = process.env.NODE_ENV === "production";
const rateLimitWindowMs = Number(process.env.RATE_LIMIT_WINDOW_MS || 60_000);
const rateLimitMax = Number(process.env.RATE_LIMIT_MAX || 12);
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const requestCounts = new Map();
let localSaveQueue = Promise.resolve();

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
};

const server = createServer(async (req, res) => {
  const requestId = crypto.randomUUID();
  res.setHeader("x-request-id", requestId);
  setSecurityHeaders(res);

  try {
    const url = new URL(req.url, `http://${req.headers.host}`);

    if (req.method === "POST" && url.pathname === "/api/leads") {
      await handleLead(req, res, requestId);
      return;
    }

    if (req.method === "GET" && url.pathname === "/api/config") {
      sendJson(res, 200, {
        ok: true,
        captureMode: captureMode(),
        testMode: process.env.TEST_MODE === "true",
        turnstileSiteKey: process.env.TURNSTILE_SITE_KEY || "",
        version: appVersion,
        options: OPTIONS,
        routes: ROUTES,
        routingRules: ROUTING_RULE_DEFINITIONS,
      });
      return;
    }

    if (req.method === "GET" && url.pathname === "/health") {
      sendJson(res, 200, { ok: true, version: appVersion });
      return;
    }

    if (req.method === "GET" && url.pathname === "/ready") {
      const payload = await readinessPayload();
      sendJson(res, payload.ok ? 200 : 503, payload);
      return;
    }

    if (req.method === "GET") {
      await serveStatic(url.pathname, res);
      return;
    }

    sendJson(res, 405, { error: "Method not allowed" });
  } catch (error) {
    logEvent("request_error", { requestId, error: error.message });
    sendJson(res, error.statusCode || 500, {
      error: error.publicMessage || "Internal server error",
      requestId,
    });
  }
});

server.listen(port, () => {
  console.log(`Sina Gateway v${appVersion} running at http://localhost:${port} (${captureMode()} capture)`);
});

async function handleLead(req, res, requestId) {
  const originError = validateOrigin(req);
  if (originError) {
    sendJson(res, 403, { error: originError, requestId });
    return;
  }

  const ip = clientIp(req);
  if (isRateLimited(ip)) {
    sendJson(res, 429, { error: "Too many submissions. Try again shortly.", requestId });
    return;
  }

  const body = await readJson(req);
  if (body.website || body.company_url) {
    logEvent("honeypot_blocked", { requestId, ipHash: hashValue(ip) });
    sendJson(res, 202, { ok: true, lead: null });
    return;
  }

  const turnstileError = shouldBypassTurnstile(body)
    ? ""
    : await validateTurnstile(body.turnstileToken, ip);
  if (turnstileError) {
    sendJson(res, 403, { error: turnstileError, requestId });
    return;
  }

  const enriched = applyCaptureMetadata(enrichLead(body));
  const errors = validateLead(enriched);

  if (errors.length) {
    sendJson(res, 422, { error: "Invalid lead", details: errors, requestId });
    return;
  }

  try {
    const saved = await saveLead({
      id: crypto.randomUUID(),
      ...enriched,
      source: process.env.TEST_MODE === "true" ? "test" : enriched.source,
      created_at: new Date().toISOString(),
    });

    await notifyLead({
      lead: saved,
      requestId,
      telegram: process.env,
      log: logEvent,
    });
    logEvent("lead_captured", {
      requestId,
      leadId: saved.id,
      route: saved.venture_route,
      priority: saved.priority_tag,
      captureMode: captureMode(),
    });

    sendJson(res, 201, {
      ok: true,
      requestId,
      lead: {
        id: saved.id,
        venture_route: saved.venture_route,
        lead_type: saved.lead_type,
        priority_tag: saved.priority_tag,
        route_reason: saved.route_reason,
        route: routeCopy(saved.venture_route),
      },
    });
  } catch (error) {
    logEvent("lead_capture_failed", { requestId, error: error.message });
    sendJson(res, 502, {
      error: "Lead capture failed",
      details: publicCaptureError(error),
      requestId,
    });
  }
}

async function saveLead(lead) {
  const { url, anonKey } = supabaseEnv();
  if (url && anonKey) {
    return saveToSupabase(lead, url, anonKey);
  }

  return saveToLocalFile(lead);
}

async function saveToSupabase(lead, url, anonKey) {
  const endpoint = `${url}/rest/v1/gateway_leads`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      apikey: anonKey,
      authorization: `Bearer ${anonKey}`,
      "content-type": "application/json",
      prefer: "return=minimal",
    },
    body: JSON.stringify(databasePayload(lead)),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Supabase insert failed: ${response.status} ${detail}`);
  }

  return lead;
}

async function saveToLocalFile(lead) {
  const save = async () => {
    await mkdir(dataDir, { recursive: true });
    const existing = await readLocalLeads();
    const saved = { ...lead };
    existing.push(saved);
    await writeFile(dataFile, JSON.stringify(existing, null, 2));
    return saved;
  };

  const result = localSaveQueue.then(save, save);
  localSaveQueue = result.then(
    () => undefined,
    () => undefined,
  );
  return result;
}

async function readLocalLeads() {
  try {
    return JSON.parse(await readFile(dataFile, "utf8"));
  } catch {
    return [];
  }
}

async function readJson(req) {
  const chunks = [];
  let size = 0;
  const maxBodyBytes = Number(process.env.MAX_BODY_BYTES || 32_000);

  for await (const chunk of req) {
    size += chunk.length;
    if (size > maxBodyBytes) {
      throw httpError(413, "Request body too large");
    }
    chunks.push(chunk);
  }

  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
  } catch {
    throw httpError(400, "Request body must be valid JSON");
  }
}

async function serveStatic(pathname, res) {
  const safePath = normalize(pathname).replace(/^(\.\.[/\\])+/, "");
  const requested = safePath === "/" ? "/index.html" : safePath;
  let filePath = join(publicDir, requested);

  if (!filePath.startsWith(publicDir)) {
    sendJson(res, 403, { error: "Forbidden" });
    return;
  }

  try {
    let fileStat = await stat(filePath);
    if (fileStat.isDirectory()) {
      filePath = join(filePath, "index.html");
      fileStat = await stat(filePath);
    }
    if (!fileStat.isFile()) throw new Error("Not a file");
    res.writeHead(200, staticHeaders(filePath));
    createReadStream(filePath).pipe(res);
    return;
  } catch {
    if (!requested.includes(".")) {
      try {
        const indexPath = join(publicDir, requested, "index.html");
        if (indexPath.startsWith(publicDir)) {
          const fileStat = await stat(indexPath);
          if (fileStat.isFile()) {
            res.writeHead(200, staticHeaders(indexPath));
            createReadStream(indexPath).pipe(res);
            return;
          }
        }
      } catch {
        // fall through to SPA
      }
    }
    res.writeHead(404, staticHeaders(join(publicDir, "index.html")));
    createReadStream(join(publicDir, "index.html")).pipe(res);
  }
}

function sendJson(res, status, payload) {
  res.writeHead(status, { "content-type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
}

function httpError(statusCode, publicMessage) {
  const error = new Error(publicMessage);
  error.statusCode = statusCode;
  error.publicMessage = publicMessage;
  return error;
}

function publicCaptureError(error) {
  const message = String(error?.message || error);
  if (message.includes("PGRST205") || message.includes("Could not find the table")) {
    return "Supabase table gateway_leads is missing or not visible to the Data API. Run supabase/schema.sql in the Supabase SQL editor, then retry.";
  }
  if (message.includes("row-level security") || message.includes("42501")) {
    return "Supabase RLS rejected the insert. Confirm the anon INSERT policy from supabase/schema.sql exists.";
  }
  return "Check Supabase URL, anon key, table schema, and RLS policy.";
}

function databasePayload(lead) {
  const payload = { ...lead };
  const nullableFields = [
    "email",
    "phone",
    "social",
    "company",
    "role_title",
    "city",
    "country",
    "timezone",
    "budget_range",
    "capital_range",
    "project_type",
    "trade_type",
    "collaboration_type",
    "intro_source",
    "relationship_context",
    "owner",
    "route_reason",
    "priority_reason",
    "raw_notes",
    "page_path",
    "referrer",
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "session_id",
    "visitor_id",
    "route_rule_id",
    "secondary_route",
    "next_action_at",
    "last_contacted_at",
    "archived_at",
    "duplicate_of",
    "app_version",
    "environment",
    "capture_version",
    "schema_version",
  ];

  for (const field of nullableFields) {
    if (payload[field] === "") payload[field] = null;
  }

  if (!payload.submission_id) payload.submission_id = payload.id;
  return payload;
}

async function readinessPayload() {
  const { url, anonKey } = supabaseEnv();
  const hasSupabase = Boolean(url && anonKey);
  const payload = {
    ok: true,
    version: appVersion,
    captureMode: hasSupabase ? "supabase" : "local",
    supabaseConfigured: hasSupabase,
    supabaseRef: supabaseRefFromUrl(url),
    supabaseTableReady: null,
    notificationsConfigured: telegramConfigured(process.env),
    turnstileConfigured: Boolean(process.env.TURNSTILE_SECRET_KEY),
    captureMetadataEnabled: process.env.CAPTURE_METADATA_ENABLED === "true",
    testMode: process.env.TEST_MODE === "true",
  };

  if (!hasSupabase) return payload;

  const table = await probeSupabaseTable(url, anonKey);
  payload.supabaseTableReady = table.ok;
  if (!table.ok) {
    payload.ok = false;
    payload.supabaseTableError = table.error;
  }

  return payload;
}

async function probeSupabaseTable(url, anonKey) {
  try {
    const response = await fetch(`${url}/rest/v1/gateway_leads?select=id&limit=1`, {
      headers: {
        apikey: anonKey,
        authorization: `Bearer ${anonKey}`,
      },
    });
    const body = await response.text();
    if (response.ok) return { ok: true };
    if (body.includes("PGRST205") || body.includes("Could not find the table")) {
      return { ok: false, error: "gateway_leads table missing — run supabase/schema.sql" };
    }
    if (response.status === 401 || response.status === 403) {
      return { ok: true };
    }
    return { ok: false, error: `Supabase probe failed (${response.status})` };
  } catch (error) {
    return { ok: false, error: error.message };
  }
}

function supabaseRefFromUrl(url = "") {
  const match = String(url).match(/https:\/\/([a-z0-9]+)\.supabase\.co/i);
  return match ? match[1] : process.env.GATEWAY_SUPABASE_REF || "";
}

function captureMode() {
  const { url, anonKey } = supabaseEnv();
  return url && anonKey ? "supabase" : "local";
}

function setSecurityHeaders(res) {
  res.setHeader("x-content-type-options", "nosniff");
  res.setHeader("referrer-policy", "strict-origin-when-cross-origin");
  res.setHeader("permissions-policy", "camera=(), microphone=(), geolocation=()");
  res.setHeader("x-frame-options", "DENY");
  res.setHeader(
    "content-security-policy",
    [
      "default-src 'self'",
      "script-src 'self' https://challenges.cloudflare.com",
      "style-src 'self'",
      "img-src 'self' data:",
      "connect-src 'self' https://*.supabase.co https://challenges.cloudflare.com",
      "frame-src https://challenges.cloudflare.com",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  );
}

function staticHeaders(filePath) {
  return {
    "content-type": contentTypes[extname(filePath)] || "application/octet-stream",
    "cache-control": isProduction ? "public, max-age=300" : "no-store",
  };
}

function validateOrigin(req) {
  if (!isProduction || allowedOrigins.length === 0) return "";

  const origin = req.headers.origin;
  if (!origin) return "Missing request origin";
  if (!allowedOrigins.includes(origin)) return "Request origin is not allowed";
  return "";
}

function clientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded) return forwarded.split(",")[0].trim();
  return req.socket.remoteAddress || "unknown";
}

function isRateLimited(ip) {
  const now = Date.now();
  const bucketKey = hashValue(ip);
  const bucket = requestCounts.get(bucketKey) || { count: 0, resetAt: now + rateLimitWindowMs };

  if (now > bucket.resetAt) {
    bucket.count = 0;
    bucket.resetAt = now + rateLimitWindowMs;
  }

  bucket.count += 1;
  requestCounts.set(bucketKey, bucket);
  return bucket.count > rateLimitMax;
}

async function validateTurnstile(token, ip) {
  return verifyTurnstileToken({
    token,
    secret: process.env.TURNSTILE_SECRET_KEY,
    ip,
  });
}

function shouldBypassTurnstile(body) {
  return body.source === "private-test" && String(body.name || "").startsWith("[PRIVATE-TEST]");
}

function applyCaptureMetadata(lead) {
  const testMode = process.env.TEST_MODE === "true";
  const isTest =
    testMode ||
    lead.source === "private-test" ||
    lead.source === "test" ||
    String(lead.name || "").startsWith("[PRIVATE-TEST]");

  const base = {
    ...lead,
    source: testMode ? "test" : lead.source,
  };

  // Enable after Step 3: supabase/migrations/20260706_capture_metadata.sql applied.
  if (process.env.CAPTURE_METADATA_ENABLED !== "true") {
    return base;
  }

  return {
    ...base,
    is_test: isTest,
    app_version: appVersion,
    environment: process.env.NODE_ENV || "development",
    capture_version: "v1",
    schema_version: "20260706",
  };
}

function logEvent(event, payload = {}) {
  console.log(JSON.stringify({ event, timestamp: new Date().toISOString(), ...payload }));
}

function hashValue(value) {
  let hash = 0;
  const input = String(value);
  for (let index = 0; index < input.length; index += 1) {
    hash = (hash * 31 + input.charCodeAt(index)) >>> 0;
  }
  return hash.toString(16);
}

function loadLocalEnv(filePath) {
  if (!existsSync(filePath)) return;

  const lines = readFileSync(filePath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) continue;

    const key = trimmed.slice(0, separatorIndex).trim();
    const rawValue = trimmed.slice(separatorIndex + 1).trim();
    const value = rawValue.replace(/^["']|["']$/g, "");

    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}
