/**
 * Weekly ops aggregate — funnel JSONL + channel receipts (+ optional Supabase lane counts).
 */
import { readFileSync, existsSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { loadSinaEnv } from "./load-sina-env.js";

loadSinaEnv([".env"]);

const root = join(fileURLToPath(new URL("..", import.meta.url)));
const funnelFile = join(root, "data", "funnel-events.jsonl");
const receiptsFile = join(root, "data", "channel-receipts.json");
const lastSignalFile = join(root, "data", "last-signal-at.json");

function loadJson(path, fallback) {
  if (!existsSync(path)) return fallback;
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return fallback;
  }
}

function loadFunnelEvents() {
  if (!existsSync(funnelFile)) return [];
  return readFileSync(funnelFile, "utf8")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

function loadServiceRole() {
  const path = join(homedir(), ".sourcea-secrets", "noetfield.env");
  if (!existsSync(path)) return "";
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (trimmed.startsWith("SUPABASE_SERVICE_ROLE_KEY=") || trimmed.startsWith("NOETFIELD_SUPABASE_SERVICE_ROLE_KEY=")) {
      return trimmed.slice(trimmed.indexOf("=") + 1).trim().replace(/^["']|["']$/g, "");
    }
  }
  return "";
}

async function supabaseLaneCounts() {
  const url = (process.env.SUPABASE_URL || "").replace(/\/$/, "");
  const anonKey =
    process.env.SUPABASE_ANON_KEY ||
    process.env.GATEWAY_SUPABASE_ANON_KEY ||
    "";
  if (url && anonKey) {
    const response = await fetch(`${url}/rest/v1/rpc/gateway_lane_counts`, {
      method: "POST",
      headers: {
        apikey: anonKey,
        authorization: `Bearer ${anonKey}`,
        "content-type": "application/json",
      },
      body: "{}",
    });
    if (response.ok) {
      try {
        return await response.json();
      } catch {
        // fall through to service role
      }
    }
  }

  const serviceKey = loadServiceRole();
  if (!url || !serviceKey) return null;

  const response = await fetch(`${url}/rest/v1/rpc/gateway_lane_counts`, {
    method: "POST",
    headers: {
      apikey: serviceKey,
      authorization: `Bearer ${serviceKey}`,
      "content-type": "application/json",
    },
    body: "{}",
  });

  if (!response.ok) return null;
  try {
    return await response.json();
  } catch {
    return null;
  }
}

async function supabaseLaneCountsFallback() {
  const url = (process.env.SUPABASE_URL || "").replace(/\/$/, "");
  const serviceKey = loadServiceRole();
  if (!url || !serviceKey) return null;

  const response = await fetch(
    `${url}/rest/v1/gateway_leads?select=venture_route&is_test=eq.false&limit=500`,
    {
      headers: {
        apikey: serviceKey,
        authorization: `Bearer ${serviceKey}`,
      },
    },
  );
  if (!response.ok) return null;
  const rows = await response.json();
  if (!Array.isArray(rows)) return null;
  const counts = {};
  for (const row of rows) {
    const lane = row.venture_route || "unknown";
    counts[lane] = (counts[lane] || 0) + 1;
  }
  return counts;
}

const events = loadFunnelEvents();
const receipts = loadJson(receiptsFile, {});
const lastSignal = loadJson(lastSignalFile, {});

const byType = {};
const routes = {};
for (const event of events) {
  byType[event.event] = (byType[event.event] || 0) + 1;
  if (event.event === "submit_success" && event.route) {
    routes[event.route] = (routes[event.route] || 0) + 1;
  }
}

const laneCounts = (await supabaseLaneCounts()) || (await supabaseLaneCountsFallback());

console.log("Sina Gateway — weekly ops readout");
console.log("Generated:", new Date().toISOString());
console.log("\nFunnel events:", events.length);
for (const [type, count] of Object.entries(byType).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${type}: ${count}`);
}

if (Object.keys(routes).length) {
  console.log("\nSubmit success by route (funnel, client-side):");
  for (const [route, count] of Object.entries(routes).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${route}: ${count}`);
  }
}

console.log("\nCommercial receipts:");
console.log(`  sent: ${receipts.sent || 0}`);
console.log(`  replies: ${receipts.replies || 0}`);
console.log(`  L2: ${receipts.L2_payments || 0}`);

if (lastSignal.at) {
  console.log(`\nLast signal (local): ${lastSignal.at} → ${lastSignal.route || "—"}`);
}

if (laneCounts && Object.keys(laneCounts).length) {
  console.log("\nLane counts (Supabase, no PII):");
  for (const [lane, count] of Object.entries(laneCounts).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${lane}: ${count}`);
  }
} else {
  console.log("\nLane counts: unavailable (service role or RPC not configured)");
}

console.log("\nPaste-ready Telegram summary:");
const topRoute = Object.entries(routes).sort((a, b) => b[1] - a[1])[0];
console.log(
  `Gateway week: funnel=${events.length} · submits=${byType.submit_success || 0} · outbound=${receipts.sent || 0} · top=${topRoute ? topRoute[0] : "—"}`,
);
