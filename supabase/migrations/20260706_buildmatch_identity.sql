-- BuildMatch platform identity (Construction + Home services as separate industries via project_type)

alter table public.gateway_leads drop constraint if exists gateway_leads_identity_check;
alter table public.gateway_leads
  add constraint gateway_leads_identity_check
  check (identity in ('friend', 'client', 'investor', 'builder', 'construction', 'buildmatch'));

alter table public.gateway_leads drop constraint if exists gateway_leads_lead_type_check;
alter table public.gateway_leads
  add constraint gateway_leads_lead_type_check
  check (lead_type in ('friend', 'client', 'investor', 'collaborator', 'construction', 'buildmatch'));
