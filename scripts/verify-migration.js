import { readFileSync } from "node:fs";

const env = loadEnv(".env");
const url = env.SUPABASE_URL?.replace(/\/$/, "");
const anonKey = env.SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  console.error("SKIPPED_ENV_MISSING: Missing SUPABASE_URL or SUPABASE_ANON_KEY in .env");
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

function loadEnv(path) {
  const text = readFileSync(path, "utf8");
  const result = {};
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const index = trimmed.indexOf("=");
    if (index === -1) continue;
    result[trimmed.slice(0, index).trim()] = trimmed.slice(index + 1).trim().replace(/^["']|["']$/g, "");
  }
  return result;
}
