-- UTM click tracking (landing CTR, no PII).

create table if not exists public.gateway_utm_clicks (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  page_path text,
  session_id text,
  visitor_id text,
  is_test boolean not null default false
);

alter table public.gateway_utm_clicks enable row level security;

drop policy if exists "anon insert gateway utm clicks" on public.gateway_utm_clicks;
create policy "anon insert gateway utm clicks"
on public.gateway_utm_clicks
for insert
to anon
with check (true);

grant insert on public.gateway_utm_clicks to anon;

create index if not exists gateway_utm_clicks_created_at_idx on public.gateway_utm_clicks (created_at desc);
create index if not exists gateway_utm_clicks_campaign_idx on public.gateway_utm_clicks (utm_campaign, utm_source);

create or replace function public.gateway_utm_click_counts()
returns jsonb
language sql
security definer
set search_path = public
stable
as $$
  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'utm_source', coalesce(utm_source, '—'),
        'utm_campaign', coalesce(utm_campaign, '—'),
        'clicks', cnt
      )
      order by cnt desc
    ),
    '[]'::jsonb
  )
  from (
    select utm_source, utm_campaign, count(*)::int as cnt
    from public.gateway_utm_clicks
    where is_test = false
    group by utm_source, utm_campaign
  ) s;
$$;

revoke all on function public.gateway_utm_click_counts() from public;
grant execute on function public.gateway_utm_click_counts() to anon, authenticated, service_role;

notify pgrst, 'reload schema';
