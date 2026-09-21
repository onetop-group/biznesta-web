-- ============================================================================
-- BIZNESTA ADMIN CENTER V1 — STEP 1-B
-- 관리자 인증(Supabase Auth) + 문의함 최소 권한
-- 2026-09-21
--
-- 이 파일이 하는 일
--   1. public.admin_users     관리자 명단. auth.users 의 사용자 중 여기 등록된
--                             사람만 관리자다. (로그인 성공 ≠ 관리자)
--   2. public.is_admin()      "지금 요청한 사용자가 관리자인가" — RLS 정책이 쓴다.
--   3. inquiries 에 두 컬럼   admin_note(관리자 메모, nullable) ·
--                             updated_at(최근 수정, 트리거로 자동 갱신)
--   4. inquiries RLS/GRANT    authenticated 관리자에게 SELECT 와
--                             UPDATE(status · admin_note 두 컬럼만) 를 연다.
--                             DELETE 는 열지 않는다.
--
-- 건드리지 않는 것
--   · anon 의 INSERT 정책 · GRANT — 그대로. 공개 상담폼은 영향 없다.
--   · 기존 행 — 새 컬럼은 nullable/기본값이라 기존 데이터와 호환된다.
--   · service_role — 쓰지 않는다. 관리자 접근은 전부 authenticated + RLS.
--
-- 적용: Supabase 대시보드 > SQL Editor 에 전체를 붙여넣고 Run.
--       여러 번 실행해도 안전하다.
-- ============================================================================


-- ── 1. 관리자 명단 ─────────────────────────────────────────────────────────
create table if not exists public.admin_users (
  user_id     uuid primary key references auth.users (id) on delete cascade,
  role        text        not null default 'ADMIN',
  created_at  timestamptz not null default now(),
  -- V1 은 ADMIN 단일 역할. 역할을 늘릴 때 이 check 를 넓힌다.
  constraint admin_users_role_chk check (role in ('ADMIN'))
);

comment on table public.admin_users is
  'BIZNESTA 관리자 명단. auth.users 중 여기 등록된 사용자만 /admin 에 들어갈 수 있다. 등록은 대시보드/SQL 로만 한다.';

alter table public.admin_users enable row level security;

-- 로그인한 사용자는 "자기 행"만 읽을 수 있다 (내가 관리자인지 확인하는 용도).
-- 다른 사람의 행, INSERT / UPDATE / DELETE 는 API 로 할 수 없다.
drop policy if exists "user can read own admin row" on public.admin_users;
create policy "user can read own admin row"
  on public.admin_users
  for select
  to authenticated
  using (user_id = auth.uid());

revoke all on public.admin_users from anon, authenticated;
grant select on public.admin_users to authenticated;


-- ── 2. 관리자 판별 함수 ────────────────────────────────────────────────────
-- security definer: RLS 정책 안에서 admin_users 를 읽을 때 정책이 재귀로
-- 걸리지 않게 한다. search_path 를 고정해 함수 가로채기를 막는다.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users where user_id = auth.uid()
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;


-- ── 3. inquiries 컬럼 추가 (기존 행 호환) ─────────────────────────────────
alter table public.inquiries
  add column if not exists admin_note text,
  add column if not exists updated_at timestamptz not null default now();

alter table public.inquiries
  drop constraint if exists inquiries_admin_note_len;
alter table public.inquiries
  add constraint inquiries_admin_note_len
  check (admin_note is null or char_length(admin_note) <= 4000);

comment on column public.inquiries.admin_note is '관리자 메모. 고객에게 보이지 않는다.';
comment on column public.inquiries.updated_at is '마지막 수정 시각. 트리거가 자동으로 채운다.';

-- 관리자가 아직 손대지 않은 행(상태 NEW · 메모 없음)은 "최근 수정" 을 접수 시각으로
-- 맞춘다. 여러 번 실행해도 손댄 행은 건드리지 않는다.
update public.inquiries
   set updated_at = created_at
 where status = 'NEW' and admin_note is null and updated_at <> created_at;

-- 값을 명시해서 바꾼 경우(위 backfill 같은 관리 SQL)만 그대로 두고, 그 외의 모든
-- UPDATE 는 now() 로 채운다. 관리자 API 는 updated_at 컬럼에 UPDATE 권한이 없어
-- 명시할 수 없으므로 항상 now() 가 된다.
create or replace function public.inquiries_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  if new.updated_at is not distinct from old.updated_at then
    new.updated_at := now();
  end if;
  return new;
end;
$$;

drop trigger if exists inquiries_set_updated_at on public.inquiries;
create trigger inquiries_set_updated_at
  before update on public.inquiries
  for each row
  execute function public.inquiries_set_updated_at();


-- ── 4. 관리자 권한 — SELECT 전체, UPDATE 는 두 컬럼만, DELETE 없음 ─────────
drop policy if exists "admin can read inquiries" on public.inquiries;
create policy "admin can read inquiries"
  on public.inquiries
  for select
  to authenticated
  using (public.is_admin());

drop policy if exists "admin can update inquiries" on public.inquiries;
create policy "admin can update inquiries"
  on public.inquiries
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- 컬럼 단위 GRANT: 관리자 API 로는 status · admin_note 만 바꿀 수 있다.
-- 이름 · 연락처 · 문의 내용 같은 고객 입력값은 관리자도 수정할 수 없다.
grant select on public.inquiries to authenticated;
grant update (status, admin_note) on public.inquiries to authenticated;
-- delete 는 grant 하지 않는다. (정책도 없다 → 거부)


-- ── 5. 관리자 등록 (사람이 직접) ──────────────────────────────────────────
-- 1) 대시보드 > Authentication > Users > "Add user" 로 이메일·비밀번호 계정을 만든다.
--    (Auto Confirm User 를 켠다 — 확인 메일 없이 바로 로그인 가능)
-- 2) 아래 한 줄의 이메일을 그 계정으로 바꿔 실행한다.
--
-- insert into public.admin_users (user_id)
-- select id from auth.users where email = 'admin@example.com'
-- on conflict (user_id) do nothing;


-- ── 6. 적용 결과 확인 ──────────────────────────────────────────────────────
-- (A) inquiries 권한 — 기대: anon INSERT / authenticated SELECT, UPDATE(status, admin_note)
select 'A. inquiries grants' as check, grantee, privilege_type, column_name
from information_schema.column_privileges
where table_schema = 'public' and table_name = 'inquiries'
  and grantee = 'authenticated' and privilege_type = 'UPDATE'
union all
select 'A. inquiries grants', grantee, privilege_type, null
from information_schema.role_table_grants
where table_schema = 'public' and table_name = 'inquiries'
  and grantee in ('anon', 'authenticated')
order by 1, 2, 3, 4;

-- (B) 정책 — 기대: anon insert 1개, authenticated select 1개, update 1개
select 'B. policies' as check, policyname, cmd, roles::text
from pg_policies
where schemaname = 'public' and tablename = 'inquiries'
order by cmd;

-- (C) 새 컬럼 · 트리거
select 'C. columns' as check, column_name, data_type, is_nullable
from information_schema.columns
where table_schema = 'public' and table_name = 'inquiries'
  and column_name in ('admin_note', 'updated_at');

-- (D) 관리자 명단 — 등록 후 1행 이상이어야 로그인이 통과한다
select 'D. admins' as check, count(*) as admin_count from public.admin_users;
