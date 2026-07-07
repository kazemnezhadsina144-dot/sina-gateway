const STEP_LABELS = ["Who you are", "Goal", "Value", "Timeline", "Contact"];
const DRAFT_KEY = "sina_gateway_draft_v1";
const DRAFT_TTL_MS = 24 * 60 * 60 * 1000;
const INTRO_REF_KEY = "sg_intro_ref_v1";

const VALUE_VISIBILITY = {
  client: ["deal", "project", "lead", "risk"],
  investor: ["deal", "capital", "project", "risk"],
  builder: ["project", "talent", "deal", "lead"],
  buildmatch: ["project", "deal", "lead"],
  friend: ["lead", "project"],
};

const LANE_THANKS = {
  SourceA: "Queued for SourceA — governed execution review within 48 business hours.",
  Noetfield: "Sorted to Noetfield — strategic and partnership review within 48 business hours.",
  TrustField: "Routed to TrustField — trust and compliance review within 48 business hours.",
  Forge: "Sorted to Forge — builder and collaboration review within 48 business hours.",
  Personal: "Saved as a network intro — warm context only, no marketing blast.",
  FounderAudit: "Founder Audit signal received — blunt operating-system review within 48 business hours.",
};

const CAMPAIGNS = {
  "founder-audit": {
    headline: "Founder Audit — no fluff, just your operating system checked.",
    lede: "Five days. Decisions, commitments, offer, pipeline — audited and ledgered. Solo technical founders only.",
    banner: "Founder Audit — blunt accountability for solo AI founders.",
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
  noetfield: {
    headline: "Noetfield intake — strategic and partnership review.",
    lede: "Send capital, venture, and partnership inquiries for strategic sorting — not generic pitch spam.",
    banner: "Noetfield — investor and strategic partnership lane.",
  },
  forge: {
    headline: "Forge intake — builder and collaborator review.",
    lede: "Share what you build, ship, or want to collaborate on — sorted to Forge for builder review.",
    banner: "Forge — collaborators and builders lane.",
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
const workspace = document.querySelector(".workspace");
const heroCompact = document.querySelector(".hero-compact");
const steps = [...document.querySelectorAll(".step")];
const backButton = document.querySelector("#back-button");
const nextButton = document.querySelector("#next-button");
const submitButton = document.querySelector("#submit-button");
const statusEl = document.querySelector("#form-status");
const progressFill = document.querySelector("#progress-fill");
const progressSteps = document.querySelector("#progress-steps");
const stepCount = document.querySelector("#step-count");
const priorityPreview = document.querySelector("#priority-preview");
const routePreview = document.querySelector("#route-preview");
const routePromise = document.querySelector("#route-promise");
const routeTitle = document.querySelector("#route-title");
const routeDetail = document.querySelector("#route-detail");
const routeReasonPreview = document.querySelector("#route-reason-preview");
const routeDiagramDest = document.querySelector("#route-diagram-dest");
const routeDiagramIndustry = document.querySelector("#route-diagram-industry");
const routeEdgeB = document.querySelector("#route-edge-b");
const leadType = document.querySelector("#lead-type");
const valuePreview = document.querySelector("#value-preview");
const urgencyPreview = document.querySelector("#urgency-preview");
const mirrorCopy = document.querySelector("#mirror-copy");
const modeBanner = document.querySelector("#mode-banner");
const previewBanner = document.querySelector("#preview-banner");
const stepError = document.querySelector("#step-error");
const valueGrid = document.querySelector("#value-grid");
const buildmatchPanel = document.querySelector("#buildmatch-industry-panel");
const turnstileSlot = document.querySelector("#turnstile-slot");
const stepAnnouncer = document.querySelector("#step-announcer");
const workspaceTabs = document.querySelector("#workspace-tabs");
const previewPane = document.querySelector("#preview-pane");
const routeMapList = document.querySelector("#route-map-list");

const demoMode = new URLSearchParams(window.location.search).get("demo") === "1";

const isMobileWizard = () =>
  window.matchMedia("(max-width: 820px)").matches || window.matchMedia("(pointer: coarse)").matches;

let currentStep = -1;
let heroEngaged = false;
let lastDiagramDest = "";
const visitedSteps = new Set();
let runtimeConfig = { captureMode: "unknown", testMode: false, turnstileSiteKey: "", routingRules: [] };
let turnstileRendered = false;

form.addEventListener("change", (event) => {
  markHeroEngaged();
  syncBuildMatchPanel();
  if (event.target.name === "identity") {
    syncValueOptions();
    trackFunnel("identity_select", { identity: event.target.value });
  }
  if (event.target.name === "project_type") {
    trackFunnel("industry_select", { project_type: event.target.value });
  }
  updateMirror();
  clearStepError();
  saveDraft();
  if (shouldAutoAdvance() && currentStep < steps.length - 1 && stepIsValid(currentStep)) {
    setTimeout(() => goTo(currentStep + 1), 120);
  }
});

backButton.addEventListener("click", () => {
  clearStepError();
  goTo(Math.max(0, currentStep - 1));
});

nextButton.addEventListener("click", () => {
  if (!stepIsValid(currentStep)) {
    showStepError(stepValidationMessage(currentStep));
    steps[currentStep].querySelector("input, textarea, select")?.reportValidity();
    return;
  }
  clearStepError();
  goTo(Math.min(steps.length - 1, currentStep + 1));
});

form.addEventListener("input", () => {
  saveDraft();
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  statusEl.textContent = "";

  if (!form.reportValidity()) return;

  if (demoMode) {
    showDemoSuccess();
    return;
  }

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

    const submitted = payload();
    showSuccess({ ...result, submittedMeta: submitted });
  } catch (error) {
    statusEl.textContent = `Could not save inquiry yet: ${error.message}`;
  } finally {
    setBusy(false);
  }
});

boot();

async function boot() {
  captureIntroRefFromUrl();
  runtimeConfig = await loadConfig();
  if (runtimeConfig.routes) ROUTES = runtimeConfig.routes;
  if (runtimeConfig.buildmatchIndustries) {
    Object.assign(BUILDMATCH_INDUSTRIES, runtimeConfig.buildmatchIndustries);
  }
  applyCampaignWedge();
  renderDemoMode();
  renderRuntimeMode();
  wireCardGrids();
  wireHeroScroll();
  wireMobileTabs();
  wireRouteMap();
  const restored = restoreDraft();
  syncBuildMatchPanel();
  syncValueOptions();
  goTo(restored ? currentStep : 0);
  updateMirror();
  syncMobileLayout();
  window.addEventListener("resize", syncMobileLayout);
}

function applyCampaignWedge() {
  const params = new URLSearchParams(window.location.search);
  const campaign = (params.get("utm_campaign") || "").toLowerCase();
  const wedge = CAMPAIGNS[campaign];
  if (!wedge) return;

  const title = document.querySelector("#page-title");
  const lede = document.querySelector(".lede-mirror") || document.querySelector(".lede");
  if (title) title.textContent = wedge.headline;
  if (lede) setMirrorText(wedge.lede, false);

  if (modeBanner && wedge.banner) {
    modeBanner.hidden = false;
    modeBanner.classList.add("wedge-banner");
    modeBanner.textContent = wedge.banner;
  }

  if (campaign === "buildmatch") {
    const buildmatchIdentity = form.querySelector('input[name="identity"][value="buildmatch"]');
    if (buildmatchIdentity) buildmatchIdentity.checked = true;
    const industry = (params.get("project_type") || "").toLowerCase();
    if (industry === "construction" || industry === "home_services") {
      const projectType = form.querySelector(`input[name="project_type"][value="${industry}"]`);
      if (projectType) projectType.checked = true;
    }
    syncBuildMatchPanel();
  }

  if (campaign === "sourcea") {
    const clientIdentity = form.querySelector('input[name="identity"][value="client"]');
    if (clientIdentity) clientIdentity.checked = true;
  }
}

function renderDemoMode() {
  if (!demoMode || !previewBanner) return;
  previewBanner.hidden = false;
  previewBanner.classList.add("demo-banner");
  previewBanner.textContent = "Demo mode — answers update the preview but nothing is saved.";
}

function wireMobileTabs() {
  if (!workspaceTabs) return;
  workspaceTabs.querySelectorAll(".workspace-tab").forEach((tab) => {
    tab.addEventListener("click", () => setMobileTab(tab.dataset.tab));
  });
}

function syncMobileLayout() {
  const mobile = isMobileWizard();
  workspace?.classList.toggle("is-mobile-tabs", mobile);
  if (workspaceTabs) workspaceTabs.hidden = !mobile;

  if (!mobile) {
    document.querySelectorAll(".workspace-pane").forEach((pane) => {
      pane.classList.add("is-active");
    });
    return;
  }

  const activeTab = workspaceTabs?.querySelector(".workspace-tab.is-active")?.dataset.tab || "form";
  setMobileTab(activeTab);
}

function setMobileTab(tab) {
  workspaceTabs?.querySelectorAll(".workspace-tab").forEach((button) => {
    const active = button.dataset.tab === tab;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-selected", active ? "true" : "false");
  });

  document.querySelectorAll(".workspace-pane").forEach((pane) => {
    pane.classList.toggle("is-active", pane.dataset.pane === tab);
  });
}

function wireRouteMap() {
  routeMapList?.querySelectorAll(".route-map-item").forEach((item) => {
    item.querySelector(".route-map-hit")?.addEventListener("click", () => {
      highlightRouteMapItem(item);
      const lane = item.dataset.lane;
      if (workspace && lane) workspace.dataset.lane = lane;
      document.getElementById("details-routes")?.removeAttribute("open");
      if (workspace?.classList.contains("is-mobile-tabs")) setMobileTab("preview");
      document.getElementById("intake")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

function highlightRouteMapItem(activeItem) {
  routeMapList?.querySelectorAll(".route-map-item").forEach((item) => {
    item.classList.toggle("is-highlighted", item === activeItem);
  });
}

function announceStep(index) {
  if (!stepAnnouncer) return;
  stepAnnouncer.textContent = `Now on ${STEP_LABELS[index]}, step ${index + 1} of ${steps.length}.`;
}

function saveDraft() {
  if (demoMode) return;
  const fields = Object.fromEntries(new FormData(form).entries());
  fields._last_step = String(currentStep);
  try {
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ savedAt: Date.now(), fields }));
  } catch {
    // ignore quota errors
  }
}

function restoreDraft() {
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    if (!raw) return false;
    const draft = JSON.parse(raw);
    if (!draft?.savedAt || Date.now() - draft.savedAt > DRAFT_TTL_MS) {
      sessionStorage.removeItem(DRAFT_KEY);
      return false;
    }

    for (const [name, value] of Object.entries(draft.fields || {})) {
      if (name === "website" || name === "_last_step") continue;
      const field = form.elements.namedItem(name);
      if (!field) continue;

      if (field instanceof RadioNodeList) {
        const radio = form.querySelector(`input[name="${name}"][value="${value}"]`);
        if (radio) radio.checked = true;
        continue;
      }

      if (field.type === "checkbox") {
        field.checked = value === "on";
      } else {
        field.value = value;
      }
    }

    const lastStep = Number(draft.fields?._last_step);
    if (Number.isFinite(lastStep) && lastStep >= 0 && lastStep < steps.length) {
      currentStep = lastStep;
    }
    return true;
  } catch {
    return false;
  }
}

function clearDraft() {
  sessionStorage.removeItem(DRAFT_KEY);
}

function shouldAutoAdvance() {
  return !isMobileWizard();
}

function wireHeroScroll() {
  if (!heroCompact || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  window.addEventListener(
    "scroll",
    () => {
      const scroll = Math.min(window.scrollY / 140, 1);
      heroCompact.style.setProperty("--hero-scroll", String(scroll));
    },
    { passive: true },
  );
}

function wireCardGrids() {
  document.querySelectorAll("[data-card-grid]").forEach((grid) => {
    const inputs = [...grid.querySelectorAll('input[type="radio"]')];
    if (!inputs.length) return;

    const syncTabIndex = () => {
      const checkedIndex = inputs.findIndex((input) => input.checked);
      const focusIndex = checkedIndex >= 0 ? checkedIndex : 0;
      inputs.forEach((input, index) => {
        input.tabIndex = index === focusIndex ? 0 : -1;
      });
    };

    syncTabIndex();
    grid.addEventListener("change", syncTabIndex);
    grid.addEventListener("keydown", (event) => {
      const currentIndex = inputs.indexOf(document.activeElement);
      if (currentIndex < 0) return;

      let nextIndex = currentIndex;

      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        event.preventDefault();
        nextIndex = (currentIndex + 1) % inputs.length;
      } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        event.preventDefault();
        nextIndex = (currentIndex - 1 + inputs.length) % inputs.length;
      } else if (event.key === "Home") {
        event.preventDefault();
        nextIndex = 0;
      } else if (event.key === "End") {
        event.preventDefault();
        nextIndex = inputs.length - 1;
      } else {
        return;
      }

      inputs[nextIndex].focus();
      inputs[nextIndex].checked = true;
      inputs[nextIndex].dispatchEvent(new Event("change", { bubbles: true }));
    });
  });
}

function syncValueOptions() {
  if (!valueGrid) return;
  const identity = form.querySelector('input[name="identity"]:checked')?.value;
  const allowed = identity
    ? VALUE_VISIBILITY[identity] || []
    : ["deal", "project", "lead", "capital", "talent", "risk"];

  valueGrid.querySelectorAll("label[data-value]").forEach((label) => {
    const value = label.dataset.value;
    const show = allowed.includes(value);
    label.classList.toggle("is-hidden", !show);
    const input = label.querySelector('input[type="radio"]');
    if (!show && input?.checked) input.checked = false;
  });
}

function showStepError(message) {
  if (!stepError) return;
  stepError.hidden = !message;
  stepError.textContent = message || "";
}

function clearStepError() {
  showStepError("");
}

function stepValidationMessage(index) {
  const identity = form.querySelector('input[name="identity"]:checked');
  if (index === 0 && !identity) return "Pick who you are to continue.";
  if (index === 0 && identity?.value === "buildmatch" && !form.querySelector('input[name="project_type"]:checked')) {
    return "Pick a BuildMatch industry — Construction or Home services.";
  }
  const labels = ["an identity", "a goal", "a value type", "a timeline"];
  if (index < labels.length) return `Choose ${labels[index]} before continuing.`;
  return "Complete the required fields on this step.";
}

function formatStepLabel(index) {
  const name = STEP_LABELS[index] || `Step ${index + 1}`;
  const ordinal = `Step ${index + 1} of ${steps.length}`;
  const identity = form.querySelector('input[name="identity"]:checked')?.value;
  if (index === 0 && identity === "buildmatch" && !form.querySelector('input[name="project_type"]:checked')) {
    return `${name} · ${ordinal} — pick BuildMatch industry`;
  }
  return `${name} · ${ordinal}`;
}

function markHeroEngaged() {
  if (heroEngaged) return;
  heroEngaged = true;
  heroCompact?.classList.add("is-engaged");
}

function goTo(index) {
  if (index !== currentStep) visitedSteps.add(currentStep);

  const stepChanged = index !== currentStep;
  currentStep = index;
  markHeroEngaged();

  steps.forEach((step, stepIndex) => {
    const isActive = stepIndex === index;
    step.classList.toggle("is-active", isActive);
    if (isActive) {
      step.classList.remove("is-entering");
      void step.offsetWidth;
      step.classList.add("is-entering");
      window.setTimeout(() => step.classList.remove("is-entering"), 240);
    }
  });

  const label = formatStepLabel(index);
  stepCount.textContent = label;
  progressFill.style.width = `${((index + 1) / steps.length) * 100}%`;
  updateProgressSteps(index);
  backButton.hidden = index === 0;
  nextButton.hidden = index === steps.length - 1;
  submitButton.hidden = index !== steps.length - 1;
  if (previewBanner && !demoMode) previewBanner.hidden = index === steps.length - 1;
  if (index === steps.length - 1) ensureTurnstile();
  clearStepError();
  if (stepChanged) {
    announceStep(index);
    trackFunnel("step_view", { step: index, step_label: STEP_LABELS[index] });
  }
  updateMirror();
  saveDraft();

  const focusTarget = steps[index]?.querySelector(
    "input:not([type='hidden']):not(.trap input), textarea, select, button",
  );
  focusTarget?.focus({ preventScroll: true });
}

function updateProgressSteps(index) {
  if (!progressSteps) return;
  progressSteps.querySelectorAll("li").forEach((item, stepIndex) => {
    item.classList.toggle("is-done", stepIndex < index);
    item.classList.toggle("is-current", stepIndex === index);
    item.classList.toggle("is-visited", visitedSteps.has(stepIndex) && stepIndex !== index);
  });
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
  buildmatchPanel.classList.toggle("is-open", show);
  buildmatchPanel.setAttribute("aria-hidden", show ? "false" : "true");
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
    referrer: introReferrer(),
    utm_source: params.get("utm_source") || "",
    utm_medium: params.get("utm_medium") || "",
    utm_campaign: params.get("utm_campaign") || "",
    utm_content: params.get("utm_content") || "",
    utm_term: params.get("utm_term") || "",
    session_id: sessionId(),
    visitor_id: visitorId(),
  };
}

function updateMirror() {
  const lead = routingLead();
  const route = routeVenture(lead);
  const copy = resolveRouteCopy(route, lead);
  const priority = tagPriority(lead);
  const reason = previewRouteReason(lead, route);

  routePreview.textContent = copy.title;
  routePromise.textContent = copy.promise;
  routeTitle.textContent = copy.industry ? `BuildMatch — ${copy.industry}` : copy.title;
  routeDetail.textContent = previewLaneDetail(lead, copy);
  leadType.textContent = formatIdentityLabel(lead);
  valuePreview.textContent = lead.value || "Pending";
  urgencyPreview.textContent = lead.urgency || "Pending";

  priorityPreview.textContent = priorityLabel(priority);
  priorityPreview.className = "priority-chip";
  if (priority === "high") priorityPreview.classList.add("is-high");
  else if (priority === "medium") priorityPreview.classList.add("is-medium");
  else priorityPreview.classList.add("is-low");

  if (routeReasonPreview) {
    if (reason && lead.identity) {
      routeReasonPreview.hidden = false;
      routeReasonPreview.textContent = `Why this product line: ${reason}`;
    } else {
      routeReasonPreview.hidden = true;
      routeReasonPreview.textContent = "";
    }
  }

  setMirrorText(mirrorLine(lead), Boolean(lead.identity));
  updateRoutingDiagram(copy, lead);
  if (workspace) workspace.dataset.lane = lead.identity ? route : "";
}

function priorityLabel(priority) {
  if (priority === "high") return "Priority: high";
  if (priority === "medium") return "Priority: medium";
  return "Priority: pending";
}

function previewRouteReason(lead, route) {
  const rule = runtimeConfig.routingRules?.find((candidate) => ruleMatches(candidate.match, lead));
  if (!rule) return "";
  if (route === "BuildMatch" && BUILDMATCH_INDUSTRIES[lead.project_type]) {
    return `You selected BuildMatch — ${BUILDMATCH_INDUSTRIES[lead.project_type].label}.`;
  }
  return rule.reason || "";
}

function diagramDestLabel(copy, lead) {
  if (!lead.identity) return "?";
  if (lead.identity === "buildmatch" && BUILDMATCH_INDUSTRIES[lead.project_type]) return "BuildMatch";
  if (copy.industry) return copy.title;
  return copy.title;
}

function updateRoutingDiagram(copy, lead) {
  if (!routeDiagramDest) return;

  const destLabel = diagramDestLabel(copy, lead);
  const isLit = Boolean(lead.identity);
  const industryLabel = BUILDMATCH_INDUSTRIES[lead.project_type]?.label || "";
  const showIndustry = lead.identity === "buildmatch" && industryLabel;
  const changed = lastDiagramDest && lastDiagramDest !== `${destLabel}|${industryLabel}`;

  routeDiagramDest.textContent = destLabel;
  routeDiagramDest.classList.toggle("is-lit", isLit);

  if (routeDiagramIndustry) {
    if (showIndustry) {
      routeDiagramIndustry.hidden = false;
      routeDiagramIndustry.textContent = industryLabel;
      routeDiagramIndustry.classList.add("is-lit");
    } else {
      routeDiagramIndustry.hidden = true;
      routeDiagramIndustry.textContent = "";
      routeDiagramIndustry.classList.remove("is-lit");
    }
  }

  if (routeEdgeB) {
    routeEdgeB.classList.toggle("is-lit", isLit);
    if (changed && isLit) {
      routeEdgeB.classList.remove("is-pulse");
      void routeEdgeB.offsetWidth;
      routeEdgeB.classList.add("is-pulse");
      window.setTimeout(() => routeEdgeB.classList.remove("is-pulse"), 500);
    }
  }

  lastDiagramDest = `${destLabel}|${industryLabel}`;
}

function setMirrorText(text, animate = true) {
  if (!mirrorCopy) return;
  if (!animate || mirrorCopy.textContent === text) {
    mirrorCopy.textContent = text;
    return;
  }

  mirrorCopy.classList.add("is-fading");
  window.setTimeout(() => {
    mirrorCopy.textContent = text;
    mirrorCopy.classList.remove("is-fading");
  }, 120);
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

  return lines[lead.identity] || mirrorCopy?.dataset.empty || "Pick who you are — preview updates live.";
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
  clearDraft();
  const lead = result.lead;
  trackFunnel("submit_success", {
    route: lead.route?.title || lead.venture_route || "",
    step: currentStep,
  });
  const template = document.querySelector("#success-template");
  const node = template.content.cloneNode(true);
  const ref = formatReference(lead.id, result.requestId);
  const successEl = node.querySelector(".success");

  node.querySelector("h2").textContent = lead.route.industry
    ? `Inquiry received — BuildMatch (${lead.route.industry})`
    : `Inquiry received — ${lead.route.title}`;
  node.querySelector(".success-route").textContent = `${lead.route.promise} Priority: ${lead.priority_tag}.`;
  const thanksEl = node.querySelector(".success-thanks");
  if (thanksEl) thanksEl.textContent = laneThankYou(lead);
  const reasonEl = node.querySelector(".success-reason");
  if (lead.route_reason) {
    reasonEl.textContent = `Why this product line: ${lead.route_reason}`;
  } else {
    reasonEl.hidden = true;
  }
  const refEl = node.querySelector(".success-ref");
  const meta = result.submittedMeta || {};
  const campaign = String(meta.utm_campaign || "").trim();
  refEl.textContent = campaign
    ? `Confirmation code ${ref} — campaign: ${campaign}. Save this if you follow up.`
    : `Confirmation code ${ref} — save this if you follow up.`;
  node.querySelector(".success-review").textContent =
    "Sina reviews inquiries within 48 hours on business days.";
  node.querySelector(".success-next").textContent = `Next: ${lead.route.nextStep}`;
  buildSuccessMinimap(lead, node.querySelector(".success-minimap"));

  form.replaceChildren(node);
  window.requestAnimationFrame(() => {
    successEl?.classList.add("is-entering");
    window.setTimeout(() => refEl?.classList.add("is-revealed"), 140);
  });

  const copyBtn = form.querySelector("#copy-ref-button");
  const shareBtn = form.querySelector("#share-ref-button");
  const copyToast = form.querySelector("#copy-toast");
  const shareUrl = `${window.location.origin}/?ref=${encodeURIComponent(ref)}`;
  const telegramLink = form.querySelector("#telegram-link");
  if (telegramLink) {
    telegramLink.href = `https://t.me/Gateway_A?start=ref_${encodeURIComponent(ref)}`;
  }
  copyBtn?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(ref);
      copyBtn.textContent = "Copied";
      copyBtn.classList.add("is-copied");
      if (copyToast) {
        copyToast.hidden = false;
        copyToast.textContent = "Confirmation code copied.";
        copyToast.classList.add("is-visible");
      }
    } catch {
      copyBtn.textContent = ref;
    }
  });
  shareBtn?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      shareBtn.textContent = "Intro link copied";
      shareBtn.classList.add("is-copied");
      if (copyToast) {
        copyToast.hidden = false;
        copyToast.textContent = "Intro link copied — no personal details in the URL.";
        copyToast.classList.add("is-visible");
      }
    } catch {
      shareBtn.textContent = shareUrl;
    }
  });
  form.querySelector("#send-another-button")?.addEventListener("click", () => window.location.reload());

  routePreview.textContent = lead.route.title;
  routePromise.textContent = lead.route.promise;
  routeTitle.textContent = lead.route.title;
  routeDetail.textContent = lead.route.nextStep;
  leadType.textContent = lead.lead_type;
  priorityPreview.textContent = priorityLabel(lead.priority_tag);
  priorityPreview.className = "priority-chip";
  if (lead.priority_tag === "high") priorityPreview.classList.add("is-high");
  else if (lead.priority_tag === "medium") priorityPreview.classList.add("is-medium");
  else priorityPreview.classList.add("is-low");
  if (routeReasonPreview && lead.route_reason) {
    routeReasonPreview.hidden = false;
    routeReasonPreview.textContent = `Why this product line: ${lead.route_reason}`;
  }
  setMirrorText(`Inquiry saved for ${lead.route.title} review.`, false);
  if (workspace) workspace.dataset.lane = lead.route.title;
  updateRoutingDiagram(
    { title: lead.route.title, industry: lead.route.industry },
    { identity: lead.lead_type === "collaborator" ? "builder" : lead.lead_type, project_type: lead.project_type },
  );
  syncMobileLayout();
}

