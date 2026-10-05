'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { currentAdmin } from '@/lib/admin/auth';
import {
  createProject, isPlan, isProjectStatus, isServiceType,
  updateProjectInfo, updateProjectNote, updateProjectStatus,
} from '@/lib/admin/projects';

/**
 * 프로젝트 생성 · 상태 변경 · 메모 · 정보 수정.
 *
 * Server Action 은 화면을 거치지 않고도 불릴 수 있으므로 여기서 관리자 여부를
 * 다시 확인한다. 마지막 방어선은 DB 다 — RLS 3정책이 전부 is_admin() 이고,
 * project_no · created_at · source_inquiry_id 는 UPDATE 권한 자체가 없다.
 *
 * 문의는 절대 건드리지 않는다. 전환해도 문의 상태를 자동으로 바꾸지 않는다.
 */

const UUID = /^[0-9a-f-]{36}$/i;
const str = (f: FormData, k: string, max: number) => String(f.get(k) ?? '').trim().slice(0, max);
const orNull = (v: string) => (v ? v : null);
/* 날짜는 브라우저 date 입력이 주는 YYYY-MM-DD 만 받는다. */
const date = (v: string) => (/^\d{4}-\d{2}-\d{2}$/.test(v) ? v : null);

export async function createProjectAction(formData: FormData) {
  if (!(await currentAdmin())) redirect('/admin/login?reason=denied');

  const inquiryId = str(formData, 'source_inquiry_id', 40);
  const back = inquiryId && UUID.test(inquiryId) ? `?from=${inquiryId}` : '';

  const client_name = str(formData, 'client_name', 100);
  const client_contact = str(formData, 'client_contact', 50);
  const title = str(formData, 'title', 200);
  const service_type = str(formData, 'service_type', 40);
  const plan = str(formData, 'plan', 20);
  const status = str(formData, 'status', 20);
  const started_on = date(str(formData, 'started_on', 10));
  const target_on = date(str(formData, 'target_on', 10));

  if (!client_name || !client_contact || !title) redirect(`/admin/projects/new${back}${back ? '&' : '?'}err=required`);
  if (!isServiceType(service_type)) redirect(`/admin/projects/new${back}${back ? '&' : '?'}err=service`);
  if (plan && !isPlan(plan)) redirect(`/admin/projects/new${back}${back ? '&' : '?'}err=plan`);
  if (status && !isProjectStatus(status)) redirect(`/admin/projects/new${back}${back ? '&' : '?'}err=status`);
  if (started_on && target_on && target_on < started_on)
    redirect(`/admin/projects/new${back}${back ? '&' : '?'}err=date`);

  const r = await createProject({
    /* 원본 문의는 이때 한 번만 정해진다. 이후에는 DB 가 수정을 막는다. */
    source_inquiry_id: inquiryId && UUID.test(inquiryId) ? inquiryId : null,
    client_name,
    client_contact,
    client_email: orNull(str(formData, 'client_email', 200)),
    title,
    service_type,
    plan: orNull(plan),
    status: isProjectStatus(status) ? status : 'CONSULTING',
    started_on,
    target_on,
    admin_note: orNull(str(formData, 'admin_note', 8000)),
  });

  if (!r.ok) redirect(`/admin/projects/new${back}${back ? '&' : '?'}err=save`);

  revalidatePath('/admin');
  revalidatePath('/admin/projects');
  if (inquiryId) revalidatePath(`/admin/inquiries/${inquiryId}`);
  redirect(`/admin/projects/${r.id}?created=1`);
}

export async function changeProjectStatus(formData: FormData) {
  if (!(await currentAdmin())) redirect('/admin/login?reason=denied');
  const id = str(formData, 'id', 40);
  const status = str(formData, 'status', 20);
  if (!UUID.test(id) || !isProjectStatus(status)) redirect('/admin/projects');

  const r = await updateProjectStatus(id, status);
  revalidatePath('/admin');
  revalidatePath('/admin/projects');
  revalidatePath(`/admin/projects/${id}`);
  redirect(`/admin/projects/${id}?${r.ok ? 'saved=status' : 'err=status'}`);
}

export async function saveProjectNote(formData: FormData) {
  if (!(await currentAdmin())) redirect('/admin/login?reason=denied');
  const id = str(formData, 'id', 40);
  if (!UUID.test(id)) redirect('/admin/projects');

  const r = await updateProjectNote(id, String(formData.get('note') ?? ''));
  revalidatePath(`/admin/projects/${id}`);
  redirect(`/admin/projects/${id}?${r.ok ? 'saved=note' : 'err=note'}`);
}

export async function saveProjectInfo(formData: FormData) {
  if (!(await currentAdmin())) redirect('/admin/login?reason=denied');
  const id = str(formData, 'id', 40);
  if (!UUID.test(id)) redirect('/admin/projects');

  const client_name = str(formData, 'client_name', 100);
  const client_contact = str(formData, 'client_contact', 50);
  const title = str(formData, 'title', 200);
  const service_type = str(formData, 'service_type', 40);
  const plan = str(formData, 'plan', 20);
  const started_on = date(str(formData, 'started_on', 10));
  const target_on = date(str(formData, 'target_on', 10));

  if (!client_name || !client_contact || !title) redirect(`/admin/projects/${id}?err=required`);
  if (!isServiceType(service_type)) redirect(`/admin/projects/${id}?err=service`);
  if (plan && !isPlan(plan)) redirect(`/admin/projects/${id}?err=plan`);
  if (started_on && target_on && target_on < started_on) redirect(`/admin/projects/${id}?err=date`);

  const r = await updateProjectInfo(id, {
    client_name,
    client_contact,
    client_email: orNull(str(formData, 'client_email', 200)),
    title,
    service_type,
    plan: orNull(plan),
    started_on,
    target_on,
  });
  revalidatePath('/admin/projects');
  revalidatePath(`/admin/projects/${id}`);
  redirect(`/admin/projects/${id}?${r.ok ? 'saved=info' : 'err=info'}`);
}
