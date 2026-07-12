import assert from "node:assert/strict";
import { buildNotificationPayload, notifyLead, shouldNotifyLead } from "../src/notifications.js";

const lead = {
  id: "lead_123",
  name: "Notification Test",
  contact: "notify@example.com",
  identity: "client",
  intent: "hire",
  value: "project",
  urgency: "now",
  venture_route: "SourceA",
  priority_tag: "high",
  route_confidence: "high",
  route_rule_id: "client_hire",
  utm_campaign: "sourcea",
  email: "notify@example.com",
  preferred_contact: "email",
  raw_notes: "Dry-run payload verification",
};

const telegramEnv = {
  TELEGRAM_BOT_TOKEN: "test-token",
  TELEGRAM_ALERT_CHAT_ID: "12345",
};

assert.equal(shouldNotifyLead(lead, {}), false);
assert.equal(shouldNotifyLead({ ...lead, priority_tag: "medium" }, telegramEnv), false);
assert.equal(shouldNotifyLead(lead, telegramEnv), true);

const payload = buildNotificationPayload(lead, "req_123");
assert.equal(payload.requestId, "req_123");
assert.equal(payload.lead.contact, "notify@example.com");

let sentBody = "";
const result = await notifyLead({
  lead,
  requestId: "req_456",
  telegram: telegramEnv,
  fetchImpl: async (_url, options) => {
    sentBody = options.body;
    return { ok: true, json: async () => ({ ok: true, result: { message_id: 99 } }) };
  },
});

assert.equal(result.sent, true);
assert.equal(result.channel, "telegram");
const parsed = JSON.parse(sentBody);
assert.equal(parsed.chat_id, "12345");
assert.match(parsed.text, /SourceA client signal/);
assert.match(parsed.text, /🔴 HIGH/);
assert.match(parsed.text, /confidence: high/);

const skipped = await notifyLead({
  lead: { ...lead, priority_tag: "medium" },
  requestId: "req_789",
  telegram: telegramEnv,
  fetchImpl: async () => {
    throw new Error("should not be called");
  },
});

assert.deepEqual(skipped, { sent: false, reason: "disabled_or_not_high_priority" });

console.log("Notification dry-run tests passed.");
