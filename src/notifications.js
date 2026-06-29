export function shouldNotifyLead(lead, webhookUrl) {
  return lead.priority_tag === "high" && Boolean(webhookUrl);
}

export function buildNotificationPayload(lead, requestId) {
  return {
    text: `High-priority Sina Gateway lead: ${lead.name} -> ${lead.venture_route}`,
    requestId,
    lead: {
      id: lead.id,
      name: lead.name,
      contact: lead.contact,
      identity: lead.identity,
      intent: lead.intent,
      value: lead.value,
      urgency: lead.urgency,
      venture_route: lead.venture_route,
      priority_tag: lead.priority_tag,
      raw_notes: lead.raw_notes,
    },
  };
}

export async function notifyLead({ lead, requestId, webhookUrl, fetchImpl = fetch, log = () => {} }) {
  if (!shouldNotifyLead(lead, webhookUrl)) return { sent: false, reason: "disabled_or_not_high_priority" };

  try {
    const response = await fetchImpl(webhookUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(buildNotificationPayload(lead, requestId)),
    });
    if (!response.ok) {
      log("notification_failed", { requestId, status: response.status });
      return { sent: false, reason: `http_${response.status}` };
    }
    return { sent: true };
  } catch (error) {
    log("notification_failed", { requestId, error: error.message });
    return { sent: false, reason: "fetch_error" };
  }
}
