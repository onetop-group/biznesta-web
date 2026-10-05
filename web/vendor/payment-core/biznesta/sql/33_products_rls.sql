-- =====================================================================
-- biznesta/sql/33_products_rls.sql — 상품 운영 권한 · 정책
-- ---------------------------------------------------------------------
-- 32_products_ops.sql 과 나눈 이유는 31_rls.sql 과 같습니다 —
-- pglite 에는 anon / authenticated 역할도 is_admin() 도 없습니다.
-- 여러 번 실행해도 안전합니다.
-- =====================================================================

do $$
begin
  if to_regclass('public.biz_products') is null then
    raise exception '30_store.sql · 32_products_ops.sql 을 먼저 적용해 주세요';
  end if;
  if to_regprocedure('public.is_admin()') is null then
    raise exception '0005_admin_inquiries.sql 의 is_admin() 이 필요합니다';
  end if;
end $$;

-- ── 4. 권한 · 정책 다시 세우기 ──────────────────────────────────────
-- 공개: 판매중인 상품만 읽습니다 (2번에서 내렸다면 여기서 다시 만듭니다)
drop policy if exists biz_products_public_read on public.biz_products;
create policy biz_products_public_read on public.biz_products
  for select to anon, authenticated
  using (active = true);

-- 관리자가 고칠 수 있는 칸.
-- ★ product_ref 없음 (영구 식별자) · active 없음 (계산되는 칸이라 수정 불가)
revoke update on public.biz_products from authenticated;
grant update (name, amount, currency, status, kind, description, detail_path)
  on public.biz_products to authenticated;

-- 관리자 정책은 31_rls.sql 의 것을 그대로 씁니다(is_admin()). 다시 만들지 않습니다.
-- DELETE 는 여전히 권한도 정책도 없습니다 — 팔린 상품을 지울 수 없어야 합니다.


