import 'server-only';

/**
 * WEB ↔ PAYMENT CORE 연결 지점.
 *
 * 이 파일이 이 저장소에서 PAYMENT CORE 를 부르는 **유일한 자리**다.
 * 'server-only' 가 맨 위에 있으므로 Client Component 에서 실수로 import 하면
 * 빌드가 깨진다. 결제 연결 문자열이 브라우저로 갈 경로가 구조적으로 없다.
 *
 * 왜 사본(vendor/payment-core)인가
 *   PAYMENT CORE 는 별도 private 저장소다. Vercel 은 이 저장소 밖 파일을 올리지
 *   않으므로 `file:` 의존성은 배포에서 존재하지 않고, git+https private 의존성은
 *   빌드에 GitHub 토큰이라는 Secret 을 새로 요구한다. 그래서 태그에 고정된 사본을
 *   두고 파일별 sha256 으로 매 빌드 전에 원본과 같은지 확인한다
 *   (scripts/payment-core-vendor.mjs · prebuild).
 *
 * 왜 PostgreSQL 직접 연결인가 (service_role + supabase-js 가 아니라)
 *   CORE 의 `withActor(actor, fn)` 는 begin → pay_set_actor → 쓰기 → commit 을
 *   **한 트랜잭션 안에서** 해야 한다. actor 는 set_config(..., true) 로 트랜잭션
 *   지역에만 존재한다. PostgREST(supabase-js)는 여러 문장을 한 트랜잭션으로 묶지
 *   못하므로 이 계약을 지킬 수 없다. 상품 카탈로그처럼 트랜잭션이 필요 없는 읽기는
 *   기존 anon 클라이언트를 그대로 쓴다(src/lib/store/catalog.ts).
 */

const DB_URL_ENV = 'STORE_DATABASE_URL';

export type PaymentBridge =
  | { configured: false; reason: string }
  | { configured: true; db: PaymentPort; store: BizStore; adapter: BizAdapter };

/* 사본의 계약 중 이 앱이 실제로 쓰는 만큼만 타입으로 적는다.
   전체를 다시 적으면 원본과 어긋날 때 조용히 거짓말을 하게 된다. */
type PaymentPort = {
  health(): Promise<{ ok: boolean; code?: string; message?: string; version?: string }>;
  end(): Promise<void>;
  getOrder(tenant: string, orderId: string): Promise<Record<string, unknown> | null>;
};
type BizStore = {
  getProduct(productRef: string): Promise<{
    productRef: string; amount: number; currency: string; name: string; active: boolean;
  } | null>;
  listProducts(opts?: { activeOnly?: boolean }): Promise<Array<{
    productRef: string; amount: number; currency: string; name: string; active: boolean;
  }>>;
};
type BizAdapter = { tenant: string; orderPrefix: string };

/* eslint-disable @typescript-eslint/no-require-imports */
/* 사본은 CommonJS 다. 서버에서만 불리므로 여기서만 require 한다. */
function load() {
  const { createPostgresPort } = require('@payment/core/db/postgres-port');
  const { createBiznestaStore } = require('@payment/biznesta/index');
  return { createPostgresPort, createBiznestaStore };
}
/* eslint-enable @typescript-eslint/no-require-imports */

let cached: PaymentBridge | undefined;

/**
 * 연결이 준비돼 있으면 CORE 를 만들어 돌려주고, 아니면 이유를 돌려준다.
 * ★ 절대 throw 하지 않는다 — 결제 설정이 없다고 홈페이지가 죽으면 안 된다.
 */
export function getPaymentBridge(): PaymentBridge {
  if (cached !== undefined) return cached;

  const url = process.env[DB_URL_ENV];
  if (!url) {
    cached = { configured: false, reason: `${DB_URL_ENV} 미설정` };
    return cached;
  }

  try {
    const { createPostgresPort, createBiznestaStore } = load();
    /* serverless 에서는 인스턴스마다 연결을 아주 적게 잡는다.
       Supabase 는 transaction pooler(6543) 를 쓰는 것을 전제로 한다 —
       CORE 의 actor 는 트랜잭션 지역이라 transaction pooling 과 맞는다. */
    const db = createPostgresPort({
      connectionString: url,
      poolOptions: { max: 1, idleTimeoutMillis: 10_000, connectionTimeoutMillis: 8_000 },
    });
    const built = createBiznestaStore({
      query: (sql: string, params?: unknown[]) => db.__pool.query(sql, params ?? []),
      coreDb: db,
      baseUrl: process.env.SITE_URL ?? 'https://www.biznesta.com',
      /* deliverAccess 는 주지 않는다 — 이메일 발송이 아직 없다.
         주지 않으면 토큰 원문은 만들어진 자리에서 버려지고 해시만 남는다. */
    });
    cached = { configured: true, db, store: built.store, adapter: built.adapter };
  } catch (e) {
    /* 오류 메시지에 연결 문자열이 섞이지 않게 잘라 낸다 */
    const msg = String((e as Error)?.message ?? e).replace(/postgres(ql)?:\/\/\S+/g, '[REDACTED]');
    cached = { configured: false, reason: msg.slice(0, 200) };
  }
  return cached;
}

/** 설정 여부만 알려 준다. 값은 절대 돌려주지 않는다. */
export function paymentConfigured() {
  return Boolean(process.env[DB_URL_ENV]);
}

/**
 * 연결 없이도 확인할 수 있는 것 — 사본이 제대로 로드되고 계약을 지키는가.
 * DB 도 Secret 도 필요 없다. 그래서 STEP D-1 에서 실제로 돌려볼 수 있다.
 */
export function inspectPaymentCore() {
  /* eslint-disable @typescript-eslint/no-require-imports */
  const portContract = require('@payment/core/db/port');
  const adapterContract = require('@payment/core/adapter/contract');
  const storePort = require('@payment/biznesta/store-port');
  const { createBiznestaAdapter } = require('@payment/biznesta/adapter');
  /* eslint-enable @typescript-eslint/no-require-imports */

  /* 계약 검사용 최소 store — DB 를 건드리지 않는다 */
  const dummyStore = Object.fromEntries(
    storePort.REQUIRED.map((k: string) => [k, async () => null]),
  );
  const adapter = createBiznestaAdapter({
    store: dummyStore,
    coreDb: { getOrder: async () => null },
    baseUrl: 'https://www.biznesta.com',
  });
  const v = adapterContract.validate(adapter);

  return {
    portFunctions: portContract.REQUIRED.length as number,
    storeFunctions: storePort.REQUIRED.length as number,
    adapterOk: v.ok as boolean,
    adapterProblems: (v.problems ?? []) as string[],
    tenant: adapter.tenant as string,
    orderPrefix: adapter.orderPrefix as string,
  };
}
