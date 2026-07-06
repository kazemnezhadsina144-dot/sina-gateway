# Sina Gateway — Client-Facing Vocabulary v1

**Status:** Locked · **Date:** 2026-07-06  
**Audience:** Public web, landings, success screens, DMs, `@Gateway_A` charter  
**Internal terms:** [`SINA_GATEWAY_TERMINOLOGY_LOCKED_v1.md`](./SINA_GATEWAY_TERMINOLOGY_LOCKED_v1.md)

---

## Brand (always)

| Say | Don’t say |
|-----|-----------|
| **Sina Gateway** | Noetfield Systems Inc., “our company” (corporate), “we” (team fiction) |
| **Review lane** / **routed lane** | “Department,” “subsidiary,” “owned by Noetfield” |
| **Signal** | Lead (in hero/marketing), “ticket,” “support case” |
| **Reference ID** | Ticket number, order number (unless paid) |
| **Operated by Sina Kazemnezhad** | CEO of Noetfield, corporate officer titles |

**Footer line (locked):**  
*Sina Gateway — operated by Sina Kazemnezhad. Routes signals to named venture lanes; not a corporate homepage for any single venture.*

---

## Lane names (client-visible)

Use **exact** lane names on success screens and route maps:

| Lane name | Client-facing one-liner |
|-----------|-------------------------|
| **SourceA** | Governed AI execution and agentic work with control. |
| **Noetfield** | Strategic partnership and venture design. |
| **TrustField** | Trust, governance, and compliance pressure. |
| **BuildMatch** | Vancouver construction and home-services (early access). |
| **Forge** | Builders, tools, and collaboration. |
| **Personal** | Friends, warm intros, network context. |
| **Founder Audit** | Solo founder accountability audit (5-day offer). |

**Rule:** Name the lane; don’t claim that lane’s legal entity runs this website.

---

## Wizard copy patterns

| Step | Client language |
|------|-----------------|
| Identity | “Who are you?” (client, investor, builder, construction, friend, founder) |
| Intent | “What are you trying to do?” |
| Value | “What kind of opportunity is this?” |
| Urgency | “When matters?” |
| Contact | “How should we reach you?” |
| Submit | **“Send signal”** (not “Submit lead”) |
| Success | **“Signal received”** + lane name + Reference ID |

---

## Success screen (locked phrases)

1. **“Routed to [Lane]”** — headline  
2. **“Reference [ID] — keep this if you follow up.”**  
3. **“Review window: operator follow-up within 48 hours on business days.”**  
4. **“Why this lane: [route_reason]”** — when available  
5. **No** “We emailed you” unless email integration is real  

---

## Campaign / UTM (in links only)

Clients see **clean URLs**, not jargon:

```
https://sina-gateway-production.up.railway.app/founder-audit
https://sina-gateway-production.up.railway.app/?utm_campaign=founder-audit&utm_source=linkedin
```

| Param | Client-visible? | Meaning |
|-------|-----------------|---------|
| `utm_campaign` | No (in URL OK) | Which offer/lane campaign |
| `utm_source` | No | Which channel (linkedin, landing, …) |
| `ref` | No | Introducer chain (no PII) |

---

## Telegram (`@Gateway_A`) — public description

**Channel title idea:** Sina Gateway — control panel  

**Short description (client-safe):**  
*Commercial routing control panel for Sina Gateway: intake alerts, portfolio verdicts, and lane health. Not 24/7 human chat.*

**Pinned charter:** use [`TELEGRAM_CHANNEL_CHARTER_v1.md`](./TELEGRAM_CHANNEL_CHARTER_v1.md) (update to commercial framing).

---

## Offers (Founder Audit example)

| Say | Don’t say |
|-----|-----------|
| “$500 USD · 5-day Founder Audit” | “Limited time,” fake scarcity |
| “Personal founder project” | “Noetfield Systems pricing” |
| “Start intake” | “Buy now” (until payment integrated) |

---

## Privacy & trust (client)

| Say | Don’t say |
|-----|-----------|
| “Captured securely for review” | “Encrypted bank-level” (unless audited) |
| “See Privacy” → `/privacy.html` | “GDPR certified” (until reviewed) |
| “You can request deletion” (when process live) | “We never store data” (false) |

---

## Words never on client surfaces

- Fake testimonials, star ratings, “500+ customers”  
- “Noetfield Systems Inc.” as operator of this site  
- “24/7 support”  
- “We received your email” (no email integration)  
- “Official” + venture name unless that venture’s own site  

---

## Tone

- **Direct** — short sentences  
- **Honest** — name what happens next  
- **System-native** — reference IDs, lanes, review windows  
- **Not motivational** — no coach fluff on gateway (Founder Audit offer may be blunt)  

---

## Amendment

v1 · 2026-07-06
