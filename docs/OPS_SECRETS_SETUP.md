# Ops Secrets Setup

Configure outside the repo. Never commit values.

## Telegram (all alerts — same as SourceA / Noetfield)

| Variable | Where | Purpose |
|----------|--------|---------|
| `TELEGRAM_BOT_TOKEN` | loop-specialist CF worker | Watchdog RED + daily heartbeat |
| `TELEGRAM_ALERT_CHAT_ID` | loop-specialist CF worker | Ops chat |
| `TELEGRAM_BOT_TOKEN` | Railway `sina-gateway` | High-priority lead capture |
| `TELEGRAM_ALERT_CHAT_ID` | Railway `sina-gateway` | Ops chat |

Also accepted: `TELEGRAM_ALLOWED_CHAT_ID`, `TELEGRAM_OPS_CHAT_ID` (Noetfield naming).

Arm on loop-specialist (reuse SourceA script):

```bash
cd Noetfield-Systems/SourceA && ./scripts/nerve_probe_cf_secrets_v1.sh
```

Deploy motor after gateway probe jobs ship:

```bash
cd Noetfield-Systems/SourceA/cloud/workers/loop-specialist-tick-v1 && wrangler deploy
```

## Railway (`sina-gateway` service)

| Variable | Purpose |
|----------|---------|
| `SUPABASE_URL` | Live capture |
| `SUPABASE_ANON_KEY` | Anon insert only |
| `NODE_ENV` | `production` |
| `ALLOWED_ORIGINS` | `https://sina-gateway-production.up.railway.app` |
| `TELEGRAM_BOT_TOKEN` | High-priority lead alerts |
| `TELEGRAM_ALERT_CHAT_ID` | Ops chat |
| `TURNSTILE_SITE_KEY` | Browser widget |
| `TURNSTILE_SECRET_KEY` | Server verification |
| `CAPTURE_METADATA_ENABLED` | `true` only after Step 3 migration applied |

Test after setting:

```bash
npm run test:notifications
TELEGRAM_BOT_TOKEN=... TELEGRAM_ALERT_CHAT_ID=... npm run test:notify-capture
```

## Turnstile

1. Cloudflare Dashboard → Turnstile → Add site
2. Set keys on Railway
3. `npm run test:turnstile`
4. Submit via browser on production

## 24/7 alert stack

See [GATEWAY_247_AUTORUN_SETUP.md](GATEWAY_247_AUTORUN_SETUP.md) — loop-specialist (free) + optional Workers Paid ($5) + UptimeRobot + cron-job.org + Telegram `@Gateway_A`.
