import 'server-only';
import { getSupabase } from '@/lib/supabase';

/**
 * BIZNESTA BOOK 도서 조회 (읽기 전용).
 *
 * 왜 PAYMENT CORE 가 아니라 기존 anon 클라이언트인가
 *   목록 읽기에는 트랜잭션도 actor 도 필요 없다. `biz_products` 의 RLS 가
 *   `status in ('selling','coming')` 만 anon 에게 열어 두었으므로(35_products_coming_rls.sql),
 *   새 Secret 없이 기존 경로를 그대로 쓰는 것이 가장 단순하고 노출면이 작다.
 *   작성 중(draft)·판매중지(stopped)는 DB 가 걸러 준다 — 코드에서 거르지 않는다.
 *
 * ★ 가격은 언제나 서버(DB)에서 온다. 클라이언트가 보낸 금액은 어디서도 쓰지 않는다.
 */

export type BookStatus = 'coming' | 'selling';

export type Book = {
  productRef: string;
  name: string;
  amount: number;
  currency: string;
  kind: string;
  description: string | null;
  detailPath: string | null;
  /** 살 수 있는가. DB 가 status 에서 계산한다 — 화면이 정하지 않는다. */
  active: boolean;
  status: BookStatus;
};

export type CatalogResult =
  | { ok: true; books: Book[] }
  | { ok: false; reason: 'not_configured' | 'unavailable' };

const COLUMNS = 'product_ref, name, amount, currency, kind, description, detail_path, active, status';

type Row = {
  product_ref: string; name: string; amount: number | string; currency: string;
  kind: string; description: string | null; detail_path: string | null;
  active: boolean; status: string;
};

const toBook = (r: Row): Book => ({
  productRef: String(r.product_ref),
  name: String(r.name),
  amount: Number(r.amount),
  currency: String(r.currency).trim().toUpperCase(),
  kind: String(r.kind),
  description: r.description,
  detailPath: r.detail_path,
  active: r.active === true,
  status: r.status === 'selling' ? 'selling' : 'coming',
});

/** 서점에 진열할 책. 판매 중이 먼저, 그다음 출시예정. */
export async function listBooks(): Promise<CatalogResult> {
  const db = getSupabase();
  if (!db) return { ok: false, reason: 'not_configured' };

  const { data, error } = await db.from('biz_products').select(COLUMNS).order('created_at');
  if (error) return { ok: false, reason: 'unavailable' };

  const books = ((data ?? []) as unknown as Row[]).map(toBook)
    .sort((a, b) => (a.status === b.status ? 0 : a.status === 'selling' ? -1 : 1));
  return { ok: true, books };
}

/**
 * 책 한 권. 작성 중·판매중지 책은 RLS 가 걸러 주므로 여기서 null 이 된다
 * → 상세페이지가 404 가 된다. "파는 것처럼 보이는데 못 사는" 상태를 만들지 않는다.
 */
export async function getBook(ref: string): Promise<Book | null> {
  const db = getSupabase();
  if (!db || !/^[a-z][a-z0-9-]{2,63}$/.test(ref)) return null;

  const { data, error } = await db
    .from('biz_products').select(COLUMNS).eq('product_ref', ref).maybeSingle();
  if (error || !data) return null;
  return toBook(data as unknown as Row);
}

export function formatPrice(amount: number, currency: string) {
  if (currency === 'KRW') return `${amount.toLocaleString('ko-KR')}원`;
  return `${amount.toLocaleString('ko-KR')} ${currency}`;
}

export const KIND_LABEL: Record<string, string> = {
  ebook: '디지털 전자책 (PDF)',
  template: '디지털 템플릿',
  other: '디지털 상품',
};

export const STATUS_LABEL: Record<BookStatus, string> = {
  selling: '판매 중',
  coming: '출시 준비 중',
};

/* 저자는 지금 모든 책이 같다. 책마다 달라지면 그때 상품표에 칸을 더한다 —
   지금 없는 칸을 미리 만들지 않는다. */
export const AUTHOR = '원미희';
