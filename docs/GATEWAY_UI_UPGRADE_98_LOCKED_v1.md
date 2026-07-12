# Sina Gateway — 98 UI Upgrade Locked Plan v2

**Status:** Executed (Batches A–E shipped) · **Date locked:** 2026-07-06 · **Date completed:** 2026-07-07  
**Author:** Sina Kazemnezhad (founder)  
**Doctrine:** UNLOCK DOCTRINE v2 · receipt-native · no fakes · human vocabulary v2  
**Scope:** `public/` intake UI, wedge landings, shared CSS/JS — not venture repo merges  
**Research:** [`GATEWAY_UI_UPGRADE_RESEARCH_2026_v1.md`](./GATEWAY_UI_UPGRADE_RESEARCH_2026_v1.md)  
**Copy rules:** [`SINA_GATEWAY_CLIENT_VOCABULARY_LOCKED_v1.md`](./SINA_GATEWAY_CLIENT_VOCABULARY_LOCKED_v1.md)  
**Production:** https://sina-gateway-production.up.railway.app/

---

## Execution summary (2026-07-07)

| Batch | Items | Commit | Shipped |
|-------|-------|--------|---------|
| **A** | 1–4, 11–14, 19–22, 31–34, 41–44, 53–56 | `cd2afcb` | Form-first intake, identity cards, routing console |
| **B** | 5–8, 15–18, 23–26, 35–38, 45–48, 57–60 | `1a4e92f` | Intent cards, mobile wizard fixes, route preview |
| **C** | 9–10, 27–30*, 39–40*, 49–52*, 61–62*, 63–68, 83–86 | `2ce1175` | Sticky mobile CTA, preview tabs, success flow, draft restore |
| **D** | 73–82* | `1c5c8ab` | Wedge landings: Founder Audit, SourceA, BuildMatch |
| **E** | 91–95*, 96–98 | `1f0a4ab` | Perf/cache, OG diagram, funnel events API |
| **F** | 91 | `7c4e1a4` | Lighthouse LCP pass: defer Turnstile, gzip static, critical CSS |
| **F** | 69, 71, 87, 89 | `eb409af` | Contrast audit, high-contrast mode, intro share link, lane thank-you |

| **G** | 79–80, 888 #10–12, #37, #41 | `3e3d7b2` | Investor/builder wedges, referrer DB, UTM chain, status API |
| **H** | 81, 88, 888 #21, #41, #111 | Phase 3 | TrustField wedge, Telegram bot webhook, how-it-works, ops weekly, lastSignalAt |

\*Batch includes ANTI/LATER items marked **DEFERRED** below — not built by design.

**Score:** **87 shipped** · **10 anti (hold)** · **5 deferred** · **0 partial**

**Founder ops:** `npm run funnel:readout` — weekly step drop-off from `data/funnel-events.jsonl`

---

## How to read this

98 concrete UI upgrades for the commercial megagateway intake experience. Each item is numbered 1–98. Status markers:

| Marker | Meaning |
|--------|---------|
| ✅ | Shipped to production (Batches A–E) |
| ◐ | Partial — core done; follow-up noted |
| ⏸ | Deferred — LATER / FOUNDER / not in wedge season |
| 🚫 | ANTI — do not build (verified clean) |

**Priority codes (original):** `NOW` · `NEXT` · `LATER` · `FOUNDER` · `ANTI`

---

## Theme 1 — Layout & information architecture (1–10)

1. ✅ `NOW` **Form-first layout** — wizard + routing console above the fold; route map and what-next in accordions.
2. ✅ `NOW` **Single primary column width** — capped hero; wizard dominant on desktop.
3. ✅ `NEXT` **Sticky top bar** — wordmark, Status, `@Gateway_A`.
4. ✅ `NEXT` **Accordion “Where inquiries go”** — collapsed by default.
5. ✅ `NEXT` **Accordion “What happens after you send”** — collapsed; honest 48h SLA inside.
6. ✅ `NEXT` **Scroll-compact hero** — `is-engaged` + smaller H1 after first interaction.
7. ⏸ `LATER` **Optional dark “ops” theme** — not shipped; needs contrast audit first.
8. ✅ `LATER` **Print stylesheet** — success + confirmation code printable (`@media print`).
9. 🚫 `ANTI` **No infinite scroll marketing page** — intake only; verified.
10. 🚫 `ANTI` **No popup modals on landing** — verified.

---

## Theme 2 — Hero & first screen (11–18)

