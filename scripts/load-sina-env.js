import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const SINA_ENV_PATH = join(homedir(), ".sourcea-secrets", "sina-gateway.env");

/** Load env files in order; later files do not override already-set process.env keys. */
export function loadSinaEnv(extraPaths = []) {
  const paths = [SINA_ENV_PATH, join(process.cwd(), ".env"), ...extraPaths].filter(Boolean);
  for (const path of paths) {
    if (!existsSync(path)) continue;
    applyEnvFile(path);
  }
}

export function loadEnvFile(path) {
  if (!existsSync(path)) return {};
  return parseEnv(readFileSync(path, "utf8"));
}

export function sinaEnvPath() {
  return SINA_ENV_PATH;
}

function applyEnvFile(path) {
  for (const [key, value] of Object.entries(parseEnv(readFileSync(path, "utf8")))) {
    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

function parseEnv(text) {
  const result = {};
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const index = trimmed.indexOf("=");
    const key = trimmed.slice(0, index).trim();
    const value = trimmed.slice(index + 1).trim().replace(/^["']|["']$/g, "");
    if (key) result[key] = value;
  }
  return result;
}

/** Resolve Supabase capture vars from canonical aliases. */
export function resolveSupabaseEnv(env = process.env) {
  const url = (
    env.SUPABASE_URL ||
    env.GATEWAY_SUPABASE_URL ||
    env.NOETFIELD_SUPABASE_URL ||
    ""
  ).replace(/\/$/, "");
  const anonKey =
    env.SUPABASE_ANON_KEY ||
    env.GATEWAY_SUPABASE_ANON_KEY ||
    env.NOETFIELD_SUPABASE_ANON_KEY ||
    "";
  return { url, anonKey };
}
