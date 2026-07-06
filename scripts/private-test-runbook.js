import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";

const baseUrl = (process.env.PRIVATE_TEST_BASE_URL || "https://sina-gateway-production.up.railway.app").replace(/\/$/, "");
const origin = process.env.PRIVATE_TEST_ORIGIN || baseUrl;
const stamp = new Date().toISOString().slice(0, 10);
const contact = `private-test+${Date.now()}@example.com`;

const steps = [];
let failed = false;

steps.push(checkRobots());
steps.push(checkNoIndex());
steps.push(runNpm("verify:supabase"));
steps.push(runChainHealth());
steps.push(await capturePrivateTestLead());
steps.push(verifyAnonReadDenied());

printSummary(steps);
process.exit(failed ? 1 : 0);

function checkRobots() {
  const text = readFileSync("public/robots.txt", "utf8");
  const ok = /Disallow:\s*\/\s*/i.test(text);
  return record("robots-blocked", ok, ok ? "robots.txt disallows all" : "robots.txt must Disallow: /");
}

function checkNoIndex() {
  const html = readFileSync("public/index.html", "utf8");
  const ok = /noindex/i.test(html) && /nofollow/i.test(html);
  return record("noindex", ok, ok ? "index.html has noindex,nofollow" : "missing noindex/nofollow meta");
}

function runNpm(script) {
  const result = spawnSync("npm", ["run", script], { encoding: "utf8", shell: false });
  const output = `${result.stdout || ""}${result.stderr || ""}`;
  const ok =
    result.status === 0 &&
    (script !== "verify:supabase" || (output.includes("INSERT OK") && output.includes("READ DENIED")));
  return record(script, ok, ok ? "passed" : output.trim().split("\n").slice(-4).join(" | "));
}

function runChainHealth() {
  const result = spawnSync("npm", ["run", "chain:health"], {
    encoding: "utf8",
    shell: false,
    env: { ...process.env, CHAIN_HEALTH_BASE_URL: baseUrl },
  });
  const output = `${result.stdout || ""}${result.stderr || ""}`;
  const ok = result.status === 0 && output.includes("Chain health passed");
  return record("chain:health", ok, ok ? "production chain passed" : output.trim().split("\n").slice(-6).join(" | "));
}

async function capturePrivateTestLead() {
  const payload = {
    identity: "client",
    intent: "learn",
    value: "project",
    urgency: "exploring",
    name: `[PRIVATE-TEST] ${stamp}`,
    contact,
    raw_notes: "private test lead — founder audit lane check",
    utm_campaign: "founder-audit",
    utm_source: "private-test-runbook",
    consent_to_contact: true,
    source: "private-test",
  };

  try {
    const response = await fetch(`${baseUrl}/api/leads`, {
      method: "POST",
      headers: { "content-type": "application/json", origin },
      body: JSON.stringify(payload),
    });
    const body = await response.json();
    const ok = response.ok && body.ok && body.lead?.venture_route === "FounderAudit";
    return record(
      "browser-capture",
      ok,
      ok
        ? `captured to FounderAudit (requestId ${body.requestId})`
        : `${response.status} ${JSON.stringify(body)}`,
    );
  } catch (error) {
    return record("browser-capture", false, error.message);
  }
}

function verifyAnonReadDenied() {
  const result = spawnSync("npm", ["run", "verify:supabase"], { encoding: "utf8", shell: false });
  const output = `${result.stdout || ""}${result.stderr || ""}`;
  const ok = output.includes("READ DENIED");
  return record("anon-read-denied", ok, ok ? "anon cannot read lead rows" : "read check failed");
}

function record(name, ok, detail) {
  if (!ok) failed = true;
  const step = { name, ok, detail };
  console.log(`${ok ? "PASS" : "FAIL"} ${name}: ${detail}`);
  return step;
}

function printSummary(steps) {
  console.log("\nPrivate test runbook summary:");
  for (const step of steps) {
    console.log(`- ${step.name}: ${step.ok ? "PASS" : "FAIL"}`);
  }
  if (!failed) {
    console.log("\nConfirm in Supabase Table Editor: filter source = private-test or name like [PRIVATE-TEST]%");
    console.log("Cleanup: delete test rows in dashboard or run docs/PRIVATE_TEST_CLEANUP.sql as postgres.");
  }
}
