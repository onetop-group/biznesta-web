import Link from 'next/link';
import {
  BRAND, BUSINESS_ADDRESS, BUSINESS_NUMBER, CEO_NAME, COMPANY_NAME,
  CONSULT_EMAIL, CONSULT_PHONE, ECOMMERCE_REGISTRATION_NUMBER,
} from '@/data/business';
import styles from './BusinessInfo.module.css';

/**
 * 최소형 BUSINESS INFO 영역 — 모든 공개 route 의 맨 아래에 붙는다.
 *
 * 전자상거래법이 요구하는 통신판매업자 표시(상호 · 대표자 · 사업자등록번호 ·
 * 통신판매업 신고번호 · 소재지 · 연락처)를 한 곳에 조용히 둔다. 값은 전부
 * `src/data/business.ts` 에서 읽는다 — 여기 다시 적지 않는다.
 *
 * 32개 시안(PC · MOBILE) 바깥, <main> 뒤에 놓이므로 시안의 배치 · 높이에는
 * 아무 영향이 없다. 모바일에서는 시안이 첫 화면(100dvh)을 다 채우고, 이 영역은
 * 그 아래로 스크롤해야 보인다.
 */
export default function BusinessInfo() {
  const rows: { label: string; value: string; href?: string }[] = [
    { label: '상호', value: COMPANY_NAME },
    { label: '대표자', value: CEO_NAME },
    { label: '사업자등록번호', value: BUSINESS_NUMBER },
    { label: '통신판매업 신고번호', value: ECOMMERCE_REGISTRATION_NUMBER },
    { label: '사업장 소재지', value: BUSINESS_ADDRESS },
    { label: '고객센터', value: CONSULT_PHONE, href: `tel:${CONSULT_PHONE.replace(/-/g, '')}` },
    { label: '이메일', value: CONSULT_EMAIL, href: `mailto:${CONSULT_EMAIL}` },
  ];

  return (
    <footer className={styles.wrap} aria-label="사업자 정보">
      <div className={styles.inner}>
        <div className={styles.head}>
          <p className={styles.brand}>
            <span className={styles.eyebrow}>BUSINESS INFO</span>
            <span className={styles.mark}>{BRAND}</span>
          </p>
          <Link href="/privacy" className={styles.link}>개인정보처리방침</Link>
        </div>

        <dl className={styles.rows}>
          {rows.map((r) => (
            <div key={r.label} className={styles.row}>
              <dt className={styles.dt}>{r.label}</dt>
              <dd className={styles.dd}>
                {r.href ? <a href={r.href} className={styles.value}>{r.value}</a> : r.value}
              </dd>
            </div>
          ))}
        </dl>

        <p className={styles.copy}>© {new Date().getFullYear()} {COMPANY_NAME}. All rights reserved.</p>
      </div>
    </footer>
  );
}