11. ✅ `NOW` **One-line hero headline** — outcome-first; mirror holds subcopy.
12. ✅ `NOW` **Identity-aware mirror lede** — `#mirror-copy` cross-fades on identity/industry.
13. ✅ `NEXT` **Campaign wedge hero takeover** — `utm_campaign` swaps headline, lede, banner.
14. ✅ `NEXT` **Secondary text CTA** — “See where inquiries go” → `#details-routes` accordion.
15. ✅ `NEXT` **Hero empty state** — “Pick who you are — preview updates live.”
16. ✅ `NEXT` **Founder Audit hero variant** — blunt wedge copy on `utm_campaign=founder-audit`.
17. ✅ `LATER` **Scroll-linked headline** — `--hero-scroll` opacity/translate (reduced-motion safe).
18. 🚫 `ANTI` **No autoplay video hero** — verified.

---

## Theme 3 — Wizard structure & steps (19–30)

19. ✅ `NOW` **Named stepper labels** — Who you are → Goal → Value → Timeline → Contact.
20. ✅ `NOW` **Labeled progress bar** — named ticks under fill.
21. ✅ `NEXT` **Step transition animation** — `is-entering` 220ms; focus first field in `goTo()`.
22. ✅ `NEXT` **Back button preserves answers** — `is-visited` hint on progress steps.
23. ✅ `NEXT` **Disable auto-advance on mobile** — coarse pointer / ≤820px requires Next tap.
24. ✅ `NEXT` **Conditional step count** — `Step N of 5` + BuildMatch industry hint.
25. ✅ `NEXT` **Inline step error summary** — `#step-error` above actions.
26. ✅ `NEXT` **Optional field badges** — Company, Role, City marked Optional.
27. ⏸ `LATER` **3-step mobile collapse** — merge intent + value; routing risk; not shipped.
28. ✅ `LATER` **Save draft to sessionStorage** — 24h TTL; restores step + fields (not URL).
29. ⏸ `LATER` **Abandon recovery** — blocked until email capture exists.
30. 🚫 `ANTI` **No CAPTCHA beyond Turnstile** — verified.

---

## Theme 4 — Identity & selection UX (31–40)

31. ✅ `NOW` **Identity cards** — Client, Investor, Collaborator, BuildMatch, Network.
32. ✅ `NOW` **Card icons** — inline SVG per identity.
33. ✅ `NOW` **Card microcopy** — one outcome line per card.
34. ✅ `NEXT` **Selected card elevation** — lane tint, checkmark, lift.
35. ✅ `NEXT` **Keyboard card navigation** — arrows + roving `tabindex` on card grids.
36. ✅ `NEXT` **BuildMatch card expansion** — `.buildmatch-panel.is-open` animation.
37. ✅ `NEXT` **Hide irrelevant value options** — `VALUE_VISIBILITY` by identity.
38. ✅ `NEXT` **Intent cards** — same card pattern on step 2.
39. ✅ `LATER` **Tooltips on hover** — desktop `data-tip` on identity hints.
40. 🚫 `ANTI` **No emoji-only identity labels** — verified.

---

## Theme 5 — Live routing console (41–52)

41. ✅ `NOW` **Routing diagram** — You → Gateway → Product line; live in `updateMirror()`.
42. ✅ `NOW` **Lane color tokens** — `--lane-*` in `:root` + `data-lane` on workspace.
43. ✅ `NOW` **Tint preview panel** — signal-panel + route-card follow active lane.
44. ✅ `NEXT` **Animate diagram edge** — pulse on route change.
45. ✅ `NEXT` **Show route reason in preview** — client mirrors `routingRules[].reason`.
46. ✅ `NEXT` **Priority chip** — high / medium / pending visual badges.
47. ✅ `NEXT` **BuildMatch industry in diagram** — sub-node under BuildMatch dest.
48. ✅ `NEXT` **“Preview only” banner** — hidden on contact step.
49. ✅ `LATER` **Public demo routing** — `?demo=1` (no DB write).
50. ✅ `LATER` **Interactive route map** — accordion clicks highlight diagram + lane.
51. ✅ `LATER` **Mini-map on success** — `.success-minimap` on confirmation screen.
52. 🚫 `ANTI` **No fake “AI is thinking” spinner** — verified.

---

## Theme 6 — Visual system & motion (53–62)

53. ✅ `NOW` **Tighten H1 clamp on mobile** — reduced max in `@media (max-width: 820px)`.
54. ✅ `NOW` **Unified border radius** — `--radius-card` 12px, `--radius-control` 8px.
55. ✅ `NEXT` **CSS custom properties for lanes** — all lane tokens in `:root`.
56. ✅ `NEXT` **Focus-visible rings** — buttons, inputs, cards, map hits.
57. ✅ `NEXT` **Hover states on all cards** — lift on identity, intent, option tiles.
58. ✅ `NEXT` **Reduced motion** — `@media (prefers-reduced-motion: reduce)`.
59. ✅ `NEXT` **Loading state on submit** — `is-submitting`, `aria-busy`, form `is-busy`.
60. ⏸ `LATER` **Subtle grain or grid background** — not shipped (perf budget).
61. ⏸ `FOUNDER` **Founder-chosen accent refresh** — default green lane set stands.
62. 🚫 `ANTI` **No parallax scroll** — verified.

