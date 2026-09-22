import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  PLANS, PROJECT_STATUSES, PROJECT_STATUS_LABEL, SERVICE_TYPES, getProject, serviceLabel,
} from '@/lib/admin/projects';
import { Card, PageHead, ProjectStatusBadge, fmtDate } from '@/components/admin/ui';
import { changeProjectStatus, saveProjectInfo, saveProjectNote } from '../actions';
import styles from '../projects.module.css';

export const metadata = { title: '프로젝트 상세' };

type SP = Record<string, string | string[] | undefined>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? '';

const SAVED_TEXT: Record<string, string> = {
  status: '상태를 바꿨습니다.',
  note: '메모를 저장했습니다.',
  info: '프로젝트 정보를 저장했습니다.',
};
const ERROR_TEXT: Record<string, string> = {
  required: '고객명 · 연락처 · 프로젝트명은 반드시 입력해 주세요.',
  service: '제작 유형을 선택해 주세요.',
  plan: '플랜 값이 올바르지 않습니다.',
  date: '목표 완료일은 착수일보다 앞설 수 없습니다.',
};

/**
 * 프로젝트 상세. 로그인한 관리자에게만 열린다.
 * 원본 문의(source_inquiry_id)는 표시하고 이동할 수 있지만 바꿀 수 없다 —
 * 화면에 입력칸을 두지 않고, DB 도 그 컬럼의 UPDATE 권한을 주지 않는다.
 */
export default async function Page({
  params, searchParams,
}: { params: Promise<{ id: string }>; searchParams: Promise<SP> }) {
  const { id } = await params;
  const sp = await searchParams;
  const saved = one(sp.saved);
  const err = one(sp.err);
  const created = one(sp.created);

  const p = await getProject(id);
  if (!p) notFound();

  const tel = p.client_contact.replace(/[^0-9+]/g, '');

  return (
    <>
      <Link href="/admin/projects" className={styles.back}>← 프로젝트</Link>
      <PageHead title={p.title} desc={`${p.project_no} · ${p.client_name} · ${serviceLabel(p.service_type)}`}>
        <ProjectStatusBadge status={p.status} />
      </PageHead>

      {created && <p className={styles.ok} role="status">프로젝트를 만들었습니다. 번호는 {p.project_no} 입니다.</p>}
      {saved && <p className={styles.ok} role="status">{SAVED_TEXT[saved] ?? '저장했습니다.'}</p>}
      {err && <p className={styles.warn} role="alert">{ERROR_TEXT[err] ?? '저장하지 못했습니다. 다시 시도해 주세요.'}</p>}

      <div className={styles.grid}>
        <div>
          <Card title="고객 · 프로젝트 정보">
            <form action={saveProjectInfo}>
              <input type="hidden" name="id" value={p.id} />
              <div className={styles.fields}>
                <label className={styles.field}>
                  <span className={styles.label}>고객명 <span className={styles.req}>*</span></span>
                  <input name="client_name" defaultValue={p.client_name} required maxLength={100} className={styles.input} />
                </label>
                <label className={styles.field}>
                  <span className={styles.label}>연락처 <span className={styles.req}>*</span></span>
                  <input name="client_contact" defaultValue={p.client_contact} required maxLength={50} className={styles.input} />
                </label>
                <label className={`${styles.field} ${styles.fieldWide}`}>
                  <span className={styles.label}>이메일</span>
                  <input name="client_email" type="email" defaultValue={p.client_email ?? ''} maxLength={200} className={styles.input} />
                </label>
                <label className={`${styles.field} ${styles.fieldWide}`}>
                  <span className={styles.label}>프로젝트명 <span className={styles.req}>*</span></span>
                  <input name="title" defaultValue={p.title} required maxLength={200} className={styles.input} />
                </label>
                <label className={styles.field}>
                  <span className={styles.label}>제작 유형 <span className={styles.req}>*</span></span>
                  <select name="service_type" defaultValue={p.service_type} required className={styles.select}>
                    {SERVICE_TYPES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </label>
                <label className={styles.field}>
                  <span className={styles.label}>플랜</span>
                  <select name="plan" defaultValue={p.plan ?? ''} className={styles.select}>
                    <option value="">아직 미정</option>
                    {PLANS.map((v) => <option key={v} value={v}>{v}</option>)}
                  </select>
                </label>
                <label className={styles.field}>
                  <span className={styles.label}>착수일</span>
                  <input name="started_on" type="date" defaultValue={p.started_on ?? ''} className={styles.input} />
                </label>
                <label className={styles.field}>
                  <span className={styles.label}>목표 완료일</span>
                  <input name="target_on" type="date" defaultValue={p.target_on ?? ''} className={styles.input} />
                </label>
              </div>
              <div className={styles.actions}>
                <button type="submit" className={styles.btn}>정보 저장</button>
                {tel && <a href={`tel:${tel}`} className={styles.ghost}>전화 걸기</a>}
                {p.client_email && <a href={`mailto:${p.client_email}`} className={styles.ghost}>메일 쓰기</a>}
              </div>
            </form>
          </Card>

          <Card title="내부 메모">
            <form action={saveProjectNote}>
              <input type="hidden" name="id" value={p.id} />
              <textarea name="note" defaultValue={p.admin_note ?? ''} maxLength={8000} className={styles.textarea}
                        placeholder="진행 상황, 통화 내용, 다음 할 일 (고객에게 보이지 않습니다)" />
              <div className={styles.actions}>
                <button type="submit" className={styles.btn}>메모 저장</button>
              </div>
            </form>
          </Card>
        </div>

        <div>
          <Card title="상태">
            <form action={changeProjectStatus} className={styles.opRow}>
              <input type="hidden" name="id" value={p.id} />
              <select name="status" defaultValue={p.status} className={styles.select} aria-label="상태">
                {PROJECT_STATUSES.map((s) => (
                  <option key={s} value={s}>{PROJECT_STATUS_LABEL[s].label}</option>
                ))}
              </select>
              <button type="submit" className={styles.btn}>상태 변경</button>
            </form>
            <p className={styles.hint}>취소로 표시해도 기록은 지워지지 않습니다. 삭제 기능은 없습니다.</p>
          </Card>

          <Card title="시작이 된 문의">
            {p.source_inquiry_id ? (
              <>
                <Link href={`/admin/inquiries/${p.source_inquiry_id}`} className={styles.srcLink}>
                  원본 문의 보기 →
                </Link>
                <p className={styles.hint}>
                  문의 원본은 접수 당시 기록이라 바뀌지 않습니다. 연결은 만들 때 한 번만 정해지며 이후 바꿀 수 없습니다.
                </p>
              </>
            ) : (
              <p className={styles.hint}>문의 없이 직접 등록한 프로젝트입니다.</p>
            )}
          </Card>

          <Card title="운영 정보">
            <dl className={styles.meta}>
              <dt>번호</dt><dd>{p.project_no}</dd>
              <dt>현재 상태</dt><dd><ProjectStatusBadge status={p.status} /></dd>
              <dt>생성일</dt><dd>{fmtDate(p.created_at)}</dd>
              <dt>수정일</dt><dd>{fmtDate(p.updated_at)}</dd>
            </dl>
          </Card>
        </div>
      </div>
    </>
  );
}
