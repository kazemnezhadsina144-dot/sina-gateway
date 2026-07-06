import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const serverSource = readFileSync("src/server.js", "utf8");

assert.match(serverSource, /function httpError\(statusCode, publicMessage\)/);
assert.match(serverSource, /throw httpError\(413, "Request body too large"\)/);
assert.match(serverSource, /throw httpError\(400, "Request body must be valid JSON"\)/);
assert.match(serverSource, /error\.statusCode \|\| 500/);
assert.match(serverSource, /error\.publicMessage \|\| "Internal server error"/);
assert.match(serverSource, /let localSaveQueue = Promise\.resolve\(\)/);
assert.match(serverSource, /localSaveQueue\.then\(save, save\)/);

console.log("Server hardening source checks passed.");
