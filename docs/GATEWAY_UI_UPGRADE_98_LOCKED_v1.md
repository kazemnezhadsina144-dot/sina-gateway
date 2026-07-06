# Sina Gateway — 98 UI Upgrade Locked Plan v1

**Status:** Locked · **Date:** 2026-07-06  
**Author:** Sina Kazemnezhad (founder)  
**Doctrine:** UNLOCK DOCTRINE v2 · receipt-native · no fakes · human vocabulary v2  
**Scope:** `public/` intake UI, wedge landings, shared CSS/JS — not venture repo merges  
**Research:** [`GATEWAY_UI_UPGRADE_RESEARCH_2026_v1.md`](./GATEWAY_UI_UPGRADE_RESEARCH_2026_v1.md)  
**Copy rules:** [`SINA_GATEWAY_CLIENT_VOCABULARY_LOCKED_v1.md`](./SINA_GATEWAY_CLIENT_VOCABULARY_LOCKED_v1.md)

---

## How to read this

98 concrete UI upgrades for the commercial megagateway intake experience. Each item is buildable, numbered 1–98 for commits and PRs. Cross-reference `docs/GATEWAY_888_UPGRADES_PLAN.md` where themes overlap — this doc is **UI-only** and locked for execution.

**Priority codes:**
- `NOW` — next 30 days post-research
- `NEXT` — 30–90 days
- `LATER` — 90+ days
- `FOUNDER` — copy, assets, or decision only Sina can supply
- `ANTI` — do NOT build

**Execution batches (recommended):**
- **Batch A:** 1–4, 11–14, 19–22, 31–34, 41–44, 53–56
- **Batch B:** 5–8, 15–18, 23–26, 35–38, 45–48, 57–60
- **Batch C:** 9–10, 27–30, 39–40, 49–52, 61–62, 63–68, 83–86
- **Batch D:** 73–82
- **Batch E:** 91–95, 96–98

---

## Theme 1 — Layout & information architecture (1–10)

1. `NOW` **Form-first layout** — wizard + routing console above the fold; route map and what-next move below or into accordions.
2. `NOW` **Single primary column width** — cap readable line length on hero; wizard gets dominant grid share on desktop.
3. `NEXT` **Sticky top bar** — Sina Gateway wordmark, link to Status, link to `@Gateway_A` (no fake nav).
4. `NEXT` **Accordion “Where inquiries go”** — collapsed by default; expand on click/tap.
5. `NEXT` **Accordion “What happens after you send”** — collapsed by default; keep honest 48h SLA inside.
6. `NEXT` **Scroll-compact hero** — headline + one-line lede shrink after first wizard interaction.
7. `LATER` **Optional dark “ops” theme** — toggle or `prefers-color-scheme`; must pass contrast audit.
8. `LATER` **Print stylesheet** — success screen + confirmation code printable.
9. `ANTI` **No infinite scroll marketing page** — this is intake, not a blog.
10. `ANTI` **No popup modals on landing** — no email gates, no newsletter intercept.

---

## Theme 2 — Hero & first screen (11–18)

11. `NOW` **One-line hero headline** — outcome-first; defer long subcopy to mirror line.
12. `NOW` **Identity-aware mirror lede** — `#mirror-copy` cross-fades when identity or BuildMatch industry changes.
13. `NEXT` **Campaign wedge hero takeover** — `utm_campaign` swaps headline + lede + banner (extend current wedges).
14. `NEXT` **Secondary text CTA** — “See where inquiries go” scrolls to accordion, not a second submit path.
15. `NEXT` **Hero empty state** — before step 1 answer: “Pick who you are — preview updates live.”
16. `NEXT` **Founder Audit hero variant** — blunt tone allowed on wedge only (per vocabulary).
17. `LATER` **Scroll-linked headline** — subtle opacity/translate on scroll (respect `prefers-reduced-motion`).
18. `ANTI` **No autoplay video hero** — kills LCP on mobile.

---

## Theme 3 — Wizard structure & steps (19–30)

