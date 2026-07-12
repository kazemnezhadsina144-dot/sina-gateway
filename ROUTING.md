# Sina Gateway Routing

Routing is deterministic. It is not learned scoring.

The source of truth is `ROUTING_RULES` in `src/gateway.js`.

Each route decision stores:

- `venture_route`
- `secondary_route`
- `route_rule_id`
- `route_confidence`
- `route_reason`

## Current Rule Order

1. UTM `founder-audit` -> FounderAudit
2. Page path contains `founder-audit` -> FounderAudit
3. Notes mention founder audit / solo founder / AI cofounder -> FounderAudit
4. Friend -> Personal
5. Construction -> BuildMatch
6. Builder -> Forge
7. Investor -> Noetfield
8. Trust intent -> TrustField
9. Risk value -> TrustField
10. Notes mentioning trust/risk/compliance/audit/governance -> TrustField
11. Invest intent -> Noetfield
12. Partner + capital -> Noetfield
13. Partner + talent -> Forge
14. Hire intent -> SourceA
15. Deal/project/lead value -> SourceA
16. Default -> Noetfield

## Audit

Run:

```bash
npm run audit:routes
```

This checks every identity + intent + value + urgency combination for:

- valid route
- valid confidence
- valid lead schema

## Supabase Migration

For existing tables, run:

```sql
-- paste supabase/migrations/20260629_routing_intelligence.sql
-- paste supabase/migrations/20260705_founder_audit_route.sql
```

For a fresh project, run only `supabase/schema.sql`.

## Change log

| Date | Change |
|------|--------|
| 2026-07-12 | Public `/how-routing-works` page surfaces rule order (#322) |
| 2026-07-12 | `gateway_utm_clicks` table + `gateway_utm_click_counts` RPC (#77, #287) |
