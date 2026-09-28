-- =====================================================================
-- biznesta/sql/38_storage_bucket.sql — 전자책 비공개 버킷
-- ---------------------------------------------------------------------
-- ★ 이 파일만 `storage` 스키마를 건드립니다. 그래서 따로 두었습니다.
--   다른 파일은 전부 public 스키마 안에서 끝납니다.
--
-- 만드는 것은 **비공개 버킷 하나**뿐입니다.
--   public = false  → 영구 공개주소가 존재하지 않습니다.
--                     받으려면 매번 서버가 서명한 짧은 URL 이 있어야 합니다.
--
-- storage.objects 에 정책을 만들지 않습니다.
--   정책이 없으면 anon · authenticated 는 한 줄도 읽지 못합니다(기본 deny).
--   서버는 service_role 로 접근하고, service_role 은 RLS 를 지나갑니다.
--   ★ 손님에게 열어 주는 정책을 만들면 그 순간 비공개가 아니게 됩니다.
--
-- 여러 번 실행해도 안전합니다.
-- =====================================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'biznesta-book-private',
  'biznesta-book-private',
  false,                              -- ★ 비공개
  209715200,                          -- 200MB — 전자책 PDF 에 넉넉합니다
  array['application/pdf']            -- PDF 만 올릴 수 있습니다
)
on conflict (id) do update
  set public = false,                 -- 실수로 공개로 바뀌어도 되돌립니다
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- 공개 버킷이 생기지 않았는지 확인합니다. 하나라도 있으면 멈춥니다.
do $$
declare n int;
begin
  select count(*) into n from storage.buckets where public = true;
  if n > 0 then
    raise exception '공개 버킷이 있습니다 (%개). 전자책은 비공개 버킷에만 둡니다.', n;
  end if;
end $$;
