import { loadSinaEnv, loadEnvFile, resolveSupabaseEnv, sinaEnvPath } from "./load-sina-env.js";

loadSinaEnv([".env"]);

const env = { ...loadEnvFile(sinaEnvPath()), ...loadEnvFile(".env"), ...process.env };
const { url, anonKey } = resolveSupabaseEnv(env);

if (!url || !anonKey) {
  console.error(`SKIPPED_ENV_MISSING: Missing Supabase vars. Set ${sinaEnvPath()} or .env`);
  process.exit(1);
}

const lead = {
  identity: "client",
  intent: "hire",
  value: "project",
  urgency: "now",
  name: "Migration Verify",
  contact: `migration-verify-${Date.now()}@example.com`,
  venture_route: "SourceA",
  lead_type: "client",
  priority_tag: "low",
  source: "migration-verify",
  raw_notes: "is_test column probe — safe to delete",
  is_test: true,
  app_version: "1.0.0",
  environment: "verify",
  capture_version: "v1",
  schema_version: "20260706",
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
    console.error("MIGRATION_MISSING: Run supabase/migrations/20260706_capture_metadata.sql in Supabase SQL Editor.");
    console.error(detail.slice(0, 300));
    process.exit(1);
  }
  console.error("INSERT FAILED:", detail.slice(0, 300));
  process.exit(1);
}

console.log("MIGRATION OK: is_test + capture metadata columns accept inserts.");
