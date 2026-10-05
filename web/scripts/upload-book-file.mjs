/* =====================================================================
   scripts/upload-book-file.mjs — 전자책 PDF 를 비공개 버킷에 올리고 상품에 연결
   ---------------------------------------------------------------------
   한 번에 두 가지를 합니다. 둘이 어긋나면 "살 수 있는데 못 받는" 상태가 되므로
   **올린 뒤에만 연결**합니다.
     ① Supabase Storage 비공개 버킷에 PDF 업로드
     ② biz_product_files 에 상품 ↔ 경로 연결

   필요한 것 : SUPABASE_URL · SUPABASE_SERVICE_ROLE_KEY (.env.local 또는 환경변수)
   ★ service_role 키는 비공개 버킷에 쓰기 위해 반드시 필요합니다. 이 스크립트는
     서버(개발자 PC)에서만 돌고, 키를 출력하거나 저장하지 않습니다.

     node scripts/upload-book-file.mjs --product <product_ref> --file <PDF 경로> \
                                       [--path ebook-customer-db/v1.pdf] [--dry]
   ===================================================================== */
import { createClient } from '@supabase/supabase-js';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const WEB = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const BUCKET = 'biznesta-book-private';

/* .env.local 을 읽어 환경변수로 올립니다. 값은 출력하지 않습니다. */
function loadEnv() {
  const f = path.join(WEB, '.env.local');
  if (!fs.existsSync(f)) return;
  for (const line of fs.readFileSync(f, 'utf8').split(/\r?\n/)) {
    const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*)$/.exec(line);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, '');
  }
}
loadEnv();

const arg = (name, fallback = null) => {
  const i = process.argv.indexOf('--' + name);
  return i >= 0 ? process.argv[i + 1] : fallback;
};
const DRY = process.argv.includes('--dry');

const productRef = arg('product');
const filePath = arg('file');
const objectPath = arg('path') || (productRef ? `${productRef}/v1.pdf` : null);

if (!productRef || !filePath) {
  console.error('사용법: node scripts/upload-book-file.mjs --product <product_ref> --file <PDF 경로> [--path <버킷 안 경로>]');
  process.exit(2);
}
if (!fs.existsSync(filePath)) {
  console.error('PDF 를 찾지 못했습니다: ' + filePath);
  process.exit(2);
}

const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error('\nSUPABASE_URL 과 SUPABASE_SERVICE_ROLE_KEY 가 필요합니다.');
  console.error('  web/.env.local 에 두 줄을 넣어 주세요 (이 파일은 Git 에 올라가지 않습니다).');
  console.error('  값 위치: Supabase > Project Settings > API\n');
  process.exit(3);
}

const bytes = fs.readFileSync(filePath);
const sha = createHash('sha256').update(bytes).digest('hex');

console.log('\n올릴 파일');
console.log('  이름   : ' + path.basename(filePath));
console.log('  크기   : ' + (bytes.length / 1048576).toFixed(2) + 'MB');
console.log('  sha256 : ' + sha);
console.log('  →      : ' + BUCKET + ' / ' + objectPath);
console.log('  상품   : ' + productRef);

if (bytes.subarray(0, 5).toString('latin1') !== '%PDF-') {
  console.error('\n★ PDF 가 아닙니다 (헤더 불일치). 중단합니다.');
  process.exit(4);
}

if (DRY) { console.log('\n--dry 라 실제로 올리지 않았습니다.\n'); process.exit(0); }

const db = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });

/* ① 업로드 — 같은 경로가 있으면 덮어씁니다(판본 교체) */
const up = await db.storage.from(BUCKET).upload(objectPath, bytes, {
  contentType: 'application/pdf',
  upsert: true,
});
if (up.error) {
  console.error('\n업로드 실패: ' + up.error.message);
  process.exit(5);
}
console.log('\n① 업로드 완료');

/* 올라간 것이 맞는지 되읽어 확인합니다 — 크기와 해시를 대조합니다 */
const back = await db.storage.from(BUCKET).download(objectPath);
if (back.error) {
  console.error('되읽기 실패: ' + back.error.message);
  process.exit(6);
}
const backBytes = Buffer.from(await back.data.arrayBuffer());
const backSha = createHash('sha256').update(backBytes).digest('hex');
if (backSha !== sha) {
  console.error('★ 올라간 파일이 원본과 다릅니다. 연결하지 않고 중단합니다.');
  console.error('  원본 ' + sha.slice(0, 16) + ' / 저장본 ' + backSha.slice(0, 16));
  process.exit(7);
}
console.log('② 되읽기 확인 — 원본과 바이트 동일');

/* ③ 올라간 것을 확인한 뒤에만 연결합니다 */
const link = await db.from('biz_product_files').upsert({
  product_ref: productRef,
  bucket: BUCKET,
  object_path: objectPath,
  content_type: 'application/pdf',
  byte_size: bytes.length,
  note: 'sha256:' + sha.slice(0, 16),
}, { onConflict: 'product_ref' });
if (link.error) {
  console.error('연결 실패: ' + link.error.code + ' ' + link.error.message);
  process.exit(8);
}
console.log('③ 상품 연결 완료 — ' + productRef + ' → ' + objectPath);

/* ④ 공개로 새지 않는지 마지막 확인 */
const pub = db.storage.from(BUCKET).getPublicUrl(objectPath);
const probe = await fetch(pub.data.publicUrl).catch(() => null);
console.log('④ 공개 주소 접근 : ' + (probe && probe.ok ? '★ 열림 — 확인 필요' : '차단됨 (' + (probe ? probe.status : '실패') + ')'));

console.log('\n완료.\n');
