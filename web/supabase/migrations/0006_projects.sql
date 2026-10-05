-- ============================================================================
-- BIZNESTA ADMIN CENTER V1 — STEP 2-A
-- 프로젝트(제작 업무) 테이블
-- 2026-09-22
--
-- 이 파일이 하는 일
--   1. public.projects          상담 이후 실제 진행되는 제작 업무
--   2. project_no 채번          BN-2026-001 · DB 시퀀스 + 트리거 (코드에서 계산하지 않는다)
--   3. RLS / GRANT              admin_users 등록 관리자만 읽기 · 생성 · 수정. DELETE 없음
--   4. updated_at 트리거        0005 와 같은 방식
--
-- 건드리지 않는 것
--   · inquiries 테이블 — 컬럼 · 정책 · GRANT 전부 그대로. 연결은 projects 쪽
--     FK(source_inquiry_id) 한 방향뿐이다. 공개 상담폼은 영향이 없다.
--   · admin_users · is_admin() — 0005 의 것을 그대로 쓴다. 다시 만들지 않는다.
--   · service_role — 쓰지 않는다.
--
-- 대표 확정 사항 (2026-09-22)
--   · 고객은 별도 테이블로 빼지 않고 프로젝트 안에 스냅샷으로 둔다.
--   · 상태 7개. 보류(ON_HOLD)와 취소(CANCELLED)를 구분한다.
--   · 문의 → 프로젝트 전환 시 문의 상태를 자동으로 바꾸지 않는다.
--   · DELETE 는 만들지 않는다. 취소된 프로젝트도 기록으로 남긴다.
--
-- 적용: Supabase 대시보드 > SQL Editor 에 전체를 붙여넣고 Run.
--       여러 번 실행해도 안전하다.
-- ============================================================================


-- ── 0. 선행 조건 확인 ──────────────────────────────────────────────────────
-- 0005 가 먼저 적용되어 있어야 한다 (is_admin · admin_users).
do $$
begin
  if to_regprocedure('public.is_admin()') is null then
    raise exception '0005_admin_inquiries.sql 을 먼저 실행해 주세요 (is_admin() 없음)';
  end if;
  if to_regclass('public.inquiries') is null then
    raise exception 'public.inquiries 가 없습니다 (0001 먼저)';
  end if;
end $$;


-- ── 1. 프로젝트 번호 채번 ──────────────────────────────────────────────────
-- BN-<연도>-<3자리>. 연도가 바뀌면 001 부터 다시 시작한다.
-- 동시에 두 건을 만들어도 번호가 겹치지 않도록 시퀀스를 쓴다(코드 계산 금지).
create sequence if not exists public.project_no_seq;

-- security definer 인 이유: 시퀀스 권한을 어느 역할에도 주지 않기 때문이다.
-- 관리자는 이 함수를 통해서만 번호를 받고, 시퀀스를 직접 건드릴 수 없다.
-- search_path 를 고정해 함수 가로채기를 막는다 (0005 의 is_admin 과 같은 방식).
create or replace function public.next_project_no()
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  yr   text := to_char(now() at time zone 'Asia/Seoul', 'YYYY');
  last text;
  n    bigint;
begin
  /* 올해 만들어진 마지막 번호를 보고, 해가 바뀌었으면 시퀀스를 되돌린다. */
  select max(project_no) into last
    from public.projects
   where project_no like 'BN-' || yr || '-%';

  if last is null then
    perform setval('public.project_no_seq', 1, false);
  end if;

  n := nextval('public.project_no_seq');
  return 'BN-' || yr || '-' || lpad(n::text, 3, '0');
end;
$$;


