/**
 * Verify gateway_utm_clicks table and aggregate RPC.
 */
import { loadSinaEnv, resolveSupabaseEnv } from "./load-sina-env.js";

loadSinaEnv([".env"]);

const { url, anonKey } = resolveSupabaseEnv(process.env);

if (!url || !anonKey) {
  console.error("SKIPPED_ENV_MISSING: Supabase URL/anon key required");
  process.exit(1);
}

const stamp = Date.now();
const click = {
  utm_source: "verify",
  utm_medium: "script",
  utm_campaign: "sourcea",
  utm_content: "hero-a",
  page_path: "/",
  session_id: `verify-${stamp}`,
  visitor_id: `visitor-${stamp}`,
  is_test: true,
};

const insert = await fetch(`${url}/rest/v1/gateway_utm_clicks`, {
  method: "POST",
  headers: {
    apikey: anonKey,
    authorization: `Bearer ${anonKey}`,
    "content-type": "application/json",
    prefer: "return=minimal",
  },
  body: JSON.stringify(click),
});

if (!insert.ok) {
  const detail = await insert.text();
  console.error("UTM_CLICKS_MISSING: run npm run apply:supabase-migration -- 20260713_utm_clicks.sql");
  console.error(detail.slice(0, 300));
  process.exit(1);
}

const rpc = await fetch(`${url}/rest/v1/rpc/gateway_utm_click_counts`, {
  method: "POST",
  headers: {
    apikey: anonKey,
    authorization: `Bearer ${anonKey}`,
    "content-type": "application/json",
  },
  body: "{}",
});

if (!rpc.ok) {
  console.error("UTM_RPC_MISSING: gateway_utm_click_counts");
  process.exit(1);
}

console.log("UTM CLICKS OK: insert + gateway_utm_click_counts RPC");
