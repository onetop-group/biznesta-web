/**
 * BN_MO_12_SERVICE_SELECT — content.
 *
 * Authored from BN_MO_12_SERVICE.png (1024 x 1536), not from PC 12.
 * Seven service cards in the artwork's own 2 / 2 / 3 editorial grid, each one
 * carrying a real website or device artwork — never generic SaaS pricing
 * cards, and no price appears anywhere on this screen.
 *
 * SNS / IP PROTECTION
 * -------------------
 * Service 03 stays at the published level — 채널 연계 / 콘텐츠 활용 /
 * 온라인 홍보 지원. Nothing describes automation, auto-publishing, channel
 * distribution logic or any internal mechanism.
 *
 * FACTUALITY
 * ----------
 * No price, delivery time, customer, project count, satisfaction score or
 * contact detail appears on this screen.
 */

export type Service = {
  serviceId: number;
  order: number;
  visible: boolean;
  slug: string;
  num: string;
  serviceName: string;
  label: string;
  description: string[];
  ctaLabel: string;
  ctaHref: string;
  tone: 'dark' | 'light';
  image: { webp: string; jpg: string; alt: string };
};

const art = (n: number, alt: string) => ({
  webp: `/assets/mo12/svc-0${n}.webp`,
  jpg: `/assets/mo12/svc-0${n}.jpg`,
  alt,
});

export const mo12 = {
  header: { logo: { src: '/assets/mo12/logo-lockup.png', alt: 'BIZNESTA' }, menuLabel: '메뉴' },

  hero: {
    image: {
      webp: '/assets/mo12/hero.webp', jpg: '/assets/mo12/hero.jpg',
      alt: 'BIZNESTA 홈페이지가 표시된 데스크톱 모니터와 스마트폰',
    },
    eyebrow: 'OUR SERVICE',
    headline: ['당신의 비즈니스에', '필요한 모든 것을,', '한 곳에서.'],
    /* 2026-09-09 줄바꿈만 다시 잡았다 — 문장은 그대로다 */
    body: ['기획부터 제작, 운영까지', '비즈니스 성장을 위한', '토탈 솔루션을 제공합니다.'],
    label: ['BIZNESTA', 'SERVICE'],
  },

  services: [
    { serviceId: 1, order: 1, visible: true, slug: 'website', num: '01', tone: 'dark' as const,
      serviceName: '홈페이지 제작', label: 'WEBSITE',
      description: ['브랜드에 맞는', '맞춤형 홈페이지'],
      ctaLabel: '자세히 보기', ctaHref: '/design',
      image: art(1, '데스크톱과 모바일에 표시된 홈페이지 디자인') },
    { serviceId: 2, order: 2, visible: true, slug: 'contents', num: '02', tone: 'light' as const,
      serviceName: '콘텐츠 기획 · 제작', label: 'CONTENTS',
      description: ['브랜드 스토리가 담긴', '콘텐츠 제작'],
      ctaLabel: '자세히 보기', ctaHref: '/content',
      image: art(2, '카메라와 노트가 놓인 콘텐츠 제작 책상') },
    /* published level only — no automation mechanism is described */
    { serviceId: 3, order: 3, visible: true, slug: 'channel', num: '03', tone: 'light' as const,
      serviceName: '채널 연계 · 운영', label: 'CHANNEL',
      description: ['블로그 · 인스타그램 · 유튜브', '채널 연계 운영'],
      ctaLabel: '자세히 보기', ctaHref: '/content',
      image: art(3, 'SNS 채널이 열린 스마트폰') },
    { serviceId: 4, order: 4, visible: true, slug: 'marketing', num: '04', tone: 'light' as const,
      serviceName: '온라인 마케팅', label: 'MARKETING',
      description: ['검색 노출 · 광고', '채널 운영'],
      ctaLabel: '자세히 보기', ctaHref: '/content',
      image: art(4, '성장 그래프가 표시된 노트북') },
    { serviceId: 5, order: 5, visible: true, slug: 'management', num: '05', tone: 'light' as const,
      serviceName: '운영 · 관리 대행', label: 'MANAGEMENT',
      description: ['업데이트 · 게시물 관리', '데이터 분석'],
      ctaLabel: '자세히 보기', ctaHref: '/admin-system',
      image: art(5, '운영 현황이 표시된 태블릿') },
    { serviceId: 6, order: 6, visible: true, slug: 'store', num: '06', tone: 'light' as const,
      serviceName: '쇼핑몰 · 온라인 스토어', label: 'ONLINE STORE',
      description: ['제품과 서비스를 파는', '온라인 스토어 구축'],
      ctaLabel: '자세히 보기', ctaHref: '/design',
      image: art(6, '온라인 스토어 화면이 표시된 태블릿') },
    { serviceId: 7, order: 7, visible: true, slug: 'consulting', num: '07', tone: 'light' as const,
      serviceName: '교육 · 컨설팅', label: 'CONSULTING',
      description: ['실무 중심의 교육과', '맞춤 컨설팅'],
      ctaLabel: '자세히 보기', ctaHref: '/solution',
      image: art(7, '노트와 커피가 놓인 컨설팅 책상') },
  ] as Service[],

  band: {
    quote: ['좋은 비즈니스는', '좋은 파트너와 함께 더 멀리 갑니다.'],
    body: '비즈네스타와 함께, 지금 더 큰 가능성을 시작하세요.',
    label: 'BIZNESTA',
    cta: { label: '지금 문의하기', href: '/contact?source=service' },
  },

  support: [
    { icon: 'chat' as const, label: '빠른 상담' },
    { icon: 'doc' as const, label: '맞춤 제안' },
    { icon: 'people' as const, label: '전문가 1:1 상담' },
  ],
};