function showDemoSuccess() {
  const lead = routingLead();
  const route = routeVenture(lead);
  const copy = resolveRouteCopy(route, lead);
  showSuccess({
    requestId: "DEMO0000",
    lead: {
      id: "demo000000000000",
      route: { ...copy, title: copy.title },
      route_reason: previewRouteReason(lead, route),
      priority_tag: tagPriority(lead),
      lead_type: formatIdentityLabel(lead),
    },
  });
}

function buildSuccessMinimap(lead, container) {
  if (!container) return;
  const label = lead.route.industry ? `BuildMatch · ${lead.route.industry}` : lead.route.title;
  container.innerHTML = `
    <span class="route-node is-lit">You</span>
    <span class="route-edge is-lit"></span>
    <span class="route-node is-lit">Gateway</span>
    <span class="route-edge is-lit"></span>
    <span class="route-node route-node-dest is-lit">${label}</span>
  `;
}

function formatReference(leadId, requestId) {
  const raw = String(leadId || requestId || "");
  if (!raw) return "—";
  return raw.slice(0, 8).toUpperCase();
}

function normalizeIntroRef(value) {
  const clean = String(value || "")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 8);
  return clean || "";
}

function captureIntroRefFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const ref = normalizeIntroRef(params.get("ref"));
  if (ref) sessionStorage.setItem(INTRO_REF_KEY, ref);
  return ref;
}