-- ── 2. 테이블 ──────────────────────────────────────────────────────────────
create table if not exists public.projects (
  id                uuid primary key default gen_random_uuid(),
  project_no        text        not null unique,

  /* 어느 문의에서 시작했는지. 없을 수도 있다(전화 · 소개로 들어온 일).
     한 문의에서 프로젝트를 여러 건 만들 수 있으므로 unique 가 아니다.
     문의는 지우지 않지만, 만일을 대비해 지워져도 프로젝트는 남긴다. */
  source_inquiry_id uuid        references public.inquiries (id) on delete set null,

  /* 고객 정보 스냅샷 — 문의에서 옮겨 적고, 이후에는 프로젝트가 스스로 갖는다.
     문의 원본은 이 값이 바뀌어도 영향을 받지 않는다. */
  client_name       text        not null,
  client_contact    text        not null,
  client_email      text,

  title             text        not null,
  service_type      text        not null,
  plan              text,
  status            text        not null default 'CONSULTING',

  started_on        date,
  target_on         date,
  admin_note        text,

  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),

  /* 상태 7개 — 보류(다시 진행 가능)와 취소(진행 종료)를 구분한다. */
  constraint projects_status_chk check (status in
    ('CONSULTING', 'PREPARING', 'IN_PROGRESS', 'REVIEW', 'DONE', 'ON_HOLD', 'CANCELLED')),

  /* 제작 유형 — 공개 화면의 서비스 6종(src/data/pc12.ts 의 slug)과 같은 값. */
  constraint projects_service_chk check (service_type in
    ('website', 'brand-design', 'sns', 'system', 'content', 'consulting')),

  /* 플랜 — 공개 화면의 4종(src/data/pc13.ts). 아직 못 정했으면 비운다. */
  constraint projects_plan_chk check (plan is null or plan in
    ('BASIC', 'STANDARD', 'PREMIUM', 'CUSTOM')),

  constraint projects_no_fmt        check (project_no ~ '^BN-[0-9]{4}-[0-9]{3,}$'),
  constraint projects_client_name_len    check (char_length(client_name)    between 1 and 100),
  constraint projects_client_contact_len check (char_length(client_contact) between 1 and 50),
  constraint projects_client_email_len   check (client_email is null or char_length(client_email) <= 200),
  constraint projects_title_len          check (char_length(title) between 1 and 200),
  constraint projects_note_len           check (admin_note is null or char_length(admin_note) <= 8000),
  /* 목표일이 착수일보다 앞설 수 없다. */
  constraint projects_dates_chk check (started_on is null or target_on is null or target_on >= started_on)
);

comment on table  public.projects is
  'BIZNESTA 제작 프로젝트. 상담 이후 실제 진행되는 업무. 문의(inquiries)는 원본 기록이고 여기로 옮기지 않는다.';
comment on column public.projects.source_inquiry_id is '시작이 된 문의. 참조만 하며 문의 원본을 바꾸지 않는다.';
comment on column public.projects.client_name  is '고객 정보 스냅샷. 문의에서 옮겨 적은 뒤 프로젝트가 스스로 갖는다.';
comment on column public.projects.admin_note   is '내부 메모. 고객에게 보이지 않는다.';

create index if not exists projects_status_idx      on public.projects (status);
create index if not exists projects_created_at_idx  on public.projects (created_at desc);
create index if not exists projects_inquiry_idx     on public.projects (source_inquiry_id);


-- ── 3. project_no 자동 채번 · updated_at 자동 갱신 ────────────────────────
-- 트리거도 definer 로 둔다 — 안에서 next_project_no() 가 시퀀스를 쓴다.
create or replace function public.projects_before_insert()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.project_no is null or new.project_no = '' then
    new.project_no := public.next_project_no();
  end if;
  return new;
end;
$$;

drop trigger if exists projects_before_insert on public.projects;
create trigger projects_before_insert
  before insert on public.projects
  for each row
  execute function public.projects_before_insert();

/* 0005 의 inquiries 와 같은 방식. 값을 명시하지 않은 UPDATE 는 now() 로 채운다. */
create or replace function public.projects_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  if new.updated_at is not distinct from old.updated_at then
    new.updated_at := now();
  end if;
  /* 번호는 한 번 정해지면 바뀌지 않는다. */
  new.project_no := old.project_no;
  new.created_at := old.created_at;
  return new;
end;
$$;

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at
  before update on public.projects
  for each row
  execute function public.projects_set_updated_at();


-- ── 4. 권한 — 관리자만. DELETE 없음 ───────────────────────────────────────
alter table public.projects enable row level security;

