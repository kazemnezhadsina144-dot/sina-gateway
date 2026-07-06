const CAMPAIGNS = {
  "founder-audit": {
    headline: "Founder Audit intake — solo technical founders.",
    lede: "A 5-day audit of how you actually run your company — decisions, commitments, offer, and pipeline.",
    banner: "Founder Audit — accountability for solo AI founders.",
  },
  sourcea: {
    headline: "SourceA intake — governed AI execution.",
    lede: "Send agentic work and operational pressure to SourceA for governed execution review.",
    banner: "SourceA — client work with guardrails, not chat chaos.",
  },
  buildmatch: {
    headline: "BuildMatch intake — Vancouver property and trade platform.",
    lede: "BuildMatch covers Construction and Home services as separate industries — pick yours on step 1.",
    banner: "BuildMatch — Vancouver platform (Construction or Home services).",
  },
};

const BUILDMATCH_INDUSTRIES = {
  construction: {
    label: "Construction",
    promise: "BuildMatch — Construction: Vancouver building, trades, renovations, and site work.",
    nextStep: "Describe the project type, trade, property, and timeline.",
    mirror: "You are on BuildMatch — Construction: building, trades, or site work in Vancouver.",
  },
  home_services: {
    label: "Home services",
    promise: "BuildMatch — Home services: Vancouver maintenance, repairs, and residential specialists.",
    nextStep: "Describe the service needed, property, and when you want help.",
    mirror: "You are on BuildMatch — Home services: maintenance, repairs, or residential help in Vancouver.",
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
    promise: "Strategy, partnerships, and bigger-picture ventures.",
    nextStep: "Describe the opportunity and where you think the strongest overlap is.",
  },
  TrustField: {
    title: "TrustField",
    promise: "Trust, governance, and compliance infrastructure for sensitive AI and operational systems.",
    nextStep: "Name the risk, trust, or compliance pressure you are trying to solve.",
  },
  BuildMatch: {
    title: "BuildMatch",
    promise: "Vancouver platform for local property and trade inquiries — pick Construction or Home services.",
    nextStep: "Choose your BuildMatch industry, then describe the project or service.",
  },
  Forge: {
    title: "Forge",
    promise: "Agent and factory tooling for builders who want to create, ship, or collaborate.",
    nextStep: "Share what you can build and what kind of operating system you want around it.",
  },
  Personal: {
    title: "Personal",
    promise: "Friends, warm intros, and network context.",
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
const buildmatchPanel = document.querySelector("#buildmatch-industry-panel");

let currentStep = 0;
let runtimeConfig = { captureMode: "unknown", testMode: false, turnstileSiteKey: "", routingRules: [] };

form.addEventListener("change", () => {
  syncBuildMatchPanel();
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
    statusEl.textContent = `Could not save inquiry yet: ${error.message}`;
  } finally {
    setBusy(false);
  }
});

boot();

async function boot() {
  runtimeConfig = await loadConfig();
  if (runtimeConfig.routes) ROUTES = runtimeConfig.routes;
  if (runtimeConfig.buildmatchIndustries) {
    Object.assign(BUILDMATCH_INDUSTRIES, runtimeConfig.buildmatchIndustries);
  }
  applyCampaignWedge();
  renderRuntimeMode();
  renderTurnstile();
  syncBuildMatchPanel();
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

  if (campaign === "buildmatch") {
    const buildmatchIdentity = form.querySelector('input[name="identity"][value="buildmatch"]');
    if (buildmatchIdentity) buildmatchIdentity.checked = true;
    syncBuildMatchPanel();
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
  const stepEl = steps[index];
  const identity = form.querySelector('input[name="identity"]:checked');
  if (index === 0 && !identity) return false;
  if (index === 0 && identity?.value === "buildmatch") {
    if (!form.querySelector('input[name="project_type"]:checked')) return false;
  }

  const radioNames = new Set(
    [...stepEl.querySelectorAll('input[type="radio"]')]
      .filter((input) => {
        if (input.name === "project_type" && identity?.value !== "buildmatch") return false;
        return true;
      })
      .map((input) => input.name),
  );

  for (const name of radioNames) {
    if (!stepEl.querySelector(`input[name="${name}"]:checked`)) return false;
  }

  const fields = [...stepEl.querySelectorAll("textarea, select")];
  return fields.every((field) => field.checkValidity());
}

function syncBuildMatchPanel() {
  if (!buildmatchPanel) return;
  const identity = form.querySelector('input[name="identity"]:checked')?.value;
  const show = identity === "buildmatch";
  buildmatchPanel.hidden = !show;
  buildmatchPanel.querySelectorAll('input[name="project_type"]').forEach((input) => {
    input.required = show;
    if (!show) input.checked = false;
  });
}

function payload() {
  const data = new FormData(form);
  const params = new URLSearchParams(window.location.search);

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
    project_type: data.get("project_type"),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "",
    preferred_contact: data.get("preferred_contact"),
    consent_to_contact: data.get("consent_to_contact") === "on",
    raw_notes: data.get("raw_notes"),
    website: data.get("website"),
    turnstileToken: turnstileToken(),
    source: "online",
    page_path: window.location.pathname,
    referrer: document.referrer,
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
  const copy = resolveRouteCopy(route, lead);
  const priority = tagPriority(lead);

  routePreview.textContent = copy.title;
  routePromise.textContent = copy.promise;
  routeTitle.textContent = copy.industry ? `BuildMatch — ${copy.industry}` : copy.title;
  routeDetail.textContent = previewLaneDetail(lead, copy);
  leadType.textContent = formatIdentityLabel(lead);
  valuePreview.textContent = lead.value || "Pending";
  urgencyPreview.textContent = lead.urgency || "Pending";
  priorityPreview.textContent = `Priority: ${priority}`;

  mirrorCopy.textContent = mirrorLine(lead);
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
    project_type: data.project_type,
  };
}

function resolveRouteCopy(routeName, lead) {
  const base = { ...ROUTES[routeName] };
  if (routeName === "BuildMatch" && BUILDMATCH_INDUSTRIES[lead.project_type]) {
    const industry = BUILDMATCH_INDUSTRIES[lead.project_type];
    return {
      title: "BuildMatch",
      promise: industry.promise,
      nextStep: industry.nextStep,
      industry: industry.label,
    };
  }
  return base;
}

function formatIdentityLabel(lead) {
  if (!lead.identity) return "Pending";
  if (lead.identity === "builder") return "Collaborator";
  if (lead.identity === "friend") return "Network";
  if (lead.identity === "buildmatch") {
    const industry = BUILDMATCH_INDUSTRIES[lead.project_type];
    return industry ? `BuildMatch — ${industry.label}` : "BuildMatch";
  }
  return lead.identity;
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

function mirrorLine(lead) {
  const lines = {
    client: "You are likely here to turn a workflow, project, or business pressure into execution.",
    investor: "You are likely looking for the bigger strategic map: ventures, timing, and leverage.",
    builder: "You are likely bringing talent, tools, or collaboration energy as a collaborator.",
    buildmatch: "You are on BuildMatch — pick Construction or Home services on step 1.",
    friend: "You are in the Network line: warm intros and people context.",
    founder: "You are likely a solo founder looking for accountability without coaching fluff.",
  };

  const params = new URLSearchParams(window.location.search);
  const campaign = (params.get("utm_campaign") || "").toLowerCase();
  if (CAMPAIGNS[campaign]) {
    return CAMPAIGNS[campaign].lede;
  }

  if (campaign === "founder-audit") {
    return "You are looking at Founder Audit — a 5-day audit of how you run your company solo.";
  }

  if (lead.identity === "buildmatch" && BUILDMATCH_INDUSTRIES[lead.project_type]) {
    return BUILDMATCH_INDUSTRIES[lead.project_type].mirror;
  }

  return lines[lead.identity] || "Use the steps below — the preview updates as you answer.";
}

function previewLaneDetail(lead, copy) {
  if (!lead.identity) {
    return "Identity, intent, value, and urgency determine the likely product line.";
  }
  if (!lead.intent || !lead.value || !lead.urgency) {
    const hints = {
      client: "Likely SourceA client work — finish the steps to confirm.",
      investor: "Likely Noetfield strategic review — finish the steps to confirm.",
      builder: "Likely Forge — collaborator review. Finish the steps to confirm.",
      buildmatch: lead.project_type
        ? `Likely BuildMatch — ${BUILDMATCH_INDUSTRIES[lead.project_type]?.label || lead.project_type}.`
        : "Likely BuildMatch — pick Construction or Home services first.",
      friend: "Likely Personal — network intro. Finish the steps to confirm.",
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

  node.querySelector("h2").textContent = lead.route.industry
    ? `Inquiry received — BuildMatch (${lead.route.industry})`
    : `Inquiry received — ${lead.route.title}`;
  node.querySelector(".success-route").textContent = `${lead.route.promise} Priority: ${lead.priority_tag}.`;
  const reasonEl = node.querySelector(".success-reason");
  if (lead.route_reason) {
    reasonEl.textContent = `Why this product line: ${lead.route_reason}`;
  } else {
    reasonEl.hidden = true;
  }
  node.querySelector(".success-ref").textContent = `Confirmation code ${ref} — save this if you follow up.`;
  node.querySelector(".success-review").textContent =
    "Sina reviews inquiries within 48 hours on business days.";
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
  form.querySelector("#send-another-button")?.addEventListener("click", () => window.location.reload());

  routePreview.textContent = lead.route.title;
  routePromise.textContent = lead.route.promise;
  routeTitle.textContent = lead.route.title;
  routeDetail.textContent = lead.route.nextStep;
  leadType.textContent = lead.lead_type;
  priorityPreview.textContent = `Priority: ${lead.priority_tag}`;
  mirrorCopy.textContent = `Inquiry saved for ${lead.route.title} review.`;
}

function formatReference(leadId, requestId) {
  const raw = String(leadId || requestId || "");
  if (!raw) return "—";
  return raw.slice(0, 8).toUpperCase();
}

function setBusy(isBusy) {
  submitButton.disabled = isBusy;
  nextButton.disabled = isBusy;
  backButton.disabled = isBusy;
  submitButton.textContent = isBusy ? "Sending..." : "Submit inquiry";
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
    modeBanner.textContent = "Test mode: submissions are marked as test inquiries.";
    return;
  }

  modeBanner.hidden = true;
}

function renderTurnstile() {
  if (!runtimeConfig.turnstileSiteKey || !turnstileSlot) return;

  const script = document.createElement("script");
  script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
  script.async = true;
  script.defer = true;
  document.head.append(script);

  const widget = document.createElement("div");
  widget.className = "cf-turnstile";
  widget.dataset.sitekey = runtimeConfig.turnstileSiteKey;
  turnstileSlot.append(widget);
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
