'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { currentAdmin } from '@/lib/admin/auth';
import {
  PRODUCT_REF_RE, createProduct, isProductKind, isProductStatus,
  updateProduct, updateProductStatus,
} from '@/lib/admin/store-products';

/**
 * STORE 상품 등록 · 수정 · 판매상태 변경.
 *
 * Server Action 은 화면을 거치지 않고도 불릴 수 있으므로 여기서 관리자 여부를
 * 다시 확인한다. 마지막 방어선은 DB 다 — 정책은 전부 is_admin() 이고,
 * product_ref 는 UPDATE 권한도 없고 트리거도 막는다.
 *
 * ★ 가격은 여기(서버)에서만 정해진다. 결제 금액은 언제나 biz_products.amount 다.
 */

const str = (f: FormData, k: string, max: number) => String(f.get(k) ?? '').trim().slice(0, max);
const orNull = (v: string) => (v ? v : null);

/** 금액은 숫자만 남기고 본다. 소수점·음수·빈 값은 받지 않는다. */
function amountOf(raw: string): number | null {
  const digits = raw.replace(/[^0-9]/g, '');
  if (!digits) return null;
  const n = Number(digits);
  if (!Number.isSafeInteger(n) || n <= 0 || n > 100_000_000) return null;
  return n;
}

export async function createProductAction(formData: FormData) {
  if (!(await currentAdmin())) redirect('/admin/login?reason=denied');

  const product_ref = str(formData, 'product_ref', 64).toLowerCase();
  const name = str(formData, 'name', 200);
  const amount = amountOf(str(formData, 'amount', 20));
  const kind = str(formData, 'kind', 20);
  const currency = str(formData, 'currency', 3).toUpperCase() || 'KRW';

  if (!PRODUCT_REF_RE.test(product_ref)) redirect('/admin/store/new?err=ref');
  if (!name) redirect('/admin/store/new?err=name');
  if (amount === null) redirect('/admin/store/new?err=amount');
  if (!isProductKind(kind)) redirect('/admin/store/new?err=kind');
  if (currency !== 'KRW') redirect('/admin/store/new?err=currency');

  const r = await createProduct({
    product_ref, name, amount, currency, kind,
    description: orNull(str(formData, 'description', 300)),
  });
  if (!r.ok) redirect(`/admin/store/new?err=${r.reason === 'duplicate' ? 'duplicate' : 'save'}`);

  revalidatePath('/admin/store');
  /* ★ 새 상품은 언제나 '초안' 이다. 판매는 별도 행동으로만 시작된다. */
  redirect(`/admin/store/${product_ref}?created=1`);
}

export async function saveProductAction(formData: FormData) {
  if (!(await currentAdmin())) redirect('/admin/login?reason=denied');

  const ref = str(formData, 'product_ref', 64);
  if (!PRODUCT_REF_RE.test(ref)) redirect('/admin/store');

  const name = str(formData, 'name', 200);
  const amount = amountOf(str(formData, 'amount', 20));
  const kind = str(formData, 'kind', 20);
  const currency = str(formData, 'currency', 3).toUpperCase() || 'KRW';

  if (!name) redirect(`/admin/store/${ref}?err=name`);
  if (amount === null) redirect(`/admin/store/${ref}?err=amount`);
  if (!isProductKind(kind)) redirect(`/admin/store/${ref}?err=kind`);
  if (currency !== 'KRW') redirect(`/admin/store/${ref}?err=currency`);

  const r = await updateProduct(ref, {
    name, amount, currency, kind,
    description: orNull(str(formData, 'description', 300)),
  });
  revalidatePath('/admin/store');
  revalidatePath(`/admin/store/${ref}`);
  revalidatePath('/store');
  redirect(`/admin/store/${ref}?${r.ok ? 'saved=info' : 'err=save'}`);
}

export async function changeProductStatusAction(formData: FormData) {
  if (!(await currentAdmin())) redirect('/admin/login?reason=denied');

  const ref = str(formData, 'product_ref', 64);
  const status = str(formData, 'status', 20);
  if (!PRODUCT_REF_RE.test(ref) || !isProductStatus(status)) redirect('/admin/store');

  const r = await updateProductStatus(ref, status);
  revalidatePath('/admin/store');
  revalidatePath(`/admin/store/${ref}`);
  /* 판매상태가 바뀌면 공개 STORE 목록도 달라진다 */
  revalidatePath('/store');
  redirect(`/admin/store/${ref}?${r.ok ? 'saved=status' : 'err=status'}`);
}
