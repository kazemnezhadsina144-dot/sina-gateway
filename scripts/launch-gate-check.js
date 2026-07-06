import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";

const baseUrl = (process.env.CHAIN_HEALTH_BASE_URL || "https://sina-gateway-production.up.railway.app").replace(
  /\/$/,
  "",
);

const checks = [];

async function main() {
  checks.push(await httpCheck("health", `${baseUrl}/health`, (b) => b.ok === true));
  checks.push(await httpCheck("ready", `${baseUrl}/ready`, (b) => b.ok && b.supabaseTableReady));
  checks.push(await httpCheck("turnstile", `${baseUrl}/ready`, (b) => b.turnstileConfigured === true));
  checks.push(await httpCheck("notifications", `${baseUrl}/ready`, (b) => b.notificationsConfigured === true));
  checks.push(run("monitors:verify"));
  checks.push(run("verify:supabase"));
  checks.push(run("verify:migration"));
  checks.push(run("private-test"));
  checks.push(d2ListCheck());
  checks.push(fileCheck("noindex", "public/index.html", (t) => /noindex/i.test(t)));
  checks.push(fileCheck("robots-block", "public/robots.txt", (t) => /Disallow:\s*\//i.test(t)));
  checks.push(fileCheck("privacy-page", "public/privacy.html", (t) => t.includes("Privacy")));

  const failed = checks.filter((c) => c.status === "FAIL");
  const founder = checks.filter((c) => c.status === "FOUNDER");
  const passed = checks.filter((c) => c.status === "PASS");

  console.log("\nLaunch gate summary:");
  for (const c of checks) console.log(`- ${c.name}: ${c.status}${c.note ? ` — ${c.note}` : ""}`);
  console.log(`\n${passed.length} pass · ${founder.length} founder · ${failed.length} fail`);

  if (failed.length) process.exit(1);
  console.log(
    "\nAutomated gates green. Founder still decides: UptimeRobot dashboard, D2 list, remove noindex, custom domain, public launch.",
  );
}

async function httpCheck(name, url, okFn) {
  try {
    const res = await fetch(url);
    const body = await res.json();
    const ok = res.ok && okFn(body);
    return { name, status: ok ? "PASS" : "FAIL", note: ok ? "" : JSON.stringify(body).slice(0, 120) };
  } catch (error) {
    return { name, status: "FAIL", note: error.message };
  }
}

function d2ListCheck() {
  const result = spawnSync("npm", ["run", "validate:d2-list"], { encoding: "utf8", shell: false });
  const output = `${result.stdout || ""}${result.stderr || ""}`;
  const match = output.match(/D2 list: (\d+)\/25 ready/);
  const ready = match ? Number(match[1]) : 0;
  if (ready >= 25) return { name: "d2-list", status: "PASS" };
  return { name: "d2-list", status: "FOUNDER", note: `${ready}/25 names ready` };
}

function run(script) {
  const result = spawnSync("npm", ["run", script], { encoding: "utf8", shell: false });
  const output = `${result.stdout || ""}${result.stderr || ""}`;
  if (result.status === 0) return { name: script, status: "PASS" };
  return { name: script, status: "FAIL", note: output.trim().split("\n").slice(-2).join(" ") };
}

function fileCheck(name, path, okFn) {
  try {
    const text = readFileSync(path, "utf8");
    return { name, status: okFn(text) ? "PASS" : "FAIL" };
  } catch (error) {
    return { name, status: "FAIL", note: error.message };
  }
}

main();
