import 'server-only';
import { getSupabase } from '@/lib/supabase';

/**
 * STORE 상품 카탈로그 조회 (읽기 전용).
 *
 * 왜 PAYMENT CORE 가 아니라 기존 anon 클라이언트인가
 *   카탈로그 읽기에는 트랜잭션도 actor 도 필요 없다. `biz_products` 의 RLS 는
 *   `active = true` 인 행만 anon 에게 열어 두었으므로(31_rls.sql), 새 Secret 없이
 *   기존 경로를 그대로 쓰는 것이 가장 단순하고 노출면이 작다.
 *   판매중지·초안 상품은 DB 가 걸러 준다 — 코드에서 거르지 않는다.
 *
 * ★ 가격은 언제나 서버(DB)에서 온다. 클라이언트가 보낸 금액은 어디서도 쓰지 않는다.
 */

export type StoreProduct = {
  productRef: string;
  name: string;
  amount: number;
  currency: string;
  kind: string;
  description: string | null;
  detailPath: string | null;
};

export type CatalogResult =
  | { ok: true; products: StoreProduct[] }
  | { ok: false; reason: 'not_configured' | 'unavailable' };

const COLUMNS = 'product_ref, name, amount, currency, kind, description, detail_path';

type Row = {
  product_ref: string; name: string; amount: number | string;
  currency: string; kind: string; description: string | null; detail_path: string | null;
};

const toProduct = (r: Row): StoreProduct => ({
  productRef: String(r.product_ref),
  name: String(r.name),
  amount: Number(r.amount),
  currency: String(r.currency).trim().toUpperCase(),
  kind: String(r.kind),
  description: r.description,
  detailPath: r.detail_path,
});

export async function listStoreProducts(): Promise<CatalogResult> {
  const db = getSupabase();
  if (!db) return { ok: false, reason: 'not_configured' };

  const { data, error } = await db.from('biz_products').select(COLUMNS).order('product_ref');
  if (error) return { ok: false, reason: 'unavailable' };
  return { ok: true, products: ((data ?? []) as unknown as Row[]).map(toProduct) };
}

/**
 * 판매 중인 상품 하나. 초안·판매중지 상품은 RLS 가 걸러 주므로 여기서는 null 이 된다
 * → 상세페이지가 404 가 된다. "파는 것처럼 보이는데 못 사는" 상태를 만들지 않는다.
 */
export async function getStoreProduct(ref: string): Promise<StoreProduct | null> {
  const db = getSupabase();
  if (!db || !/^[a-z][a-z0-9-]{2,63}$/.test(ref)) return null;

  const { data, error } = await db
    .from('biz_products').select(COLUMNS).eq('product_ref', ref).maybeSingle();
  if (error || !data) return null;
  return toProduct(data as unknown as Row);
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
