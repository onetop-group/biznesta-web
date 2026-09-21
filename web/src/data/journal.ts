/**
 * BIZNESTA JOURNAL — 화면 자료.
 *
 * 공식 Visual Master(첨부 PC / MOBILE 시안)를 그대로 옮긴 화면이 쓰는 값이다.
 * 메인 JOURNAL 은 Editorial Index 다 — 분류 · 대표 사진 · 제목 · READ MORE 까지만
 * 둔다. 설명문 · 발행일 · 관련 디자인 · 관련 서비스는 여기 두지 않는다
 * (앞으로 상세 화면에서 쓴다).
 *
 * 만들지 않는 것
 *   · 발행일: `publishedAt` 이 실제로 생기기 전에는 화면에 날짜를 적지 않는다.
 *     「발행일 미정」 같은 임시 문구도 고객 화면에 내보내지 않는다.
 *   · 조회수 · 작성자 · 고객사 · 실적.
 *   · 사진: 새로 만들지 않는다. 이미 승인된 BIZNESTA 브랜드 사진만 쓴다.
 *     이 자리는 앞으로 실제 글의 coverImage 로 바뀌므로 비율과 자르는 방식을
 *     고정해 둔다(가로로 긴 상자 + 아래 기준 정렬).
 */

export type JournalCategoryId = 'all' | 'news' | 'insight' | 'new-design' | 'notice';

export type JournalCategory = { id: JournalCategoryId; label: string };

export type JournalCover = {
  webp: string;
  jpg: string;
  /** 원본을 고치지 않고 보여줄 자리만 정한다 */
  position: string;
  alt: string;
};

export type JournalStory = {
  id: string;
  category: Exclude<JournalCategoryId, 'all'>;
  /** 화면에 찍히는 줄 그대로 */
  title: string[];
  cover: JournalCover;
  /** 실제 발행일이 생기면 그때 채운다. 없으면 화면에 날짜가 나오지 않는다. */
  publishedAt?: string;
};

export const JOURNAL_CATEGORIES: JournalCategory[] = [
  { id: 'all', label: 'ALL' },
  { id: 'news', label: 'NEWS' },
  { id: 'insight', label: 'INSIGHT' },
  { id: 'new-design', label: 'NEW DESIGN' },
  { id: 'notice', label: 'NOTICE' },
];

export const categoryLabel = (id: JournalStory['category']) =>
  JOURNAL_CATEGORIES.find((c) => c.id === id)?.label ?? '';

const cover = (dir: string, position: string, alt: string): JournalCover => ({
  webp: `/assets/${dir}/hero.webp`,
  jpg: `/assets/${dir}/hero.jpg`,
  position,
  alt,
});

export const JOURNAL_STORIES: JournalStory[] = [
  {
    id: 'biznesta-start',
    category: 'news',
    title: ['BIZNESTA, 새로운 시작을', '알립니다.'],
    cover: cover('pc16', '70% 50%', 'BIZNESTA 리셉션 공간의 벽면 로고'),
  },
  {
    id: 'website-or-system',
    category: 'insight',
    title: ['홈페이지가 필요하신가요?', '아니면 고객이 들어오는 시스템이', '필요하신가요?'],
    cover: cover('pc14', '72% 50%', '책상 위 노트북에 표시된 홈페이지 화면'),
  },
  {
    id: 'design-collection',
    category: 'new-design',
    title: ['BIZNESTA DESIGN', 'COLLECTION을 소개합니다.'],
    cover: cover('pc07', '82% 50%', '모니터와 휴대폰에 표시된 새 홈페이지 디자인'),
  },
  {
    id: 'consulting-guide',
    category: 'notice',
    title: ['BIZNESTA 홈페이지 제작', '상담 안내'],
    cover: cover('pc12', '62% 50%', '대리석 테이블 위 노트북과 휴대폰에 표시된 홈페이지'),
  },
];

/** 화면에 쓰는 공식 문구 — 시안 이미지 속 글자를 옮겨 적지 않는다. */
export const JOURNAL_COPY = {
  brandLine: 'BIZNESTA',
  wordmark: 'JOURNAL',
  headline: ['비즈니스와 디자인,', '그리고 성장에 대한 이야기'],
  body: ['좋은 콘텐츠가 좋은 비즈니스를 만듭니다.', 'BIZNESTA의 새로운 소식과 인사이트를 전합니다.'],
  small: ['IDEAS TODAY,', 'A STRONGER TOMORROW'],
  keywords: ['BRAND', 'CONTENT', 'GROWTH'],
  quote: ['좋은 이야기가', '더 큰 성장을 만듭니다.'],
  catNote: 'BIZNESTA의 새로운 소식과 디자인, 비즈니스를 위한 인사이트를 전합니다.',
  listEyebrow: 'LATEST JOURNAL',
  listTitle: '새로운 이야기',
  viewAll: 'VIEW ALL JOURNAL',
  viewAllShort: 'VIEW ALL',
  readMore: 'READ MORE',
  band: {
    label: 'START YOUR PROJECT',
    title: ['당신의 비즈니스에는', '어떤 홈페이지가 필요할까요?'],
    note: ['당신의 비즈니스에도,', 'BIZNESTA가 함께하겠습니다.'],
    cta: '제작 상담하기',
    keywords: ['BRAND', 'DESIGN', 'BUSINESS', 'GROWTH'],
  },
} as const;
