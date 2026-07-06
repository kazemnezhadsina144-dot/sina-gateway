import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const d2 = JSON.parse(readFileSync("data/founder-audit-d2-list.json", "utf8"));
const channel = JSON.parse(readFileSync("data/channel-receipts.json", "utf8"));

const ready = (d2.rows || []).filter(
  (row) =>
    String(row.name || "").trim() &&
    String(row.company_product || "").trim() &&
    Number(row.fit_score) >= 4 &&
    String(row.why_now || "").trim() &&
    String(row.contact_path || "").trim(),
);

const unsentReady = ready.filter((row) => !row.sent);
const sentReady = ready.filter((row) => row.sent);

console.log("Founder Audit — Week 3 status\n");
console.log(`D2 list: ${ready.length}/25 ready · ${unsentReady.length} unsent`);
console.log(`Channel: ${channel.sent || 0} sent · ${channel.replies || 0} replies · L1 ${channel.L1 || 0} · L2 ${channel.L2_payments || 0}`);
console.log(`Gateway: ${d2.gateway_link || channel.gateway_link}`);

if (ready.length < 25) {
  console.log("\nNext: fill rows in data/founder-audit-d2-list.json (fit_score >= 4, all fields)");
  process.exit(0);
}

if (unsentReady.length) {
  console.log(`\nNext: npm run d3:preview — copy DM for row ${unsentReady[0].id} (${unsentReady[0].name})`);
  console.log("After send: npm run channel:send -- --count 1 --mark-sent");
  process.exit(0);
}

console.log("\nD2 batch logged. Run npm run sync:heartbeat if sends changed.");
const verify = spawnSync("npm", ["run", "validate:d2-list"], { encoding: "utf8", shell: false });
process.stdout.write(verify.stdout || "");
process.stderr.write(verify.stderr || "");
