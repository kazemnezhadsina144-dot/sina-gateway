alter table public.gateway_leads
  add column if not exists is_test boolean not null default false,
  add column if not exists app_version text,
  add column if not exists environment text,
  add column if not exists capture_version text default 'v1',
  add column if not exists schema_version text default '20260706';

create index if not exists gateway_leads_is_test_idx on public.gateway_leads (is_test) where is_test = true;
