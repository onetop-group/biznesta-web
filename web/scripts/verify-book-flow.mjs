/* =====================================================================
   scripts/verify-book-flow.mjs — BIZNESTA BOOK 결제 흐름 검증
   ---------------------------------------------------------------------
   무엇을 보는가
     이 저장소(WEB)가 PAYMENT CORE 사본을 **실제 PostgreSQL 위에서** 제대로
     부르는지. 주문 생성 → 결제 시도 → 승인 → PAID → 구매 권한 → 접근 토큰
     → 환불 회수까지 한 줄로 돌려 보고, 금액을 조작하면 어디서 막히는지 봅니다.

   하지 않는 것
     · 실제 Toss 호출 0 — fake provider 만 씁니다. 키가 필요 없습니다.
     · 실제 상품 · 실제 구매자 0 — 전부 vfy-web- 접두사 fixture 이고 끝나면 지웁니다.
     · pay_* / biz_* 밖의 표는 읽지도 쓰지도 않습니다.
     · 연결 문자열·토큰 원문을 한 글자도 출력하지 않습니다.

   실행
     node scripts/verify-book-flow.mjs --env-file <PAYCORE_VERIFY_DATABASE_URL 가 적힌 파일>
     node scripts/verify-book-flow.mjs                (BOOK_VERIFY_DATABASE_URL 환경변수)

   옵션
     --keep   fixture 를 지우지 않습니다 (기본은 지웁니다)

   ★ 통과하지 못한 항목은 PASS 로 보고하지 않습니다.
   ===================================================================== */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';

const require = createRequire(import.meta.url);
const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, '..');
const V = (p) => path.join(ROOT, 'vendor', 'payment-core', p);

const ARG = process.argv.slice(2);
const KEEP = ARG.includes('--keep');
const ENV_FILE = (() => {
  const i = ARG.indexOf('--env-file');
  return i >= 0 ? ARG[i + 1] : null;
})();

const TENANT = 'biznesta';
const FIX = 'vfy-web-';
const FIX_PRODUCT = FIX + 'book';
const FIX_EMAIL = 'vfy-web-buyer@example.invalid';
const AMOUNT = 19800;                    /* 실제 전자책과 같은 금액으로 본다 */
const TAMPERED = 1000;                   /* 깎아서 보내 보는 금액 */

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
/* 연결 문자열과 토큰처럼 생긴 것은 어떤 경로로도 화면에 못 나가게 자릅니다 */
const scrub = (s) => String(s)
  .replace(/postgres(ql)?:\/\/\S+/g, '[REDACTED]')
  .replace(/[A-Za-z0-9_-]{40,}/g, '[REDACTED]');

