/**
 * Unified gateway ops — manual /run. 24/7 motor: gateway-ops CF cron.
 */
import { sendTelegramAlert } from "./telegram.js";
export default {
  async scheduled(_event, env, ctx) {
    ctx.waitUntil(runScheduled(env));
  },

  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/run") {
      if (!authorized(request, env)) {
        return new Response("unauthorized", { status: 401 });
      }
      const mode = url.searchParams.get("mode") || "all";
      const result = await runManual(env, mode);
      const ok = result.watchdog?.ok !== false && result.heartbeat?.verdict !== "RED";
      return Response.json(result, { status: ok ? 200 : 503 });
    }
    return new Response("gateway-ops ok", { status: 200 });
  },
};

async function runScheduled(env) {
  const watchdog = await runWatchdog(env);
  let heartbeat = null;
  if (isHeartbeatWindow()) {
    heartbeat = await runHeartbeat(env);
  }
  return { watchdog, heartbeat };
}

async function runManual(env, mode) {
  const out = {};
  if (mode === "watchdog" || mode === "all") {
    out.watchdog = await runWatchdog(env);
  }
  if (mode === "heartbeat" || mode === "all") {
    out.heartbeat = await runHeartbeat(env);
  }
  return out;
}

function isHeartbeatWindow() {
  const now = new Date();
  return now.getUTCHours() === 14 && now.getUTCMinutes() < 15;
}

function authorized(request, env) {
  const secret = env.CRON_SECRET || "";
  if (!secret) return true;
  const url = new URL(request.url);
  const header = request.headers.get("x-cron-secret") || "";
  return url.searchParams.get("secret") === secret || header === secret;
}

async function runWatchdog(env) {
  const baseUrl = (env.GATEWAY_BASE_URL || "").replace(/\/$/, "");
  const checks = [];

  if (!baseUrl) {
    return { ok: false, checks, error: "GATEWAY_BASE_URL not set" };
  }

  checks.push(await probe(`${baseUrl}/health`, "health"));
  checks.push(await probeReady(`${baseUrl}/ready`));
  checks.push(await probeConfig(`${baseUrl}/api/config`));

  const ok = checks.every((check) => check.ok);
  let telegram = { ok: true, skipped: true };
  if (!ok) {
    const fails = checks.filter((c) => !c.ok).map((c) => c.name).join(", ");
    telegram = await sendTelegramAlert(
      env,
      `<b>Sina Gateway watchdog RED</b>\n${fails}\n${JSON.stringify(checks).slice(0, 2800)}`,
    );
  }

  return { ok, checks, telegram, at: new Date().toISOString() };
}

async function runHeartbeat(env) {
  const baseUrl = (env.GATEWAY_BASE_URL || "").replace(/\/$/, "");
  const gateway = { health: "FAIL", ready: "FAIL", supabase_table: "FAIL", capture_mode: "unknown" };

  if (!baseUrl) {
    return verdictPayload({ gateway, error: "GATEWAY_BASE_URL not set" });
  }

  try {
    const health = await fetch(`${baseUrl}/health`);
    gateway.health = health.ok ? "PASS" : "FAIL";
  } catch {
    gateway.health = "FAIL";
  }

  try {
    const readyRes = await fetch(`${baseUrl}/ready`);
    const ready = await readyRes.json();
    gateway.ready = readyRes.ok && ready.ok !== false ? "PASS" : "FAIL";
    gateway.supabase_table = ready.supabaseTableReady ? "PASS" : "FAIL";
    gateway.capture_mode = ready.captureMode || "unknown";
  } catch {
    gateway.ready = "FAIL";
  }

  const commercial = {
    offers_sent: Number(env.OFFERS_SENT || 0),
    replies: Number(env.REPLIES || 0),
    L2_receipts: Number(env.L2_RECEIPTS || 0),
    pipeline_by_level: {},
  };

  const infraRed = Object.values(gateway).includes("FAIL");
  const commercialRed = commercial.offers_sent === 0;
  const verdict = infraRed || commercialRed ? "RED" : "GREEN";

  const payload = verdictPayload({ gateway, commercial, verdict });

  const telegram = await sendTelegramAlert(
    env,
    `<b>Sina Gateway heartbeat ${verdict}</b>\ninfra: ${infraRed ? "RED" : "GREEN"}\ncommercial: ${commercialRed ? "RED (offers_sent=0)" : "GREEN"}`,
  );

  return { ...payload, telegram };
}

async function probe(url, name) {
  try {
    const response = await fetch(url);
    return { name, ok: response.ok, status: response.status };
  } catch (error) {
    return { name, ok: false, error: error.message };
  }
}

async function probeReady(url) {
  try {
    const response = await fetch(url);
    const body = await response.json();
    const ok = response.ok && body.ok !== false && body.supabaseTableReady !== false;
    return {
      name: "ready",
      ok,
      status: response.status,
      captureMode: body.captureMode,
      supabaseTableReady: body.supabaseTableReady,
      error: body.supabaseTableError || "",
    };
  } catch (error) {
    return { name: "ready", ok: false, error: error.message };
  }
}

async function probeConfig(url) {
  try {
    const response = await fetch(url);
    const body = await response.json();
    const ok = response.ok && body.captureMode === "supabase";
    return { name: "config", ok, status: response.status, captureMode: body.captureMode };
  } catch (error) {
    return { name: "config", ok: false, error: error.message };
  }
}

function verdictPayload({ gateway, commercial = defaultCommercial(), verdict = "RED", error = "" }) {
  return {
    at: new Date().toISOString(),
    gateway,
    commercial,
    verdict,
    error,
  };
}

function defaultCommercial() {
  return { offers_sent: 0, replies: 0, L2_receipts: 0, pipeline_by_level: {} };
}
