# Sina Gateway Launch Checklist

## Required Before Public Traffic

1. Run `supabase/schema.sql` in the Supabase SQL editor.
2. Run `npm run verify:supabase`.
3. Confirm output includes `INSERT OK`.
4. Confirm output includes `READ DENIED BY RLS`.
5. Set `NODE_ENV=production`.
6. Set `ALLOWED_ORIGINS` to the production origin.
7. Set `TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY`.
8. Set `TELEGRAM_BOT_TOKEN` and `TELEGRAM_ALERT_CHAT_ID` for high-priority lead alerts (`@Gateway_A`).
9. Run `npm run validate:env`.
10. Run `npm test`.
11. Run `npm run check`.
12. Start the app and run `npm run smoke`.
13. Submit one fake lead.
14. Confirm the fake lead appears in Supabase.
15. Confirm anon read still returns no rows.
16. Remove or archive fake leads.
17. Review `robots.txt` and `noindex` before public indexing.
18. Confirm no `SUPABASE_SERVICE_ROLE_KEY` exists in `.env`.
19. Confirm the browser bundle contains no Supabase key.
20. Confirm the capture endpoint returns useful errors.

## Rollback

1. Remove the public route/domain.
2. Clear `SUPABASE_ANON_KEY` from the runtime.
3. Keep the Supabase table intact for investigation.
4. Review server logs by `requestId`.
5. Fix the issue in staging/local mode.
6. Re-run the full checklist before restoring traffic.
