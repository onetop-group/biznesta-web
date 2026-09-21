/**
 * BN_MO_15_ABOUT — 모바일 ABOUT 콘텐츠.
 *
 * 2026-09-09 개편. 시안(BN_MO_15_ABOUT.png)의 브랜드 분위기 · 색 · 사진 ·
 * 큰 타이포그래피 언어는 그대로 두고, **모바일에서 읽는 분량**으로 다시 짰다.
 * 사용자가 확정해 준 문구만 쓴다 — 여기서 새로 지어낸 문장은 없다.
 *
 * 덜어낸 것 (사용자 지시)
 *   · 히어로의 GOOD BUSINESS / BETTER TOMORROW
 *   · 비전의 세로 인용 「당신의 / 가능성이 / 더 멀리, / 더 높이.」
 *   · 비전의 YOUR / GROWTH / PARTNER 와 BIZNESTA 표기
 *   · 마무리의 BIZNESTA + 가로선 장식
 *   설명문은 각 섹션 두 줄로 줄였다(같은 뜻이 세 번 반복되던 것을 한 번으로).
 *
 * 사실성
 * ------
 * 인원 · 사무실 · 설립일 · 고객 수 · 프로젝트 수 · 수상 · 인증 · 제휴를
 * 말하는 문장은 이 화면에 하나도 없다. 사진에도 인물이 없어 대체할 것이 없었다.
 */

export const mo15 = {
  header: { logo: { src: '/assets/mo15/logo-lockup.png', alt: 'BIZNESTA' }, menuLabel: '메뉴' },

  hero: {
    image: {
      webp: '/assets/mo15/hero.webp', jpg: '/assets/mo15/hero.jpg',
      alt: '햇살이 드는 밝은 실내 공간',
    },
    eyebrow: 'ABOUT US',
    headline: ['좋은 비즈니스는', '좋은 홈페이지에서', '시작됩니다.'],
    body: ['비즈니스의 첫인상부터', '성장을 위한 온라인 구조까지 함께 설계합니다.'],
  },

  brand: {
    image: {
      webp: '/assets/mo15/brand.webp', jpg: '/assets/mo15/brand.jpg',
      alt: 'BIZNESTA 홈페이지가 열린 노트북과 식물이 있는 책상',
    },
    eyebrow: 'BRAND STORY',
    headline: ['당신의 가능성을', '더 크게, 더 멀리.'],
    body: ['사업의 목적을 이해하고,', '그에 맞는 홈페이지를 설계합니다.'],
    items: [
      ['사람을 이해하는', '기획'],
      ['브랜드를 살리는', '디자인'],
      ['지속 가능한', '성장 지원'],
    ] as [string, string][],
  },

  vision: {
    image: {
      webp: '/assets/mo15/vision.webp', jpg: '/assets/mo15/vision.jpg',
      alt: '도시 전경이 보이는 창가',
    },
    eyebrow: 'OUR VISION',
    headline: ['더 많은 사람들이', '자신의 가치를 온라인에서', '실현하는 세상'],
    body: ['디자인과 기술, 전략을 연결해', '비즈니스의 가능성을 더 크게 만듭니다.'],
  },

  closing: {
    quote: ['홈페이지는 끝이 아닌,', '새로운 시작입니다.'],
    sub: ['BIZNESTA와 함께', '당신의 다음을 시작하세요.'],
    cards: [
      { id: 1, order: 1, visible: true, caption: '더 좋은 아이디어로',
        image: { webp: '/assets/mo15/card-01.webp', jpg: '/assets/mo15/card-01.jpg',
                 alt: '노트와 펜이 놓인 책상 위 머그컵' } },
      { id: 2, order: 2, visible: true, caption: '더 아름다운 디자인으로',
        image: { webp: '/assets/mo15/card-02.webp', jpg: '/assets/mo15/card-02.jpg',
                 alt: '밝은 공간에 놓인 화분' } },
      { id: 3, order: 3, visible: true, caption: '더 큰 성공으로',
        image: { webp: '/assets/mo15/card-03.webp', jpg: '/assets/mo15/card-03.jpg',
                 alt: 'WEBSITE · MARKETING · BRAND · SUCCESS 라벨이 붙은 책' } },
    ],
  },

  cta: { label: '비즈네스타와 함께 시작하기', href: '/contact?source=about' },

  support: [
    { icon: 'chat' as const, label: '빠른 상담' },
    { icon: 'doc' as const, label: '맞춤 제안' },
    { icon: 'people' as const, label: '전문가 1:1 상담' },
  ],
};
