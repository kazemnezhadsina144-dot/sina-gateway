/**
 * Register Telegram webhook for @GateWay_A_bot.
 * Run: PUBLIC_BASE_URL=https://... TELEGRAM_BOT_TOKEN=... npm run telegram:set-webhook
 */
import { loadSinaEnv } from "./load-sina-env.js";

loadSinaEnv([".env"]);

const token = process.env.TELEGRAM_BOT_TOKEN || "";
const baseUrl = (process.env.PUBLIC_BASE_URL || process.env.ALLOWED_ORIGINS?.split(",")[0] || "")
  .trim()
  .replace(/\/$/, "");
const secret = process.env.TELEGRAM_WEBHOOK_SECRET || "";

if (!token || !baseUrl) {
  console.error("Set TELEGRAM_BOT_TOKEN and PUBLIC_BASE_URL (or ALLOWED_ORIGINS).");
  process.exit(1);
}

const webhookUrl = `${baseUrl}/api/telegram/webhook`;
const body = { url: webhookUrl, allowed_updates: ["message"] };
if (secret) body.secret_token = secret;

const response = await fetch(`https://api.telegram.org/bot${token}/setWebhook`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

const result = await response.json();
if (!result.ok) {
  console.error("setWebhook failed:", JSON.stringify(result).slice(0, 400));
  process.exit(1);
}

console.log("Webhook set:", webhookUrl);
if (secret) console.log("Secret token configured.");
