'use client';

import { useId, useRef, useState, useTransition } from 'react';
import Link from 'next/link';
import { pc16 } from '@/data/pc16';
import { ArrowRight } from '@/components/shared/Arrows';
import type { ConsultationContext } from '@/data/navigation';
import {
  EMPTY_INPUT, MESSAGE_MAX, buildInquiry, toInquiryContext, validateInquiry,
  type InquiryErrors, type InquiryInput,
} from '@/lib/inquiry';
import { submitInquiry } from '@/app/actions/inquiry';
import styles from './Pc16.module.css';
/* 사용자에게 보여줄 문구. 실제로 보장할 수 없는 표현(즉시 연락 · 몇 분 내 ·
   오늘 연락 · 100% 회신)은 쓰지 않는다. */
const SENT_TITLE = '상담 신청이 접수되었습니다.';
const SENT_BODY = '확인 후 안내드리겠습니다.';
const ERR_GENERIC = '접수 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
const ERR_RATE = '요청이 많습니다. 잠시 후 다시 시도해주세요.';


/**
 * PC 상담 폼.
 *
 * PC16 의 폼은 아트워크 패널(x 43~830) 안에 있고 그 오른쪽에 방문 상담 정보와
 * 안내 패널이 같은 높이에 붙어 있어서, 모바일처럼 폼 영역만 잘라낼 수 없다.
 * 그래서 패널 안에서 실제로 쓸 수 있는 크기까지 컨트롤을 키우고(입력 34→44
 * unit, 글자 13.4→15 unit, 체크박스 13→18 unit), 검증 · 데이터 모델 ·
 * 상담 맥락은 모바일 real-size 폼과 완전히 같은 것을 쓴다(lib/inquiry).
 *
 * 좌표는 아트워크 단위(1536 기준)이며 패널 안쪽 여백에서만 재배치했다.
 * 저장 · 발송은 아직 없다.
 */
const u = (n: number) => `calc(${n} * var(--s))`;

