/**
 * BN_PC_10_ADMIN_SYSTEM — content.
 *
 * The screen sells operation, not software: "내 홈페이지를 내가 운영할 수 있다".
 * The admin capability list below is the Front-side description only — no Admin
 * application is built at this stage, and nothing here is wired to a database.
 *
 * The admin screens in the hero are the artwork's own photographed mockup.
 * The counters and percentages visible inside those screens are demo data
 * printed in the mockup, not BIZNESTA performance figures; no figure on this
 * screen is re-authored as page text.
 */

export type AdminFeature = {
  id: number;
  order: number;
  visible: boolean;
  icon: 'mail' | 'people' | 'doc' | 'image' | 'bars' | 'gear';
  title: string;
  desc: [string, string, string];
};

export const pc10 = {
  header: {
    wordmark: { src: '/assets/pc10/logo-wordmark-navy.png', alt: 'BIZNESTA', width: 194, height: 36.1 },
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
    cta: { label: '제작 상담하기', href: '/contact?source=admin' },
  },

  hero: {
    image: {
      webp: '/assets/pc10/hero.webp',
      jpg: '/assets/pc10/hero.jpg',
      alt: 'BIZNESTA 관리자 화면이 띄워진 모니터·태블릿·모바일 목업',
    },
    eyebrow: 'ADMIN SYSTEM',
    headline: ['운영이 쉬워야', '비즈니스가 더 커집니다.'],
    sub: ['BIZNESTA는 제작 이후에도', '누구나 쉽게 관리할 수 있는 관리자 시스템을 제공합니다.'],
    checks: [
      '직관적인 인터페이스로 누구나 쉽게',
      '필요한 기능만 담은 실용적인 구조',
      '비즈니스 성장에 집중할 수 있는 운영 환경',
    ],
    englishQuote: ['EASY MANAGEMENT,', 'BIGGER OPPORTUNITIES.'],
  },

  features: {
    eyebrow: 'ADMIN FEATURES',
    title: ['필요한 기능을', '하나의 관리자 시스템에'],
    desc: ['홈페이지 운영에 필요한 핵심 기능을', '체계적으로 제공하여, 시간은 줄이고', '효율은 높여드립니다.'],
    items: [
      { id: 1, order: 1, visible: true, icon: 'mail' as const, title: '문의 관리',
        desc: ['홈페이지를 통한', '문의 내역을 한눈에', '확인하고 관리합니다.'] as [string, string, string] },
      { id: 2, order: 2, visible: true, icon: 'people' as const, title: '고객 관리',
        desc: ['고객 정보를 체계적으로', '저장하고 상담 이력을', '관리합니다.'] as [string, string, string] },
      { id: 3, order: 3, visible: true, icon: 'doc' as const, title: '게시글 관리',
        desc: ['블로그, 공지사항 등', '다양한 콘텐츠를 손쉽게', '등록하고 수정합니다.'] as [string, string, string] },
      { id: 4, order: 4, visible: true, icon: 'image' as const, title: '포트폴리오 관리',
        desc: ['제작 사례를 추가하고', '언제든지 업데이트', '할 수 있습니다.'] as [string, string, string] },
      { id: 5, order: 5, visible: true, icon: 'bars' as const, title: '통계 분석',
        desc: ['방문자, 문의, 전환 등', '주요 데이터를 확인하여', '마케팅 전략에 활용합니다.'] as [string, string, string] },
      { id: 6, order: 6, visible: true, icon: 'gear' as const, title: '사이트 설정',
        desc: ['기본 정보부터', '팝업/배너, 메뉴까지', '쉽게 설정할 수 있습니다.'] as [string, string, string] },
    ] as AdminFeature[],
  },

  band: {
    image: { webp: '/assets/pc10/band.webp', jpg: '/assets/pc10/band.jpg', alt: '' },
    wordmark: { src: '/assets/pc10/logo-wordmark-white.png', alt: 'BIZNESTA', width: 166, height: 30.9 },
    tagline: 'BUSINESS TOTAL SOLUTION',
    quote: ['복잡한 운영은 BIZNESTA가,', '당신은 비즈니스 성장에만 집중하세요.'],
    points: [
      { icon: 'clock' as const, ko: '시간 절약' },
      { icon: 'gear' as const, ko: '효율적인 운영' },
      { icon: 'bars' as const, ko: '데이터 기반 의사결정' },
      { icon: 'people' as const, ko: '지속적인 성장 지원' },
    ],
    cta: { label: '관리자 시스템 상담하기', href: '/contact?source=admin' },
    ctaNote: '당신의 더 큰 내일을 만듭니다.',
  },
};
