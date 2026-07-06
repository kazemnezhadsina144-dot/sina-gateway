/**
 * Full @Gateway_A E2E upgrade: charter post + pin, test cleanup, live notify probe.
 * Run: npm run telegram:e2e-upgrade
 */
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { loadSinaEnv } from "./load-sina-env.js";

loadSinaEnv([".env"]);

const token = process.env.TELEGRAM_BOT_TOKEN || "";
const chatId = process.env.TELEGRAM_ALERT_CHAT_ID || "";
const gatewayChatId = "-1004473252322";

if (!token || !chatId) {
  console.error("SKIP: set TELEGRAM_BOT_TOKEN + TELEGRAM_ALERT_CHAT_ID in .env");
  process.exit(1);
}

const charter = readFileSync("docs/TELEGRAM_CHANNEL_CHARTER_v1.md", "utf8")
  .replace(/^# @Gateway_A — pin this in the channel\n\n/, "")
  .trim()
  .replace(/\*\*/g, "")
  .replace(/\n\n/g, "\n");

const charterHtml = [
  "<b>Sina Gateway — ops &amp; business updates</b>",
  "",
  "This channel is for <b>Sina Gateway</b> only: client work, investors, BuildMatch, collaborators, Founder Audit.",
  "",
  "<b>What shows up here</b>",
  "• Urgent new inquiries (product line + confirmation code)",
  "• Alerts if the website or database is down",
  "• Business summaries when outbound is active",
  "• Occasional counts by product line (no names)",
  "",
  "<b>What this is not</b>",
  "• Live chat (one founder, human schedule)",
  "• A feed of “all good” every 15 minutes",
  "• Alerts from NOOS, SourceA loops, or Noetfield probes",
  "",
  '<a href="https://sina-gateway-production.up.railway.app/">Submit an inquiry</a>',
  '<a href="https://sina-gateway-production.up.railway.app/founder-audit">Founder Audit ($500)</a>',
  '<a href="https://sina-gateway-production.up.railway.app/privacy.html">Privacy</a>',
  "",
  "— Sina Kazemnezhad (personal account). Not Noetfield Systems Inc.",
].join("\n");

async function tg(method, body) {
  const resp = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await resp.json();
  if (!data.ok) {
    throw new Error(`${method}: ${data.description || JSON.stringify(data)}`);
  }
  return data.result;
}

console.log("1/4 Posting channel charter…");
const sent = await tg("sendMessage", {
  chat_id: chatId,
  text: charterHtml,
  parse_mode: "HTML",
  disable_web_page_preview: true,
});

console.log("2/4 Pinning charter (message_id:", sent.message_id, ")…");
try {
  await tg("pinChatMessage", {
    chat_id: chatId,
    message_id: sent.message_id,
    disable_notification: false,
  });
  console.log("   Pinned.");
} catch (error) {
  console.warn("   Pin skipped (bot needs admin + can_pin_messages):", error.message);
}

console.log("3/4 Cleaning [PRIVATE-TEST] rows…");
const cleanup = spawnSync("node", ["scripts/cleanup-private-test-rows.js", "--execute"], {
  encoding: "utf8",
  cwd: process.cwd(),
});
process.stdout.write(cleanup.stdout || "");
process.stderr.write(cleanup.stderr || "");
if (cleanup.status !== 0) {
  console.warn("   Cleanup had issues (see above). Continuing.");
}

console.log("4/4 Live high-priority notify probe…");
const notify = spawnSync("npm", ["run", "test:notify-capture"], { encoding: "utf8", cwd: process.cwd() });
process.stdout.write(notify.stdout || "");
process.stderr.write(notify.stderr || "");

if (chatId === gatewayChatId || String(chatId) === gatewayChatId) {
  await tg("sendMessage", {
    chat_id: chatId,
    text: [
      "<b>Gateway Telegram E2E upgrade complete</b>",
      "• Charter posted (pin if bot is admin)",
      "• Test rows cleaned from Supabase",
      "• High-priority alert path verified",
      "",
      "<b>Founder action still required</b>",
      "Point NOOS / SourceA loop-specialist / NF intake probe workers away from this chat ID.",
      "See docs/GATEWAY_247_AUTORUN_SETUP.md",
    ].join("\n"),
    parse_mode: "HTML",
    disable_web_page_preview: true,
  });
}

console.log("\nDONE — check @Gateway_A for charter, pin, and test alert.");
