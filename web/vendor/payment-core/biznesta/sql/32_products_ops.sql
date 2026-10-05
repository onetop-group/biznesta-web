-- =====================================================================
-- biznesta/sql/32_products_ops.sql — 상품 운영(관리자 등록·수정) 기반
-- ---------------------------------------------------------------------
-- 30_store.sql 의 biz_products 는 '팔 수 있는 최소'만 갖고 있었습니다
-- (product_ref · name · amount · currency · active). 앞으로 전자책이 계속
-- 늘어나므로, 대표가 관리자센터에서 직접 등록·수정할 수 있을 만큼만 넓힙니다.
--
-- 핵심 설계 : active 를 '계산되는 칸' 으로 바꿉니다
--   지금까지 active 는 손으로 켜고 끄는 boolean 이었습니다. 여기에 초안까지
--   더하면 status 와 active 두 개가 서로 어긋날 수 있습니다.
--   그래서 active 를 status 에서 **자동으로 계산되는 generated column** 으로
--   바꿉니다. 이제 active 를 직접 켜는 방법이 존재하지 않습니다 —
--   판매를 시작하는 유일한 길은 status='selling' 뿐입니다.
--   ★ 이렇게 하면 PAYMENT CORE 쪽(resolveProduct 의 active)은 한 줄도 안 바뀝니다.
--
-- 하지 않는 것
--   · 전자책 파일 / Storage 칸 — 원고가 아직 없습니다. 구조만 문서로 남깁니다(아래).
--   · 상세페이지 본문 CMS — 외부 앱에서 만들 예정이라 형식을 강제하지 않습니다.
--     연결 지점으로 detail_path 한 칸만 둡니다.
--
-- 여러 번 실행해도 안전합니다.
-- =====================================================================

do $$
begin
  if to_regclass('public.biz_products') is null then
    raise exception '30_store.sql 을 먼저 적용해 주세요';
  end if;
end $$;


-- ── 1. 운영에 필요한 칸 ─────────────────────────────────────────────
alter table public.biz_products add column if not exists status      text;
alter table public.biz_products add column if not exists kind        text;
alter table public.biz_products add column if not exists description text;
-- 상세페이지 연결 지점. 지금은 비어 있고 STEP D-2B 에서 채웁니다.
-- 본문을 여기 넣지 않습니다 — 외부 제작 결과의 '위치' 만 가리킵니다.
alter table public.biz_products add column if not exists detail_path text;

-- 기존 행이 있다면 현재 active 값에서 status 를 유추합니다 (지금은 0행)
update public.biz_products
   set status = case when active then 'selling' else 'draft' end
 where status is null;

update public.biz_products set kind = 'ebook' where kind is null;

alter table public.biz_products alter column status set default 'draft';
alter table public.biz_products alter column kind   set default 'ebook';

do $$
begin
  if exists (select 1 from public.biz_products where status is null or kind is null) then
    raise exception '상태를 정하지 못한 상품이 있습니다 — 확인이 필요합니다';
  end if;
  alter table public.biz_products alter column status set not null;
  alter table public.biz_products alter column kind   set not null;
end $$;

-- 제약 (create constraint if not exists 가 없어 존재 여부를 직접 봅니다)
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'biz_products_status_check') then
    alter table public.biz_products add constraint biz_products_status_check
      check (status in ('draft', 'selling', 'stopped'));
  end if;
  if not exists (select 1 from pg_constraint where conname = 'biz_products_kind_check') then
    alter table public.biz_products add constraint biz_products_kind_check
      check (kind in ('ebook', 'template', 'other'));
  end if;
  if not exists (select 1 from pg_constraint where conname = 'biz_products_description_len') then
    alter table public.biz_products add constraint biz_products_description_len
      check (description is null or length(description) <= 300);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'biz_products_detail_path_fmt') then
    alter table public.biz_products add constraint biz_products_detail_path_fmt
      check (detail_path is null or detail_path ~ '^/[A-Za-z0-9/_-]{1,160}$');
  end if;
end $$;


-- ── 2. active 를 status 에서 계산되는 칸으로 ────────────────────────
-- attgenerated = '' 이면 아직 평범한 칸입니다. 그때만 바꿉니다.
do $$
declare plain boolean;
begin
  select (a.attgenerated = '') into plain
    from pg_attribute a join pg_class c on c.oid = a.attrelid
    join pg_namespace n on n.oid = c.relnamespace
   where n.nspname = 'public' and c.relname = 'biz_products'
     and a.attname = 'active' and a.attnum > 0 and not a.attisdropped;

  if plain then
    -- 정책이 active 를 참조하므로 먼저 내립니다 (아래에서 다시 만듭니다)
    drop policy if exists biz_products_public_read on public.biz_products;
    alter table public.biz_products drop column active;
    alter table public.biz_products
      add column active boolean generated always as (status = 'selling') stored;
  end if;
end $$;


-- ── 3. product_ref 는 바뀌지 않습니다 ───────────────────────────────
-- 이 값은 pay_orders.product_ref 에 그대로 박혀 나갑니다. 한 번 팔린 뒤에
-- 바뀌면 그 주문의 권한 발급이 영원히 어긋납니다(BIZ_PRODUCT_REF_MISMATCH).
-- 컬럼 UPDATE 권한을 주지 않는 것만으로는 소유자·service_role 을 못 막으므로
-- 트리거로 한 겹 더 막습니다.
create or replace function public.biz_products_ref_immutable()
returns trigger language plpgsql as $fn$
begin
  if new.product_ref is distinct from old.product_ref then
    raise exception 'BIZ_PRODUCT_REF_IMMUTABLE' using errcode = '22023';
  end if;
  return new;
end;
$fn$;

drop trigger if exists biz_products_ref_immutable on public.biz_products;
create trigger biz_products_ref_immutable
  before update on public.biz_products
  for each row execute function public.biz_products_ref_immutable();


-- =====================================================================
-- 앞으로의 확장 지점 (지금 만들지 않습니다)
-- ---------------------------------------------------------------------
-- ① 상세페이지 (STEP D-2B)
--    외부 상세페이지 제작 앱의 결과를 연결합니다. 방법이 둘인데 지금 고르지
--    않습니다 — detail_path 한 칸이 둘 다 받아 줍니다.
--      · 경로만 연결   : detail_path = '/store/<slug>' 같은 값
--      · 본문을 보관   : biz_product_details(product_ref, blocks jsonb, ...) 를
--                        새로 만들고 detail_path 는 비워 둡니다
--
-- ② 전자책 파일 (원고 완성 후)
--    파일 자체는 어떤 표에도 넣지 않습니다. 넣을 자리는 Supabase Storage 의
--    **비공개 버킷** 이고, 연결은 이렇게 됩니다.
--      biz_entitlements(order_id, token_hash)  ← 이미 있습니다
--        → 서버가 토큰 해시로 권한을 확인 (biz_entitlement_by_token)
--        → 그 자리에서 Storage 서명 URL 을 짧은 만료로 발급
--    즉 상품표에 필요한 것은 '어느 파일인가' 한 칸(예: file_object) 뿐이고,
--    다운로드 권한은 지금 있는 entitlement 구조가 이미 책임집니다.
--    공개 버킷 · 영구 URL · 클라이언트 직접 접근은 만들지 않습니다.
-- =====================================================================
