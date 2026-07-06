-- Run in Supabase SQL Editor if verify:supabase reports permission denied (42501).
grant usage on schema public to anon;
grant insert on public.gateway_leads to anon;
