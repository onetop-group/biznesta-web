/* =====================================================================
   scripts/check-payment-core.mjs — 사본이 '실제로 동작하는가'
   ---------------------------------------------------------------------
   payment-core-vendor.mjs 는 파일이 원본과 같은지만 봅니다(해시).
   이 스크립트는 그 파일들을 **실제로 불러서 계약을 호출**합니다.
   DB 도 Secret 도 Toss 도 필요 없습니다 — 전부 순수 함수입니다.

     node scripts/check-payment-core.mjs
   ===================================================================== */
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const V = path.join(HERE, '..', 'vendor', 'payment-core');
const require_ = createRequire(import.meta.url);
const load = (p) => require_(path.join(V, p));

const R = [];
const t = (name, fn) => {
  try { fn(); R.push([true, name]); }
  catch (e) { R.push([false, name, (e && e.message) || String(e)]); }
};
const ok = (c, m) => { if (!c) throw new Error(m || 'expected truthy'); };
const eq = (a, b, m) => { if (a !== b) throw new Error((m || '다름') + ' → ' + JSON.stringify(a) + ' / ' + JSON.stringify(b)); };

const portContract = load('core/db/port.js');
const adapterContract = load('core/adapter/contract.js');
const storePort = load('biznesta/store-port.js');
const { createBiznestaAdapter } = load('biznesta/adapter.js');
const { createPostgresPort } = load('core/db/postgres-port.js');
const tokenLib = load('biznesta/token.js');

/* DB 를 건드리지 않는 껍데기 store — 계약 검사에만 씁니다 */
const dummyStore = Object.fromEntries(storePort.REQUIRED.map((k) => [k, async () => null]));
const adapter = createBiznestaAdapter({
  store: dummyStore,
  coreDb: { getOrder: async () => null },
  baseUrl: 'https://www.biznesta.com',
});

t('사본을 불러올 수 있다', () => {
  ok(typeof createPostgresPort === 'function', 'createPostgresPort 없음');
  ok(typeof createBiznestaAdapter === 'function', 'createBiznestaAdapter 없음');
});

t('DB Port 계약이 28개 그대로다', () => eq(portContract.REQUIRED.length, 28, '계약 함수 수'));

t('STORE 데이터 계약이 7개 그대로다', () => eq(storePort.REQUIRED.length, 7, '계약 함수 수'));

t('BIZNESTA Adapter 가 CORE 계약을 만족한다', () => {
  const v = adapterContract.validate(adapter);
  ok(v.ok, v.problems.join(' · '));
  eq(adapter.tenant, 'biznesta', 'tenant');
  eq(adapter.orderPrefix, 'BN', 'orderPrefix');
});

t('resolveProduct 에 클라이언트 금액 자리가 없다', () => {
  ok(adapter.resolveProduct.length <= 2, '인자 ' + adapter.resolveProduct.length + '개');
});

t('허용되지 않은 actor 는 연결 전에 거부된다', () => {
  let threw = null;
  try { portContract.assertActor('customer'); } catch (e) { threw = e; }
  ok(threw, 'customer 가 actor 로 통과했다');
});

t('접근 토큰은 256비트이고 해시가 맞는다', () => {
  const a = tokenLib.createAccessToken();
  ok(Buffer.from(a.token, 'base64url').length >= 32, '엔트로피 부족');
  eq(tokenLib.hashToken(a.token), a.tokenHash, '해시 불일치');
  ok(a.token !== a.tokenHash, '원문과 해시가 같다');
});

t('연결 문자열 없이 Port 를 만들면 설명과 함께 거부된다', () => {
  let threw = null;
  try { createPostgresPort({}); } catch (e) { threw = e; }
  ok(threw, '빈 설정으로 Port 가 만들어졌다');
});

const fail = R.filter((r) => !r[0]).length;
console.log('\nPAYMENT CORE 사본 동작 확인');
for (const [good, name, why] of R) {
  console.log('  ' + (good ? 'PASS' : 'FAIL') + '  ' + name + (good ? '' : '\n          ↳ ' + why));
}
console.log('  ── TOTAL ' + R.length + '  PASS ' + (R.length - fail) + '  FAIL ' + fail + '\n');
process.exit(fail ? 1 : 0);
