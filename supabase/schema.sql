create extension if not exists pgcrypto;

create table if not exists public.gateway_leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  identity text not null check (identity in ('friend', 'client', 'investor', 'builder', 'construction', 'buildmatch')),
  intent text not null check (intent in ('hire', 'invest', 'partner', 'refer', 'learn', 'trust')),
  value text not null check (value in ('deal', 'project', 'lead', 'capital', 'talent', 'risk')),
  urgency text not null check (urgency in ('now', 'soon', 'exploring')),
  name text not null,
  contact text not null,
  email text,
  phone text,
  social text,
  preferred_contact text check (preferred_contact in ('contact', 'email', 'phone', 'social')),
  company text,
  role_title text,
  city text,
  country text,
  timezone text,
  budget_range text,
  capital_range text,
  project_type text,
  trade_type text,
  collaboration_type text,
  intro_source text,
  relationship_context text,
  consent_to_contact boolean not null default true,
  marketing_opt_in boolean not null default false,
  venture_route text not null check (venture_route in ('SourceA', 'Noetfield', 'TrustField', 'BuildMatch', 'Forge', 'Personal', 'FounderAudit')),
  secondary_route text check (secondary_route is null or secondary_route in ('SourceA', 'Noetfield', 'TrustField', 'BuildMatch', 'Forge', 'Personal', 'FounderAudit')),
  route_rule_id text,
  route_confidence text check (route_confidence is null or route_confidence in ('high', 'medium', 'low')),
  lead_type text not null check (lead_type in ('friend', 'client', 'investor', 'collaborator', 'construction', 'buildmatch')),
  priority_tag text not null check (priority_tag in ('high', 'medium', 'low')),
  route_reason text,
  priority_reason text,
  tags text[] not null default '{}',
  status text not null default 'new' check (status in ('new', 'reviewed', 'contacted', 'closed', 'archived')),
  owner text,
  next_action_at timestamptz,
  last_contacted_at timestamptz,
  archived_at timestamptz,
  duplicate_of uuid references public.gateway_leads(id),
  source text default 'online',
  raw_notes text,
  page_path text,
  referrer text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  session_id text,
  visitor_id text,
  submission_id text,
  is_test boolean not null default false,
  app_version text,
  environment text,
  capture_version text default 'v1',
  schema_version text default '20260706'
);

alter table public.gateway_leads enable row level security;

drop policy if exists "public insert only gateway leads" on public.gateway_leads;
create policy "public insert only gateway leads"
on public.gateway_leads
for insert
to anon
with check (true);

drop policy if exists "authenticated read gateway leads" on public.gateway_leads;

create index if not exists gateway_leads_created_at_idx on public.gateway_leads (created_at desc);
create index if not exists gateway_leads_priority_idx on public.gateway_leads (priority_tag, urgency);
create index if not exists gateway_leads_route_idx on public.gateway_leads (venture_route);
create index if not exists gateway_leads_route_rule_idx on public.gateway_leads (route_rule_id);
create index if not exists gateway_leads_route_confidence_idx on public.gateway_leads (route_confidence);
create index if not exists gateway_leads_status_idx on public.gateway_leads (status);
create index if not exists gateway_leads_contact_idx on public.gateway_leads (contact);
create index if not exists gateway_leads_company_idx on public.gateway_leads (company);
create index if not exists gateway_leads_tags_idx on public.gateway_leads using gin (tags);
create index if not exists gateway_leads_is_test_idx on public.gateway_leads (is_test) where is_test = true;

-- Table privileges (required in addition to RLS — Supabase SQL editor does not always grant anon)
grant usage on schema public to anon;
grant insert on public.gateway_leads to anon;
