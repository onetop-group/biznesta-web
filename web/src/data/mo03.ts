/**
 * BN_MO_03_CATEGORY — content.
 *
 * Authored from BN_MO_03_CATEGORY.png (1024 x 1536), not from PC 03's 5x3
 * grid. The mobile artwork shows a 3x3 card grid with a pager underneath,
 * i.e. the first page of the category list — that structure is reproduced as
 * drawn, including the photograph, the icon medallion and the number on each
 * card.
 *
 * TAXONOMY NOTE
 * -------------
 * `TAXONOMY` below is BIZNESTA's canonical 15-category list, kept here so the
 * Admin can drive order / visibility / naming from one place later. The nine
 * `cards` are what the mobile artwork actually publishes on page 1, with the
 * artwork's own wording; they are not a subset of `TAXONOMY` — the two lists
 * were written at different times and have not been reconciled yet, so the
 * artwork's wording is used on screen and the canonical list is only carried
 * as data. Nothing here is a customer reference: no card claims a client, a
 * project count or a result.
 */

/** BIZNESTA's canonical category list — Admin-managed, not yet mapped to the artwork. */
export const TAXONOMY = [
  { order: 1, slug: 'corporate', name: '기업/브랜드형', visible: true },
  { order: 2, slug: 'store', name: '소상공인/매장형', visible: true },
  { order: 3, slug: 'expert', name: '전문가 개인형', visible: true },
  { order: 4, slug: 'landing', name: '랜딩페이지형', visible: true },
  { order: 5, slug: 'lead-generation', name: 'DB 수집형', visible: true },
  { order: 6, slug: 'education', name: '교육형', visible: true },
  { order: 7, slug: 'recruiting', name: '채용/리크루팅형', visible: true },
  { order: 8, slug: 'franchise', name: '프랜차이즈형', visible: true },
  { order: 9, slug: 'portfolio', name: '포트폴리오형', visible: true },
  { order: 10, slug: 'commerce', name: '쇼핑/판매형', visible: true },
  { order: 11, slug: 'reservation', name: '예약형', visible: true },
  { order: 12, slug: 'membership', name: '회원제 웹사이트', visible: true },
  { order: 13, slug: 'webapp', name: '웹앱형', visible: true },
  { order: 14, slug: 'admin-system', name: '관리자 시스템 포함형', visible: true },
  { order: 15, slug: 'content', name: '콘텐츠/블로그형', visible: true },
];

export type CategoryCard = {
  id: number;
  order: number;
  visible: boolean;
  slug: string;
  num: string;
  name: string;
  desc: [string, string];
  thumbnail: { webp: string; jpg: string; alt: string };
};

const art = (n: string, alt: string) => ({
  webp: `/assets/mo03/card-${n}.webp`,
  jpg: `/assets/mo03/card-${n}.jpg`,
  alt,
});

export const mo03 = {
  header: { logo: { src: '/assets/mo03/logo-lockup.png', alt: 'BIZNESTA' }, menuLabel: '메뉴' },

  hero: {
    image: { webp: '/assets/mo03/hero.webp', jpg: '/assets/mo03/hero.jpg', alt: '' },
    /* gold script + BIZNESTA CATEGORY lockup — brand typography, kept as artwork */
    deco: { webp: '/assets/mo03/deco.webp', jpg: '/assets/mo03/deco.jpg', alt: 'Your Business Our Solution — BIZNESTA CATEGORY' },
    eyebrow: '당신의 비즈니스에 꼭 맞는',
    headline: ['홈페이지,', '무엇을 만들어드릴까요?'],
    body: ['비즈네스타는 다양한 업종과 목적에 맞는 홈페이지를', '기획부터 제작, 운영까지 함께합니다.'],
  },

  cards: [
    { id: 1, order: 1, visible: true, slug: 'corporate', num: '01', name: '기업 · 브랜드 홈페이지',
      desc: ['신뢰를 만드는', '프리미엄 홈페이지'] as [string, string], thumbnail: art('01', '유리 외벽의 오피스 빌딩') },
    { id: 2, order: 2, visible: true, slug: 'commerce', num: '02', name: '쇼핑몰 · 온라인 스토어',
      desc: ['판매가 쉬워지는', '맞춤형 쇼핑몰'] as [string, string], thumbnail: art('02', '브랜드 쇼핑백이 놓인 테이블') },
    { id: 3, order: 3, visible: true, slug: 'expert', num: '03', name: '개인 · 프리랜서 홈페이지',
      desc: ['나를 더 특별하게', '보여주는 포트폴리오'] as [string, string], thumbnail: art('03', '노트북이 놓인 개인 작업 공간') },
    { id: 4, order: 4, visible: true, slug: 'education', num: '04', name: '교육 · 강의 홈페이지',
      desc: ['수강생이 모이는', '온라인 클래스'] as [string, string], thumbnail: art('04', '노트와 펜이 놓인 학습 공간') },
    { id: 5, order: 5, visible: true, slug: 'medical', num: '05', name: '병원 · 의료 홈페이지',
      desc: ['신뢰와 전문성을', '담은 홈페이지'] as [string, string], thumbnail: art('05', '밝고 정돈된 진료 공간') },
    { id: 6, order: 6, visible: true, slug: 'food', num: '06', name: '음식점 · 카페 홈페이지',
      desc: ['맛과 감성이 전해지는', '홍보 홈페이지'] as [string, string], thumbnail: art('06', '따뜻한 조명의 카페 내부') },
    { id: 7, order: 7, visible: true, slug: 'realestate', num: '07', name: '부동산 · 분양 홈페이지',
      desc: ['고객이 찾아오는', '분양 · 매물 홈페이지'] as [string, string], thumbnail: art('07', '주거용 건물 외관') },
    { id: 8, order: 8, visible: true, slug: 'beauty', num: '08', name: '뷰티 · 헬스 · 라이프스타일',
      desc: ['감각적인 디자인으로', '브랜드 가치를 높입니다.'] as [string, string], thumbnail: art('08', '뷰티 라이프스타일 연출 컷') },
    { id: 9, order: 9, visible: true, slug: 'custom', num: '09', name: '기타 맞춤형 홈페이지',
      desc: ['당신의 아이디어를', '현실로 만듭니다.'] as [string, string], thumbnail: art('09', '아이디어 노트와 전구가 놓인 책상') },
  ] as CategoryCard[],

  pager: { total: 4, current: 1 },

  band: {
    eyebrow: 'BIZNESTA',
    headline: ['당신의 업종에도,', '더 좋은 홈페이지가 있습니다.'],
    tagline: 'SMALL STEPS, BIG CHANGES',
    cta: { label: '제작 상담하기', href: '/contact?source=category' },
    items: [
      { icon: 'monitor' as const, label: '빠른 상담' },
      { icon: 'doc' as const, label: '맞춤 제안' },
      { icon: 'headset' as const, label: '친절한 안내' },
    ],
  },

  footer: 'BUSINESS TOTAL SOLUTION',
};
