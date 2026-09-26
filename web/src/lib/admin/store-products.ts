import 'server-only';
import { getAdminSupabase } from './supabase';

/**
 * STORE 상품 데이터 층 (관리자용).
 *
 * 컬럼은 PAYMENT CORE 저장소의 biznesta/sql/30_store.sql · 32_products_ops.sql 에
 * 실제로 있는 것만 쓴다. 허용 범위는 DB 가 정한다 —
 *   · 정책은 전부 is_admin()
 *   · UPDATE 는 컬럼 GRANT 7개(name, amount, currency, status, kind, description, detail_path)만
 *   · product_ref 는 권한도 없고 트리거(biz_products_ref_immutable)도 막는다
 *   · active 는 status 에서 계산되는 칸이라 아무도 못 고친다
 *   · DELETE 는 권한도 정책도 없다
 * 이 파일이 실수해도 DB 가 막는다.
 */

export const PRODUCT_STATUSES = ['draft', 'selling', 'stopped'] as const;
export type ProductStatus = (typeof PRODUCT_STATUSES)[number];

/** 운영자에게 보이는 이름 · 배지 색(관리자 UI 의 기존 tone 을 그대로 쓴다) */
export const PRODUCT_STATUS_LABEL: Record<ProductStatus, {
  label: string; tone: 'cancelled' | 'done' | 'hold'; help: string; order: number;
}> = {
  selling: { label: '판매 중',   tone: 'done',      order: 1, help: '공개 STORE 에 보이고 구매할 수 있습니다.' },
  draft:   { label: '초안',      tone: 'cancelled', order: 2, help: '작성 중입니다. 공개 STORE 에 보이지 않습니다.' },
  stopped: { label: '판매 중지', tone: 'hold',      order: 3, help: '공개 STORE 에서 내려갑니다. 기록은 남습니다.' },
};

export const isProductStatus = (v: string): v is ProductStatus =>
  (PRODUCT_STATUSES as readonly string[]).includes(v);

export const PRODUCT_KINDS = [
  { value: 'ebook', label: '전자책' },
  { value: 'template', label: '템플릿' },
  { value: 'other', label: '기타' },
] as const;
export type ProductKind = (typeof PRODUCT_KINDS)[number]['value'];
export const isProductKind = (v: string): v is ProductKind =>
  PRODUCT_KINDS.some((k) => k.value === v);
export const kindLabel = (v: string) => PRODUCT_KINDS.find((k) => k.value === v)?.label ?? v;

/** DB 의 check 제약과 같은 규칙. 여기서 먼저 걸러 주면 오류 문구가 친절해진다. */
export const PRODUCT_REF_RE = /^[a-z][a-z0-9-]{2,63}$/;
export const CURRENCIES = ['KRW'] as const;

export type StoreProduct = {
  product_ref: string;
  name: string;
  amount: number;
  currency: string;
  status: ProductStatus;
  kind: string;
  description: string | null;
  detail_path: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
};

const COLUMNS =
  'product_ref, name, amount, currency, status, kind, description, detail_path, active, created_at, updated_at';

export async function listProducts() {
  const db = await getAdminSupabase();
  if (!db) return { rows: [] as StoreProduct[], error: 'unavailable' as const };
  const { data, error } = await db.from('biz_products').select(COLUMNS).order('created_at', { ascending: false });
  if (error) {
    console.error('[admin/store-products] list 실패:', error.code);
    return { rows: [] as StoreProduct[], error: 'error' as const };
  }
  const rows = ((data ?? []) as unknown as StoreProduct[]).slice().sort((a, b) => {
    const oa = PRODUCT_STATUS_LABEL[a.status]?.order ?? 99;
    const ob = PRODUCT_STATUS_LABEL[b.status]?.order ?? 99;
    return oa !== ob ? oa - ob : b.created_at.localeCompare(a.created_at);
  });
  return { rows, error: null };
}

