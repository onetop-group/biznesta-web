'use client';

import { useId, useRef, useState, useTransition } from 'react';
import Link from 'next/link';
import { mo16 } from '@/data/mo16';
import { ArrowRight } from '@/components/shared/Arrows';
import type { ConsultationContext } from '@/data/navigation';
import {
  EMPTY_INPUT, MESSAGE_MAX, buildInquiry, toInquiryContext, validateInquiry,
  type InquiryErrors, type InquiryInput,
} from '@/lib/inquiry';
import { submitInquiry } from '@/app/actions/inquiry';
import styles from './InquiryForm.module.css';

/* 사용자에게 보여줄 문구. 실제로 보장할 수 없는 표현(즉시 연락 · 몇 분 내 ·
   오늘 연락 · 100% 회신)은 쓰지 않는다. */
const SENT_TITLE = '상담 신청이 접수되었습니다.';
const SENT_BODY = '확인 후 안내드리겠습니다.';
const ERR_GENERIC = '접수 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
const ERR_RATE = '요청이 많습니다. 잠시 후 다시 시도해주세요.';


/**
 * 모바일 상담 폼 — real-size layer.
 *
 * MO16 Visual Master 의 상담 폼은 1024x1536 아트워크가 430px 로 축소되면서
 * 입력 높이 21.8px · 체크박스 10.9px 가 된다. 그래서 CONTACT 화면에서는 폼
 * 영역(아트워크 y 778~1160)만 이 real-size 폼으로 바꾸고, 위아래의 공식 화면은
 * 그대로 이어 붙인다. 문구 · 색 · 사진 · 필드 구성은 시안 그대로다.
 *
 * 저장 · 발송은 아직 없다. 제출하면 검증만 하고 아무것도 보내지 않는다.
 */
