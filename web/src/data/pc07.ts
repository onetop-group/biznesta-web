import type { ShowroomCategoryId } from '@/data/showroom';

/**
 * BN_PC_07_NEW_DESIGN — content.
 *
 * The design library screen. Items carry the fields Admin will need to
 * keep publishing new work: slug / category / thumbnail / concept /
 * publishedAt / isNew / featured / visible / order, plus `kind` so a
 * BIZNESTA sample is never mistaken for a client project.
 */

export type NewDesign = {
  id: number;
  slug: string;
  order: number;
  visible: boolean;
  isNew: boolean;
  featured: boolean;
  kind: 'sample' | 'concept' | 'client';
  category: string;
  /** 공식 카테고리 id (src/data/showroom.ts). 없으면 전체 보기로 간다. */
  categoryId?: ShowroomCategoryId;
  title: string;
  desc: [string, string];
  tags: string[];
  /** ISO date — drives ordering and the NEW badge once Admin exists */
  publishedAt: string;
  artwork: { webp: string; jpg: string; alt: string };
};

const art = (n: number, alt: string) => ({
  webp: `/assets/pc07/card-0${n}.webp`,
  jpg: `/assets/pc07/card-0${n}.jpg`,
  alt,
});

export const pc07 = {
  header: {
    wordmark: { src: '/assets/pc07/logo-wordmark-navy.png', alt: 'BIZNESTA', width: 195, height: 36 },
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
    cta: { label: '제작 상담하기', href: '/contact?source=design-new' },
  },

  hero: {
    image: {
      webp: '/assets/pc07/hero.webp',
      jpg: '/assets/pc07/hero.jpg',
      alt:
        'BIZNESTA가 제작한 홈페이지 디자인이 데스크톱과 모바일에 표시된 밝은 공간. ' +
        '가운데에 New Design, New Possibility 라는 손글씨가 놓여 있다.',
    },
    eyebrow: 'NEW DESIGN',
    headline: [
      { text: '새로운 시작을 위한', tone: 'ink' as const },
      { text: '새로운 디자인.', tone: 'gold' as const },
    ],
    desc: ['트렌드를 반영한 감각적인 디자인으로', '당신의 브랜드를 더 특별하게 만들어드립니다.'],
    features: [
      { icon: 'gem' as const, label: '트렌디한 디자인' },
      { icon: 'people' as const, label: '업종별 맞춤 구성' },
      { icon: 'monitor' as const, label: 'PC · 모바일 최적화' },
      { icon: 'growth' as const, label: '브랜드 성장 전략' },
    ],
    midKeywords: ['BIZNESTA', 'WEBSITE', 'DESIGN', 'FOR YOUR', 'BUSINESS'],
    sideKeywords: ['BRAND', 'DESIGN', 'CONTENT', 'MARKETING', 'SOLUTION'],
    sideNote: ['당신의 새로운 시작,', 'BIZNESTA가', '함께합니다.'],
  },

  filters: {
    activeLabel: '전체',
    /* 칩이 가리킬 필터 값. 실제 필터링은 디자인 데이터가 생기는 단계에서 붙인다. */
    items: [
      { label: '신규 디자인', slug: 'new' },
      { label: '인기 디자인', slug: 'popular' },
      { label: '업종별 추천', slug: 'industry' },
      { label: '심플 · 모던', slug: 'simple-modern' },
      { label: '감성 · 프리미엄', slug: 'premium' },
      { label: '컬러 테마', slug: 'color' },
      { label: 'PC & 모바일', slug: 'responsive' },
      { label: '랜딩페이지', slug: 'landing' },
      { label: '쇼핑몰', slug: 'commerce' },
      { label: '포트폴리오형', slug: 'portfolio' },
    ],
    moreLabel: 'MORE DESIGN',
  },

  items: <NewDesign[]>[
    { id: 1, slug: 'cafe-nesta', order: 4, visible: true, isNew: true, featured: false, kind: 'sample',
      category: '소상공인 · 매장형', categoryId: 'local', title: '소상공인 · 매장형 홈페이지',
      desc: ['감각적인 분위기로 더 많은 고객이 찾아오는', '소상공인 · 매장형 홈페이지입니다.'],
      tags: ['#감성디자인', '#예약시스템', '#메뉴관리'], publishedAt: '2026-09-01',
      artwork: art(1, 'CAFE NESTA 홈페이지 디자인이 노트북과 모바일에 표시된 목업') },
    { id: 2, slug: 'beauty-for-a-better-you', order: 2, visible: true, isNew: true, featured: false, kind: 'sample',
      category: '뷰티 · 미용형', categoryId: 'beauty', title: '뷰티 · 미용형 홈페이지',
      desc: ['당신의 아름다움을 더 빛나게 하는', '프리미엄 뷰티 홈페이지입니다.'],
      tags: ['#브랜드이미지', '#상담예약', '#시술안내'], publishedAt: '2026-09-01',
      artwork: art(2, '뷰티 홈페이지 디자인 목업') },
    { id: 3, slug: 'learn-for-a-brighter-tomorrow', order: 3, visible: true, isNew: true, featured: false, kind: 'sample',
      category: '교육형', categoryId: 'education', title: '교육형 홈페이지',
      desc: ['신뢰감 있는 디자인으로', '더 많은 학생을 만나는 교육 홈페이지입니다.'],
      tags: ['#커리큘럼', '#수강신청', '#상담문의'], publishedAt: '2026-09-01',
      artwork: art(3, '교육 홈페이지 디자인 목업') },
    { id: 4, slug: 'trust-creates-value', order: 1, visible: true, isNew: true, featured: false, kind: 'sample',
      category: '기업 · 브랜드형', categoryId: 'corporate', title: '기업 · 브랜드형 홈페이지',
      desc: ['전문적인 이미지를 전달하는', '기업 · 브랜드형 홈페이지입니다.'],
      tags: ['#회사소개', '#사업안내', '#문의폼'], publishedAt: '2026-09-01',
      artwork: art(4, '기업 브랜드 홈페이지 디자인 목업') },
  ],

  band: {
    wordmark: { src: '/assets/pc07/logo-wordmark-navy.png', alt: 'BIZNESTA', width: 160, height: 30 },
    tagline: 'BUSINESS TOTAL SOLUTION',
    quote: ['좋은 디자인은 좋은 비즈니스를 만듭니다.', 'BIZNESTA가 당신의 새로운 시작을 함께합니다.'],
    points: [
      { icon: 'bulb' as const, lines: ['트렌드를 반영한', '디자인 제안'] },
      { icon: 'pen' as const, lines: ['브랜드에 맞는', '맞춤 기획'] },
      { icon: 'gear' as const, lines: ['지속적인 관리와', '업데이트'] },
    ],
    cta: { label: '제작 상담하기', href: '/contact?source=design-new' },
  },
};
