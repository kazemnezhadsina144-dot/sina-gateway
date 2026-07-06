export const OPTIONS = {
  identity: ["friend", "client", "investor", "builder", "construction"],
  intent: ["hire", "invest", "partner", "refer", "learn", "trust"],
  value: ["deal", "project", "lead", "capital", "talent", "risk"],
  urgency: ["now", "soon", "exploring"],
};

export const ROUTES = {
  SourceA: {
    title: "SourceA",
    promise: "Governed AI execution for people who need agentic work done with control.",
    nextStep: "Share the workflow, decision, or operation you want delegated.",
  },
  Noetfield: {
    title: "Noetfield",
    promise: "The parent-company lane for strategic partnership, venture design, and bigger-picture alignment.",
    nextStep: "Describe the opportunity and where you think the strongest overlap is.",
  },
  TrustField: {
    title: "TrustField",
    promise: "Trust, governance, and compliance infrastructure for sensitive AI and operational systems.",
    nextStep: "Name the risk, trust, or compliance pressure you are trying to solve.",
  },
  BuildMatch: {
    title: "BuildMatch",
    promise: "Early access for Vancouver construction and home-services opportunities.",
    nextStep: "Tell Sina what kind of project, trade, property, or lead you are bringing.",
  },
  Forge: {
    title: "Forge",
    promise: "Agent and factory tooling for builders who want to create, ship, or collaborate.",
    nextStep: "Share what you can build and what kind of operating system you want around it.",
  },
  Personal: {
    title: "Personal",
    promise: "The human route for friends, warm intros, and network context.",
    nextStep: "Leave the context Sina should remember before following up.",
  },
  FounderAudit: {
    title: "Founder Audit",
    promise:
      "A 5-day audit of your founder operating system — decisions, commitments, offer, and people pipeline — with ledgers installed at the end.",
    nextStep: "Share what you are building solo and the decision you most need checked.",
  },
};

export const ROUTING_RULE_DEFINITIONS = [
  rule(
    "campaign_founder_audit",
    "FounderAudit",
    "high",
    "utm campaign founder-audit routes to Founder Audit",
    "Noetfield",
    { utm_campaign: "founder-audit" },
  ),
  rule(
    "path_founder_audit",
    "FounderAudit",
    "high",
    "founder-audit page path routes to Founder Audit",
    "Noetfield",
    { page_path_contains: "founder-audit" },
  ),
  rule(
    "notes_founder_signal",
    "FounderAudit",
    "medium",
    "notes mention founder audit, solo founder, or ai cofounder",
    "Noetfield",
    { notes_any: ["founder audit", "solo founder", "ai cofounder", "founder accountability", "decision ledger"] },
  ),
  rule("identity_friend", "Personal", "high", "identity friend routes to Personal", "", { identity: "friend" }),
  rule("identity_construction", "BuildMatch", "high", "identity construction routes to BuildMatch", "", {
    identity: "construction",
  }),
  rule("identity_builder", "Forge", "high", "identity builder routes to Forge", "SourceA", { identity: "builder" }),
  rule("identity_investor", "Noetfield", "high", "identity investor routes to Noetfield", "TrustField", {
    identity: "investor",
  }),
  rule("intent_trust", "TrustField", "high", "trust intent routes to TrustField", "Noetfield", { intent: "trust" }),
  rule("value_risk", "TrustField", "high", "risk value routes to TrustField", "SourceA", { value: "risk" }),
  rule(
    "notes_trust_signal",
    "TrustField",
    "medium",
    "notes mention trust, risk, compliance, audit, or governance",
    "SourceA",
    { notes_any: ["trust", "risk", "compliance", "audit", "governance"] },
  ),
  rule("intent_invest", "Noetfield", "high", "invest intent routes to Noetfield", "TrustField", { intent: "invest" }),
  rule("partner_capital", "Noetfield", "high", "capital partnership routes to Noetfield", "Forge", {
    intent: "partner",
    value: "capital",
  }),
  rule("partner_talent", "Forge", "high", "talent partnership routes to Forge", "Noetfield", {
    intent: "partner",
    value: "talent",
  }),
  rule("intent_hire", "SourceA", "high", "hire intent routes to SourceA", "TrustField", { intent: "hire" }),
  rule("execution_value", "SourceA", "medium", "deal, project, or lead value routes to SourceA", "Noetfield", {
    value_any: ["deal", "project", "lead"],
  }),
  rule("default_strategy", "Noetfield", "low", "default strategic route", "SourceA", { always: true }),
];

export const ROUTING_RULES = ROUTING_RULE_DEFINITIONS.map((definition) => ({
  ...definition,
  when: (lead) => ruleMatches(definition.match, lead),
}));

