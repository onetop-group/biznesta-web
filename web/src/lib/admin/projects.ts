import 'server-only';
import { getAdminSupabase } from './supabase';

/**
 * 프로젝트(제작 업무) 데이터 층.
 *
 * 문의(inquiries)는 접수 당시의 원본 기록이고, 프로젝트는 상담 이후 실제로
 * 진행되는 업무다. 문의를 옮기거나 바꾸지 않는다 — `source_inquiry_id` 로
 * 한 방향 참조만 한다.
 *
 * 컬럼은 supabase/migrations/0006_projects.sql 에 실제로 있는 것만 쓴다.
 * 허용 범위는 DB 가 정한다: RLS 3정책이 전부 is_admin(), UPDATE 는 컬럼
 * GRANT 10개만, DELETE 는 권한도 정책도 없다. 이 파일이 실수해도 DB 가 막는다.
 *
 * `project_no` 는 DB 시퀀스+트리거가 채번한다. 여기서 만들지 않는다.
 * 로그에는 id 와 오류 코드만 남긴다 — 고객 이름 · 연락처는 남기지 않는다.
 */

export const PROJECT_STATUSES = [
  'CONSULTING', 'PREPARING', 'IN_PROGRESS', 'REVIEW', 'DONE', 'ON_HOLD', 'CANCELLED',
] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

/** 운영자에게 보이는 이름 · 배지 색 · 목록 정렬 우선순위(작을수록 위) */
export const PROJECT_STATUS_LABEL: Record<ProjectStatus, {
  label: string; tone: 'new' | 'progress' | 'review' | 'done' | 'hold' | 'cancelled'; order: number;
}> = {
  IN_PROGRESS: { label: '제작 중', tone: 'progress',  order: 1 },
  REVIEW:      { label: '검수',    tone: 'review',    order: 2 },
  PREPARING:   { label: '준비',    tone: 'new',       order: 3 },
  CONSULTING:  { label: '상담 중', tone: 'new',       order: 4 },
  ON_HOLD:     { label: '보류',    tone: 'hold',      order: 5 },
  DONE:        { label: '완료',    tone: 'done',      order: 6 },
  CANCELLED:   { label: '취소',    tone: 'cancelled', order: 7 },
};

/** 진행 중으로 보는 상태 — 목록 기본 정렬과 대시보드에 쓴다. */
export const ACTIVE_STATUSES: ProjectStatus[] = ['CONSULTING', 'PREPARING', 'IN_PROGRESS', 'REVIEW'];

export const isProjectStatus = (v: string): v is ProjectStatus =>
  (PROJECT_STATUSES as readonly string[]).includes(v);

/** 제작 유형 — 공개 화면의 서비스 6종(src/data/pc12.ts 의 slug)과 같은 값 */
export const SERVICE_TYPES = [
  { value: 'website',      label: '홈페이지 제작' },
  { value: 'brand-design', label: '브랜드 & 디자인' },
  { value: 'sns',          label: 'SNS 연계 · 운영' },
  { value: 'system',       label: '운영 시스템 구축' },
  { value: 'content',      label: '콘텐츠 제작' },
  { value: 'consulting',   label: '맞춤 컨설팅' },
] as const;
export type ServiceType = (typeof SERVICE_TYPES)[number]['value'];
export const isServiceType = (v: string): v is ServiceType =>
  SERVICE_TYPES.some((s) => s.value === v);
export const serviceLabel = (v: string) =>
  SERVICE_TYPES.find((s) => s.value === v)?.label ?? v;

export const PLANS = ['BASIC', 'STANDARD', 'PREMIUM', 'CUSTOM'] as const;
export type Plan = (typeof PLANS)[number];
export const isPlan = (v: string): v is Plan => (PLANS as readonly string[]).includes(v);

/**
 * 문의의 「상담 분야」 문구 → 프로젝트 제작 유형.
 * PC 폼과 모바일 폼의 문구가 서로 달라서 둘 다 받는다. 맞는 값이 없으면
 * 비워 두고 운영자가 고른다 — 추측해서 채우지 않는다.
 */
