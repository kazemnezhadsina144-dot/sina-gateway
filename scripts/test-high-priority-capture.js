import { readFileSync } from "node:fs";

loadEnv(".env");

const baseUrl = (process.env.PRIVATE_TEST_BASE_URL || "https://sina-gateway-production.up.railway.app").replace(/\/$/, "");
const origin = process.env.PRIVATE_TEST_ORIGIN || baseUrl;
const telegramReady = Boolean(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_ALERT_CHAT_ID);

if (!telegramReady) {
  console.log("SKIPPED_TELEGRAM_MISSING: set TELEGRAM_BOT_TOKEN + TELEGRAM_ALERT_CHAT_ID for live notify test.");
  process.exit(0);
}

const payload = {
  identity: "client",
  intent: "hire",
  value: "project",
  urgency: "now",
  name: "[PRIVATE-TEST] High Priority Notify",
  contact: `notify-test+${Date.now()}@example.com`,
  raw_notes: "high priority notification capture test",
  consent_to_contact: true,
  source: "private-test",
};

const response = await fetch(`${baseUrl}/api/leads`, {
  method: "POST",
  headers: { "content-type": "application/json", origin },
  body: JSON.stringify(payload),
});

const body = await response.json();
if (!response.ok) {
  console.error("FAIL high-priority-capture:", response.status, body);
  process.exit(1);
}

if (body.lead?.priority_tag !== "high") {
  console.error("FAIL expected high priority_tag, got", body.lead?.priority_tag);
  process.exit(1);
}

console.log("PASS high-priority-capture:", body.requestId);
console.log("Check Telegram ops chat for alert.");

function loadEnv(path) {
  try {
    const text = readFileSync(path, "utf8");
    for (const line of text.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const index = trimmed.indexOf("=");
      if (index === -1) continue;
      const key = trimmed.slice(0, index).trim();
      if (!key || process.env[key] !== undefined) continue;
      process.env[key] = trimmed.slice(index + 1).trim().replace(/^["']|["']$/g, "");
    }
  } catch {
    // optional .env
  }
}
