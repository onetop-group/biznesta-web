/* =====================================================================
   scripts/verify-book-download.mjs — 전자책 다운로드 E2E 검증
   ---------------------------------------------------------------------
   무엇을 보는가
     실제로 올라간 PDF 가, 실제로 결제한 사람에게만, 만료되는 주소로,
     **원본과 한 바이트도 다르지 않게** 내려가는가.

   어떻게 보는가
     service_role 키는 배포(Vercel)에만 있고 여기에는 없다. 그래서 Signed URL 을
     직접 만들지 않고 **배포된 다운로드 경로를 그대로 통과**한다. 손님이 지나가는
     길과 같은 길이고, 그래서 검증으로서 더 세다.

     다만 그 길에 들어가려면 '결제한 사람' 의 접근 토큰이 있어야 하는데, 토큰
     원문은 DB 에 없다(해시만 있다). 그래서 fake provider 로 검증용 주문을 하나
     만들어 토큰을 받아 쓰고, 끝나면 지운다. 실제 Toss 호출은 0 이다.

   하지 않는 것
     · 실제 Toss 호출 0 · 실제 결제 0
     · 대표가 결제한 실제 주문은 읽기만 하고 건드리지 않는다
     · Public URL 로 바꾸지 않는다 · 버킷 정책을 건드리지 않는다

   실행
     node scripts/verify-book-download.mjs --base <preview 주소>
   옵션
     --keep   검증용 주문을 지우지 않는다
   ===================================================================== */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, '..');
const V = (p) => path.join(ROOT, 'vendor', 'payment-core', p);

const ARG = process.argv.slice(2);
const argOf = (n) => { const i = ARG.indexOf(n); return i >= 0 ? ARG[i + 1] : null; };
const BASE = (argOf('--base') || '').replace(/\/+$/, '');
const KEEP = ARG.includes('--keep');

const TENANT = 'biznesta';
const PRODUCT = 'ebook-customer-db';
const BUCKET = 'biznesta-book-private';
const OBJECT = 'ebook-customer-db/v1.pdf';
const FIX_EMAIL = 'vfy-dl-buyer@example.invalid';
const COOKIE = 'bn_book_access';
/* 원본 PDF. 파일 이름이 바뀌어도 되도록 **내용(sha256)으로** 찾는다 —
   이름으로 찾으면 엉뚱한 PDF 를 원본이라 부르며 통과할 수 있다. */
const SOURCE_DIR = 'C:/Users/원미희/OneDrive/문서/바이브코딩/전자책/전자책 1권 마케팅비용없이';
const SOURCE_SHA256 = '327bb911aa7ec90fafaff61d2060a5e6def61ae0995dab8d11899217faa59906';

/* ── 보고 ──────────────────────────────────────────────────── */
const R = [];
let group = '';
const suite = (n) => { group = n; R.push({ kind: 'suite', name: n }); };
async function t(name, fn) {
  try { await fn(); R.push({ kind: 't', ok: true, name, group }); }
  catch (e) { R.push({ kind: 't', ok: false, name, group, why: scrub((e && e.message) || String(e)) }); }
}
const ok = (c, m) => { if (!c) throw new Error(m || 'expected truthy'); };
const eq = (a, b, m) => {
  if (a !== b) throw new Error(`${m || 'not equal'} → got ${JSON.stringify(a)} want ${JSON.stringify(b)}`);
};
const scrub = (s) => String(s)
  .replace(/postgres(ql)?:\/\/\S+/g, '[REDACTED]')
  .replace(/token=[A-Za-z0-9._-]+/g, 'token=[REDACTED]')
  .replace(/[A-Za-z0-9_-]{40,}/g, '[REDACTED]');

