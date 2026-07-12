/**
 * Unified gateway ops — 24/7 motor: CF cron probes Railway; Telegram only on real failures.
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
      const ok = isOpsHealthy(result);
      return Response.json(result, { status: ok ? 200 : 503 });
    }
    return new Response("gateway-ops ok", { status: 200 });
  },
};

async function runScheduled(env) {
  const watchdog = await runWatchdog(env);
  let heartbeat = null;
  if (isHeartbeatWindow()) {
    heartbeat = await runHeartbeat(env, { scheduled: true });
  }
  return { watchdog, heartbeat };
}

async function runManual(env, mode) {
  const out = {};
  if (mode === "watchdog" || mode === "all") {
    out.watchdog = await runWatchdog(env);
  }
  if (mode === "heartbeat" || mode === "all") {
    out.heartbeat = await runHeartbeat(env, { scheduled: false });
  }
  return out;
}

function isOpsHealthy(result) {
  if (result.watchdog?.ok === false) return false;
  if (result.heartbeat?.verdict === "RED") return false;
  return true;
}

function isHeartbeatWindow() {
  const now = new Date();
  return now.getUTCHours() === 14 && now.getUTCMinutes() < 15;
}

function isWeeklyVerdictWindow() {
  const now = new Date();
  return now.getUTCDay() === 1 && now.getUTCHours() === 14 && now.getUTCMinutes() < 15;
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

async function runHeartbeat(env, { scheduled }) {
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

  const status = await probeStatus(baseUrl);
  const commercial = readCommercial(env);
  const infraRed = Object.values(gateway).includes("FAIL");
  const verdict = infraRed ? "RED" : "GREEN";

  const ops = {
    lastSignalAt: status?.lastSignalAt || null,
    laneCounts: status?.laneCounts || {},
  };

  const payload = verdictPayload({ gateway, commercial, verdict, ops });

  let telegram = { ok: true, skipped: true };
  const laneSummary = formatLaneSummary(ops.laneCounts);
  const lastSignal = formatLastSignal(ops.lastSignalAt);

  if (infraRed) {
    telegram = await sendTelegramAlert(
      env,
      `<b>Sina Gateway heartbeat RED</b>\ninfra: RED\nlast signal: ${lastSignal}\n${laneSummary}\n${JSON.stringify(gateway)}`,
    );
  } else if (commercial.armed && commercial.status === "RED") {
    telegram = await sendTelegramAlert(
      env,
      `<b>Sina Gateway heartbeat commercial RED</b>\nlast signal: ${lastSignal}\noffers_sent: ${commercial.offers_sent}\nreplies: ${commercial.replies}\nL2: ${commercial.L2_receipts}`,
    );
  } else if (scheduled && commercial.armed) {
    telegram = await sendTelegramAlert(
      env,
      `<b>Sina Gateway heartbeat GREEN</b>\ninfra: PASS\nlast signal: ${lastSignal}\n${laneSummary}\noffers_sent: ${commercial.offers_sent} · replies: ${commercial.replies} · L2: ${commercial.L2_receipts}`,
    );
  } else if (scheduled && isWeeklyVerdictWindow()) {
    telegram = await sendTelegramAlert(
      env,
      `<b>Sina Gateway weekly verdict</b>\ninfra: PASS\ncapture: ${gateway.capture_mode}\nlast signal: ${lastSignal}\n${laneSummary}`,
    );
  }

  return { ...payload, telegram };
}

function readCommercial(env) {
  const armed = env.COMMERCIAL_ARMED === "true";
  const offers_sent = Number(env.OFFERS_SENT || 0);
  const replies = Number(env.REPLIES || 0);
  const L2_receipts = Number(env.L2_RECEIPTS || 0);

  if (!armed) {
    return {
      armed: false,
      status: "NOT_CONFIGURED",
      offers_sent,
      replies,
      L2_receipts,
      pipeline_by_level: {},
      note: "Set COMMERCIAL_ARMED after syncing real channel-receipts via npm run sync:heartbeat",
    };
  }

  const status = offers_sent === 0 ? "RED" : "GREEN";
  return {
    armed: true,
    status,
    offers_sent,
    replies,
    L2_receipts,
    pipeline_by_level: {},
  };
}

async function probeStatus(baseUrl) {
  try {
    const response = await fetch(`${baseUrl}/api/status`);
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

function formatLaneSummary(counts = {}) {
  const entries = Object.entries(counts);
  if (!entries.length) return "lanes: —";
  return entries.map(([lane, count]) => `${lane}: ${count}`).join(" · ");
}

function formatLastSignal(value) {
  if (!value) return "—";
  try {
    return new Date(value).toISOString().slice(0, 16).replace("T", " ") + "Z";
  } catch {
    return String(value);
  }
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

function verdictPayload({ gateway, commercial = readCommercial({}), verdict = "RED", error = "", ops = {} }) {
  return {
    at: new Date().toISOString(),
    gateway,
    commercial,
    ops,
    verdict,
    error,
  };
}