const SERVICE_FROM_INQUIRY: Record<string, ServiceType> = {
  '홈페이지 제작': 'website',
  '브랜드 & 디자인': 'brand-design',
  'SNS 연계 & 운영': 'sns',
  '운영 시스템 구축': 'system',
  '콘텐츠 제작': 'content',
  '맞춤 컨설팅': 'consulting',
  /* 모바일 폼 문구 */
  '콘텐츠 기획 · 제작': 'content',
  '채널 연계 · 운영': 'sns',
  '온라인 마케팅': 'sns',
  '운영 · 관리 대행': 'system',
  '쇼핑몰 · 온라인 스토어': 'website',
  '교육 · 컨설팅': 'consulting',
};
export const serviceTypeFromInquiry = (v: string | null): ServiceType | '' =>
  (v && SERVICE_FROM_INQUIRY[v]) || '';

export type Project = {
  id: string;
  project_no: string;
  source_inquiry_id: string | null;
  client_name: string;
  client_contact: string;
  client_email: string | null;
  title: string;
  service_type: string;
  plan: string | null;
  status: ProjectStatus;
  started_on: string | null;
  target_on: string | null;
  admin_note: string | null;
  created_at: string;
  updated_at: string;
};

const LIST_COLUMNS =
  'id, project_no, client_name, title, service_type, plan, status, target_on, updated_at, source_inquiry_id';

export type ProjectRow = Pick<Project,
  'id' | 'project_no' | 'client_name' | 'title' | 'service_type' | 'plan'
  | 'status' | 'target_on' | 'updated_at' | 'source_inquiry_id'>;

export type ProjectFilter = {
  q?: string;
  status?: ProjectStatus | '';
  service?: string;
  page?: number;
};

export const PAGE_SIZE = 50;

