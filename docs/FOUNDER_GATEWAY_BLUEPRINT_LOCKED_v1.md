# FOUNDER GATEWAY — AI COFOUNDER PLATFORM

## Blueprint v1.0_20260705

**Status:** Locked for founder use · **Lane:** SINA_GATEWAY / founder-coaching (separate from Brain Audit lane)  
**Relation to UNLOCK DOCTRINE v2:** same logic, different patient. Brain Audit's patient is a company's *agent system*. This product's patient is the *founder's decision system*.

---

## §1 — Thesis

Every solo founder runs an unmanaged system: decisions with no ledger, offers
that drift per audience, partner choices made on conversation instead of
evidence, weeks that end with no honest answer to "did the company move?"
Human coaches sell talk. Accelerators sell cohorts. Neither installs a
*system*.

**Product:** an AI cofounder that runs the founder the way a governed
reconciler runs infrastructure — one desired state, receipts for every
commitment, drift detected daily, one verdict each morning.

**One line:** *A cofounder that never forgets, never flatters, and proves
every week whether you moved.*

The credibility story is unusual and unfakeable: the platform is the
productized version of the operating system its founder built and runs
himself — decision receipts, offer discipline, receipt-laddered partner
intake, daily heartbeat. We are not selling advice; we are installing the
machine we live in.

---

## §2 — Who it is for (one audience per §5.2 discipline)

**Primary:** solo technical founders, pre-seed to seed, building with AI,
no cofounder, drowning in their own throughput. They already trust systems
more than people; they will accept governance from a machine that they
would resent from a mentor.

**Explicitly not (v1):** teams with existing exec structure, idea-stage
non-builders, coaching-market consumers looking for motivation. The product
sells discipline, not encouragement.

---

## §3 — The coaching model (receipt-native, not conversational)

Generic AI coaching = a chat that agrees with you. This platform inverts it:
conversation is the *interface*, but the product is four ledgers and one
loop.

### 3.1 The four ledgers

**L-A · Decision Ledger.** Every material decision is a row:
`{decision, reasoning, expected_outcome, review_date, status}`. The AI
cofounder writes the row from conversation, then *enforces the review date*.
Founders don't fail from bad decisions; they fail from never confronting
outcome vs expectation. This ledger is that confrontation, scheduled.

**L-B · Commitment Ledger.** Every "I will X by Y" the founder utters becomes
a tracked commitment. Two consecutive misses on the same commitment class →
the cofounder names the pattern and forces re-scope or kill (mirror of the
two-scope-failures law). Self-accountability, mechanized.

