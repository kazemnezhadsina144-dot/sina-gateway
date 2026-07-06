# Sina Gateway Notifications

High-priority leads alert via **Telegram ops bot** (same pattern as SourceA nerve-probe / Noetfield intake).

Sent when:

- `priority_tag` is `high`
- `TELEGRAM_BOT_TOKEN` + `TELEGRAM_ALERT_CHAT_ID` are set on Railway

Message shape (HTML):

```
High-priority Sina Gateway lead
Name → VentureRoute
contact@example.com
priority: high
req: <requestId>
```

If Telegram delivery fails, lead capture still succeeds. Server logs `notification_failed`.

Dry-run:

```bash
npm run test:notifications
```

Live production test:

```bash
TELEGRAM_BOT_TOKEN=... TELEGRAM_ALERT_CHAT_ID=... npm run test:notify-capture
```

See `docs/OPS_SECRETS_SETUP.md`.