export function normalizeLead(input = {}) {
  const identity = clean(input.identity);
  const intent = clean(input.intent);
  const value = clean(input.value);
  const urgency = clean(input.urgency);
  const contact = cleanText(input.contact, 180);
  const contactParts = splitContact(contact);

  return {
    identity,
    intent,
    value,
    urgency,
    name: cleanText(input.name, 120),
    contact,
    email: cleanText(input.email || contactParts.email, 180),
    phone: cleanText(input.phone || contactParts.phone, 80),
    social: cleanText(input.social || contactParts.social, 180),
    preferred_contact: clean(input.preferred_contact || contactParts.preferred_contact || "contact"),
    company: cleanText(input.company, 160),
    role_title: cleanText(input.role_title, 160),
    city: cleanText(input.city, 120),
    country: cleanText(input.country || "Canada", 120),
    timezone: cleanText(input.timezone, 120),
    budget_range: cleanText(input.budget_range, 80),
    capital_range: cleanText(input.capital_range, 80),
    project_type: cleanText(input.project_type, 120),
    trade_type: cleanText(input.trade_type, 120),
    collaboration_type: cleanText(input.collaboration_type, 120),
    intro_source: cleanText(input.intro_source, 160),
    relationship_context: cleanText(input.relationship_context, 500),
    consent_to_contact: Boolean(input.consent_to_contact ?? true),
    marketing_opt_in: Boolean(input.marketing_opt_in ?? false),
    source: cleanText(input.source || "online", 80),
    raw_notes: cleanText(input.raw_notes, 1000),
    page_path: cleanText(input.page_path || "/", 240),
    referrer: cleanText(input.referrer, 500),
    utm_source: cleanText(input.utm_source, 120),
    utm_medium: cleanText(input.utm_medium, 120),
    utm_campaign: cleanText(input.utm_campaign, 120),
    session_id: cleanText(input.session_id, 120),
    visitor_id: cleanText(input.visitor_id, 120),
    submission_id: cleanText(input.submission_id, 120),
  };
}

export function validateLead(lead) {
  const errors = [];

  for (const field of ["identity", "intent", "value", "urgency"]) {
    if (!OPTIONS[field].includes(lead[field])) {
      errors.push(`${field} must be one of: ${OPTIONS[field].join(", ")}`);
    }
  }

  if (!lead.name) errors.push("name is required");
  if (!lead.contact) errors.push("contact is required");
  if (lead.contact && !looksLikeContact(lead.contact)) {
    errors.push("contact must look like an email, phone, handle, or URL");
  }
  if (looksLikeJunk(lead.name) || looksLikeJunk(lead.contact) || looksLikeJunk(lead.raw_notes)) {
    errors.push("submission looks invalid");
  }

  return errors;
}

export function enrichLead(input) {
  const lead = normalizeLead(input);
  const routeDecision = routeLead(lead);
  const venture_route = routeDecision.venture_route;
  const lead_type = lead.identity === "builder" ? "collaborator" : lead.identity;
  const priority_tag = tagPriority(lead);
  const route_reason = routeDecision.route_reason;
  const priority_reason = explainPriority(lead, priority_tag);
  const tags = deriveTags(lead, venture_route, priority_tag);

  const base = {
    ...lead,
    venture_route,
    secondary_route: routeDecision.secondary_route,
    route_rule_id: routeDecision.route_rule_id,
    route_confidence: routeDecision.route_confidence,
    lead_type,
    priority_tag,
    route_reason,
    priority_reason,
    tags,
    status: clean(input.status || "new"),
    owner: cleanText(input.owner, 120),
    next_action_at: cleanText(input.next_action_at, 80),
    last_contacted_at: cleanText(input.last_contacted_at, 80),
    archived_at: cleanText(input.archived_at, 80),
    duplicate_of: cleanText(input.duplicate_of, 120),
  };

  if (process.env.CAPTURE_METADATA_ENABLED !== "true") {
    return base;
  }

  return {
    ...base,
    is_test: Boolean(input.is_test),
    app_version: cleanText(input.app_version, 40),
    environment: cleanText(input.environment, 40),
    capture_version: cleanText(input.capture_version || "v1", 20),
    schema_version: cleanText(input.schema_version || "20260706", 20),
  };
}

export function routeLead(lead) {
  const rule = ROUTING_RULES.find((candidate) => candidate.when(lead)) || ROUTING_RULES.at(-1);
  return {
    venture_route: rule.route,
    secondary_route: rule.secondary_route || "",
    route_rule_id: rule.id,
    route_confidence: rule.confidence,
    route_reason: rule.reason,
  };
}

export function routeVenture(lead) {
  return routeLead(lead).venture_route;
}

