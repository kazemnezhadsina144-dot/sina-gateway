# Sina Gateway — UI Upgrade Research (July 2026)

**Status:** Reference · **Date:** 2026-07-06  
**Companion:** [`GATEWAY_UI_UPGRADE_98_LOCKED_v1.md`](./GATEWAY_UI_UPGRADE_98_LOCKED_v1.md)  
**Vocabulary:** [`SINA_GATEWAY_CLIENT_VOCABULARY_LOCKED_v1.md`](./SINA_GATEWAY_CLIENT_VOCABULARY_LOCKED_v1.md)

---

## Executive summary

Sina Gateway already has strong **routing logic** (multi-step wizard, live preview, BuildMatch industry split, campaign wedges). The gap vs top 2026 B2B intake sites is **presentation and interaction** — visitors read a lot before doing anything, and the sorting engine does not *feel* like the product.

**2026 pattern:** Product-as-hero, intent-driven copy, labeled multi-step forms, conditional fields, live feedback, honest trust at submit, LCP under 2s.

**Do not copy:** fake logos, fake scale, fake chat, heavy autoplay video.

**Do copy:** Linear clarity, Stripe headline discipline, Clerk-style live preview, honest SLA copy.

---

## Current baseline (live)

**URL:** https://sina-gateway-production.up.railway.app/

### Working

- 5-step wizard with auto-advance
- Side preview (`Likely destination`, route card)
- BuildMatch platform + industry panel
- UTM campaign wedges
- Success screen with confirmation code
- CSS design tokens

### Flat / low-interaction

- Long scroll before wizard (hero + route map + what-next)
- Plain radio tiles on identity step
- Text-only routing preview (no diagram / lane color)
- No step transitions or named stepper labels
- Static route-map bullet wall
- Mobile preview below fold
- Founder Audit landing = legal-page style
- Generic `og.svg`

---

## 2026 research synthesis

| Source | Takeaway |
|--------|----------|
| [CorgenX lead-gen UX 2026](https://www.corgenx.com/blog/ux-design-landing-page-lead-generation) | Outcome CTAs, privacy microcopy, mobile two-step forms |
| [Daembrace intent-driven pages](https://lab.daembrace.com/2026/03/03/designing-intent-driven-landing-pages-in-2026/) | Progressive disclosure, adaptive CTAs, deferred heavy asks |
| [Venture Lab 2026 trends](https://venture-lab.org/2026/landing-page-trends-2026/) | Interactive proof layer, speed, personalization |
| [Digital Applied form stats 2026](https://www.digitalapplied.com/blog/landing-page-statistics-2026-conversion-data-points) | Multi-step +21%; conditional logic +11%; fewer fields |
| [Social Animal SaaS teardowns](https://socialanimal.dev/blog/saas-website-examples-2026-design-pattern-teardowns/) | Linear/Vercel product-as-hero, LCP under 1s |
| [Unicorn B2B landing 2026](https://unicornplatform.com/blog/b2b-lead-generation-landing-pages-in-2026/) | One objective per page, trust at commit point |

---

## Proposed layout (target)

```
┌─────────────────────────────────────────────────────────────┐
│  SINA GATEWAY          [Status] [@Gateway_A]                 │
├──────────────────────────┬──────────────────────────────────┤
│  HEADLINE (1 line)       │  LIVE ROUTING CONSOLE            │
│  Subline (identity-aware)│  [You]──►[Gateway]──►[Product line]│
│  ┌────────────────────┐  │  Promise + priority              │
│  │ WIZARD             │  │                                  │
│  └────────────────────┘  │                                  │
├──────────────────────────┴──────────────────────────────────┤
│  ▼ Where inquiries go (accordion)  ▼ What happens next      │
└─────────────────────────────────────────────────────────────┘
```

---

## Build batches (execution order)

| Batch | Scope |
|-------|--------|
| **A** | Form-first layout, identity cards, named stepper, lane colors |
| **B** | Routing diagram, step transitions, inline validation |
| **C** | Mobile sticky CTA, success animation, trust strip |
| **D** | Wedge landing visual upgrade |
| **E** | Perf, OG, Lighthouse |

---

## Measurement

| Metric | Target |
|--------|--------|
| Step 1 → submit rate | +15–25% relative |
| Per-step drop-off | Log `step_view` events |
| LCP mobile | &lt; 2.0s |
| INP | &lt; 200ms |

---

## Amendment

v1 · 2026-07-06 · Saved from UI research pass; execution list is the 98-item locked plan.
