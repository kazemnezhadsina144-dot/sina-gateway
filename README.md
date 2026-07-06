# Sina Gateway

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
```

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
- `construction` -> BuildMatch
- `builder` -> Forge
- `investor` -> Noetfield
- `utm_campaign=founder-audit` or founder signals in notes -> FounderAudit
- notes mentioning trust/risk/compliance -> TrustField
- hire/project/deal/lead signals -> SourceA
- strategic or capital signals -> Noetfield

## Locked strategy docs

- `docs/UNLOCK_DOCTRINE_LOCKED_v2.md`
- `docs/FOUNDER_GATEWAY_BLUEPRINT_LOCKED_v1.md`
- `docs/FOUNDER_AUDIT_OFFER_LOCKED_v1.md`
- `docs/FOUNDER_AUDIT_D2_LIST_CRITERIA_LOCKED_v1.md`

## Next Upgrades

- Configure Turnstile before public launch.
- Configure high-priority notifications with `NOTIFY_WEBHOOK_URL`.
- Split contact into email, phone, social, and preferred contact.
- Add admin read view only after real rows exist.

Routing details are documented in `ROUTING.md`.
