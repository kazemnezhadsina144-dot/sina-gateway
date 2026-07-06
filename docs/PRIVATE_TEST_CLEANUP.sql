-- Founder-only cleanup in Supabase SQL Editor (postgres role).
-- Test leads use source = 'private-test' or name like '[PRIVATE-TEST]%'.

select id, created_at, name, contact, source, venture_route
from public.gateway_leads
where source = 'private-test'
   or name like '[PRIVATE-TEST]%'
   or contact like 'private-test+%@example.com'
   or contact like 'verify-%@example.com'
   or contact like 'chain-%@example.com'
order by created_at desc;

-- Uncomment to delete after reviewing the select results:
-- delete from public.gateway_leads
-- where source = 'private-test'
--    or name like '[PRIVATE-TEST]%'
--    or contact like 'private-test+%@example.com'
--    or contact like 'verify-%@example.com'
--    or contact like 'chain-%@example.com';
