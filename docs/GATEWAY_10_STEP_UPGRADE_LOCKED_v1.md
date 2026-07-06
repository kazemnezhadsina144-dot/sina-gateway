# Sina Gateway — 10-Step Upgrade Plan (Locked)

**Status:** Locked · **Scope:** This repo only (`sina-gateway`)  
**Date:** 2026-07-06  
**Doctrine:** UNLOCK DOCTRINE v2 · cost-intelligent · Telegram not webhooks

---

## One-line

**Ten scoped upgrades inside Sina Gateway — capture, alerts, schema, bot protection, monitors, Founder Audit prep, then launch.**

No SourceA, NOOS, Noetfield, or TrustField repo changes in this plan.

---

## Step 1 — Land Telegram lead alerts

| | |
|---|---|
| **What** | Commit and deploy `src/telegram.js`, `src/notifications.js`, `src/server.js`, `NOTIFICATIONS.md`, `.env.example` |
| **Why** | High-priority leads alert `@Gateway_A` via Bot API — no webhooks |
| **Railway vars** | `TELEGRAM_BOT_TOKEN`, `TELEGRAM_ALERT_CHAT_ID` |
| **After SQL** | Set `CAPTURE_METADATA_ENABLED=true` on Railway |
| **Check** | `curl -sS https://sina-gateway-production.up.railway.app/ready \| jq .notificationsConfigured` → `true` |
| **Stop** | Do not commit `.env` |

---

## Step 2 — Ship `gateway-ops` worker in repo

| | |
|---|---|
| **What** | Commit `workers/gateway-ops/` + `workers/gateway-watchdog|heartbeat` Telegram helpers |
| **Why** | Dedicated CF cron (`*/15`) + manual `/run?mode=watchdog\|heartbeat` |
| **Deploy** | `cd workers/gateway-ops && wrangler secret put TELEGRAM_* && wrangler deploy` |
| **Check** | `curl -sS …/gateway-ops…/run?mode=watchdog` → `"ok": true` |
| **Stop** | Cron already live on Workers Paid — redeploy only when code changes |

---

## Step 3 — Apply capture metadata migration

| | |
|---|---|
| **What** | Run `supabase/migrations/20260706_capture_metadata.sql` in Supabase SQL Editor |
| **Why** | `is_test`, `app_version`, `environment` columns for private-test cleanup and receipts |
| **Check** | `npm run verify:migration` PASS after SQL applied |
| **Stop** | Founder manual SQL only — never service_role in this app |

---

## Step 4 — Turnstile on production

| | |
|---|---|
| **What** | Cloudflare Turnstile site → Railway `TURNSTILE_SITE_KEY` + `TURNSTILE_SECRET_KEY` |
| **Why** | Bot gate before public traffic |
| **Check** | `npm run test:turnstile` · `/ready` → `turnstileConfigured: true` · one browser submit |
| **Stop** | Skip only while private-test is founder-only and low traffic |

---

## Step 5 — UptimeRobot (gateway only, GET alert)

| | |
|---|---|
| **What** | Add 2 monitors from `data/gateway-external-monitors-v1.json` |
| **Why** | External eye on Railway — different failure domain than CF workers |
| **Monitors** | `/health` (keyword `ok`) · `/ready` (status 200) |
| **Forbidden** | POST `/api/leads`, workflow triggers, loop motors |
| **Check** | UptimeRobot dashboard both green |

---

## Step 6 — Production chain gate

| | |
|---|---|
| **What** | Run full local + production verification suite |
| **Commands** | `npm run readiness` · `CHAIN_HEALTH_BASE_URL=https://sina-gateway-production.up.railway.app npm run chain:health` · `npm run private-test` |
| **Why** | Single PASS receipt before merge to `main` |
| **Check** | All scripts PASS or documented SKIP with reason |
| **Stop** | Fix RED before Step 9 deploy |

---

## Step 7 — Founder Audit D2 list

| | |
|---|---|
| **What** | Fill 25 names in `data/founder-audit-d2-list.json` per `docs/FOUNDER_AUDIT_D2_LIST_CRITERIA_LOCKED_v1.md` |
| **Why** | Commercial motion gate — heartbeat stays RED until outbound starts |
| **Check** | `npm run validate:d2-list` → 25 rows, 0 placeholder names |
| **Stop** | Founder fills names — agent does not invent contacts |

---

## Step 8 — Live Telegram capture test

| | |
|---|---|
| **What** | `TELEGRAM_BOT_TOKEN=… TELEGRAM_ALERT_CHAT_ID=… npm run test:notify-capture` |
| **Why** | End-to-end: high-priority POST → Supabase → `@Gateway_A` message |
| **Check** | Message in channel · lead row in `gateway_leads` · anon read denied |
| **Stop** | Use `[PRIVATE-TEST]` naming · cleanup via `docs/PRIVATE_TEST_CLEANUP.sql` |

---

## Step 9 — Merge to `main` + Railway deploy

| | |
|---|---|
| **What** | PR `cursor/update-private-test-readiness-receipt` (or feature branch) → `main` |
| **Why** | Git truth matches live Railway + CF workers |
| **Check** | `npm run smoke` on production after deploy · `git log -1` on Railway matches `main` |
| **Stop** | No force-push · no unrelated files in PR |

---

## Step 10 — Public launch gate

| | |
|---|---|
| **What** | Execute `LAUNCH_CHECKLIST.md` + `docs/PUBLIC_LAUNCH_GATE_LOCKED_v1.md` |
| **Preconditions** | Steps 1–6 green · Turnstile on · 7 days watchdog green (or manual `/run` log) |
| **Founder gates** | Privacy policy URL · data deletion process · remove `noindex` / update `robots.txt` intentionally |
| **Cleanup** | Delete `is_test = true` rows · record launch date in readiness receipt |
| **Check** | First real non-test lead captured · heartbeat commercial path started |
| **Stop** | Do not launch with fake testimonials, prices, or license claims |

---

## Explicitly out of scope (other repos)

- `sourcea-loop-specialist-tick-v1` nerve probes  
- NOOS deadman / loop fleet  
- Noetfield intake E2E  
- GitHub Actions cron (usage limit)  
- Second GitHub account migration  

See `docs/GATEWAY_247_AUTORUN_SETUP.md` for how gateway piggybacks external motors — **operate only, do not edit those repos from this plan.**

---

## Current snapshot (2026-07-06)

| Step | Status |
|------|--------|
| 1 Telegram | **Done** — committed + live on Railway |
| 2 gateway-ops | **Done** — committed + CF cron live |
| 3 migration | **Founder** — run SQL, then `npm run verify:migration` + `CAPTURE_METADATA_ENABLED=true` |
| 4 Turnstile | **Founder** — CF Turnstile keys on Railway |
| 5 UptimeRobot | **Founder** — `data/gateway-external-monitors-v1.json` |
| 6 chain gate | **Done** — private-test 6/6 PASS |
| 7 D2 list | **Founder** — fill 25 names |
| 8 notify test | **Done** — `test:notify-capture` PASS |
| 9 merge | **PR open** — https://github.com/kazemnezhadsina144-dot/sina-gateway/pull/1 |
| 10 launch | Blocked on 3–4–7 |
