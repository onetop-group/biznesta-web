-- ============================================================================
-- BIZNESTA — 문의 출처 구분 (BIZNESTA BOOK 문의 분리)
-- 2026-09-28
--
-- 이 파일이 하는 일
--   1. inquiries.inquiry_source   이 문의가 어디서 왔는가 ('site' | 'book')
--   2. inquiries.product_ref      BOOK 문의라면 어떤 책에 대한 것인가
--
-- 기존 구조를 건드리지 않는다
--   · 기존 컬럼 · 제약 · 정책 · GRANT 는 하나도 바꾸지 않는다.
--   · 칸 두 개만 더한다. 기존 5건은 inquiry_source 가 'site' 로 읽힌다 —
--     실제로 홈페이지 상담폼에서 온 문의라 그게 맞는 값이다.
--   · 기본값이 있으므로 이 칸을 모르는 기존 INSERT 경로(공개 상담폼)는
--     지금처럼 그대로 동작한다.
--
-- product_ref 에 외래키를 걸지 않는 이유
--   inquiries 는 홈페이지 표이고 biz_products 는 STORE 표다. 외래키로 묶으면
--   문의 기록이 상품표의 수명에 매이게 된다. 문의는 상품이 내려가도 남아야
--   하는 기록이므로 '그때 적힌 식별자' 를 그대로 보관만 한다.
--
-- 적용: Supabase 대시보드 > SQL Editor 에 전체를 붙여넣고 Run.
--       여러 번 실행해도 안전하다.
-- ============================================================================

do $$
begin
  if to_regclass('public.inquiries') is null then
    raise exception 'public.inquiries 가 없습니다 (0001 먼저)';
  end if;
end $$;

-- ── 1. 출처 ────────────────────────────────────────────────────────────────
alter table public.inquiries
  add column if not exists inquiry_source text not null default 'site';

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'inquiries_source_kind_chk') then
    alter table public.inquiries add constraint inquiries_source_kind_chk
      check (inquiry_source in ('site', 'book'));
  end if;
end $$;

-- ── 2. 어떤 책에 대한 문의인가 ──────────────────────────────────────────────
-- BOOK 문의가 아니면 비어 있다. 형식은 biz_products.product_ref 와 같은 규칙.
alter table public.inquiries
  add column if not exists product_ref text;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'inquiries_product_ref_fmt') then
    alter table public.inquiries add constraint inquiries_product_ref_fmt
      check (product_ref is null or product_ref ~ '^[a-z][a-z0-9-]{2,63}$');
  end if;
  -- 책 문의가 아닌데 책이 적혀 있으면 안 된다
  if not exists (select 1 from pg_constraint where conname = 'inquiries_product_ref_only_book') then
    alter table public.inquiries add constraint inquiries_product_ref_only_book
      check (product_ref is null or inquiry_source = 'book');
  end if;
end $$;

-- 관리자 목록에서 출처로 걸러 볼 수 있게
create index if not exists inquiries_source_idx on public.inquiries (inquiry_source, created_at desc);

-- ★ GRANT · RLS 는 손대지 않는다.
--   anon 은 지금도 INSERT 권한이 표 단위로 있고, 새 칸도 그 안에 들어간다.
--   공개 정책의 유일한 조건(privacy_consent = true)은 그대로다.
