import type { ShowroomCategoryId } from '@/data/showroom';

/**
 * BN_PC_04_DESIGN_SHOWROOM — content.
 *
 * The eight exhibited designs are modelled the way Admin will need them.
 * Every artwork on this screen is a BIZNESTA sample design, not a client
 * project — `kind` keeps that distinction explicit from the start.
 */

export type ShowroomItem = {
  id: number;
  slug: string;
  /** 공식 카테고리 id (src/data/showroom.ts) — 카드가 열어야 할 카테고리 */
  category: ShowroomCategoryId;
  order: number;
  visible: boolean;
  /** BIZNESTA sample work vs. a real commission — no fake client work here */
  kind: 'sample' | 'concept' | 'client';
  /** overlay ink for the number and label, driven by the artwork's own brightness */
  tone: 'dark' | 'light';
  label: string;
  name: string;
  desc: string;
  artwork: { webp: string; jpg: string; alt: string };
};

const art = (n: number, alt: string) => ({
  webp: `/assets/pc04/card-${String(n).padStart(2, '0')}.webp`,
  jpg: `/assets/pc04/card-${String(n).padStart(2, '0')}.jpg`,
  alt,
});

export const pc04 = {
  header: {
    wordmark: { src: '/assets/pc04/logo-wordmark-navy.png', alt: 'BIZNESTA', width: 179, height: 33 },
    tagline: 'BUSINESS TOTAL SOLUTION',
    nav: [
      { en: 'DESIGN', ko: '홈페이지 디자인', href: '/design' },
      { en: 'SERVICE', ko: '제작 서비스', href: '/service' },
      { en: 'SOLUTION', ko: '맞춤 솔루션', href: '/solution' },
      { en: 'PRICE', ko: '제작 비용', href: '/price' },
      { en: 'PORTFOLIO', ko: '제작 사례', href: '/portfolio' },
      { en: 'ABOUT', ko: '회사소개', href: '/about' },
      { en: 'CONTACT', ko: '제작 상담', href: '/contact' },
    ],
    cta: { label: '제작 상담하기', href: '/contact?source=design' },
  },

  hero: {
    image: {
      webp: '/assets/pc04/hero.webp',
      jpg: '/assets/pc04/hero.jpg',
      alt: '빛이 들어오는 어두운 콘크리트 전시 공간',
    },
    eyebrow: 'DESIGN SHOWROOM',
    headline: '당신의 스타일을 찾아보세요.',
    sub: '다양한 업종의 홈페이지 디자인을 한눈에 만나보세요.',
    desc: ['BIZNESTA는 업종의 특성과 목적에 맞는', '최적의 디자인을 제안합니다.'],
    wall: ['GOOD DESIGN', 'BETTER BUSINESS', 'BIZNESTA'],
    keywords: ['WEBSITE', 'DESIGN', 'FOR A', 'BRIGHTER', 'TOMORROW'],
  },

  filters: {
    activeLabel: '전체 보기',
    /* 고객에게 보이는 공식 카테고리 8개. 랜딩페이지 · DB수집 · 채용 ·
       포트폴리오는 업종이 아니라 구성 · 목적이라 1차 카테고리에서 뺐다
       (개념이 사라진 것은 아니고 앞으로 태그로 다룬다). */
    items: <{ label: string; slug: string; category: ShowroomCategoryId }[]>[
      { label: '기업 · 브랜드형', slug: 'corporate', category: 'corporate' },
      { label: '소상공인 · 매장형', slug: 'local', category: 'local' },
      { label: '교육형', slug: 'education', category: 'education' },
      { label: '전문가 · 개인형', slug: 'expert', category: 'expert' },
      { label: '뷰티 · 미용형', slug: 'beauty', category: 'beauty' },
      { label: '병원 · 의료형', slug: 'medical', category: 'medical' },
      { label: '프랜차이즈형', slug: 'franchise', category: 'franchise' },
      { label: '쇼핑 · 판매형', slug: 'shopping', category: 'shopping' },
    ],
    moreLabel: '더 보기',
  },

  items: <ShowroomItem[]>[
    { id: 1, tone: 'dark', slug: 'corporate-build-a-better-tomorrow', category: 'corporate', order: 1, visible: true, kind: 'sample',
      label: 'CORPORATE', name: '기업 · 브랜드형', desc: '신뢰와 가치를 담은 프리미엄 홈페이지',
      artwork: art(1, '기업 홈페이지 디자인이 노트북과 모바일에 표시된 목업') },
    { id: 2, tone: 'light', slug: 'store-good-coffee-better-days', category: 'local', order: 2, visible: true, kind: 'sample',
      label: 'CAFE & STORE', name: '소상공인 · 매장형', desc: '지역에서 돋보이는 매장 홈페이지',
      artwork: art(2, '카페 홈페이지 디자인 목업') },
    { id: 3, tone: 'dark', slug: 'education-grow-together', category: 'education', order: 3, visible: true, kind: 'sample',
      label: 'EDUCATION', name: '교육형', desc: '학원 · 아카데미 · 교육 프로그램 홈페이지',
      artwork: art(3, '교육 홈페이지 디자인 목업') },
    { id: 4, tone: 'dark', slug: 'expert-your-specialist-partner', category: 'expert', order: 4, visible: true, kind: 'sample',
      label: 'EXPERT', name: '전문가 · 개인형', desc: '당신의 전문성을 더욱 빛나게',
      artwork: art(4, '전문가 개인 홈페이지 디자인 목업') },
    { id: 5, tone: 'dark', slug: 'beauty-more-beautiful-you', category: 'beauty', order: 5, visible: true, kind: 'sample',
      label: 'BEAUTY', name: '뷰티 · 미용형', desc: '브랜드의 감각이 돋보이는 홈페이지',
      artwork: art(5, '뷰티 홈페이지 디자인 목업') },
    { id: 6, tone: 'dark', slug: 'hospital-healthy-today', category: 'medical', order: 6, visible: true, kind: 'sample',
      label: 'HOSPITAL', name: '병원 · 의료형', desc: '신뢰를 전하는 의료기관 홈페이지',
      artwork: art(6, '의료기관 홈페이지 디자인 목업') },
    { id: 7, tone: 'light', slug: 'franchise-good-food-great-people', category: 'franchise', order: 7, visible: true, kind: 'sample',
      label: 'FRANCHISE', name: '프랜차이즈형', desc: '가맹점 모집부터 브랜드 확장까지',
      artwork: art(7, '프랜차이즈 홈페이지 디자인 목업') },
    { id: 8, tone: 'dark', slug: 'shopping-a-better-daily-life', category: 'shopping', order: 8, visible: true, kind: 'sample',
      label: 'SHOPPING', name: '쇼핑 · 판매형', desc: '제품의 가치를 높이는 쇼핑몰',
      artwork: art(8, '쇼핑몰 홈페이지 디자인 목업') },
  ],

  footer: {
    wordmark: { src: '/assets/pc04/logo-wordmark-navy.png', alt: 'BIZNESTA', width: 75, height: 14 },
    label: 'WEBSITE DESIGN PORTFOLIO',
    /* 완성된 43개 샘플 전체를 보는 곳. 07 NEW DESIGN 은 태그 · 필터가
       완성될 때까지 공개 동선에서 빼 두었다(주소를 알면 볼 수 있다). */
    cta: { label: '더 많은 디자인 보기', href: '/design/category/all' },
    pagination: { current: 1, total: 3 },
  },
};
