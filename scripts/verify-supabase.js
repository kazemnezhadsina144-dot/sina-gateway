import { loadSinaEnv, loadEnvFile, resolveSupabaseEnv, sinaEnvPath } from "./load-sina-env.js";

loadSinaEnv([".env"]);

const env = { ...loadEnvFile(sinaEnvPath()), ...loadEnvFile(".env"), ...process.env };
const { url, anonKey } = resolveSupabaseEnv(env);

if (!url || !anonKey) {
  console.error(`SKIPPED_ENV_MISSING: Missing Supabase vars. Set ${sinaEnvPath()} or .env`);
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
    headers: headers({ prefer: "return=minimal" }, anonKey),
    body: JSON.stringify(lead),
  });
} catch (error) {
  reportNetworkFailure({ url, error, phase: "insert" });
}

if (!insert.ok) {
  const detail = await insert.text();
  if (detail.includes("PGRST205") || detail.includes("Could not find the table")) {
    console.error("SKIPPED_SUPABASE_TABLE_MISSING: public.gateway_leads is not available through Supabase Data API.");
    console.error(detail);
    process.exit(1);
  }
  if (detail.includes("42501") || detail.includes("permission denied for table")) {
    console.error("SKIPPED_SUPABASE_GRANTS_MISSING: anon role cannot insert into gateway_leads.");
    console.error("Run supabase/migrations/20260706_anon_insert_grants.sql in the Supabase SQL editor, then retry.");
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
    headers: headers({}, anonKey),
  });
} catch (error) {
  reportNetworkFailure({ url, error, phase: "read" });
}
const body = await read.text();

if (!read.ok) {
  if (read.status === 401 || read.status === 403) {
    console.log(`READ DENIED BY RLS (${read.status})`);
    process.exit(0);
  }
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

function headers(extra = {}, key = anonKey) {
  return {
    apikey: key,
    authorization: `Bearer ${key}`,
    "content-type": "application/json",
    ...extra,
  };
}

function reportNetworkFailure({ url, error, phase }) {
  const code = error.cause?.code || error.code || "";
  const message = error.cause?.message || error.message || "unknown error";
  const host = projectHost(url);
  const projectRef = projectRefFromHost(host);
  const prefix = phase === "read" ? "READ CHECK " : "";

  if (code === "ENOTFOUND" || code === "EAI_AGAIN") {
    console.error(`${prefix}SUPABASE_PROJECT_PAUSED_OR_UNREACHABLE: Could not resolve Supabase host (${code}).`);
    if (host) console.error(`Host: ${host}`);
    if (projectRef) {
      console.error(`Dashboard: https://supabase.com/dashboard/project/${projectRef}`);
    }
    console.error("Free-tier projects pause after 7 days of inactivity. Open the dashboard and click Restore project.");
    console.error("After restore, wait 1-2 minutes, confirm schema.sql is applied, then rerun: npm run verify:supabase");
    process.exit(1);
  }

  console.error(`${prefix}SKIPPED_NETWORK_UNAVAILABLE: Could not reach Supabase (${code || message}).`);
  process.exit(1);
}

function projectHost(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return "";
  }
}

function projectRefFromHost(host) {
  const match = host.match(/^([a-z0-9]+)\.supabase\.co$/i);
  return match ? match[1] : "";
}
