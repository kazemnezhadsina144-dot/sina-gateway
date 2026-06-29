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
  raw_notes: "Dry-run payload verification",
};

assert.equal(shouldNotifyLead(lead, ""), false);
assert.equal(shouldNotifyLead({ ...lead, priority_tag: "medium" }, "https://example.com/hook"), false);
assert.equal(shouldNotifyLead(lead, "https://example.com/hook"), true);

const payload = buildNotificationPayload(lead, "req_123");
assert.deepEqual(Object.keys(payload.lead).sort(), [
  "contact",
  "id",
  "identity",
  "intent",
  "name",
  "priority_tag",
  "raw_notes",
  "urgency",
  "value",
  "venture_route",
]);
assert.equal(payload.requestId, "req_123");
assert.equal(payload.lead.contact, "notify@example.com");
assert.equal(payload.lead.priority_tag, "high");

let sentBody = "";
const result = await notifyLead({
  lead,
  requestId: "req_456",
  webhookUrl: "https://example.com/hook",
  fetchImpl: async (_url, options) => {
    sentBody = options.body;
    return { ok: true, status: 200 };
  },
});

assert.equal(result.sent, true);
assert.equal(JSON.parse(sentBody).lead.name, "Notification Test");

const skipped = await notifyLead({
  lead: { ...lead, priority_tag: "medium" },
  requestId: "req_789",
  webhookUrl: "https://example.com/hook",
  fetchImpl: async () => {
    throw new Error("should not be called");
  },
});

assert.deepEqual(skipped, { sent: false, reason: "disabled_or_not_high_priority" });

console.log("Notification dry-run tests passed.");