/* PostgREST 의 or() 는 쉼표 · 괄호가 문법 문자라 검색어에서 걷어낸다. */
const cleanQuery = (q: string) => q.replace(/[,()"'\\%]/g, ' ').trim().slice(0, 100);

export async function listProjects(f: ProjectFilter = {}) {
  const db = await getAdminSupabase();
  if (!db) return { rows: [] as ProjectRow[], total: 0, error: 'unavailable' as const };

  const page = Math.max(1, f.page ?? 1);
  let query = db
    .from('projects')
    .select(LIST_COLUMNS, { count: 'exact' })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);

  if (f.status && isProjectStatus(f.status)) query = query.eq('status', f.status);
  if (f.service && isServiceType(f.service)) query = query.eq('service_type', f.service);
  const q = f.q ? cleanQuery(f.q) : '';
  if (q) {
    const like = `%${q}%`;
    query = query.or(
      `project_no.ilike.${like},client_name.ilike.${like},client_contact.ilike.${like},title.ilike.${like}`,
    );
  }
  /* 최근 손댄 것이 위로. 진행 중 우선은 아래에서 다시 정렬한다. */
  query = query.order('updated_at', { ascending: false });

  const { data, count, error } = await query;
  if (error) {
    console.error('[admin/projects] list 실패:', error.code);
    return { rows: [] as ProjectRow[], total: 0, error: 'error' as const };
  }
  /* 진행 중 → 보류 → 완료 → 취소 순으로 묶고, 그 안에서는 최근 순.
     DB 정렬만으로는 상태 우선순위를 표현할 수 없어 여기서 한 번 더 세운다. */
  const rows = ((data ?? []) as ProjectRow[]).slice().sort((a, b) => {
    const oa = PROJECT_STATUS_LABEL[a.status]?.order ?? 99;
    const ob = PROJECT_STATUS_LABEL[b.status]?.order ?? 99;
    return oa !== ob ? oa - ob : b.updated_at.localeCompare(a.updated_at);
  });
  return { rows, total: count ?? 0, error: null };
}

export async function countProjectsByStatus() {
  const db = await getAdminSupabase();
  const zero = Object.fromEntries(PROJECT_STATUSES.map((s) => [s, 0])) as Record<ProjectStatus, number>;
  if (!db) return { counts: zero, total: 0, active: 0, error: 'unavailable' as const };
  const { data, error } = await db.from('projects').select('status');
  if (error) {
    console.error('[admin/projects] count 실패:', error.code);
    return { counts: zero, total: 0, active: 0, error: 'error' as const };
  }
  const counts = { ...zero };
  for (const r of data ?? []) if (isProjectStatus(r.status)) counts[r.status]++;
  const active = ACTIVE_STATUSES.reduce((n, s) => n + counts[s], 0);
  return { counts, total: data?.length ?? 0, active, error: null };
}

const UUID = /^[0-9a-f-]{36}$/i;

export async function getProject(id: string) {
  const db = await getAdminSupabase();
  if (!db || !UUID.test(id)) return null;
  const { data, error } = await db.from('projects').select('*').eq('id', id).maybeSingle();
  if (error) {
    console.error('[admin/projects] get 실패:', error.code);
    return null;
  }
  return (data as Project | null) ?? null;
}

/** 한 문의에서 만들어진 프로젝트들 — 문의 상세에서 「연결된 프로젝트」로 보여준다. */
export async function projectsForInquiry(inquiryId: string) {
  const db = await getAdminSupabase();
  if (!db || !UUID.test(inquiryId)) return [] as ProjectRow[];
  const { data, error } = await db
    .from('projects')
    .select(LIST_COLUMNS)
    .eq('source_inquiry_id', inquiryId)
    .order('created_at', { ascending: true });
  if (error) {
    console.error('[admin/projects] 문의별 조회 실패:', error.code);
    return [] as ProjectRow[];
  }
  return (data ?? []) as ProjectRow[];
}

export type NewProject = {
  source_inquiry_id: string | null;
  client_name: string;
  client_contact: string;
  client_email: string | null;
  title: string;
  service_type: string;
  plan: string | null;
  status: ProjectStatus;
  started_on: string | null;
  target_on: string | null;
  admin_note: string | null;
};

export type CreateResult =
  | { ok: true; id: string; project_no: string }
  | { ok: false; reason: string };

/**
 * 새 프로젝트. `project_no` 는 넘기지 않는다 — DB 트리거가 채운다.
 * `source_inquiry_id` 는 이때 한 번만 정해지고, 이후에는 DB 가 수정을 막는다.
 */
export async function createProject(p: NewProject): Promise<CreateResult> {
  const db = await getAdminSupabase();
  if (!db) return { ok: false, reason: 'unavailable' };
  const { data, error } = await db
    .from('projects')
    .insert({
      source_inquiry_id: p.source_inquiry_id,
      client_name: p.client_name,
      client_contact: p.client_contact,
      client_email: p.client_email,
      title: p.title,
      service_type: p.service_type,
      plan: p.plan,
      status: p.status,
      started_on: p.started_on,
      target_on: p.target_on,
      admin_note: p.admin_note,
    })
    .select('id, project_no')
    .maybeSingle();
  if (error || !data) {
    console.error('[admin/projects] 생성 실패:', error?.code ?? 'no-row');
    return { ok: false, reason: error?.code ?? 'error' };
  }
  return { ok: true, id: data.id as string, project_no: data.project_no as string };
}

export async function updateProjectStatus(id: string, status: ProjectStatus) {
  return patch(id, { status }, 'status');
}

export async function updateProjectNote(id: string, note: string) {
  const admin_note = note.trim() ? note.trim().slice(0, 8000) : null;
  return patch(id, { admin_note }, '메모');
}

/** 상세에서 고칠 수 있는 칸. 번호 · 생성시각 · 원본 문의는 여기에 없다(DB 도 막는다). */
export type ProjectEdit = {
  client_name: string;
  client_contact: string;
  client_email: string | null;
  title: string;
  service_type: string;
  plan: string | null;
  started_on: string | null;
  target_on: string | null;
};

export async function updateProjectInfo(id: string, e: ProjectEdit) {
  return patch(id, e, '정보');
}

async function patch(id: string, values: Record<string, unknown>, what: string) {
  const db = await getAdminSupabase();
  if (!db) return { ok: false as const, reason: 'unavailable' };
  if (!UUID.test(id)) return { ok: false as const, reason: 'id' };
  const { error, data } = await db
    .from('projects')
    .update(values)
    .eq('id', id)
    .select('id')
    .maybeSingle();
  if (error || !data) {
    console.error(`[admin/projects] ${what} 저장 실패:`, id, error?.code ?? 'no-row');
    return { ok: false as const, reason: error?.code ?? 'error' };
  }
  return { ok: true as const };
}
