# Ops Secrets Setup

Configure outside the repo. Never commit values.  
**`@Gateway_A` is for Sina Gateway only** — do not reuse this chat ID on other products' workers.

## Telegram

| Variable | Where | Purpose |
|----------|--------|---------|
| `TELEGRAM_BOT_TOKEN` | Railway `sina-gateway` | High-priority lead alerts |
| `TELEGRAM_ALERT_CHAT_ID` | Railway `sina-gateway` | `@Gateway_A` (`-1004473252322`) |
| `TELEGRAM_BOT_TOKEN` | CF `gateway-ops` | Watchdog + heartbeat |
| `TELEGRAM_ALERT_CHAT_ID` | CF `gateway-ops` | `@Gateway_A` |

```bash
cd workers/gateway-ops
wrangler secret put TELEGRAM_BOT_TOKEN
wrangler secret put TELEGRAM_ALERT_CHAT_ID
wrangler deploy
```

Also accepted on Railway: `TELEGRAM_ALLOWED_CHAT_ID`, `TELEGRAM_OPS_CHAT_ID`.

## Railway (`sina-gateway` service)

| Variable | Purpose |
|----------|---------|
| `SUPABASE_URL` | Live capture |
| `SUPABASE_ANON_KEY` | Anon insert only |
| `NODE_ENV` | `production` |
| `ALLOWED_ORIGINS` | `https://sina-gateway-production.up.railway.app` |
| `TELEGRAM_BOT_TOKEN` | High-priority lead alerts |
| `TELEGRAM_ALERT_CHAT_ID` | `@Gateway_A` |
| `TURNSTILE_SITE_KEY` | Browser widget |
| `TURNSTILE_SECRET_KEY` | Server verification |
| `CAPTURE_METADATA_ENABLED` | `true` only after Step 3 migration applied |

Test:

```bash
npm run test:notifications
npm run test:notify-capture
```

## Turnstile

1. Cloudflare Dashboard → Turnstile → Add site  
2. Set keys on Railway  
3. `npm run test:turnstile`

## 24/7 autorun

See [GATEWAY_247_AUTORUN_SETUP.md](GATEWAY_247_AUTORUN_SETUP.md) — `gateway-ops` CF cron + Railway only.
