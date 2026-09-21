/**
 * BN_MO_04_DESIGN_GALLERY — content.
 *
 * Authored from BN_MO_04_DESIGN_GALLERY.png (1024 x 1536): a filter row over
 * a 2x3 editorial gallery, each card showing a real website artwork on a
 * desktop + phone mockup. Not PC 04 narrowed, and not a thumbnail list.
 *
 * SAMPLE / CONCEPT POLICY
 * -----------------------
 * Every design in this gallery is a BIZNESTA sample, not a delivered client
 * project, so `kind` records that and no card is labelled as a customer case.
 * The artwork's headline read "실제 제작 사례를 만나보세요." — that claims real
 * client work BIZNESTA cannot evidence yet, so the line is published as
 * "디자인 샘플을 지금 만나보세요." in the same slot, at the same size and colour.
 * No customer count, project count or result figure appears on this screen.
 */

export type GalleryItem = {
  id: number;
  order: number;
  visible: boolean;
  slug: string;
  /** BIZNESTA sample work vs. a real commission — no fake client work here */
  kind: 'sample' | 'concept' | 'client';
  title: string;
  category: string;
  artwork: { webp: string; jpg: string; alt: string };
};

const art = (n: string, alt: string) => ({
  webp: `/assets/mo04/card-${n}.webp`,
  jpg: `/assets/mo04/card-${n}.jpg`,
  alt,
});

export const mo04 = {
  header: { logo: { src: '/assets/mo04/logo-lockup.png', alt: 'BIZNESTA' }, menuLabel: '메뉴' },

  hero: {
    image: { webp: '/assets/mo04/hero.webp', jpg: '/assets/mo04/hero.jpg', alt: '' },
    deco: { webp: '/assets/mo04/deco.webp', jpg: '/assets/mo04/deco.jpg',
            alt: 'Good Design Brings Good Business — BIZNESTA PORTFOLIO' },
    eyebrow: 'DESIGN GALLERY',
    /* second line replaces the artwork's "실제 제작 사례를" — see the file header */
    headline: ['다양한 업종의', '디자인 샘플을 지금 만나보세요.'],
    body: ['비즈네스타는 업종의 특성과 목적에 맞는', '홈페이지를 기획하고 디자인합니다.'],
  },

  filters: [
    { slug: 'all', label: '전체 보기', active: true },
    { slug: 'corporate', label: '기업/브랜드', active: false },
    { slug: 'commerce', label: '쇼핑몰', active: false },
    { slug: 'expert', label: '개인/프리랜서', active: false },
    { slug: 'education', label: '교육/강의', active: false },
    { slug: 'medical', label: '병원/의료', active: false },
    { slug: 'realestate', label: '부동산', active: false },
    { slug: 'custom', label: '기타', active: false },
  ],

  items: [
    { id: 1, order: 1, visible: true, slug: 'lumiere', kind: 'sample' as const,
      title: '프리미엄 브랜드 홈페이지', category: '기업/브랜드',
      artwork: art('01', '노트북과 스마트폰에 표시된 프리미엄 브랜드 홈페이지 디자인 샘플') },
    { id: 2, order: 2, visible: true, slug: 'bloom', kind: 'sample' as const,
      title: '뷰티 쇼핑몰', category: '쇼핑몰',
      artwork: art('02', '노트북과 스마트폰에 표시된 뷰티 쇼핑몰 디자인 샘플') },
    { id: 3, order: 3, visible: true, slug: 'edulon', kind: 'sample' as const,
      title: '온라인 강의 홈페이지', category: '교육/강의',
      artwork: art('03', '노트북과 스마트폰에 표시된 온라인 강의 홈페이지 디자인 샘플') },
    { id: 4, order: 4, visible: true, slug: 'saram-clinic', kind: 'sample' as const,
      title: '병원 · 의료 홈페이지', category: '병원/의료',
      artwork: art('04', '노트북과 스마트폰에 표시된 병원 홈페이지 디자인 샘플') },
    { id: 5, order: 5, visible: true, slug: 'the-forest', kind: 'sample' as const,
      title: '부동산 · 분양 홈페이지', category: '부동산',
      artwork: art('05', '노트북과 스마트폰에 표시된 분양 홈페이지 디자인 샘플') },
    { id: 6, order: 6, visible: true, slug: 'min-ji', kind: 'sample' as const,
      title: '개인 · 프리랜서 홈페이지', category: '개인/프리랜서',
      artwork: art('06', '노트북과 스마트폰에 표시된 개인 포트폴리오 디자인 샘플') },
  ] as GalleryItem[],

  band: {
    eyebrow: 'BIZNESTA',
    headline: ['당신의 비즈니스도,', '이렇게 멋질 수 있습니다.'],
    tagline: 'SMALL STEPS, BIG CHANGES',
    cta: { label: '제작 상담하기', href: '/contact?source=design' },
    items: [
      { icon: 'monitor' as const, label: '홈페이지 제작' },
      { icon: 'pen' as const, label: '맞춤 디자인' },
      { icon: 'bars' as const, label: '지속적인 관리' },
    ],
  },
};
