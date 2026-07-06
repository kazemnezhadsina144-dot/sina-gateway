# Public Launch Gate (Locked)

**Status:** Locked · **Do not execute until Steps 1–5 of the 10-step plan are complete.**

## Preconditions

- [ ] GitHub watchdog cron green for 7 days (or manual `/run` checks)
- [ ] `NOTIFY_WEBHOOK_URL` tested with `npm run test:notify-capture`
- [ ] Turnstile enabled on production
- [ ] `npm run chain:health` PASS on production
- [ ] Founder decision: launch with or without first L2 payment

## Launch checklist

Run every item in [LAUNCH_CHECKLIST.md](../LAUNCH_CHECKLIST.md).

Additional gates:

1. [ ] Custom domain on Railway (optional) + `ALLOWED_ORIGINS` updated
2. [ ] Remove `noindex,nofollow` from [public/index.html](../public/index.html) **only when intentional**
3. [ ] Update [public/robots.txt](../public/robots.txt) to allow indexing **only when intentional**
4. [ ] Privacy policy URL ready (founder-gated)
5. [ ] Data deletion process documented (founder-gated)
6. [ ] Delete all `is_test = true` rows from Supabase ([PRIVATE_TEST_CLEANUP.sql](./PRIVATE_TEST_CLEANUP.sql))
7. [ ] Record launch date in [GATEWAY_PRIVATE_TEST_READINESS_RECEIPT_v1.md](./GATEWAY_PRIVATE_TEST_READINESS_RECEIPT_v1.md)

## Explicitly deferred at launch

- Admin read view
- Learned routing / scoring
- T1 AI cofounder productization ([FOUNDER_GATEWAY_BLUEPRINT_LOCKED_v1.md](./FOUNDER_GATEWAY_BLUEPRINT_LOCKED_v1.md))

## Rollback

See LAUNCH_CHECKLIST.md rollback section. Remove public DNS first; keep Supabase table for investigation.
