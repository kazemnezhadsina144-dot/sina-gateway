import { readFileSync } from "node:fs";

const env = loadEnv(".env");
const url = env.SUPABASE_URL?.replace(/\/$/, "");
const anonKey = env.SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  console.error("SKIPPED_ENV_MISSING: Missing SUPABASE_URL or SUPABASE_ANON_KEY in .env");
  process.exit(1);
}

const uniqueContact = `verify-${Date.now()}@example.com`;
const lead = {
  identity: "client",
  intent: "hire",
  value: "project",
  urgency: "now",
  name: "Supabase Verify",
  contact: uniqueContact,
  venture_route: "SourceA",
  lead_type: "client",
  priority_tag: "high",
  source: "verification",
  raw_notes: "Automated anon insert and read-denial verification",
};

let insert;
try {
  insert = await fetch(`${url}/rest/v1/gateway_leads`, {
    method: "POST",
    headers: headers({ prefer: "return=minimal" }),
    body: JSON.stringify(lead),
  });
} catch (error) {
  console.error(`SKIPPED_NETWORK_UNAVAILABLE: Could not reach Supabase (${error.cause?.code || error.code || error.message}).`);
  process.exit(1);
}

if (!insert.ok) {
  const detail = await insert.text();
  if (detail.includes("PGRST205") || detail.includes("Could not find the table")) {
    console.error("SKIPPED_SUPABASE_TABLE_MISSING: public.gateway_leads is not available through Supabase Data API.");
    console.error(detail);
    process.exit(1);
  }
  console.error("INSERT FAILED");
  console.error(detail);
  process.exit(1);
}

console.log("INSERT OK");

let read;
try {
  read = await fetch(`${url}/rest/v1/gateway_leads?contact=eq.${encodeURIComponent(uniqueContact)}&select=id,contact`, {
    headers: headers(),
  });
} catch (error) {
  console.error(`READ CHECK SKIPPED_NETWORK_UNAVAILABLE: Could not reach Supabase (${error.cause?.code || error.code || error.message}).`);
  process.exit(1);
}
const body = await read.text();

if (!read.ok) {
  console.log(`READ BLOCKED (${read.status})`);
  process.exit(0);
}

let rows = [];
try {
  rows = JSON.parse(body);
} catch {
  console.error("READ CHECK RETURNED NON-JSON");
  console.error(body);
  process.exit(1);
}

if (Array.isArray(rows) && rows.length === 0) {
  console.log("READ DENIED BY RLS (0 rows visible to anon)");
  process.exit(0);
}

console.error("READ SECURITY FAILURE: anon key can see lead rows.");
console.error(body);
process.exit(1);

function headers(extra = {}) {
  return {
    apikey: anonKey,
    authorization: `Bearer ${anonKey}`,
    "content-type": "application/json",
    ...extra,
  };
}

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
