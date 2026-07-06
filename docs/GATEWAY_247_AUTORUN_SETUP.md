# Gateway 24/7 Alert Stack (ROI tiers)

**Telegram:** `@Gateway_A` · chat ID `-1004473252322`

---

## Service ROI map (locked)

### ✅ UptimeRobot — use it (high ROI, free)

**Role:** Alert only — “is this URL up?” **GET only.**

SSOT: `data/noos-external-monitors-v1.json`

| Monitor | URL | Keyword |
|---------|-----|---------|
| NOOS loop runner | `https://noos-loop-runner-production.up.railway.app/health` | `noos-loop-runner` |
| NOOS fleet tick | `https://noos-loop-fleet-tick-v1.sina-kazemnezhad-ca.workers.dev/health` | — |
| NOOS deadman | `https://noos-deadman-v1.sina-kazemnezhad-ca.workers.dev/health` | — |
| Noetfield www (optional) | `https://www.noetfield.com/` | — |
| Sina Gateway health | `https://sina-gateway-production.up.railway.app/health` | `ok` |
| Sina Gateway ready | `https://sina-gateway-production.up.railway.app/ready` | status 200 |

**Do not** use UptimeRobot to POST `/loop` or trigger workflows.

### ⚠️ cron-job.org — **one job max** (medium ROI)

**Role:** Tertiary deadman only — not a second loop motor.

| OK | Not OK |
|----|--------|
| `POST https://noos-deadman-v1.sina-kazemnezhad-ca.workers.dev/check` every **30 min** | Any job hitting `/loop` or GitHub dispatch |
| Backup if CF `scheduled()` misfires | Duplicate `*/5` loop ticks |

### ❌ Don't add

- GHA schedules on loops (retired)
- cron-job.org firing loops every 5 min
- A third “intelligence” cron until Phase B liveness rows populate

---

## Layer A — Primary motors ($0)

| Motor | Schedule | Delivers to |
|-------|----------|-------------|
| `sourcea-loop-specialist-tick-v1` | `*/15` + dispatch table | nerve + sg-watchdog + sg-heartbeat |
| `gateway-ops` | `*/15` (Workers Paid) | watchdog + heartbeat backup |

---

## Layer B — Cloudflare Workers Paid ($5/mo)

`gateway-ops` native cron — deployed with Telegram secrets.

```bash
cd workers/gateway-ops && wrangler deploy
```

---

## Telegram secrets

| Worker / service | `TELEGRAM_BOT_TOKEN` | `TELEGRAM_ALERT_CHAT_ID` |
|------------------|----------------------|---------------------------|
| `@GateWay_A_bot` | `8892104468:…` | `-1004473252322` |
| Railway `sina-gateway` | set | set |
| `loop-specialist-tick-v1` | set | set |
| `gateway-ops` | set | set |
| `noos-deadman-v1` | set | set |

Arm Supabase for nerve probes:

```bash
cd Noetfield-Systems/SourceA && ./scripts/nerve_probe_cf_secrets_v1.sh
# Then re-apply Gateway_A chat ID if script overwrote it:
printf '%s' '-1004473252322' | wrangler secret put TELEGRAM_ALERT_CHAT_ID
```

---

## Smoke commands

```bash
# Nerve E2E (expect 4/4 PASS)
curl -sS -X POST https://sourcea-loop-specialist-tick-v1.sina-kazemnezhad-ca.workers.dev/nerve/run | jq '.ok, .probes[].verdict'

# Gateway watchdog
curl -sS "https://gateway-ops.sina-kazemnezhad-ca.workers.dev/run?mode=watchdog" | jq '.watchdog.ok'

# Deadman (cron-job.org target)
curl -sS -X POST https://noos-deadman-v1.sina-kazemnezhad-ca.workers.dev/check | jq '.ok'
```

---

## Heartbeat RED is expected

`commercial: RED (offers_sent=0)` until Founder Audit D3 outbound starts — infra can be GREEN while commercial is RED (doctrine).
