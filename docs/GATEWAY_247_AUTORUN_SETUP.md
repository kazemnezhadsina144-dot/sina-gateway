# Gateway 24/7 Alert Stack

**Telegram channel:** `@Gateway_A` · `-1004473252322`  
**Bot:** `@GateWay_A_bot`  
**Scope:** Sina Gateway only — this channel must not receive other products' alerts.

---

## Why you saw SourceA / NOOS messages here

During setup, `TELEGRAM_ALERT_CHAT_ID` for **other** Cloudflare workers (e.g. SourceA loop-specialist) was mistakenly set to `@Gateway_A`. Those workers post their own nerve/deadman alerts to whatever chat ID they hold.

**Sina Gateway code never sends other-repo messages.** Fix is on those workers' secrets — not in this repo.

**One-time founder fix (Cloudflare dashboard):**

1. Workers → `sourcea-loop-specialist-tick-v1` → Settings → Variables  
2. Set `TELEGRAM_ALERT_CHAT_ID` back to your **SourceA ops chat** (not `-1004473252322`)  
3. Repeat for any other worker that should not use `@Gateway_A`

**This repo only arms:**

| Target | Secrets |
|--------|---------|
| Railway `sina-gateway` | `TELEGRAM_BOT_TOKEN`, `TELEGRAM_ALERT_CHAT_ID` |
| CF `gateway-ops` | same via `wrangler secret put` |
| CF `gateway-watchdog` / `gateway-heartbeat` | optional manual `/run` |

Do **not** point other products at `@Gateway_A`.

---

## Autorun motor (gateway only)

| Tier | Motor | Schedule | Cost | Role |
|------|-------|----------|------|------|
| **1** | **`gateway-ops`** CF worker | `*/15` cron | Workers Paid | Real probes → Telegram on infra RED only |
| **2** | UptimeRobot | 5 min GET | Free | External `/health` + `/ready` alerts |
| **3** | GitHub Actions deadman | 2×/day | Public repo minutes | Direct Railway `/ready` — no nested CF curl |
| — | Railway `sina-gateway` | always on | Railway | High-priority leads → `@Gateway_A` |

**Not scheduled (ROI):** GHA heartbeat — CF owns the daily 07:00 PT window. Use `workflow_dispatch` for manual infra checks only.

```bash
cd workers/gateway-ops
wrangler secret put TELEGRAM_BOT_TOKEN
wrangler secret put TELEGRAM_ALERT_CHAT_ID
wrangler deploy
```

Manual smoke:

```bash
curl -sS "https://gateway-ops.sina-kazemnezhad-ca.workers.dev/run?mode=watchdog"
curl -sS "https://gateway-ops.sina-kazemnezhad-ca.workers.dev/run?mode=heartbeat"
```

**Commercial heartbeat (real data only):** after logging sends in `data/channel-receipts.json`:

```bash
npm run sync:heartbeat
```

This sets `COMMERCIAL_ARMED=true` and syncs `OFFERS_SENT` / `REPLIES` / `L2_RECEIPTS` to `gateway-ops`. Until then, heartbeat reports `commercial.status: NOT_CONFIGURED` — no fake RED Telegram.

**REVENUE motor (`gateway_outbound_log_v1`):** registered in SG workflow census. Founder sends D3 outbound → log:

```bash
npm run channel:send -- --count 1 --mark-sent
npm run sync:heartbeat
```

Census reads `data/channel-receipts.json` weekly; `offers_sent` must be > 0 for commercial GREEN.

---

## UptimeRobot (gateway only, free)

SSOT: `data/gateway-external-monitors-v1.json`

| Monitor | URL |
|---------|-----|
| Health | `https://sina-gateway-production.up.railway.app/health` (keyword `ok`) |
| Ready | `https://sina-gateway-production.up.railway.app/ready` (status 200) |

GET only — never POST `/api/leads` or loop endpoints.

---

## Optional backup cron (gateway only)

| Method | URL | Schedule |
|--------|-----|----------|
| GHA deadman | `GET /ready` on Railway | 2×/day (`06:00` + `18:00` UTC) |

Do **not** duplicate `gateway-ops` `*/15` in GHA — that wastes minutes with zero extra signal.

---

## Message types you should see in `@Gateway_A`

| Message | Source |
|---------|--------|
| `Sina Gateway watchdog RED` | `gateway-ops` |
| `Sina Gateway heartbeat RED/GREEN` | `gateway-ops` |
| `High-priority Sina Gateway lead` | Railway capture |
| `NF intake probe` | **Wrong** — loop-specialist misconfigured |

---

## Heartbeat commercial gate

- **Infra RED** → Telegram alert immediately.
- **Commercial RED** → Telegram only when `COMMERCIAL_ARMED=true` and real `offers_sent` from `channel-receipts.json` is `0`.
- **Before outbound starts** → `commercial.status: NOT_CONFIGURED` — no fake RED spam.
