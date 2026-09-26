/* =====================================================================
   scripts/check-client-bundle.mjs — 브라우저로 나가는 것에 Secret 이 없는가
   ---------------------------------------------------------------------
   "server-only 를 붙였으니 괜찮다" 는 주장입니다. 이 스크립트는 그 주장을
   빌드 결과물로 확인합니다.

   보는 곳 (전부 브라우저가 실제로 받는 것)
     .next/static/**            client 번들
     .next/server/app/**.html   미리 만들어진 HTML
     .next/server/app/**.rsc    RSC payload

   찾는 것
     1) .env.local 에 들어 있는 '실제 값' 자체  ★ 값은 절대 출력하지 않습니다
     2) PostgreSQL 연결 문자열 모양
     3) 서버 전용이어야 할 이름들 (결제 CORE 내부 · service_role 등)

     node scripts/check-client-bundle.mjs
   ===================================================================== */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const WEB = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const NEXT = path.join(WEB, '.next');

if (!fs.existsSync(NEXT)) {
  console.error('.next 가 없습니다 — 먼저 npm run build 를 하십시오.');
  process.exit(2);
}

/* ── 1. 검사 대상 파일 모으기 ─────────────────────────────────── */
function walk(dir, test, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, test, out);
    else if (test(e.name)) out.push(p);
  }
  return out;
}

const targets = [
  ...walk(path.join(NEXT, 'static'), (n) => /\.(js|mjs|css|json|txt)$/.test(n)),
  ...walk(path.join(NEXT, 'server', 'app'), (n) => /\.(html|rsc|json)$/.test(n)),
];

/* ── 2. .env.local 의 실제 값 (이름만 기억하고 값은 비교에만 씁니다) ── */
const secrets = [];
const envFile = path.join(WEB, '.env.local');
if (fs.existsSync(envFile)) {
  for (const line of fs.readFileSync(envFile, 'utf8').split(/\r?\n/)) {
    const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*)$/.exec(line);
    if (!m) continue;
    const name = m[1];
    const value = m[2].trim().replace(/^["']|["']$/g, '');
    if (value.length < 12) continue;                  /* 너무 짧으면 오탐 */
    if (name.startsWith('NEXT_PUBLIC_')) continue;    /* 공개용으로 선언된 값 */
    secrets.push({ name, value });
  }
}

/* ── 3. 이름 규칙 — 서버에만 있어야 하는 것들 ─────────────────── */
const FORBIDDEN = [
  ['PostgreSQL 연결 문자열', /postgres(ql)?:\/\/[^\s"'`]+/],
  ['service_role 키 이름', /service_role/],
  ['결제 DB 연결 ENV 이름', /STORE_DATABASE_URL/],
  ['CORE DB Port 내부', /createPostgresPort|pay_set_actor|withActor/],
  ['STORE 쓰기 진입점', /biz_entitlement_grant|biz_buyer_upsert/],
  ['pg 드라이버', /require\(["']pg["']\)/],
];

let bad = 0;
const hitFiles = new Set();

for (const f of targets) {
  let src;
  try { src = fs.readFileSync(f, 'utf8'); } catch { continue; }
  const rel = path.relative(WEB, f);

  for (const s of secrets) {
    if (src.includes(s.value)) {
      console.error('  ★ ' + s.name + ' 의 값이 브라우저 파일에 들어 있습니다 : ' + rel);
      bad++; hitFiles.add(rel);
    }
  }
  for (const [label, re] of FORBIDDEN) {
    if (re.test(src)) {
      console.error('  ★ ' + label + ' 가 브라우저 파일에 있습니다 : ' + rel);
      bad++; hitFiles.add(rel);
    }
  }
}

console.log('  검사한 브라우저 파일 : ' + targets.length);
console.log('  .env.local 의 비공개 값 : ' + secrets.length + '개 (이름만 셌습니다)');
console.log('  유출 : ' + bad + (bad ? '  ★ 배포하지 마십시오' : ' 건'));

if (!targets.length) {
  console.error('\n검사 대상이 0건입니다 — 빌드 결과를 못 찾았습니다.');
  process.exit(2);
}
if (!secrets.length) {
  console.log('  참고 : .env.local 에 비공개 값이 없어 (1) 항목은 확인하지 못했습니다.');
}
process.exit(bad ? 1 : 0);
