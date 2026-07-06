/**
 * Cloudflare Watchdog — manual /run. 24/7 motor: sourcea-loop-specialist-tick-v1 sg-watchdog job.
 */
import { sendTelegramAlert } from "./telegram.js";
export default {
  async scheduled(_event, env, ctx) {
    ctx.waitUntil(runWatchdog(env));
  },

  async fetch(request, env) {
    if (new URL(request.url).pathname === "/run") {
      if (!authorized(request, env)) {
        return new Response("unauthorized", { status: 401 });
      }
      const result = await runWatchdog(env);
      return Response.json(result, { status: result.ok ? 200 : 503 });
    }
    return new Response("gateway-watchdog ok", { status: 200 });
  },
};

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
    telegram = await sendTelegramAlert(
      env,
      `<b>Sina Gateway watchdog RED</b>\n${checks.filter((c) => !c.ok).map((c) => c.name).join(", ")}`,
    );
  }

  return { ok, checks, telegram, at: new Date().toISOString() };
}

async function probe(url, name) {
  try {
    const response = await fetch(url);
    const ok = response.ok;
    return { name, ok, status: response.status };
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