---

## Theme 7 — Mobile & accessibility (63–72)

63. ✅ `NOW` **Sticky wizard actions** — fixed `.actions-bar` on mobile + safe-area.
64. ✅ `NOW` **44px minimum tap targets** — cards, tabs, buttons on mobile.
65. ✅ `NEXT` **Single-column wizard on mobile** — workspace stacks; tabs switch panes.
66. ✅ `NEXT` **Mobile preview tab** — Form | Preview toggle ≤820px.
67. ✅ `NEXT` **Screen reader step announcements** — `#step-announcer` `aria-live`.
68. ✅ `NEXT` **Legend + fieldset audit** — every step has `legend`; nested BuildMatch OK.
69. ✅ `NEXT` **Contrast pass** — `#5c6560` on `#f7f7f2` = **5.61:1** (WCAG AA); `prefers-contrast: more` darkens tokens.
70. ⏸ `LATER` **Full keyboard wizard path** — card grids done; Tab path doc not written.
71. ✅ `LATER` **High-contrast mode** — `prefers-contrast: more` overrides for ink, muted, borders, selection rings.
72. 🚫 `ANTI` **No gesture-only interactions** — keyboard path exists on cards; verified.

---

## Theme 8 — Lane landings & wedges (73–82)

73. ✅ `NEXT` **Founder Audit landing** — `/founder-audit` wedge-page: offer, $500, deliverables, CTA.
74. ✅ `NEXT` **SourceA `/for-clients`** — governed execution story → `?utm_campaign=sourcea`.
75. ✅ `NEXT` **BuildMatch landing** — `/buildmatch` platform + industry split CTAs.
76. ✅ `NEXT` **Shared wedge CSS** — `.wedge-page` system (`.legal-page` retained for privacy).
77. ✅ `NEXT` **Lane-colored wedge heroes** — `data-lane` per landing.
78. ✅ `NEXT` **OG image per wedge** — `/og-founder.svg`, `/og-sourcea.svg`, `/og-buildmatch.svg`.
79. ✅ `LATER` **Noetfield `/for-investors`** — intake explainer at `/for-investors` (Phase 2; not active marketing).
80. ✅ `LATER` **Forge `/for-builders`** — intake explainer at `/for-builders` (Phase 2; not active marketing).
81. ✅ `LATER` **TrustField `/for-trust`** — intake explainer at `/for-trust` (Phase 3).
82. 🚫 `ANTI` **No fake testimonials on wedge pages** — pattern-only copy; verified.

---

## Theme 9 — Success, trust, post-submit (83–90)

83. ✅ `NOW` **Success animation** — `is-entering` + confirmation code reveal.
84. ✅ `NOW` **Trust strip at submit** — Live capture · 48h review · Privacy above Turnstile.
85. ✅ `NEXT` **Post-submit timeline** — `.success-timeline` (code → review → follow-up).
86. ✅ `NEXT` **Copy confirmation code toast** — `aria-live` + `is-copied` button state.
87. ✅ `NEXT` **Share link on success** — “Copy intro link” → `/?ref=CODE` (no PII); `ref:` stored in `referrer` on submit.
88. ✅ `NEXT` **Telegram deep link + bot** — success links `t.me/Gateway_A?start=ref_CODE`; webhook handler `/api/telegram/webhook` (Phase 3).
89. ✅ `LATER` **Lane-specific thank-you line** — `.success-thanks` per product line on confirmation screen.
90. 🚫 `ANTI` **No “We emailed you”** — verified.

---

## Theme 10 — Performance, assets, SEO surface (91–95)

91. ✅ `NOW` **Lighthouse mobile pass** — production mobile LCP **1.0 s** (score 99); defer Turnstile to contact step, gzip static, inline critical CSS (`7c4e1a4`).
92. ✅ `NEXT` **System font stack** — removed unused `Inter`; system-ui only.
93. ✅ `NEXT` **Replace `og.svg`** — Gateway → product lines diagram.
94. ✅ `NEXT` **Preload + cache** — `preload`/`modulepreload` on intake; CSS/JS/SVG `max-age=86400` in prod.
95. ⏸ `LATER` **AVIF/WebP hero illustration** — no custom asset yet.

---

