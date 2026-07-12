import assert from "node:assert/strict";
import { buildLeadAlertMessage, contactMethodSummary, laneAlertHeadline, priorityLabel } from "../src/telegram-templates.js";
import { buildNotificationMessage } from "../src/notifications.js";

assert.equal(priorityLabel("high"), "🔴 HIGH");
assert.equal(priorityLabel("medium"), "🟡 NORMAL");
assert.equal(priorityLabel("low"), "🟢 LOW");

assert.match(laneAlertHeadline("FounderAudit"), /Founder Audit/);
assert.match(laneAlertHeadline("SourceA"), /SourceA/);

const contact = contactMethodSummary({
  email: "a@example.com",
  phone: "+1",
  preferred_contact: "email",
});
assert.match(contact, /email: a@example.com/);
assert.match(contact, /prefers: email/);

const lead = {
  name: "Test Founder",
  venture_route: "FounderAudit",
  email: "founder@example.com",
  priority_tag: "high",
  utm_campaign: "founder-audit",
  utm_content: "hero-a",
  route_rule_id: "founder_audit_utm",
  route_confidence: "high",
  route_reason: "Founder Audit campaign match",
};

const message = buildLeadAlertMessage(lead, "req-abcdef12");
assert.match(message, /Founder Audit signal/);
assert.match(message, /🔴 HIGH/);
assert.match(message, /campaign: founder-audit/);
assert.match(message, /content: hero-a/);
assert.match(message, /confidence: high/);
assert.match(message, /rule: founder_audit_utm/);
assert.match(message, /ref: REQ-ABCD/);

assert.equal(buildNotificationMessage(lead, "req-abcdef12"), message);

console.log("Telegram template tests passed.");
