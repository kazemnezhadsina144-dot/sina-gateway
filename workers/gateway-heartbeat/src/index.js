/**
 * Fix gateway-heartbeat — align with gateway-ops: no fake commercial RED Telegram.
 */
import { sendTelegramAlert } from "./telegram.js";

export default {
  async scheduled(_event, env, ctx) {
    ctx.waitUntil(runHeartbeat(env, { scheduled: true }));
  },

  async fetch(request, env) {
    if (new URL(request.url).pathname === "/run") {
      if (!authorized(request, env)) {
        return new Response("unauthorized", { status: 401 });
      }
      const result = await runHeartbeat(env, { scheduled: false });
      return Response.json(result, { status: result.verdict === "RED" && result.gateway?.health === "FAIL" ? 503 : 200 });
    }
    return new Response("gateway-heartbeat ok — use gateway-ops for production cron", { status: 200 });
  },
};

function authorized(request, env) {
  const secret = env.CRON_SECRET || "";
  if (!secret) return true;
  const url = new URL(request.url);
  const header = request.headers.get("x-cron-secret") || "";
  return url.searchParams.get("secret") === secret || header === secret;
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

  const commercial = readCommercial(env);
  const infraRed = Object.values(gateway).includes("FAIL");
  const verdict = infraRed ? "RED" : "GREEN";
  const payload = verdictPayload({ gateway, commercial, verdict });

  let telegram = { ok: true, skipped: true };
  if (infraRed) {
    telegram = await sendTelegramAlert(
      env,
      `<b>Sina Gateway heartbeat RED</b>\ninfra: RED\n${JSON.stringify(gateway)}`,
    );
  } else if (commercial.armed && commercial.status === "RED") {
    telegram = await sendTelegramAlert(
      env,
      `<b>Sina Gateway heartbeat commercial RED</b>\noffers_sent: ${commercial.offers_sent}\nreplies: ${commercial.replies}\nL2: ${commercial.L2_receipts}`,
    );
  } else if (scheduled && commercial.armed) {
    telegram = await sendTelegramAlert(
      env,
      `<b>Sina Gateway heartbeat GREEN</b>\ninfra: PASS\noffers_sent: ${commercial.offers_sent} · replies: ${commercial.replies} · L2: ${commercial.L2_receipts}`,
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
  return { armed: true, status, offers_sent, replies, L2_receipts, pipeline_by_level: {} };
}

function verdictPayload({ gateway, commercial, verdict = "RED", error = "" }) {
  return {
    at: new Date().toISOString(),
    gateway,
    commercial,
    verdict,
    error,
  };
}
