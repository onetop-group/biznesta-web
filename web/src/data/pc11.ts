/**
 * BN_PC_11_CUSTOM_SOLUTION — content.
 *
 * BIZNESTA's positioning screen: design + system + operation designed around
 * the customer's own business, not a fixed website package. The five process
 * steps and six solution areas are ordered, individually editable rows.
 *
 * Channel wording stays at the public level the artwork uses (채널 연계,
 * 콘텐츠 활용, 온라인 홍보). No publishing engine, per-channel conversion,
 * scheduling logic or internal workflow is described.
 */

export type SolutionStep = {
  id: number;
  order: number;
  visible: boolean;
  icon: 'chat' | 'doc' | 'pen' | 'monitor' | 'bars';
  label: string;
  desc: [string, string];
};

export type SolutionArea = {
  id: number;
  order: number;
  visible: boolean;
  icon: 'monitor' | 'share' | 'database' | 'image' | 'megaphone' | 'gear';
  title: string;
  desc: [string, string];
  artwork: { webp: string; jpg: string; alt: string };
};

const art = (n: number, alt: string) => ({
  webp: `/assets/pc11/card-0${n}.webp`,
  jpg: `/assets/pc11/card-0${n}.jpg`,
  alt,
});

export const pc11 = {
  header: {
    wordmark: { src: '/assets/pc11/logo-wordmark-navy.png', alt: 'BIZNESTA', width: 191, height: 35.6 },
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
    cta: { label: '제작 상담하기', href: '/contact?source=solution' },
  },

  hero: {
    image: {
      webp: '/assets/pc11/hero.webp',
      jpg: '/assets/pc11/hero.jpg',
      alt: '어두운 사무 공간의 노트북·모바일에 BRAND TO GROWTH 홈페이지가 띄워진 모습',
    },
    eyebrow: 'CUSTOM SOLUTION',
    headline: ['당신의 비즈니스에', '딱 맞는 맞춤 솔루션.'],
    sub: ['업종, 목적, 예산에 맞춰', '홈페이지부터 SNS 연계, 운영 시스템까지', '필요한 것만, 제대로 설계해 드립니다.'],
    englishQuote: ['YOUR BUSINESS,', 'OUR CUSTOM SOLUTION.'],
    panel: {
      lines: ['지금,', '당신의 비즈니스에', '꼭 맞는 솔루션이', '필요한 순간입니다.'],
      keywords: ['BIZNESTA', 'CUSTOM SOLUTION', 'FOR YOUR GROWTH'],
    },
  },

  process: {
    eyebrow: 'SOLUTION PROCESS',
    title: ['함께 만들어가는', '맞춤 제작 프로세스'],
    desc: ['처음부터 끝까지,', '당신의 비즈니스에 집중합니다.'],
    steps: [
      { id: 1, order: 1, visible: true, icon: 'chat' as const, label: '01. 상담 & 분석',
        desc: ['업종, 목적, 타겟을', '정확히 파악합니다.'] as [string, string] },
      { id: 2, order: 2, visible: true, icon: 'doc' as const, label: '02. 기획 & 제안',
        desc: ['필요한 기능과 구조를', '설계하고 제안합니다.'] as [string, string] },
      { id: 3, order: 3, visible: true, icon: 'pen' as const, label: '03. 디자인 & 개발',
        desc: ['브랜드에 맞는 디자인과', '시스템을 제작합니다.'] as [string, string] },
      { id: 4, order: 4, visible: true, icon: 'monitor' as const, label: '04. 검수 & 오픈',
        desc: ['꼼꼼한 테스트 후', '안정적으로 오픈합니다.'] as [string, string] },
      { id: 5, order: 5, visible: true, icon: 'bars' as const, label: '05. 운영 & 성장 지원',
        desc: ['제작 이후에도 지속적으로', '관리와 마케팅을 지원합니다.'] as [string, string] },
    ] as SolutionStep[],
  },

  solutions: {
    title: ['당신에게 필요한', '모든 것을, 하나로.'],
    desc: ['홈페이지 제작을 넘어,', '실제 비즈니스 성장을 위한', '통합 솔루션을 제공합니다.'],
    cta: { label: '맞춤 솔루션 상담하기', href: '/contact?source=solution' },
    areas: [
      { id: 1, order: 1, visible: true, icon: 'monitor' as const, title: '홈페이지 제작',
        desc: ['브랜드에 맞는', '반응형 홈페이지'] as [string, string],
        artwork: art(1, '책상 위 노트북과 모바일로 홈페이지를 확인하는 모습') },
      { id: 2, order: 2, visible: true, icon: 'share' as const, title: 'SNS 연계 운영',
        desc: ['블로그, 인스타 등', '통합 연동'] as [string, string],
        artwork: art(2, '모바일 화면을 확인하는 손') },
      { id: 3, order: 3, visible: true, icon: 'database' as const, title: '운영 시스템 구축',
        desc: ['문의/예약/회원 관리', '자동화 시스템'] as [string, string],
        artwork: art(3, '태블릿으로 자료를 정리하는 모습') },
      { id: 4, order: 4, visible: true, icon: 'image' as const, title: '콘텐츠 기획 & 제작',
        desc: ['사진, 영상, 카드뉴스 등', '브랜드 콘텐츠'] as [string, string],
        artwork: art(4, '책상 위 카메라와 노트북') },
      { id: 5, order: 5, visible: true, icon: 'megaphone' as const, title: '마케팅 컨설팅',
        desc: ['온라인 홍보 전략', '및 실행 지원'] as [string, string],
        artwork: art(5, '자료를 살펴보며 전략을 논의하는 모습') },
      { id: 6, order: 6, visible: true, icon: 'gear' as const, title: '유지보수 & 업데이트',
        desc: ['지속적인 관리로', '안정적인 운영'] as [string, string],
        artwork: art(6, '노트북 화면의 관리 도구') },
    ] as SolutionArea[],
    panel: {
      eyebrow: 'BIZNESTA',
      title: ['좋은 비즈니스는', '좋은 파트너와 시작됩니다.'],
      desc: ['당신의 비즈니스에 꼭 맞는', '맞춤 솔루션을 지금 만나보세요.'],
      cta: { label: '상담 문의하기', href: '/contact?source=solution' },
      brand: ['BIZNESTA', 'BUSINESS TOTAL SOLUTION'],
    },
  },

  band: {
    image: { webp: '/assets/pc11/band.webp', jpg: '/assets/pc11/band.jpg', alt: '' },
    wordmark: { src: '/assets/pc11/logo-wordmark-white.png', alt: 'BIZNESTA', width: 139, height: 25.9 },
    tagline: 'BUSINESS TOTAL SOLUTION',
    quote: ['무엇을 만들지부터 함께,', '당신의 비즈니스가 성장하는 길을 설계합니다.'],
    points: [
      { icon: 'bulb' as const, lines: ['기획부터', '맞춤 설계'] as [string, string] },
      { icon: 'people' as const, lines: ['전문가의', '1:1 컨설팅'] as [string, string] },
      { icon: 'gear' as const, lines: ['제작 이후에도', '지속적인 지원'] as [string, string] },
      { icon: 'bars' as const, lines: ['함께 만드는', '더 큰 성장'] as [string, string] },
    ],
  },
};
