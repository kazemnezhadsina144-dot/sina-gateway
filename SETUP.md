# Sina Gateway Setup

This project uses the secure v1 model:

**Project URL + anon key only. Never use the service_role key in this gateway.**

## Supabase Project Settings

Use these settings when creating the fresh Supabase project:

- Region: Canada (Central)
- Enable Data API: on
- Automatically expose new tables: off
- Enable automatic RLS: on
- Save the database password in a password manager

## Fill `.env`

Open `.env` and paste exactly two Supabase values:

```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-public-key
```

Do not paste the `service_role` key. If a key is labeled secret, admin, service, or service_role, it does not belong in this project.

## Create The Table

In Supabase, open the SQL editor and run the full contents of `supabase/schema.sql`.

That file is the canonical schema. It includes the upgraded lead fields, RLS, anon insert-only policy, and indexes. Do not use older copied SQL snippets.

If you already created the original table before this upgrade, run:

```sql
-- paste supabase/migrations/20260629_data_model_upgrade.sql
-- paste supabase/migrations/20260629_routing_intelligence.sql
```

For a fresh project, run only `supabase/schema.sql`; it already includes the upgraded fields.

## Test Capture

After filling `.env`, restart the app:

```bash
npm start
```

Submit one fake lead in the gateway. It should appear in the Supabase table view.

You can also run the automated verifier:

```bash
npm run verify:supabase
```

Expected output:

```text
INSERT OK
READ DENIED BY RLS (0 rows visible to anon)
```

If the verifier prints `SUPABASE_PROJECT_PAUSED_OR_UNREACHABLE`, the Supabase free-tier project is paused or the hostname is wrong.

1. Open [Supabase Dashboard](https://supabase.com/dashboard) and select the project.
2. Click **Restore project** (or **Unpause**).
3. Wait 1-2 minutes for DNS to come back.
4. In SQL Editor, run the full `supabase/schema.sql` if this is a fresh restore.
5. Rerun `npm run verify:supabase`.

Your `.env` project ref must match the restored project. Paused projects often fail DNS lookup with `ENOTFOUND`.

## Prove Anon Cannot Read

Run this in the browser console on the gateway page, replacing the two values:

```js
fetch("https://your-project.supabase.co/rest/v1/gateway_leads?select=*", {
  headers: {
    apikey: "your-anon-public-key",
    authorization: "Bearer your-anon-public-key",
  },
}).then(async (res) => console.log(res.status, await res.text()));
```

Expected result: it must not return lead rows. A blocked response or empty RLS-denied result is the goal. If rows are visible, stop and fix RLS before going live.

## Launch Hardening

Run these before public traffic:

```bash
npm run validate:env
npm test
npm run check
npm run smoke
```

Optional production settings:

```bash
NODE_ENV=production
ALLOWED_ORIGINS=https://your-domain.com
TURNSTILE_SITE_KEY=your-turnstile-site-key
TURNSTILE_SECRET_KEY=your-turnstile-secret-key
NOTIFY_WEBHOOK_URL=https://your-webhook-url
```

See `LAUNCH_CHECKLIST.md` and `NOTIFICATIONS.md`.
