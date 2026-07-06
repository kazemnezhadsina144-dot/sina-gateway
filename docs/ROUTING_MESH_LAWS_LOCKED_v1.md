# Routing Mesh Laws v1

**Status:** Locked · **Date:** 2026-07-06  
**Applies to:** Sina Gateway → venture lane handoffs

---

## Purpose

The gateway **routes**. Ventures **own** their offers, contracts, and delivery. These laws prevent the mesh from becoming one blurry brand.

---

## M1 — Capture here, contract there

Intake and consent happen on Sina Gateway. **Contracts, invoices, and SOWs** happen on the **lane** that accepts the work — never implied at submit time on the gateway form.

---

## M2 — Copy matches lane, voice stays personal

Lane landing pages (`/founder-audit`, `/for-clients`) describe **what that lane is for**. Footer and operator line always say **personal founder project — Sina Kazemnezhad**.

---

## M3 — UTM is the handoff receipt

Every external link into the mesh must carry:

- `utm_campaign` — lane (`founder-audit`, `sourcea`, `buildmatch`, …)
- `utm_source` — channel (`linkedin`, `telegram`, `landing`, `intro`, …)
- `utm_medium` — format (`dm`, `post`, `share`, …)

Optional: `ref=` for introducer chain (no PII in URL).

---

## M4 — No retroactive lane laundering

Do not re-tag a captured row to a “better” lane to please a lead. Founder override (future admin) must log **why**.

---

## M5 — Personal lane is quiet

`Personal` / friend signals do **not** trigger Telegram high-priority alerts unless explicitly escalated. Low noise for human network.

---

## M6 — Venture repos are not gateway dependencies

Runtime capture must not call SourceA/Noetfield APIs. Mesh is **async**: capture → review → founder opens lane tooling.

---

## M7 — Learn metrics, not secrets

Gateway may count lane volumes and conversion. It must **not** copy venture roadmaps, cap tables, or client lists from other systems into `gateway_leads` without consent.

---

## M8 — One marketing wedge

Only one lane is **marketed per 90-day season** (`WEDGE_LOCKED_v1.md`). Other lanes remain routable via organic identity selection.

---

## Mesh diagram

```
Viewer → sina-gateway (capture + tag) → founder review → lane SSOT (delivery)
                ↑
         learns: UTM, volume, ref chains
                ↓
         does NOT merge: brand, contracts, corp entity
```

---

## Lane handoff checklist (founder)

1. Confirm `venture_route` + `route_reason` in Supabase  
2. Reply using **lane voice** (Founder Audit vs SourceA vs …)  
3. Move commercial action to lane tooling (invoice, call, offer doc)  
4. Log outbound in `channel-receipts.json` if D3 applies  
5. `npm run sync:heartbeat` only after **real** send counts  