19. `NOW` **Named stepper labels** — Who you are → Goal → Value → Timeline → Contact (not only “Step N of 5”).
20. `NOW` **Labeled progress bar** — tick marks per named step under fill.
21. `NEXT` **Step transition animation** — fade/slide 150–250ms in `goTo()`; focus first field of new step.
22. `NEXT` **Back button preserves answers** — already true; add visual “edited” hint on return.
23. `NEXT` **Disable auto-advance on mobile** — tap Next explicitly (reduce accidental skips).
24. `NEXT` **Conditional step count** — show “Step 2 of 5” vs hidden BuildMatch sub-step clarity when industry required.
25. `NEXT` **Inline step error summary** — one line above actions when validation fails.
26. `NEXT` **Optional field badges** — Company, Role, City marked “Optional” consistently.
27. `LATER` **3-step mobile collapse** — merge intent + value on small breakpoints when data supports routing.
28. `LATER` **Save draft to sessionStorage** — restore on reload within 24h (no PII in URL).
29. `LATER` **Abandon recovery** — if email captured early in future flow, founder manual only until email wired.
30. `ANTI` **No CAPTCHA beyond Turnstile** — no second bot layer.

---

## Theme 4 — Identity & selection UX (31–40)

31. `NOW` **Identity cards** — replace plain radios with large cards: Client, Investor, Collaborator, BuildMatch, Network.
32. `NOW` **Card icons** — simple SVG per identity (no stock photos).
33. `NOW` **Card microcopy** — one outcome line per card (“Client → governed execution review”).
34. `NEXT` **Selected card elevation** — border glow + checkmark; lane color tint on select.
35. `NEXT` **Keyboard card navigation** — arrow keys + Enter; roving `tabindex` on grid.
36. `NEXT` **BuildMatch card expansion** — industry panel animates open inside step 1 (already partial — polish).
37. `NEXT` **Hide irrelevant value options** — e.g. Investor rarely needs “Referral” value tile (conditional logic).
38. `NEXT` **Intent cards** — same card pattern for step 2 (Hire, Invest, Partner, etc.).
39. `LATER` **Tooltips on hover** — desktop only; plain language definitions.
40. `ANTI` **No emoji-only identity labels** — keep professional tone.

---

## Theme 5 — Live routing console (41–52)

41. `NOW` **Routing diagram** — SVG/CSS: You → Gateway → Product line; updates on `updateMirror()`.
42. `NOW` **Lane color tokens** — SourceA, Noetfield, TrustField, BuildMatch, Forge, Personal, Founder Audit.
43. `NOW` **Tint preview panel** — `signal-panel` + `route-card` border/background follow active lane color.
44. `NEXT` **Animate diagram edge** — short pulse when route changes between steps.
45. `NEXT` **Show route reason in preview** — human string from API (`Why this product line: …`) before submit.
46. `NEXT` **Priority chip** — visual badge for high / medium / low (not only text).
47. `NEXT` **BuildMatch industry in diagram** — sub-node: BuildMatch → Construction | Home services.
48. `NEXT` **“Preview only” banner** — until step 5: “Nothing saved until you submit.”
49. `LATER` **Public `/demo` routing playground** — no DB write; fake answers for education.
50. `LATER` **Interactive route map** — click product line in accordion highlights diagram.
51. `LATER` **Mini-map on success** — show final path with confirmation code.
52. `ANTI` **No fake “AI is thinking” spinner** — routing is deterministic; show instant feedback.

---

## Theme 6 — Visual system & motion (53–62)

53. `NOW` **Tighten H1 clamp on mobile** — reduce max size; keep desktop impact.
54. `NOW` **Unified border radius** — 12px cards, 8px inputs (already close — lock in tokens).
55. `NEXT` **CSS custom properties for lanes** — `--lane-sourcea`, etc., in `:root`.
56. `NEXT` **Focus-visible rings** — all interactive elements; WCAG 2.2 focus appearance.
57. `NEXT` **Hover states on all cards** — subtle lift `transform: translateY(-1px)`.
58. `NEXT` **Reduced motion media query** — disable transitions when `prefers-reduced-motion: reduce`.
59. `NEXT` **Loading state on submit** — button text + disabled state; no full-page spinner.
60. `LATER` **Subtle grain or grid background** — high-tech feel without video.
61. `LATER` **Founder-chosen accent refresh** — `FOUNDER` pick one accent beyond green if needed.
62. `ANTI` **No parallax scroll** — accessibility and perf cost outweigh benefit here.

---

## Theme 7 — Mobile & accessibility (63–72)

63. `NOW` **Sticky wizard actions** — Next / Submit fixed to bottom on viewports &lt; 768px.
64. `NOW` **44px minimum tap targets** — audit all cards and buttons (partially done).
65. `NEXT` **Single-column wizard on mobile** — route card stacks above or below with tab switcher.
66. `NEXT` **Mobile preview tab** — “Form | Preview” toggle when sidebar hidden.
67. `NEXT` **Screen reader step announcements** — `aria-live` on step change with named label.
68. `NEXT` **Legend + fieldset audit** — every step has visible `legend`; BuildMatch nested fieldset OK.
69. `NEXT` **Contrast pass** — muted text `#5c6560` on paper meets 4.5:1 everywhere.
70. `LATER` **Full keyboard wizard path** — Tab order documented in `ROUTING.md` or UI doc.
71. `LATER` **High-contrast mode** — `prefers-contrast: more` overrides.
72. `ANTI` **No gesture-only interactions** — everything must work with keyboard and screen reader.