export function tagPriority({ urgency, intent, value, contact }) {
  const hasContact = Boolean(contact && contact.trim());
  const explicitHighIntent = ["invest", "hire", "partner", "trust"].includes(intent);
  const highValue = ["deal", "capital", "lead", "risk"].includes(value);

  if (hasContact && (urgency === "now" || explicitHighIntent || highValue)) return "high";
  if (urgency === "soon" || hasContact) return "medium";
  return "low";
}

export function routeCopy(routeName) {
  return ROUTES[routeName] || ROUTES.Noetfield;
}

export function explainRoute(lead, route) {
  const decision = routeLead(lead);
  return decision.venture_route === route ? decision.route_reason : `manual route override to ${route}`;
}

export function explainPriority(lead, priority) {
  if (priority === "high" && lead.urgency === "now") return "contact provided and urgency is now";
  if (priority === "high" && ["invest", "hire", "partner", "trust"].includes(lead.intent)) {
    return `contact provided and intent is ${lead.intent}`;
  }
  if (priority === "high" && ["deal", "capital", "lead", "risk"].includes(lead.value)) {
    return `contact provided and value is ${lead.value}`;
  }
  if (priority === "medium" && lead.urgency === "soon") return "timeline is soon";
  if (priority === "medium") return "contact provided";
  return "low-intent or incomplete signal";
}

function clean(value) {
  return String(value || "").trim().toLowerCase();
}

function cleanText(value, maxLength) {
  return String(value || "").trim().slice(0, maxLength);
}

function rule(id, route, confidence, reason, secondary_route, match) {
  return { id, route, confidence, reason, secondary_route, match };
}

export function ruleMatches(match, lead) {
  if (match.always) return true;
  if (match.identity && lead.identity !== match.identity) return false;
  if (match.intent && lead.intent !== match.intent) return false;
  if (match.value && lead.value !== match.value) return false;
  if (match.value_any && !match.value_any.includes(lead.value)) return false;
  if (match.notes_any) {
    const notes = String(lead.raw_notes || "").toLowerCase();
    return match.notes_any.some((term) => notes.includes(term.toLowerCase()));
  }
  if (match.utm_campaign) {
    return clean(lead.utm_campaign) === clean(match.utm_campaign);
  }
  if (match.page_path_contains) {
    return String(lead.page_path || "")
      .toLowerCase()
      .includes(String(match.page_path_contains).toLowerCase());
  }
  return true;
}

function looksLikeContact(contact) {
  const value = String(contact).trim();
  return (
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ||
    /^\+?[\d\s().-]{7,}$/.test(value) ||
    /^@[A-Za-z0-9_.-]{2,}$/.test(value) ||
    /^https?:\/\/\S+\.\S+/.test(value)
  );
}

function looksLikeJunk(value = "") {
  const text = String(value).trim().toLowerCase();
  if (!text) return false;
  if (/(.)\1{12,}/.test(text)) return true;
  if (/(viagra|casino|free money|crypto pump|loan offer)/.test(text)) return true;
  return false;
}

function splitContact(contact) {
  const value = String(contact || "").trim();
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return { email: value, preferred_contact: "email" };
  }
  if (/^\+?[\d\s().-]{7,}$/.test(value)) {
    return { phone: value, preferred_contact: "phone" };
  }
  if (/^@[A-Za-z0-9_.-]{2,}$/.test(value) || /^https?:\/\/\S+\.\S+/.test(value)) {
    return { social: value, preferred_contact: "social" };
  }
  return {};
}

function deriveTags(lead, venture_route, priority_tag) {
  const tags = new Set([
    `route:${venture_route}`,
    `priority:${priority_tag}`,
    `identity:${lead.identity}`,
    `intent:${lead.intent}`,
    `value:${lead.value}`,
    `urgency:${lead.urgency}`,
  ]);

  if (lead.company) tags.add("has_company");
  if (lead.city) tags.add(`city:${lead.city.toLowerCase().replace(/\s+/g, "-")}`);
  if (lead.utm_campaign) tags.add(`campaign:${lead.utm_campaign.toLowerCase().replace(/\s+/g, "-")}`);
  if (lead.source === "private-test" || String(lead.name || "").startsWith("[PRIVATE-TEST]")) {
    tags.add("private_test");
  }
  if (lead.is_test) tags.add("is_test");
  if (lead.raw_notes?.toLowerCase().includes("trust")) tags.add("trust_signal");
  if (lead.raw_notes?.toLowerCase().includes("risk")) tags.add("risk_signal");
  if (lead.raw_notes?.toLowerCase().includes("compliance")) tags.add("compliance_signal");
  if (lead.secondary_route) tags.add(`secondary:${lead.secondary_route}`);
  if (lead.route_confidence) tags.add(`route_confidence:${lead.route_confidence}`);

  return [...tags];
}