## Theme 11 — Measurement & anti-patterns (96–98)

96. ✅ `NOW` **Client-side funnel events** — `POST /api/funnel`: `step_view`, `identity_select`, `industry_select`, `submit_success` (no PII).
97. ✅ `NEXT` **Weekly UI funnel readout** — `npm run funnel:readout` → `data/funnel-events.jsonl`.
98. 🚫 `ANTI` **Global anti-fake UI law** — audited public surfaces; no stars/logo walls/fake scale.

---

## Locked principles (do not violate)

1. **Human vocabulary** — inquiry, product line, confirmation code.
2. **Honest founder** — one operator; no fake team or 24/7 chat.
3. **Routing is the product** — live sorting visible; no black-hole form.
4. **BuildMatch is a platform** — Construction and Home services stay separate.
5. **Performance is UX** — ship motion only if LCP budget holds.

---

## Definition of done — UI v2 milestone ✅

- [x] Items 1–4, 11, 19–20, 31–33, 41–43, 53–54, 63–64, 83–84, 96 **shipped**
- [x] Mobile sticky CTA + routing diagram live on production
- [x] Founder Audit landing matches wedge page standard (item 73)
- [x] Lighthouse mobile LCP &lt; 2.5s — **1.0 s** on production (`7c4e1a4`, 2026-07-07)
- [x] No vocabulary regressions on public intake surfaces

---

## Post-98 backlog (Batch F — optional)

Prioritized deferred items when wedge season or founder bandwidth allows:

| Priority | Item | Action |
|----------|------|--------|
| FOUNDER | 61 | Accent refresh decision if brand evolves |
| NEXT | 88 | ~~Telegram bot `?start=ref_` handler when bot SKU exists~~ → **shipped Phase 3** |
| LATER | 7 | Dark ops theme with contrast audit |
| LATER | 27 | 3-step mobile collapse (intent + value merge) |
| LATER | 29 | Abandon recovery after email wired |
| LATER | 60 | Subtle grain background |
| LATER | 70 | Keyboard wizard Tab path doc |
| LATER | 79–81 | ~~TrustField `/for-trust` wedge page~~ → **#81 shipped Phase 3** |
| LATER | 95 | AVIF/WebP hero when illustration exists |

**Not planned:** items marked 🚫 ANTI — permanent hold.

---

## Production map (quick reference)

| Surface | URL |
|---------|-----|
| Main intake | `/` |
| Demo (no save) | `/?demo=1` |
| Founder Audit wedge | `/founder-audit` |
| SourceA wedge | `/for-clients` |
| Noetfield wedge | `/for-investors` |
| Forge wedge | `/for-builders` |
| TrustField wedge | `/for-trust` |
| How it works | `/how-it-works` |
| BuildMatch wedge | `/buildmatch` |
| Status API | `GET /api/status` |
| Telegram webhook | `POST /api/telegram/webhook` |
| Ops weekly | `npm run ops:weekly` |
| Funnel API | `POST /api/funnel` |
| Funnel readout | `npm run funnel:readout` |

---

## Amendment log

| Version | Date | Change |
|---------|------|--------|
| v1 | 2026-07-06 | Initial lock — 98 items from July 2026 UI research pass |
| v2 | 2026-07-07 | Batches A–E executed; per-item status; post-98 backlog; DoD checked |
| v2.1 | 2026-07-07 | Batch F Lighthouse: prod mobile LCP 1.0 s (was 5.5 s); item 91 closed (`7c4e1a4`) |
| v2.2 | 2026-07-07 | Batch F: intro share link, lane thank-you, contrast + high-contrast (`eb409af`) |
| v2.3 | 2026-07-07 | Phase 2 Batch G: investor/builder wedges, referrer + UTM columns, status API (`3e3d7b2`) |
| v2.4 | 2026-07-11 | Phase 3: TrustField wedge (#81), Telegram bot webhook (#88), how-it-works, ops weekly, lastSignalAt |

---

## Reference in commits

```text
UI #31 identity cards (GATEWAY_UI_UPGRADE_98_LOCKED_v1)     → cd2afcb Batch A
UI Batch B intent cards + mobile wizard                      → 1a4e92f
UI Batch C sticky CTA + success flow                         → 2ce1175
UI Batch D wedge landings                                    → 1c5c8ab
UI Batch E funnel + perf                                     → 1f0a4ab
UI Batch F Lighthouse LCP pass                               → 7c4e1a4
UI Batch F share link + lane thank-you                       → eb409af
UI Phase 2 Batch G wedges + referrer + UTM                   → 3e3d7b2
UI Phase 3 TrustField + Telegram bot + explainer               → ed81774
```
