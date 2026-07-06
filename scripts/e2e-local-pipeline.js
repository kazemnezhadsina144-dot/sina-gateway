import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { enrichLead, routeCopy, validateLead } from "../src/gateway.js";
import { buildNotificationPayload, notifyLead } from "../src/notifications.js";

const tempDir = await mkdtemp(join(tmpdir(), "sina-gateway-e2e-"));
const leadFile = join(tempDir, "leads.json");

try {
  const input = {
    identity: "client",
    intent: "trust",
    value: "risk",
    urgency: "now",
    name: "E2E Pipeline Lead",
    contact: "e2e@example.com",
    company: "Gateway Test Co",
    role_title: "Founder",
    city: "Vancouver",
    preferred_contact: "email",
    consent_to_contact: true,
    raw_notes: "Need governance and risk clarity before private test traffic.",
    source: "e2e",
    page_path: "/",
    referrer: "",
    utm_source: "local",
    utm_medium: "test",
    utm_campaign: "pipeline",
    session_id: "session_e2e",
    visitor_id: "visitor_e2e",
  };

  const lead = {
    id: "lead_e2e",
    ...enrichLead(input),
    created_at: "2026-06-29T00:00:00.000Z",
  };

  assert.deepEqual(validateLead(lead), []);
  assert.equal(lead.venture_route, "TrustField");
  assert.equal(lead.secondary_route, "Noetfield");
  assert.equal(lead.route_rule_id, "intent_trust");
  assert.equal(lead.route_confidence, "high");
  assert.equal(lead.priority_tag, "high");
  assert.equal(lead.email, "e2e@example.com");
  assert.equal(lead.company, "Gateway Test Co");
  assert.ok(lead.tags.includes("route:TrustField"));
  assert.ok(lead.tags.includes("priority:high"));
  assert.ok(lead.tags.includes("risk_signal"));

  await writeFile(leadFile, JSON.stringify([lead], null, 2));
  const stored = JSON.parse(await readFile(leadFile, "utf8"));
  assert.equal(stored.length, 1);
  assert.equal(stored[0].id, "lead_e2e");
  assert.equal(stored[0].venture_route, "TrustField");

  const route = routeCopy(lead.venture_route);
  assert.equal(route.title, "TrustField");
  assert.match(route.promise, /Trust/);

  const notificationPayload = buildNotificationPayload(lead, "request_e2e");
  assert.equal(notificationPayload.lead.id, "lead_e2e");
  assert.equal(notificationPayload.lead.contact, "e2e@example.com");
  assert.equal(notificationPayload.lead.venture_route, "TrustField");

  let notificationSent = false;
  const telegramEnv = { TELEGRAM_BOT_TOKEN: "test-token", TELEGRAM_ALERT_CHAT_ID: "12345" };
  const notification = await notifyLead({
    lead,
    requestId: "request_e2e",
    telegram: telegramEnv,
    fetchImpl: async (_url, options) => {
      notificationSent = true;
      const body = JSON.parse(options.body);
      assert.match(body.text, /High-priority Sina Gateway lead/);
      assert.equal(body.chat_id, "12345");
      return { ok: true, json: async () => ({ ok: true, result: { message_id: 1 } }) };
    },
  });

  assert.equal(notificationSent, true);
  assert.equal(notification.sent, true);
  assert.equal(notification.channel, "telegram");

  const skippedNotification = await notifyLead({
    lead: { ...lead, priority_tag: "medium" },
    requestId: "request_e2e_skip",
    telegram: telegramEnv,
    fetchImpl: async () => {
      throw new Error("medium priority should not send");
    },
  });
  assert.deepEqual(skippedNotification, { sent: false, reason: "disabled_or_not_high_priority" });

  console.log("Local E2E pipeline passed.");
} finally {
  await rm(tempDir, { recursive: true, force: true });
}
