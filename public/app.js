const CAMPAIGNS = {
  "founder-audit": {
    headline: "Founder Audit intake — solo technical founders.",
    lede: "A 5-day audit of how you actually run your company — decisions, commitments, offer, and pipeline.",
    banner: "Founder Audit lane — blunt accountability for solo AI founders.",
  },
  sourcea: {
    headline: "SourceA intake — governed AI execution.",
    lede: "Route agentic work, workflows, and operational pressure into a control-plane review lane.",
    banner: "SourceA lane — execution with governance, not chat chaos.",
  },
  buildmatch: {
    headline: "BuildMatch intake — Vancouver construction signals.",
    lede: "Early access for construction and home-services opportunities in the Vancouver area.",
    banner: "BuildMatch lane — local construction and trades leads.",
  },
};

let ROUTES = {
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

const form = document.querySelector("#gateway-form");
const steps = [...document.querySelectorAll(".step")];
const backButton = document.querySelector("#back-button");
const nextButton = document.querySelector("#next-button");
const submitButton = document.querySelector("#submit-button");
const statusEl = document.querySelector("#form-status");
const progressFill = document.querySelector("#progress-fill");
const stepCount = document.querySelector("#step-count");
const priorityPreview = document.querySelector("#priority-preview");
const routePreview = document.querySelector("#route-preview");
const routePromise = document.querySelector("#route-promise");
const routeTitle = document.querySelector("#route-title");
const routeDetail = document.querySelector("#route-detail");
const leadType = document.querySelector("#lead-type");
const valuePreview = document.querySelector("#value-preview");
const urgencyPreview = document.querySelector("#urgency-preview");
const mirrorCopy = document.querySelector("#mirror-copy");
const modeBanner = document.querySelector("#mode-banner");
const turnstileSlot = document.querySelector("#turnstile-slot");
const turnstileStatus = document.querySelector("#turnstile-status");

let currentStep = 0;
let runtimeConfig = { captureMode: "unknown", testMode: false, turnstileSiteKey: "", routingRules: [] };

form.addEventListener("change", () => {
  updateMirror();
  if (currentStep < 4 && stepIsValid(currentStep)) {
    setTimeout(() => goTo(currentStep + 1), 120);
  }
});

backButton.addEventListener("click", () => goTo(Math.max(0, currentStep - 1)));

nextButton.addEventListener("click", () => {
  if (!stepIsValid(currentStep)) {
    steps[currentStep].querySelector("input, textarea")?.reportValidity();
    return;
  }
  goTo(Math.min(steps.length - 1, currentStep + 1));
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  statusEl.textContent = "";

  if (!form.reportValidity()) return;

  setBusy(true);
  if (runtimeConfig.turnstileSiteKey && !turnstileToken() && turnstileStatus) {
    turnstileStatus.hidden = false;
  }

  try {
    const response = await fetch("/api/leads", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload()),
    });

    const result = await response.json();
    if (!response.ok) {
      const detail = result.details || result.error || "Capture failed";
      const ref = result.requestId ? ` Reference: ${formatReference(result.requestId)}.` : "";
      throw new Error(`${detail}${ref}`);
    }

    showSuccess(result);
  } catch (error) {
    statusEl.textContent = `Could not capture yet: ${error.message}`;
  } finally {
    if (turnstileStatus) turnstileStatus.hidden = true;
    setBusy(false);
  }
});

boot();

async function boot() {
  runtimeConfig = await loadConfig();
  if (runtimeConfig.routes) ROUTES = runtimeConfig.routes;
  applyCampaignWedge();
  renderRuntimeMode();
  renderTurnstile();
  goTo(0);
  updateMirror();
}

function applyCampaignWedge() {
  const params = new URLSearchParams(window.location.search);
  const campaign = (params.get("utm_campaign") || "").toLowerCase();
  const wedge = CAMPAIGNS[campaign];
  if (!wedge) return;

  const title = document.querySelector("#page-title");
  const lede = document.querySelector(".hero .lede");
  if (title) title.textContent = wedge.headline;
  if (lede) lede.textContent = wedge.lede;

  if (modeBanner && wedge.banner) {
    modeBanner.hidden = false;
    modeBanner.classList.add("wedge-banner");
    modeBanner.textContent = wedge.banner;
  }
}

function goTo(index) {
  currentStep = index;
  steps.forEach((step, stepIndex) => step.classList.toggle("is-active", stepIndex === index));
  stepCount.textContent = `Step ${index + 1} of ${steps.length}`;
  progressFill.style.width = `${((index + 1) / steps.length) * 100}%`;
  backButton.hidden = index === 0;
  nextButton.hidden = index === steps.length - 1;
  submitButton.hidden = index !== steps.length - 1;
  updateMirror();
}

function stepIsValid(index) {
  const fields = [...steps[index].querySelectorAll("input, textarea")];
  return fields.every((field) => field.checkValidity());
}

