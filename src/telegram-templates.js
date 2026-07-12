/**
 * Telegram message templates for lead alerts and ops posts.
 */

export function priorityLabel(tag = "") {
  const normalized = String(tag).toLowerCase();
  if (normalized === "high") return "🔴 HIGH";
  if (normalized === "medium") return "🟡 NORMAL";
  return "🟢 LOW";
}

export function laneAlertHeadline(route = "") {
  switch (route) {
    case "FounderAudit":
      return "<b>Founder Audit signal</b>";
    case "SourceA":
      return "<b>SourceA client signal</b>";
    case "Noetfield":
      return "<b>Noetfield strategic signal</b>";
    case "Forge":
      return "<b>Forge builder signal</b>";
    case "TrustField":
      return "<b>TrustField compliance signal</b>";
    case "BuildMatch":
      return "<b>BuildMatch local signal</b>";
    default:
      return "<b>High-priority Sina Gateway lead</b>";
  }
}

export function contactMethodSummary(lead = {}) {
  const parts = [];
  if (lead.email) parts.push(`email: ${lead.email}`);
  if (lead.phone) parts.push(`phone: ${lead.phone}`);
  if (lead.social) parts.push(`social: ${lead.social}`);
  if (lead.preferred_contact) parts.push(`prefers: ${lead.preferred_contact}`);
  if (parts.length) return parts.join(" · ");
  return lead.contact || "—";
}

export function buildLeadAlertMessage(lead, requestId, { industryLabel = "" } = {}) {
  const ref = requestId ? String(requestId).slice(0, 8).toUpperCase() : "";
  return [
    laneAlertHeadline(lead.venture_route),
    `${lead.name || "—"} → ${lead.venture_route || "—"}`,
    contactMethodSummary(lead),
    `priority: ${priorityLabel(lead.priority_tag)}`,
    lead.utm_campaign ? `campaign: ${lead.utm_campaign}` : "",
    lead.utm_content ? `content: ${lead.utm_content}` : "",
    lead.utm_term ? `term: ${lead.utm_term}` : "",
    lead.referred_by ? `intro: ref:${lead.referred_by}` : "",
    industryLabel ? `industry: ${industryLabel}` : "",
    lead.route_rule_id ? `rule: ${lead.route_rule_id}` : "",
    lead.route_confidence ? `confidence: ${lead.route_confidence}` : "",
    lead.route_reason ? `route: ${lead.route_reason}` : "",
    ref ? `ref: ${ref}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}
