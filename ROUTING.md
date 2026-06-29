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

1. Friend -> Personal
2. Construction -> BuildMatch
3. Builder -> Forge
4. Investor -> Noetfield
5. Trust intent -> TrustField
6. Risk value -> TrustField
7. Notes mentioning trust/risk/compliance/audit/governance -> TrustField
8. Invest intent -> Noetfield
9. Partner + capital -> Noetfield
10. Partner + talent -> Forge
11. Hire intent -> SourceA
12. Deal/project/lead value -> SourceA
13. Default -> Noetfield

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
```

For a fresh project, run only `supabase/schema.sql`.
