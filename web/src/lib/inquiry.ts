/**
 * BIZNESTA 상담 문의 — front data model + validation.
 *
 * INQUIRY FORM REAL IMPLEMENTATION — PHASE 1 에서 만들었다.
 * PC(16)와 MOBILE(16) 상담 폼이 **같은 모델과 같은 검증**을 쓴다. 화면 배치만
 * 다르다. 아직 저장 · 발송 · Webhook 은 없다. 다음 단계에서 이 모델을 그대로
 * Supabase inquiry 테이블에 연결한다.
 *
 * 사용자가 입력하는 값(InquiryInput)과 시스템이 붙이는 값(InquiryContext)을
 * 구분해 둔다. 공식 시안에 없는 입력 항목은 만들지 않는다.
 */

/** 사용자가 화면에서 입력하는 값. 공식 시안의 필드와 1:1 이다. */
export type InquiryInput = {
  /** 이름 — 필수 (PC16 · MO16) */
  name: string;
  /** 연락처 — 필수 (PC16 "연락처" · MO16 "연락처") */
  contact: string;
  /** 이메일 — 선택. PC16 에만 있는 필드이고 모바일 시안에는 없다. */
  email: string;
  /** 문의 유형 / 상담 분야 — 필수 (select) */
  service: string;
  /** 문의 내용 — 필수 */
  message: string;
  /** 개인정보 수집 및 이용 동의 — 필수 */
  privacyConsent: boolean;
};

/** 시스템이 붙이는 값. 화면에 노출하지 않는다. */
export type InquiryContext = {
  consultationSource?: string;
  selectedCategory?: string;
  selectedDesign?: string;
  selectedService?: string;
  selectedPlan?: string;
  /** 어느 시안에서 보냈는지 — 나중에 유입 분석에 쓴다 */
  screen?: 'pc' | 'mobile';
  submittedPath?: string;
};

/** 다음 단계에서 저장할 한 건의 문의. */
export type InquiryRecord = InquiryInput & InquiryContext & { createdAt: string };

export const EMPTY_INPUT: InquiryInput = {
  name: '', contact: '', email: '', service: '', message: '', privacyConsent: false,
};

export const MESSAGE_MAX = 500;

export type InquiryErrors = Partial<Record<keyof InquiryInput, string>>;

/** 연락처는 숫자 8자리 이상이면 통과. 형식을 지나치게 강제하지 않는다. */
const digits = (s: string) => s.replace(/[^0-9]/g, '');

export function validateInquiry(v: InquiryInput, opts: { email?: boolean } = {}): InquiryErrors {
  const e: InquiryErrors = {};
  if (!v.name.trim()) e.name = '이름을 입력해주세요.';
  if (!v.contact.trim()) e.contact = '연락처를 입력해주세요.';
  else if (digits(v.contact).length < 8) e.contact = '연락 가능한 번호를 입력해주세요.';
  if (opts.email && v.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim()))
    e.email = '이메일 주소를 다시 확인해주세요.';
  if (!v.service) e.service = '문의 유형을 선택해주세요.';
  if (!v.message.trim()) e.message = '문의 내용을 입력해주세요.';
  if (!v.privacyConsent) e.privacyConsent = '개인정보 수집 및 이용에 동의해주세요.';
  return e;
}

/** 검증을 통과한 입력 + 맥락을 저장 직전 형태로 만든다. 아직 보내지는 않는다. */
export function buildInquiry(
  input: InquiryInput,
  context: InquiryContext,
): InquiryRecord {
  return {
    ...input,
    name: input.name.trim(),
    contact: input.contact.trim(),
    email: input.email.trim(),
    message: input.message.trim(),
    ...context,
    createdAt: new Date().toISOString(),
  };
}

/** 상담 진입 맥락(navigation.ts) 을 문의 맥락으로 옮긴다. */
export function toInquiryContext(
  c: { source?: string; category?: string; design?: string; service?: string; plan?: string },
  screen: 'pc' | 'mobile',
): InquiryContext {
  return {
    consultationSource: c.source,
    selectedCategory: c.category,
    selectedDesign: c.design,
    selectedService: c.service,
    selectedPlan: c.plan,
    screen,
  };
}
