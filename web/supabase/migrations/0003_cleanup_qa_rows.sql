-- ============================================================================
-- BIZNESTA — LIVE DB VERIFICATION 테스트 행 확인 및 삭제
-- 2026-09-07
--
-- Preview 검증에서 넣은 행은 6건이다.
--   · FLOW A~E 실제 화면 제출 5건   message: 'PREVIEW QA TEST LIVE …'
--   · 권한 probe insert 1건          consultation_source: 'rls-probe'
-- 모두 name = 'TEST BIZNESTA' 이고 message 가 'PREVIEW QA TEST' 로 시작한다.
-- 실제 고객 문의처럼 보이는 값은 넣지 않았다.
--
-- anon 에는 SELECT / DELETE 권한이 없으므로(설계 의도) 앱 쪽에서는 이 행들을
-- 읽거나 지울 수 없다. 대시보드 SQL Editor 에서 아래를 실행해 주세요.
--
-- 실행: Supabase 대시보드 > SQL Editor 에 전체를 붙여넣고 Run
-- ============================================================================

-- ── 1. 지우기 전에 저장된 내용 확인 ─────────────────────────────────────────
--    created_at 이 자동으로 채워졌는지, status 가 NEW 인지,
--    상담 맥락(consultation_source / selected_plan / selected_design / screen)이
--    제대로 들어갔는지 이 결과로 확인할 수 있습니다.
select
  created_at,
  status,
  consultation_source,
  selected_plan,
  selected_design,
  screen,
  submitted_path,
  name,
  contact,
  email,
  service,
  left(message, 40) as message_head,
  privacy_consent
from public.inquiries
where name = 'TEST BIZNESTA'
  and message like 'PREVIEW QA TEST%'
order by created_at;

-- ── 2. 테스트 행 삭제 ───────────────────────────────────────────────────────
delete from public.inquiries
where name = 'TEST BIZNESTA'
  and message like 'PREVIEW QA TEST%';

-- ── 3. 삭제 확인 — 두 값 모두 0 이어야 합니다 ───────────────────────────────
select
  count(*) filter (where name = 'TEST BIZNESTA' and message like 'PREVIEW QA TEST%') as qa_rows_left,
  count(*) as total_rows
from public.inquiries;
