import { readFileSync } from "node:fs";

const d2 = JSON.parse(readFileSync("data/founder-audit-d2-list.json", "utf8"));
const link =
  d2.gateway_link ||
  "https://sina-gateway-production.up.railway.app/?utm_campaign=founder-audit&utm_source=linkedin";

const args = process.argv.slice(2);
const idArg = args.indexOf("--id");
const rowId = idArg >= 0 ? Number(args[idArg + 1]) : null;
const all = args.includes("--all");

function firstName(name) {
  return String(name || "").trim().split(/\s+/)[0] || "there";
}

function messageFor(row) {
  const first = firstName(row.name);
  return `Hi ${first} —

You're building solo with AI, which usually means nobody checks your decisions, commitments, or whether the week actually moved.

I run a fixed Founder Audit for solo technical founders (pre-seed/seed): in 5 business days you get a written report on your decisions, follow-through, offer drift, and people pipeline — plus a personal ledger system installed (not a coaching call).

$500. Fixed scope. No discovery call.

Start here if it's useful: ${link}

— Sina`;
}

function readyRows() {
  return (d2.rows || []).filter(
    (row) =>
      String(row.name || "").trim() &&
      Number(row.fit_score) >= 4 &&
      String(row.why_now || "").trim() &&
      String(row.contact_path || "").trim(),
  );
}

function pickRows() {
  if (rowId) {
    const row = (d2.rows || []).find((r) => r.id === rowId);
    if (!row) {
      console.error(`No row id ${rowId}`);
      process.exit(1);
    }
    return [row];
  }
  if (all) return readyRows();
  const next = (d2.rows || []).find((row) => !row.sent && row.name && Number(row.fit_score) >= 4);
  return next ? [next] : [];
}

const rows = pickRows();
if (!rows.length) {
  console.log("No D3 messages to preview. Fill D2 rows (fit_score >= 4) in data/founder-audit-d2-list.json");
  process.exit(0);
}

for (const row of rows) {
  console.log(`\n--- Row ${row.id}: ${row.name} @ ${row.company_product} ---`);
  console.log(`Contact: ${row.contact_path}`);
  console.log(`Why now: ${row.why_now}`);
  console.log("--- Message ---\n");
  console.log(messageFor(row));
}

console.log(`\n${rows.length} message(s). After send: npm run channel:send -- --count 1 --mark-sent`);
