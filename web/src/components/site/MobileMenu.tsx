'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { NAV } from '@/data/navigation';
import styles from './MobileMenu.module.css';

/**
 * 모바일 헤더의 햄버거 버튼.
 *
 * 공식 모바일 시안에는 버튼만 있고 열렸을 때의 메뉴 판이 없다. 그래서 닫힌
 * 상태의 마크업은 시안 그대로 두고(클래스도 각 화면 CSS Module 것을 그대로
 * 받는다), 눌렀을 때만 메뉴 오버레이를 덧그린다. 닫혀 있는 동안에는 DOM 이
 * 늘지 않으므로 32개 화면의 렌더링 결과는 이전과 같다.
 *
 * 오버레이는 body 로 내보낸다. 모바일 스테이지가 container-type 을 쓰기
 * 때문에 그 안에 두면 position: fixed 가 화면이 아니라 스테이지를 기준으로
 * 잡혀서, 스크롤을 내린 상태에서 메뉴를 열면 화면 밖에 그려진다.
 */
export default function MobileMenu({
  cls,
  label,
}: {
  cls: { btn: string; burger: string; label: string };
  label: string;
}) {
  const [open, setOpen] = useState(false);
  /* 서버 렌더 결과와 어긋나지 않도록 붙은 뒤에만 portal 을 쓴다 */
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const panel = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panel.current?.querySelector('a')?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
      opener.current?.focus();
    };
  }, [open]);

  return (
    <>
      <button
        ref={opener}
        type="button"
        className={cls.btn}
        aria-label="메뉴 열기"
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
      >
        <span className={cls.burger} aria-hidden><span /><span /><span /></span>
        <span className={cls.label}>{label}</span>
      </button>

      {open && mounted && createPortal(
        <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="사이트 메뉴">
          <button type="button" className={styles.scrim} aria-label="메뉴 닫기"
                  onClick={() => setOpen(false)} />
          <div className={styles.panel} ref={panel}>
            <div className={styles.top}>
              <span className={styles.brand}>BIZNESTA</span>
              <button type="button" className={styles.close} aria-label="메뉴 닫기"
                      onClick={() => setOpen(false)}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor"
                     strokeWidth="1.6" strokeLinecap="round" aria-hidden>
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
              </button>
            </div>

            <nav className={styles.nav} aria-label="주요 메뉴">
              {NAV.map((item) => (
                <Link key={item.href} href={item.href} className={styles.item}
                      onClick={() => setOpen(false)}>
                  <span className={styles.ko}>{item.ko}</span>
                  <span className={styles.en}>{item.en}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}
