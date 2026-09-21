import { KAKAO_OPENCHAT_URL } from '@/lib/site';
import { CONSULT_EMAIL, CONSULT_PHONE, VISIT_ADDRESS } from '@/data/business';
/**
 * BN_PC_16_CONTACT — content.
 *
 * CONTACT-DATA POLICY — READ BEFORE EDITING
 * -----------------------------------------
 * BIZNESTA's contact details are NOT confirmed yet, so none of the artwork's
 * contact data is published. Removed and replaced:
 *   전화번호 010-1234-5678            → '추후 안내 예정'
 *   이메일 biznesta@naver.com          → '추후 안내 예정'
 *   주소 경기도 고양시 …                → '주소는 추후 안내 예정입니다.'
 *   교통 지하철 3호선 백마역 …           → '오시는 길은 확정 후 안내드립니다.'
 *   주차 가능                          → '방문 상담은 사전 예약제로 운영 예정입니다.'
 *   상담 가능 시간 평일 09:00-18:00 …   → '상담 가능 시간은 추후 안내 예정입니다.'
 *   지도(실제 주소가 표시된 지도 이미지)   → 위치 안내 플레이스홀더 패널
 * 2026-09-10 — 카카오톡만 실제 오픈프로필 주소가 확정되어 링크로 이었다.
 * No 사업자등록번호 / 통신판매업번호 appears anywhere on this screen.
 *
 * Each replaced value keeps the artwork's exact slot, so a confirmed detail can
 * be dropped into `value` / `text` later with no layout change.
 *
 * The consultation form is Front-only at this stage: it is not wired to any
 * database, mail service or Admin, and it stores nothing.
 */

export type ContactCard = {
  id: number;
  order: number;
  visible: boolean;
  icon: 'phone' | 'kakao' | 'mail' | 'chat';
  title: string;
  /** unconfirmed until BIZNESTA fixes its contact details — see the file header */
  value: string;
  note: string;
  /** 확정된 바깥 주소가 있을 때만 채운다. 값에서 추측하지 않는다. */
  href?: string;
  /** 사이트 밖으로 나가는 링크는 새 탭으로 연다. */
  external?: boolean;
};

