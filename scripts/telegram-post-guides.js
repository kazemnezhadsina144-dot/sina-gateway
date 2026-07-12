/**
 * Post Telegram channel guides (#85 submit signal, #86 lanes).
 * Run: npm run telegram:post-guides
 */
import { readFileSync } from "node:fs";
import { loadSinaEnv } from "./load-sina-env.js";

loadSinaEnv([".env"]);

const token = process.env.TELEGRAM_BOT_TOKEN || "";
const channelId = process.env.TELEGRAM_CHANNEL_ID || "-1004473252322";

if (!token) {
  console.error("SKIP: set TELEGRAM_BOT_TOKEN");
  process.exit(1);
}

function mdToTelegramHtml(text) {
  return text
    .replace(/^# .+\n\n?/m, "")
    .trim()
    .replace(/\*\*/g, "")
    .replace(/\|[-| ]+\|/g, "")
    .replace(/\|/g, " · ")
    .replace(/^- /gm, "• ")
    .replace(/\n\n/g, "\n")
    .slice(0, 3800);
}

async function post(title, path) {
  const body = readFileSync(path, "utf8");
  const text = `<b>${title}</b>\n\n${mdToTelegramHtml(body)}`;
  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: channelId,
      text,
      parse_mode: "HTML",
      disable_web_page_preview: false,
    }),
  });
  const result = await response.json();
  if (!result.ok) {
    console.error(`Failed ${path}:`, JSON.stringify(result).slice(0, 200));
    process.exit(1);
  }
  console.log(`Posted ${path} (message_id ${result.result.message_id})`);
}

await post("How to submit a signal", "docs/TELEGRAM_SUBMIT_SIGNAL_v1.md");
await post("What each lane does", "docs/TELEGRAM_LANES_GUIDE_v1.md");
console.log("DONE — check @Gateway_A for guide posts.");
