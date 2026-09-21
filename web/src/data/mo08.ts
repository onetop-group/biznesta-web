/**
 * BN_MO_08_SIGNATURE — content.
 *
 * Authored from BN_MO_08_SIGNATURE.png (1024 x 1536), not from PC 08.
 * This screen answers "what is different when BIZNESTA builds it" — not
 * "who we are" — so the four capability columns, the navy positioning band
 * and the signature design row carry the argument, in the artwork's own
 * composition.
 *
 * ORGANISATION WORDING
 * --------------------
 * Nothing here claims a 운영팀 / 직영팀 / 전담팀 / 개발팀, a headcount or an
 * office. The permitted framing is used instead: 디자인부터 개발까지 통합 제작,
 * 비즈니스에 맞춘 맞춤 설계, 제작 이후 직접 운영할 수 있는 구조.
 *
 * NO PERFORMANCE METRICS
 * ----------------------
 * No 98% / 100+ / 300+ / 문의 2배 / 매출 +30% / 전환율 / 만족도 / 성공률 appears
 * on this screen, in the artwork or in this file.
 *
 * TESTIMONIAL REMOVED
 * -------------------
 * The artwork closed with a customer quote attributed to "— 실제 고객 후기 —",
 * beside a gold "Real Review" script. BIZNESTA has no verified customer
 * review to publish, so the block keeps its exact slot, ivory panel, quote
 * marks, photograph and type scale, but now carries BIZNESTA's own
 * positioning statement, attributed to BIZNESTA and labelled "Our Promise".
 */

export type SignatureDesign = {
  id: number;
  order: number;
  visible: boolean;
  slug: string;
  kind: 'sample' | 'concept' | 'client';
  name: string;
  note: string;
  image: { webp: string; jpg: string; alt: string };
};

const thumb = (n: number, alt: string) => ({
  webp: `/assets/mo08/thumb-0${n}.webp`,
  jpg: `/assets/mo08/thumb-0${n}.jpg`,
  alt,
});

export const mo08 = {
  header: { logo: { src: '/assets/mo08/logo-lockup.png', alt: 'BIZNESTA' }, menuLabel: '메뉴' },

  hero: {
    image: {
      webp: '/assets/mo08/hero.webp', jpg: '/assets/mo08/hero.jpg',
      alt: 'Good Business Better Tomorrow 문구가 놓인 노트북과 BRAND · WEBSITE · MARKETING 서적',
    },
    eyebrow: 'BIZNESTA SIGNATURE',
    headline: ['비즈네스타가', '만드는 특별함'],
    body: ['단순한 홈페이지가 아닙니다.', '당신의 비즈니스가 성장하는', '실질적인 변화를 만듭니다.'],
    aside: { lines: ['당신의', '가능성을 디자인하는', '비즈니스 파트너,', '비즈네스타'], label: ['BIZNESTA', 'SIGNATURE'] },
  },

  features: [
    { id: 1, order: 1, visible: true, icon: 'diamond' as const, title: '전략이 다른 기획',
      sub: ['업종과 목적에 맞는', '맞춤 전략 설계'] as [string, string] },
    { id: 2, order: 2, visible: true, icon: 'pen' as const, title: '감각적인 디자인',
      sub: ['브랜드 가치를 높이는', '프리미엄 디자인'] as [string, string] },
    { id: 3, order: 3, visible: true, icon: 'monitor' as const, title: '실용적인 기능',
      sub: ['운영까지 고려한', '스마트한 솔루션'] as [string, string] },
    { id: 4, order: 4, visible: true, icon: 'bars' as const, title: '지속적인 파트너십',
      sub: ['제작 후에도', '함께 성장하는 지원'] as [string, string] },
  ],

  band: {
    image: { webp: '/assets/mo08/band-left.webp', jpg: '/assets/mo08/band-left.jpg',
             alt: 'More Than a Website' },
    lines: ['비즈네스타는', '지금보다 더 큰 가능성을 만드는', '비즈니스 파트너입니다.'],
    label: 'BIZNESTA SIGNATURE',
    checks: [
      '당신의 비즈니스를 이해합니다.',
      '최적의 솔루션을 제안합니다.',
      '결과로 이어지는 홈페이지를 만듭니다.',
    ],
  },

  signature: {
    title: '비즈네스타만의 시그니처 디자인',
    /* the artwork said "제작 사례 더보기" — these are samples, not commissions */
    more: { label: '디자인 샘플 더보기', href: '/design' },
    items: [
      { id: 1, order: 1, visible: true, slug: 'corporate', kind: 'sample' as const,
        name: '기업 · 브랜드', note: '신뢰를 더하는 디자인', image: thumb(1, '기업 · 브랜드 홈페이지 디자인 샘플') },
      { id: 2, order: 2, visible: true, slug: 'shop', kind: 'sample' as const,
        name: '쇼핑몰', note: '감각적인 브랜드 경험', image: thumb(2, '쇼핑몰 디자인 샘플') },
      { id: 3, order: 3, visible: true, slug: 'education', kind: 'sample' as const,
        name: '교육 · 강의', note: '배움이 더 특별해지는 공간', image: thumb(3, '교육 · 강의 홈페이지 디자인 샘플') },
      { id: 4, order: 4, visible: true, slug: 'medical', kind: 'sample' as const,
        name: '병원 · 의료', note: '신뢰가 느껴지는 디자인', image: thumb(4, '병원 · 의료 홈페이지 디자인 샘플') },
      { id: 5, order: 5, visible: true, slug: 'food', kind: 'sample' as const,
        name: '음식점 · 카페', note: '감성이 머무는 공간', image: thumb(5, '음식점 · 카페 홈페이지 디자인 샘플') },
    ] as SignatureDesign[],
  },

  /* replaces the artwork's customer testimonial — see the file header */
  promise: {
    label: 'Our Promise',
    quote: ['예쁜 홈페이지가 끝이 아닙니다.', '실제로 운영할 수 있는 홈페이지를 만듭니다.'],
    by: '— 비즈네스타의 약속 —',
    image: { webp: '/assets/mo08/quote-img.webp', jpg: '/assets/mo08/quote-img.jpg', alt: '' },
  },

  cta: { label: '지금, 당신의 비즈니스를 디자인하세요', href: '/contact?source=portfolio' },

  support: [
    { icon: 'chat' as const, label: '빠른 상담' },
    { icon: 'doc' as const, label: '맞춤 제안' },
    { icon: 'people' as const, label: '전문가 1:1 상담' },
  ],
};
