import assert from "node:assert/strict";
import { enrichLead, validateLead } from "../src/gateway.js";

const cases = [
  {
    name: "construction routes to BuildMatch",
    input: {
      identity: "construction",
      intent: "refer",
      value: "lead",
      urgency: "now",
      name: "Alex",
      contact: "alex@example.com",
    },
    expected: { venture_route: "BuildMatch", priority_tag: "high" },
  },
  {
    name: "builder routes to Forge",
    input: {
      identity: "builder",
      intent: "partner",
      value: "talent",
      urgency: "soon",
      name: "Mina",
      contact: "@mina",
    },
    expected: { venture_route: "Forge", lead_type: "collaborator", priority_tag: "high" },
  },
  {
    name: "client hiring routes to SourceA",
    input: {
      identity: "client",
      intent: "hire",
      value: "project",
      urgency: "exploring",
      name: "Jordan",
      contact: "604-000-0000",
    },
    expected: { venture_route: "SourceA", priority_tag: "high" },
  },
  {
    name: "trust intent routes to TrustField",
    input: {
      identity: "client",
      intent: "trust",
      value: "risk",
      urgency: "now",
      name: "Priya",
      contact: "priya@example.com",
    },
    expected: { venture_route: "TrustField", route_rule_id: "intent_trust", priority_tag: "high" },
  },
  {
    name: "friend routes personal",
    input: {
      identity: "friend",
      intent: "learn",
      value: "talent",
      urgency: "exploring",
      name: "Sam",
      contact: "sam@example.com",
    },
    expected: { venture_route: "Personal", priority_tag: "medium" },
  },
  {
    name: "founder-audit campaign routes to FounderAudit",
    input: {
      identity: "client",
      intent: "learn",
      value: "project",
      urgency: "exploring",
      name: "Riley",
      contact: "riley@example.com",
      utm_campaign: "founder-audit",
    },
    expected: { venture_route: "FounderAudit", route_rule_id: "campaign_founder_audit", priority_tag: "medium" },
  },
  {
    name: "solo founder notes route to FounderAudit",
    input: {
      identity: "client",
      intent: "learn",
      value: "project",
      urgency: "soon",
      name: "Casey",
      contact: "casey@example.com",
      raw_notes: "solo founder building an ai cofounder workflow",
    },
    expected: { venture_route: "FounderAudit", route_rule_id: "notes_founder_signal", priority_tag: "medium" },
  },
  {
    name: "high hire intent tags ACG Tier 1 pilot cohort",
    input: {
      identity: "client",
      intent: "hire",
      value: "project",
      urgency: "now",
      name: "Pilot Lead",
      contact: "pilot@example.com",
    },
    expected: { venture_route: "SourceA", priority_tag: "high", acg_tag: "source:acg_pilot_v1" },
  },
];

for (const testCase of cases) {
  const lead = enrichLead(testCase.input);
  assert.deepEqual(validateLead(lead), [], testCase.name);

  for (const [key, value] of Object.entries(testCase.expected)) {
    if (key === "acg_tag") {
      assert.ok(lead.tags.includes(value), `${testCase.name}: missing tag ${value}`);
      continue;
    }
    assert.equal(lead[key], value, `${testCase.name}: ${key}`);
  }
}

const invalid = enrichLead({
  identity: "unknown",
  intent: "learn",
  value: "talent",
  urgency: "exploring",
});
assert.ok(validateLead(invalid).length >= 2, "invalid lead should return validation errors");

console.log("Gateway routing and validation tests passed.");
