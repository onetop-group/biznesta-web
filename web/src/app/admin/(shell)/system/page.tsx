import { PageHead, Card } from '@/components/admin/ui';
import { supabaseConfigured } from '@/lib/supabase';
import { listStoreProducts } from '@/lib/store/catalog';
import { inspectPaymentCore, paymentConfigured, getPaymentBridge } from '@/lib/store/payment';
import manifest from '@payment/MANIFEST.json';
import styles from './system.module.css';

export const metadata = { title: '시스템 상태' };
export const dynamic = 'force-dynamic';

/**
 * 시스템 상태 — 읽기 전용.
 *
 * 이 화면이 STEP D-1 의 증거다. 여기서 실제로 PAYMENT CORE 사본을 import 하고
 * 계약을 호출하므로, 빌드가 통과했다는 것은 곧 "WEB 서버에서 CORE 를 쓸 수 있다" 는
 * 뜻이 된다. 아무도 import 하지 않는 연결은 증명이 아니다.
 *
 * ★ 값(연결 문자열 · 키)은 한 글자도 보여주지 않는다. '설정됨 / 미설정' 만 말한다.
 */

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className={styles.row}>
      <dt className={styles.dt}>{label}</dt>
      <dd className={styles.dd}>{children}</dd>
    </div>
  );
}

export default async function Page() {
  const core = inspectPaymentCore();
  const payReady = paymentConfigured();

  /* 설정돼 있을 때만 실제로 두드려 본다. 미설정이면 연결 시도 자체를 하지 않는다. */
  let payHealth: string | null = null;
  if (payReady) {
    const bridge = getPaymentBridge();
    if (bridge.configured) {
      const h = await bridge.db.health();
      payHealth = h.ok ? `연결됨 (PostgreSQL ${h.version ?? '?'})` : `실패 (${h.code ?? '?'})`;
    } else {
      payHealth = `연결 불가 (${bridge.reason})`;
    }
  }

  const catalog = await listStoreProducts();
  const fileCount = Object.keys(manifest.files ?? {}).length;

  return (
    <>
      <PageHead title="시스템 상태" desc="연결과 배포 상태를 확인합니다. 값은 표시하지 않고 설정 여부만 봅니다." />

      <Card title="홈페이지 데이터베이스">
        <dl className={styles.rows}>
          <Row label="Supabase 연결 설정">
            {supabaseConfigured()
              ? <span className={styles.ok}>설정됨</span>
              : <span className={styles.bad}>미설정</span>}
          </Row>
          <Row label="STORE 상품 조회">
            {catalog.ok
              ? <><span className={styles.ok}>정상</span> · 판매 중 {catalog.products.length}건</>
              : <span className={styles.bad}>실패 ({catalog.reason})</span>}
          </Row>
        </dl>
      </Card>

      <Card title="PAYMENT CORE 연결">
        <dl className={styles.rows}>
          <Row label="사본 버전">
            {manifest.source?.tag ?? '?'} · {String(manifest.source?.commit ?? '').slice(0, 7)} · {fileCount}개 파일
          </Row>
          <Row label="DB Port 계약">{core.portFunctions}개 함수</Row>
          <Row label="STORE 데이터 계약">{core.storeFunctions}개 함수</Row>
          <Row label="BIZNESTA Adapter">
            {core.adapterOk
              ? <><span className={styles.ok}>계약 충족</span> · tenant {core.tenant} · 주문번호 {core.orderPrefix}-</>
              : <span className={styles.bad}>계약 위반 : {core.adapterProblems.join(' · ')}</span>}
          </Row>
          <Row label="결제 DB 연결">
            {payReady
              ? <span className={payHealth?.startsWith('연결됨') ? styles.ok : styles.bad}>{payHealth}</span>
              : <span className={styles.wait}>미설정 (STORE_DATABASE_URL)</span>}
          </Row>
        </dl>
        <p className={styles.note}>
          결제 DB 연결은 실제 결제를 시작할 때 설정합니다. 지금은 연결하지 않아도 홈페이지와
          STORE 화면이 정상 동작합니다. Toss 는 아직 연결돼 있지 않습니다.
        </p>
      </Card>
    </>
  );
}
