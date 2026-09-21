/**
 * BIZNESTA 상담 문의 — 서버 검증과 DB 매핑.
 *
 * front(camelCase) 와 DB(snake_case) 사이의 변환은 **이 파일에서만** 한다.
 * 화면쪽 모델과 검증은 lib/inquiry.ts 에 있고, 여기는 서버에서 한 번 더
 * 확인하는 층이다. client 검증만 믿지 않는다 — Server Action 은 UI 를 거치지
 * 않고도 호출될 수 있다.
 */
import { pc16 } from '@/data/pc16';
import { mo16 } from '@/data/mo16';
import type { InquiryRecord } from './inquiry';

/** DB 컬럼과 서버 검증이 함께 쓰는 길이 상한. 마이그레이션의 check 와 같은 값. */
export const LIMIT = {
  name: 100,
  contact: 50,
  email: 200,
  service: 100,
  message: 2000,
  context: 200,
  submittedPath: 500,
} as const;

/** 화면의 select 에 실제로 있는 값만 받는다. */
export const ALLOWED_SERVICES: readonly string[] = [
  ...pc16.form.fields.topic.options,
  ...mo16.form.fields.kindOptions,
];

export const ALLOWED_SCREENS = ['pc', 'mobile'] as const;

export type InquiryRow = {
  name: string;
  contact: string;
  email: string | null;
  service: string;
  message: string;
  privacy_consent: true;
  consultation_source: string | null;
  selected_category: string | null;
  selected_design: string | null;
  selected_service: string | null;
  selected_plan: string | null;
  screen: string | null;
  submitted_path: string | null;
};

export type ServerCheck =
  | { ok: true; row: InquiryRow }
  | { ok: false; reason: string };

const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '');
const cut = (v: string, max: number) => (v.length > max ? v.slice(0, max) : v);
const orNull = (v: string, max: number) => (v ? cut(v, max) : null);
const digits = (v: string) => v.replace(/[^0-9]/g, '');

/**
 * 서버 검증 + snake_case 매핑. 하나라도 어긋나면 저장하지 않는다.
 * reason 은 개발 로그용이며 사용자 화면에는 노출하지 않는다.
 */
export function toInquiryRow(input: Partial<InquiryRecord>): ServerCheck {
  const name = str(input.name);
  const contact = str(input.contact);
  const email = str(input.email);
  const service = str(input.service);
  const message = str(input.message);

  if (!name) return { ok: false, reason: 'name 누락' };
  if (name.length > LIMIT.name) return { ok: false, reason: 'name 길이 초과' };

  if (!contact) return { ok: false, reason: 'contact 누락' };
  if (contact.length > LIMIT.contact) return { ok: false, reason: 'contact 길이 초과' };
  if (digits(contact).length < 8) return { ok: false, reason: 'contact 형식' };

  if (email) {
    if (email.length > LIMIT.email) return { ok: false, reason: 'email 길이 초과' };
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, reason: 'email 형식' };
  }

  if (!service) return { ok: false, reason: 'service 누락' };
  if (!ALLOWED_SERVICES.includes(service)) return { ok: false, reason: 'service 허용값 아님' };

  if (!message) return { ok: false, reason: 'message 누락' };
  if (message.length > LIMIT.message) return { ok: false, reason: 'message 길이 초과' };

  if (input.privacyConsent !== true) return { ok: false, reason: '개인정보 동의 없음' };

  const screen = str(input.screen);
  if (screen && !ALLOWED_SCREENS.includes(screen as (typeof ALLOWED_SCREENS)[number]))
    return { ok: false, reason: 'screen 허용값 아님' };

  const path = str(input.submittedPath);
  if (path && !path.startsWith('/')) return { ok: false, reason: 'submittedPath 형식' };

  return {
    ok: true,
    row: {
      name,
      contact,
      email: email || null,
      service,
      message,
      privacy_consent: true,
      consultation_source: orNull(str(input.consultationSource), LIMIT.context),
      selected_category: orNull(str(input.selectedCategory), LIMIT.context),
      selected_design: orNull(str(input.selectedDesign), LIMIT.context),
      selected_service: orNull(str(input.selectedService), LIMIT.context),
      selected_plan: orNull(str(input.selectedPlan), LIMIT.context),
      screen: screen || null,
      submitted_path: orNull(path, LIMIT.submittedPath),
    },
  };
}
