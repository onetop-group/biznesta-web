-- =====================================================================
-- biznesta/sql/36_product_files.sql — 상품 ↔ 비공개 파일 연결 + 다운로드 인가
-- ---------------------------------------------------------------------
-- 전자책 제공 방식이 확정됐습니다 :
--   비공개 Storage + 구매 권한 검증 + 짧은 만료의 Signed URL
--
-- 왜 biz_products 에 칸을 더하지 않는가
--   biz_products 는 판매중·출시예정 행을 **anon 이 읽을 수 있습니다**(공개 카탈로그).
--   거기에 파일 경로를 두면 손님에게 저장 위치가 그대로 보입니다. 비공개 버킷이라
--   경로만으로 받아 갈 수는 없지만, 알려 줄 이유가 없는 것은 알려 주지 않습니다.
--   그래서 파일 연결은 **공개 권한이 하나도 없는 별도 표**에 둡니다.
--
-- 이 파일이 하지 않는 것
--   · 실제 PDF 업로드 — 최종 원고가 아직 없습니다. 연결 '자리' 만 만듭니다.
--   · Signed URL 생성 — SQL 로 할 수 없습니다(Storage API 의 일입니다).
--     대신 "누구에게 발급해도 되는가" 의 판정을 여기서 끝냅니다.
--
-- 여러 번 실행해도 안전합니다.
-- =====================================================================

do $$
begin
  if to_regclass('public.biz_products') is null then
    raise exception '30_store.sql 을 먼저 적용해 주세요';
  end if;
  if to_regclass('public.biz_entitlements') is null then
    raise exception '30_store.sql 의 biz_entitlements 가 필요합니다';
  end if;
end $$;


-- ── 1. 상품 ↔ 비공개 파일 ───────────────────────────────────────────
-- 상품 하나에 파일 하나. 책이 늘면 행이 늘 뿐 구조는 그대로입니다.
create table if not exists public.biz_product_files (
  product_ref  text primary key references public.biz_products(product_ref) on delete restrict,
  bucket       text not null default 'biznesta-book-private'
               check (bucket ~ '^[a-z0-9][a-z0-9._-]{1,62}$'),
  -- 버킷 안에서의 경로. 앞에 / 를 붙이지 않습니다.
  object_path  text not null
               check (object_path ~ '^[A-Za-z0-9가-힣][A-Za-z0-9가-힣 ._/-]{0,250}$'),
  content_type text not null default 'application/pdf',
  byte_size    bigint check (byte_size is null or byte_size > 0),
  note         text check (note is null or length(note) <= 200),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

drop trigger if exists biz_product_files_set_updated_at on public.biz_product_files;
create trigger biz_product_files_set_updated_at
  before update on public.biz_product_files
  for each row execute function public.biz_set_updated_at();


-- ── 2. 다운로드 인가 — 판정이 일어나는 유일한 자리 ──────────────────
-- 서버가 이 함수에 '토큰 해시' 를 주고, 함수는 내려보내도 되는 파일만 돌려줍니다.
-- 한 줄도 나오지 않으면 그 요청은 거부입니다. 판정 조건은 넷입니다.
--   ① 그 해시의 권한이 실제로 있는가
--   ② 회수되지 않았는가            (환불 시 revoked_at 이 찍힙니다)
--   ③ 그 주문이 아직 결제 상태인가  (hook 이 실패해 회수가 안 됐어도 여기서 막힙니다)
--   ④ 그 상품에 파일이 연결돼 있는가
--
-- ★ ③ 이 중요합니다. 환불 회수(②)는 hook 으로 일어나는데 hook 은 실패할 수 있습니다.
--   주문 상태를 직접 보면 그 구멍이 닫힙니다.
create or replace function public.biz_download_authorize(p_token_hash text)
returns table (
  order_id     uuid,
  product_ref  text,
  bucket       text,
  object_path  text,
  content_type text
)
language plpgsql security definer set search_path = public stable
as $fn$
begin
  if p_token_hash is null or p_token_hash !~ '^[0-9a-f]{64}$' then
    return;                                   -- 형식이 아니면 조회 자체를 하지 않습니다
  end if;

  return query
    select e.order_id, e.product_ref, f.bucket, f.object_path, f.content_type
      from biz_entitlements e
      join pay_orders o
        on o.id = e.order_id
      join biz_product_files f
        on f.product_ref = e.product_ref
     where e.token_hash = p_token_hash
       and e.revoked_at is null                -- ② 회수되지 않았다
       and o.status::text = 'PAID';            -- ③ 아직 결제 상태다
end;
$fn$;


-- ── 3. 파일 연결 여부만 알려 주는 조회 ──────────────────────────────
-- 화면(결제 완료 · 관리자)이 "다운로드 버튼을 켜도 되는가" 를 묻는 자리입니다.
-- ★ 경로를 돌려주지 않습니다. 연결됐는지 여부만 말합니다.
create or replace function public.biz_product_file_ready(p_product_ref text)
returns boolean
language sql security definer set search_path = public stable
as $fn$
  select exists (select 1 from biz_product_files where product_ref = p_product_ref);
$fn$;
