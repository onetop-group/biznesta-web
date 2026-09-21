import BusinessInfo from './BusinessInfo';
import styles from './Screen.module.css';

/**
 * 하나의 사용자 route 를 PC 시안과 MOBILE 시안으로 나눠 보여준다.
 *
 * 두 시안 모두 자기 폭에 맞춰 스스로 축소되는 stage 라서, 여기서는 어느 쪽을
 * 보여줄지만 고른다. 시안 자체(레이아웃 · 타이포 · 이미지)는 건드리지 않는다.
 * 기준 폭 1024px: 그 아래는 모바일 시안(스테이지가 430px 에서 상한),
 * 그 이상은 PC 시안. /review/* 는 예전처럼 한 화면만 그대로 연다.
 *
 * <main> 으로 감싸 본문 랜드마크를 만든다 (화면에는 아무 변화도 없다).
 * <main> 뒤에 최소형 사업자정보 띠(BusinessInfo)를 붙인다 — 시안 바깥이라
 * 시안의 배치 · 높이에는 영향이 없고, 모바일에서는 첫 화면 아래로 스크롤해야 보인다.
 */
export default function Screen({
  desktop,
  mobile,
}: {
  desktop: React.ReactNode;
  mobile: React.ReactNode;
}) {
  return (
    <>
      <main>
        <div className={styles.desktop}>{desktop}</div>
        <div className={styles.mobile}>{mobile}</div>
      </main>
      <BusinessInfo />
    </>
  );
}
