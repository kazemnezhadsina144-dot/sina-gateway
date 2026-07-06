# Sina Gateway — Terminology (Operator / Internal) v2

**Status:** Locked · **Date:** 2026-07-06  
**Audience:** You, agents, ops — plain English first. Code names in parentheses.  
**Public copy:** [`SINA_GATEWAY_CLIENT_VOCABULARY_LOCKED_v1.md`](./SINA_GATEWAY_CLIENT_VOCABULARY_LOCKED_v1.md)

---

## How to use this doc

1. **Say the human term** in conversation and client-facing copy.  
2. **Use the code name** only in logs, Supabase, and scripts.  
3. If a word sounds like startup jargon, check the **“Say it like a human”** column.

---

## What this system is (one paragraph)

**Sina Gateway** is the **main front door** for your business: one form, one database, one Telegram channel — and **automatic sorting** into the right product line (SourceA, Noetfield, Founder Audit, etc.). You run it from your **personal account**; it is **not** Noetfield Systems Inc. and not any single product’s website.

Internal shorthand: **megagateway** = that whole setup (intake + sorting + ops channel).

---

## Core terms

| Human term | What it really means | Code / doc alias | Say it like a human |
|------------|----------------------|------------------|---------------------|
| **Main intake hub** | The live site + API that accepts inquiries | Sina Gateway, `sina-gateway` repo | “Send them to the gateway.” |
| **Product line** | One business direction you route to | Venture lane, `venture_route` | “This goes to the SourceA line.” |
| **Sorting** | Rules that pick the product line | Routing, `ROUTING_RULES` | “The form sorted them to Founder Audit.” |
| **Inquiry** | What someone submitted | Signal, lead, `gateway_leads` row | “We got an inquiry from a founder.” |
| **Confirmation code** | Short ID the visitor keeps | Reference ID, first 8 of UUID | “Your code is A1B2C3D4.” |
| **Ops channel** | Telegram where you see alerts | `@Gateway_A`, control panel | “Check the gateway channel.” |
| **Your portfolio** | All products/sites you route among | Portfolio mesh | “Across everything I’m building.” |
| **Handoff** | You reply, quote, or move them to the right product | Lane handoff | “I’ll hand this to SourceA delivery.” |

---

## Product lines (locked names)

Use these **exact names** with clients. They are brands, not departments.

| Name | Human meaning |
|------|----------------|
| **SourceA** | Paid / client work — AI execution with guardrails |
| **Noetfield** | Strategy, ventures, investor-style conversations |
| **TrustField** | Trust, risk, compliance questions |
| **BuildMatch** | Vancouver construction & trades |
| **Forge** | Builders, collaborators, tools |
| **Personal** | Friends, warm intros — low noise |
| **Founder Audit** | Paid audit offer for solo founders |

Code: all caps in DB for FounderAudit → display as **Founder Audit**.

---

## Capture & database

| Human term | Meaning | Code |
|------------|---------|------|
| **Saved** | Inquiry stored successfully | Capture OK, `requestId` |
| **Urgent** | Needs fast Telegram ping | `priority_tag: high` |
| **Test row** | Fake runbook data | `is_test`, `[PRIVATE-TEST]` |
| **Intro link** | URL with `?ref=` for who sent them | `referrer: ref:…` |
| **Campaign link** | URL with `utm_campaign=` | UTM fields |

---

## Telegram & monitoring

| Human term | Meaning | When it posts |
|------------|---------|----------------|
| **Site-down alert** | Health check failed | Watchdog RED only |
| **Daily business summary** | Offers sent, replies, payments | Heartbeat when `COMMERCIAL_ARMED=true` |
| **New urgent inquiry alert** | High-priority form submit | Railway → bot → channel |
| **Armed** | Commercial counters synced to Cloudflare | After `npm run sync:heartbeat` |

**Important:** Quiet channel when the **site is fine** is normal. Quiet when **business is active but armed** is not — arm and sync after real outbound.

---

## Legal / brand (short)

| Rule | Human wording |
|------|----------------|
| Who runs the site | Operated by Sina Kazemnezhad |
| What the site is not | Not Noetfield Systems Inc.; not “the company” for every product line |
| What the form does | Sorts inquiries; does not sign contracts for product lines |

---

## Scripts (what you actually run)

| Command | Human purpose |
|---------|----------------|
| `npm run launch:gate` | “Is the site ready?” |
| `npm run chain:health` | “Is production working?” |
| `npm run test:notify-capture` | “Does Telegram get urgent inquiries?” |
| `npm run sync:heartbeat` | “Push real outbound numbers to daily summary.” |

---

## Words to drop in conversation

| Jargon | Say instead |
|--------|-------------|
| Control plane | Ops channel, dashboard |
| Signal (with clients) | Inquiry, submission, message |
| Venture lane (with clients) | Product line, destination |
| Mesh | Routing between products |
| Receipt-native | “We only count what actually happened” |
| Armed commercial heartbeat | “Turn on daily business summary on Telegram” |
| Identity bleed | “Don’t pretend to be Noetfield on this site” |

---

## Amendment

v2 · 2026-07-06 · Human-dictionary pass; v1 jargon demoted to code aliases.