export const pc16 = {
  header: {
    wordmark: { src: '/assets/pc16/logo-wordmark-navy.png', alt: 'BIZNESTA', width: 192, height: 35.8 },
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
    cta: { label: '제작 상담하기', href: '/contact?source=contact' },
  },

  hero: {
    image: {
      webp: '/assets/pc16/hero.webp',
      jpg: '/assets/pc16/hero.jpg',
      alt: 'BIZNESTA 사이니지가 걸린 밝은 상담 공간 이미지',
    },
    eyebrow: 'CONTACT BIZNESTA',
    headline: ['지금, 당신의', '비즈니스를 시작하세요.'],
    sub: ['궁금한 점이 있으신가요?', '홈페이지 제작, SNS 연계, 운영 시스템까지', '비즈네스타가 친절하게 상담해드립니다.'],
    englishQuote: ['YOUR BUSINESS,', 'OUR PRIORITY.'],
    panel: {
      quote: ['당신의', '아이디어가', '현실이 되는 곳,', '비즈네스타입니다.'],
      keywords: ['IDEA', 'DESIGN', 'SOLUTION', 'GROWTH'],
    },
  },

  cards: [
    { id: 1, order: 1, visible: true, icon: 'phone' as const,
      title: '전화 상담', value: CONSULT_PHONE, note: '상담 가능 시간은 상담 시 안내드립니다.' },
    { id: 2, order: 2, visible: true, icon: 'kakao' as const,
      /* 2026-09-10 — 실제 카카오톡 오픈프로필 주소를 받아 이었다. 채널이 없던
         시절의 임시 표기(@biznesta / 채널을 검색해 주세요)는 지웠다. 주소는
         모바일과 같은 공통 상수 하나만 쓴다 (src/lib/site.ts).
         칸(왼쪽 89u · 글자 17u · 카드 355u)은 그대로다 — 문구가 짧아 더 여유롭다. */
      title: '카카오톡 상담', value: '카카오톡 상담하기', note: '',
      href: KAKAO_OPENCHAT_URL, external: true },
    { id: 3, order: 3, visible: true, icon: 'mail' as const,
      title: '이메일 문의', value: CONSULT_EMAIL, note: '확인 후 빠르게 답변드립니다.' },
    { id: 4, order: 4, visible: true, icon: 'chat' as const,
      title: '온라인 상담', value: '아래 상담폼을 작성해주세요.', note: '빠르게 답변드리겠습니다.' },
  ] as ContactCard[],

  form: {
    eyebrow: 'ONLINE CONSULTATION',
    title: '제작 상담을 신청하세요.',
    desc: ['간단한 정보만 입력하시면', '비즈네스타가 빠르게 연락드립니다.'],
    fields: {
      name: { label: '이름', required: true, placeholder: '이름을 입력해주세요.' },
      phone: { label: '연락처', required: true, placeholder: '- 없이 숫자만 입력해주세요.' },
      email: { label: '이메일', required: false, placeholder: '이메일을 입력해주세요.' },
      topic: { label: '상담 분야', required: true, placeholder: '선택해주세요.',
        options: ['홈페이지 제작', '브랜드 & 디자인', 'SNS 연계 & 운영', '운영 시스템 구축', '콘텐츠 제작', '맞춤 컨설팅'] },
      message: { label: '상담 내용', required: true, placeholder: '문의 내용을 자세히 작성해주세요.' },
    },
    consent: '개인정보 수집 및 이용에 동의합니다. (필수)',
    consentLink: '자세히 보기',
    cta: '상담 신청하기',
    script: { webp: '/assets/pc16/script.webp', jpg: '/assets/pc16/script.jpg', alt: 'Your Next Stage' },
    aside: ['지금 시작하는', '작은 상담이', '더 큰 성장을 만듭니다.'],
  },

  location: {
    eyebrow: 'LOCATION',
    title: '방문 상담은 사전 예약제로 운영합니다.',
    note: '방문 전에 상담 폼이나 전화로 일정을 확인해 주세요.',
    /* 지도의 이름(스크린리더 · iframe 제목). 지도는 확정된 주소로 바로 그린다. */
    mapPlaceholder: '비즈네스타 사무실 위치 지도',
    rows: [
      { icon: 'pin' as const, text: VISIT_ADDRESS },
      /* 교통 · 주차 · 상담 시간은 아직 확정되지 않아 안전 문구를 유지한다. */
      { icon: 'train' as const, text: '오시는 길은 상담 시 자세히 안내드립니다.' },
      { icon: 'car' as const, text: '방문 상담은 사전 예약제로 운영합니다.' },
      { icon: 'clock' as const, text: '상담 가능 시간은 상담 시 안내드립니다.' },
    ],
  },

  panel: {
    eyebrow: 'BIZNESTA',
    title: ['함께 만드는', '더 큰 성장.'],
    desc: ['비즈네스타는', '당신의 비즈니스에 꼭 맞는', '맞춤 솔루션을 함께 고민합니다.', '지금, 편하게 문의하세요.'],
    items: [
      { icon: 'monitor' as const, ko: '빠른 상담 & 친절한 안내' },
      { icon: 'gear' as const, ko: '맞춤 제안 & 견적' },
      { icon: 'people' as const, ko: '제작부터 운영까지 함께' },
      { icon: 'bars' as const, ko: '지속적인 관리와 지원' },
    ],
    script: { webp: '/assets/pc16/navy-script.webp', jpg: '/assets/pc16/navy-script.jpg', alt: 'Good Business Brighter Tomorrow' },
  },

  band: {
    image: { webp: '/assets/pc16/band.webp', jpg: '/assets/pc16/band.jpg', alt: '' },
    wordmark: { src: '/assets/pc16/logo-wordmark-white.png', alt: 'BIZNESTA', width: 148, height: 27.5 },
    tagline: 'BUSINESS TOTAL SOLUTION',
    quote: ['좋은 파트너가', '좋은 비즈니스를 만듭니다.'],
    points: [
      { icon: 'monitor' as const, ko: '홈페이지 제작' },
      { icon: 'share' as const, ko: 'SNS 연계' },
      { icon: 'gear' as const, ko: '운영 시스템' },
      { icon: 'people' as const, ko: '맞춤 컨설팅' },
      { icon: 'bars' as const, ko: '지속적인 관리' },
    ],
    cta: { label: '제작 상담하기', href: '/contact?source=contact' },
    ctaNote: '지금, 비즈네스타와 함께 시작하세요.',
  },
};