function payload() {
  const data = new FormData(form);
  const params = new URLSearchParams(window.location.search);
  const introRef = sanitizeIntroRef(params.get("ref"));

  return {
    identity: data.get("identity"),
    intent: data.get("intent"),
    value: data.get("value"),
    urgency: data.get("urgency"),
    name: data.get("name"),
    contact: data.get("contact"),
    company: data.get("company"),
    role_title: data.get("role_title"),
    city: data.get("city"),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "",
    preferred_contact: data.get("preferred_contact"),
    consent_to_contact: data.get("consent_to_contact") === "on",
    raw_notes: data.get("raw_notes"),
    website: data.get("website"),
    turnstileToken: turnstileToken(),
    source: "online",
    page_path: window.location.pathname,
    referrer: introRef ? `ref:${introRef}` : document.referrer,
    utm_source: params.get("utm_source") || "",
    utm_medium: params.get("utm_medium") || "",
    utm_campaign: params.get("utm_campaign") || "",
    session_id: sessionId(),
    visitor_id: visitorId(),
  };
}

function updateMirror() {
  const lead = routingLead();
  const route = routeVenture(lead);
  const copy = ROUTES[route];
  const priority = tagPriority(lead);

  routePreview.textContent = copy.title;
  routePromise.textContent = copy.promise;
  routeTitle.textContent = copy.title;
  routeDetail.textContent = previewLaneDetail(lead, copy);
  leadType.textContent = lead.identity ? (lead.identity === "builder" ? "collaborator" : lead.identity) : "Pending";
  valuePreview.textContent = lead.value || "Pending";
  urgencyPreview.textContent = lead.urgency || "Pending";
  priorityPreview.textContent = `Priority: ${priority}`;

  mirrorCopy.textContent = mirrorLine(lead.identity);
}

function routingLead() {
  const data = payload();
  return {
    identity: data.identity,
    intent: data.intent,
    value: data.value,
    contact: data.contact,
    raw_notes: data.raw_notes,
    utm_campaign: data.utm_campaign,
    page_path: data.page_path,
  };
}

function routeVenture(lead) {
  const rule = runtimeConfig.routingRules?.find((candidate) => ruleMatches(candidate.match, lead));
  return rule?.route || "Noetfield";
}

function tagPriority({ urgency, intent, value, contact }) {
  const hasContact = Boolean(contact && String(contact).trim());
  const explicitHighIntent = ["invest", "hire", "partner", "trust"].includes(intent);
  const highValue = ["deal", "capital", "lead", "risk"].includes(value);

  if (hasContact && (urgency === "now" || explicitHighIntent || highValue)) return "high";
  if (urgency === "soon" || hasContact) return "medium";
  return "pending";
}

function mirrorLine(identity) {
  const lines = {
    client: "You are likely here to turn a workflow, project, or business pressure into execution.",
    investor: "You are likely looking for the bigger strategic map: ventures, timing, and leverage.",
    builder: "You are likely bringing talent, tools, or collaboration energy into the factory.",
    construction: "You are likely bringing a Vancouver construction or home-services signal into BuildMatch early access.",
    friend: "You are in the human lane: context, memory, intro, or a warm signal for Sina.",
    founder: "You are likely a solo founder looking for accountability without coaching fluff.",
  };

  const params = new URLSearchParams(window.location.search);
  const campaign = (params.get("utm_campaign") || "").toLowerCase();
  if (CAMPAIGNS[campaign]) {
    return CAMPAIGNS[campaign].lede;
  }

  if (campaign === "founder-audit") {
    return "You are in the Founder Audit lane: a 5-day audit of how you actually run your company.";
  }

  return lines[identity] || "Use the steps below — the lane preview updates as you answer.";
}

function previewLaneDetail(lead, copy) {
  if (!lead.identity) {
    return "Identity, intent, value, and urgency determine your review lane.";
  }
  if (!lead.intent || !lead.value || !lead.urgency) {
    const hints = {
      client: "Likely client operating intake — finish the steps to confirm the lane.",
      investor: "Likely capital and strategic review — finish the steps to confirm the lane.",
      builder: "Likely Forge / collaborator review — finish the steps to confirm the lane.",
      construction: "Likely BuildMatch construction review — finish the steps to confirm the lane.",
      friend: "Likely Personal / network lane — finish the steps to confirm the lane.",
    };
    return hints[lead.identity] || `Likely ${copy.title} — finish the steps to confirm.`;
  }
  return copy.nextStep;
}