export default function InquiryForm({ context = {} }: { context?: ConsultationContext }) {
  const { form } = mo16;
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

  const id = (k: string) => `iq-${uid}-${k}`;
  const errId = (k: string) => `iq-${uid}-${k}-error`;
  const err = (k: keyof InquiryInput) => errors[k];
  const aria = (k: keyof InquiryInput) => ({
    'aria-invalid': err(k) ? true : undefined,
    'aria-describedby': err(k) ? errId(k) : undefined,
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();                       // 새로고침을 일으키지 않는다
    if (pending) return;                      // 중복 제출 방지
    const next = validateInquiry(v);
    setErrors(next);
    setFailure(null);
    const first = Object.keys(next)[0];
    if (first) {
      const el = box.current?.querySelector<HTMLElement>(`#${CSS.escape(id(first))}`);
      el?.focus();
      return;
    }
    const record = buildInquiry(v, {
      ...toInquiryContext(context, 'mobile'),
      submittedPath: typeof window === 'undefined' ? undefined : window.location.pathname,
    });
    startSubmit(async () => {
      const res = await submitInquiry(record, hp);
      if (res.ok) {
        setV(EMPTY_INPUT);                    // 입력은 비우고
        setStatus('sent');                    // 성공 상태는 남긴다
        return;
      }
      setFailure(res.kind === 'rate' ? ERR_RATE : ERR_GENERIC);
    });
  };

  return (
    <section className={styles.wrap} aria-label="1:1 맞춤 상담 신청">
      <div className={styles.panel}>
        <picture>
          <source srcSet="/assets/mo16/form-banner.webp" type="image/webp" />
          {/* MO16 상담 패널 사진에서 잘라낸 띠. 아트워크가 그려 놓은 가짜 입력칸과
              철자가 흐트러진 장식 스크립트를 뺀 영역만 쓴다. 원본은 그대로 둔다. */}
          <img className={styles.banner} src="/assets/mo16/form-banner.jpg" alt={form.image.alt}
               width={860} height={256} loading="lazy" />
        </picture>

        <div className={styles.body}>
          <h2 className={styles.title}>{form.title}</h2>
          <p className={styles.sub}>{form.sub.join(' ')}</p>

          {status === 'sent' ? (
            <div className={styles.sent} role="status" aria-live="polite">
              <p className={styles.sentTitle}>{SENT_TITLE}</p>
              <p className={styles.sentBody}>{SENT_BODY}</p>
              <button type="button" className={styles.again} onClick={() => setStatus('idle')}>
                다시 작성하기
              </button>
            </div>
          ) : (
          <form className={styles.form} ref={box} onSubmit={onSubmit} noValidate>
            {/* 사람에게 보이지 않는 칸. 자동 입력 도구가 채우면 저장하지 않는다. */}
            <div className={styles.hp} aria-hidden="true">
              <label htmlFor={id('company')}>회사명</label>
              <input id={id('company')} name="company" type="text" tabIndex={-1}
                     autoComplete="off" value={hp} onChange={(e) => setHp(e.target.value)} />
            </div>

            {/* 상담 맥락 — 화면에 보이지 않는다. */}
            {Object.entries(context).map(([k, val]) =>
              val ? <input key={k} type="hidden" name={k} value={val} readOnly /> : null)}

            <div className={styles.field}>
              <label className={styles.label} htmlFor={id('name')}>
                이름 <span className={styles.req} aria-hidden>*</span>
              </label>
              <input id={id('name')} className={styles.input} type="text" name="name"
                     autoComplete="name" required value={v.name}
                     placeholder="이름을 입력해주세요."
                     onChange={(e) => set('name', e.target.value)} {...aria('name')} />
              {err('name') && <p id={errId('name')} className={styles.error} role="alert">{err('name')}</p>}
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor={id('contact')}>
                연락처 <span className={styles.req} aria-hidden>*</span>
              </label>
              <input id={id('contact')} className={styles.input} type="tel" name="contact"
                     autoComplete="tel" inputMode="tel" required value={v.contact}
                     placeholder="- 없이 숫자만 입력해주세요."
                     onChange={(e) => set('contact', e.target.value)} {...aria('contact')} />
              {err('contact') && <p id={errId('contact')} className={styles.error} role="alert">{err('contact')}</p>}
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor={id('service')}>
                문의 유형 <span className={styles.req} aria-hidden>*</span>
              </label>
              <select id={id('service')} className={`${styles.input} ${styles.select}`} name="service"
                      required value={v.service}
                      onChange={(e) => set('service', e.target.value)} {...aria('service')}>
                <option value="">문의 유형을 선택해주세요.</option>
                {form.fields.kindOptions.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
              {err('service') && <p id={errId('service')} className={styles.error} role="alert">{err('service')}</p>}
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor={id('message')}>
                문의 내용 <span className={styles.req} aria-hidden>*</span>
              </label>
              <textarea id={id('message')} className={styles.textarea} name="message"
                        required rows={5} maxLength={MESSAGE_MAX} value={v.message}
                        placeholder="문의 내용을 입력해주세요."
                        onChange={(e) => set('message', e.target.value)} {...aria('message')} />
              <span className={styles.counter} aria-hidden>{v.message.length}/{MESSAGE_MAX}</span>
              {err('message') && <p id={errId('message')} className={styles.error} role="alert">{err('message')}</p>}
            </div>

            <div className={styles.consentRow}>
              <label className={styles.consent} htmlFor={id('privacyConsent')}>
                <input id={id('privacyConsent')} className={styles.checkbox} type="checkbox"
                       name="privacyConsent" required checked={v.privacyConsent}
                       onChange={(e) => set('privacyConsent', e.target.checked)}
                       {...aria('privacyConsent')} />
                <span>{mo16.form.consent.label} <em className={styles.reqNote}>{mo16.form.consent.required}</em></span>
              </label>
              <Link href={mo16.form.consent.more.href} className={styles.consentMore}>
                {mo16.form.consent.more.label} &rsaquo;
              </Link>
              {err('privacyConsent') && (
                <p id={errId('privacyConsent')} className={styles.error} role="alert">{err('privacyConsent')}</p>
              )}
            </div>

            {failure && <p className={styles.failure} role="alert">{failure}</p>}

            <button type="submit" className={styles.submit} disabled={pending} aria-busy={pending}>
              <span>{pending ? '접수 중…' : form.submit}</span>
              <ArrowRight />
            </button>
          </form>
          )}
        </div>
      </div>
    </section>
  );
}
