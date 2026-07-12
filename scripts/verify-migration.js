import { loadSinaEnv, loadEnvFile, resolveSupabaseEnv, sinaEnvPath } from "./load-sina-env.js";

loadSinaEnv([".env"]);

const env = { ...loadEnvFile(sinaEnvPath()), ...loadEnvFile(".env"), ...process.env };
const { url, anonKey } = resolveSupabaseEnv(env);

if (!url || !anonKey) {
  console.error(`SKIPPED_ENV_MISSING: Missing Supabase vars. Set ${sinaEnvPath()} or .env`);
  process.exit(1);
}

const stamp = Date.now();
const lead = {
  identity: "client",
  intent: "hire",
  value: "project",
  urgency: "now",
  name: "Migration Verify",
  contact: `migration-verify-${stamp}@example.com`,
  venture_route: "SourceA",
  lead_type: "client",
  priority_tag: "low",
  source: "migration-verify",
  raw_notes: "phase 2 column probe — safe to delete",
  is_test: true,
  app_version: "1.0.0",
  environment: "verify",
  capture_version: "v1",
  schema_version: "20260707",
  referred_by: "INTRO01",
  utm_source: "verify",
  utm_medium: "script",
  utm_campaign: "sourcea",
  utm_content: "hero-a",
  utm_term: "governed-ai",
};

const response = await fetch(`${url}/rest/v1/gateway_leads`, {
  method: "POST",
  headers: {
    apikey: anonKey,
    authorization: `Bearer ${anonKey}`,
    "content-type": "application/json",
    prefer: "return=minimal",
  },
  body: JSON.stringify(lead),
});

if (!response.ok) {
  const detail = await response.text();
  if (detail.includes("is_test") || detail.includes("PGRST204") || detail.includes("column")) {
    console.error("MIGRATION_MISSING: Run supabase/migrations in order, latest 20260707_referrer_utm.sql");
    console.error("  npm run apply:supabase-migration");
    console.error(detail.slice(0, 300));
    process.exit(1);
  }
  console.error("INSERT FAILED:", detail.slice(0, 300));
  process.exit(1);
}

console.log("MIGRATION OK: capture metadata + referred_by + utm_content/utm_term columns accept inserts.");
