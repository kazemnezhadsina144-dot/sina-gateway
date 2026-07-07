# Sina Gateway

**Personal founder project** — not Noetfield Systems Inc. Repo: `kazemnezhadsina144-dot/sina-gateway`.

Sina Gateway is a working v1 of the locked blueprint: **Mirror -> Route -> Capture -> Tag**.

It is intentionally small:

- Agentic intake wizard
- Deterministic venture routing
- Rule-based lead tagging
- Secure server-side capture endpoint
- Local JSON fallback storage
- Supabase schema for live storage
- Upgraded lead data model with contact channels, route reasons, tags, status, and follow-up fields

## Run Locally

```bash
npm start
```

Open `http://localhost:4173`.

If Supabase env vars are not set, captured leads are written to `data/leads.json`.

## Test

```bash
npm test
```

Extra checks:

```bash
npm run readiness
```

Individual checks:

```bash
npm run validate:env
npm run check
npm run audit:routes
npm run test:shared-routing
npm run check:schema
npm run e2e:local
npm run smoke
npm run chain:health
npm run private-test
npm run launch:gate
npm run monitors:verify
```

## Capture test (public or private)

```bash
npm run private-test
```

**Public launch (2026-07-06):** `index.html` is indexable and `robots.txt` allows `/`. SEO gate checks are skipped in capture test mode; chain health + capture + RLS checks still run.

**Test-lead naming convention** (when exercising capture manually):

- `source`: `private-test`
- `name`: `[PRIVATE-TEST] YYYY-MM-DD`
- `contact`: `private-test+<timestamp>@example.com`

**Operator note:** After each test session, review rows in Supabase Table Editor and delete test leads. Use `docs/PRIVATE_TEST_CLEANUP.sql` (postgres role).

**Checklist**

1. `npm run verify:supabase` → INSERT OK + READ DENIED
2. `CHAIN_HEALTH_BASE_URL=https://sina-gateway-production.up.railway.app npm run chain:health` → all PASS
3. `npm run private-test` → browser-capture PASS
4. Confirm test row in Supabase dashboard (anon cannot read it)
5. Delete test rows via cleanup SQL when done

**Outbound (D3):** `docs/FOUNDER_AUDIT_D3_OUTBOUND_TEMPLATE_LOCKED_v1.md` · track sends with `npm run channel:send -- --count 1 --mark-sent`

## 10-step upgrade (infra first)

| Step | Command / doc |
|------|----------------|
| 1–3 Cron | `.github/workflows/gateway-watchdog-cron.yml`, `gateway-heartbeat-cron.yml` |
| 2–4 Secrets | `docs/OPS_SECRETS_SETUP.md` |
| 5 Turnstile | `npm run test:turnstile` + Railway keys |
| 6 CI / deploy | `.github/workflows/gateway-ci.yml`, `DEPLOY.md` |
| 7 Metadata | Run `supabase/migrations/20260706_capture_metadata.sql` |
| 8 D2 list | Fill `data/founder-audit-d2-list.json`, `npm run validate:d2-list` |
| 9 D3 sends | `npm run channel:send -- --count N --mark-sent` |
| 10 Launch | `docs/PUBLIC_LAUNCH_GATE_LOCKED_v1.md` |

## Connect Supabase

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the SQL editor.
3. Copy `.env.example` to `.env` or set these variables in your host:

```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-public-key
```

Use the anon key only. Never paste the service-role key into this project.

See `SETUP.md` for the full secure setup and anon read-denial test.

## v1 Routing

- `friend` -> Personal
- `buildmatch` -> BuildMatch (requires industry: `construction` or `home_services` via `project_type`)
- legacy `construction` identity -> normalized to `buildmatch` + `project_type=construction`
- `builder` -> Forge
- `investor` -> Noetfield
- `utm_campaign=founder-audit` or founder signals in notes -> FounderAudit
- notes mentioning trust/risk/compliance -> TrustField
- hire/project/deal/lead signals -> SourceA
- strategic or capital signals -> Noetfield

## Locked strategy docs

- [`docs/SINA_GATEWAY_SSOT_LOCKED_v1.md`](docs/SINA_GATEWAY_SSOT_LOCKED_v1.md) — **start here** (live truth)
- [`docs/SINA_GATEWAY_CONSTITUTION_LOCKED_v1.md`](docs/SINA_GATEWAY_CONSTITUTION_LOCKED_v1.md) — foundational laws
- [`docs/SINA_GATEWAY_BLUEPRINT_LOCKED_v1.md`](docs/SINA_GATEWAY_BLUEPRINT_LOCKED_v1.md) — megagateway architecture
- [`docs/ROUTING_MESH_LAWS_LOCKED_v1.md`](docs/ROUTING_MESH_LAWS_LOCKED_v1.md) — venture mesh handoff
- [`docs/SINA_GATEWAY_TERMINOLOGY_LOCKED_v1.md`](docs/SINA_GATEWAY_TERMINOLOGY_LOCKED_v1.md) — operator vocabulary
- [`docs/SINA_GATEWAY_CLIENT_VOCABULARY_LOCKED_v1.md`](docs/SINA_GATEWAY_CLIENT_VOCABULARY_LOCKED_v1.md) — public copy rules
- [`docs/GATEWAY_UI_UPGRADE_98_LOCKED_v1.md`](docs/GATEWAY_UI_UPGRADE_98_LOCKED_v1.md) — 98-item UI upgrade plan (v2 executed — Batches A–E shipped)
- [`docs/GATEWAY_UI_UPGRADE_RESEARCH_2026_v1.md`](docs/GATEWAY_UI_UPGRADE_RESEARCH_2026_v1.md) — July 2026 UI research reference
- `docs/UNLOCK_DOCTRINE_LOCKED_v2.md`
- `docs/FOUNDER_GATEWAY_BLUEPRINT_LOCKED_v1.md`
- `docs/FOUNDER_AUDIT_OFFER_LOCKED_v1.md`
- `docs/FOUNDER_AUDIT_D2_LIST_CRITERIA_LOCKED_v1.md`
- `docs/FOUNDER_AUDIT_D3_OUTBOUND_TEMPLATE_LOCKED_v1.md`
- `docs/GATEWAY_247_OPS_PLAN_LOCKED_v1.md`

## Next Upgrades

- Configure Turnstile before public launch.
- Configure high-priority Telegram alerts with `TELEGRAM_BOT_TOKEN` + `TELEGRAM_ALERT_CHAT_ID`.
- Split contact into email, phone, social, and preferred contact.
- Add admin read view only after real rows exist.

Routing details are documented in `ROUTING.md`.
