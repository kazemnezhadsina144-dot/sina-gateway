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

| Motor | Schedule | Alerts |
|-------|----------|--------|
| **`gateway-ops`** CF worker | `*/15` cron | Watchdog RED + daily heartbeat → `@Gateway_A` |
| Railway `sina-gateway` | always on | High-priority leads → `@Gateway_A` |

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

If you want a tertiary ping **for gateway-ops only** (not NOOS):

| Method | URL | Schedule |
|--------|-----|----------|
| GET | `https://gateway-ops…/run?mode=watchdog` | every 15 min |

One job max. Do not cron other products from this channel's playbook.

---

## Message types you should see in `@Gateway_A`

| Message | Source |
|---------|--------|
| `Sina Gateway watchdog RED` | `gateway-ops` |
| `Sina Gateway heartbeat RED/GREEN` | `gateway-ops` |
| `High-priority Sina Gateway lead` | Railway capture |
| `NF intake probe` | **Wrong** — loop-specialist misconfigured |

---

## Heartbeat RED is expected

`commercial: RED (offers_sent=0)` until Founder Audit outbound starts — infra can be green while commercial is red.
