const baseUrl = process.env.SMOKE_BASE_URL || "http://localhost:4173";

const checks = [
  ["/health", 200],
  ["/ready", 200],
  ["/api/config", 200],
  ["/api/status", 200],
  ["/", 200],
  ["/for-investors", 200],
  ["/for-builders", 200],
  ["/for-trust", 200],
  ["/how-it-works", 200],
  ["/how-routing-works", 200],
  ["/robots.txt", 200],
];

for (const [path, expectedStatus] of checks) {
  let response;
  try {
    response = await fetch(`${baseUrl}${path}`);
  } catch (error) {
    console.error(`SKIPPED_LOCALHOST_UNAVAILABLE: Could not reach ${baseUrl}${path} (${error.cause?.code || error.code || error.message}).`);
    process.exit(1);
  }
  if (response.status !== expectedStatus) {
    console.error(`${path} returned ${response.status}, expected ${expectedStatus}`);
    process.exit(1);
  }
  console.log(`${path} OK`);
}

console.log("Smoke test passed.");
