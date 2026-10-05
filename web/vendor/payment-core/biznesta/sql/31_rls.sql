-- =====================================================================
-- biznesta/sql/31_rls.sql — BIZNESTA STORE 권한 · RLS
-- ---------------------------------------------------------------------
-- 30_store.sql 과 나눈 이유
--   pglite 에는 anon / authenticated 역할도 is_admin() 도 없습니다.
--   CORE 가 16_rls.sql 을 따로 둔 것과 같은 이유입니다.
--
-- 판단 기준
--   · 상품표는 '공개 카탈로그' 입니다 → 판매중인 것만 누구나 읽습니다.
--   · 구매자와 권한은 '개인정보와 상품 접근권' 입니다 → 아무도 직접 읽지 못합니다.
--     관리자만 예외이고, 그 판정은 0005 의 is_admin() 을 그대로 씁니다.
--   · 쓰기는 전부 security definer RPC 를 통해서만 일어납니다.
--     anon / authenticated 에게는 INSERT/UPDATE/DELETE 정책을 하나도 만들지 않습니다.
--   · DELETE 는 어떤 역할에도 주지 않습니다.
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

-- 다른 환경을 위한 보험 (Supabase 에는 이미 있습니다)
do $$
begin
  if not exists (select 1 from pg_roles where rolname = 'anon') then create role anon nologin; end if;
  if not exists (select 1 from pg_roles where rolname = 'authenticated') then create role authenticated nologin; end if;
  if not exists (select 1 from pg_roles where rolname = 'service_role') then create role service_role nologin bypassrls; end if;
end $$;


-- ── 1. 기본 deny ────────────────────────────────────────────────────
alter table public.biz_products     enable row level security;
alter table public.biz_buyers       enable row level security;
alter table public.biz_entitlements enable row level security;

revoke all on table public.biz_products     from public, anon, authenticated;
revoke all on table public.biz_buyers       from public, anon, authenticated;
revoke all on table public.biz_entitlements from public, anon, authenticated;

-- ★ FORCE ROW LEVEL SECURITY 는 켜지 않습니다 — CORE 와 같은 이유입니다.
--   쓰기 정책을 일부러 하나도 만들지 않았으므로, FORCE 를 켜면 소유자 권한으로
--   도는 security definer RPC 의 INSERT/UPDATE 까지 전부 막힙니다.


-- ── 2. 상품 카탈로그 ────────────────────────────────────────────────
grant select on public.biz_products to anon, authenticated, service_role;

drop policy if exists biz_products_public_read on public.biz_products;
create policy biz_products_public_read on public.biz_products
  for select to anon, authenticated
  using (active = true);

-- 관리자는 판매중지 상품도 봅니다
drop policy if exists biz_products_admin_read on public.biz_products;
create policy biz_products_admin_read on public.biz_products
  for select to authenticated
  using (public.is_admin());

-- 관리자 등록 · 수정. ★ product_ref 는 수정 대상에서 뺍니다 —
--   이미 팔린 주문의 product_ref 와 어긋나면 권한 발급이 깨집니다.
grant insert on public.biz_products to authenticated;
grant update (name, amount, currency, active) on public.biz_products to authenticated;

drop policy if exists biz_products_admin_insert on public.biz_products;
create policy biz_products_admin_insert on public.biz_products
  for insert to authenticated
  with check (public.is_admin());

drop policy if exists biz_products_admin_update on public.biz_products;
create policy biz_products_admin_update on public.biz_products
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());


-- ── 3. 구매자 (개인정보) ────────────────────────────────────────────
-- 공개 역할은 한 줄도 읽지 못합니다. 관리자만 운영 목적으로 읽습니다.
grant select on public.biz_buyers to authenticated, service_role;

drop policy if exists biz_buyers_admin_read on public.biz_buyers;
create policy biz_buyers_admin_read on public.biz_buyers
  for select to authenticated
  using (public.is_admin());


-- ── 4. 구매 권한 ────────────────────────────────────────────────────
-- 구매자 본인 조회는 '토큰 해시' RPC 로만 합니다. 표를 직접 열지 않습니다.
grant select on public.biz_entitlements to authenticated, service_role;

drop policy if exists biz_entitlements_admin_read on public.biz_entitlements;
create policy biz_entitlements_admin_read on public.biz_entitlements
  for select to authenticated
  using (public.is_admin());


-- ── 5. 함수 실행 권한 ───────────────────────────────────────────────
-- 전부 회수한 뒤 서버(service_role)에만 돌려줍니다.
-- ★ anon / authenticated 에게는 하나도 주지 않습니다.
--   특히 biz_entitlement_grant 가 열려 있으면 결제 없이 권한을 만들 수 있습니다.
revoke all on function public.biz_buyer_upsert(text)                        from public, anon, authenticated;
revoke all on function public.biz_entitlement_grant(uuid, text, uuid, text) from public, anon, authenticated;
revoke all on function public.biz_entitlement_revoke(uuid, text)            from public, anon, authenticated;
revoke all on function public.biz_entitlement_by_token(text)                from public, anon, authenticated;
revoke all on function public.biz_set_updated_at()                          from public, anon, authenticated;

grant execute on function public.biz_buyer_upsert(text)                        to service_role;
grant execute on function public.biz_entitlement_grant(uuid, text, uuid, text) to service_role;
grant execute on function public.biz_entitlement_revoke(uuid, text)            to service_role;
grant execute on function public.biz_entitlement_by_token(text)                to service_role;
