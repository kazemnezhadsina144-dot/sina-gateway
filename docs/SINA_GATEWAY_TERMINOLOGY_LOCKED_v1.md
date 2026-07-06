# Sina Gateway — Terminology (Operator / Internal) v1

**Status:** Locked · **Date:** 2026-07-06  
**Audience:** Founder, agents, ops — **not** client-facing. For public copy use [`SINA_GATEWAY_CLIENT_VOCABULARY_LOCKED_v1.md`](./SINA_GATEWAY_CLIENT_VOCABULARY_LOCKED_v1.md).

---

## Core identity terms

| Term | Definition | Use | Do not confuse with |
|------|------------|-----|---------------------|
| **Megagateway** | Commercial intake + routing **control plane** for the whole portfolio | “The megagateway routes signals to lanes.” | A single product website |
| **Sina Gateway** | Proper name of this system (repo + production URL + ops stack) | Brand on intake surfaces | Noetfield, SourceA, or any lane |
| **Control panel** | Operator-facing command surface: `@Gateway_A`, `/status.html`, scripts, Supabase review | “Check the control panel for verdict.” | Client-facing dashboard (not built yet) |
| **Operator account** | Sina Kazemnezhad’s personal founder account that **runs** the megagateway | Legal/ops ownership | Corporate entity (Noetfield Systems Inc.) |
| **Portfolio** | All venture lanes + external sites/products the gateway routes **toward** | “Portfolio routing” | One merged company |

---

## Routing mesh terms

| Term | Definition |
|------|------------|
| **Venture lane** | Named routing destination: SourceA, Noetfield, TrustField, BuildMatch, Forge, Personal, FounderAudit |
| **Direction** | Synonym for lane in conversation; code uses `venture_route` |
| **Product surface** | External site/app for a lane (e.g. `sourcea.app`, `noetfield.com`) — **downstream** of capture |
| **Mesh** | One gateway capture layer → many lane handoffs; one-way links with UTM |
| **Route decision** | Output of `ROUTING_RULES`: `venture_route`, `route_rule_id`, `route_reason`, `route_confidence` |
| **Secondary route** | Ambiguous signal’s alternate lane (when used) |
| **Wedge** | One lane marketed per 90-day season (`WEDGE_LOCKED_v1.md`) |
| **Handoff** | Founder action after capture: reply, offer, contract — in **lane** context |

---

## Capture terms

| Term | Definition |
|------|------------|
| **Signal** | Any inbound submission (preferred internal word) |
| **Lead** | Database row / `gateway_leads` record; OK in code, avoid in client hero copy |
| **Capture** | Successful POST to `/api/leads` with `requestId` |
| **Tag** | `priority_tag`, `lead_type`, UTM tags, `tags[]` |
| **Reference ID** | First 8 chars of UUID — client receipt |
| **Intro ref** | `?ref=` chain stored as `ref:…` in `referrer` |
| **Private test** | `source=private-test`, `[PRIVATE-TEST]` naming, `is_test=true` |

---

## Commercial ops terms

| Term | Definition |
|------|------------|
| **Commercial ops** | Portfolio-level motion: outbound, offers sent, replies, L2 receipts — **not** “personal diary” |
| **Commercial heartbeat** | Daily portfolio verdict in `@Gateway_A` when `COMMERCIAL_ARMED=true` |
| **Infra verdict** | Watchdog/heartbeat on Railway health — separate from commercial |
| **Armed** | `COMMERCIAL_ARMED=true` after real `channel-receipts.json` sync |
| **GREEN / RED** | Verdict labels — infra or commercial; must be receipt-backed |
| **High-priority alert** | Telegram message for `priority_tag=high` captures |
| **Lane aggregate** | Weekly counts per `venture_route` (no PII) — control panel content |

---

## Telegram terms

| Term | Definition |
|------|------------|
| **`@Gateway_A`** | **Commercial control panel channel** — portfolio alerts, verdicts, high-priority signals |
| **`@GateWay_A_bot`** | Delivery bot for alerts (and future intake commands) |
| **Watchdog post** | Infra RED only (probe failure) |
| **Heartbeat post** | Infra and/or commercial scheduled verdict |
| **Charter** | Pinned channel description (`TELEGRAM_CHANNEL_CHARTER_v1.md`) |

---

## Separation terms (legal / brand)

| Term | Definition |
|------|------------|
| **Route, don’t merge** | Gateway names lanes; does not speak as corporate entity for them |
| **Identity bleed** | Forbidden: implying Noetfield Systems Inc. owns this intake |
| **Operator line** | Footer: operated by Sina Kazemnezhad — personal founder project |
| **Lane SSOT** | Each venture’s own docs/repo for delivery truth |

---

## Script / env vocabulary

| Token | Meaning |
|-------|---------|
| `npm run launch:gate` | Pre/post launch verification |
| `npm run chain:health` | Production probe chain |
| `npm run sync:heartbeat` | Push commercial counters to `gateway-ops` |
| `COMMERCIAL_ARMED` | Enable commercial heartbeat posts |
| `GATEWAY_BASE_URL` | Production URL for probes |

---

## Banned internal sloppy terms

| Sloppy | Say instead |
|--------|-------------|
| “Personal ops only” | **Commercial control panel** (operator is personal; scope is portfolio) |
| “The gateway is Noetfield” | **Routed to Noetfield lane** |
| “Lead funnel” (client copy) | **Signal intake** |
| “We’re enterprise” | **Lane-specific** only if true for that lane |
| “Bot posts everything” | **Alerts on rule triggers** |

---

## Amendment

v1 · 2026-07-06 · Supersedes informal “personal-only gateway” wording.