---

## Theme 8 — Lane landings & wedges (73–82)

73. `NEXT` **Founder Audit landing redesign** — product page layout: offer, price, 5-day deliverables, CTA.
74. `NEXT` **SourceA `/for-clients`** — governed execution story + embed or link to main wizard with UTM.
75. `NEXT` **BuildMatch landing** — platform + two industries (Construction / Home services) visual split.
76. `NEXT` **Shared landing component CSS** — `.legal-page` upgraded to `.wedge-page` system.
77. `NEXT` **Lane-colored wedge heroes** — each landing uses its lane token.
78. `NEXT` **OG image per wedge** — `/og-founder.svg`, `/og-sourcea.svg`, `/og-buildmatch.svg`.
79. `LATER` **Noetfield `/for-investors`** — strategic intake explainer.
80. `LATER` **Forge `/for-builders`** — collaborator intake explainer.
81. `LATER` **TrustField `/for-trust`** — compliance intake explainer.
82. `ANTI` **No fake testimonials on wedge pages** — case patterns only, no invented names.

---

## Theme 9 — Success, trust, post-submit (83–90)

83. `NOW` **Success animation** — confirmation code fades in; copy button brief highlight.
84. `NOW` **Trust strip at submit** — “Live capture · 48h review · Privacy link” above Turnstile.
85. `NEXT` **Post-submit timeline graphic** — 3 steps: code → review → follow-up.
86. `NEXT` **Copy confirmation code toast** — “Copied” state with `aria-live`.
87. `NEXT` **Share link on success** — `?ref=` intro link (888 cross-ref); no PII in URL.
88. `NEXT` **Telegram deep link** — `t.me/Gateway_A` + optional `t.me/GateWay_A_bot?start=…` when bot exists.
89. `LATER` **Lane-specific thank-you line** — one sentence next step per product line.
90. `ANTI` **No “We emailed you”** — unless email delivery is actually built.

---

## Theme 10 — Performance, assets, SEO surface (91–95)

91. `NOW` **Lighthouse mobile pass** — LCP &lt; 2.5s, document blockers in `styles.css`.
92. `NEXT` **Subset Inter or system stack** — remove unused font weights if any added later.
93. `NEXT` **Replace `og.svg`** — diagram showing Gateway → product lines; wedge variants.
94. `NEXT` **Preload critical CSS** — single stylesheet already; verify cache headers on Railway.
95. `LATER` **AVIF/WebP hero illustration** — if custom illustration added; with SVG fallback.

---

## Theme 11 — Measurement & anti-patterns (96–98)

96. `NOW` **Client-side funnel events** — `step_view`, `identity_select`, `industry_select`, `submit_success` (no PII).
97. `NEXT` **Weekly UI funnel readout** — founder reviews drop-off by step in Supabase or logs.
98. `ANTI` **Global anti-fake UI law** — no star ratings, logo walls, “thousands of users,” or corporate “we” on gateway surfaces.

---

## Locked principles (do not violate)

1. **Human vocabulary** — inquiry, product line, confirmation code (see client vocabulary doc).
2. **Honest founder** — one operator; no fake team or 24/7 chat.
3. **Routing is the product** — UI shows sorting live; do not hide the engine behind marketing fluff.
4. **BuildMatch is a platform** — Construction and Home services stay separate; never merge in UI.
5. **Performance is UX** — ship motion only if LCP budget holds.

---

## Definition of done (UI v2 milestone)

- [ ] Items 1–4, 11, 19–20, 31–33, 41–43, 53–54, 63–64, 83–84, 91, 96 **shipped**
- [ ] Mobile sticky CTA + routing diagram live on production
- [ ] Founder Audit landing matches wedge page standard (item 73)
- [ ] Lighthouse mobile LCP &lt; 2.5s on production URL
- [ ] No vocabulary regressions (`signal`, `lane`, `Send signal` on public surfaces)

---

## Amendment log

| Version | Date | Change |
|---------|------|--------|
| v1 | 2026-07-06 | Initial lock — 98 items from July 2026 UI research pass |

---

## Reference in commits

```text
UI #31 identity cards (GATEWAY_UI_UPGRADE_98_LOCKED_v1)
```
