# Sina Gateway Notifications

High-priority notifications are sent when:

- `priority_tag` is `high`
- `NOTIFY_WEBHOOK_URL` is configured

The app sends a JSON payload by `POST`:

```json
{
  "text": "High-priority Sina Gateway lead: Name -> SourceA",
  "requestId": "safe-error-or-log-id",
  "lead": {
    "id": "uuid",
    "name": "Lead name",
    "contact": "lead@example.com",
    "identity": "client",
    "intent": "hire",
    "value": "project",
    "urgency": "now",
    "venture_route": "SourceA",
    "priority_tag": "high",
    "raw_notes": "Context"
  }
}
```

Use any webhook receiver that accepts JSON, such as Slack automation, Discord webhook, Make, Zapier, Pipedream, or a private Worker.

If notification delivery fails, the lead capture still succeeds. The server logs `notification_failed` with the same `requestId`.

Dry-run safety test:

```bash
npm run test:notifications
```

This validates the payload shape and confirms medium/low-priority leads do not trigger sends.
