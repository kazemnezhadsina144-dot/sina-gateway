/**
 * Daily gateway heartbeat — 07:00 Pacific (14:00 UTC during PDT).
 */
export default {
  async scheduled(_event, env, ctx) {
    ctx.waitUntil(runHeartbeat(env));
  },

  async fetch(request, env) {
    if (new URL(request.url).pathname === "/run") {
      const result = await runHeartbeat(env);
      return Response.json(result, { status: result.verdict === "GREEN" ? 200 : 503 });
    }
    return new Response("gateway-heartbeat ok", { status: 200 });
  },
};

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

  if (env.HEARTBEAT_WEBHOOK_URL) {
    await fetch(env.HEARTBEAT_WEBHOOK_URL, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        text: `Sina Gateway heartbeat ${verdict}: infra=${infraRed ? "RED" : "GREEN"} commercial=${commercialRed ? "RED (offers_sent=0)" : "GREEN"}`,
        ...payload,
      }),
    });
  }

  return payload;
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
