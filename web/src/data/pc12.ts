/**
 * BN_PC_12_SERVICE_SELECT — content.
 *
 * The service menu: six selectable service areas, an advisory bar for
 * customers who do not know what they need, and a closing band.
 * Every service row is ordered and individually editable for Admin.
 *
 * No price appears on this screen; pricing is handled on PC 13 and is
 * not yet confirmed, so nothing here quotes an amount.
 */

export type ServiceItem = {
  id: number;
  slug: string;
  order: number;
  visible: boolean;
  icon: 'monitor' | 'pen' | 'share' | 'gear' | 'bars' | 'bulb';
  title: string;
  desc: [string, string];
  artwork: { webp: string; jpg: string; alt: string };
};

const art = (n: number, alt: string) => ({
  webp: `/assets/pc12/card-0${n}.webp`,
  jpg: `/assets/pc12/card-0${n}.jpg`,
  alt,
});

export const pc12 = {
  header: {
    wordmark: { src: '/assets/pc12/logo-wordmark-navy.png', alt: 'BIZNESTA', width: 190, height: 35.4 },
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
    cta: { label: '제작 상담하기', href: '/contact?source=service' },
  },

  hero: {
    image: {
      webp: '/assets/pc12/hero.webp',
      jpg: '/assets/pc12/hero.jpg',
      alt: '대리석 테이블 위 노트북·모바일에 BIZNESTA 홈페이지가 띄워지고 옆에 유리 사인이 놓인 모습',
    },
    eyebrow: 'SERVICE SELECT',
    headline: ['필요한 서비스만,', '원하는 방식으로.'],
    sub: ['홈페이지부터 SNS, 운영 시스템까지', '당신에게 꼭 맞는 서비스를 선택해보세요.', '비즈네스타가 함께 설계합니다.'],
    englishQuote: ['CHOOSE YOUR SERVICE,', 'BUILD YOUR SUCCESS.'],
    /** Engraved on the glass sign in the hero photograph — kept in the image,
     *  recorded here so the wording stays known if the photo is ever re-shot. */
    plaque: ['필요한 것부터', '하나씩, 그러나', '끝까지 함께합니다.'],
  },

  services: {
    eyebrow: 'OUR SERVICES',
    title: '원하는 서비스를 선택하세요.',
    note: '당신의 비즈니스에 필요한 모든 것을, 한 곳에서.',
    moreLabel: '전체 서비스 보기',
    detailLabel: '자세히 보기',
    items: [
      { id: 1, slug: 'website', order: 1, visible: true, icon: 'monitor' as const,
        title: '홈페이지 제작', desc: ['브랜드에 맞는', '맞춤형 홈페이지 제작'] as [string, string],
        artwork: art(1, '노트북에 표시된 기업 홈페이지 화면') },
      { id: 2, slug: 'brand-design', order: 2, visible: true, icon: 'pen' as const,
        title: '브랜드 & 디자인', desc: ['브랜드 아이덴티티와', '감각적인 디자인'] as [string, string],
        artwork: art(2, '책상 위 브랜드 명함과 인쇄물') },
      { id: 3, slug: 'sns', order: 3, visible: true, icon: 'share' as const,
        title: 'SNS 연계 & 운영', desc: ['블로그, 인스타 등', 'SNS 통합 운영 지원'] as [string, string],
        /* IMAGE ASSET ONLY REPLACEMENT — the previous card-03 photo showed a
           phone whose app tiles carried broken, inaccurate SNS logos. It is
           replaced with the customer-supplied SNS 관리 화면 photograph. Card
           number, icon, copy, border, radius, spacing, typography, button and
           card size are unchanged — only the image file differs.
           Source: 스크린샷 2026-09-06 000808.png, crop (3,283) 350x173. */
        artwork: {
          webp: '/assets/pc12/biznesta-sns-management.webp',
          jpg: '/assets/pc12/biznesta-sns-management.jpg',
          alt: 'SNS 관리 화면이 열린 스마트폰을 손에 들고 있는 사진',
        } },
      { id: 4, slug: 'system', order: 4, visible: true, icon: 'gear' as const,
        title: '운영 시스템 구축', desc: ['문의, 예약, 회원관리 등', '비즈니스 운영 자동화'] as [string, string],
        artwork: art(4, '태블릿에 표시된 운영 대시보드') },
      { id: 5, slug: 'content', order: 5, visible: true, icon: 'bars' as const,
        title: '콘텐츠 제작', desc: ['블로그, 카드뉴스, 영상 등', '지속 가능한 콘텐츠 제작'] as [string, string],
        artwork: art(5, '카메라와 노트북으로 콘텐츠를 편집하는 책상') },
      { id: 6, slug: 'consulting', order: 6, visible: true, icon: 'bulb' as const,
        title: '맞춤 컨설팅', desc: ['업종과 목표에 맞는', '1:1 전략 컨설팅'] as [string, string],
        artwork: art(6, '전략 자료를 펜으로 짚으며 상담하는 모습') },
    ] as ServiceItem[],
  },

  advisory: {
    title: '어떤 서비스가 필요하실지 고민되시나요?',
    desc: '지금 상담을 통해 당신에게 맞는 최적의 서비스를 추천해드립니다.',
    cta: { label: '맞춤 상담 신청하기', href: '/contact?source=service' },
    points: [
      { icon: 'diamond' as const, ko: '맞춤형 제안' },
      { icon: 'people' as const, ko: '전문가 상담' },
      { icon: 'doc' as const, ko: '투명한 견적' },
      { icon: 'gear' as const, ko: '제작 후 지원' },
    ],
  },

  band: {
    image: { webp: '/assets/pc12/band.webp', jpg: '/assets/pc12/band.jpg', alt: '' },
    wordmark: { src: '/assets/pc12/logo-wordmark-white.png', alt: 'BIZNESTA', width: 149, height: 27.8 },
    tagline: 'BUSINESS TOTAL SOLUTION',
    quote: ['좋은 선택이', '더 큰 비즈니스를 만듭니다.'],
    points: [
      { icon: 'monitor' as const, ko: '홈페이지' },
      { icon: 'share' as const, ko: 'SNS 운영' },
      { icon: 'gear' as const, ko: '운영 시스템' },
      { icon: 'play' as const, ko: '콘텐츠 제작' },
      { icon: 'bulb' as const, ko: '맞춤 컨설팅' },
    ],
    cta: { label: '지금 서비스 선택하기', href: '#services' },
    keywords: ['YOUR BUSINESS', 'OUR SOLUTION'],
  },
};
