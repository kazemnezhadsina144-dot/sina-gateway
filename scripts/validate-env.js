import { readFileSync } from "node:fs";

const env = loadEnv(".env");
const issues = [];

if (!env.PORT) issues.push("PORT is not set; default 4173 will be used.");
if (!env.SUPABASE_URL) issues.push("SUPABASE_URL is missing; app will use local capture mode.");
if (!env.SUPABASE_ANON_KEY) issues.push("SUPABASE_ANON_KEY is missing; app will use local capture mode.");
if (env.SUPABASE_SERVICE_ROLE_KEY) issues.push("SECURITY: remove SUPABASE_SERVICE_ROLE_KEY from .env.");
if (env.SUPABASE_ANON_KEY && env.SUPABASE_ANON_KEY.split(".").length !== 3) {
  issues.push("SUPABASE_ANON_KEY does not look like a JWT.");
}
if (env.NODE_ENV === "production" && !env.ALLOWED_ORIGINS) {
  issues.push("Production should set ALLOWED_ORIGINS.");
}
if (env.NODE_ENV === "production" && !env.TURNSTILE_SECRET_KEY) {
  issues.push("Production should set TURNSTILE_SECRET_KEY.");
}
if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_ALERT_CHAT_ID) {
  issues.push("TELEGRAM_BOT_TOKEN or TELEGRAM_ALERT_CHAT_ID missing; high-priority Telegram alerts disabled.");
}

if (issues.length) {
  console.log("Environment review:");
  for (const issue of issues) console.log(`- ${issue}`);
  process.exit(0);
}

console.log("Environment looks launch-ready.");

function loadEnv(path) {
  try {
    const text = readFileSync(path, "utf8");
    const result = {};
    for (const line of text.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const index = trimmed.indexOf("=");
      if (index === -1) continue;
      result[trimmed.slice(0, index).trim()] = trimmed.slice(index + 1).trim().replace(/^["']|["']$/g, "");
    }
    return result;
  } catch {
    return {};
  }
}
