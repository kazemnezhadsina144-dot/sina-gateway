# Gateway Private Test Readiness Receipt v1

**Current status:** `PRIVATE_TEST_PASS` (verified 2026-07-06)  
**Production:** `https://sina-gateway-production.up.railway.app`  
**Supabase:** Noetfield `tkgpapowwplupyekpivy` — live capture via `~/.sourcea-secrets/sina-gateway.env`

Date: 2026-06-29 (initial pass) · upgraded 2026-07-06  
Workspace: `/Users/sinakazemnezhad/Desktop/SINA GATEWAY`

## Scope

Safe overnight validation, hardening, and readiness pass for Sina Gateway only.

No deployment was performed. No service-role key was requested or used. No admin read view was added. No routing behavior was changed during this pass.

## Git Baseline

- Branch: `main`
- Starting HEAD for E2E upgrade pass: `1f6ae0ce3134de89629d33af4fe4b1bd812f8451`
- Final HEAD: unchanged, no commit created in this pass.
- Dirty count before E2E upgrade pass: `0`
- Dirty count after E2E upgrade pass: `4`
- Commit: not created; this pass added local E2E coverage and left changes for review.

## Files Changed In This Pass

- `SETUP.md`
- `NOTIFICATIONS.md`
- `package.json`
- `src/server.js`
- `src/notifications.js`
- `scripts/verify-supabase.js`
- `scripts/smoke-test.js`
- `scripts/test-notifications.js`
- `scripts/e2e-local-pipeline.js`
- `README.md`
- `docs/GATEWAY_PRIVATE_TEST_READINESS_RECEIPT_v1.md`

## Command Results

| Command | Status | Notes |
| :-- | :-- | :-- |
| `git branch --show-current` | PASS | `main`. |
| `git rev-parse HEAD` | PASS | `1f6ae0ce3134de89629d33af4fe4b1bd812f8451`. |
| `git status --short` | PASS_WITH_CHANGES | E2E upgrade changed `README.md`, `docs/GATEWAY_PRIVATE_TEST_READINESS_RECEIPT_v1.md`, `package.json`, and added `scripts/e2e-local-pipeline.js`. |
| `npm test` | PASS | Gateway routing and validation tests passed. |
| `npm run validate:env` | PASS_WITH_WARNINGS | `NOTIFY_WEBHOOK_URL` is missing, so live notifications are disabled. |
| `npm run check` | PASS | Syntax checks passed for server, gateway, notifications, frontend, and scripts. |
| `npm run audit:routes` | PASS | All route combinations produced valid routes/confidence. |
| `npm run test:shared-routing` | PASS | Browser-consumable routing definitions match backend routing outcomes. |
| `npm run check:schema` | PASS | Server lead payload fields are represented in `supabase/schema.sql`. |
| `npm run test:notifications` | PASS | Dry-run payload and no-op behavior passed. |
| `npm run e2e:local` | PASS | Non-network intake -> enrichment -> validation -> local persistence shape -> notification dry-run passed. |
| `npm run readiness` | PASS_WITH_SKIPS | Core checks pass; localhost and Supabase live checks may be skipped in restricted environments. |
| `npm run smoke` | SKIPPED_LOCALHOST_UNAVAILABLE | Sandbox blocked localhost HTTP with `EPERM`. Server start itself succeeded. |
| `npm run verify:supabase` | SKIPPED_NETWORK_UNAVAILABLE | Sandbox DNS/network could not reach Supabase host: `ENOTFOUND`. |
| `git diff --check` | PASS | No whitespace/conflict-marker errors. |

## Supabase Status

Status: SKIPPED_NETWORK_UNAVAILABLE in this environment.

Verifier behavior is explicit:

- Missing env reports `SKIPPED_ENV_MISSING`.
- Missing table reports `SKIPPED_SUPABASE_TABLE_MISSING`.
- Network/DNS failure reports `SKIPPED_NETWORK_UNAVAILABLE`.
- Successful live verification must print `INSERT OK` and `READ DENIED BY RLS (0 rows visible to anon)`.

Schema readiness confirmed by inspection:

- `public.gateway_leads` table exists in `supabase/schema.sql`.
- RLS is enabled.
- Anon insert-only policy exists.
- No anon read/update/delete policy is defined.
- Indexes exist.
- Upgraded data-model and routing fields expected by code are included.

Manual founder action required:

1. In Supabase SQL Editor, run the full contents of `supabase/schema.sql`.
2. Run `npm run verify:supabase` from an environment with network access.
3. Confirm both `INSERT OK` and anon read denial before public use.

## Notification Status

Status: **PASS** — Telegram high-priority alerts (see `NOTIFICATIONS.md`).

Dry-run safety is PASS:

- `TELEGRAM_BOT_TOKEN` + `TELEGRAM_ALERT_CHAT_ID` on Railway for live sends.
- Legacy `NOTIFY_WEBHOOK_URL` docs superseded; `validate-env.js` accepts either channel.
- High-priority notification payload is minimal.
- Payload does not include Supabase keys, env values, IPs, or browser internals.
- Medium/low-priority leads do not trigger notification sends.
- Failed notification delivery does not block lead capture.

Live test: `npm run test:notifications` (dry-run) · `npm run test:notify-capture` (production, founder env).

## Private Test Readiness

Status: **PRIVATE_TEST_PASS** (2026-07-06).

The app is live on Railway with Supabase capture. `noindex` and `robots.txt` remain until intentional SEO launch.

Current pre-public protections:

- `robots.txt` disallows crawling.
- Page has `noindex, nofollow`.
- Supabase uses anon-key path only.
- Service-role key is not configured.
- Capture endpoint has rate limiting, size limit, honeypot, structured errors, request IDs, and Turnstile on production.

Remaining optional actions:

1. Delete test rows in Supabase (`docs/PRIVATE_TEST_CLEANUP.sql`).
2. Remove `noindex` when ready for public indexing.
3. Assign custom domain on Railway (founder-decide).

---

## Appendix — 10-Step Upgrade Verification (2026-07-06)

**Status:** `PRIVATE_TEST_PASS`

| Command | Result |
|---------|--------|
| `npm run verify:supabase` | PASS — INSERT OK; READ DENIED BY RLS |
| `npm run readiness` | PASS — core checks; supabase-live PASS |
| `npm run private-test` | PASS — robots, noindex, chain:health, browser-capture, anon-read-denied |
| `CHAIN_HEALTH_BASE_URL=https://sina-gateway-production.up.railway.app npm run chain:health` | PASS |
| `npm run test:server-hardening` | PASS |
| `npm run test:turnstile` | PASS |
| `npm run test:notifications` | PASS (Telegram dry-run) |

**Supabase:** Noetfield `tkgpapowwplupyekpivy` — live capture (not JSON fallback).  
**Env source:** `~/.sourcea-secrets/sina-gateway.env` — see `data/supabase-binding-v1.json`.  
**Production URL:** `https://sina-gateway-production.up.railway.app`  
**Notifications:** Telegram high-priority alerts (see `NOTIFICATIONS.md`).

Cleanup: remove test rows with `source = private-test` or name like `[PRIVATE-TEST]%` in Supabase dashboard.

**Signer:** Cursor 10-step upgrade pass — Step 4 gate closed
