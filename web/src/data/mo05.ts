/**
 * BN_MO_05_CATEGORY_DETAIL — content.
 *
 * Authored from BN_MO_05_CATEGORY_DETAIL.png (1024 x 1536), not from PC 05.
 * The mobile artwork opens with a laptop + phone mockup carrying a real
 * website design, then a four-column capability panel, an ivory
 * recommendation panel, a three-up design row and the closing band — that
 * composition is reproduced as drawn, not folded into a single column.
 *
 * SAMPLE / CONCEPT POLICY
 * -----------------------
 * The three designs in the row are BIZNESTA samples, not delivered client
 * work, so `kind` records that and no card names a customer. The artwork's
 * section header read "제작 사례" / "더 많은 사례 보기"; "사례" reads as a real
 * past commission, so — as on MO 04 — the header is published as
 * "디자인 샘플" / "더 많은 샘플 보기" in the same slot and type scale.
 *
 * CATEGORY DATA
 * -------------
 * `category` carries the id / slug / order / visible fields so the Admin can
 * drive this page later. The displayed name is the artwork's own wording;
 * BIZNESTA's canonical 15-category taxonomy lives in src/data/mo03.ts and the
 * two have deliberately NOT been merged here.
 */

export const mo05 = {
  header: { logo: { src: '/assets/mo05/logo-lockup.png', alt: 'BIZNESTA' }, menuLabel: '메뉴' },

  back: { label: '카테고리로 돌아가기', href: '/category' },

  category: {
    categoryId: 1,
    categorySlug: 'corporate-brand',
    categoryName: '기업 · 브랜드 홈페이지',
    order: 1,
    visible: true,
    num: '01',
  },

  hero: {
    image: {
      webp: '/assets/mo05/hero.webp', jpg: '/assets/mo05/hero.jpg',
      alt: '노트북과 스마트폰에 표시된 기업 · 브랜드 홈페이지 디자인 샘플',
    },
    headline: ['신뢰를 만드는', '프리미엄 홈페이지'],
    body: ['브랜드의 가치를 제대로 전달하는', '기업 · 브랜드 홈페이지를', '기획부터 제작까지 함께합니다.'],
  },

  features: [
    { id: 1, order: 1, visible: true, icon: 'diamond' as const, title: '전문적인 기획',
      sub: ['업종과 목적에 맞는', '전략 설계'] as [string, string] },
    { id: 2, order: 2, visible: true, icon: 'pen' as const, title: '맞춤형 디자인',
      sub: ['브랜드 아이덴티티를', '살린 고급 디자인'] as [string, string] },
    { id: 3, order: 3, visible: true, icon: 'monitor' as const, title: '모바일 최적화',
      sub: ['PC와 모바일 모두', '완벽한 반응형'] as [string, string] },
    { id: 4, order: 4, visible: true, icon: 'gear' as const, title: '운영까지 지원',
      sub: ['업데이트, 유지보수', '지속적인 관리'] as [string, string] },
  ],

  recommend: {
    script: { webp: '/assets/mo05/script-for.webp', jpg: '/assets/mo05/script-for.jpg', alt: 'For Your Business' },
    title: '이런 분들께 추천합니다.',
    rows: [
      '브랜드의 신뢰도를 높이고 싶은 기업/회사',
      '전문적인 비즈니스 이미지를 구축하고 싶은 분',
      '오래 사용할 수 있는 안정적인 홈페이지가 필요한 분',
    ],
  },

  gallery: {
    /* the artwork said "제작 사례" — see the file header */
    title: '디자인 샘플',
    more: { label: '더 많은 샘플 보기', href: '/design' },
    items: [
      { id: 1, order: 1, visible: true, slug: 'construction', kind: 'sample' as const,
        caption: '건설 · 부동산 기업 홈페이지',
        artwork: { webp: '/assets/mo05/art-01.webp', jpg: '/assets/mo05/art-01.jpg',
                   alt: '건설 · 부동산 기업 홈페이지 디자인 샘플' } },
      { id: 2, order: 2, visible: true, slug: 'consulting', kind: 'sample' as const,
        caption: '기업 컨설팅 홈페이지',
        artwork: { webp: '/assets/mo05/art-02.webp', jpg: '/assets/mo05/art-02.jpg',
                   alt: '기업 컨설팅 홈페이지 디자인 샘플' } },
      { id: 3, order: 3, visible: true, slug: 'manufacturing', kind: 'sample' as const,
        caption: '제조 · 기술 기업 홈페이지',
        artwork: { webp: '/assets/mo05/art-03.webp', jpg: '/assets/mo05/art-03.jpg',
                   alt: '제조 · 기술 기업 홈페이지 디자인 샘플' } },
    ],
  },

  band: {
    script: { webp: '/assets/mo05/script-good.webp', jpg: '/assets/mo05/script-good.jpg', alt: 'Good Business Together' },
    quote: ['당신의 브랜드가 더 빛날 수 있도록.', '비즈네스타가 함께하겠습니다.'],
  },

  cta: { label: '지금 제작 상담하기', href: '/contact?source=category' },

  support: [
    { icon: 'chat' as const, label: '빠른 상담' },
    { icon: 'doc' as const, label: '맞춤 제안' },
    { icon: 'people' as const, label: '전문가 1:1 상담' },
  ],
};
