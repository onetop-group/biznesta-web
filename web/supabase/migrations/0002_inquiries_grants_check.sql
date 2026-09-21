-- ============================================================================
-- BIZNESTA — inquiries 권한 재적용 + 상태 확인
-- 2026-09-07
--
-- 왜 필요한가
--   Preview 에서 실제 제출 시 PostgREST 가
--       42501  permission denied for table inquiries
--   를 돌려주었다. 이것은 RLS 정책 위반 메시지("new row violates row-level
--   security policy")가 아니라 **테이블 권한(GRANT)** 부족 메시지다.
--   0001 의 마지막 두 줄
--       revoke all on public.inquiries from anon, authenticated;
--       grant  insert on public.inquiries to anon;
--   중 revoke 만 반영되고 grant 가 반영되지 않으면 정확히 이 상태가 된다.
--
--   함께 정리하는 것: 0001 에 있던 force row level security 를 뺀다.
--   FORCE 는 테이블 소유자(postgres)에게도 정책을 적용해서, SELECT 정책이 없는
--   지금 상태에서는 대시보드 Table Editor / SQL Editor 로 접수 내용을 확인하는
--   것까지 막는다. anon 의 접근은 정책과 GRANT 로만 결정되므로 보안 경계는
--   그대로다.
--
-- 여러 번 실행해도 안전하다.
-- 실행: Supabase 대시보드 > SQL Editor 에 전체를 붙여넣고 Run
-- ============================================================================

-- ── 1. 최소 권한 재적용 ──────────────────────────────────────────────────────
grant usage on schema public to anon;

revoke all on table public.inquiries from anon, authenticated;
grant insert on table public.inquiries to anon;

alter table public.inquiries enable row level security;
alter table public.inquiries no force row level security;

drop policy if exists "anon can insert inquiries" on public.inquiries;
create policy "anon can insert inquiries"
  on public.inquiries
  for insert
  to anon
  with check (privacy_consent = true);


-- ── 2. 적용 결과 확인 ────────────────────────────────────────────────────────
-- 아래 네 개 결과를 그대로 알려주시면 됩니다.

-- (A) 역할별 테이블 권한
--     기대: anon 에 INSERT 한 줄만. authenticated 는 한 줄도 없어야 한다.
select 'A. grants' as check, grantee, privilege_type
from information_schema.role_table_grants
where table_schema = 'public'
  and table_name  = 'inquiries'
  and grantee in ('anon', 'authenticated')
order by grantee, privilege_type;

-- (B) RLS 상태 — rls_enabled = true, rls_forced = false 가 기대값
select 'B. rls' as check, relrowsecurity as rls_enabled, relforcerowsecurity as rls_forced
from pg_class
where oid = 'public.inquiries'::regclass;

-- (C) 정책 목록 — anon INSERT 정책 하나만
select 'C. policies' as check, policyname, cmd, roles::text, with_check
from pg_policies
where schemaname = 'public' and tablename = 'inquiries';

-- (D) 스키마 사용 권한 — true 여야 한다
select 'D. schema usage' as check, has_schema_privilege('anon', 'public', 'usage') as anon_schema_usage;
