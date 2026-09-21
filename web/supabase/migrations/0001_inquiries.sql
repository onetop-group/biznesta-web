-- ============================================================================
-- BIZNESTA — 상담 문의 테이블
-- SUPABASE INQUIRY DB / ACTUAL FORM SUBMISSION — PHASE 2 (2026-09-07)
--
-- 적용 방법
--   Supabase 대시보드 > SQL Editor 에 이 파일 내용을 그대로 붙여 실행하거나,
--   supabase CLI 를 쓴다면  supabase db push  로 적용한다.
--   여러 번 실행해도 안전하도록 작성했다.
--
-- 이 단계에서 만드는 것은 문의 저장뿐이다. 관리자 화면 · 메일 · Webhook 은
-- 아직 만들지 않는다. status 컬럼만 다음 단계를 위해 미리 둔다.
-- ============================================================================

create table if not exists public.inquiries (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),

  -- 사용자가 폼에서 입력하는 값 (공식 시안의 필드와 1:1)
  name          text        not null,
  contact       text        not null,
  email         text,
  service       text        not null,
  message       text        not null,
  privacy_consent boolean   not null,

  -- 어디에서 상담으로 들어왔는지 (시스템이 붙이는 맥락, 화면 비노출)
  consultation_source text,
  selected_category   text,
  selected_design     text,
  selected_service    text,
  selected_plan       text,

  screen         text,
  submitted_path text,

  -- 다음 단계(문의 관리)에서 쓸 상태값. 지금은 항상 NEW 로 들어간다.
  status        text        not null default 'NEW',

  -- 동의하지 않은 문의는 애초에 저장될 수 없다
  constraint inquiries_privacy_consent_true check (privacy_consent = true),

  -- 길이 상한. 서버 검증과 같은 값이며 DB 가 마지막 방어선이 된다.
  constraint inquiries_name_len     check (char_length(name)    between 1 and 100),
  constraint inquiries_contact_len  check (char_length(contact) between 1 and 50),
  constraint inquiries_email_len    check (email is null or char_length(email) <= 200),
  constraint inquiries_service_len  check (char_length(service) between 1 and 100),
  constraint inquiries_message_len  check (char_length(message) between 1 and 2000),
  constraint inquiries_source_len   check (consultation_source is null or char_length(consultation_source) <= 200),
  constraint inquiries_category_len check (selected_category is null or char_length(selected_category) <= 200),
  constraint inquiries_design_len   check (selected_design   is null or char_length(selected_design)   <= 200),
  constraint inquiries_service2_len check (selected_service  is null or char_length(selected_service)  <= 200),
  constraint inquiries_plan_len     check (selected_plan     is null or char_length(selected_plan)     <= 200),
  constraint inquiries_screen_chk   check (screen is null or screen in ('pc', 'mobile')),
  constraint inquiries_path_len     check (submitted_path is null or char_length(submitted_path) <= 500),
  constraint inquiries_status_chk   check (status in ('NEW', 'IN_PROGRESS', 'DONE', 'SPAM'))
);

comment on table public.inquiries is
  'BIZNESTA 상담 신청. 홈페이지 CONTACT 폼에서만 들어온다. 익명 INSERT 만 허용.';

create index if not exists inquiries_created_at_idx on public.inquiries (created_at desc);
create index if not exists inquiries_status_idx     on public.inquiries (status);

-- ----------------------------------------------------------------------------
-- RLS — 최소 권한.
--   anon          : INSERT 만 (공개 상담 폼)
--   authenticated : 아무 권한도 열지 않는다
--   SELECT / UPDATE / DELETE : 두 역할 모두 정책 없음 → 전부 거부
--
-- anon key 는 브라우저에서 보이는 값이므로, 실제 보호 경계는 이 정책이다.
-- 관리자 조회/수정은 ADMIN / AUTH 단계에서 authenticated 정책을 따로 설계한다.
-- 지금 미리 열어 두지 않는다.
-- ----------------------------------------------------------------------------
alter table public.inquiries enable row level security;

-- force row level security 는 쓰지 않는다. FORCE 는 테이블 소유자(postgres)에게도
-- 정책을 적용하기 때문에, SELECT 정책이 없는 지금 상태에서는 대시보드
-- Table Editor / SQL Editor 로 접수 내용을 확인하는 것까지 막힌다.
-- anon 의 접근은 아래 정책과 GRANT 로만 결정되므로 보안 경계는 그대로다.

drop policy if exists "anon can insert inquiries" on public.inquiries;
create policy "anon can insert inquiries"
  on public.inquiries
  for insert
  to anon
  with check (privacy_consent = true);

-- SELECT / UPDATE / DELETE 정책은 만들지 않는다.
-- RLS 가 켜져 있고 정책이 없으면 해당 동작은 거부된다.

revoke all on public.inquiries from anon, authenticated;
grant insert on public.inquiries to anon;