/* ── 연결 문자열 읽기 (값은 출력하지 않습니다) ──────────────── */
function readUrl() {
  if (process.env.BOOK_VERIFY_DATABASE_URL) return process.env.BOOK_VERIFY_DATABASE_URL.trim();
  const candidates = [
    ENV_FILE,
    path.join(ROOT, '..', '..', '..', 'biznesta-payment-core', '.env.verify'),
  ].filter(Boolean);
  for (const f of candidates) {
    if (!fs.existsSync(f)) continue;
    const text = fs.readFileSync(f, 'utf8');
    const m = text.match(/^\s*(?:PAYCORE_VERIFY_DATABASE_URL|BOOK_VERIFY_DATABASE_URL|STORE_DATABASE_URL)\s*=\s*(.*)$/m);
    const v = m ? m[1].trim().replace(/^["']|["']$/g, '') : '';
    if (v) return v;
  }
  return null;
}

/* ── 대상 DB 가 BIZNESTA 인지 교차 확인 ─────────────────────
   다른 프로젝트에 붙었는데 fixture 를 쓰기 시작하면 돌이킬 수 없습니다.
   그래서 '쓰기 전에' 봅니다. (test/target-identify.js 와 같은 신호) */
const EXPECT_TABLES = ['inquiries', 'admin_users', 'projects'];
const FOREIGN = {
  'PURPLE SAJU': { fn: ['assert_brand', 'pg_confirm_payment', 'admin_refund_order_v2'], col: ['report_year', 'birth_profile_id', 'generation_status'] },
  'E-BOOK STUDIO': { tbl: ['ce_books', 'ce_book_chapters', 'ce_content_plans', 'ce_stage_outputs', 'ce_book_assets'] },
};

async function identify(q) {
  const tabs = (await q(`select c.relname from pg_class c join pg_namespace n on n.oid=c.relnamespace
                          where n.nspname='public' and c.relkind='r'`)).map(r => r.relname);
  const missing = EXPECT_TABLES.filter(x => !tabs.includes(x));
  const foreign = [];
  for (const [name, sig] of Object.entries(FOREIGN)) {
    let hit = [];
    if (sig.tbl) hit = hit.concat(sig.tbl.filter(x => tabs.includes(x)));
    if (sig.fn) {
      const f = await q(`select proname from pg_proc p join pg_namespace n on n.oid=p.pronamespace
                          where n.nspname='public' and proname = any($1::text[])`, [sig.fn]);
      hit = hit.concat(f.map(r => r.proname));
    }
    if (sig.col) {
      const c = await q(`select distinct column_name from information_schema.columns
                          where table_schema='public' and column_name = any($1::text[])`, [sig.col]);
      hit = hit.concat(c.map(r => r.column_name));
    }
    if (hit.length) foreign.push(`${name}(${hit.join(',')})`);
  }
  return { tables: tabs.length, missing, foreign };
}

/* ─────────────────────────────────────────────────────────── */
async function main() {
  const url = readUrl();
  if (!url) {
    console.error('연결 문자열을 찾지 못했습니다.');
    console.error('  BOOK_VERIFY_DATABASE_URL 환경변수 또는 --env-file <경로> 가 필요합니다.');
    process.exit(2);
  }

  const { createPostgresPort } = require(V('core/db/postgres-port'));
  const { createBiznestaStore, beginGuestPurchase, checkAccess } = require(V('biznesta/index'));
  const { createFlow } = require(V('core/flow/index'));
  const { createFakeProvider } = require(V('core/provider/fake'));
  const tokenLib = require(V('biznesta/token'));
  /* 운영 코드와 **같은 모듈**을 불러옵니다 (node 24 의 TypeScript 지원).
     여기서 다시 구현하면 '검증한 것' 과 '배포되는 것' 이 달라집니다. */
  const { createTokenHandoff } = await import(
    pathToFileURL(path.join(ROOT, 'src', 'lib', 'book', 'token-handoff.ts')).href
  );

  /* ★ 운영 코드(src/lib/book/payment.ts)와 **같은 방식으로** 조립합니다.
       다른 점은 단 하나 — provider 가 fake 입니다. */
  const db = createPostgresPort({
    connectionString: url,
    poolOptions: { max: 2, idleTimeoutMillis: 10_000, connectionTimeoutMillis: 8_000 },
  });
  const q = async (sql, params) => (await db.__pool.query(sql, params ?? [])).rows;

  /* 승인 hook 이 넘겨 주는 토큰을 받는 자리 — 운영과 같은 모듈을 씁니다 */
  const handoff = createTokenHandoff();
  const delivered = [];

  const built = createBiznestaStore({
    query: (sql, params) => db.__pool.query(sql, params ?? []),
    coreDb: db,
    baseUrl: 'https://verify.invalid',
    deliverAccess: async (x) => { delivered.push(x.orderId); handoff.put(x.orderId, x.token); },
  });

  const provider = createFakeProvider({ method: 'window', mode: 'test' });
  const flow = createFlow({ provider, providerName: 'fake', db, adapter: built.adapter });

  let realProductsBefore = 0;
  let foreignOrdersBefore = 0;

  try {
    /* ═══ 0. 대상 확인 ═══════════════════════════════════════ */
    suite('0 · 대상 DB 확인 (쓰기 전)');
    const id = await identify(q);
    await t('BIZNESTA 홈페이지 DB 다 (inquiries · admin_users · projects)', () => {
      eq(id.missing.length, 0, '없는 표 : ' + id.missing.join(','));
    });
    await t('★ 다른 프로젝트(PURPLE SAJU 등) 흔적 0', () => {
      eq(id.foreign.length, 0, '흔적 : ' + id.foreign.join(' · '));
    });
    if (id.missing.length || id.foreign.length) {
      report();
      console.error('\n대상 확인에 실패했습니다. 아무것도 쓰지 않고 멈춥니다.');
      process.exit(1);
    }

    await t('연결이 살아 있다 (health)', async () => {
      const h = await db.health();
      ok(h.ok, h.code || h.message);
    });

    realProductsBefore = (await q('select count(*)::int n from biz_products where product_ref not like $1', [FIX + '%']))[0].n;
    foreignOrdersBefore = (await q(
      `select count(*)::int n from pay_orders where tenant = $1 and (product_ref is null or product_ref not like $2)`,
      [TENANT, FIX + '%'],
    ))[0].n;

    /* ═══ 1. 사본 · 계약 ═════════════════════════════════════ */
    suite('1 · 사본 조립');
    await t('store 계약 · adapter 계약 모두 통과한 채로 조립됐다', () => {
      eq(built.tenant, TENANT, 'tenant');
      eq(built.orderPrefix, 'BN', 'orderPrefix');
      ok(flow.adapterHooks.includes('onPaid'), 'onPaid hook 이 붙지 않았다');
      ok(flow.adapterHooks.includes('onRefunded'), 'onRefunded hook 이 붙지 않았다');
    });

    /* ═══ 2. 상품 · 금액의 근거 ══════════════════════════════ */
    suite('2 · 금액은 DB 가 정한다');
    await q(`insert into biz_products (product_ref, name, amount, status, kind)
             values ($1,$2,$3,'selling','ebook')
             on conflict (product_ref) do update
               set name = excluded.name, amount = excluded.amount, status = 'selling'`,
      [FIX_PRODUCT, '검증용 전자책', AMOUNT]);

    await t(`상품표의 금액이 ${AMOUNT.toLocaleString('ko-KR')}원이다`, async () => {
      const p = await built.store.getProduct(FIX_PRODUCT);
      ok(p, '상품을 못 읽었다');
      eq(Number(p.amount), AMOUNT, '금액');
      eq(p.currency, 'KRW', '통화');
      eq(p.active, true, '판매중이 아니다');
    });

    await t('★ Adapter 의 가격 조회 함수는 금액 인자를 받지 않는다 (구조적으로 덮어쓸 수 없다)', () => {
      eq(built.adapter.resolveProduct.length, 1, 'resolveProduct 인자 수');
    });

    /* ═══ 3. 주문 ════════════════════════════════════════════ */
    suite('3 · 주문 생성');
    let order = null;

    await t('비회원 구매 시작 → 주문이 PENDING 으로 생긴다', async () => {
      const r = await beginGuestPurchase(flow, built.store, { email: FIX_EMAIL, productRef: FIX_PRODUCT });
      ok(r.ok, r.code);
      order = r.order;
      eq(r.order.status, 'PENDING', '주문 상태');
      eq(Number(r.order.amount), AMOUNT, '주문 금액');
      ok(String(r.order.orderNo).startsWith('BN-'), '주문번호 접두사 : ' + r.order.orderNo);
    });

    await t('주문에 이메일이 들어가 있지 않다 (개인정보는 biz_buyers 에서 멈춘다)', async () => {
      const row = (await q('select user_ref, adapter_meta::text meta from pay_orders where id = $1', [order.id]))[0];
      ok(!String(row.user_ref).includes('@'), 'user_ref 에 이메일이 있다');
      ok(!String(row.meta || '').includes('@'), 'adapter_meta 에 이메일이 있다 : ' + row.meta);
    });

    await t('★ 화면이 금액을 깎아 보내면 주문 생성이 막힌다', async () => {
      const r = await beginGuestPurchase(flow, built.store, {
        email: FIX_EMAIL, productRef: FIX_PRODUCT, amount: TAMPERED,
      });
      eq(r.ok, false, '금액을 깎았는데 주문이 만들어졌다');
      eq(r.code, 'PAY_AMOUNT_MISMATCH', '차단 코드');
    });

    await t('★ 결제 전에는 구매 권한이 없다', async () => {
      const ents = await built.store.getEntitlements(order.id);
      eq(ents.length, 0, '결제도 안 했는데 권한이 있다');
    });

    /* ═══ 4. 결제 시도 ═══════════════════════════════════════ */
    suite('4 · 결제 시도 (prepare)');
    let intent = null;

    await t('prepare → 사업자용 주문번호가 생긴다', async () => {
      const r = await flow.prepare({ tenant: TENANT, orderId: order.id });
      ok(r.ok, r.code);
      ok(r.intent && r.intent.providerOrderId, 'providerOrderId 가 없다');
      eq(Number(r.intent.amount), AMOUNT, '시도 금액');
      intent = r.intent;
    });

    await t('열린 시도를 서버가 다시 읽을 수 있다 (결제창 화면이 쓰는 경로)', async () => {
      const open = await db.getOpenIntent(TENANT, order.id);
      ok(open, '열린 시도가 없다');
      eq(open.provider_order_id, intent.providerOrderId, 'providerOrderId 대조');
    });

    /* ═══ 5. 승인 ════════════════════════════════════════════ */
    suite('5 · 승인 (confirm)');
    const paymentKey = 'vfyweb_' + crypto.randomBytes(9).toString('hex');

    await t('★ 금액을 깎아서 승인 요청하면 막히고, 사업자를 호출조차 하지 않는다', async () => {
      const before = provider.__callCount('confirm');
      const r = await flow.confirm({ tenant: TENANT, orderId: order.id, paymentKey, amount: TAMPERED });
      eq(r.ok, false, '깎인 금액으로 승인됐다');
      eq(r.code, 'PAY_AMOUNT_MISMATCH', '차단 코드');
      eq(provider.__callCount('confirm'), before, '사업자를 호출했다');
      const o = (await q('select status from pay_orders where id = $1', [order.id]))[0];
      eq(o.status, 'PENDING', '막혔는데 주문 상태가 바뀌었다');
    });

    await t(`정상 금액으로 승인 → 주문이 PAID 가 된다`, async () => {
      const r = await flow.confirm({ tenant: TENANT, orderId: order.id, paymentKey, amount: AMOUNT });
      ok(r.ok, r.code);
      eq(r.orderStatus, 'PAID', '주문 상태');
      eq(Number(r.amount), AMOUNT, '승인 금액');
    });

    await t('DB 에도 PAID 로 적혔고 결제 원장이 남았다', async () => {
      const o = (await q('select status, paid_at from pay_orders where id = $1', [order.id]))[0];
      eq(o.status, 'PAID', '주문 상태');
      ok(o.paid_at, 'paid_at 이 비어 있다');
      const rec = await db.getPaymentRecord(TENANT, order.id);
      ok(rec, '결제 원장이 없다');
      eq(Number(rec.amount), AMOUNT, '원장 금액');
    });

    /* ═══ 6. 구매 권한 · 접근 토큰 ═══════════════════════════ */
    suite('6 · 구매 권한과 접근 토큰');

    await t('승인 hook 이 구매 권한을 만들었다', async () => {
      const ents = await built.store.getEntitlements(order.id);
      eq(ents.length, 1, '권한 건수');
      eq(ents[0].product_ref, FIX_PRODUCT, '권한의 상품');
      ok(!ents[0].revoked_at, '만들자마자 회수돼 있다');
    });

    let token = null;
    await t('접근 토큰 원문이 라우트로 **한 번** 넘어온다', async () => {
      eq(delivered.length, 1, 'deliverAccess 호출 수');
      eq(delivered[0], order.id, '다른 주문의 토큰이 왔다');
      token = handoff.take(order.id);
      ok(token, '토큰을 꺼내지 못했다');
      eq(handoff.size(), 0, '꺼낸 뒤에도 메모리에 남아 있다');
    });

    await t('★ 같은 토큰은 두 번 꺼낼 수 없다', () => {
      eq(handoff.take(order.id), null, '두 번째로도 꺼내졌다');
    });

    await t('★ 꺼내 가지 않은 토큰은 시간이 지나면 사라진다', () => {
      let clock = 0;
      const h = createTokenHandoff(1000, () => clock);
      h.put('o1', 'tok');
      clock = 1500;
      eq(h.take('o1'), null, '만료된 토큰이 꺼내졌다');
      eq(h.size(), 0, '만료된 토큰이 남아 있다');
    });

    await t('DB 에는 해시만 저장돼 있다 (원문 0건)', async () => {
      const row = (await q('select token_hash from biz_entitlements where order_id = $1', [order.id]))[0];
      ok(tokenLib.isHash(row.token_hash), '해시 형식이 아니다');
      eq(row.token_hash, tokenLib.hashToken(token), '해시가 토큰과 맞지 않는다');
      const n = (await q('select count(*)::int n from biz_entitlements where token_hash = $1', [token]))[0].n;
      eq(n, 0, '원문이 그대로 저장돼 있다');
    });

    await t('토큰으로 권한을 찾을 수 있다', async () => {
      const row = await checkAccess(built.store, token);
      ok(row, '권한을 못 찾았다');
      eq(row.product_ref, FIX_PRODUCT, '다른 상품의 권한이 나왔다');
      eq(row.order_id, order.id, '다른 주문의 권한이 나왔다');
    });

    await t('★ 틀린 토큰으로는 아무것도 열리지 않는다', async () => {
      const fake = crypto.randomBytes(32).toString('base64url');
      eq(await checkAccess(built.store, fake), null, '남의 토큰이 통했다');
      eq(await checkAccess(built.store, ''), null, '빈 토큰이 통했다');
      eq(await checkAccess(built.store, order.id), null, '주문 id 로 열렸다');
    });

    await t('★ 주문번호만으로는 상품에 접근할 수 없다', async () => {
      eq(await checkAccess(built.store, order.orderNo), null, '주문번호로 열렸다');
    });

    /* ═══ 7. 멱등 ════════════════════════════════════════════ */
    suite('7 · 같은 결제를 두 번 승인해도 안전한가');

    await t('같은 paymentKey 로 다시 승인 → 멱등 처리', async () => {
      const r = await flow.confirm({ tenant: TENANT, orderId: order.id, paymentKey, amount: AMOUNT });
      ok(r.ok, r.code);
      eq(r.idempotent, true, '멱등으로 처리되지 않았다');
    });

    await t('★ 권한도 토큰도 늘어나지 않는다 (토큰 재발급 없음)', async () => {
      const ents = await built.store.getEntitlements(order.id);
      eq(ents.length, 1, '권한이 늘었다');
      eq(delivered.length, 1, '토큰이 다시 발급됐다');
      eq(handoff.size(), 0, '메모리에 토큰이 남아 있다');
    });

    /* ═══ 8. 다운로드 권한 판정 ══════════════════════════════
       ★ 이 함수는 '거부' 를 한 줄도 돌려주지 않는 것으로 표현합니다.
         그래서 0건 검사만 늘어놓으면 함수가 고장나 있어도 전부 통과합니다.
         먼저 '허용되는 경우' 를 만들어 1건이 나오는 것을 확인한 뒤에
         조건을 하나씩 깨뜨립니다. */
    suite('8 · 다운로드 권한은 DB 가 판정한다');
    const hash = tokenLib.hashToken(token);

    await t('파일이 연결되지 않은 상품은 결제했어도 다운로드가 거부된다', async () => {
      const rows = await q('select * from biz_download_authorize($1)', [hash]);
      eq(rows.length, 0, '파일도 없는데 다운로드가 허용됐다');
    });

    await t('파일을 연결하면 허용된다 (0건 검사가 헛돌지 않는다는 증거)', async () => {
      await q(`insert into biz_product_files (product_ref, object_path, note)
               values ($1, $2, '검증용 · 실제 파일 아님')
               on conflict (product_ref) do update set object_path = excluded.object_path`,
        [FIX_PRODUCT, 'vfy-web/not-a-real-file.pdf']);
      const rows = await q('select * from biz_download_authorize($1)', [hash]);
      eq(rows.length, 1, '결제한 구매자인데 다운로드가 거부됐다');
      eq(rows[0].product_ref, FIX_PRODUCT, '다른 상품의 파일이 나왔다');
      eq(rows[0].bucket, 'biznesta-book-private', '버킷');
      ok(!String(rows[0].object_path).startsWith('/'), '경로가 / 로 시작한다');
    });

    await t('★ 틀린 해시로는 다운로드 판정이 통과하지 않는다', async () => {
      const bogus = crypto.createHash('sha256').update('nope').digest('hex');
      eq((await q('select * from biz_download_authorize($1)', [bogus])).length, 0, '아무 해시로나 허용됐다');
      eq((await q('select * from biz_download_authorize($1)', [token])).length, 0, '토큰 원문으로 허용됐다');
      eq((await q('select * from biz_download_authorize($1)', ['not-a-hash'])).length, 0, '형식이 아닌 값으로 허용됐다');
      eq((await q('select * from biz_download_authorize($1)', [null])).length, 0, 'null 로 허용됐다');
    });

    /* ═══ 9. 환불 → 회수 ════════════════════════════════════ */
    suite('9 · 환불하면 권한이 회수된다');

    await t('환불은 관리자만 할 수 있다', async () => {
      const r = await flow.refund({ tenant: TENANT, orderId: order.id, actor: 'system', actorRef: 'vfy' });
      eq(r.ok, false, '관리자가 아닌데 환불됐다');
      eq(r.code, 'PAY_FORBIDDEN_ADMIN_ONLY', '차단 코드');
    });

    await t('관리자 환불 → 주문이 REFUNDED', async () => {
      const r = await flow.refund({
        tenant: TENANT, orderId: order.id, actor: 'admin', actorRef: 'vfy-web', reason: '검증',
      });
      ok(r.ok, r.code);
      eq(r.orderStatus, 'REFUNDED', '주문 상태');
    });

    await t('★ 환불된 주문의 토큰은 더 이상 열리지 않는다', async () => {
      const ents = await built.store.getEntitlements(order.id);
      eq(ents.length, 1, '권한 건수');
      ok(ents[0].revoked_at, '권한이 회수되지 않았다');
      eq(await checkAccess(built.store, token), null, '회수됐는데 토큰이 통한다');
    });

    await t('★ 환불 뒤에는 다운로드 판정도 거부된다 (파일은 그대로 연결돼 있다)', async () => {
      const linked = (await q('select count(*)::int n from biz_product_files where product_ref = $1', [FIX_PRODUCT]))[0].n;
      eq(linked, 1, '파일 연결이 사라져서 거부된 것이라면 이 검사는 의미가 없다');
      eq((await q('select * from biz_download_authorize($1)', [hash])).length, 0, '환불됐는데 허용됐다');
    });

    await t('★ 권한 회수(hook)가 실패했더라도 주문 상태만으로 막힌다', async () => {
      /* 회수 기록을 일부러 되돌려 'hook 이 실패한 상태' 를 만든다.
         그래도 주문이 REFUNDED 이므로 ③ 조건에서 막혀야 한다. */
      await q('update biz_entitlements set revoked_at = null, revoked_reason = null where order_id = $1', [order.id]);
      const ents = await built.store.getEntitlements(order.id);
      eq(ents.length, 1, '권한 건수');
      ok(!ents[0].revoked_at, '회수 기록을 되돌리지 못했다');
      eq((await q('select * from biz_download_authorize($1)', [hash])).length, 0,
        '회수가 안 됐을 때 주문 상태로 막지 못했다');
    });

    /* ═══ 10. 판매중지 상품 ══════════════════════════════════ */
    suite('10 · 판매중지 · 출시예정 상품은 팔리지 않는다');

    for (const [status, label] of [['stopped', '판매중지'], ['coming', '출시예정'], ['draft', '초안']]) {
      await t(`★ ${label} 상품은 주문을 만들 수 없다`, async () => {
        const ref = FIX + status;
        await q(`insert into biz_products (product_ref, name, amount, status, kind)
                 values ($1,$2,$3,$4,'ebook')
                 on conflict (product_ref) do update set status = excluded.status`,
          [ref, `검증용(${label})`, AMOUNT, status]);
        const r = await beginGuestPurchase(flow, built.store, { email: FIX_EMAIL, productRef: ref });
        eq(r.ok, false, `${label} 상품이 팔렸다`);
        ok(['PAY_PRODUCT_NOT_AVAILABLE', 'PAY_PRODUCT_NOT_FOUND'].includes(r.code), '차단 코드 : ' + r.code);
      });
    }

    await t('★ 없는 상품은 주문을 만들 수 없다', async () => {
      const r = await beginGuestPurchase(flow, built.store, { email: FIX_EMAIL, productRef: FIX + 'nope' });
      eq(r.ok, false, '없는 상품이 팔렸다');
      eq(r.code, 'PAY_PRODUCT_NOT_FOUND', '차단 코드');
    });

    /* ═══ 11. 정리 ═══════════════════════════════════════════ */
    suite('11 · 검증 데이터 정리');

    if (!KEEP) {
      await cleanup(q);
      await t('fixture 가 하나도 남지 않았다', async () => {
        const p = (await q('select count(*)::int n from biz_products where product_ref like $1', [FIX + '%']))[0].n;
        const o = (await q('select count(*)::int n from pay_orders where product_ref like $1', [FIX + '%']))[0].n;
        const b = (await q('select count(*)::int n from biz_buyers where email = $1', [FIX_EMAIL]))[0].n;
        eq(p + o + b, 0, `남은 것 : 상품 ${p} · 주문 ${o} · 구매자 ${b}`);
      });
    }

    await t('★ 실제 상품 수가 변하지 않았다', async () => {
      const n = (await q('select count(*)::int n from biz_products where product_ref not like $1', [FIX + '%']))[0].n;
      eq(n, realProductsBefore, '실제 상품 수가 바뀌었다');
    });

    await t('★ fixture 밖의 주문을 건드리지 않았다', async () => {
      const n = (await q(
        `select count(*)::int n from pay_orders where tenant = $1 and (product_ref is null or product_ref not like $2)`,
        [TENANT, FIX + '%'],
      ))[0].n;
      eq(n, foreignOrdersBefore, '다른 주문 수가 바뀌었다');
    });
  } finally {
    try { if (!KEEP) await cleanup(q); } catch { /* 이미 지워졌으면 그만 */ }
    await db.end();
  }

  const good = report();
  console.log('');
  console.log('실제 Toss 호출 : 0 (fake provider)');
  console.log(`사업자 호출 기록 : confirm ${provider.__callCount('confirm')}회 · cancel ${provider.__callCount('cancel')}회`);
  console.log('검증 데이터 : ' + (KEEP ? '--keep 으로 남겨 두었습니다' : '전부 지웠습니다'));
  process.exit(good ? 0 : 1);
}

/* fixture 만 지웁니다. 지우는 순서는 참조 방향의 역순입니다. */
async function cleanup(q) {
  const ids = (await q('select id from pay_orders where product_ref like $1', [FIX + '%'])).map(r => r.id);
  await q('delete from biz_entitlements where product_ref like $1', [FIX + '%']);
  if (ids.length) {
    await q('delete from pay_refund_attempts where order_id = any($1::uuid[])', [ids]).catch(() => {});
    await q('delete from pay_exception_audit where exception_id in (select id from pay_exceptions where order_id = any($1::uuid[]))', [ids]).catch(() => {});
    await q('delete from pay_exceptions where order_id = any($1::uuid[])', [ids]).catch(() => {});
    await q('delete from pay_hook_deliveries where order_id = any($1::uuid[])', [ids]).catch(() => {});
    await q('delete from pay_records where order_id = any($1::uuid[])', [ids]).catch(() => {});
    await q('delete from pay_events where order_id = any($1::uuid[])', [ids]).catch(() => {});
    await q('delete from pay_intents where order_id = any($1::uuid[])', [ids]).catch(() => {});
    await q('delete from pay_orders where id = any($1::uuid[])', [ids]);
  }
  await q('delete from biz_product_files where product_ref like $1', [FIX + '%']).catch(() => {});
  await q('delete from biz_products where product_ref like $1', [FIX + '%']);
  await q('delete from biz_buyers where email = $1', [FIX_EMAIL]);
}

function report() {
  const pass = R.filter(r => r.kind === 't' && r.ok).length;
  const fail = R.filter(r => r.kind === 't' && !r.ok);
  console.log('');
  console.log('═══ BIZNESTA BOOK 결제 흐름 검증 ═══');
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
