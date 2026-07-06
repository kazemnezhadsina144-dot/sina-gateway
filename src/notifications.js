import { sendTelegramAlert, telegramConfigured } from "./telegram.js";

export function shouldNotifyLead(lead, telegramEnv) {
  return lead.priority_tag === "high" && telegramConfigured(telegramEnv);
}

export function buildNotificationMessage(lead, requestId) {
  return [
    "<b>High-priority Sina Gateway lead</b>",
    `${lead.name || "—"} → ${lead.venture_route || "—"}`,
    lead.contact || "—",
    `priority: ${lead.priority_tag}`,
    requestId ? `req: ${requestId}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

/** @deprecated kept for dry-run tests */
export function buildNotificationPayload(lead, requestId) {
  return {
    text: `High-priority Sina Gateway lead: ${lead.name} -> ${lead.venture_route}`,
    requestId,
    lead,
  };
}

export async function notifyLead({ lead, requestId, telegram = {}, fetchImpl = fetch, log = () => {} }) {
  if (!shouldNotifyLead(lead, telegram)) {
    return { sent: false, reason: "disabled_or_not_high_priority" };
  }

  try {
    const result = await sendTelegramAlert(telegram, buildNotificationMessage(lead, requestId), { fetchImpl });
    if (!result.ok) {
      log("notification_failed", { requestId, status: result.status, error: result.error });
      return { sent: false, reason: result.skipped ? "telegram_not_configured" : `telegram_${result.status}` };
    }
    return { sent: true, channel: "telegram", message_id: result.message_id };
  } catch (error) {
    log("notification_failed", { requestId, error: error.message });
    return { sent: false, reason: "telegram_fetch_error" };
  }
}
