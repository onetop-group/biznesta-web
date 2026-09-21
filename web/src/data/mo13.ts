/**
 * BN_MO_13_PRICE — content.
 *
 * Authored from BN_MO_13_PRICE.png (1024 x 1536), not from PC 13.
 *
 * PRICE POLICY — READ BEFORE EDITING
 * ----------------------------------
 * BIZNESTA's selling prices are NOT confirmed. The amounts printed in the
 * artwork (690,000원~ / 1,290,000원~ / 2,490,000원~) are draft figures from the
 * design mock-up, not agreed prices, so they are NOT published. Each plan
 * carries `priceLabel: '상담 후 안내'` — except the total-solution plan, whose
 * artwork label '맞춤 견적' is already factual and is kept.
 *
 * The price slot keeps the artwork's exact position, size, weight and gold
 * colour, so a confirmed price can be dropped into `priceLabel` later with no
 * layout change at all. This matches the decision already made for PC 13.
 *
 * SCHEDULE / AFTER-CARE
 * ---------------------
 * The artwork's last feature row read "제작 후 1개월 / 3개월 / 6개월 관리".
 * Those windows are commercial terms tied to the unconfirmed pricing, so the
 * row keeps its position and reads "제작 후 관리 지원". Restore the months here
 * once BIZNESTA fixes them.
 *
 * NO PERFORMANCE OR POPULARITY CLAIM
 * ----------------------------------
 * The artwork badged the middle plan "BEST" and described it as
 * "가장 인기 있는 기본 플랜". BIZNESTA has no sales history, so the badge reads
 * "추천" (BIZNESTA's own recommendation, as on PC 13) and the line reads
 * "표준 제작 플랜". No customer count, project count or satisfaction figure
 * appears anywhere on this screen.
 */

export type PricePlan = {
  planId: number;
  order: number;
  visible: boolean;
  slug: string;
  /** the artwork marks the middle plan with a 추천 badge */
  featured: boolean;
  icon: 'sprout' | 'crown' | 'diamond' | 'gear';
  label: string;
  name: string;
  desc: [string, string];
  /** unconfirmed until BIZNESTA fixes pricing — see the file header */
  priceLabel: string;
  features: string[];
  ctaLabel: string;
  ctaHref: string;
};

/** Used for every plan whose amount is not confirmed. */
const TBC = '상담 후 안내';
/** Used where the artwork committed to an after-care window. */
const CARE = '제작 후 관리 지원';

export const mo13 = {
  header: { logo: { src: '/assets/mo13/logo-lockup.png', alt: 'BIZNESTA' }, menuLabel: '메뉴' },

  hero: {
    image: {
      webp: '/assets/mo13/hero.webp', jpg: '/assets/mo13/hero.jpg',
      alt: 'BIZNESTA 홈페이지가 표시된 태블릿과 스마트폰',
    },
    eyebrow: 'PRICE PLAN',
    headline: ['지금,', '당신의 비즈니스에', '가장 잘 맞는', '시작을 선택하세요.'],
    /* 2026-09-09 줄바꿈만 다시 잡았다 — 문장은 그대로다 */
    body: [
      '비즈네스타는',
      '규모와 목적에 맞는',
      '다양한 제작 옵션으로',
      '최적의 솔루션을 제공합니다.',
    ],
    label: ['GOOD BUSINESS', 'BETTER TOMORROW'],
  },

  plans: {
    title: '제작 플랜 안내',
    sub: '원하는 기능과 범위에 따라 선택할 수 있는 맞춤형 제작 플랜입니다.',
    more: { label: '모든 플랜 비교하기', href: '#plans' },
    badgeLabel: '추천',
    items: [
      { planId: 1, order: 1, visible: true, slug: 'starter', featured: false, icon: 'sprout' as const,
        label: 'STARTER', name: '기본형',
        desc: ['꼭 필요한 핵심만,', '빠르게 시작하는 홈페이지'] as [string, string],
        priceLabel: TBC,
        features: ['메인 + 서브 5페이지 내외', '모바일 최적화', '기본 디자인 제공', '문의폼 연동', CARE],
        ctaLabel: '자세히 보기', ctaHref: '/contact?source=price&plan=starter' },
      { planId: 2, order: 2, visible: true, slug: 'standard', featured: true, icon: 'crown' as const,
        label: 'STANDARD', name: '스탠다드형',
        desc: ['브랜드에 맞춘', '표준 제작 플랜'] as [string, string],
        priceLabel: TBC,
        features: ['메인 + 서브 8~12페이지', '모바일 최적화', '맞춤 디자인 제작',
                   '문의폼 / 지도 / SNS 연동', '기본 SEO 세팅', CARE],
        ctaLabel: '자세히 보기', ctaHref: '/contact?source=price&plan=standard' },
      { planId: 3, order: 3, visible: true, slug: 'premium', featured: false, icon: 'diamond' as const,
        label: 'PREMIUM', name: '프리미엄형',
        desc: ['브랜드 가치를 높이는', '고급 맞춤형 홈페이지'] as [string, string],
        priceLabel: TBC,
        features: ['메인 + 서브 15페이지 이상', '맞춤 기획 & 디자인', '고급 기능 연동',
                   '블로그/콘텐츠 연계', '기본 SEO 세팅', CARE],
        ctaLabel: '자세히 보기', ctaHref: '/contact?source=price&plan=premium' },
      { planId: 4, order: 4, visible: true, slug: 'total', featured: false, icon: 'gear' as const,
        label: 'TOTAL SOLUTION', name: '통합 솔루션형',
        desc: ['홈페이지부터 운영까지', '비즈니스 토탈 패키지'] as [string, string],
        /** the artwork's own label — already factual, so it is kept as is */
        priceLabel: '맞춤 견적',
        features: ['홈페이지 제작', '콘텐츠 기획 / 제작', 'SNS 채널 연계',
                   '온라인 마케팅 컨설팅', '운영 대행 (선택)', '지속적인 관리 및 성장 지원'],
        ctaLabel: '상담 신청', ctaHref: '/contact' },
    ] as PricePlan[],
  },

  band: {
    image: { webp: '/assets/mo13/band.webp', jpg: '/assets/mo13/band.jpg', alt: '' },
    quote: ['단순한 홈페이지 제작이 아닌', '비즈니스의 성장을 함께합니다.'],
    sub: '지금, 비즈네스타에 문의하세요.',
    cta: { label: '무료 상담 신청', href: '/contact?source=price' },
    label: ['YOUR', 'GROWTH', 'PARTNER', 'BIZNESTA'],
  },

  support: [
    { icon: 'chat' as const, label: '빠른 상담' },
    { icon: 'doc' as const, label: '맞춤 제안' },
    { icon: 'people' as const, label: '전문가 1:1 상담' },
  ],
};
