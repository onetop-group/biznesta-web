import Link from 'next/link';
import { getInquiry } from '@/lib/admin/inquiries';
import {
  PLANS, PROJECT_STATUSES, PROJECT_STATUS_LABEL, SERVICE_TYPES, serviceTypeFromInquiry,
} from '@/lib/admin/projects';
import { Card, PageHead } from '@/components/admin/ui';
import { createProjectAction } from '../actions';
import styles from '../projects.module.css';

export const metadata = { title: '새 프로젝트' };

type SP = Record<string, string | string[] | undefined>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? '';

const ERROR_TEXT: Record<string, string> = {
  required: '고객명 · 연락처 · 프로젝트명은 반드시 입력해 주세요.',
  service: '제작 유형을 선택해 주세요.',
  plan: '플랜 값이 올바르지 않습니다.',
  status: '상태 값이 올바르지 않습니다.',
  date: '목표 완료일은 착수일보다 앞설 수 없습니다.',
  save: '저장하지 못했습니다. 잠시 후 다시 시도해 주세요.',
};

/**
 * 새 프로젝트.
 *
 * `?from=<문의 id>` 로 들어오면 그 문의의 값을 **초기값으로만** 채운다.
 * 운영자가 고쳐서 저장하며, 문의 원본은 어떤 경우에도 바뀌지 않는다.
 * 원본 문의 연결(source_inquiry_id)은 이때 한 번만 정해진다 — 생성 후에는
 * DB 가 수정을 막는다.
 */
export default async function Page({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const from = one(sp.from);
  const err = one(sp.err);
  const inquiry = from ? await getInquiry(from) : null;

  const init = inquiry
    ? {
        name: inquiry.name,
        contact: inquiry.contact,
        email: inquiry.email ?? '',
        title: `${inquiry.name} — ${inquiry.service}`,
        service: serviceTypeFromInquiry(inquiry.service),
        plan: inquiry.selected_plan && (PLANS as readonly string[]).includes(inquiry.selected_plan)
          ? inquiry.selected_plan : '',
      }
    : { name: '', contact: '', email: '', title: '', service: '', plan: '' };

  return (
    <>
      <Link href={inquiry ? `/admin/inquiries/${inquiry.id}` : '/admin/projects'} className={styles.back}>
        ← {inquiry ? '문의 상세' : '프로젝트'}
      </Link>
      <PageHead title="새 프로젝트" desc="상담이 끝난 일을 제작 업무로 등록합니다." />

      {err && <p className={styles.warn} role="alert">{ERROR_TEXT[err] ?? '저장하지 못했습니다.'}</p>}

      {inquiry && (
        <p className={styles.fromInquiry}>
          <strong>{inquiry.name}</strong> 님의 문의에서 값을 가져왔습니다. 고치실 수 있고,
          저장해도 <strong>문의 원본과 문의 상태는 그대로</strong> 남습니다.
        </p>
      )}
      {from && !inquiry && (
        <p className={styles.warn} role="alert">문의를 찾지 못해 빈 양식으로 엽니다. 문의 연결 없이 생성됩니다.</p>
      )}

      <form action={createProjectAction}>
        {inquiry && <input type="hidden" name="source_inquiry_id" value={inquiry.id} />}
        <div className={styles.grid}>
          <div>
            <Card title="고객 정보">
              <div className={styles.fields}>
                <label className={styles.field}>
                  <span className={styles.label}>고객명 <span className={styles.req}>*</span></span>
                  <input name="client_name" defaultValue={init.name} required maxLength={100} className={styles.input} />
                </label>
                <label className={styles.field}>
                  <span className={styles.label}>연락처 <span className={styles.req}>*</span></span>
                  <input name="client_contact" defaultValue={init.contact} required maxLength={50} className={styles.input} />
                </label>
                <label className={`${styles.field} ${styles.fieldWide}`}>
                  <span className={styles.label}>이메일</span>
                  <input name="client_email" type="email" defaultValue={init.email} maxLength={200} className={styles.input} />
                </label>
              </div>
              <p className={styles.hint}>
                여기 적은 값은 이 프로젝트가 갖습니다. 나중에 고쳐도 문의 원본에는 영향이 없습니다.
              </p>
            </Card>

            <Card title="프로젝트 정보">
              <div className={styles.fields}>
                <label className={`${styles.field} ${styles.fieldWide}`}>
                  <span className={styles.label}>프로젝트명 <span className={styles.req}>*</span></span>
                  <input name="title" defaultValue={init.title} required maxLength={200} className={styles.input}
                         placeholder="예: ○○치과 홈페이지 제작" />
                </label>
                <label className={styles.field}>
                  <span className={styles.label}>제작 유형 <span className={styles.req}>*</span></span>
                  <select name="service_type" defaultValue={init.service} required className={styles.select}>
                    <option value="">선택해 주세요</option>
                    {SERVICE_TYPES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </label>
                <label className={styles.field}>
                  <span className={styles.label}>플랜</span>
                  <select name="plan" defaultValue={init.plan} className={styles.select}>
                    <option value="">아직 미정</option>
                    {PLANS.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </label>
                <label className={styles.field}>
                  <span className={styles.label}>착수일</span>
                  <input name="started_on" type="date" className={styles.input} />
                </label>
                <label className={styles.field}>
                  <span className={styles.label}>목표 완료일</span>
                  <input name="target_on" type="date" className={styles.input} />
                </label>
              </div>
            </Card>
          </div>

          <div>
            <Card title="시작 상태">
              <select name="status" defaultValue="CONSULTING" className={styles.select} aria-label="상태">
                {PROJECT_STATUSES.map((s) => (
                  <option key={s} value={s}>{PROJECT_STATUS_LABEL[s].label}</option>
                ))}
              </select>
              <p className={styles.hint}>프로젝트 번호는 저장할 때 자동으로 붙습니다.</p>
            </Card>

            <Card title="내부 메모">
              <textarea name="admin_note" maxLength={8000} className={styles.textarea}
                        placeholder="상담 내용, 정해진 것, 다음 할 일 (고객에게 보이지 않습니다)" />
            </Card>

            <div className={styles.actions}>
              <button type="submit" className={styles.btn}>프로젝트 만들기</button>
              <Link href={inquiry ? `/admin/inquiries/${inquiry.id}` : '/admin/projects'} className={styles.ghost}>취소</Link>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
