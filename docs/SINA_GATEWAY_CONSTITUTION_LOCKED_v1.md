# Sina Gateway — Constitution (Foundational Laws) v1

**Status:** Locked · **Date:** 2026-07-06  
**Operator:** Sina Kazemnezhad (personal founder account)  
**Supersedes:** informal “gateway is part of Noetfield” assumptions — **it is not.**

---

## Article I — Identity

**Law 1 — Personal megagateway.** Sina Gateway is a **personal intake and routing system** operated by Sina Kazemnezhad. It is not Noetfield Systems Inc., not SourceA corporate HQ, not TrustField Ltd., and not any venture’s official homepage.

**Law 2 — One front door, many lanes.** The gateway’s job is **Mirror → Route → Capture → Tag**. It is the **general** at the door; venture lanes are **destinations**, not co-owners of the gateway.

**Law 3 — Separate mission.** This system’s mission is: *honest intake, deterministic routing, receipt-native ops, and founder-controlled follow-up* — for every signal that enters through Sina’s personal network surface.

---

## Article II — Separation from ventures

**Law 4 — Route, do not merge.** When a client or viewer matches a lane (SourceA, Noetfield, TrustField, BuildMatch, Forge, Personal, Founder Audit), the gateway **routes** the signal. It does **not** speak as that venture, bind that venture contractually, or imply employment/agency with that venture.

**Law 5 — No identity bleed.** Public copy on this gateway uses **“Sina Gateway”** and **“personal founder project.”** Never “Noetfield Systems Inc.” on intake, footer, Telegram charter, or alerts unless the routed lane is Noetfield **and** the copy explicitly says *routed for strategic review* — not corporate representation.

**Law 6 — Learn without absorbing.** The gateway may **observe** which lanes convert, which UTMs work, and which rules fire — to improve routing and founder ops. It must **not** import another venture’s repo, secrets, cron, or brand into this codebase as if they were one system.

**Law 7 — One-way mesh.** External properties may link **into** the gateway with UTM. The gateway may link **out** to lane explainers. No circular “we are all one product” narrative.

---

## Article III — Receipts and truth

**Law 8 — Receipts over promises.** A signal is real when captured with `requestId`, lane, and timestamp — not when someone says they are interested. Payment receipts unlock commercial GREEN; conversation does not.

**Law 9 — No fake surface.** No fake testimonials, ratings, team pages, email acks, uptime stats, subscriber counts, or corporate authority this operator does not hold.

**Law 10 — Honest silence.** Telegram and heartbeat stay **quiet when healthy**. Alerts fire on failure or real commercial state — never daily fake RED/GREEN spam.

**Law 11 — Operator is human.** Review windows, follow-up, and offers are **founder-paced**. The gateway does not claim 24/7 human support.

---

## Article IV — Routing

**Law 12 — Deterministic routing.** Venture choice is **rule-based** (`src/gateway.js`), logged with `route_rule_id` and `route_reason`. No black-hole forms.

**Law 13 — Viewer decides lane inputs.** Identity, intent, value, urgency, notes, and UTM determine lane — not the operator’s mood at intake time.

**Law 14 — One audience per season.** Marketing picks **one wedge** at a time (`docs/WEDGE_LOCKED_v1.md`). All lanes remain routable; not all lanes are marketed simultaneously.

**Law 15 — High-priority is scarce.** Telegram lead alerts fire for **high-priority** signals only — not every submit.

---

## Article V — Data and privacy

**Law 16 — Anon capture only.** Browser uses anon key; service-role never ships in this app.

**Law 17 — RLS is law.** Anonymous read of lead rows is denied. Founder reviews in Supabase dashboard or future admin view.

**Law 18 — Test rows are labeled.** `is_test`, `[PRIVATE-TEST]`, and `private-test` source are cleaned before treating DB as production truth.

---

## Article VI — Ops

**Law 19 — Telegram is personal ops.** `@Gateway_A` is the **personal operator channel** for this gateway: watchdog RED, high-priority leads, optional heartbeat when armed. Other products’ workers must not post here unless explicitly reconfigured.

**Law 20 — Infra motors are separate.** `gateway-ops` watches Railway; UptimeRobot is external GET-only; deadman/NOOS/SourceA crons live in **their** repos — operate, don’t edit from here unless scoped.

**Law 21 — Git truth on main.** Production Railway deploys from `main`. Receipts in docs cite commit or script PASS, not vibes.

---

## Article VII — Amendments

**Law 22 — Founder amends.** Only Sina Kazemnezhad may lock/unlock constitutional changes. Agents implement; they do not redefine mission or impersonate ventures.

**Law 23 — SSOT wins conflicts.** If any doc disagrees with [`SINA_GATEWAY_SSOT_LOCKED_v1.md`](./SINA_GATEWAY_SSOT_LOCKED_v1.md), SSOT wins for **live operational truth**. Constitution wins for **identity and law**.

---

## One paragraph (pin this mentally)

> **Sina Gateway is my personal megagateway — separate mission, separate ops, separate brand — that routes people to the right venture lane based on who they are and what they need. I learn from every lane, but I do not pretend to be those lanes. Receipts, honesty, and quiet green infra are the product.**
