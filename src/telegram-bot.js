/**
 * Minimal @GateWay_A_bot command handler (webhook replies to user chat).
 */
import { ROUTES } from "./gateway.js";
import { sendTelegramMessage, telegramConfigured } from "./telegram.js";

const CAMPAIGN_LINKS = {
  "founder-audit": "Founder Audit — solo technical founder operating-system review.",
  sourcea: "SourceA — governed AI execution for client work.",
  buildmatch: "BuildMatch — Vancouver Construction or Home services.",
  noetfield: "Noetfield — strategic and partnership intake.",
  forge: "Forge — builder and collaborator intake.",
  trustfield: "TrustField — trust, governance, and compliance intake.",
};

export function parseTelegramCommand(text = "") {
  const trimmed = String(text).trim();
  if (!trimmed.startsWith("/")) return null;
  const [rawCommand, ...rest] = trimmed.split(/\s+/);
  const command = rawCommand.split("@")[0].toLowerCase();
  return { command, args: rest.join(" ").trim() };
}

export function buildBotReply({ command, args }, context) {
  const baseUrl = context.baseUrl || "https://sina-gateway-production.up.railway.app";
  const routes = context.routes || ROUTES;
  const status = context.status || {};

  switch (command) {
    case "/start":
      return buildStartReply(args, baseUrl);
    case "/status":
      return buildStatusReply(status, baseUrl);
    case "/lanes":
      return buildLanesReply(routes, baseUrl);
    case "/privacy":
      return `Privacy policy: ${baseUrl}/privacy.html`;
    case "/help":
      return buildHelpReply();
    default:
      return buildHelpReply();
  }
}

function buildStartReply(payload, baseUrl) {
  const p = String(payload || "").trim();
  if (!p) {
    return [
      "<b>Sina Gateway</b>",
      "One intake form — inquiries sorted to the right product line.",
      "",
      `Start: ${baseUrl}/`,
      "",
      "Commands: /lanes · /status · /privacy",
    ].join("\n");
  }

  const refMatch = p.match(/^ref[_-]?([A-Za-z0-9]{1,8})$/i);
  if (refMatch) {
    const code = refMatch[1].toUpperCase();
    return [
      "<b>Intro link</b>",
      `Ref <code>${code}</code> noted.`,
      "",
      `Share or open: ${baseUrl}/?ref=${encodeURIComponent(code)}`,
    ].join("\n");
  }

  const campaign = p.toLowerCase().replace(/\s+/g, "-");
  if (CAMPAIGN_LINKS[campaign]) {
    return [
      `<b>${campaign}</b>`,
      CAMPAIGN_LINKS[campaign],
      "",
      `${baseUrl}/?utm_campaign=${encodeURIComponent(campaign)}&utm_source=telegram`,
    ].join("\n");
  }

  return [
    "<b>Sina Gateway</b>",
    "Unknown start payload — use main intake.",
    "",
    `${baseUrl}/`,
    "",
    "Try /lanes for product lines.",
  ].join("\n");
}

function buildStatusReply(status, baseUrl) {
  const lines = [
    "<b>Sina Gateway status</b>",
    `Operational: ${status.ok ? "yes" : "degraded"}`,
    `Capture: ${status.captureMode || "unknown"}`,
    `Version: ${status.version || "—"}`,
    `Notifications: ${status.notificationsConfigured ? "on" : "off"}`,
    `Turnstile: ${status.turnstileConfigured ? "on" : "off"}`,
  ];
  if (status.lastSignalAt) {
    lines.push(`Last signal: ${status.lastSignalAt}`);
  }
  if (Number(status.offersSent) > 0) {
    lines.push(`Outbound logged: ${status.offersSent}`);
  }
  lines.push("", `Full status: ${baseUrl}/status.html`);
  return lines.join("\n");
}

function buildLanesReply(routes, baseUrl) {
  const lines = ["<b>Product lines</b>", ""];
  for (const [key, route] of Object.entries(routes)) {
    lines.push(`<b>${route.title || key}</b> — ${route.promise}`);
  }
  lines.push("", `Intake: ${baseUrl}/`, "Wedge pages: /founder-audit · /for-clients · /for-investors · /for-builders · /for-trust · /buildmatch");
  return lines.join("\n");
}

function buildHelpReply() {
  return [
    "<b>Sina Gateway bot</b>",
    "/start — welcome + intake link",
    "/start founder-audit — Founder Audit deep link",
    "/start ref_CODE — intro link with ref",
    "/lanes — product line list",
    "/status — live gateway status",
    "/privacy — privacy policy link",
  ].join("\n");
}

export async function handleTelegramUpdate(update, env, context = {}) {
  const message = update?.message;
  if (!message?.text || !message.chat?.id) {
    return { ok: true, skipped: true, reason: "no_text_message" };
  }

  const parsed = parseTelegramCommand(message.text);
  if (!parsed) {
    return { ok: true, skipped: true, reason: "not_a_command" };
  }

  const reply = buildBotReply(parsed, context);
  const result = await sendTelegramMessage(env, message.chat.id, reply);
  return { ok: result.ok, message_id: result.message_id, command: parsed.command };
}

export function verifyTelegramWebhookSecret(req, expectedSecret) {
  if (!expectedSecret) return true;
  const header = req.headers["x-telegram-bot-api-secret-token"];
  return header === expectedSecret;
}

export function telegramBotConfigured(env = {}) {
  return telegramConfigured(env);
}
