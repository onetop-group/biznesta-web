/**
 * 상품별 이미지 자산 위치.
 *
 * 규칙 하나뿐이다 — `/store-assets/<product_ref>/{cover,detail}.png`.
 * 상품이 늘어나도 같은 규칙으로 파일만 놓으면 된다. DB 에 경로를 또 적지 않는다.
 *
 * ★ 파일은 확정된 원본을 그대로 둔다(바이트 동일). 다시 만들거나 손보지 않는다.
 *   그래서 next/image 로 재인코딩하지 않고 <img> 로 원본을 그대로 내보낸다.
 */

export type ProductAssets = {
  cover: string;
  detail: string;
  /** 상세 이미지의 원본 크기 — 자리를 미리 잡아 레이아웃이 튀지 않게 한다 */
  detailSize: { width: number; height: number };
  coverSize: { width: number; height: number };
};

const ASSETS: Record<string, ProductAssets> = {
  'ebook-customer-db': {
    cover: '/store-assets/ebook-customer-db/cover.png',
    detail: '/store-assets/ebook-customer-db/detail.png',
    coverSize: { width: 1024, height: 1536 },
    detailSize: { width: 1200, height: 5160 },
  },
};

export const assetsFor = (productRef: string): ProductAssets | null =>
  Object.prototype.hasOwnProperty.call(ASSETS, productRef) ? ASSETS[productRef] : null;
