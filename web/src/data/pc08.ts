/**
 * BN_PC_08_SIGNATURE — content.
 *
 * The five-step SIGNATURE process and the "BIZNESTA가 특별한 이유" panel are
 * modelled the way Admin will need them: ordered, individually editable rows.
 *
 * No performance figure appears anywhere on this screen. The 01–05 numerals
 * are process step markers, not results. Nothing here claims a customer count,
 * a project count, a satisfaction rate or a growth rate.
 */

export type SignatureStep = {
  id: number;
  order: number;
  visible: boolean;
  /** the artwork behind each step is a stock working scene, not a client project */
  kind: 'sample' | 'concept' | 'client';
  title: string;
  desc: [string, string];
  artwork: { webp: string; jpg: string; alt: string };
};

const art = (n: number, alt: string) => ({
  webp: `/assets/pc08/card-0${n}.webp`,
  jpg: `/assets/pc08/card-0${n}.jpg`,
  alt,
});

export const pc08 = {
  header: {
    wordmark: { src: '/assets/pc08/logo-wordmark-navy.png', alt: 'BIZNESTA', width: 192, height: 36 },
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
    cta: { label: '제작 상담하기', href: '/contact?source=portfolio' },
  },

  hero: {
    image: {
      webp: '/assets/pc08/hero.webp',
      jpg: '/assets/pc08/hero.jpg',
      alt: '어두운 석재 벽면의 BIZNESTA 사이니지와 대리석 카운터 위의 노트북·모바일 목업',
    },
    eyebrow: 'OUR SIGNATURE',
    /** line 1 sets BIZNESTA in the artwork's serif; line 2 is the gold line */
    headlineTop: { serif: 'BIZNESTA', rest: '의 시그니처,' },
    headlineBottom: '결과로 증명합니다.',
    sub: ['전략부터 디자인, 시스템 구축, 운영 지원까지', '모든 과정을 하나의 기준으로 완성합니다.'],
    features: [
      { icon: 'target' as const, title: '전략 기반 설계', desc: ['비즈니스 목표에 맞춘', '맞춤 전략 수립'] },
      { icon: 'diamond' as const, title: '브랜드 중심 디자인', desc: ['차별화된 브랜드 가치를', '담은 디자인'] },
      { icon: 'layers' as const, title: '완벽한 기술 구현', desc: ['안정적이고 확장 가능한', '기술 시스템'] },
      { icon: 'support' as const, title: '지속적인 운영 지원', desc: ['운영·관리·마케팅까지', '토탈 케어'] },
    ],
  },

  signature: {
    eyebrow: 'BIZNESTA SIGNATURE',
    title: '생각의 차이가 결과의 차이를 만듭니다.',
    steps: [
      { id: 1, order: 1, visible: true, kind: 'sample' as const,
        title: '전략 컨설팅', desc: ['고객의 비즈니스를 깊이 이해하고,', '성장 전략을 도출합니다.'] as [string, string],
        artwork: art(1, '책상 위 기획 자료를 함께 검토하는 모습') },
      { id: 2, order: 2, visible: true, kind: 'sample' as const,
        title: '브랜드 & 디자인', desc: ['브랜드 아이덴티티를 반영한', '차별화된 디자인을 완성합니다.'] as [string, string],
        artwork: art(2, '태블릿에 펼쳐진 컬러 팔레트와 디자인 시안') },
      { id: 3, order: 3, visible: true, kind: 'sample' as const,
        title: '개발 & 시스템 구축', desc: ['안정적이고 확장 가능한 기술로', '최적의 시스템을 구축합니다.'] as [string, string],
        artwork: art(3, '코드가 표시된 개발용 모니터 화면') },
      { id: 4, order: 4, visible: true, kind: 'sample' as const,
        title: '검수 & 최적화', desc: ['꼼꼼한 검수와 성능 최적화로', '최고의 결과물을 제공합니다.'] as [string, string],
        artwork: art(4, '노트북 옆 체크리스트와 만년필') },
      { id: 5, order: 5, visible: true, kind: 'sample' as const,
        title: '운영 & 성장 지원', desc: ['지속적인 운영 지원과 마케팅으로', '비즈니스 성장을 함께합니다.'] as [string, string],
        artwork: art(5, '악수를 나누는 두 사람') },
    ] as SignatureStep[],
    /**
     * The artwork's "BIZNESTA가 특별한 이유" panel. Every line is a statement of
     * how BIZNESTA works — none of them is a measured result.
     */
    reason: {
      title: { serif: 'BIZNESTA', rest: '가 특별한 이유' },
      items: [
        '비즈니스 목표를 함께 고민하는 파트너십',
        '디자인부터 개발까지 통합 제작',
        '트렌드를 선도하는 감각적인 디자인',
        '안정적이고 확장 가능한 기술력',
        '제작 후에도 든든한 운영 지원',
      ],
      quote: '당신의 성장을 디자인합니다.',
    },
  },

  band: {
    wordmark: { src: '/assets/pc08/logo-wordmark-white.png', alt: 'BIZNESTA', width: 159, height: 30 },
    tagline: 'BUSINESS TOTAL SOLUTION',
    quote: ['단순한 홈페이지 제작이 아닌,', '비즈니스 성장을 위한 최적의 솔루션을 제공합니다.'],
    points: [
      { icon: 'bulb' as const, ko: '전략적 기획', en: 'STRATEGY' },
      { icon: 'pen' as const, ko: '차별화된 디자인', en: 'DESIGN' },
      { icon: 'gear' as const, ko: '안정적인 기술', en: 'SYSTEM' },
      { icon: 'growth' as const, ko: '지속적인 성장', en: 'GROWTH' },
    ],
    cta: { label: '제작 상담하기', href: '/contact?source=portfolio' },
  },
};
