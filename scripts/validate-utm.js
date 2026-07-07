import { readFileSync } from "node:fs";

const ALLOWED_CAMPAIGNS = ["founder-audit", "sourcea", "buildmatch", "noetfield", "forge"];
const ALLOWED_SOURCES = ["linkedin", "landing", "intro", "telegram", "private-test-runbook"];

const samples = [
  { utm_campaign: "founder-audit", utm_source: "linkedin", utm_medium: "dm" },
  { utm_campaign: "sourcea", utm_source: "linkedin", utm_medium: "post" },
  { utm_campaign: "buildmatch", utm_source: "landing", utm_medium: "referral" },
];

let failed = 0;

for (const sample of samples) {
  if (!ALLOWED_CAMPAIGNS.includes(sample.utm_campaign)) {
    console.error(`FAIL: unknown campaign ${sample.utm_campaign}`);
    failed += 1;
  }
}

const taxonomy = readFileSync("docs/WEDGE_LOCKED_v1.md", "utf8");
if (!taxonomy.includes("founder-audit")) {
  console.error("FAIL: WEDGE_LOCKED_v1.md missing founder-audit wedge");
  failed += 1;
}

if (failed) process.exit(1);

console.log("UTM taxonomy OK:");
console.log(`- campaigns: ${ALLOWED_CAMPAIGNS.join(", ")}`);
console.log(`- sources (examples): ${ALLOWED_SOURCES.join(", ")}`);
console.log(`- samples validated: ${samples.length}`);