export default function Pc16Form({ context = {} }: { context?: ConsultationContext }) {
  const { form } = pc16;
  const f = form.fields;
  const uid = useId().replace(/:/g, '');
  const [v, setV] = useState<InquiryInput>(EMPTY_INPUT);
  const [errors, setErrors] = useState<InquiryErrors>({});
  const [status, setStatus] = useState<'idle' | 'sent'>('idle');
  const [failure, setFailure] = useState<string | null>(null);
  const [hp, setHp] = useState('');            // honeypot
  const [pending, startSubmit] = useTransition();
  const box = useRef<HTMLFormElement>(null);

  const set = <K extends keyof InquiryInput>(k: K, val: InquiryInput[K]) => {
    setV((p) => ({ ...p, [k]: val }));
    setErrors((p) => (p[k] ? { ...p, [k]: undefined } : p));
    setFailure(null);
  };

  const id = (k: string) => `pc-iq-${uid}-${k}`;
  const errId = (k: string) => `pc-iq-${uid}-${k}-error`;
  const aria = (k: keyof InquiryInput) => ({
    'aria-invalid': errors[k] ? true : undefined,
    'aria-describedby': errors[k] ? errId(k) : undefined,
  });
  const note = (k: keyof InquiryInput) =>
    errors[k] ? <span id={errId(k)} className={styles.fieldError} role="alert">{errors[k]}</span> : null;

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (pending) return;                      // 중복 제출 방지
    const next = validateInquiry(v, { email: true });
    setErrors(next);
    setFailure(null);
    const first = Object.keys(next)[0];
    if (first) {
      box.current?.querySelector<HTMLElement>(`#${CSS.escape(id(first))}`)?.focus();
      return;
    }
    const record = buildInquiry(v, {
      ...toInquiryContext(context, 'pc'),
      submittedPath: typeof window === 'undefined' ? undefined : window.location.pathname,
    });
    startSubmit(async () => {
      const res = await submitInquiry(record, hp);
      if (res.ok) {
        setV(EMPTY_INPUT);
        setStatus('sent');
        return;
      }
      setFailure(res.kind === 'rate' ? ERR_RATE : ERR_GENERIC);
    });
  };

  if (status === 'sent') {
    return (
      <div className={styles.sent} role="status" aria-live="polite">
        <p className={styles.sentTitle}>{SENT_TITLE}</p>
        <p className={styles.sentBody}>{SENT_BODY}</p>
        <button type="button" className={styles.again} onClick={() => setStatus('idle')}>
          다시 작성하기
        </button>
      </div>
    );
  }

  return (
    <form className={styles.form} ref={box} onSubmit={onSubmit} noValidate>
      {/* 사람에게 보이지 않는 칸. 자동 입력 도구가 채우면 저장하지 않는다. */}
      <span className={styles.hp} aria-hidden="true">
        <label htmlFor={id('company')}>회사명</label>
        <input id={id('company')} name="company" type="text" tabIndex={-1}
               autoComplete="off" value={hp} onChange={(e) => setHp(e.target.value)} />
      </span>

      {/* 상담 맥락 — 화면에 보이지 않는다. */}
      {Object.entries(context).map(([k, val]) =>
        val ? <input key={k} type="hidden" name={k} value={val} readOnly /> : null)}

      <label className={styles.fieldLabel} style={{ left: u(72), top: u(616) }} htmlFor={id('name')}>
        {f.name.label} <span className={styles.req}>*</span> {note('name')}
      </label>
      <input id={id('name')} name="name" className={styles.input}
             style={{ left: u(70), top: u(634), width: u(248) }}
             placeholder={f.name.placeholder} autoComplete="name" required
             value={v.name} onChange={(e) => set('name', e.target.value)} {...aria('name')} />

      <label className={styles.fieldLabel} style={{ left: u(341), top: u(616) }} htmlFor={id('contact')}>
        {f.phone.label} <span className={styles.req}>*</span> {note('contact')}
      </label>
      <input id={id('contact')} name="contact" className={styles.input}
             style={{ left: u(339), top: u(634), width: u(246) }}
             placeholder={f.phone.placeholder} inputMode="tel" autoComplete="tel" required
             value={v.contact} onChange={(e) => set('contact', e.target.value)} {...aria('contact')} />

      <label className={styles.fieldLabel} style={{ left: u(72), top: u(688) }} htmlFor={id('email')}>
        {f.email.label} {note('email')}
      </label>
      <input id={id('email')} name="email" type="email" className={styles.input}
             style={{ left: u(70), top: u(706), width: u(248) }}
             placeholder={f.email.placeholder} autoComplete="email"
             value={v.email} onChange={(e) => set('email', e.target.value)} {...aria('email')} />

      <label className={styles.fieldLabel} style={{ left: u(341), top: u(688) }} htmlFor={id('service')}>
        {f.topic.label} <span className={styles.req}>*</span> {note('service')}
      </label>
      <select id={id('service')} name="service" className={`${styles.input} ${styles.select}`}
              style={{ left: u(339), top: u(706), width: u(246) }} required
              value={v.service} onChange={(e) => set('service', e.target.value)} {...aria('service')}>
        <option value="" disabled>{f.topic.placeholder}</option>
        {f.topic.options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>

      <label className={styles.fieldLabel} style={{ left: u(72), top: u(756) }} htmlFor={id('message')}>
        {f.message.label} <span className={styles.req}>*</span> {note('message')}
      </label>
      <textarea id={id('message')} name="message" className={styles.textarea}
                placeholder={f.message.placeholder} required maxLength={MESSAGE_MAX}
                value={v.message} onChange={(e) => set('message', e.target.value)}
                {...aria('message')} />

      <label className={styles.consent} htmlFor={id('privacyConsent')}>
        <input id={id('privacyConsent')} name="privacyConsent" type="checkbox"
               className={styles.checkbox} required checked={v.privacyConsent}
               onChange={(e) => set('privacyConsent', e.target.checked)}
               {...aria('privacyConsent')} />
        <span>{form.consent}</span>
        {note('privacyConsent')}
      </label>
      <Link href="/privacy" className={styles.consentLink}>{form.consentLink} &gt;</Link>

      {failure && <p className={styles.failure} role="alert">{failure}</p>}

      <button type="submit" className={styles.formCta} disabled={pending} aria-busy={pending}>
        <span className={styles.formCtaLabel}>{pending ? '접수 중…' : form.cta}</span>
        <ArrowRight />
      </button>
    </form>
  );
}
