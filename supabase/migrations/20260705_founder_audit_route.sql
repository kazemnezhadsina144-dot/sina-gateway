do $$
begin
  if exists (
    select 1 from pg_constraint where conname = 'gateway_leads_venture_route_check'
  ) then
    alter table public.gateway_leads drop constraint gateway_leads_venture_route_check;
  end if;

  alter table public.gateway_leads
    add constraint gateway_leads_venture_route_check
    check (venture_route in ('SourceA', 'Noetfield', 'TrustField', 'BuildMatch', 'Forge', 'Personal', 'FounderAudit'));

  if exists (
    select 1 from pg_constraint where conname = 'gateway_leads_secondary_route_check'
  ) then
    alter table public.gateway_leads drop constraint gateway_leads_secondary_route_check;
  end if;

  alter table public.gateway_leads
    add constraint gateway_leads_secondary_route_check
    check (secondary_route is null or secondary_route in ('SourceA', 'Noetfield', 'TrustField', 'BuildMatch', 'Forge', 'Personal', 'FounderAudit'));
end $$;
