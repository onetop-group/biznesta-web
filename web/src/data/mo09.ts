/**
 * BN_MO_09_CONTENT_GROWTH — content.
 *
 * Authored from BN_MO_09_CONTENT.png (1024 x 1536), not from PC 09.
 * The screen shows that a BIZNESTA site keeps growing after launch: content
 * planning, production, per-channel fit and ongoing upkeep.
 *
 * SNS / IP PROTECTION
 * -------------------
 * Nothing here describes how BIZNESTA's SNS system works. No 자동 발행,
 * 채널 자동 배포, 자동 변환, 자동 스케줄링, AI 운영 프로파일 or internal
 * automation architecture appears in the copy. The published wording stays at
 * 채널 연계 / 콘텐츠 활용 / 온라인 홍보 지원 level — "채널별 최적화" describes the
 * outcome, never the mechanism.
 *
 * FACTUALITY
 * ----------
 * No customer, project count, satisfaction score, growth rate, testimonial or
 * contact detail appears on this screen. The five content examples are
 * BIZNESTA content types, not client work, so the link reads "다양한 콘텐츠
 * 더보기" instead of the artwork's "다양한 활용 사례 보기".
 */

export type ContentItem = {
  contentId: number;
  contentType: string;
  order: number;
  visible: boolean;
  title: string;
  summary: [string, string];
  thumbnail: { webp: string; jpg: string; alt: string };
  publishedAt: string;
};

const thumb = (n: number, alt: string) => ({
  webp: `/assets/mo09/thumb-0${n}.webp`,
  jpg: `/assets/mo09/thumb-0${n}.jpg`,
  alt,
});

export const mo09 = {
  header: { logo: { src: '/assets/mo09/logo-lockup.png', alt: 'BIZNESTA' }, menuLabel: '메뉴' },

  hero: {
    image: {
      webp: '/assets/mo09/hero.webp', jpg: '/assets/mo09/hero.jpg',
      alt: '콘텐츠가 실린 홈페이지가 표시된 스마트폰과 IDEA · PLAN · CONTENT · RESULT 서적',
    },
    eyebrow: 'CONTENT MARKETING',
    headline: ['좋은 콘텐츠가', '좋은 고객을 만듭니다.'],
    /* 2026-09-10 줄바꿈만 다시 잡았다 — 문장은 그대로다 */
    body: [
      '비즈네스타는 홈페이지와 SNS를',
      '연결한 콘텐츠 전략으로',
      '지속적인 노출과 고객 유입을',
      '만들어드립니다.',
    ],
    aside: ['당신의', '이야기가', '사람들에게', '닿을 수 있도록', '비즈네스타가', '함께합니다.'],
  },

  services: {
    title: '콘텐츠 서비스',
    more: { label: '서비스 더보기', href: '/service' },
    items: [
      { serviceId: 1, order: 1, visible: true, icon: 'doc' as const, serviceName: '콘텐츠 기획',
        description: ['브랜드에 맞는', '주제와 스토리로', '기획합니다.'] },
      { serviceId: 2, order: 2, visible: true, icon: 'image' as const, serviceName: '콘텐츠 제작',
        description: ['텍스트, 이미지, 영상까지', '완성도 높은 콘텐츠를', '제작합니다.'] },
      /* outcome only — never how the channel work is performed */
      { serviceId: 3, order: 3, visible: true, icon: 'share' as const, serviceName: '채널별 최적화',
        description: ['홈페이지, 블로그, 인스타,', '유튜브 등 채널에 맞게', '최적화합니다.'] },
      { serviceId: 4, order: 4, visible: true, icon: 'bars' as const, serviceName: '지속적 관리',
        description: ['꾸준한 업데이트로', '브랜드의 성장을', '함께합니다.'] },
    ],
  },

  band: {
    image: { webp: '/assets/mo09/band.webp', jpg: '/assets/mo09/band.jpg', alt: '' },
    headline: ['꾸준한 콘텐츠가', '브랜드를 더 특별하게 만듭니다.'],
    body: '비즈네스타와 함께, 오늘부터 시작해보세요.',
    label: 'BIZNESTA CONTENT',
  },

  examples: {
    title: '콘텐츠 예시',
    /* the artwork said "다양한 활용 사례 보기" — these are content types, not cases */
    more: { label: '다양한 콘텐츠 더보기', href: '#examples' },
    items: [
      { contentId: 1, contentType: 'blog', order: 1, visible: true, publishedAt: '',
        title: '블로그 콘텐츠', summary: ['전문성과 신뢰를 높이는', '스토리 콘텐츠'] as [string, string],
        thumbnail: thumb(1, '블로그 콘텐츠 예시 화면') },
      { contentId: 2, contentType: 'sns', order: 2, visible: true, publishedAt: '',
        title: 'SNS 콘텐츠', summary: ['브랜드를 알리는', '감각적인 콘텐츠'] as [string, string],
        thumbnail: thumb(2, 'SNS 콘텐츠 예시 화면') },
      { contentId: 3, contentType: 'video', order: 3, visible: true, publishedAt: '',
        title: '영상 콘텐츠', summary: ['제품, 서비스, 인터뷰 등', '영상 기획/제작'] as [string, string],
        thumbnail: thumb(3, '영상 콘텐츠 촬영 장면') },
      { contentId: 4, contentType: 'newsletter', order: 4, visible: true, publishedAt: '',
        title: '뉴스레터', summary: ['고객과 꾸준히', '연결되는 소식지'] as [string, string],
        thumbnail: thumb(4, '뉴스레터 예시 화면') },
      { contentId: 5, contentType: 'notice', order: 5, visible: true, publishedAt: '',
        title: '홈페이지 소식/공지', summary: ['업데이트로 살아있는', '홈페이지 운영'] as [string, string],
        thumbnail: thumb(5, '홈페이지 소식 게시 화면') },
    ] as ContentItem[],
  },

  cta: { label: '지금, 콘텐츠 상담하기', href: '/contact?source=content' },

  support: [
    { icon: 'chat' as const, label: '빠른 상담' },
    { icon: 'doc' as const, label: '맞춤 제안' },
    { icon: 'people' as const, label: '전문가 1:1 상담' },
  ],
};
