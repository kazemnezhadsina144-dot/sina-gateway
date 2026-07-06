-- Founder-only cleanup in Supabase SQL Editor (postgres role).

select id, created_at, name, contact, source, is_test, venture_route
from public.gateway_leads
where is_test = true
   or source in ('private-test', 'test')
   or name like '[PRIVATE-TEST]%'
   or contact like 'private-test+%@example.com'
   or contact like 'verify-%@example.com'
   or contact like 'chain-%@example.com'
   or contact like 'notify-test+%@example.com'
order by created_at desc;

-- Uncomment to delete after reviewing the select results:
-- delete from public.gateway_leads
-- where is_test = true
--    or source in ('private-test', 'test')
--    or name like '[PRIVATE-TEST]%'
--    or contact like 'private-test+%@example.com'
--    or contact like 'verify-%@example.com'
--    or contact like 'chain-%@example.com'
--    or contact like 'notify-test+%@example.com';
