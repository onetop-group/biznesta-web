'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import styles from './AdminShell.module.css';

/**
 * 태블릿 · 모바일에서 왼쪽 메뉴를 서랍으로 여닫는다.
 * 메뉴 내용(children)은 서버에서 그려 넘어온다 — 여기는 열림/닫힘만 안다.
 * 경로가 바뀌면(메뉴를 눌러 이동) 자동으로 닫힌다.
 */
export default function NavDrawer({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  /* 경로가 바뀌면 렌더 중에 바로 닫는다 (effect 로 닫으면 한 프레임 늦고 lint 도 막는다). */
  const [seenPath, setSeenPath] = useState(pathname);
  if (seenPath !== pathname) { setSeenPath(pathname); setOpen(false); }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      <button type="button" className={styles.menuBtn} aria-expanded={open}
              aria-controls="admin-drawer" onClick={() => setOpen(true)}>
        <span className={styles.menuBars} aria-hidden />
        <span>메뉴</span>
      </button>
      {open && (
        <div className={styles.drawerWrap} id="admin-drawer" role="dialog" aria-modal="true" aria-label="관리자 메뉴">
          <button type="button" className={styles.drawerBack} aria-label="메뉴 닫기" onClick={() => setOpen(false)} />
          <div className={styles.drawer}>
            <div className={styles.drawerHead}>
              <span className={styles.brandMark}>BIZNESTA</span>
              <button type="button" className={styles.drawerClose} onClick={() => setOpen(false)}>닫기</button>
            </div>
            {children}
          </div>
        </div>
      )}
    </>
  );
}
