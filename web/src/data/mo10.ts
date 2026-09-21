/**
 * BN_MO_10_ADMIN_SYSTEM — content.
 *
 * Authored from BN_MO_10_ADMIN.png (1024 x 1536), not from PC 10.
 * This is a FRONT screen that argues "a BIZNESTA site can actually be run",
 * not the Admin itself. No Supabase, DB, Auth, Storage or RLS is involved,
 * and no admin function is implemented — only the value is shown.
 *
 * DEMO DATA
 * ---------
 * The dashboard numbers in the artwork (12 / 8 / 47 / 1,280 and the small
 * deltas) stay inside the photographed phone as DEMO UI. As agreed for
 * PC 10, they are NOT reproduced as HTML copy anywhere, so nothing on this
 * screen can be read as a BIZNESTA result.
 *
 * The five capabilities below are exactly the ones the artwork draws — no
 * extra feature has been invented.
 */

export type AdminFeature = {
  id: number;
  order: number;
  visible: boolean;
  slug: string;
  icon: 'people' | 'clipboard' | 'doc' | 'image' | 'gear';
  title: string;
  desc: [string, string];
};

export const mo10 = {
  header: { logo: { src: '/assets/mo10/logo-lockup.png', alt: 'BIZNESTA' }, menuLabel: '메뉴' },

  hero: {
    image: {
      webp: '/assets/mo10/hero.webp', jpg: '/assets/mo10/hero.jpg',
      alt: 'BIZNESTA 관리자 페이지 데모 화면이 표시된 스마트폰',
    },
    eyebrow: 'ADMIN SYSTEM',
    headline: ['운영이 쉬워야', '비즈니스가', '성장합니다.'],
    /* 2026-09-10 줄바꿈만 다시 잡았다 — 문장은 그대로다 */
    body: [
      '비즈네스타는',
      '누구나 쉽게 관리할 수 있는',
      '직관적인 관리자 페이지를',
      '제공합니다.',
    ],
  },

  features: {
    title: '주요 관리자 기능',
    more: { label: '더보기', href: '#features' },
    items: [
      { id: 1, order: 1, visible: true, slug: 'inquiry', icon: 'people' as const,
        title: '문의/상담 관리', desc: ['실시간 문의 확인', '상담 현황 관리'] as [string, string] },
      { id: 2, order: 2, visible: true, slug: 'project', icon: 'clipboard' as const,
        title: '프로젝트 관리', desc: ['제작 진행 상황', '일정 관리'] as [string, string] },
      { id: 3, order: 3, visible: true, slug: 'content', icon: 'doc' as const,
        title: '콘텐츠 관리', desc: ['블로그/공지', '손쉬운 등록·수정'] as [string, string] },
      { id: 4, order: 4, visible: true, slug: 'assets', icon: 'image' as const,
        title: '디자인 자료실', desc: ['제작 이미지', '한눈에 관리'] as [string, string] },
      { id: 5, order: 5, visible: true, slug: 'settings', icon: 'gear' as const,
        title: '사이트 설정', desc: ['기본 정보, 메뉴', '간단한 설정'] as [string, string] },
    ] as AdminFeature[],
  },

  preview: {
    title: '관리자 페이지 미리보기',
    more: { label: '전체 화면 보기', href: '#preview' },
    /* every screen below is a DEMO interface, never a BIZNESTA record */
    screens: [
      { id: 1, order: 1, visible: true, caption: '대시보드',
        image: { webp: '/assets/mo10/adm-01.webp', jpg: '/assets/mo10/adm-01.jpg', alt: '관리자 대시보드 데모 화면' } },
      { id: 2, order: 2, visible: true, caption: '문의 관리',
        image: { webp: '/assets/mo10/adm-02.webp', jpg: '/assets/mo10/adm-02.jpg', alt: '문의 관리 데모 화면' } },
      { id: 3, order: 3, visible: true, caption: '프로젝트 관리',
        image: { webp: '/assets/mo10/adm-03.webp', jpg: '/assets/mo10/adm-03.jpg', alt: '프로젝트 관리 데모 화면' } },
      { id: 4, order: 4, visible: true, caption: '콘텐츠 관리',
        image: { webp: '/assets/mo10/adm-04.webp', jpg: '/assets/mo10/adm-04.jpg', alt: '콘텐츠 관리 데모 화면' } },
      { id: 5, order: 5, visible: true, caption: '사이트 설정',
        image: { webp: '/assets/mo10/adm-05.webp', jpg: '/assets/mo10/adm-05.jpg', alt: '사이트 설정 데모 화면' } },
    ],
  },

  band: {
    quote: ['당신의 비즈니스를 더 편리하게,', '비즈네스타가 함께합니다.'],
    cta: { label: '지금 시작하기', href: '/contact?source=admin' },
  },

  support: [
    { icon: 'chat' as const, label: '빠른 상담' },
    { icon: 'doc' as const, label: '맞춤 제안' },
    { icon: 'people' as const, label: '전문가 1:1 상담' },
  ],
};
