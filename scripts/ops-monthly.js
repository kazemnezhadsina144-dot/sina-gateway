/**
 * Monthly aggregate readout — lane counts, funnel, receipts (no PII).
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
  const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
  return readFileSync(funnelFile, "utf8")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line))
    .filter((event) => {
      const ts = Date.parse(event.timestamp || "");
      return Number.isFinite(ts) && ts >= cutoff;
    });
}

async function laneCounts() {
  const url = (process.env.SUPABASE_URL || "").replace(/\/$/, "");
  const anonKey = process.env.SUPABASE_ANON_KEY || "";
  if (!url || !anonKey) return null;
  const response = await fetch(`${url}/rest/v1/rpc/gateway_lane_counts`, {
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

async function lastSignal() {
  const url = (process.env.SUPABASE_URL || "").replace(/\/$/, "");
  const anonKey = process.env.SUPABASE_ANON_KEY || "";
  if (!url || !anonKey) return null;
  const response = await fetch(`${url}/rest/v1/rpc/gateway_last_signal`, {
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

const events = loadFunnelEvents();
const receipts = loadJson(receiptsFile, {});
const lanes = (await laneCounts()) || {};
const signal = (await lastSignal()) || {};

const byType = {};
for (const event of events) {
  byType[event.event] = (byType[event.event] || 0) + 1;
}

console.log("Sina Gateway — monthly aggregate (30 days)");
console.log("Generated:", new Date().toISOString());
console.log("\nFunnel events (30d):", events.length);
for (const [type, count] of Object.entries(byType).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${type}: ${count}`);
}

console.log("\nLane totals (all time, Supabase):");
for (const [lane, count] of Object.entries(lanes).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${lane}: ${count}`);
}

console.log("\nCommercial (cumulative receipts):");
console.log(`  sent: ${receipts.sent || 0} · replies: ${receipts.replies || 0} · L2: ${receipts.L2_payments || 0}`);

if (signal.at) {
  console.log(`\nLast signal: ${signal.at} → ${signal.route || "—"}`);
}

console.log("\nTelegram paste:");
console.log(
  `Gateway month: funnel_30d=${events.length} · submits=${byType.submit_success || 0} · lanes=${Object.keys(lanes).length} · outbound=${receipts.sent || 0}`,
);
