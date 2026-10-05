-- =====================================================================
-- biznesta/sql/35_products_coming_rls.sql — 출시예정 책도 공개로 보이게
-- ---------------------------------------------------------------------
-- 지금까지 공개 조회는 active(= 판매 중)만 열려 있었습니다. 서점에는
-- "곧 나옵니다" 칸이 필요하므로 coming 까지 열어 줍니다.
--
-- ★ 열리는 것은 '보이는 것' 뿐입니다. 사는 길은 그대로 selling 하나뿐입니다
--   (active 가 false 라 CORE 가 주문을 막습니다).
-- ★ draft(작성 중)와 stopped(중지)는 여전히 공개에 보이지 않습니다.
--
-- 여러 번 실행해도 안전합니다.
-- =====================================================================

do $$
begin
  if to_regclass('public.biz_products') is null then
    raise exception '30_store.sql 을 먼저 적용해 주세요';
  end if;
  if to_regprocedure('public.is_admin()') is null then
    raise exception '0005_admin_inquiries.sql 의 is_admin() 이 필요합니다';
  end if;
end $$;

drop policy if exists biz_products_public_read on public.biz_products;
create policy biz_products_public_read on public.biz_products
  for select to anon, authenticated
  using (status in ('selling', 'coming'));
