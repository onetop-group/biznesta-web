import Link from 'next/link';
import { notFound } from 'next/navigation';
import { INQUIRY_STATUSES, STATUS_LABEL, getInquiry } from '@/lib/admin/inquiries';
import { Card, PageHead, StatusBadge, fmtDate, screenLabel, sourceLabel } from '@/components/admin/ui';
import { changeStatus, saveNote } from '../actions';
import styles from '../inquiries.module.css';

export const metadata = { title: '문의 상세' };

type SP = Record<string, string | string[] | undefined>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? '';

/**
 * 문의 상세 — 고객 기본정보 · 문의 정보 · 운영 정보를 한눈에.
 * 이 화면은 로그인한 관리자에게만 열린다(layout 의 requireAdmin + proxy).
 * 주소에는 문의 id(uuid)만 들어가고 개인정보는 들어가지 않는다.
 */
export default async function Page({
  params, searchParams,
}: { params: Promise<{ id: string }>; searchParams: Promise<SP> }) {
  const { id } = await params;
  const sp = await searchParams;
  const saved = one(sp.saved);
  const err = one(sp.err);

  const q = await getInquiry(id);
  if (!q) notFound();

  const tel = q.contact.replace(/[^0-9+]/g, '');

  return (
    <>
      <Link href="/admin/inquiries" className={styles.back}>← 문의함</Link>
      <PageHead title={`${q.name} 님의 문의`} desc={`${q.service} · ${fmtDate(q.created_at)} 접수`}>
        <StatusBadge status={q.status} />
      </PageHead>

      {saved === 'status' && <p className={styles.ok} role="status">상태를 바꿨습니다.</p>}
      {saved === 'note' && <p className={styles.ok} role="status">메모를 저장했습니다.</p>}
      {err && <p className={styles.warn} role="alert">저장하지 못했습니다. 다시 시도해 주세요.</p>}

      <div className={styles.detailGrid}>
        <div>
          <Card title="고객 기본정보">
            <dl className={styles.dl}>
              <dt>이름</dt><dd>{q.name}</dd>
              <dt>전화</dt><dd>{tel ? <a href={`tel:${tel}`}>{q.contact}</a> : q.contact}</dd>
              <dt>이메일</dt><dd>{q.email ? <a href={`mailto:${q.email}`}>{q.email}</a> : '—'}</dd>
            </dl>
          </Card>

          <Card title="문의 정보">
            <dl className={styles.dl}>
              <dt>문의 서비스</dt><dd>{q.service}</dd>
              <dt>플랜</dt><dd>{q.selected_plan ?? '—'}</dd>
              <dt>유입 경로</dt><dd>{sourceLabel(q.consultation_source)}{q.screen ? ` · ${screenLabel(q.screen)}` : ''}</dd>
              <dt>선택 디자인</dt><dd>{q.selected_design ?? '—'}</dd>
              <dt>선택 카테고리</dt><dd>{q.selected_category ?? '—'}</dd>
              <dt>선택 서비스</dt><dd>{q.selected_service ?? '—'}</dd>
              <dt>보낸 화면</dt><dd>{q.submitted_path ?? '—'}</dd>
              <dt>접수 시각</dt><dd>{fmtDate(q.created_at)}</dd>
            </dl>
            <p className={styles.hint}>문의 내용</p>
            <p className={styles.message}>{q.message}</p>
          </Card>
        </div>

        <div>
          <Card title="상태">
            <form action={changeStatus} className={styles.opRow}>
              <input type="hidden" name="id" value={q.id} />
              <select name="status" defaultValue={q.status} className={styles.select} aria-label="상태">
                {INQUIRY_STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABEL[s].label}</option>)}
              </select>
              <button type="submit" className={styles.btn}>상태 변경</button>
            </form>
            <p className={styles.hint}>스팸으로 표시해도 데이터는 지워지지 않습니다. 삭제 기능은 없습니다.</p>
          </Card>

          <Card title="관리자 메모">
            <form action={saveNote}>
              <input type="hidden" name="id" value={q.id} />
              <textarea name="note" defaultValue={q.admin_note ?? ''} className={styles.textarea}
                        maxLength={4000} placeholder="통화 내용, 다음 할 일, 견적 메모 등 (고객에게 보이지 않습니다)" />
              <div className={styles.opRow} style={{ marginTop: 10 }}>
                <button type="submit" className={styles.btn}>메모 저장</button>
              </div>
            </form>
          </Card>

          <Card title="운영 정보">
            <dl className={styles.meta}>
              <dt>현재 상태</dt><dd><StatusBadge status={q.status} /></dd>
              <dt>최초 접수</dt><dd>{fmtDate(q.created_at)}</dd>
              <dt>최근 수정</dt><dd>{fmtDate(q.updated_at)}</dd>
              <dt>문의 ID</dt><dd style={{ fontSize: 11.5 }}>{q.id}</dd>
            </dl>
          </Card>
        </div>
      </div>
    </>
  );
}
