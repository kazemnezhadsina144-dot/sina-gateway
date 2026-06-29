alter table public.gateway_leads
  add column if not exists secondary_route text,
  add column if not exists route_rule_id text,
  add column if not exists route_confidence text;

do $$
begin
  if exists (
    select 1 from pg_constraint where conname = 'gateway_leads_intent_check'
  ) then
    alter table public.gateway_leads drop constraint gateway_leads_intent_check;
  end if;

  alter table public.gateway_leads
    add constraint gateway_leads_intent_check
    check (intent in ('hire', 'invest', 'partner', 'refer', 'learn', 'trust'));

  if exists (
    select 1 from pg_constraint where conname = 'gateway_leads_value_check'
  ) then
    alter table public.gateway_leads drop constraint gateway_leads_value_check;
  end if;

  alter table public.gateway_leads
    add constraint gateway_leads_value_check
    check (value in ('deal', 'project', 'lead', 'capital', 'talent', 'risk'));

  if not exists (
    select 1 from pg_constraint where conname = 'gateway_leads_secondary_route_check'
  ) then
    alter table public.gateway_leads
      add constraint gateway_leads_secondary_route_check
      check (secondary_route is null or secondary_route in ('SourceA', 'Noetfield', 'TrustField', 'BuildMatch', 'Forge', 'Personal'));
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'gateway_leads_route_confidence_check'
  ) then
    alter table public.gateway_leads
      add constraint gateway_leads_route_confidence_check
      check (route_confidence is null or route_confidence in ('high', 'medium', 'low'));
  end if;
end $$;

create index if not exists gateway_leads_route_rule_idx on public.gateway_leads (route_rule_id);
create index if not exists gateway_leads_route_confidence_idx on public.gateway_leads (route_confidence);
