/**
 * BIZNESTA — 카테고리 공식 slug 체계 (canonical).
 *
 * 왜 필요한가
 *   같은 카테고리를 화면마다 다른 slug 로 부르고 있었다. "기업 · 브랜드" 하나가
 *   PC03/PC04/PC05 에서는 `corporate`, MO03 에서는 `corporate-brand`,
 *   MO03 필터 목록에서는 또 `corporate` 였다. URL 이 갈리면 같은 카테고리인데
 *   다른 페이지처럼 취급되고, 나중에 실제 데이터를 붙일 때 매칭이 되지 않는다.
 *
 * 규칙
 *   · 화면(데이터)에는 CANONICAL 값만 쓴다.
 *   · 과거에 쓰던 값은 ALIAS 로 남겨 두고, /category/[slug] 가 canonical URL 로
 *     넘겨준다. 밖에서 걸어둔 링크나 북마크가 깨지지 않는다.
 *   · 여기 없는 slug 로 들어와도 404 로 만들지 않는다. 상세 화면을 그대로 열고
 *     canonical 로 바꾸지 않는다 (실제 카테고리 데이터가 생기기 전까지의 임시).
 */

export const CATEGORY_SLUGS = [
  'corporate',      // 기업 · 브랜드
  'store',          // 소상공인 · 매장
  'expert',         // 전문가 · 프리랜서
  'landing',        // 랜딩페이지
  'lead-generation',// DB 수집
  'education',      // 교육 · 강의
  'recruiting',     // 채용 · 리크루팅
  'franchise',      // 프랜차이즈
  'portfolio',      // 포트폴리오
  'commerce',       // 쇼핑몰 · 판매
  'reservation',    // 예약
  'membership',     // 회원제
  'webapp',         // 웹앱
  'admin-system',   // 관리자 시스템 포함
  'content',        // 콘텐츠 · 블로그
  'medical',        // 병원 · 의료
  'beauty',         // 뷰티 · 헬스
  'food',           // 음식점 · 카페
  'realestate',     // 부동산 · 분양
  'custom',         // 기타 맞춤
] as const;

export type CategorySlug = (typeof CATEGORY_SLUGS)[number];

/** 과거에 쓰던 값 → 공식 값. 기존 링크가 깨지지 않게 하는 표다. */
export const CATEGORY_ALIAS: Record<string, CategorySlug> = {
  /* MO03 카드 */
  'corporate-brand': 'corporate',
  shop: 'commerce',
  freelancer: 'expert',
  /* MO03 필터 목록 */
  'local-store': 'store',
  professional: 'expert',
  'lead-form': 'lead-generation',
  recruit: 'recruiting',
  booking: 'reservation',
  'with-admin': 'admin-system',
  'content-blog': 'content',
  /* PC03 / PC04 / PC05 */
  lead: 'lead-generation',
  shopping: 'commerce',
  member: 'membership',
  admin: 'admin-system',
  /* MO04 / MO07 필터 */
  etc: 'custom',
};

/** 들어온 slug 를 공식 값으로 바꾼다. 모르는 값은 그대로 돌려준다. */
export function canonicalCategory(slug: string): string {
  if ((CATEGORY_SLUGS as readonly string[]).includes(slug)) return slug;
  return CATEGORY_ALIAS[slug] ?? slug;
}

/** 공식 값으로 바꿔야 하는(=주소를 옮겨야 하는) slug 인지. */
export function needsCategoryRedirect(slug: string): boolean {
  return Boolean(CATEGORY_ALIAS[slug]) && CATEGORY_ALIAS[slug] !== slug;
}
