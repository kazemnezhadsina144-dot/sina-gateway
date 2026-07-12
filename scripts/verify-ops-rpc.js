/**
 * Verify Supabase ops RPCs (gateway_lane_counts, gateway_last_signal).
 */
import { loadSinaEnv, resolveSupabaseEnv } from "./load-sina-env.js";

loadSinaEnv([".env"]);

const { url, anonKey } = resolveSupabaseEnv(process.env);

if (!url || !anonKey) {
  console.error("SKIPPED_ENV_MISSING: Supabase URL/anon key required");
  process.exit(1);
}

async function callRpc(name) {
  const response = await fetch(`${url}/rest/v1/rpc/${name}`, {
    method: "POST",
    headers: {
      apikey: anonKey,
      authorization: `Bearer ${anonKey}`,
      "content-type": "application/json",
    },
    body: "{}",
  });
  if (!response.ok) {
    const detail = await response.text();
    return { ok: false, detail: detail.slice(0, 200) };
  }
  return { ok: true, body: await response.json() };
}

const laneCounts = await callRpc("gateway_lane_counts");
if (!laneCounts.ok) {
  console.error("OPS_RPC_MISSING: gateway_lane_counts — run npm run apply:supabase-migration -- 20260712_ops_public_probes.sql");
  console.error(laneCounts.detail);
  process.exit(1);
}

const lastSignal = await callRpc("gateway_last_signal");
if (!lastSignal.ok) {
  console.error("OPS_RPC_MISSING: gateway_last_signal");
  console.error(lastSignal.detail);
  process.exit(1);
}

const lanes = Object.keys(laneCounts.body || {}).length;
console.log(`OPS RPC OK: gateway_lane_counts (${lanes} lanes) · gateway_last_signal ${lastSignal.body?.at ? "has signal" : "empty"}`);
