import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL("..", import.meta.url)));
const funnelFile = join(root, "data", "funnel-events.jsonl");

if (!existsSync(funnelFile)) {
  console.log("No funnel events yet. File:", funnelFile);
  process.exit(0);
}

const lines = readFileSync(funnelFile, "utf8")
  .split("\n")
  .map((line) => line.trim())
  .filter(Boolean);

const events = lines.map((line) => JSON.parse(line));
const byType = {};
const stepViews = {};
const identities = {};
const industries = {};
const routes = {};

for (const event of events) {
  byType[event.event] = (byType[event.event] || 0) + 1;
  if (event.event === "step_view" && Number.isInteger(event.step)) {
    stepViews[event.step] = (stepViews[event.step] || 0) + 1;
  }
  if (event.event === "identity_select" && event.identity) {
    identities[event.identity] = (identities[event.identity] || 0) + 1;
  }
  if (event.event === "industry_select" && event.project_type) {
    industries[event.project_type] = (industries[event.project_type] || 0) + 1;
  }
  if (event.event === "submit_success" && event.route) {
    routes[event.route] = (routes[event.route] || 0) + 1;
  }
}

console.log("Sina Gateway funnel readout");
console.log("Events:", events.length);
console.log("\nBy type:");
for (const [type, count] of Object.entries(byType).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${type}: ${count}`);
}

console.log("\nStep views (drop-off hint):");
for (const step of [0, 1, 2, 3, 4]) {
  console.log(`  Step ${step}: ${stepViews[step] || 0}`);
}

if (Object.keys(identities).length) {
  console.log("\nIdentity selects:");
  for (const [identity, count] of Object.entries(identities)) {
    console.log(`  ${identity}: ${count}`);
  }
}

if (Object.keys(industries).length) {
  console.log("\nIndustry selects:");
  for (const [industry, count] of Object.entries(industries)) {
    console.log(`  ${industry}: ${count}`);
  }
}

if (Object.keys(routes).length) {
  console.log("\nSubmit success routes:");
  for (const [route, count] of Object.entries(routes)) {
    console.log(`  ${route}: ${count}`);
  }
}
