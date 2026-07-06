/**
 * Founder cleanup — deletes test rows from gateway_leads.
 * Uses service role from ~/.sourcea-secrets/noetfield.env (same Supabase project).
 * Never commit service_role keys. Run: npm run cleanup:private-test -- --execute
 */
import { readFileSync, existsSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { loadSinaEnv } from "./load-sina-env.js";

loadSinaEnv([".env"]);

const execute = process.argv.includes("--execute");
const founderEnv = join(homedir(), ".sourcea-secrets", "noetfield.env");

function loadFounderServiceRole() {
  if (!existsSync(founderEnv)) {
    return null;
  }
  const text = readFileSync(founderEnv, "utf8");
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    if (trimmed.startsWith("SUPABASE_SERVICE_ROLE_KEY=") || trimmed.startsWith("NOETFIELD_SUPABASE_SERVICE_ROLE_KEY=")) {
      return trimmed.slice(trimmed.indexOf("=") + 1).trim().replace(/^["']|["']$/g, "");
    }
  }
  return null;
}

const url = (process.env.SUPABASE_URL || "").replace(/\/$/, "");
const serviceKey = loadFounderServiceRole();

if (!url || !serviceKey) {
  console.error("SKIP: need SUPABASE_URL and service role in ~/.sourcea-secrets/noetfield.env");
  process.exit(1);
}

const filters = [
  "is_test=eq.true",
  "source=eq.private-test",
  "source=eq.test",
  "name=like.[PRIVATE-TEST]*",
  "contact=like.private-test*@example.com",
  "contact=like.verify-*@example.com",
  "contact=like.chain-*@example.com",
  "contact=like.notify-test*@example.com",
];

const headers = {
  apikey: serviceKey,
  Authorization: `Bearer ${serviceKey}`,
};

const seen = new Map();

for (const filter of filters) {
  const listRes = await fetch(
    `${url}/rest/v1/gateway_leads?${filter}&select=id,created_at,name,contact,source,venture_route&order=created_at.desc`,
    { headers },
  );
  if (!listRes.ok) {
    console.error(`LIST FAILED (${filter}):`, listRes.status, (await listRes.text()).slice(0, 200));
    continue;
  }
  for (const row of await listRes.json()) {
    seen.set(row.id, row);
  }
}

const rows = [...seen.values()];
console.log(`Found ${rows.length} test row(s).`);
for (const row of rows.slice(0, 20)) {
  console.log(`  ${row.created_at} · ${row.name} · ${row.contact} · ${row.venture_route}`);
}
if (rows.length > 20) console.log(`  … and ${rows.length - 20} more`);

if (!execute) {
  console.log("\nDry run only. Re-run with --execute to delete.");
  process.exit(0);
}

if (rows.length === 0) {
  console.log("Nothing to delete.");
  process.exit(0);
}

let deleted = 0;
for (const filter of filters) {
  const delRes = await fetch(`${url}/rest/v1/gateway_leads?${filter}`, {
    method: "DELETE",
    headers: { ...headers, Prefer: "return=minimal" },
  });
  if (!delRes.ok) {
    console.error(`DELETE FAILED (${filter}):`, delRes.status, (await delRes.text()).slice(0, 200));
    continue;
  }
  deleted += 1;
}

console.log(`Delete passes completed (${deleted}/${filters.length} filters OK).`);
