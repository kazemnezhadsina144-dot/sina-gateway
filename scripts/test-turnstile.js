import assert from "node:assert/strict";
import { verifyTurnstileToken } from "../src/turnstile.js";

assert.equal(await verifyTurnstileToken({ token: "", secret: "" }), "");
assert.equal(await verifyTurnstileToken({ token: "", secret: "secret" }), "Bot check is required");

const ok = await verifyTurnstileToken({
  token: "token",
  secret: "secret",
  ip: "127.0.0.1",
  fetchImpl: async () => ({ json: async () => ({ success: true }) }),
});
assert.equal(ok, "");

const fail = await verifyTurnstileToken({
  token: "bad",
  secret: "secret",
  fetchImpl: async () => ({ json: async () => ({ success: false }) }),
});
assert.equal(fail, "Bot check failed");

console.log("Turnstile mode tests passed.");
