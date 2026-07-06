import { readFileSync } from "node:fs";

const configPath = process.env.MONITORS_CONFIG || "data/gateway-external-monitors-v1.json";
const config = JSON.parse(readFileSync(configPath, "utf8"));
const monitors = config.monitors || [];

if (!monitors.length) {
  console.error("No monitors defined in", configPath);
  process.exit(1);
}

let failed = 0;

for (const monitor of monitors) {
  const label = monitor.title || monitor.id || monitor.url;
  try {
    const response = await fetch(monitor.url, { redirect: "follow" });
    const body = await response.text();
    const statusOk = monitor.expected_status ? response.status === monitor.expected_status : response.ok;
    const keywordOk = monitor.keyword ? body.includes(monitor.keyword) : true;

    if (statusOk && keywordOk) {
      console.log(`OK: ${label} (${response.status})`);
      continue;
    }

    failed += 1;
    console.error(`FAIL: ${label} status=${response.status} keyword=${monitor.keyword || "n/a"}`);
  } catch (error) {
    failed += 1;
    console.error(`FAIL: ${label} — ${error.message}`);
  }
}

if (failed) {
  console.error(`\n${failed}/${monitors.length} monitor probes failed.`);
  console.error("Founder: arm these URLs in UptimeRobot once probes pass.");
  process.exit(1);
}

console.log(`\n${monitors.length}/${monitors.length} monitor URLs ready for UptimeRobot.`);
console.log("Founder: create monitors in UptimeRobot from", configPath);
