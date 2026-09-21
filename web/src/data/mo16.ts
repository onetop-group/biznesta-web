import { kakaoSearchUrl } from '@/lib/map';
import { KAKAO_OPENCHAT_URL } from '@/lib/site';
import { CONSULT_EMAIL, CONSULT_PHONE, VISIT_ADDRESS, VISIT_ADDRESS_LINES } from '@/data/business';
/**
 * BN_MO_16_CONTACT — content.
 *
 * Authored from BN_MO_16_CONTACT.png (1024 x 1536), not from PC 16.
 *
 * CONTACT DETAILS — READ BEFORE EDITING
 * -------------------------------------
 * BIZNESTA has NOT confirmed any contact detail, so none is published. The
 * artwork printed a phone number (010-1234-5678), an e-mail address
 * (biznesta@biznesta.kr), a street address (경기도 고양시 …) and office hours
 * (평일 09:00 - 18:00 / 주말·공휴일 휴무). Every one of those is a placeholder
 * from the design mock-up, not a real BIZNESTA channel, so each slot keeps its
 * exact position, size, weight and colour and carries a non-committal label
 * instead. Drop the confirmed value into `value` / `lines` when BIZNESTA fixes
 * it — the layout does not change.
 *
 * No business-registration number, mail-order registration number, KakaoTalk
 * ID, map, representative name or office location appears anywhere on this
 * screen, and none was invented.
 *
 * THE FORM IS UI ONLY
 * -------------------
 * The consultation form is markup and styling only: no submit handler, no
 * database, no mail delivery, no webhook. Wiring it up is a later, separately
 * approved step.
 */

export type ContactCard = {
  cardId: number;
  order: number;
  visible: boolean;
  icon: 'phone' | 'kakao' | 'mail' | 'pin';
  title: string;
  /** one accent line (cards 1 and 3) — never a real number until confirmed */
  value?: string;
  /** two plain lines (cards 2 and 4) */
  lines?: [string, string];
  /** two plain note lines under an accent value */
  notes?: [string, string];
  button?: { label: string; href: string; tone: 'solid' | 'outline'; external?: boolean };
};

/** Used for every channel BIZNESTA has not confirmed. */
const TBC = '상담 신청 후 안내';

export const mo16 = {
  header: { logo: { src: '/assets/mo16/logo-lockup.png', alt: 'BIZNESTA' }, menuLabel: '메뉴' },

  hero: {
    image: {
      webp: '/assets/mo16/hero.webp', jpg: '/assets/mo16/hero.jpg',
      alt: '노트북과 식물이 놓인 밝은 상담 공간',
    },
    eyebrow: 'CONTACT',
    headline: ['지금, 비즈네스타와', '상담해보세요.'],
    /* 2026-09-09 줄바꿈만 다시 잡았다 — 문장은 그대로다 */
    body: [
      '당신의 비즈니스에 꼭 맞는',
      '홈페이지와',
      '온라인 마케팅 전략을',
      '함께 만들어드립니다.',
    ],
    label: ['GOOD BUSINESS', 'BETTER TOMORROW'],
  },

  cards: [
    { cardId: 1, order: 1, visible: true, icon: 'phone' as const, title: '전화 상담',
      value: CONSULT_PHONE, notes: ['상담 가능 시간은', '상담 시 안내드립니다.'] },
    { cardId: 2, order: 2, visible: true, icon: 'kakao' as const, title: '카카오톡 상담',
      lines: ['빠르고 간편하게', '상담하세요.'],
      /* 2026-09-10 — 사용자가 만든 카카오톡 오픈채팅방 주소를 받아 이었다.
         주소는 src/lib/site.ts 한 곳에만 둔다. 버튼 문구도 실제 동작에 맞춰
         「카카오톡 상담하기」 로 되돌린다 — 시안의 원래 문구이고, .solid 의
         고정 폭(233.1 unit)이 바로 이 문구의 렌더 폭이라 크기·위치가 그대로다. */
      button: { label: '카카오톡 상담하기', href: KAKAO_OPENCHAT_URL,
                tone: 'solid' as const, external: true } },
    { cardId: 3, order: 3, visible: true, icon: 'mail' as const, title: '이메일 문의',
      value: CONSULT_EMAIL, notes: ['확인 후', '빠르게 답변드립니다.'] },
    /* 232 unit 카드에 두 줄만 들어간다. 주소 전체는 PC CONTACT 의 LOCATION
       영역과 개인정보처리방침에 그대로 싣고, 이 카드에는 두 줄로 나눠 적는다.
       2026-09-09 — 사업장 주소가 확정되어 카카오맵 검색 링크를 이었다.
       좌표를 만들지 않고 방문 안내 주소(VISIT_ADDRESS) 하나만 넘긴다. */
    { cardId: 4, order: 4, visible: true, icon: 'pin' as const, title: '오시는 길',
      lines: [VISIT_ADDRESS_LINES[0], VISIT_ADDRESS_LINES[1]],
      button: { label: '지도 바로보기', href: kakaoSearchUrl(VISIT_ADDRESS),
                tone: 'outline' as const, external: true } },
  ] as ContactCard[],

  form: {
    image: {
      webp: '/assets/mo16/form.webp', jpg: '/assets/mo16/form.jpg',
      alt: '식물과 의자가 있는 밝은 상담 공간',
    },
    title: '1:1 맞춤 상담 신청',
    sub: ['간단한 정보를 남겨주시면', '비즈네스타가 빠르게', '연락드리겠습니다.'],
    fields: {
      name: '이름 *',
      contact: '연락처 *',
      kind: '문의 유형을 선택해주세요. *',
      kindOptions: ['홈페이지 제작', '콘텐츠 기획 · 제작', '채널 연계 · 운영', '온라인 마케팅',
                    '운영 · 관리 대행', '쇼핑몰 · 온라인 스토어', '교육 · 컨설팅', '기타 문의'],
      message: '문의 내용을 입력해주세요. *',
      counter: '0/500',
    },
    consent: { label: '개인정보 수집 및 이용에 동의합니다.', required: '(필수)',
               more: { label: '자세히 보기', href: '/privacy' } },
    submit: '상담 신청하기',
  },

  band: {
    image: { webp: '/assets/mo16/band.webp', jpg: '/assets/mo16/band.jpg', alt: '' },
    headline: ['좋은 시작이', '더 큰 성장을 만듭니다.'],
    sub: '지금, 비즈네스타와 함께하세요.',
    label: ['GOOD BUSINESS', 'BETTER TOMORROW'],
  },

  support: [
    { icon: 'chat' as const, label: '빠른 상담' },
    { icon: 'doc' as const, label: '맞춤 제안' },
    { icon: 'people' as const, label: '전문가 1:1 상담' },
  ],
};
