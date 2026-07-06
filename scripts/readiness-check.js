import { spawnSync } from "node:child_process";

const checks = [
  { name: "unit", command: "npm", args: ["test"], required: true },
  { name: "env", command: "npm", args: ["run", "validate:env"], required: true, warningOk: true },
  { name: "syntax", command: "npm", args: ["run", "check"], required: true },
  { name: "routes", command: "npm", args: ["run", "audit:routes"], required: true },
  { name: "shared-routing", command: "npm", args: ["run", "test:shared-routing"], required: true },
  { name: "schema-drift", command: "npm", args: ["run", "check:schema"], required: true },
  { name: "notifications", command: "npm", args: ["run", "test:notifications"], required: true },
  { name: "server-hardening", command: "npm", args: ["run", "test:server-hardening"], required: true },
  { name: "local-e2e", command: "npm", args: ["run", "e2e:local"], required: true },
  {
    name: "http-smoke",
    command: "npm",
    args: ["run", "smoke"],
    required: false,
    skippedMarkers: ["SKIPPED_LOCALHOST_UNAVAILABLE"],
  },
  {
    name: "supabase-live",
    command: "npm",
    args: ["run", "verify:supabase"],
    required: false,
    skippedMarkers: [
      "SKIPPED_ENV_MISSING",
      "SKIPPED_SUPABASE_TABLE_MISSING",
      "SKIPPED_SUPABASE_GRANTS_MISSING",
      "SKIPPED_NETWORK_UNAVAILABLE",
      "SUPABASE_PROJECT_PAUSED_OR_UNREACHABLE",
    ],
  },
];

const results = [];

for (const check of checks) {
  const result = spawnSync(check.command, check.args, {
    cwd: process.cwd(),
    encoding: "utf8",
    shell: false,
  });
  const output = `${result.stdout || ""}${result.stderr || ""}`;
  const skippedMarker = check.skippedMarkers?.find((marker) => output.includes(marker));
  const status = statusFor({ check, result, skippedMarker });

  results.push({
    name: check.name,
    status,
    exitCode: result.status,
    marker: skippedMarker || "",
  });

  printResult(check, status, result, skippedMarker);
}

const failed = results.filter((result) => result.status === "FAIL");
console.log("\nReadiness summary:");
for (const result of results) {
  const marker = result.marker ? ` (${result.marker})` : "";
  console.log(`- ${result.name}: ${result.status}${marker}`);
}

if (failed.length) {
  process.exit(1);
}

console.log("\nReadiness core checks passed.");

function statusFor({ check, result, skippedMarker }) {
  if (result.status === 0) return check.warningOk ? "PASS_WITH_WARNINGS" : "PASS";
  if (skippedMarker && !check.required) return "SKIPPED";
  return "FAIL";
}

function printResult(check, status, result, skippedMarker) {
  const label = skippedMarker ? `${status} (${skippedMarker})` : status;
  console.log(`\n[${label}] ${check.name}: ${check.command} ${check.args.join(" ")}`);

  const output = `${result.stdout || ""}${result.stderr || ""}`.trim();
  if (!output) return;

  const lines = output.split(/\r?\n/);
  const tail = lines.slice(-12).join("\n");
  console.log(tail);
}
