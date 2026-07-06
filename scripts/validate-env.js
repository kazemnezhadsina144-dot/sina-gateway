import { loadSinaEnv, loadEnvFile, resolveSupabaseEnv, sinaEnvPath } from "./load-sina-env.js";

loadSinaEnv([".env"]);

const env = { ...loadEnvFile(sinaEnvPath()), ...loadEnvFile(".env"), ...process.env };
const { url, anonKey } = resolveSupabaseEnv(env);
const issues = [];

if (!env.PORT) issues.push("PORT is not set; default 4173 will be used.");
if (!url) issues.push("SUPABASE_URL is missing; app will use local capture mode.");
if (!anonKey) issues.push("SUPABASE_ANON_KEY is missing; app will use local capture mode.");
if (env.SUPABASE_SERVICE_ROLE_KEY) issues.push("SECURITY: remove SUPABASE_SERVICE_ROLE_KEY from env.");
if (anonKey && anonKey.split(".").length !== 3) {
  issues.push("SUPABASE_ANON_KEY does not look like a JWT.");
}
if (env.NODE_ENV === "production" && !env.ALLOWED_ORIGINS) {
  issues.push("Production should set ALLOWED_ORIGINS.");
}
if (env.NODE_ENV === "production" && !env.TURNSTILE_SECRET_KEY) {
  issues.push("Production should set TURNSTILE_SECRET_KEY.");
}
const notifyReady =
  (env.NOTIFY_WEBHOOK_URL && env.NOTIFY_WEBHOOK_URL.trim()) ||
  (env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_ALERT_CHAT_ID);
if (!notifyReady) {
  issues.push(
    "High-priority alerts disabled: set TELEGRAM_BOT_TOKEN + TELEGRAM_ALERT_CHAT_ID (preferred) or NOTIFY_WEBHOOK_URL.",
  );
}

if (issues.length) {
  console.log("Environment review:");
  for (const issue of issues) console.log(`- ${issue}`);
  const blocking = issues.some((i) => i.startsWith("SECURITY:"));
  process.exit(blocking ? 1 : 0);
}

console.log("Environment looks launch-ready.");
