-- =====================================================================
-- biznesta/sql/30_store.sql — BIZNESTA STORE 도메인 (표 + 쓰기 진입점)
-- ---------------------------------------------------------------------
-- 경계
--   · 이것은 PAYMENT CORE 가 아닙니다. CORE(pay_*) 는 이 파일을 모릅니다.
--   · 의존 방향은 한쪽뿐입니다 :  biz_*  →  pay_orders   (그 반대는 없습니다)
--   · CORE 는 product_ref / user_ref 를 '해석하지 않는 문자열' 로만 갖습니다.
--     그 문자열의 뜻(어떤 상품인가 · 누구인가)은 여기에만 있습니다.
--
-- 이 파일이 만드는 것
--   1. biz_products      상품 정본 — 가격의 유일한 근거 (클라이언트 금액 불신)
--   2. biz_buyers        비회원 구매자 — 이메일 하나뿐
--   3. biz_entitlements  결제된 주문에만 생기는 상품 접근 권한
--   4. 쓰기 진입점 RPC   결제 상태를 확인한 뒤에만 권한을 만듭니다
--
-- 이 파일이 하지 않는 것
--   · RLS / 권한  → 31_rls.sql (anon·authenticated·is_admin() 이 있는 환경 전용)
--   · 상품 등록   → 실제 상품은 아직 없습니다. 0건 상태로 동작해야 합니다.
--   · 파일 저장 · 다운로드 · 이메일 발송
--
-- 여러 번 실행해도 안전합니다.
-- =====================================================================

-- ── 0. 선행 조건 ────────────────────────────────────────────────────
do $$
begin
  if to_regclass('public.pay_orders') is null then
    raise exception 'PAYMENT CORE(pay_orders) 가 먼저 적용되어 있어야 합니다';
  end if;
end $$;


