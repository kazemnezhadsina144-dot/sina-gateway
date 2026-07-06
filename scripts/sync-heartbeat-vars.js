import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const printOnly = process.argv.includes("--print-only");
const channel = JSON.parse(readFileSync("data/channel-receipts.json", "utf8"));

const vars = {
  OFFERS_SENT: String(channel.sent || 0),
  REPLIES: String(channel.replies || 0),
  L2_RECEIPTS: String(channel.L2_payments || 0),
};

console.log("Heartbeat commercial vars from channel-receipts.json:");
console.log(JSON.stringify(vars, null, 2));

if (printOnly) {
  console.log("\nTo apply to Cloudflare gateway-heartbeat worker:");
  for (const [key, value] of Object.entries(vars)) {
    console.log(`  wrangler variable set ${key} --stdin --service gateway-heartbeat  # value: ${value}`);
  }
  process.exit(0);
}

for (const [key, value] of Object.entries(vars)) {
  const result = spawnSync("wrangler", ["variable", "set", key, "--stdin", "--cwd", "workers/gateway-heartbeat"], {
    input: value,
    encoding: "utf8",
    shell: false,
  });
  if (result.status !== 0) {
    console.error(`Failed to set ${key}:`, result.stderr || result.stdout);
    process.exit(1);
  }
  console.log(`set ${key}=${value}`);
}

console.log("Heartbeat worker vars synced.");
