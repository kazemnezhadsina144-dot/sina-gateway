import { readFileSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { loadEnvFile, loadSinaEnv, resolveSupabaseEnv } from "./load-sina-env.js";

const RAILWAY_KEYS = [
  "SUPABASE_URL",
  "SUPABASE_ANON_KEY",
  "TURNSTILE_SITE_KEY",
  "TURNSTILE_SECRET_KEY",
  "TELEGRAM_BOT_TOKEN",
  "TELEGRAM_ALERT_CHAT_ID",
  "CAPTURE_METADATA_ENABLED",
  "ALLOWED_ORIGINS",
];

const dot = loadEnvFile(".env");
const site = dot.TURNSTILE_SITE_KEY || dot.SITE_KEY || "";
const secret = dot.TURNSTILE_SECRET_KEY || dot.SECRET_KEY || "";

if (site && !dot.TURNSTILE_SITE_KEY) {
  let text = readFileSync(".env", "utf8");
  text = text.replace(/^TURNSTILE_SITE_KEY=.*$/m, `TURNSTILE_SITE_KEY=${site}`);
  if (!/^TURNSTILE_SITE_KEY=/m.test(text)) text += `\nTURNSTILE_SITE_KEY=${site}\n`;
  writeFileSync(".env", text);
}

loadSinaEnv();
const { url, anonKey } = resolveSupabaseEnv(process.env);

const push = {};
if (url) push.SUPABASE_URL = url;
if (anonKey) push.SUPABASE_ANON_KEY = anonKey;
if (site) push.TURNSTILE_SITE_KEY = site;
if (secret) push.TURNSTILE_SECRET_KEY = secret;

for (const key of RAILWAY_KEYS) {
  if (key.startsWith("SUPABASE") || key.startsWith("TURNSTILE")) continue;
  const value = process.env[key];
  if (value) push[key] = value;
}

if (!Object.keys(push).length) {
  console.error("Nothing to push. Fill .env or ~/.sourcea-secrets/sina-gateway.env");
  process.exit(1);
}

for (const [key, value] of Object.entries(push)) {
  const result = spawnSync("railway", ["variables", "--set", `${key}=${value}`], {
    encoding: "utf8",
    stdio: "pipe",
  });
  if (result.status !== 0) {
    console.error(`Failed ${key}:`, result.stderr || result.stdout);
    process.exit(result.status ?? 1);
  }
  console.log(`set ${key}`);
}

console.log("Railway env synced.");
