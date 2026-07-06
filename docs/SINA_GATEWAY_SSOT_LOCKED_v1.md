# Sina Gateway — Single Source of Truth (SSOT) v1

**Status:** Locked · **Date:** 2026-07-06  
**Owner:** Sina Kazemnezhad · **Repo:** `kazemnezhadsina144-dot/sina-gateway`

When docs conflict, **this file** is operational truth. For identity law, see [`SINA_GATEWAY_CONSTITUTION_LOCKED_v1.md`](./SINA_GATEWAY_CONSTITUTION_LOCKED_v1.md).

---

## 1. What this system is

| Field | Truth |
|-------|--------|
| **Name** | Sina Gateway |
| **Type** | **Commercial megagateway** — portfolio control panel + routing mesh |
| **Operator account** | Sina Kazemnezhad — personal founder account (runs the control plane) |
| **Not** | Noetfield Systems Inc., SourceA Inc., or any single venture’s corporate site |
| **Mission** | One command surface; route signals to all venture lanes; receipt-native commercial ops |
| **Pattern** | Mirror → Route → Capture → Tag → Handoff |

---

## 2. What this system is not

- Not a multi-tenant SaaS (v1)
- Not learned ML routing (v1 — rules in `src/gateway.js`)
- Not a chatbot product (web wizard + optional future Telegram bot)
- Not authorized to sign contracts on behalf of routed ventures
- Not a substitute for those ventures’ own SSOTs

---

## 3. Live surfaces (verify, don’t assume)

| Surface | URL / handle | Role |
|---------|----------------|------|
| **Production intake** | `https://sina-gateway-production.up.railway.app/` | Public wizard (indexable post-launch) |
| **Founder Audit landing** | `/founder-audit` | Wedge offer page |
| **SourceA landing** | `/for-clients` | Client lane entry |
| **Privacy** | `/privacy.html` | Policy |
| **Status** | `/status.html` | Internal ops snapshot (noindex) |
| **Health** | `/health`, `/ready` | Probes |
| **Telegram channel** | `@Gateway_A` · `-1004473252322` | **Commercial control panel** — alerts, verdicts, portfolio motion |
| **Telegram bot** | `@GateWay_A_bot` | Alert delivery (not full intake bot yet) |
| **CF ops worker** | `gateway-ops` · `*/15` cron | Watchdog; Telegram on RED only |
| **Supabase** | `tkgpapowwplupyekpivy` | `gateway_leads` table |

---

## 4. Venture mesh (route-to, not merge-with)

| Lane | Route when… | Marketing owner | Code owner |
|------|-------------|-----------------|------------|
| **FounderAudit** | UTM / notes / wedge | Sina Gateway (current wedge) | This repo |
| **SourceA** | Hire, deal, project signals | SourceA (when armed) | `sourcea.app` repos |
| **Noetfield** | Investor, strategic default | Noetfield | Noetfield repos |
| **TrustField** | Trust, risk, compliance | TrustField | TrustField repos |
| **BuildMatch** | Construction identity | BuildMatch | TBD |
| **Forge** | Builder / collaborator | Forge | TBD |
| **Personal** | Friend / warm intro | None (private) | This repo |

**Mesh rule:** Gateway captures → tags → alerts (if high) → **founder reviews** → handoff to lane happens **outside** this repo unless/until a lane builds its own intake API.

---

## 5. Doc hierarchy

```
SINA_GATEWAY_CONSTITUTION_LOCKED_v1.md   ← laws (identity, separation)
SINA_GATEWAY_SSOT_LOCKED_v1.md           ← this file (live truth)
SINA_GATEWAY_BLUEPRINT_LOCKED_v1.md      ← architecture + evolution
SINA_GATEWAY_TERMINOLOGY_LOCKED_v1.md    ← operator vocabulary
SINA_GATEWAY_CLIENT_VOCABULARY_LOCKED_v1.md ← public copy rules
ROUTING_MESH_LAWS_LOCKED_v1.md           ← venture handoff laws
WEDGE_LOCKED_v1.md                       ← current 90-day marketing wedge
GATEWAY_10_STEP_UPGRADE_LOCKED_v1.md      ← infra rollout status
GATEWAY_888_UPGRADES_PLAN.md             ← backlog (numbered, not all law)
UNLOCK_DOCTRINE_LOCKED_v2.md             ← portable philosophy (shared logic, separate patient)
FOUNDER_GATEWAY_BLUEPRINT_LOCKED_v1.md   ← future AI-cofounder product (not gateway v1)
```

---

## 6. Environment truth

| Var | Where | Purpose |
|-----|-------|---------|
| `SUPABASE_URL` / `SUPABASE_ANON_KEY` | Railway | Capture |
| `TURNSTILE_*` | Railway | Bot gate |
| `TELEGRAM_BOT_TOKEN` / `TELEGRAM_ALERT_CHAT_ID` | Railway + CF workers | `@Gateway_A` |
| `CAPTURE_METADATA_ENABLED` | Railway | `is_test` + metadata columns |
| `COMMERCIAL_ARMED` | `gateway-ops` only | Daily commercial heartbeat (after real sends) |
| `GATEWAY_BASE_URL` | `gateway-ops` | Probe target |

Secrets file: `~/.sourcea-secrets/sina-gateway.env` (local sync via `npm run sync:railway`).

---

## 7. Verification commands (receipts)

```bash
npm run launch:gate          # pre/post launch gates
npm run chain:health         # production chain
npm run private-test         # capture + RLS
npm run monitors:verify      # UptimeRobot URL readiness
npm run test:notify-capture  # Telegram alert path
npm run validate:utm         # campaign taxonomy
```

---

## 8. Current season snapshot (2026-07-06)

| Item | Status |
|------|--------|
| Public launch | **Live** — indexable |
| Wedge | **Founder Audit** (D2/D3 skipped by founder choice) |
| Commercial heartbeat | **Not armed** — arm with `npm run sync:heartbeat` after real sends |
| Control panel silence on infra | **Expected when green** — commercial posts require `COMMERCIAL_ARMED` |
| Batch 2 (intro links, /for-clients) | Branch `cursor/888-batch-2-attraction` — merge pending |

---

## 9. Amendment log

| Date | Change |
|------|--------|
| 2026-07-06 | v1.1 — commercial megagateway + control panel framing; terminology docs |
