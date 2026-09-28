-- =====================================================================
-- biznesta/sql/34_products_coming.sql — '출시예정' 상태 추가
-- ---------------------------------------------------------------------
-- 왜 새 상태가 필요한가
--   지금까지 상태는 셋이었습니다 — draft(작성 중) · selling(판매 중) · stopped(중지).
--   서점을 열면 "표지와 제목은 먼저 보여주되 아직 살 수는 없는" 책이 생깁니다.
--   draft 로는 안 됩니다 — draft 는 관리자만 보는, 아직 내보낼 수 없는 상태입니다.
--   그래서 coming(출시예정)을 더합니다.
--
-- ★ 살 수 있는지는 여전히 selling 하나로만 정해집니다.
--   active 는 그대로 (status = 'selling') 이므로, coming 책은
--   CORE 의 resolveProduct 가 active:false 로 보고 주문을 막습니다
--   (PAY_PRODUCT_NOT_AVAILABLE). 화면이 실수해도 결제가 되지 않습니다.
--
-- 공개 노출 범위는 35_products_coming_rls.sql 에서 넓힙니다
--   (역할이 있는 환경 전용이라 파일을 나눕니다 — 31·33 과 같은 이유).
--
-- 여러 번 실행해도 안전합니다.
-- =====================================================================

do $$
begin
  if to_regclass('public.biz_products') is null then
    raise exception '30_store.sql · 32_products_ops.sql 을 먼저 적용해 주세요';
  end if;
end $$;

-- 상태 목록을 넷으로 넓힙니다. 기존 제약을 내리고 다시 겁니다.
do $$
begin
  if exists (select 1 from pg_constraint where conname = 'biz_products_status_check') then
    alter table public.biz_products drop constraint biz_products_status_check;
  end if;
  alter table public.biz_products add constraint biz_products_status_check
    check (status in ('draft', 'coming', 'selling', 'stopped'));
end $$;

-- ★ active 는 건드리지 않습니다.
--   generated always as (status = 'selling') 그대로입니다.
--   coming 은 '보이지만 살 수 없는' 상태이고, 그 판정이 한 곳에만 있어야 합니다.
