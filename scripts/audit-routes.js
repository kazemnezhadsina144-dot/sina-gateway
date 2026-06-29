import { OPTIONS, ROUTES, enrichLead, validateLead } from "../src/gateway.js";

const counts = {};
const issues = [];

for (const identity of OPTIONS.identity) {
  for (const intent of OPTIONS.intent) {
    for (const value of OPTIONS.value) {
      for (const urgency of OPTIONS.urgency) {
        const lead = enrichLead({
          identity,
          intent,
          value,
          urgency,
          name: "Audit Lead",
          contact: "audit@example.com",
        });
        const errors = validateLead(lead);

        if (errors.length) {
          issues.push({ identity, intent, value, urgency, errors });
        }
        if (!ROUTES[lead.venture_route]) {
          issues.push({ identity, intent, value, urgency, errors: [`unknown route ${lead.venture_route}`] });
        }
        if (!["high", "medium", "low"].includes(lead.route_confidence)) {
          issues.push({ identity, intent, value, urgency, errors: [`invalid confidence ${lead.route_confidence}`] });
        }

        counts[lead.venture_route] = (counts[lead.venture_route] || 0) + 1;
      }
    }
  }
}

console.log("Route distribution:");
for (const route of Object.keys(ROUTES)) {
  console.log(`- ${route}: ${counts[route] || 0}`);
}

if (issues.length) {
  console.error(JSON.stringify(issues, null, 2));
  process.exit(1);
}

console.log("Route audit passed.");
