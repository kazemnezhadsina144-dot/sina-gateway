# Founder Audit — D2 Target List Criteria (Locked)

**Status:** Locked for founder use · **Date:** 2026-07-05  
**Protocol:** UNLOCK DOCTRINE v2 §7 · **Offer:** `FOUNDER_AUDIT_OFFER_LOCKED_v1.md`  
**D2 task:** Build exactly **25 names**, **one audience**, **one channel**

---

## Audience lock (non-negotiable)

**Solo technical founders, pre-seed to seed, building with AI, no cofounder.**

They ship code or agent systems themselves, make every decision alone, and
would accept blunt machine accountability more easily than mentor fluff.

**Not on this list:** idea-stage non-builders, teams with exec structure,
motivation-seeking coaching buyers, enterprise buyers, agencies, investors
(unless they are also actively building solo).

---

## Channel lock for first batch (pick one)

| Channel | When to use | UTM template |
|--------|-------------|--------------|
| **LinkedIn DM** (recommended) | Headline/post already fits founder-accountability angle | `utm_source=linkedin&utm_campaign=founder-audit` |
| Founder Slack/Discord | You have standing in one community only | `utm_source=<community-slug>&utm_campaign=founder-audit` |
| Warm intro | Introducer names audience explicitly | `utm_source=intro-<name>&utm_campaign=founder-audit` |

**Rule:** Do not mix channels in the first 25. Log sends in the channel table
before D3.

---

## Inclusion criteria (must meet ≥4 of 6)

1. **Solo operator** — no cofounder, or cofounder left / inactive
2. **Technical builder** — ships product (repo, demo, or public build log in last 90 days)
3. **AI-native** — product or workflow clearly uses LLMs, agents, or automation
4. **Pre-seed to seed** — bootstrapped or small round; not Series A+
5. **Visible throughput pain** — posts about pivots, burnout, "too many threads," or decision overload
6. **Reachable** — LinkedIn DM open, mutual, or warm intro path exists

---

## Exclusion criteria (any one disqualifies)

- Full executive team already in place
- Pure coach/consultant selling services (not building a product)
- Student / hobby project with no commercial intent
- Already in active sales conversation for SourceA Brain Audit (separate lane)
- Anyone you cannot honestly describe as "solo technical AI founder" in one sentence

---

## Row template (copy per name)

```text
# | name | company/product | channel | fit_score (/6) | why_now (1 line) | contact_path | sent (Y/N) | reply (Y/N)
```

**fit_score:** count of inclusion criteria met (minimum **4** to add).

**why_now:** one receipt-backed reason they might care now (recent post, launch, pivot, public struggle — not vibes).

---

## List composition targets (25 rows)

| Bucket | Count | Notes |
|--------|-------|-------|
| Strong fit (5–6 criteria) | 15 | Priority sends D3 day 1 |
| Stretch fit (4 criteria) | 10 | Send only after strong batch drafted |
| Investors / friends / construction | 0 | Wrong lane — route elsewhere |

Geography: default **North America + UK** (English offer). No need for Vancouver-only.

---

## Message invariant (D3)

Every outbound message must include:

1. **Audience named** — "solo technical founder building with AI"
2. **Offer named** — Founder Audit (not Brain Audit, not "coaching")
3. **Price stated** — $500
4. **Scope stated** — 5 business days, written report + ledger install
5. **CTA** — pay link when live, or gateway link with UTM until then
6. **No discovery call** — do not invite "quick chat to see if it's a fit"

---

## Stop conditions (from doctrine)

- **100 sends, zero L1 replies** → rewrite offer (`FOUNDER_AUDIT_OFFER_LOCKED_v1.md`), not product
- **Any L2 payment** → unlock; deliver manually at n<5; instrument delivery receipts

---

## Gateway routing note

Inbound from this campaign should land on venture route **`FounderAudit`** when
`utm_campaign=founder-audit` or notes mention founder-audit / solo founder /
AI cofounder signals. See `ROUTING.md`.
