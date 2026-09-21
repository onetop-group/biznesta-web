/**
 * BN_PC_14_PROCESS — content.
 *
 * The eight production steps, each an ordered editable row with its own
 * photograph and caption. Nothing on this screen states a duration, a price,
 * a headcount or a completed-project figure.
 */

export type ProcessStep = {
  id: number;
  order: number;
  visible: boolean;
  icon: 'chat' | 'search' | 'bulb' | 'pen' | 'code' | 'clipboard' | 'cloud' | 'headset';
  title: string;
  desc: string[];
  caption: string;
  artwork: { webp: string; jpg: string; alt: string };
};

const art = (n: number, alt: string) => ({
  webp: `/assets/pc14/card-0${n}.webp`,
  jpg: `/assets/pc14/card-0${n}.jpg`,
  alt,
});

export const pc14 = {
  header: {
    wordmark: { src: '/assets/pc14/logo-wordmark-navy.png', alt: 'BIZNESTA', width: 192, height: 35.8 },
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
    cta: { label: '제작 상담하기', href: '/contact?source=process' },
  },

  hero: {
    image: {
      webp: '/assets/pc14/hero.webp',
      jpg: '/assets/pc14/hero.jpg',
      alt: '햇빛 드는 책상 위 노트북에 BIZNESTA 홈페이지가 띄워진 모습',
    },
    eyebrow: 'PRODUCTION PROCESS',
    headline: ['처음부터 끝까지,', '함께 만들어가는 과정입니다.'],
    sub: ['비즈네스타는 단순히 홈페이지를 제작하는 것이 아니라,', '당신의 비즈니스 성장을 위한 파트너로서 함께합니다.'],
    points: [
      { icon: 'handshake' as const, ko: '1:1 전담 컨설팅' },
      { icon: 'doc' as const, ko: '투명한 진행 과정' },
      { icon: 'bars' as const, ko: '제작 후에도 지속 지원' },
    ],
    panel: {
      quote: ['좋은 홈페이지는', '좋은 파트너와 함께', '만들어집니다.'],
      keywords: ['BIZNESTA', 'PROCESS'],
    },
  },

  steps: {
    eyebrow: 'PROCESS STEP',
    title: '이렇게 진행됩니다.',
    note: '상담부터 오픈까지 체계적인 8단계 프로세스로 진행합니다.',
    items: [
      { id: 1, order: 1, visible: true, icon: 'chat' as const, title: '상담 및 문의',
        desc: ['업종, 목적, 예산 등', '궁금한 내용을 편하게', '문의하세요.'],
        caption: '전화 / 카카오톡 / 온라인 상담',
        artwork: art(1, '모바일로 문의를 남기는 손') },
      { id: 2, order: 2, visible: true, icon: 'search' as const, title: '요구사항 분석',
        desc: ['비즈니스 현황과', '목표를 분석하고', '방향을 제안합니다.'],
        caption: '맞춤 기획 컨설팅',
        artwork: art(2, '펜으로 기획 자료를 정리하는 모습') },
      { id: 3, order: 3, visible: true, icon: 'bulb' as const, title: '기획 및 제안',
        desc: ['사이트 구조, 기능,', '디자인 방향을 기획하고', '제안서를 전달합니다.'],
        caption: '기획안 / 견적서 제공',
        artwork: art(3, '책상 위 BIZNESTA 제안서') },
      { id: 4, order: 4, visible: true, icon: 'pen' as const, title: '디자인 제작',
        desc: ['브랜드에 맞는', '메인 시안 디자인을', '제작합니다.'],
        caption: '메인 시안 확인 및 수정',
        artwork: art(4, '모니터에 표시된 디자인 시안') },
      { id: 5, order: 5, visible: true, icon: 'code' as const, title: '퍼블리싱 및 개발',
        desc: ['확정된 디자인을', '기반으로 실제 기능을', '구현합니다.'],
        caption: '반응형 웹 / 기능 개발',
        artwork: art(5, '코드가 표시된 개발 화면') },
      { id: 6, order: 6, visible: true, icon: 'clipboard' as const, title: '검수 및 피드백',
        desc: ['제작된 사이트를', '함께 확인하고', '수정사항을 반영합니다.'],
        caption: '최종 검수 및 보완',
        artwork: art(6, '태블릿의 체크리스트 화면') },
      { id: 7, order: 7, visible: true, icon: 'cloud' as const, title: '오픈 및 세팅',
        desc: ['도메인 연결, 호스팅,', '기본 세팅을 완료하고', '정식 오픈합니다.'],
        caption: '도메인 연결 / 정식 오픈',
        artwork: art(7, 'Your Website is Live! 안내 화면') },
      { id: 8, order: 8, visible: true, icon: 'headset' as const, title: '운영 및 사후관리',
        desc: ['문의 대응, 콘텐츠 추가 등', '지속적인 운영을', '지원합니다.'],
        caption: '지속적인 파트너십',
        artwork: art(8, '노트북 앞에서 상담을 이어가는 모습') },
    ] as ProcessStep[],
  },

  closing: {
    bar: {
      title: ['지금, 당신의 시작을', '비즈네스타가 함께합니다.'],
      note: '작은 아이디어도 괜찮습니다. 편하게 문의하세요.',
      cta: { label: '제작 상담하기', href: '/contact?source=process' },
    },
    panel: {
      points: [
        { icon: 'diamond' as const, ko: '체계적인 진행' },
        { icon: 'people' as const, ko: '전담 전문가' },
        { icon: 'shield' as const, ko: '투명한 커뮤니케이션' },
        { icon: 'bars' as const, ko: '안정적인 오픈' },
        { icon: 'heart' as const, ko: '지속적인 관리' },
      ],
      brandTop: 'BIZNESTA',
      quote: ['좋은 과정이', '좋은 결과를 만듭니다.'],
      brandBottom: 'BUSINESS TOTAL SOLUTION',
    },
  },
};
