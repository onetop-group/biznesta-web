/**
 * BN_MO_06_DESIGN_DETAIL — content.
 *
 * Authored from BN_MO_06_DESIGN_DETAIL.png (1024 x 1536), not from PC 06.
 * The mobile artwork leads with a single large phone carrying the whole
 * LUMIÈRE design, then two spec panels, then a five-up page preview row —
 * an editorial design sheet, not a shop product page.
 *
 * NOT A TEMPLATE STORE
 * --------------------
 * BIZNESTA does not sell finished template files. This screen is design
 * inspiration that leads into custom production, so there is no cart, no
 * instant purchase, no download, no licence, no quantity, no delivery and no
 * product option anywhere in the copy or the markup. The single CTA asks to
 * start a build in this style.
 *
 * SAMPLE POLICY
 * -------------
 * LUMIÈRE is a BIZNESTA sample design, not a delivered client project —
 * `kind` records that and no customer is named. The artwork's panel header
 * read "프로젝트 개요", which implies a real past commission; it is published
 * as "디자인 개요" in the same slot and type scale.
 *
 * The artwork printed "제작 기간 : 약 4주". BIZNESTA has not confirmed a
 * delivery time, so — as with PC 13's prices — the slot keeps its position,
 * label and type scale and the value reads "상담 후 안내".
 */

export type DesignDetail = {
  designId: number;
  slug: string;
  order: number;
  visible: boolean;
  kind: 'sample' | 'concept' | 'client';
  sampleName: string;
  category: string;
  industry: string;
};

export const mo06 = {
  header: { logo: { src: '/assets/mo06/logo-lockup.png', alt: 'BIZNESTA' }, menuLabel: '메뉴' },

  back: { label: '목록으로 돌아가기', href: '/design' },
  crumb: ['기업 · 브랜드 홈페이지', '디자인 상세'],

  design: {
    designId: 1,
    slug: 'lumiere',
    order: 1,
    visible: true,
    kind: 'sample' as const,
    sampleName: 'LUMIÈRE',
    category: '기업 · 브랜드 홈페이지',
    industry: '인테리어 · 라이프스타일 브랜드',
  } as DesignDetail,

  hero: {
    image: {
      webp: '/assets/mo06/hero.webp', jpg: '/assets/mo06/hero.jpg',
      alt: 'LUMIÈRE 브랜드 홈페이지 디자인 샘플이 표시된 스마트폰',
    },
    headline: ['신뢰를 만드는', '프리미엄 기업 홈페이지'],
    body: ['브랜드의 가치를 담아,', '전문성과 신뢰가 느껴지는', '기업 홈페이지를 제작했습니다.'],
    features: [
      { icon: 'diamond' as const, lines: ['고급스러운', '브랜드 이미지'] as [string, string] },
      { icon: 'monitor' as const, lines: ['PC + 모바일', '완벽 최적화'] as [string, string] },
      { icon: 'gear' as const, lines: ['운영 편의성', '관리 기능'] as [string, string] },
    ],
  },

  spec: {
    /* the artwork said "프로젝트 개요" — see the file header */
    title: '디자인 개요',
    rows: [
      { label: '업종', value: ['인테리어 · 라이프스타일 브랜드'] },
      { label: '작업 범위', value: ['홈페이지 기획 · 디자인 · 퍼블리싱'] },
      /* BIZNESTA has not fixed a delivery time, so no duration is published */
      { label: '제작 기간', value: ['상담 후 안내'] },
      { label: '주요 기능', value: ['브랜드 소개, 제품/서비스, 갤러리,', '문의 폼, 관리자 페이지'] },
    ],
  },

  points: {
    title: '제작 포인트',
    rows: [
      '브랜드 아이덴티티를 반영한 감각적인 디자인',
      'PC와 모바일 모두 최적화된 반응형 홈페이지',
      '고객 문의를 쉽게 받는 상담 폼 연동',
      '누구나 쉽게 관리할 수 있는 관리자 기능',
    ],
  },

  preview: {
    title: '페이지 미리보기',
    more: { label: '전체 페이지 보기', href: '/design/lumiere' },
    pages: [
      { id: 1, order: 1, visible: true, caption: '메인 페이지',
        image: { webp: '/assets/mo06/page-01.webp', jpg: '/assets/mo06/page-01.jpg', alt: 'LUMIÈRE 메인 페이지 디자인' } },
      { id: 2, order: 2, visible: true, caption: '브랜드 소개',
        image: { webp: '/assets/mo06/page-02.webp', jpg: '/assets/mo06/page-02.jpg', alt: 'LUMIÈRE 브랜드 소개 페이지 디자인' } },
      { id: 3, order: 3, visible: true, caption: '서비스',
        image: { webp: '/assets/mo06/page-03.webp', jpg: '/assets/mo06/page-03.jpg', alt: 'LUMIÈRE 서비스 페이지 디자인' } },
      { id: 4, order: 4, visible: true, caption: '포트폴리오',
        image: { webp: '/assets/mo06/page-04.webp', jpg: '/assets/mo06/page-04.jpg', alt: 'LUMIÈRE 포트폴리오 페이지 디자인' } },
      { id: 5, order: 5, visible: true, caption: '문의하기',
        image: { webp: '/assets/mo06/page-05.webp', jpg: '/assets/mo06/page-05.jpg', alt: 'LUMIÈRE 문의 페이지 디자인' } },
    ],
  },

  /* custom production, never a purchase */
  cta: { label: '지금, 나만의 홈페이지를 제작해보세요', href: '/contact?source=design-detail' },

  support: [
    { icon: 'chat' as const, label: '빠른 상담' },
    { icon: 'doc' as const, label: '맞춤 제안' },
    { icon: 'people' as const, label: '전문가 1:1 상담' },
  ],
};
