-- Phase 4: aggregate probes for ops weekly + public status (no PII).

create or replace function public.gateway_lane_counts()
returns jsonb
language sql
security definer
set search_path = public
stable
as $$
  select coalesce(
    jsonb_object_agg(venture_route, cnt),
    '{}'::jsonb
  )
  from (
    select venture_route, count(*)::int as cnt
    from public.gateway_leads
    where is_test = false
    group by venture_route
  ) s;
$$;

create or replace function public.gateway_last_signal()
returns jsonb
language sql
security definer
set search_path = public
stable
as $$
  select jsonb_build_object(
    'at', created_at,
    'route', venture_route
  )
  from public.gateway_leads
  where is_test = false
  order by created_at desc
  limit 1;
$$;

revoke all on function public.gateway_lane_counts() from public;
revoke all on function public.gateway_last_signal() from public;
grant execute on function public.gateway_lane_counts() to anon, authenticated, service_role;
grant execute on function public.gateway_last_signal() to anon, authenticated, service_role;
