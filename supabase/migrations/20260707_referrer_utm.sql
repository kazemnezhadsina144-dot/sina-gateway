-- Phase 2: intro referrer chain + full UTM capture
alter table public.gateway_leads
  add column if not exists referred_by text,
  add column if not exists utm_content text,
  add column if not exists utm_term text;

create index if not exists gateway_leads_referred_by_idx
  on public.gateway_leads (referred_by)
  where referred_by is not null;
