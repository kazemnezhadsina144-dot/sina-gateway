import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { enrichLead } from "../src/gateway.js";

const schema = readFileSync("supabase/schema.sql", "utf8");
const tableMatch = schema.match(/create table if not exists public\.gateway_leads \(([\s\S]*?)\n\);/);
assert.ok(tableMatch, "gateway_leads table definition must exist");

const columns = new Set(
  tableMatch[1]
    .split("\n")
    .map((line) => line.trim().replace(/,$/, ""))
    .filter(Boolean)
    .map((line) => line.split(/\s+/)[0])
    .filter((name) => !["constraint", "primary", "foreign", "check"].includes(name.toLowerCase())),
);

const lead = {
  id: "schema_drift",
  ...enrichLead({
    identity: "client",
    intent: "trust",
    value: "risk",
    urgency: "now",
    name: "Schema Drift",
    contact: "schema@example.com",
    company: "Schema Co",
    role_title: "Founder",
    city: "Vancouver",
    timezone: "America/Vancouver",
    raw_notes: "risk and governance",
    session_id: "session_schema",
    visitor_id: "visitor_schema",
  }),
  created_at: "2026-06-30T00:00:00.000Z",
};

const nullableFields = ["next_action_at", "last_contacted_at", "archived_at", "duplicate_of"];
for (const field of nullableFields) {
  if (lead[field] === "") lead[field] = null;
}
if (!lead.submission_id) lead.submission_id = lead.id;

const allowedNonDbFields = new Set(["turnstileToken", "website"]);
const missing = Object.keys(lead).filter((key) => !columns.has(key) && !allowedNonDbFields.has(key));

assert.deepEqual(missing, [], `schema missing columns: ${missing.join(", ")}`);
console.log("Schema drift check passed.");
