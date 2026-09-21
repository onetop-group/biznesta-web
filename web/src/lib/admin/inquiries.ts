import 'server-only';
import { getAdminSupabase } from './supabase';

/**
 * 문의함 데이터 층. 읽기 · 상태 변경 · 메모 저장.
 *
 * 컬럼은 supabase/migrations/0001 + 0005 에 실제로 있는 것만 쓴다.
 * 모든 호출은 로그인한 관리자의 세션으로 나가며, 허용 범위는 DB 의 RLS 와
 * 컬럼 GRANT 가 정한다 (SELECT 전체 · UPDATE 는 status, admin_note 만).
 * 이 파일이 아무리 다른 컬럼을 고치려 해도 DB 가 거부한다.
 *
 * 로그에는 id 와 결과만 남긴다. 이름 · 연락처 · 이메일 · 내용은 남기지 않는다.
 */

export const INQUIRY_STATUSES = ['NEW', 'IN_PROGRESS', 'DONE', 'SPAM'] as const;
export type InquiryStatus = (typeof INQUIRY_STATUSES)[number];

/** 운영자에게 보이는 상태 이름 · 색 톤 */
export const STATUS_LABEL: Record<InquiryStatus, { label: string; tone: 'new' | 'progress' | 'done' | 'spam' }> = {
  NEW:         { label: '신규',   tone: 'new' },
  IN_PROGRESS: { label: '진행 중', tone: 'progress' },
  DONE:        { label: '완료',   tone: 'done' },
  SPAM:        { label: '스팸',   tone: 'spam' },
};

export const isInquiryStatus = (v: string): v is InquiryStatus =>
  (INQUIRY_STATUSES as readonly string[]).includes(v);

export type Inquiry = {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  contact: string;
  email: string | null;
  service: string;
  message: string;
  consultation_source: string | null;
  selected_category: string | null;
  selected_design: string | null;
  selected_service: string | null;
  selected_plan: string | null;
  screen: string | null;
  submitted_path: string | null;
  status: InquiryStatus;
  admin_note: string | null;
};

const LIST_COLUMNS =
  'id, created_at, updated_at, name, contact, email, service, selected_plan, selected_design, consultation_source, screen, status';

export type InquiryRow = Pick<Inquiry,
  'id' | 'created_at' | 'updated_at' | 'name' | 'contact' | 'email' | 'service'
  | 'selected_plan' | 'selected_design' | 'consultation_source' | 'screen' | 'status'>;

export type ListFilter = {
  q?: string;
  status?: InquiryStatus | '';
  service?: string;
  page?: number;
};

export const PAGE_SIZE = 50;

/* PostgREST 의 or() 필터는 쉼표 · 괄호가 문법 문자라, 검색어에서는 걷어낸다. */
const cleanQuery = (q: string) => q.replace(/[,()"'\\%]/g, ' ').trim().slice(0, 100);

export async function listInquiries(f: ListFilter = {}) {
  const db = await getAdminSupabase();
  if (!db) return { rows: [] as InquiryRow[], total: 0, error: 'unavailable' as const };

  const page = Math.max(1, f.page ?? 1);
  let query = db
    .from('inquiries')
    .select(LIST_COLUMNS, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);

  if (f.status && isInquiryStatus(f.status)) query = query.eq('status', f.status);
  if (f.service) query = query.eq('service', f.service.slice(0, 100));
  const q = f.q ? cleanQuery(f.q) : '';
  if (q) {
    const like = `%${q}%`;
    query = query.or(
      `name.ilike.${like},contact.ilike.${like},email.ilike.${like},message.ilike.${like}`,
    );
  }

  const { data, count, error } = await query;
  if (error) {
    console.error('[admin/inquiries] list 실패:', error.code);
    return { rows: [] as InquiryRow[], total: 0, error: 'error' as const };
  }
  return { rows: (data ?? []) as InquiryRow[], total: count ?? 0, error: null };
}

/** 상태별 건수 — 대시보드 · 필터 탭에 쓴다. */
export async function countByStatus() {
  const db = await getAdminSupabase();
  const zero: Record<InquiryStatus, number> = { NEW: 0, IN_PROGRESS: 0, DONE: 0, SPAM: 0 };
  if (!db) return { counts: zero, total: 0, error: 'unavailable' as const };
  const { data, error } = await db.from('inquiries').select('status');
  if (error) {
    console.error('[admin/inquiries] count 실패:', error.code);
    return { counts: zero, total: 0, error: 'error' as const };
  }
  const counts = { ...zero };
  for (const r of data ?? []) if (isInquiryStatus(r.status)) counts[r.status]++;
  return { counts, total: data?.length ?? 0, error: null };
}

/** 화면에 실제로 들어온 문의 서비스 값 목록 — 필터 select 에 쓴다. */
export async function distinctServices() {
  const db = await getAdminSupabase();
  if (!db) return [] as string[];
  const { data } = await db.from('inquiries').select('service').limit(1000);
  return [...new Set((data ?? []).map((r) => r.service as string))].sort();
}

export async function getInquiry(id: string) {
  const db = await getAdminSupabase();
  if (!db) return null;
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const { data, error } = await db.from('inquiries').select('*').eq('id', id).maybeSingle();
  if (error) {
    console.error('[admin/inquiries] get 실패:', error.code);
    return null;
  }
  return (data as Inquiry | null) ?? null;
}

export async function updateInquiryStatus(id: string, status: InquiryStatus) {
  const db = await getAdminSupabase();
  if (!db) return { ok: false as const, reason: 'unavailable' };
  const { error, data } = await db
    .from('inquiries')
    .update({ status })
    .eq('id', id)
    .select('id')
    .maybeSingle();
  if (error || !data) {
    console.error('[admin/inquiries] status 변경 실패:', id, error?.code ?? 'no-row');
    return { ok: false as const, reason: 'error' };
  }
  return { ok: true as const };
}

export async function updateInquiryNote(id: string, note: string) {
  const db = await getAdminSupabase();
  if (!db) return { ok: false as const, reason: 'unavailable' };
  const admin_note = note.trim() ? note.trim().slice(0, 4000) : null;
  const { error, data } = await db
    .from('inquiries')
    .update({ admin_note })
    .eq('id', id)
    .select('id')
    .maybeSingle();
  if (error || !data) {
    console.error('[admin/inquiries] 메모 저장 실패:', id, error?.code ?? 'no-row');
    return { ok: false as const, reason: 'error' };
  }
  return { ok: true as const };
}