drop policy if exists "admin can read projects"   on public.projects;
create policy "admin can read projects"
  on public.projects
  for select
  to authenticated
  using (public.is_admin());

drop policy if exists "admin can insert projects" on public.projects;
create policy "admin can insert projects"
  on public.projects
  for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "admin can update projects" on public.projects;
create policy "admin can update projects"
  on public.projects
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

/* DELETE 정책은 만들지 않는다 → RLS 가 거부한다. GRANT 도 주지 않는다. */

revoke all on public.projects from anon, authenticated;
grant select, insert on public.projects to authenticated;
/* 수정은 운영에 필요한 칸만. 고객 스냅샷과 제목 · 유형 · 플랜 · 일정은 고칠 수
   있어야 하지만, 번호 · 생성시각 · 시작이 된 문의는 바꿀 수 없다. */
grant update (client_name, client_contact, client_email, title, service_type,
              plan, status, started_on, target_on, admin_note)
  on public.projects to authenticated;

/* 시퀀스는 트리거(함수) 안에서만 돌아간다. 역할에 직접 권한을 주지 않는다. */
revoke all on sequence public.project_no_seq from anon, authenticated;

revoke all on function public.next_project_no()      from public;
revoke all on function public.projects_before_insert() from public;
revoke all on function public.projects_set_updated_at() from public;


-- ── 5. 적용 결과 확인 ──────────────────────────────────────────────────────
select '1. projects 테이블' as 검사,
       case when to_regclass('public.projects') is not null then 'PASS' else 'FAIL' end as 결과
union all
select '2. anon 권한 없음',
       case when not has_table_privilege('anon','public.projects','SELECT')
             and not has_table_privilege('anon','public.projects','INSERT')
             and not has_table_privilege('anon','public.projects','UPDATE')
             and not has_table_privilege('anon','public.projects','DELETE')
            then 'PASS' else 'FAIL' end
union all
select '3. authenticated DELETE 차단',
       case when has_table_privilege('authenticated','public.projects','DELETE')
            then 'FAIL' else 'PASS' end
union all
select '4. project_no · created_at 수정 불가',
       case when not has_column_privilege('authenticated','public.projects','project_no','UPDATE')
             and not has_column_privilege('authenticated','public.projects','created_at','UPDATE')
             and not has_column_privilege('authenticated','public.projects','source_inquiry_id','UPDATE')
            then 'PASS' else 'FAIL' end
union all
select '5. 상태 · 메모는 수정 가능',
       case when has_column_privilege('authenticated','public.projects','status','UPDATE')
             and has_column_privilege('authenticated','public.projects','admin_note','UPDATE')
            then 'PASS' else 'FAIL' end
union all
select '6. RLS 켜짐',
       case when (select relrowsecurity from pg_class where oid='public.projects'::regclass)
            then 'PASS' else 'FAIL' end
union all
select '7. 정책 3개가 is_admin() 조건',
       case when (select count(*) from pg_policies
                   where schemaname='public' and tablename='projects'
                     and coalesce(qual,'') || coalesce(with_check,'') like '%is_admin%') = 3
            then 'PASS' else 'FAIL' end
union all
select '8. DELETE 정책 없음',
       case when exists (select 1 from pg_policies
              where schemaname='public' and tablename='projects' and cmd in ('DELETE','ALL'))
            then 'FAIL' else 'PASS' end
union all
select '9. inquiries 는 그대로 (anon INSERT · SELECT 차단)',
       case when has_table_privilege('anon','public.inquiries','INSERT')
             and not has_table_privilege('anon','public.inquiries','SELECT')
            then 'PASS' else 'FAIL' end
union all
select '10. 상태 7값 · 유형 6값 · 플랜 4값 제약',
       case when (select count(*) from pg_constraint
                   where conrelid='public.projects'::regclass
                     and conname in ('projects_status_chk','projects_service_chk','projects_plan_chk')) = 3
            then 'PASS' else 'FAIL' end
union all
select '11. 현재 프로젝트 수', (select count(*)::text from public.projects)
order by 1;