function introReferrer() {
  const ref = sessionStorage.getItem(INTRO_REF_KEY) || captureIntroRefFromUrl();
  if (ref) return `ref:${ref}`;
  return document.referrer || "";
}

function laneThankYou(lead) {
  const routeTitle = lead.route?.title || lead.venture_route || "";
  if (routeTitle === "BuildMatch") {
    const industry = lead.route?.industry || BUILDMATCH_INDUSTRIES[lead.project_type]?.label || "platform";
    return `Queued for BuildMatch — ${industry} review within 48 business hours.`;
  }
  return LANE_THANKS[routeTitle] || "Inquiry saved — Sina reviews within 48 business hours.";
}

function setBusy(isBusy) {
  submitButton.disabled = isBusy;
  nextButton.disabled = isBusy;
  backButton.disabled = isBusy;
  form.classList.toggle("is-busy", isBusy);
  submitButton.classList.toggle("is-submitting", isBusy);
  submitButton.setAttribute("aria-busy", isBusy ? "true" : "false");
  if (!isBusy) submitButton.textContent = "Submit inquiry";
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

function ensureTurnstile() {
  if (turnstileRendered || !runtimeConfig.turnstileSiteKey || !turnstileSlot) return;
  turnstileRendered = true;

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

function renderTurnstile() {
  ensureTurnstile();
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

function trackFunnel(event, detail = {}) {
  const params = new URLSearchParams(window.location.search);
  const payload = {
    event,
    timestamp: new Date().toISOString(),
    session_id: sessionId(),
    visitor_id: visitorId(),
    page_path: window.location.pathname,
    utm_campaign: params.get("utm_campaign") || "",
    step: currentStep,
    step_label: STEP_LABELS[currentStep],
    demo: demoMode,
    ...detail,
  };

  const body = JSON.stringify(payload);
  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/funnel", new Blob([body], { type: "application/json" }));
      return;
    }
    fetch("/api/funnel", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {});
  } catch {
    // analytics must never block intake
  }
}