-- ── 1. 상품 정본 ────────────────────────────────────────────────────
-- product_ref 를 기본키로 둡니다. CORE 의 pay_orders.product_ref 에 그대로
-- 들어가는 값이며, 한 번 팔린 뒤에는 바뀌면 안 되는 식별자이기 때문입니다.
-- ★ active 기본값은 false 입니다 — 넣자마자 팔리는 사고를 막습니다.
create table if not exists public.biz_products (
  product_ref text primary key
              check (product_ref ~ '^[a-z][a-z0-9-]{2,63}$'),
  name        text    not null check (length(btrim(name)) between 1 and 200),
  amount      bigint  not null check (amount > 0),
  currency    char(3) not null default 'KRW' check (currency ~ '^[A-Z]{3}$'),
  active      boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ★ currency 를 pay_currencies 로 FK 걸지 않습니다.
--   도메인 표가 CORE 표에 묶이면 CORE 를 따로 걷어낼 수 없게 됩니다.
--   통화 검증은 CORE 의 money.assertAmount 가 주문 시점에 다시 합니다.

create or replace function public.biz_set_updated_at()
returns trigger language plpgsql as $fn$
begin new.updated_at := now(); return new; end;
$fn$;

drop trigger if exists biz_products_set_updated_at on public.biz_products;
create trigger biz_products_set_updated_at
  before update on public.biz_products
  for each row execute function public.biz_set_updated_at();


-- ── 2. 비회원 구매자 ────────────────────────────────────────────────
-- 왜 이메일만인가
--   · 디지털 상품이라 배송지가 없습니다. 이름·전화번호·주소는 필요 없습니다.
--   · 이메일은 '지금은' 안 쓰지만 반드시 필요합니다 — 결제한 사람이 나중에
--     다시 접근할 수 있는 유일한 통로이기 때문입니다(재발급 링크 · 영수증).
--   · 해시로 저장할 수 없습니다. 보낼 주소여서 원문이 있어야 합니다.
--     대신 CORE 에는 절대 넘기지 않습니다. CORE 가 보는 것은 이 행의 id 뿐입니다.
create table if not exists public.biz_buyers (
  id         uuid primary key default gen_random_uuid(),
  email      text not null
             check (length(email) between 5 and 254
                    and email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'),
  email_norm text generated always as (lower(btrim(email))) stored,
  created_at timestamptz not null default now(),
  constraint biz_buyers_email_norm_key unique (email_norm)
);


-- ── 3. 구매 권한 ────────────────────────────────────────────────────
-- 접근 토큰은 '원문을 저장하지 않습니다'. sha256 만 옵니다.
-- 원문은 서버 메모리에서 만들어 링크에 실려 나가고 그걸로 끝입니다.
-- 그래서 DB 가 통째로 새도 남의 상품을 열 수 없습니다.
create table if not exists public.biz_entitlements (
  id             uuid primary key default gen_random_uuid(),
  tenant         text not null default 'biznesta'
                 check (tenant ~ '^[a-z][a-z0-9_]{1,62}$'),
  order_id       uuid not null references public.pay_orders(id),
  product_ref    text not null references public.biz_products(product_ref) on delete restrict,
  buyer_id       uuid not null references public.biz_buyers(id) on delete restrict,
  token_hash     text not null check (token_hash ~ '^[0-9a-f]{64}$'),
  granted_at     timestamptz not null default now(),
  revoked_at     timestamptz,
  revoked_reason text check (revoked_reason is null or length(revoked_reason) <= 200),

  -- 한 주문에 같은 상품 권한은 하나뿐입니다 (중복 발급 금지)
  constraint biz_entitlements_order_product_key unique (order_id, product_ref),
  constraint biz_entitlements_token_hash_key    unique (token_hash),
  constraint biz_entitlements_revoke_sync
    check ((revoked_at is null) = (revoked_reason is null))
);

create index if not exists biz_entitlements_buyer_idx on public.biz_entitlements (buyer_id);
create index if not exists biz_entitlements_order_idx on public.biz_entitlements (order_id);

-- ★ DELETE 는 쓰지 않습니다. 환불은 '지우기' 가 아니라 revoked_at 기록입니다.


-- ── 4. 쓰기 진입점 ──────────────────────────────────────────────────
-- 구매자 등록 (같은 이메일이면 같은 사람)
create or replace function public.biz_buyer_upsert(p_email text)
returns uuid
language plpgsql security definer set search_path = public
as $fn$
declare
  v_email text := btrim(coalesce(p_email, ''));
  v_id    uuid;
begin
  if v_email = '' then
    raise exception 'BIZ_EMAIL_REQUIRED' using errcode = '22023';
  end if;
  if v_email !~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$' or length(v_email) > 254 then
    raise exception 'BIZ_EMAIL_INVALID' using errcode = '22023';
  end if;

  insert into biz_buyers (email) values (v_email)
    on conflict (email_norm) do update set email = biz_buyers.email
    returning id into v_id;
  return v_id;
end;
$fn$;


-- 권한 발급 — ★ 결제가 확인된 주문에만.
-- 주문이 스스로 말하는 상품·구매자와 요청이 다르면 거부합니다.
-- 즉 "결제한 것과 다른 상품을 열어주기" 가 구조적으로 불가능합니다.
create or replace function public.biz_entitlement_grant(
  p_order_id    uuid,
  p_product_ref text,
  p_buyer_id    uuid,
  p_token_hash  text
) returns public.biz_entitlements
language plpgsql security definer set search_path = public
as $fn$
declare
  o record;
  e public.biz_entitlements;
begin
  select id, tenant::text as tenant, status::text as status, product_ref, user_ref
    into o
    from pay_orders
   where id = p_order_id;

  if not found then
    raise exception 'BIZ_ORDER_NOT_FOUND' using errcode = 'P0002';
  end if;
  if o.status <> 'PAID' then
    raise exception 'BIZ_ORDER_NOT_PAID' using errcode = '22023';
  end if;
  if o.product_ref is distinct from p_product_ref then
    raise exception 'BIZ_PRODUCT_REF_MISMATCH' using errcode = '22023';
  end if;
  if o.user_ref is distinct from p_buyer_id::text then
    raise exception 'BIZ_BUYER_MISMATCH' using errcode = '22023';
  end if;

  -- 이미 있으면 그대로 돌려줍니다. ★ 토큰을 새로 돌리지 않습니다 —
  --   hook 재시도가 이미 보낸 링크를 죽이면 안 되기 때문입니다.
  select * into e from biz_entitlements
   where order_id = p_order_id and product_ref = p_product_ref;
  if found then
    return e;
  end if;

  if p_token_hash is null or p_token_hash !~ '^[0-9a-f]{64}$' then
    raise exception 'BIZ_TOKEN_HASH_INVALID' using errcode = '22023';
  end if;
  if not exists (select 1 from biz_products where product_ref = p_product_ref) then
    raise exception 'BIZ_PRODUCT_NOT_FOUND' using errcode = 'P0002';
  end if;

  begin
    insert into biz_entitlements (tenant, order_id, product_ref, buyer_id, token_hash)
    values (o.tenant, p_order_id, p_product_ref, p_buyer_id, p_token_hash)
    returning * into e;
  exception when unique_violation then
    -- 동시에 둘이 들어온 경우 — 먼저 들어간 것을 돌려줍니다
    select * into e from biz_entitlements
     where order_id = p_order_id and product_ref = p_product_ref;
    if not found then raise; end if;
  end;

  return e;
end;
$fn$;


-- 권한 회수 (환불 등). 행을 지우지 않고 회수 시각을 적습니다.
create or replace function public.biz_entitlement_revoke(p_order_id uuid, p_reason text)
returns integer
language plpgsql security definer set search_path = public
as $fn$
declare n integer;
begin
  update biz_entitlements
     set revoked_at     = now(),
         revoked_reason = left(coalesce(nullif(btrim(p_reason), ''), 'refunded'), 200)
   where order_id = p_order_id
     and revoked_at is null;
  get diagnostics n = row_count;
  return n;
end;
$fn$;


-- 토큰으로 권한 조회. ★ 인자는 '해시' 입니다 — 토큰 원문은 DB 까지 오지 않습니다.
-- 회수된 권한은 아예 나오지 않습니다 (환불 후 접근 차단).
create or replace function public.biz_entitlement_by_token(p_token_hash text)
returns table (order_id uuid, product_ref text, buyer_id uuid, granted_at timestamptz)
language plpgsql security definer set search_path = public stable
as $fn$
begin
  if p_token_hash is null or p_token_hash !~ '^[0-9a-f]{64}$' then
    return;                                   -- 형식이 아니면 조회 자체를 하지 않습니다
  end if;
  return query
    select e.order_id, e.product_ref, e.buyer_id, e.granted_at
      from biz_entitlements e
     where e.token_hash = p_token_hash
       and e.revoked_at is null;
end;
$fn$;
