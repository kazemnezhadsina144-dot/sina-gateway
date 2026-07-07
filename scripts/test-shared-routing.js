import assert from "node:assert/strict";
import { OPTIONS, ROUTING_RULE_DEFINITIONS, enrichLead, parseReferredBy, ruleMatches } from "../src/gateway.js";

for (const identity of OPTIONS.identity) {
  for (const intent of OPTIONS.intent) {
    for (const value of OPTIONS.value) {
      for (const urgency of OPTIONS.urgency) {
        const input = {
          identity,
          intent,
          value,
          urgency,
          name: "Shared Route Test",
          contact: "shared@example.com",
          raw_notes: "governance note",
        };
        const backend = enrichLead(input);
        const frontendRule = ROUTING_RULE_DEFINITIONS.find((candidate) => ruleMatches(candidate.match, input));

        assert.ok(frontendRule, "serializable rule should match");
        assert.equal(frontendRule.route, backend.venture_route, `${identity}/${intent}/${value}/${urgency}`);
        assert.equal(frontendRule.id, backend.route_rule_id, `${identity}/${intent}/${value}/${urgency}`);
      }
    }
  }
}

assert.equal(parseReferredBy("ref:abc12def"), "ABC12DEF");
assert.equal(parseReferredBy("https://example.com"), "");
const referred = enrichLead({
  identity: "client",
  intent: "hire",
  value: "project",
  urgency: "now",
  name: "Intro Test",
  contact: "intro@example.com",
  referrer: "ref:INTRO01",
  utm_campaign: "sourcea",
  utm_content: "hero-a",
  utm_term: "governed-ai",
});
assert.equal(referred.referred_by, "INTRO01");
assert.equal(referred.utm_content, "hero-a");
assert.equal(referred.utm_term, "governed-ai");

console.log("Shared routing tests passed.");
