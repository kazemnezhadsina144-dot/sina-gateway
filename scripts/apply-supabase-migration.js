/**
 * Apply pending Supabase SQL migrations using postgres credentials from
 * ~/.sourcea-secrets/noetfield-db.env (same Supabase project as gateway).
 *
 * Run: npm run apply:supabase-migration
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import pg from "pg";
import { loadSinaEnv, resolveSupabaseEnv } from "./load-sina-env.js";

loadSinaEnv([".env"]);

const migrationsDir = join(process.cwd(), "supabase", "migrations");
const dbEnvPath = join(homedir(), ".sourcea-secrets", "noetfield-db.env");

function loadEnvFile(path) {
  const out = {};
  if (!existsSync(path)) return out;
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const index = trimmed.indexOf("=");
    const key = trimmed.slice(0, index).trim();
    const value = trimmed.slice(index + 1).trim().replace(/^["']|["']$/g, "");
    if (key) out[key] = value;
  }
  return out;
}

function resolveDatabaseUrl() {
  const dbEnv = loadEnvFile(dbEnvPath);
  if (dbEnv.NOETFIELD_SUPABASE_DATABASE_URL) {
    return dbEnv.NOETFIELD_SUPABASE_DATABASE_URL;
  }
  const { url } = resolveSupabaseEnv(process.env);
  const password = dbEnv.SUPABASE_DB_PASSWORD;
  const ref = url.match(/https:\/\/([^.]+)\.supabase\.co/i)?.[1];
  if (!password || !ref) return "";
  return `postgresql://postgres.${ref}:${encodeURIComponent(password)}@aws-0-us-west-1.pooler.supabase.com:6543/postgres`;
}

const target = process.argv[2] || "20260707_referrer_utm.sql";
const migrationPath = join(migrationsDir, target);

if (!existsSync(migrationPath)) {
  console.error(`Migration not found: ${migrationPath}`);
  console.error("Available:", readdirSync(migrationsDir).sort().join(", "));
  process.exit(1);
}

const databaseUrl = resolveDatabaseUrl();
if (!databaseUrl) {
  console.error("SKIP: set NOETFIELD_SUPABASE_DATABASE_URL or SUPABASE_DB_PASSWORD in ~/.sourcea-secrets/noetfield-db.env");
  process.exit(1);
}

const sql = readFileSync(migrationPath, "utf8");
const client = new pg.Client({ connectionString: databaseUrl, ssl: { rejectUnauthorized: false } });

try {
  await client.connect();
  await client.query(sql);
  console.log(`APPLIED: ${target}`);
} catch (error) {
  console.error(`MIGRATION FAILED: ${error.message}`);
  process.exit(1);
} finally {
  await client.end();
}
