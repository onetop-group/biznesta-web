/**
 * BN_PC_09_CONTENT_GROWTH — content.
 *
 * The screen's subject is content that accumulates into a business asset.
 * Process steps and content types are ordered, individually editable rows so
 * Admin can add a type or reorder the process without touching the layout.
 *
 * Public wording is deliberately kept at the level the artwork uses —
 * channel work, content production, steady updates. No automation engine,
 * per-channel conversion, scheduling logic, AI operating profile or internal
 * workflow is described anywhere on this screen.
 */

export type ProcessStep = {
  id: number;
  order: number;
  visible: boolean;
  icon: 'search' | 'doc' | 'share' | 'bars' | 'growth';
  /** the artwork highlights step 02 with a warm panel */
  featured: boolean;
  title: string;
  desc: [string, string];
};

export type ContentType = {
  id: number;
  slug: string;
  order: number;
  visible: boolean;
  /** stock working scenes, not client deliverables */
  kind: 'sample' | 'concept' | 'client';
  title: string;
  desc: string;
  artwork: { webp: string; jpg: string; alt: string };
};

const art = (n: number, alt: string) => ({
  webp: `/assets/pc09/type-0${n}.webp`,
  jpg: `/assets/pc09/type-0${n}.jpg`,
  alt,
});

export const pc09 = {
  header: {
    wordmark: { src: '/assets/pc09/logo-wordmark-navy.png', alt: 'BIZNESTA', width: 175, height: 32.6 },
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
    cta: { label: '제작 상담하기', href: '/contact?source=content' },
  },

  hero: {
    image: {
      webp: '/assets/pc09/hero.webp',
      jpg: '/assets/pc09/hero.jpg',
      alt: '밝은 사무 공간의 데스크톱·태블릿·모바일에 콘텐츠 화면이 띄워진 모습',
    },
    eyebrow: 'CONTENT GROWTH',
    headline: [
      { text: '좋은 콘텐츠가', tone: 'ink' as const },
      { text: '좋은 비즈니스를 만듭니다.', tone: 'gold' as const },
    ],
    sub: ['당신의 브랜드가 지속적으로 성장할 수 있도록', '콘텐츠 기획부터 제작, 운영까지 함께합니다.'],
    quote: ['CONTENTS CREATE OPPORTUNITY.', 'BIZNESTA MAKES IT HAPPEN.'],
    panel: {
      label: ['BIZNESTA', 'CONTENT SOLUTION'],
      lines: ['콘텐츠는', '일회성이 아닌', '지속적인 성장을 만드는', '자산입니다.'],
      keywords: ['YOUR STORY', 'OUR CONTENT', 'A BIGGER TOMORROW'],
    },
  },

  process: {
    eyebrow: 'CONTENT PROCESS',
    title: '기획부터 성과까지, 체계적인 콘텐츠 운영',
    note: '당신의 비즈니스에 꼭 맞는 콘텐츠 전략을 설계합니다.',
    steps: [
      { id: 1, order: 1, visible: true, icon: 'search' as const, featured: false,
        title: '전략 기획', desc: ['브랜드와 고객을 분석하여', '콘텐츠 방향을 설정합니다.'] as [string, string] },
      { id: 2, order: 2, visible: true, icon: 'doc' as const, featured: true,
        title: '콘텐츠 제작', desc: ['블로그, 인스타, 유튜브 등', '채널에 맞는 콘텐츠를 제작합니다.'] as [string, string] },
      { id: 3, order: 3, visible: true, icon: 'share' as const, featured: false,
        title: '채널 운영', desc: ['스케줄 관리와 최적화로', '꾸준히 노출되게 운영합니다.'] as [string, string] },
      { id: 4, order: 4, visible: true, icon: 'bars' as const, featured: false,
        title: '성과 분석', desc: ['데이터를 기반으로', '성과를 분석하고 개선합니다.'] as [string, string] },
      { id: 5, order: 5, visible: true, icon: 'growth' as const, featured: false,
        title: '지속적 성장', desc: ['꾸준한 콘텐츠로', '더 큰 비즈니스를 만들어갑니다.'] as [string, string] },
    ] as ProcessStep[],
  },

  types: {
    eyebrow: 'BIZNESTA CONTENT SOLUTION',
    title: '이런 콘텐츠를 제작합니다.',
    note: '업종과 목적에 맞는 다양한 콘텐츠로 당신의 브랜드를 더 멀리 알립니다.',
    items: [
      { id: 1, slug: 'blog', order: 1, visible: true, kind: 'sample' as const,
        title: '블로그 콘텐츠', desc: '검색에서 고객이 찾는 콘텐츠',
        artwork: art(1, '노트북으로 글을 작성하는 손') },
      { id: 2, slug: 'sns', order: 2, visible: true, kind: 'sample' as const,
        title: 'SNS 콘텐츠', desc: '브랜드를 돋보이게 하는 콘텐츠',
        artwork: art(2, '모바일 화면에 표시된 브랜드 피드') },
      { id: 3, slug: 'video', order: 3, visible: true, kind: 'sample' as const,
        title: '영상 콘텐츠', desc: '스토리가 있는 영상 제작',
        artwork: art(3, '삼각대 위 카메라로 촬영하는 현장') },
      { id: 4, slug: 'card-news', order: 4, visible: true, kind: 'sample' as const,
        title: '카드뉴스 & 디자인', desc: '한눈에 전달되는 시각적 콘텐츠',
        artwork: art(4, '책상 위에 펼쳐진 마케팅 인쇄물') },
      { id: 5, slug: 'newsletter', order: 5, visible: true, kind: 'sample' as const,
        title: '뉴스레터 / 이메일', desc: '꾸준히 연결되는 고객 소통',
        artwork: art(5, '뉴스레터 인쇄물과 만년필') },
      { id: 6, slug: 'consulting', order: 6, visible: true, kind: 'sample' as const,
        title: '콘텐츠 컨설팅', desc: '지속 가능한 콘텐츠 운영 전략',
        artwork: art(6, '노트와 만년필이 놓인 책상') },
    ] as ContentType[],
    quoteCard: {
      quote: ['좋은 콘텐츠가', '좋은 기회를 만듭니다.'],
      brand: ['BIZNESTA', 'BUSINESS TOTAL SOLUTION'],
    },
  },

  band: {
    image: {
      webp: '/assets/pc09/band.webp',
      jpg: '/assets/pc09/band.jpg',
      alt: '',
    },
    wordmark: { src: '/assets/pc09/logo-wordmark-white.png', alt: 'BIZNESTA', width: 134, height: 25 },
    tagline: 'BUSINESS TOTAL SOLUTION',
    quote: '콘텐츠로 시작하는, 더 큰 내일을 함께합니다.',
    points: [
      { icon: 'doc' as const, ko: '콘텐츠 기획' },
      { icon: 'image' as const, ko: '디자인 제작' },
      { icon: 'play' as const, ko: '영상 제작' },
      { icon: 'bars' as const, ko: '채널 운영' },
      { icon: 'gear' as const, ko: '분석 & 관리' },
    ],
    cta: { label: '제작 상담하기', href: '/contact?source=content' },
  },
};
