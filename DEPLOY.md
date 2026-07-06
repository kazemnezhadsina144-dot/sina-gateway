# Deploy

## Railway (production)

**Live URL:** https://sina-gateway-production.up.railway.app

### Auto-deploy from GitHub

1. Railway → `sina-gateway` project → Service → Settings → Source
2. Connect repo: `kazemnezhadsina144-dot/sina-gateway`
3. Branch: `main`
4. Root directory: `/`
5. Start command: `npm start` (auto-detected)

Pushes to `main` deploy after [Gateway CI](.github/workflows/gateway-ci.yml) passes (merge via PR recommended).

### Manual deploy

```bash
railway up -s sina-gateway -m "description"
```

## Cloudflare Workers

```bash
cd workers/gateway-ops && wrangler deploy
# or legacy split workers:
cd workers/gateway-watchdog && wrangler deploy
cd ../gateway-heartbeat && wrangler deploy
```

**24/7 stack:** `gateway-ops` CF cron + Railway → Telegram `@Gateway_A` only. See [docs/GATEWAY_247_AUTORUN_SETUP.md](docs/GATEWAY_247_AUTORUN_SETUP.md).

## Secrets

See [docs/OPS_SECRETS_SETUP.md](docs/OPS_SECRETS_SETUP.md).

## Verify after deploy

```bash
SMOKE_BASE_URL=https://sina-gateway-production.up.railway.app npm run smoke
CHAIN_HEALTH_BASE_URL=https://sina-gateway-production.up.railway.app npm run chain:health
```
