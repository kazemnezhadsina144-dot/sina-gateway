/**
 * UTM click CTR readout — clicks vs lead captures by campaign/source.
 */
import { loadSinaEnv, resolveSupabaseEnv } from "./load-sina-env.js";

loadSinaEnv([".env"]);

const { url, anonKey } = resolveSupabaseEnv(process.env);

if (!url || !anonKey) {
  console.error("SKIPPED_ENV_MISSING");
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
  if (!response.ok) return null;
  return response.json();
}

const clicks = (await callRpc("gateway_utm_click_counts")) || [];
const lanes = (await callRpc("gateway_lane_counts")) || {};

console.log("Sina Gateway — UTM click readout");
console.log("Generated:", new Date().toISOString());
console.log("\nClicks by source + campaign:");
if (!clicks.length) {
  console.log("  (none yet)");
} else {
  for (const row of clicks) {
    console.log(`  ${row.utm_source} / ${row.utm_campaign}: ${row.clicks}`);
  }
}

console.log("\nLead captures by lane (all time):");
for (const [lane, count] of Object.entries(lanes).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${lane}: ${count}`);
}

console.log("\nNote: CTR = compare clicks above to leads with matching utm_campaign in Supabase.");
