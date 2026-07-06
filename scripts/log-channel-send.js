import { readFileSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const args = process.argv.slice(2);
const countIndex = args.indexOf("--count");
const replyIndex = args.indexOf("--reply");
const l1Index = args.indexOf("--l1");
const l2Index = args.indexOf("--l2");

const count = countIndex >= 0 ? Number(args[countIndex + 1] || 1) : 1;
const replies = replyIndex >= 0 ? Number(args[replyIndex + 1] || 0) : 0;
const l1 = l1Index >= 0 ? Number(args[l1Index + 1] || 0) : 0;
const l2 = l2Index >= 0 ? Number(args[l2Index + 1] || 0) : 0;

const channelPath = "data/channel-receipts.json";
const d2Path = "data/founder-audit-d2-list.json";

const channel = JSON.parse(readFileSync(channelPath, "utf8"));
channel.sent = Number(channel.sent || 0) + count;
channel.replies = Number(channel.replies || 0) + replies;
channel.L1 = Number(channel.L1 || 0) + l1;
channel.L2_payments = Number(channel.L2_payments || 0) + l2;
channel.last_send_at = new Date().toISOString();

writeFileSync(channelPath, `${JSON.stringify(channel, null, 2)}\n`);

if (args.includes("--mark-sent")) {
  const d2 = JSON.parse(readFileSync(d2Path, "utf8"));
  let marked = 0;
  for (const row of d2.rows || []) {
    if (marked >= count) break;
    if (!row.sent && row.name) {
      row.sent = true;
      marked += 1;
    }
  }
  d2.list_ready = (d2.rows || []).filter((row) => row.name && Number(row.fit_score) >= 4).length;
  writeFileSync(d2Path, `${JSON.stringify(d2, null, 2)}\n`);
}

console.log(
  JSON.stringify(
    {
      sent: channel.sent,
      replies: channel.replies,
      L1: channel.L1,
      L2_payments: channel.L2_payments,
      last_send_at: channel.last_send_at,
    },
    null,
    2,
  ),
);

if (!args.includes("--no-sync")) {
  const sync = spawnSync("npm", ["run", "sync:heartbeat"], { encoding: "utf8", shell: false, cwd: process.cwd() });
  if (sync.status === 0) {
    console.log("Heartbeat vars synced to gateway-ops.");
  } else if (!args.includes("--quiet-sync")) {
    console.log("Note: run npm run sync:heartbeat after sends (needs wrangler + gateway-ops).");
  }
}
