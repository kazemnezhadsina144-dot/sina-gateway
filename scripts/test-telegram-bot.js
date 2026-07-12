import assert from "node:assert/strict";
import { buildBotReply, parseTelegramCommand } from "../src/telegram-bot.js";

const baseUrl = "https://example.test";

assert.deepEqual(parseTelegramCommand("/start"), { command: "/start", args: "" });
assert.deepEqual(parseTelegramCommand("/start ref_ABC12"), { command: "/start", args: "ref_ABC12" });
assert.deepEqual(parseTelegramCommand("/lanes@GateWay_A_bot"), { command: "/lanes", args: "" });

const welcome = buildBotReply({ command: "/start", args: "" }, { baseUrl });
assert.match(welcome, /example\.test/);

const refReply = buildBotReply({ command: "/start", args: "ref_INTRO01" }, { baseUrl });
assert.match(refReply, /INTRO01/);
assert.match(refReply, /\?ref=INTRO01/);

const auditReply = buildBotReply({ command: "/start", args: "founder-audit" }, { baseUrl });
assert.match(auditReply, /founder-audit/);

const statusReply = buildBotReply(
  { command: "/status", args: "" },
  { baseUrl, status: { ok: true, captureMode: "supabase", version: "1.0.0", notificationsConfigured: true, turnstileConfigured: true } },
);
assert.match(statusReply, /supabase/);

const lanesReply = buildBotReply({ command: "/lanes", args: "" }, { baseUrl });
assert.match(lanesReply, /SourceA/);

const privacyReply = buildBotReply({ command: "/privacy", args: "" }, { baseUrl });
assert.match(privacyReply, /privacy\.html/);

console.log("Telegram bot command tests passed.");
