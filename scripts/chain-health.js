const baseUrl = (process.env.CHAIN_HEALTH_BASE_URL || process.env.SMOKE_BASE_URL || "https://sina-gateway-production.up.railway.app").replace(
  /\/$/,
  "",
);

const checks = [
  { name: "health", path: "/health", expectOk: true },
  { name: "ready", path: "/ready", expectOk: true, deep: true },
  { name: "config", path: "/api/config", expectOk: true, expectCaptureMode: "supabase" },
];

const results = [];
let failed = false;

for (const check of checks) {
  const result = await runCheck(check);
  const row = { name: check.name, ...result };
  results.push(row);
  if (!row.ok) failed = true;
  console.log(`${row.ok ? "PASS" : "FAIL"} ${check.name}: ${row.detail}`);
}

let supabase = { ok: false, detail: "not run" };
try {
  const { spawnSync } = await import("node:child_process");
  const verify = spawnSync("npm", ["run", "verify:supabase"], {
    cwd: process.cwd(),
    encoding: "utf8",
    shell: false,
  });
  const output = `${verify.stdout || ""}${verify.stderr || ""}`;
  if (verify.status === 0) {
    supabase = { ok: true, detail: "INSERT OK + RLS denial" };
  } else if (output.includes("SKIPPED_SUPABASE_TABLE_MISSING")) {
    supabase = { ok: false, detail: "gateway_leads table missing" };
    failed = true;
  } else if (output.includes("SUPABASE_PROJECT_PAUSED_OR_UNREACHABLE")) {
    supabase = { ok: false, detail: "Supabase project paused or unreachable" };
    failed = true;
  } else if (output.includes("SKIPPED_ENV_MISSING")) {
    supabase = { ok: false, detail: "Supabase env missing locally" };
    failed = true;
  } else {
    supabase = { ok: false, detail: output.trim().split("\n").slice(-3).join(" | ") };
    failed = true;
  }
  console.log(`${supabase.ok ? "PASS" : "FAIL"} supabase-verify: ${supabase.detail}`);
} catch (error) {
  supabase = { ok: false, detail: error.message };
  failed = true;
  console.log(`FAIL supabase-verify: ${error.message}`);
}

console.log("\nChain health summary:");
for (const result of results) {
  console.log(`- ${result.name}: ${result.ok ? "PASS" : "FAIL"}`);
}
console.log(`- supabase-verify: ${supabase.ok ? "PASS" : "FAIL"}`);

if (failed) process.exit(1);
console.log("\nChain health passed.");

async function runCheck(check) {
  try {
    const response = await fetch(`${baseUrl}${check.path}`);
    if (response.status !== 200 && check.expectOk) {
      return { ok: false, detail: `HTTP ${response.status}` };
    }

    const body = await response.json();
    if (check.expectCaptureMode && body.captureMode !== check.expectCaptureMode) {
      return { ok: false, detail: `captureMode=${body.captureMode}` };
    }

    if (check.deep) {
      if (body.ok === false) return { ok: false, detail: body.supabaseTableError || "not ready" };
      if (body.supabaseTableReady === false) {
        return { ok: false, detail: body.supabaseTableError || "supabase table not ready" };
      }
      if (body.supabaseTableReady == null && body.supabaseConfigured) {
        return { ok: false, detail: "deploy /ready probe update — table readiness unknown" };
      }
      return { ok: true, detail: `captureMode=${body.captureMode}, table=${body.supabaseTableReady}` };
    }

    return { ok: true, detail: "ok" };
  } catch (error) {
    return { ok: false, detail: error.message };
  }
}
