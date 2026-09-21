/**
 * BN_PC_13_PRICE — content.
 *
 * PRICE POLICY — READ BEFORE EDITING
 * ----------------------------------
 * BIZNESTA's selling prices are NOT confirmed yet. The amounts printed in the
 * original artwork (80만원~ / 150만원~ / 250만원~ and the add-on amounts) are
 * draft figures from the design mock-up, not agreed prices, so they are NOT
 * published. Every plan and add-on therefore carries `priceLabel: '상담 후 안내'`
 * — except CUSTOM, whose artwork label '별도 견적' is already factual.
 *
 * The price slot keeps the artwork's exact position, size, weight and gold
 * colour, so when a real price is confirmed it can be dropped into
 * `priceLabel` (e.g. '80만원~') with no layout change at all.
 *
 * Nothing else on this screen states an amount, a discount, or a comparison.
 */

export type PricePlan = {
  id: number;
  slug: string;
  order: number;
  visible: boolean;
  /** the artwork marks STANDARD with a 추천 badge */
  featured: boolean;
  name: string;
  tagline: string;
  desc: [string, string];
  /** unconfirmed until BIZNESTA fixes pricing — see the file header */
  priceLabel: string;
  features: string[];
  cta: string;
};

export type AddOn = {
  id: number;
  order: number;
  visible: boolean;
  icon: 'headset' | 'pen' | 'gear' | 'share' | 'megaphone' | 'bars';
  title: string;
  note?: string;
  priceLabel: string;
};

/** Used for every plan and add-on whose amount is not confirmed. */
const TBC = '상담 후 안내';

