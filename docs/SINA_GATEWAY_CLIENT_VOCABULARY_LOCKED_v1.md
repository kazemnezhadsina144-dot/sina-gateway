# Sina Gateway — Client-Facing Vocabulary v2

**Status:** Locked · **Date:** 2026-07-06  
**Rule:** Write like you talk to a smart stranger — not like a SaaS landing page.

Internal code names: [`SINA_GATEWAY_TERMINOLOGY_LOCKED_v1.md`](./SINA_GATEWAY_TERMINOLOGY_LOCKED_v1.md)

---

## The brand

| Use | Avoid |
|-----|--------|
| **Sina Gateway** | “Our platform,” “we” (fake team), Noetfield Systems Inc. |
| **Inquiry** / **submission** | Signal, lead, ticket, pipeline |
| **Product line** | Venture lane, vertical, subsidiary, department |
| **Confirmation code** | Ticket #, order # (until they paid) |
| **Operated by Sina Kazemnezhad** | CEO titles, corporate “we” |

**Footer (locked):**  
*Sina Gateway — operated by Sina Kazemnezhad. One intake form; inquiries are sorted to the right product line for review.*

---

## Product lines — what clients read

| Name | Plain description |
|------|-------------------|
| **SourceA** | Help with AI and agent work — with clear rules and control. |
| **Noetfield** | Strategy, partnerships, and bigger-picture ventures. |
| **TrustField** | Trust, governance, and compliance questions. |
| **BuildMatch** | Vancouver platform for local property and trade work. Two industries, reviewed separately: **Construction** (builds, trades, site work) and **Home services** (maintenance, repairs, residential). |
| **Forge** | Builders, tools, and collaboration. |
| **Personal** | Friends and warm introductions. |
| **Founder Audit** | A paid 5-day audit for solo founders ($500). |

**Rule:** Name the product line. Do **not** say they are submitting “to Noetfield the corporation” on this website.

---

## Form & buttons

| UI element | Client text |
|------------|-------------|
| Page title | One intake point for opportunities, capital, and trusted introductions. |
| Submit button | **Submit inquiry** |
| Success headline | **Inquiry received — [Product line]** |
| Side panel label | **Likely destination** |
| Side panel empty | Answer the questions to see where this goes. |
| Section title | **Where inquiries go** |
| Consent | I consent to follow-up about this inquiry. |

---

## After they submit (success screen)

1. **“Inquiry received — [SourceA / Founder Audit / …]”**  
2. **“Confirmation code: [8 chars] — save this if you follow up.”**  
3. **“Sina reviews inquiries within 48 hours on business days.”**  
4. **“Why this product line: [short reason]”** — when the system has one  
5. **Never** “We emailed you” unless email is really wired up  

Buttons: **Copy confirmation code** · **Copy invite link** · **Submit another inquiry**

---

## How to talk about Telegram

**Channel name:** `@Gateway_A`  
**Public description:**  
*Updates from Sina Gateway: urgent inquiries, site status, and business summaries. Not a live chat — Sina reviews inquiries on a human schedule.*

Do **not** say: control plane, mesh, verdict, armed, infra.

---

## DMs and posts (examples)

**Founder Audit outreach:**  
> I run a 5-day Founder Audit for solo technical founders. If you want a blunt read on how you’re actually operating, start here: [link]

**General:**  
> One form for anything business-related — client work, investors, construction, collabs: [gateway link]. It sorts you to the right place.

---

## Trust — honest only

| OK | Not OK |
|----|--------|
| “Stored securely for review” | “Bank-grade encryption” (unless audited) |
| Link to Privacy | “GDPR certified” (until true) |
| “Operated by one founder” | “Our team,” 24/7 support |
| Real price on Founder Audit | Fake urgency, fake testimonials |

---

## Tone checklist

- Short sentences.  
- Say what happens next.  
- No coach-speak on the main form (Founder Audit page can be direct/blunt).  
- No fake scale (“thousands of founders”).  

---

## UI ↔ vocabulary map (code may still say “lead”)

| Visitor sees | Database / code |
|--------------|-----------------|
| Inquiry | `gateway_leads` row |
| Product line | `venture_route` |
| Confirmation code | `id` / `requestId` (first 8 shown) |
| Likely destination | Route preview |

---

## Say this, not that

| Avoid (jargon) | Say instead |
|----------------|-------------|
| Signal received | **Inquiry received** |
| Send signal | **Submit inquiry** |
| Venture lane / review lane | **Product line** |
| Routed to SourceA | **Inquiry received — SourceA** |
| Reference ID | **Confirmation code** |
| Mirrored path | **Preview** |
| Lead type | **You are** |
| Operator channel | **@Gateway_A** |
| Capture failed | **Could not save inquiry** |
| Control plane / mesh / verdict | *(internal only — never on the site)* |

---

## Amendment

v2 · 2026-07-06 · Human dictionary alignment with public UI.
