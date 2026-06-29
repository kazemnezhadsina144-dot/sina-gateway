import { createServer } from "node:http";
import { readFile, writeFile, mkdir, stat } from "node:fs/promises";
import { createReadStream, existsSync, readFileSync } from "node:fs";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { enrichLead, routeCopy, validateLead } from "./gateway.js";
import { notifyLead } from "./notifications.js";

const root = join(fileURLToPath(new URL("..", import.meta.url)));
loadLocalEnv(join(root, ".env"));

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
      });
      return;
    }

    if (req.method === "GET" && url.pathname === "/health") {
      sendJson(res, 200, { ok: true, version: appVersion });
      return;
    }

    if (req.method === "GET" && url.pathname === "/ready") {
      sendJson(res, 200, readinessPayload());
      return;
    }

    if (req.method === "GET") {
      await serveStatic(url.pathname, res);
      return;
    }

    sendJson(res, 405, { error: "Method not allowed" });
  } catch (error) {
    logEvent("request_error", { requestId, error: error.message });
    sendJson(res, 500, { error: "Internal server error", requestId });
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

  const turnstileError = await validateTurnstile(body.turnstileToken, ip);
  if (turnstileError) {
    sendJson(res, 403, { error: turnstileError, requestId });
    return;
  }

  const enriched = enrichLead(body);
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
      webhookUrl: process.env.NOTIFY_WEBHOOK_URL,
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
  if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
    return saveToSupabase(lead);
  }

  return saveToLocalFile(lead);
}

async function saveToSupabase(lead) {
  const endpoint = `${process.env.SUPABASE_URL.replace(/\/$/, "")}/rest/v1/gateway_leads`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      apikey: process.env.SUPABASE_ANON_KEY,
      authorization: `Bearer ${process.env.SUPABASE_ANON_KEY}`,
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
  await mkdir(dataDir, { recursive: true });
  const existing = await readLocalLeads();
  const saved = { ...lead };
  existing.push(saved);
  await writeFile(dataFile, JSON.stringify(existing, null, 2));
  return saved;
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
    if (size > maxBodyBytes) throw new Error("Request body too large");
    chunks.push(chunk);
  }

  return JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
}

async function serveStatic(pathname, res) {
  const safePath = normalize(pathname).replace(/^(\.\.[/\\])+/, "");
  const requested = safePath === "/" ? "/index.html" : safePath;
  const filePath = join(publicDir, requested);

  if (!filePath.startsWith(publicDir)) {
    sendJson(res, 403, { error: "Forbidden" });
    return;
  }

  try {
    const fileStat = await stat(filePath);
    if (!fileStat.isFile()) throw new Error("Not a file");
    res.writeHead(200, staticHeaders(filePath));
    createReadStream(filePath).pipe(res);
  } catch {
    res.writeHead(404, staticHeaders(join(publicDir, "index.html")));
    createReadStream(join(publicDir, "index.html")).pipe(res);
  }
}

function sendJson(res, status, payload) {
  res.writeHead(status, { "content-type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
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
  const nullableFields = ["next_action_at", "last_contacted_at", "archived_at", "duplicate_of"];

  for (const field of nullableFields) {
    if (payload[field] === "") payload[field] = null;
  }

  if (!payload.submission_id) payload.submission_id = payload.id;
  return payload;
}

function readinessPayload() {
  const hasSupabase = Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY);
  return {
    ok: true,
    version: appVersion,
    captureMode: captureMode(),
    supabaseConfigured: hasSupabase,
    notificationsConfigured: Boolean(process.env.NOTIFY_WEBHOOK_URL),
    turnstileConfigured: Boolean(process.env.TURNSTILE_SECRET_KEY),
    testMode: process.env.TEST_MODE === "true",
  };
}

function captureMode() {
  return process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY ? "supabase" : "local";
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
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return "";
  if (!token) return "Bot check is required";

  const body = new URLSearchParams({
    secret,
    response: token,
    remoteip: ip,
  });

  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body,
  });
  const result = await response.json();
  return result.success ? "" : "Bot check failed";
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
