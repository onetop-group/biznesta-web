/* =====================================================================
   scripts/payment-core-vendor.mjs — PAYMENT CORE 사본 관리
   ---------------------------------------------------------------------
   왜 사본인가

     PAYMENT CORE 는 별도 private 저장소에 있습니다. 그런데 Vercel 은
     이 저장소(web) 밖의 파일을 올리지 않습니다. 그래서
       · `file:../../..` 의존성  → 배포에서 경로가 존재하지 않아 실패합니다
       · git+https private 의존성 → 빌드에 GitHub 토큰이라는 Secret 이 새로 필요합니다
     둘 다 못 씁니다. 남는 방법은 '태그에 고정된 사본' 입니다.

   사본의 위험은 '몰래 달라지는 것' 하나뿐입니다. 그래서 MANIFEST.json 에
   원본의 commit/tag 와 **파일별 sha256** 을 적어 두고, 빌드 전에 매번 맞는지
   확인합니다(prebuild). 한 글자만 달라도 빌드가 멈춥니다.

     node scripts/payment-core-vendor.mjs check          맞는지만 확인 (기본)
     node scripts/payment-core-vendor.mjs sync --from <PAYMENT CORE 경로>
   ===================================================================== */
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const WEB = path.join(HERE, '..');
const DEST = path.join(WEB, 'vendor', 'payment-core');
const MANIFEST = path.join(DEST, 'MANIFEST.json');

/* 사본에 담는 것 — 실행에 필요한 것만. test/ · 문서 · .env 는 담지 않습니다. */
const INCLUDE_DIRS = ['core', 'biznesta'];
const SKIP_NAMES = new Set(['node_modules', '.git']);

const argv = process.argv.slice(2);
const cmd = argv.find((a) => !a.startsWith('--')) || 'check';
const fromArg = (() => {
  const i = argv.indexOf('--from');
  return i >= 0 ? argv[i + 1] : null;
})();

const sha = (buf) => createHash('sha256').update(buf).digest('hex');

function listFiles(root, rel = '') {
  const out = [];
  const dir = path.join(root, rel);
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_NAMES.has(e.name)) continue;
    const r = rel ? rel + '/' + e.name : e.name;
    if (e.isDirectory()) out.push(...listFiles(root, r));
    else out.push(r);
  }
  return out.sort();
}

function gitInfo(dir) {
  const run = (args) => {
    try { return execFileSync('git', args, { cwd: dir, encoding: 'utf8' }).trim(); }
    catch { return ''; }
  };
  return {
    commit: run(['rev-parse', 'HEAD']),
    tag: run(['describe', '--tags', '--exact-match']) || run(['describe', '--tags', '--abbrev=0']),
    dirty: run(['status', '--porcelain']).length > 0,
  };
}

/* ── sync ───────────────────────────────────────────────────────── */
function sync() {
  const src = fromArg ? path.resolve(fromArg)
    : path.resolve(WEB, '..', '..', '..', 'biznesta-payment-core');
  if (!fs.existsSync(path.join(src, 'core', 'index.js'))) {
    console.error('PAYMENT CORE 를 찾지 못했습니다 : ' + src);
    console.error('  --from <경로> 로 알려 주십시오.');
    process.exit(2);
  }
  const info = gitInfo(src);
  if (info.dirty) {
    console.error('★ 원본 저장소에 커밋되지 않은 변경이 있습니다. 먼저 커밋하십시오.');
    process.exit(2);
  }

  fs.rmSync(DEST, { recursive: true, force: true });
  const files = {};
  for (const d of INCLUDE_DIRS) {
    for (const rel of listFiles(path.join(src, d))) {
      const from = path.join(src, d, rel);
      const to = path.join(DEST, d, rel);
      fs.mkdirSync(path.dirname(to), { recursive: true });
      const buf = fs.readFileSync(from);
      fs.writeFileSync(to, buf);
      files[d + '/' + rel] = sha(buf);
    }
  }
  const manifest = {
    note: '자동 생성 사본입니다. 여기서 직접 고치지 마십시오 — 원본 저장소를 고치고 다시 sync 하십시오.',
    source: { repo: 'onetop-group/biznesta-payment-core', commit: info.commit, tag: info.tag },
    dirs: INCLUDE_DIRS,
    generatedAt: new Date().toISOString(),
    files,
  };
  fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + '\n');
  console.log('사본 갱신 : ' + Object.keys(files).length + '개 파일');
  console.log('  원본 : ' + (info.tag || '(태그 없음)') + ' · ' + info.commit.slice(0, 7));
}

/* ── check ──────────────────────────────────────────────────────── */
function check() {
  if (!fs.existsSync(MANIFEST)) {
    console.error('MANIFEST.json 이 없습니다 — 사본이 준비되지 않았습니다.');
    process.exit(1);
  }
  const m = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));
  const expected = m.files || {};
  const actual = {};
  for (const d of m.dirs || INCLUDE_DIRS) {
    for (const rel of listFiles(path.join(DEST, d))) actual[d + '/' + rel] = null;
  }

  const problems = [];
  for (const [f, want] of Object.entries(expected)) {
    const p = path.join(DEST, f);
    if (!fs.existsSync(p)) { problems.push('없어짐 : ' + f); continue; }
    if (sha(fs.readFileSync(p)) !== want) problems.push('내용이 다름 : ' + f);
    delete actual[f];
  }
  for (const f of Object.keys(actual)) problems.push('목록에 없는 파일 : ' + f);

  if (problems.length) {
    console.error('\n★ PAYMENT CORE 사본이 원본과 다릅니다 (' + problems.length + '건)');
    problems.slice(0, 20).forEach((p) => console.error('   - ' + p));
    console.error('\n  사본을 직접 고치지 마십시오. 원본을 고치고 sync 를 다시 하십시오.\n');
    process.exit(1);
  }
  console.log('PAYMENT CORE 사본 확인 : ' + Object.keys(expected).length + '개 파일 일치'
    + ' (원본 ' + (m.source?.tag || '?') + ' · ' + String(m.source?.commit || '').slice(0, 7) + ')');
}

if (cmd === 'sync') sync();
else if (cmd === 'check') check();
else { console.error('알 수 없는 명령 : ' + cmd); process.exit(2); }