function readUrl() {
  const f = argOf('--env-file')
    || path.join(ROOT, '..', '..', '..', 'biznesta-payment-core', '.env.verify');
  if (!fs.existsSync(f)) return null;
  const m = fs.readFileSync(f, 'utf8')
    .match(/^\s*(?:PAYCORE_VERIFY_DATABASE_URL|BOOK_VERIFY_DATABASE_URL|STORE_DATABASE_URL)\s*=\s*(.*)$/m);
  return m ? m[1].trim().replace(/^["']|["']$/g, '') : null;
}

const sha256 = (buf) => crypto.createHash('sha256').update(buf).digest('hex');

/** 따라가지 않는 fetch — 303 의 Location 을 눈으로 보기 위해서다 */
const hop = (url, opts) => fetch(url, { redirect: 'manual', ...(opts || {}) });

/** Supabase Signed URL 의 token 은 JWT 다. 유효기간을 본문에서 읽는다. */
function jwtPayload(signedUrl) {
  const token = new URL(signedUrl).searchParams.get('token') || '';
  const part = token.split('.')[1];
  if (!part) return null;
  try { return JSON.parse(Buffer.from(part, 'base64url').toString('utf8')); }
  catch { return null; }
}

async function main() {
  if (!BASE) { console.error('--base <preview 주소> 가 필요합니다.'); process.exit(2); }
  const dbUrl = readUrl();
  if (!dbUrl) { console.error('연결 문자열을 찾지 못했습니다.'); process.exit(2); }

  const { createPostgresPort } = require(V('core/db/postgres-port'));
  const { createBiznestaStore, beginGuestPurchase } = require(V('biznesta/index'));
  const { createFlow } = require(V('core/flow/index'));
  const { createFakeProvider } = require(V('core/provider/fake'));
  const tokenLib = require(V('biznesta/token'));

  /* Supabase 프로젝트 주소는 연결 문자열의 사용자 이름(postgres.<ref>)에서 얻는다.
     ★ 비밀값이 아니다 — 브라우저가 쓰는 공개 주소와 같은 값이다. */
  const ref = (new URL(dbUrl).username.split('.')[1] || '').trim();
  const STORAGE = `https://${ref}.supabase.co/storage/v1`;

  const db = createPostgresPort({
    connectionString: dbUrl,
    poolOptions: { max: 2, idleTimeoutMillis: 10_000, connectionTimeoutMillis: 8_000 },
  });
  const q = async (sql, params) => (await db.__pool.query(sql, params ?? [])).rows;

  let token = null;
  const built = createBiznestaStore({
    query: (sql, params) => db.__pool.query(sql, params ?? []),
    coreDb: db,
    baseUrl: BASE,
    deliverAccess: async (x) => { token = x.token; },
  });
  const provider = createFakeProvider({ method: 'widget', mode: 'test' });
  const flow = createFlow({ provider, providerName: 'fake', db, adapter: built.adapter });

  let order = null;
  let signed = null;

  /* 폴더에서 sha256 이 맞는 PDF 를 찾는다. 없으면 원본이 없는 것이므로 멈춘다. */
  let source = null;
  let sourceName = null;
  for (const n of fs.readdirSync(SOURCE_DIR)) {
    if (!n.toLowerCase().endsWith('.pdf')) continue;
    const buf = fs.readFileSync(path.join(SOURCE_DIR, n));
    if (sha256(buf) === SOURCE_SHA256) { source = buf; sourceName = n; break; }
  }
  if (!source) {
    console.error('원본 PDF 를 찾지 못했습니다 (sha256 ' + SOURCE_SHA256.slice(0, 16) + '…).');
    await db.end();
    process.exit(2);
  }
  const sourceHash = SOURCE_SHA256;

  try {
    /* ═══ 1. 올라간 파일 ═════════════════════════════════════ */
    suite('1 · 올라간 파일');
    const [obj] = await q(
      `select name, (metadata->>'size')::bigint size, metadata->>'mimetype' mime
         from storage.objects where bucket_id = $1 and name = $2`, [BUCKET, OBJECT]);

    await t('비공개 버킷에 파일이 올라가 있다', () => {
      ok(obj, `${BUCKET}/${OBJECT} 가 없다`);
    });
    if (!obj) { report(); process.exit(1); }

    await t('크기가 원본과 같다', () => eq(Number(obj.size), source.length, '바이트'));
    await t('형식이 application/pdf 다', () => eq(obj.mime, 'application/pdf', 'mimetype'));
    await t('★ 버킷이 여전히 비공개다', async () => {
      const [b] = await q('select public from storage.buckets where id = $1', [BUCKET]);
      eq(b.public, false, '버킷이 공개로 바뀌었다');
    });
    await t('★ storage.objects 에 공개 정책이 하나도 없다', async () => {
      const n = (await q(`select count(*)::int n from pg_policy p
                            join pg_class c on c.oid = p.polrelid
                            join pg_namespace s on s.oid = c.relnamespace
                           where s.nspname = 'storage' and c.relname = 'objects'`))[0].n;
      eq(n, 0, '정책이 생겼다');
    });

    /* ═══ 2. 상품 연결 ═══════════════════════════════════════ */
    suite('2 · 상품 ↔ 파일 연결');
    await t('연결이 1건이고 이 상품을 가리킨다', async () => {
      const rows = await q('select * from biz_product_files where product_ref = $1', [PRODUCT]);
      eq(rows.length, 1, '연결 수');
      eq(rows[0].bucket, BUCKET, '버킷');
      eq(rows[0].object_path, OBJECT, '경로');
      eq(rows[0].content_type, 'application/pdf', '형식');
    });
    await t('화면이 묻는 준비 여부가 true 다', async () => {
      const [r] = await q('select biz_product_file_ready($1) as ready', [PRODUCT]);
      eq(r.ready, true, 'file_ready');
    });

    /* ═══ 3. 검증용 구매자 만들기 ════════════════════════════ */
    suite('3 · 검증용 구매 (실 Toss 호출 0)');
    await t('결제 → PAID → 권한 → 토큰까지 한 번에 간다', async () => {
      const r = await beginGuestPurchase(flow, built.store, { email: FIX_EMAIL, productRef: PRODUCT });
      ok(r.ok, r.code);
      order = r.order;
      const prep = await flow.prepare({ tenant: TENANT, orderId: order.id });
      ok(prep.ok, prep.code);
      const key = 'vfydl_' + crypto.randomBytes(8).toString('hex');
      const c = await flow.confirm({ tenant: TENANT, orderId: order.id, paymentKey: key, amount: Number(order.amount) });
      ok(c.ok, c.code);
      eq(c.orderStatus, 'PAID', '주문 상태');
      ok(token, '접근 토큰을 받지 못했다');
    });

    /* ═══ 3-b. 구매 완료 화면 ════════════════════════════════ */
    suite('3-b · 구매자가 보는 완료 화면');
    await t('★ 구매자에게는 다운로드 버튼이 보인다', async () => {
      const r = await fetch(`${BASE}/book/${PRODUCT}/complete`, { headers: { cookie: `${COOKIE}=${token}` } });
      const html = await r.text();
      ok(html.includes(`/book/${PRODUCT}/download`), '다운로드 링크가 없다');
      ok(html.includes('전자책 다운로드'), '버튼 문구가 없다');
      ok(!html.includes('준비 중'), '아직 준비 중이라고 말하고 있다');
    });
    await t('★ 권한이 없으면 버튼이 없고, 기다리라고 하지 않는다', async () => {
      const r = await fetch(`${BASE}/book/${PRODUCT}/complete`);
      const html = await r.text();
      ok(!html.includes(`href="/book/${PRODUCT}/download"`), '권한 없이 다운로드 링크가 나온다');
      ok(html.includes('구매 내역을 확인할 수 없습니다'), '할 수 있는 일을 알려 주지 않는다');
      ok(!html.includes('잠시 후 이 화면에서'), '영원히 기다리라고 말하고 있다');
    });

    /* ═══ 4. 실제 다운로드 ═══════════════════════════════════ */
    suite('4 · 실제 다운로드 (배포된 경로 그대로)');
    await t('구매자는 만료형 주소로 넘겨받는다', async () => {
      const r = await hop(`${BASE}/book/${PRODUCT}/download`, { headers: { cookie: `${COOKIE}=${token}` } });
      eq(r.status, 303, 'HTTP 상태');
      const loc = r.headers.get('location') || '';
      ok(loc.startsWith(STORAGE), '우리 Storage 주소가 아니다');
      ok(loc.includes('/object/sign/'), '서명 주소가 아니다 : ' + loc.split('?')[0]);
      ok(!loc.includes('/object/public/'), '★ 공개 주소로 넘겨줬다');
      signed = loc;
    });

    await t('★ 중간에 기록이 남지 않게 헤더가 붙는다', async () => {
      const r = await hop(`${BASE}/book/${PRODUCT}/download`, { headers: { cookie: `${COOKIE}=${token}` } });
      ok((r.headers.get('cache-control') || '').includes('no-store'), 'no-store 가 없다');
      eq(r.headers.get('referrer-policy'), 'no-referrer', 'Referrer-Policy');
    });

    await t('★★ 받은 파일이 원본과 한 바이트도 다르지 않다', async () => {
      const r = await fetch(signed);
      eq(r.status, 200, '다운로드 HTTP 상태');
      const got = Buffer.from(await r.arrayBuffer());
      eq(got.length, source.length, '바이트 수');
      eq(sha256(got), sourceHash, 'sha256');
    });

    await t('내려받는 파일 형식이 PDF 다', async () => {
      const r = await fetch(signed);
      const ct = r.headers.get('content-type') || '';
      ok(ct.includes('pdf') || ct.includes('octet-stream'), 'content-type : ' + ct);
    });

    /* ═══ 5. 만료 ════════════════════════════════════════════ */
    suite('5 · 주소는 만료된다');
    await t('서명 주소의 유효기간이 10분이다', () => {
      const p = jwtPayload(signed);
      ok(p && p.exp && p.iat, '서명 본문을 읽지 못했다');
      const ttl = p.exp - p.iat;
      ok(ttl > 0 && ttl <= 900, '유효기간이 너무 길다 : ' + ttl + '초');
      eq(ttl, 600, '유효기간(초)');
    });
    await t('★ 서명을 한 글자라도 고치면 열리지 않는다', async () => {
      const u = new URL(signed);
      const tk = u.searchParams.get('token');
      u.searchParams.set('token', tk.slice(0, -2) + (tk.endsWith('A') ? 'BB' : 'AA'));
      const r = await fetch(u.toString());
      ok(r.status >= 400, '고친 서명으로 열렸다 : ' + r.status);
    });
    await t('★ 매번 새 주소가 나온다 (주소를 저장해 두지 않는다)', async () => {
      const r = await hop(`${BASE}/book/${PRODUCT}/download`, { headers: { cookie: `${COOKIE}=${token}` } });
      const loc = r.headers.get('location') || '';
      ok(loc !== signed, '같은 주소가 다시 나왔다');
    });

    /* ═══ 6. 직접 접근 ═══════════════════════════════════════ */
    suite('6 · 직접 접근은 막힌다');
    await t('★ 공개 주소로는 받을 수 없다', async () => {
      const r = await fetch(`${STORAGE}/object/public/${BUCKET}/${OBJECT}`);
      ok(r.status >= 400, '공개 주소가 열렸다 : ' + r.status);
    });
    await t('★ 서명 없이 object 주소로는 받을 수 없다', async () => {
      const r = await fetch(`${STORAGE}/object/${BUCKET}/${OBJECT}`);
      ok(r.status >= 400, '서명 없이 열렸다 : ' + r.status);
    });
    await t('★ 서명 주소에서 token 만 떼면 열리지 않는다', async () => {
      const u = new URL(signed);
      u.searchParams.delete('token');
      const r = await fetch(u.toString());
      ok(r.status >= 400, 'token 없이 열렸다 : ' + r.status);
    });

    /* ═══ 7. 권한 없는 접근 ══════════════════════════════════ */
    suite('7 · 권한 없는 접근은 막힌다');
    await t('쿠키가 없으면 거부', async () => {
      const r = await hop(`${BASE}/book/${PRODUCT}/download`);
      eq(r.status, 303, 'HTTP 상태');
      ok((r.headers.get('location') || '').includes('dl=no_access'), '거부되지 않았다');
    });
    await t('★ 아무 토큰이나 만들어 넣으면 거부', async () => {
      const fake = crypto.randomBytes(32).toString('base64url');
      const r = await hop(`${BASE}/book/${PRODUCT}/download`, { headers: { cookie: `${COOKIE}=${fake}` } });
      const loc = r.headers.get('location') || '';
      ok(loc.includes('dl=denied') || loc.includes('dl=no_access'), '거부되지 않았다 : ' + loc);
    });
    await t('★ 주문번호를 토큰 자리에 넣어도 거부', async () => {
      const r = await hop(`${BASE}/book/${PRODUCT}/download`, { headers: { cookie: `${COOKIE}=${order.orderNo}` } });
      ok((r.headers.get('location') || '').includes('dl=denied'), '주문번호로 열렸다');
    });
    await t('★ 다른 상품 주소로는 이 권한을 쓸 수 없다', async () => {
      const r = await hop(`${BASE}/book/vfy-dl-other/download`, { headers: { cookie: `${COOKIE}=${token}` } });
      const loc = r.headers.get('location') || '';
      ok(loc.includes('dl=denied'), '다른 상품으로 받아졌다 : ' + loc);
    });

    /* ═══ 8. 환불 · 회수 ═════════════════════════════════════ */
    suite('8 · 환불하면 끊긴다');
    await t('관리자 환불 → 주문 REFUNDED', async () => {
      const r = await flow.refund({
        tenant: TENANT, orderId: order.id, actor: 'admin', actorRef: 'vfy-download', reason: '검증',
      });
      ok(r.ok, r.code);
      eq(r.orderStatus, 'REFUNDED', '주문 상태');
    });
    await t('★ 같은 토큰으로 더 이상 받을 수 없다', async () => {
      const r = await hop(`${BASE}/book/${PRODUCT}/download`, { headers: { cookie: `${COOKIE}=${token}` } });
      ok((r.headers.get('location') || '').includes('dl=denied'), '환불 뒤에도 받아졌다');
    });
    await t('★ 회수 기록이 지워져도 주문 상태만으로 막힌다 (두 겹)', async () => {
      await q('update biz_entitlements set revoked_at = null, revoked_reason = null where order_id = $1', [order.id]);
      const r = await hop(`${BASE}/book/${PRODUCT}/download`, { headers: { cookie: `${COOKIE}=${token}` } });
      ok((r.headers.get('location') || '').includes('dl=denied'), '주문 상태로 막지 못했다');
    });
    await t('이미 발급된 주소도 오래 살아 있지 않다', () => {
      const p = jwtPayload(signed);
      ok(p.exp * 1000 - Date.now() <= 600_000, '남은 시간이 10분을 넘는다');
    });

    /* ═══ 9. 대표님 주문은 그대로 ════════════════════════════ */
    suite('9 · 실제 결제 주문은 건드리지 않았다');
    await t('BN-261004-AYPJ2T 가 PAID · 권한 1건 그대로다', async () => {
      const [o] = await q(`select status from pay_orders where order_no = 'BN-261004-AYPJ2T'`);
      ok(o, '주문이 사라졌다');
      eq(o.status, 'PAID', '주문 상태');
      const [e] = await q(`select count(*)::int n from biz_entitlements
                            where order_id = (select id from pay_orders where order_no = 'BN-261004-AYPJ2T')
                              and revoked_at is null`);
      eq(e.n, 1, '살아 있는 권한 수');
    });
  } finally {
    if (!KEEP && order) {
      try {
        await q('delete from biz_entitlements where order_id = $1', [order.id]);
        for (const tbl of ['pay_refund_attempts', 'pay_hook_deliveries', 'pay_records', 'pay_events', 'pay_intents']) {
          await q(`delete from ${tbl} where order_id = $1`, [order.id]).catch(() => {});
        }
        await q('delete from pay_exceptions where order_id = $1', [order.id]).catch(() => {});
        await q('delete from pay_orders where id = $1', [order.id]);
        await q('delete from biz_buyers where email = $1', [FIX_EMAIL]);
      } catch { /* 이미 지워졌으면 그만 */ }
    }
    await db.end();
  }

  const good = report();
  console.log('');
  console.log('원본 PDF  : ' + sourceName + ' · ' + source.length + '바이트 · sha256 ' + sourceHash.slice(0, 16) + '…');
  console.log('실제 Toss 호출 : 0 (fake provider)');
  console.log('검증용 주문 : ' + (KEEP ? '--keep 으로 남겼습니다' : '지웠습니다'));
  process.exit(good ? 0 : 1);
}

function report() {
  const pass = R.filter(r => r.kind === 't' && r.ok).length;
  const fail = R.filter(r => r.kind === 't' && !r.ok);
  console.log('');
  console.log('═══ BIZNESTA BOOK 다운로드 E2E ═══');
  for (const r of R) {
    if (r.kind === 'suite') { console.log(''); console.log('[ ' + r.name + ' ]'); continue; }
    console.log('  ' + (r.ok ? '✓' : '✗') + ' ' + r.name + (r.ok ? '' : '\n      → ' + r.why));
  }
  console.log('');
  console.log(`  통과 ${pass} · 실패 ${fail.length}`);
  return fail.length === 0;
}

main().catch((e) => {
  console.error('VERIFY ERROR : ' + scrub((e && e.stack) || e));
  process.exit(2);
});