**L-C · Offer & Channel Ledger.** The founder's live offer (frozen text,
price, audience) plus the channel table:
`{channel, sent, replies, conversions, cost}`. The cofounder blocks offer
drift ("you are rewriting the offer for the third time with zero sends —
send first") and reports channel ROI weekly.

**L-D · People Ledger.** Every external actor on the receipt ladder
(L0 signal → L2 paid/shipped micro-exchange → L4 structural). The cofounder
enforces R1: nobody skips levels; enthusiasm promotes no one; two missed
commitments retires a row. The founder's partner/investor/advisor pipeline
becomes a state machine instead of a feelings archive.

### 3.2 The loop (weekly cadence)

```
DAILY    Morning verdict (one message): commitments due today,
         decisions due for review, people-rows needing action,
         yesterday's motion (offers sent / replies / receipts).
WEEKLY   The Confrontation: expected vs actual on every open
         decision; commitment hit-rate; channel table verdict;
         ONE priority for next week (never a list).
MONTHLY  Drift audit: is the founder building what the frozen
         offer sells? Is runway math still true? Are stale
         people-rows demoted?
```

### 3.3 The anti-sycophancy contract (product differentiator)

Hard-coded behaviors that generic AI chat will not do:
- Refuses to re-plan when the last plan has unexecuted committed items.
- Names patterns with evidence from the ledgers ("4th audience pivot in
  6 weeks; total sends: 12").
- Delivers a RED weekly verdict when motion = 0, regardless of how busy
  the week felt. Infrastructure-green / revenue-zero = RED, always.
- Never manufactures encouragement. IDLE-honest, like L2: "no motion this
  week" is a valid, stated outcome.

This contract is the moat. Anyone can wrap GPT in a coach persona; the
product is the *governance*, and governance is exactly what we have built,
locked, and battle-tested internally.

---

## §4 — Architecture (on the existing stack, zero new platforms)

| Component | Implementation |
|---|---|
| Ledgers | Supabase — `founder_decisions`, `founder_commitments`, `founder_offers_channels`, `people_ladder` (clone of signals schema + level/T fields) |
| Cofounder brain | LLM workers behind the gateway; ledgers are the SSOT, model is a walled worker (soup-vs-raw law: definitions live in rows, never in model memory) |
| Interface | Telegram bot per founder (proven pattern: ops bot) + web console later |
| Loop motor | CF Worker cron → Railway execution (the exact motor shipped this week) |
| Receipts | Every verdict, review, and promotion is a receipt row — the founder can audit their own coaching history; HMAC-chain later for the trust story |
| Gateway | SINA_GATEWAY routes: intake → onboarding interview → ledger seeding → daily loop activation |

Build estimate honesty: v1 is ~80% re-pointing of shipped components
(signals table, triage worker, Telegram delivery, heartbeat format, cron
motor). The genuinely new work is the onboarding interview flow and the
weekly-confrontation prompt architecture.

---

## §5 — Commercial ladder (mirrors the SourceA ladder)

```
T0  FOUNDER AUDIT        one-time, fixed price (~$500)
    The Brain Audit's sibling: 5-day audit of the founder's
    operating system — decisions, commitments, offer, pipeline —
    delivered as a receipt pack + installed ledgers. This is the
    L2 micro-exchange for this lane.
T1  AI COFOUNDER         subscription (~$200–400/mo)
    The four ledgers + daily verdict + weekly confrontation, live.
T2  OPERATED             (~$1–2K/mo) T1 + the machine also runs
    outreach mechanics: channel sends, reply triage, pipeline
    hygiene — founder only answers verdicts.
T3  GATEWAY VIP          bespoke: full SINA_GATEWAY install,
    founder's whole company on the governed loop (converges with
    the SourceA VIP lane — the two ladders meet at the top).
```

Pricing logic: T0 must be impulse-purchasable by a bootstrapped founder;
T1 must undercut a human coach 5–10x while doing what no human coach can
(daily, ledger-backed, never forgets); T2 prices against a part-time chief
of staff.

---

## §6 — Why us / why now

1. **Dogfood proof.** Every mechanism in §3 ran in production on the
   founder's own company before v1 ships. The sales asset is the receipt
   trail itself: "here is the week my system caught a $70/mo burn, a
   silent failed deploy, and forced revenue motion into my own heartbeat."
2. **Anti-sycophancy is contrarian and defensible.** The AI-coach market
   converges on agreeable chat because engagement metrics reward it. A
   product whose promise is *refusing* the founder is differentiated by
   values, not features — hard to copy without believing it.
3. **Structural timing.** Solo-founder count is exploding (AI leverage),
   cofounder matching is broken (v2 doctrine: unmeasurable before
   receipts), and the price point of human accountability doesn't scale
   down to pre-seed. The gap is exactly machine-shaped.

---

## §7 — Boundaries (locked at birth)

- **Not therapy, not mental-health support.** The product manages decisions
  and commitments. Distress signals → the cofounder says so plainly and
  points to human support; it does not coach through crisis. This boundary
  is a safety requirement and a legal one; it ships in the system prompt,
  the ToS, and the marketing.
- **Not financial/legal advice.** Ledgers can hold runway math; verdicts
  never say "take this deal." Founder decides; machine confronts.
- **Founder data is single-tenant.** One founder's ledgers never train or
  leak into another's loop. Receipts make this auditable — same trust story
  as SourceA, and a real differentiator against chat-app coaching.

---

## §8 — Validation protocol (this product obeys its own doctrine)

The lane launches under UNLOCK DOCTRINE v2, no exceptions:

```
D1   Freeze the T0 offer (one-pager, price, link).
D2   25-name list: solo technical AI founders, ONE channel
     (founder communities / LinkedIn — where the LinkedIn headline
     asset already fits).
D3   Send. Machine logs channel receipts.
D7   Verdict: replies, L2 count.
STOP 100 sends, zero L1 → offer rewrite, not product pivot.
ANY  T0 sale → deliver manually-assisted (founder-in-the-loop is
     acceptable at n<5), instrument everything, let delivery
     receipts spec v1.1.
```

Rule inherited from the canon: **sell T0 before building T1.** The ledgers
exist as internal tooling already; productization spend waits for the first
stranger's payment receipt. Two lanes (SourceA Brain Audit + Founder Audit)
may run the D1–D7 protocol in parallel ONLY if each has its own 25-name list
and its own channel receipts — audiences never mix in one artifact (§5.2
discipline).

---

## §9 — One-line form

**Install a cofounder that keeps four ledgers, confronts the founder weekly
with expected-vs-actual, promotes no one without receipts, and calls a
zero-motion week RED — sold first as a $500 audit, subscribed as a daily
loop, converging at the top with the SourceA gateway.**
