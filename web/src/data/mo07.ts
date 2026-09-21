import type { ShowroomCategoryId } from '@/data/showroom';

/**
 * BN_MO_07_NEW_DESIGN — content.
 *
 * Authored from BN_MO_07_NEW_DESIGN.png (1024 x 1536), not from PC 07.
 * A design-studio "new work" release, not a recent-posts feed: a large phone
 * carrying the newest design, a filter row, then a 2x3 editorial gallery in
 * which every card shows a real website artwork on desktop + phone mockups.
 *
 * SAMPLE POLICY
 * -------------
 * Every design here is a BIZNESTA sample, so the badge reads NEW (design),
 * never "NEW CLIENT PROJECT", "CLIENT WORK" or "SUCCESS CASE", and `kind`
 * records the distinction. No customer is named anywhere on this screen.
 *
 * FUTURE ADMIN
 * ------------
 * `newDesign`, `publishedAt`, `order` and `visible` are already separated so
 * the Admin can publish a new design into this row later. Nothing on screen
 * has been simplified for that: the artwork is reproduced as drawn.
 */

export type NewDesignItem = {
  id: number;
  order: number;
  visible: boolean;
  slug: string;
  kind: 'sample' | 'concept' | 'client';
  /** drives the bronze NEW badge */
  newDesign: boolean;
  publishedAt: string;
  caption: string;
  category: string;
  /** 공식 카테고리 id (src/data/showroom.ts). 없으면 전체 보기로 간다. */
  categoryId?: ShowroomCategoryId;
  artwork: { webp: string; jpg: string; alt: string };
};

const art = (n: number, alt: string) => ({
  webp: `/assets/mo07/art-0${n}.webp`,
  jpg: `/assets/mo07/art-0${n}.jpg`,
  alt,
});

export const mo07 = {
  header: { logo: { src: '/assets/mo07/logo-lockup.png', alt: 'BIZNESTA' }, menuLabel: '메뉴' },

  hero: {
    image: {
      webp: '/assets/mo07/hero.webp', jpg: '/assets/mo07/hero.jpg',
      alt: '새로 공개된 BIZNESTA 디자인 샘플이 표시된 스마트폰',
    },
    eyebrow: 'NEW DESIGN',
    headline: ['지금,', '더 특별한 디자인을', '만나보세요.'],
    body: ['비즈네스타의 새로운 디자인이', '당신의 비즈니스에 더 큰 가능성을', '열어드립니다.'],
  },

  filters: [
    { slug: 'all', label: '전체', active: true },
    { slug: 'corporate', label: '기업/브랜드', active: false },
    { slug: 'commerce', label: '쇼핑몰', active: false },
    { slug: 'expert', label: '개인/프리랜서', active: false },
    { slug: 'education', label: '교육/강의', active: false },
    { slug: 'medical', label: '병원/의료', active: false },
    { slug: 'realestate', label: '부동산', active: false },
    { slug: 'custom', label: '기타', active: false },
  ],

  badge: 'NEW',

  items: [
    { id: 1, order: 1, visible: true, slug: 'build-better', kind: 'sample' as const, newDesign: true,
      publishedAt: '', caption: '기업 · 브랜드형 홈페이지', category: '기업 · 브랜드형', categoryId: 'corporate',
      artwork: art(1, '기업 · 브랜드 홈페이지 디자인 샘플 — Build a Better Tomorrow') },
    { id: 2, order: 3, visible: true, slug: 'glow-your-life', kind: 'sample' as const, newDesign: true,
      publishedAt: '', caption: '쇼핑 · 판매형 홈페이지', category: '쇼핑 · 판매형', categoryId: 'shopping',
      artwork: art(2, '쇼핑몰 · 온라인 스토어 디자인 샘플 — Glow Your Life') },
    { id: 3, order: 4, visible: true, slug: 'learn-grow-shine', kind: 'sample' as const, newDesign: true,
      publishedAt: '', caption: '교육형 홈페이지', category: '교육형', categoryId: 'education',
      artwork: art(3, '교육 · 강의 홈페이지 디자인 샘플 — Learn Grow Shine') },
    { id: 4, order: 5, visible: true, slug: 'saram-clinic', kind: 'sample' as const, newDesign: true,
      publishedAt: '', caption: '병원 · 의료형 홈페이지', category: '병원 · 의료형', categoryId: 'medical',
      artwork: art(4, '병원 · 의료 홈페이지 디자인 샘플') },
    { id: 5, order: 6, visible: true, slug: 'premium-lifestyle', kind: 'sample' as const, newDesign: true,
      publishedAt: '', caption: '부동산 · 분양 홈페이지', category: '부동산 · 분양',
      artwork: art(5, '부동산 · 분양 홈페이지 디자인 샘플') },
    { id: 6, order: 2, visible: true, slug: 'my-portfolio', kind: 'sample' as const, newDesign: true,
      publishedAt: '', caption: '전문가 · 개인형 홈페이지', category: '전문가 · 개인형', categoryId: 'expert',
      artwork: art(6, '개인 · 프리랜서 홈페이지 디자인 샘플 — My Portfolio') },
  ] as NewDesignItem[],

  band: {
    quote: ['당신의 새로운 시작,', '비즈네스타가 함께합니다.'],
    tagline: 'NEW DESIGN, A BIGGER TOMORROW',
    cta: { label: '지금 상담하기', href: '/contact?source=design-new' },
    items: [
      { icon: 'bulb' as const, label: '맞춤 제안' },
      { icon: 'monitor' as const, label: '다양한 디자인' },
      { icon: 'heart' as const, label: '지속적인 관리' },
    ],
  },
};