function showSuccess(result) {
  const lead = result.lead;
  const template = document.querySelector("#success-template");
  const node = template.content.cloneNode(true);
  const ref = formatReference(lead.id, result.requestId);

  node.querySelector("h2").textContent = `Routed to ${lead.route.title}`;
  node.querySelector(".success-route").textContent = `${lead.route.promise} Priority: ${lead.priority_tag}.`;
  const reasonEl = node.querySelector(".success-reason");
  if (lead.route_reason) {
    reasonEl.textContent = `Why this lane: ${lead.route_reason}`;
  } else {
    reasonEl.hidden = true;
  }
  node.querySelector(".success-ref").textContent = `Reference ${ref} — keep this if you follow up.`;
  node.querySelector(".success-review").textContent =
    "Review window: operator follow-up within 48 hours on business days.";
  node.querySelector(".success-next").textContent = `Next: ${lead.route.nextStep}`;

  form.replaceChildren(node);
  form.querySelector("#copy-ref-button")?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(ref);
      form.querySelector("#copy-ref-button").textContent = "Copied";
    } catch {
      form.querySelector("#copy-ref-button").textContent = ref;
    }
  });
  const shareUrl = buildIntroShareUrl(ref);
  form.querySelector("#copy-share-button")?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      form.querySelector("#copy-share-button").textContent = "Intro link copied";
    } catch {
      form.querySelector("#copy-share-button").textContent = shareUrl;
    }
  });
  form.querySelector("#send-another-button")?.addEventListener("click", () => window.location.reload());

  routePreview.textContent = lead.route.title;
  routePromise.textContent = lead.route.promise;
  routeTitle.textContent = lead.route.title;
  routeDetail.textContent = lead.route.nextStep;
  leadType.textContent = lead.lead_type;
  priorityPreview.textContent = `Priority: ${lead.priority_tag}`;
  mirrorCopy.textContent = `Signal captured on the ${lead.route.title} lane.`;
}

function formatReference(leadId, requestId) {
  const raw = String(leadId || requestId || "");
  if (!raw) return "—";
  return raw.slice(0, 8).toUpperCase();
}

function sanitizeIntroRef(value) {
  const ref = String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, "");
  return ref.slice(0, 40);
}

function buildIntroShareUrl(refSlug) {
  const url = new URL(window.location.origin + "/");
  const params = new URLSearchParams(window.location.search);
  const campaign = params.get("utm_campaign");
  const source = params.get("utm_source") || "intro";
  url.searchParams.set("ref", refSlug.toLowerCase());
  if (campaign) url.searchParams.set("utm_campaign", campaign);
  url.searchParams.set("utm_source", source);
  url.searchParams.set("utm_medium", "share");
  return url.toString();
}

function setBusy(isBusy) {
  submitButton.disabled = isBusy;
  nextButton.disabled = isBusy;
  backButton.disabled = isBusy;
  submitButton.textContent = isBusy ? "Sending..." : "Send signal";
}

async function loadConfig() {
  try {
    const response = await fetch("/api/config");
    if (!response.ok) throw new Error("Config unavailable");
    return await response.json();
  } catch {
    return { captureMode: "unknown", testMode: false, turnstileSiteKey: "" };
  }
}

function renderRuntimeMode() {
  if (!modeBanner) return;
  if (modeBanner.classList.contains("wedge-banner")) return;

  if (runtimeConfig.captureMode === "local") {
    modeBanner.hidden = false;
    modeBanner.textContent = "Local capture mode: submissions are saved on this machine until Supabase is ready.";
    return;
  }

  if (runtimeConfig.testMode) {
    modeBanner.hidden = false;
    modeBanner.textContent = "Test mode: submissions are marked as test leads.";
    return;
  }

  modeBanner.hidden = true;
}

function renderTurnstile() {
  if (!runtimeConfig.turnstileSiteKey || !turnstileSlot) return;

  turnstileSlot.textContent = "Loading bot check…";

  const script = document.createElement("script");
  script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
  script.async = true;
  script.defer = true;
  script.onload = () => {
    turnstileSlot.textContent = "";
    const widget = document.createElement("div");
    widget.className = "cf-turnstile";
    widget.dataset.sitekey = runtimeConfig.turnstileSiteKey;
    turnstileSlot.append(widget);
  };
  document.head.append(script);
}

function turnstileToken() {
  return document.querySelector('input[name="cf-turnstile-response"]')?.value || "";
}

function ruleMatches(match = {}, lead) {
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
    return String(lead.utm_campaign || "").trim().toLowerCase() === String(match.utm_campaign).trim().toLowerCase();
  }
  if (match.page_path_contains) {
    return String(lead.page_path || "")
      .toLowerCase()
      .includes(String(match.page_path_contains).toLowerCase());
  }
  return true;
}

function sessionId() {
  let value = sessionStorage.getItem("sina_gateway_session_id");
  if (!value) {
    value = crypto.randomUUID();
    sessionStorage.setItem("sina_gateway_session_id", value);
  }
  return value;
}

function visitorId() {
  let value = localStorage.getItem("sina_gateway_visitor_id");
  if (!value) {
    value = crypto.randomUUID();
    localStorage.setItem("sina_gateway_visitor_id", value);
  }
  return value;
}
