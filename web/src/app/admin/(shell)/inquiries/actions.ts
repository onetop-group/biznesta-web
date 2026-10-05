'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { currentAdmin } from '@/lib/admin/auth';
import { isInquiryStatus, updateInquiryNote, updateInquiryStatus } from '@/lib/admin/inquiries';

/**
 * 문의 상태 변경 · 관리자 메모 저장.
 * Server Action 은 UI 없이도 호출될 수 있으므로 여기서 관리자 여부를 다시 확인한다.
 * DB 쪽 RLS · 컬럼 GRANT 가 마지막 방어선이라 여기서 실수해도 다른 컬럼은 못 바꾼다.
 */

const ID = /^[0-9a-f-]{36}$/i;

export async function changeStatus(formData: FormData) {
  if (!(await currentAdmin())) redirect('/admin/login?reason=denied');
  const id = String(formData.get('id') ?? '');
  const status = String(formData.get('status') ?? '');
  if (!ID.test(id) || !isInquiryStatus(status)) redirect(`/admin/inquiries/${encodeURIComponent(id)}?err=status`);

  const r = await updateInquiryStatus(id, status);
  revalidatePath('/admin');
  revalidatePath('/admin/inquiries');
  revalidatePath(`/admin/inquiries/${id}`);
  redirect(`/admin/inquiries/${id}?${r.ok ? 'saved=status' : 'err=status'}`);
}

export async function saveNote(formData: FormData) {
  if (!(await currentAdmin())) redirect('/admin/login?reason=denied');
  const id = String(formData.get('id') ?? '');
  const note = String(formData.get('note') ?? '');
  if (!ID.test(id)) redirect('/admin/inquiries');

  const r = await updateInquiryNote(id, note);
  revalidatePath(`/admin/inquiries/${id}`);
  redirect(`/admin/inquiries/${id}?${r.ok ? 'saved=note' : 'err=note'}`);
}
