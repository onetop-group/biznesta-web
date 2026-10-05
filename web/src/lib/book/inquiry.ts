import 'server-only';

/**
 * BIZNESTA BOOK 문의 — 서버 검증과 DB 매핑.
 *
 * 홈페이지 제작 상담(`/contact`)과 **같은 표를 쓰되 출처로 갈라 둔다**.
 *   inquiry_source = 'book'   ← 이 값으로 관리자에서 구분한다
 *   product_ref               ← 어떤 책에 대한 문의인가 (없을 수도 있다)
 *
 * 기존 상담폼 경로(lib/inquiry-db.ts)는 한 줄도 건드리지 않는다.
 * 그쪽은 그대로 두고, 책 문의는 이 파일만 지나간다.
 */

export const BOOK_INQUIRY_TYPES = [
  { value: 'product', label: '상품 내용 문의' },
  { value: 'purchase', label: '구매/결제 문의' },
  { value: 'access', label: '다운로드 문의' },
  { value: 'refund', label: '환불/취소 문의' },
  { value: 'etc', label: '기타 문의' },
] as const;

export type BookInquiryType = (typeof BOOK_INQUIRY_TYPES)[number]['value'];

export const isBookInquiryType = (v: string): v is BookInquiryType =>
  BOOK_INQUIRY_TYPES.some((t) => t.value === v);

export const inquiryTypeLabel = (v: string) =>
  BOOK_INQUIRY_TYPES.find((t) => t.value === v)?.label ?? v;

/** DB 의 check 제약과 같은 값. 여기서 먼저 걸러 주면 오류가 친절해진다. */
const LIMIT = { name: 100, contact: 50, email: 200, message: 2000 } as const;
const PRODUCT_REF_RE = /^[a-z][a-z0-9-]{2,63}$/;
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export type BookInquiryRow = {
  name: string;
  contact: string;
  email: string;
  /** 문의 유형의 '사람이 읽는 이름'. 기존 관리자 목록이 이 칸을 보여준다. */
  service: string;
  message: string;
  privacy_consent: true;
  inquiry_source: 'book';
  product_ref: string | null;
  consultation_source: 'book';
  submitted_path: string | null;
  screen: null;
};

export type BookCheck =
  | { ok: true; row: BookInquiryRow }
  | { ok: false; field: string };

const str = (v: FormData, k: string) => String(v.get(k) ?? '').trim();
const digits = (s: string) => s.replace(/[^0-9]/g, '');

/**
 * 서버 검증 + 매핑. 하나라도 어긋나면 저장하지 않는다.
 * Server Action 은 화면을 거치지 않고도 불릴 수 있으므로 전부 여기서 다시 본다.
 */
export function toBookInquiryRow(form: FormData, path: string | null): BookCheck {
  const name = str(form, 'name').slice(0, LIMIT.name);
  const contact = str(form, 'contact').slice(0, LIMIT.contact);
  const email = str(form, 'email').slice(0, LIMIT.email);
  const message = str(form, 'message').slice(0, LIMIT.message);
  const type = str(form, 'type');
  const productRef = str(form, 'product');
  const consent = form.get('privacy') === 'on';

  if (!name) return { ok: false, field: 'name' };
  if (digits(contact).length < 9) return { ok: false, field: 'contact' };
  if (!EMAIL_RE.test(email)) return { ok: false, field: 'email' };
  if (!isBookInquiryType(type)) return { ok: false, field: 'type' };
  if (message.length < 5) return { ok: false, field: 'message' };
  if (!consent) return { ok: false, field: 'privacy' };
  /* 상품은 없어도 된다(일반 BOOK 문의). 있다면 형식이 맞아야 한다. */
  if (productRef && !PRODUCT_REF_RE.test(productRef)) return { ok: false, field: 'product' };

  return {
    ok: true,
    row: {
      name, contact, email,
      service: inquiryTypeLabel(type),
      message,
      privacy_consent: true,
      inquiry_source: 'book',
      product_ref: productRef || null,
      consultation_source: 'book',
      submitted_path: path ? path.slice(0, 500) : null,
      screen: null,
    },
  };
}
