/**
 * BN_PC_05_CATEGORY_DETAIL — content.
 *
 * One category (카페 · 음식점 · 매장형) shown in detail. The sidebar, the
 * recommended designs and the feature checklist are all list data so Admin
 * can drive them per category later. Every design shown is a BIZNESTA
 * sample — no client work is claimed.
 */

export type DetailDesign = {
  id: number;
  slug: string;
  order: number;
  kind: 'sample' | 'concept' | 'client';
  name: string;
  desc: [string, string];
  artwork: { webp: string; jpg: string; alt: string };
};

const art = (n: number, alt: string) => ({
  webp: `/assets/pc05/card-0${n}.webp`,
  jpg: `/assets/pc05/card-0${n}.jpg`,
  alt,
});

export const pc05 = {
  header: {
    wordmark: { src: '/assets/pc05/logo-wordmark-white.png', alt: 'BIZNESTA', width: 180, height: 33 },
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
    cta: { label: '제작 상담하기', href: '/contact?source=category' },
  },

  hero: {
    image: {
      webp: '/assets/pc05/hero.webp',
      jpg: '/assets/pc05/hero.jpg',
      alt:
        'BIZNESTA가 제작한 카페 홈페이지 디자인이 노트북과 모바일에 표시된 어두운 카페 공간. ' +
        '화면 왼쪽에 Good Food Better People 이라는 손글씨가 놓여 있다.',
    },
    breadcrumb: ['홈', '홈페이지 디자인', '카페 · 음식점 · 매장형'],
    eyebrow: 'CATEGORY DETAIL',
    headline: '카페 · 음식점 · 매장형',
    sub: '공간의 매력을 온라인으로, 더 많은 고객에게.',
    desc: [
      '감각적인 디자인과 편리한 기능으로',
      '브랜드의 분위기와 메뉴, 위치, 예약까지 한 번에 담아',
      '고객이 찾아오는 홈페이지를 제작합니다.',
    ],
    features: [
      { icon: 'cup' as const, label: '브랜드 이미지 강화' },
      { icon: 'calendar' as const, label: '예약 · 주문 연동' },
      { icon: 'pin' as const, label: '지도 · 위치 안내' },
      { icon: 'share' as const, label: 'SNS 연동' },
    ],
    /** Engraved on the stone sign in the hero photograph — part of the artwork,
     *  kept in the image the way the device-screen lettering is. Recorded here so
     *  the wording stays known when the photograph is ever re-shot. */
    signage: ['A GOOD PLACE', 'A BETTER LIFE'],
    keywords: ['BIZNESTA', 'WEBSITE', 'DESIGN', 'FOR YOUR', 'BUSINESS'],
  },

  sidebar: {
    title: '홈페이지 디자인',
    /* slug 는 CATEGORY(03) 화면이 쓰는 값과 같다. 목적지 표시용이다. */
    items: [
      { label: '기업 · 브랜드형', slug: 'corporate' },
      { label: '카페 · 음식점 · 매장형', slug: 'store' },
      { label: '전문가 개인형', slug: 'expert' },
      { label: '교육형', slug: 'education' },
      { label: '병원 · 의료형', slug: 'medical' },
      { label: '뷰티 · 미용형', slug: 'beauty' },
      { label: '쇼핑몰 · 판매형', slug: 'commerce' },
      { label: '랜딩페이지형', slug: 'landing' },
      { label: '포트폴리오형', slug: 'portfolio' },
      { label: '채용 · 리크루팅형', slug: 'recruiting' },
      { label: '프랜차이즈형', slug: 'franchise' },
      { label: 'DB 수집형', slug: 'lead-generation' },
      { label: '회원제 웹사이트형', slug: 'membership' },
      { label: '기타 맞춤제작', slug: 'custom' },
    ],
    activeIndex: 1,
  },

  designs: {
    title: '추천 디자인 시안',
    sub: '다양한 스타일의 카페 · 음식점 · 매장형 홈페이지를 만나보세요.',
    moreLabel: 'MORE DESIGN',
    detailLabel: '자세히 보기',
    items: <DetailDesign[]>[
      { id: 1, slug: 'cafe-the-daily-good-coffee', order: 1, kind: 'sample',
        name: '카페 감성형',
        desc: ['감각적인 비주얼로 브랜드의 분위기를', '전달하는 카페 홈페이지입니다.'],
        artwork: art(1, '카페 홈페이지 디자인이 노트북과 모바일에 표시된 목업') },
      { id: 2, slug: 'brunch-fresh-better-life', order: 2, kind: 'sample',
        name: '브런치 레스토랑형',
        desc: ['메뉴와 공간을 아름답게 보여주는', '브런치 레스토랑 홈페이지입니다.'],
        artwork: art(2, '브런치 레스토랑 홈페이지 디자인 목업') },
      { id: 3, slug: 'premium-taste-a-special-day', order: 3, kind: 'sample',
        name: '프리미엄 레스토랑형',
        desc: ['고급스러운 분위기로 특별한 경험을', '전달하는 레스토랑 홈페이지입니다.'],
        artwork: art(3, '프리미엄 레스토랑 홈페이지 디자인 목업') },
    ],
  },

  recommend: {
    title: '이런 기능을 추천합니다.',
    items: [
      '메뉴 소개 게시판',
      '예약 / 주문 기능',
      '매장 위치 · 지도 연동',
      '영업시간 안내',
      '이벤트 · 소식 관리',
      '인스타그램 연동',
      '리뷰 노출',
      '모바일 최적화',
    ],
    cta: { label: '맞춤 상담하기', href: '/contact?source=category' },
    note: ['당신의 매장에 꼭 맞는 홈페이지,', 'BIZNESTA가 함께합니다.'],
  },

  band: {
    image: { webp: '/assets/pc05/band.webp', jpg: '/assets/pc05/band.jpg', alt: '' },
    quote: '좋은 공간은, 좋은 사람들을 만듭니다.',
    lines: ['BIZNESTA와 함께', '당신의 브랜드가 더 멀리, 더 많은 사람에게.'],
    keywords: ['YOUR BUSINESS', 'A BRIGHTER TOMORROW'],
  },
};
