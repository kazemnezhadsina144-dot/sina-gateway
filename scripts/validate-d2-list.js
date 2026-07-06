import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const list = JSON.parse(readFileSync("data/founder-audit-d2-list.json", "utf8"));
const rows = list.rows || [];

assert.equal(rows.length, 25, "D2 list must have exactly 25 rows");

const ready = rows.filter(
  (row) =>
    String(row.name || "").trim() &&
    String(row.company_product || "").trim() &&
    Number(row.fit_score) >= 4 &&
    String(row.why_now || "").trim() &&
    String(row.contact_path || "").trim(),
);

const invalid = rows.filter((row) => {
  const score = Number(row.fit_score);
  return score > 0 && score < 4;
});

assert.equal(invalid.length, 0, `rows below fit_score 4: ${invalid.map((r) => r.id).join(", ")}`);

console.log(`D2 list: ${ready.length}/25 ready (fit_score >= 4 and fields complete)`);
if (ready.length < 25) {
  console.log("Founder action: fill remaining rows in data/founder-audit-d2-list.json");
  process.exit(0);
}

console.log("D2 list validation passed — 25 names ready for D3 sends.");