export async function countProductsByStatus() {
  const zero = Object.fromEntries(PRODUCT_STATUSES.map((s) => [s, 0])) as Record<ProductStatus, number>;
  const db = await getAdminSupabase();
  if (!db) return { counts: zero, total: 0, error: 'unavailable' as const };
  const { data, error } = await db.from('biz_products').select('status');
  if (error) {
    console.error('[admin/store-products] count 실패:', error.code);
    return { counts: zero, total: 0, error: 'error' as const };
  }
  const counts = { ...zero };
  for (const r of data ?? []) if (isProductStatus(r.status)) counts[r.status]++;
  return { counts, total: data?.length ?? 0, error: null };
}

export async function getProduct(ref: string) {
  const db = await getAdminSupabase();
  if (!db || !PRODUCT_REF_RE.test(ref)) return null;
  const { data, error } = await db.from('biz_products').select(COLUMNS).eq('product_ref', ref).maybeSingle();
  if (error) {
    console.error('[admin/store-products] get 실패:', error.code);
    return null;
  }
  return (data as unknown as StoreProduct | null) ?? null;
}

/**
 * 이 상품이 팔린 적이 있는가.
 * 주문표는 PAYMENT CORE 의 것이라 여기서 '읽기만' 한다. 쓰지 않는다.
 * 관리자에게 "이 식별자는 이제 못 바꿉니다" 를 설명하기 위한 정보다.
 */
export async function countOrdersFor(ref: string) {
  const db = await getAdminSupabase();
  if (!db || !PRODUCT_REF_RE.test(ref)) return null;
  const { count, error } = await db
    .from('pay_orders')
    .select('id', { count: 'exact', head: true })
    .eq('product_ref', ref);
  /* 관리자에게 주문표 읽기 권한이 없을 수도 있다 — 그러면 '모름' 으로 둔다 */
  if (error) return null;
  return count ?? 0;
}

export type NewProduct = {
  product_ref: string;
  name: string;
  amount: number;
  currency: string;
  kind: string;
  description: string | null;
};

export type SaveResult = { ok: true } | { ok: false; reason: string };

/**
 * 새 상품. ★ status 를 받지 않는다 — 언제나 'draft'(DB 기본값)로 태어난다.
 * 실수로 만들자마자 팔리는 일이 없어야 하기 때문이다. 판매 시작은 별도 행동이다.
 */
export async function createProduct(p: NewProduct): Promise<SaveResult> {
  const db = await getAdminSupabase();
  if (!db) return { ok: false, reason: 'unavailable' };
  const { error } = await db.from('biz_products').insert({
    product_ref: p.product_ref,
    name: p.name,
    amount: p.amount,
    currency: p.currency,
    kind: p.kind,
    description: p.description,
  });
  if (error) {
    console.error('[admin/store-products] 생성 실패:', error.code);
    return { ok: false, reason: error.code === '23505' ? 'duplicate' : (error.code ?? 'error') };
  }
  return { ok: true };
}

export type ProductEdit = {
  name: string;
  amount: number;
  currency: string;
  kind: string;
  description: string | null;
};

export async function updateProduct(ref: string, e: ProductEdit): Promise<SaveResult> {
  return patch(ref, e, '정보');
}

export async function updateProductStatus(ref: string, status: ProductStatus): Promise<SaveResult> {
  return patch(ref, { status }, '판매상태');
}

async function patch(ref: string, values: Record<string, unknown>, what: string): Promise<SaveResult> {
  const db = await getAdminSupabase();
  if (!db) return { ok: false, reason: 'unavailable' };
  if (!PRODUCT_REF_RE.test(ref)) return { ok: false, reason: 'ref' };
  const { data, error } = await db
    .from('biz_products')
    .update(values)
    .eq('product_ref', ref)
    .select('product_ref')
    .maybeSingle();
  if (error || !data) {
    console.error(`[admin/store-products] ${what} 저장 실패:`, ref, error?.code ?? 'no-row');
    return { ok: false, reason: error?.code ?? 'error' };
  }
  return { ok: true };
}

export const formatPrice = (amount: number, currency: string) =>
  currency === 'KRW' ? `${amount.toLocaleString('ko-KR')}원` : `${amount.toLocaleString('ko-KR')} ${currency}`;
