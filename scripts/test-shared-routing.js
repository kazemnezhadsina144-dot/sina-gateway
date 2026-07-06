import assert from "node:assert/strict";
import { OPTIONS, ROUTING_RULE_DEFINITIONS, enrichLead, ruleMatches } from "../src/gateway.js";

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

console.log("Shared routing tests passed.");
