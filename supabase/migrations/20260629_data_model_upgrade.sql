alter table public.gateway_leads
  add column if not exists email text,
  add column if not exists phone text,
  add column if not exists social text,
  add column if not exists preferred_contact text,
  add column if not exists company text,
  add column if not exists role_title text,
  add column if not exists city text,
  add column if not exists country text,
  add column if not exists timezone text,
  add column if not exists budget_range text,
  add column if not exists capital_range text,
  add column if not exists project_type text,
  add column if not exists trade_type text,
  add column if not exists collaboration_type text,
  add column if not exists intro_source text,
  add column if not exists relationship_context text,
  add column if not exists consent_to_contact boolean not null default true,
  add column if not exists marketing_opt_in boolean not null default false,
  add column if not exists route_reason text,
  add column if not exists priority_reason text,
  add column if not exists tags text[] not null default '{}',
  add column if not exists status text not null default 'new',
  add column if not exists owner text,
  add column if not exists next_action_at timestamptz,
  add column if not exists last_contacted_at timestamptz,
  add column if not exists archived_at timestamptz,
  add column if not exists duplicate_of uuid references public.gateway_leads(id),
  add column if not exists session_id text,
  add column if not exists visitor_id text,
  add column if not exists submission_id text;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'gateway_leads_preferred_contact_check'
  ) then
    alter table public.gateway_leads
      add constraint gateway_leads_preferred_contact_check
      check (preferred_contact is null or preferred_contact in ('contact', 'email', 'phone', 'social'));
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'gateway_leads_status_check'
  ) then
    alter table public.gateway_leads
      add constraint gateway_leads_status_check
      check (status in ('new', 'reviewed', 'contacted', 'closed', 'archived'));
  end if;
end $$;

create index if not exists gateway_leads_status_idx on public.gateway_leads (status);
create index if not exists gateway_leads_contact_idx on public.gateway_leads (contact);
create index if not exists gateway_leads_company_idx on public.gateway_leads (company);
create index if not exists gateway_leads_tags_idx on public.gateway_leads using gin (tags);
