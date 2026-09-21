-- ============================================================================
-- BIZNESTA — PRODUCTION 저장 확인용 테스트 행 확인 및 삭제
-- 2026-09-08
--
-- 상담폼이 실제로 저장되는지 확인하려고 **2건**을 넣었습니다.
--   1) 2026-09-08 · biznesta.vercel.app (Production 환경변수 적용 확인)
--   2) 2026-09-09 · biznesta.com (공식 도메인 연결 확인)
-- 두 건 모두
--   name    = 'TEST BIZNESTA'
--   contact = '000-0000-0000'
--   message = 'PROD QA TEST — …'
-- 실제 고객 문의처럼 보이는 값은 넣지 않았습니다.
--
-- anon 에는 SELECT / DELETE 권한이 없습니다(설계 의도). 그래서 앱 쪽에서는
-- 이 행을 읽거나 지울 수 없습니다. 대시보드에서 아래를 실행해 주세요.
--
-- 실행: Supabase 대시보드 > SQL Editor 에 전체를 붙여넣고 Run
--
-- 2026-09-07 Preview 검증 때의 행 6건이 남아 있다면
-- 0003_cleanup_qa_rows.sql 도 함께 실행하시면 됩니다.
-- ============================================================================

-- ── 1. 지우기 전에 저장된 내용 확인 ─────────────────────────────────────────
--    created_at 이 자동으로 채워졌는지, status 가 NEW 인지,
--    동의값(privacy_consent)이 true 로 들어갔는지 이 결과로 확인할 수 있습니다.
select
  created_at,
  status,
  consultation_source,
  screen,
  submitted_path,
  name,
  contact,
  service,
  left(message, 40) as message_head,
  privacy_consent
from public.inquiries
where name = 'TEST BIZNESTA'
  and message like 'PROD QA TEST%'
order by created_at;

-- ── 2. 테스트 행 삭제 ───────────────────────────────────────────────────────
delete from public.inquiries
where name = 'TEST BIZNESTA'
  and message like 'PROD QA TEST%';

-- ── 3. 삭제 확인 — qa_rows_left 가 0 이어야 합니다 ──────────────────────────
select
  count(*) filter (where name = 'TEST BIZNESTA'
    and (message like 'PROD QA TEST%' or message like 'PREVIEW QA TEST%')) as qa_rows_left,
  count(*) as total_rows
from public.inquiries;
