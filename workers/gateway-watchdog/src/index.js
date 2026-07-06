/**
 * Cloudflare Watchdog — gateway chain health cron.
 * Schedule: every 15 minutes. Alerts on failure via WATCHDOG_WEBHOOK_URL.
 */
export default {
  async scheduled(_event, env, ctx) {
    ctx.waitUntil(runWatchdog(env));
  },

  async fetch(request, env) {
    if (new URL(request.url).pathname === "/run") {
      const result = await runWatchdog(env);
      return Response.json(result, { status: result.ok ? 200 : 503 });
    }
    return new Response("gateway-watchdog ok", { status: 200 });
  },
};

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
  if (!ok && env.WATCHDOG_WEBHOOK_URL) {
    await fetch(env.WATCHDOG_WEBHOOK_URL, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        text: `Sina Gateway watchdog RED: ${checks.filter((c) => !c.ok).map((c) => c.name).join(", ")}`,
        checks,
        at: new Date().toISOString(),
      }),
    });
  }

  return { ok, checks, at: new Date().toISOString() };
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
