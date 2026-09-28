import 'server-only';
import { IS_PRODUCTION } from '@/lib/site';
import { paymentReadiness } from './payment';

/**
 * BIZNESTA BOOK 이 지금 손님에게 어떻게 보여야 하는가.
 *
 * 세 가지 상태가 있다.
 *   open      정식 오픈. 목록·상세·구매가 모두 열린다.
 *   preview   준비 중이지만 **전체 흐름을 시험할 수 있다**. 화면에 준비 중임을
 *             분명히 띄운다. Preview 배포와 로컬이 여기다.
 *   soon      손님에게는 OPENING SOON 만 보인다. 구매로 이어지는 버튼을
 *             아예 내보내지 않는다 — 결제되는 것처럼 오해할 여지를 없앤다.
 *
 * 판단 기준은 두 개뿐이다.
 *   ① 결제 연결이 준비됐는가 (STORE_DATABASE_URL + Toss 키)
 *   ② 지금이 Production 인가
 *
 * ★ 결제가 준비되지 않았는데 Production 이면 무조건 soon 이다.
 *   "실수로 열려 있는" 경우가 생기지 않도록 기본값이 닫힘 쪽이다.
 */
export type BookStoreMode = 'open' | 'preview' | 'soon';

export function bookStoreMode(): BookStoreMode {
  const { ready } = paymentReadiness();
  if (ready) return 'open';
  return IS_PRODUCTION ? 'soon' : 'preview';
}

/** 구매로 이어지는 버튼을 내보내도 되는가 */
export const canShowBuy = (mode: BookStoreMode) => mode !== 'soon';

/** 실제로 결제까지 갈 수 있는가 */
export const canCheckout = (mode: BookStoreMode) => mode === 'open';

export const BRAND_LABEL = 'BIZNESTA BOOK';
