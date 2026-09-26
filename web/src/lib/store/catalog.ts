import 'server-only';
import { getSupabase } from '@/lib/supabase';

/**
 * STORE 상품 카탈로그 조회 (읽기 전용).
 *
 * 왜 PAYMENT CORE 가 아니라 기존 anon 클라이언트인가
 *   카탈로그 읽기에는 트랜잭션도 actor 도 필요 없다. `biz_products` 의 RLS 는
 *   `active = true` 인 행만 anon 에게 열어 두었으므로(31_rls.sql), 새 Secret 없이
 *   기존 경로를 그대로 쓰는 것이 가장 단순하고 노출면이 작다.
 *   판매중지 상품은 DB 가 걸러 준다 — 코드에서 거르지 않는다.
 *
 * ★ 가격은 언제나 서버(DB)에서 온다. 클라이언트가 보낸 금액은 어디서도 쓰지 않는다.
 */

export type StoreProduct = {
  productRef: string;
  name: string;
  amount: number;
  currency: string;
};

export type CatalogResult =
  | { ok: true; products: StoreProduct[] }
  | { ok: false; reason: 'not_configured' | 'unavailable' };

export async function listStoreProducts(): Promise<CatalogResult> {
  const db = getSupabase();
  if (!db) return { ok: false, reason: 'not_configured' };

  const { data, error } = await db
    .from('biz_products')
    .select('product_ref, name, amount, currency')
    .order('product_ref');

  if (error) return { ok: false, reason: 'unavailable' };

  const products = (data ?? []).map((r) => ({
    productRef: String(r.product_ref),
    name: String(r.name),
    amount: Number(r.amount),
    currency: String(r.currency).trim().toUpperCase(),
  }));
  return { ok: true, products };
}

export function formatPrice(amount: number, currency: string) {
  if (currency === 'KRW') return `${amount.toLocaleString('ko-KR')}원`;
  return `${amount.toLocaleString('ko-KR')} ${currency}`;
}
