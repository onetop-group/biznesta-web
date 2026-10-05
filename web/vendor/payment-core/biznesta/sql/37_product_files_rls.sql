-- =====================================================================
-- biznesta/sql/37_product_files_rls.sql — 파일 연결 표의 권한
-- ---------------------------------------------------------------------
-- 원칙 : 파일이 어디 있는지는 **손님에게 알려 주지 않습니다**.
--   · anon           아무 권한 없음 (표도 함수도)
--   · authenticated  관리자만 읽기 (운영자가 연결 상태를 확인해야 합니다)
--   · service_role   읽기 · 연결 · 수정 (서버가 하는 일)
--   · DELETE         아무에게도 주지 않습니다 — 팔린 책의 연결을 지울 수 없어야 합니다
--
-- 인가 함수(biz_download_authorize)는 service_role 만 부를 수 있습니다.
-- 클라이언트가 직접 판정하는 경로를 만들지 않기 위해서입니다.
--
-- 여러 번 실행해도 안전합니다.
-- =====================================================================

do $$
begin
  if to_regclass('public.biz_product_files') is null then
    raise exception '36_product_files.sql 을 먼저 적용해 주세요';
  end if;
  if to_regprocedure('public.is_admin()') is null then
    raise exception '0005_admin_inquiries.sql 의 is_admin() 이 필요합니다';
  end if;
end $$;

alter table public.biz_product_files enable row level security;
revoke all on table public.biz_product_files from public, anon, authenticated;

-- 관리자만 연결 상태를 봅니다
grant select on public.biz_product_files to authenticated, service_role;
drop policy if exists biz_product_files_admin_read on public.biz_product_files;
create policy biz_product_files_admin_read on public.biz_product_files
  for select to authenticated
  using (public.is_admin());

-- 관리자가 파일을 연결·교체합니다 (product_ref 는 바꿀 수 없습니다)
grant insert on public.biz_product_files to authenticated;
grant update (bucket, object_path, content_type, byte_size, note)
  on public.biz_product_files to authenticated;

drop policy if exists biz_product_files_admin_insert on public.biz_product_files;
create policy biz_product_files_admin_insert on public.biz_product_files
  for insert to authenticated
  with check (public.is_admin());

drop policy if exists biz_product_files_admin_update on public.biz_product_files;
create policy biz_product_files_admin_update on public.biz_product_files
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

grant insert, update on public.biz_product_files to service_role;

-- ── 함수 실행 권한 ──────────────────────────────────────────────────
-- ★ 인가 함수는 서버(service_role)만 부릅니다.
--   anon 이나 로그인 사용자가 직접 부를 수 있으면 클라이언트가 판정하는 셈이 됩니다.
revoke all on function public.biz_download_authorize(text)   from public, anon, authenticated;
revoke all on function public.biz_product_file_ready(text)   from public, anon, authenticated;

grant execute on function public.biz_download_authorize(text) to service_role;
-- 연결 여부(참/거짓)는 관리자 화면도 물어봅니다. 경로는 돌려주지 않으므로 안전합니다.
grant execute on function public.biz_product_file_ready(text) to authenticated, service_role;