export const pc13 = {
  header: {
    wordmark: { src: '/assets/pc13/logo-wordmark-navy.png', alt: 'BIZNESTA', width: 192, height: 35.8 },
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
    cta: { label: '제작 상담하기', href: '/contact?source=price' },
  },

  hero: {
    image: {
      webp: '/assets/pc13/hero.webp',
      jpg: '/assets/pc13/hero.jpg',
      alt: '밝은 책상 위 노트북과 모바일에 BIZNESTA 홈페이지가 띄워진 모습',
    },
    eyebrow: 'PRICE PLAN',
    headline: ['합리적인 비용으로,', '더 큰 가치를 만듭니다.'],
    sub: ['비즈네스타는 단순한 홈페이지 제작이 아닌,', '비즈니스 성장을 위한 최적의 솔루션을 제공합니다.'],
    panel: {
      quote: ['투자의 가치는', '결과로 증명됩니다.'],
      keywords: ['BIZNESTA', 'FAIR PRICE,', 'REAL GROWTH.'],
    },
  },

  plans: {
    eyebrow: 'PRICE PLAN',
    title: ['제작 플랜을', '선택하세요.'],
    desc: ['비즈니스의 목적과 예산에 맞춰', '가장 적합한 플랜을 제안해드립니다.'],
    points: [
      { icon: 'diamond' as const, ko: '고객 맞춤 견적' },
      { icon: 'clock' as const, ko: '추가 비용 없는 투명한 비용' },
      { icon: 'people' as const, ko: '제작 후에도 지속적인 지원' },
    ],
    badgeLabel: '추천',
    items: [
      { id: 1, slug: 'basic', order: 1, visible: true, featured: false,
        name: 'BASIC', tagline: '필요한 것만, 실속 있게',
        desc: ['소규모 비즈니스를 위한', '기본 홈페이지'] as [string, string],
        priceLabel: TBC,
        features: ['메인 + 서브 3~5페이지', '모바일 최적화', '기본 디자인 템플릿', '문의 폼 연동'],
        cta: '상담 신청하기' },
      { id: 2, slug: 'standard', order: 2, visible: true, featured: true,
        name: 'STANDARD', tagline: '가장 많은 선택, 균형 있는 구성',
        desc: ['브랜드를 효과적으로 보여주는', '표준 홈페이지'] as [string, string],
        priceLabel: TBC,
        features: ['메인 + 서브 6~10페이지', '모바일 최적화', '브랜드 맞춤 디자인', '문의 폼 / 지도 / SNS 연동', '기본 SEO 세팅'],
        cta: '상담 신청하기' },
      { id: 3, slug: 'premium', order: 3, visible: true, featured: false,
        name: 'PREMIUM', tagline: '차별화된 디자인과 기능',
        desc: ['브랜드 가치를 높이는', '프리미엄 홈페이지'] as [string, string],
        priceLabel: TBC,
        features: ['메인 + 서브 10~15페이지', '모바일 최적화', '맞춤형 디자인', '예약 / 결제 / 회원 기능 연동', '블로그·SNS 연동', '기본 SEO + 분석툴 연동'],
        cta: '상담 신청하기' },
      { id: 4, slug: 'custom', order: 4, visible: true, featured: false,
        name: 'CUSTOM', tagline: '당신만을 위한 맞춤 제작',
        desc: ['비즈니스에 꼭 맞는', '올인원 솔루션'] as [string, string],
        /** the artwork's own label — already factual, so it is kept as is */
        priceLabel: '별도 견적',
        features: ['기획부터 맞춤 설계', '디자인 100% 커스터마이징', '다양한 기능 개발 연동', '운영 시스템 구축', '마케팅 컨설팅 포함', '지속적인 유지보수 지원'],
        cta: '맞춤 상담하기' },
    ] as PricePlan[],
    panel: {
      title: ['홈페이지는 비용이 아닌,', '성장을 위한 투자입니다.'],
      checks: ['업종별 맞춤 견적', '추가 비용 없는 투명한 안내', '제작 후 운영까지 함께', '장기적인 파트너십'],
      brand: ['BIZNESTA', 'YOUR GROWTH PARTNER'],
    },
  },

  addons: {
    eyebrow: 'ADD-ON SERVICE',
    title: ['추가로 이런 서비스도', '함께 이용할 수 있습니다.'],
    items: [
      { id: 1, order: 1, visible: true, icon: 'headset' as const, title: '도메인 & 호스팅', priceLabel: TBC },
      { id: 2, order: 2, visible: true, icon: 'pen' as const, title: '로고 & 브랜드 디자인', priceLabel: TBC },
      { id: 3, order: 3, visible: true, icon: 'gear' as const, title: '콘텐츠 제작 대행',
        note: '(블로그, 카드뉴스 등)', priceLabel: TBC },
      { id: 4, order: 4, visible: true, icon: 'share' as const, title: 'SNS 채널 연동', priceLabel: TBC },
      { id: 5, order: 5, visible: true, icon: 'megaphone' as const, title: '온라인 마케팅 세팅', priceLabel: TBC },
      { id: 6, order: 6, visible: true, icon: 'bars' as const, title: '운영 컨설팅',
        note: '(채널운영, 콘텐츠 전략)', priceLabel: TBC },
    ] as AddOn[],
  },

  band: {
    image: { webp: '/assets/pc13/band.webp', jpg: '/assets/pc13/band.jpg', alt: '' },
    wordmark: { src: '/assets/pc13/logo-wordmark-white.png', alt: 'BIZNESTA', width: 155, height: 28.9 },
    tagline: 'BUSINESS TOTAL SOLUTION',
    quote: ['당신의 비즈니스에 가장 빛나는 선택,', '비즈네스타가 함께합니다.'],
    points: [
      { icon: 'handshake' as const, ko: '합리적인 비용' },
      { icon: 'diamond' as const, ko: '높은 퀄리티' },
      { icon: 'people' as const, ko: '지속적인 파트너십' },
      { icon: 'bars' as const, ko: '더 큰 비즈니스 성장' },
    ],
    cta: { label: '제작 상담하기', href: '/contact?source=price' },
  },
};
