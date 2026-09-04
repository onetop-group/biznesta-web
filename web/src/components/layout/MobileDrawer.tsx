'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { mainCta, mainNav } from '@/data/navigation';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/ui/Logo';
import { cx } from '@/lib/utils';

/**
 * 모바일 메뉴 — BN_MO 시안 16장의 우상단 "메뉴" 카드 버튼을 재현합니다.
 *
 * 접근성 (지시서 59항)
 *   · 버튼에 aria-expanded / aria-controls
 *   · 열리면 패널로 포커스 이동, ESC 로 닫기
 *   · 닫히면 버튼으로 포커스 복귀
 *   · 열려 있는 동안 배경 스크롤 잠금
 */
export function MobileDrawer() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  /* 페이지가 바뀌면 자동으로 닫습니다 */
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panelRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        className="flex h-11 w-14 flex-col items-center justify-center gap-1 rounded-xl bg-paper shadow-[var(--shadow-card)]"
      >
        <span className="sr-only">메뉴 열기</span>
        <span aria-hidden="true" className="flex flex-col gap-[5px]">
          <span className="block h-[2px] w-6 rounded bg-navy" />
          <span className="block h-[2px] w-6 rounded bg-navy" />
          <span className="block h-[2px] w-6 rounded bg-navy" />
        </span>
        <span aria-hidden="true" className="text-[10px] font-bold text-navy">
          메뉴
        </span>
      </button>

      {/* 배경 */}
      <div
        onClick={() => setOpen(false)}
        className={cx(
          'fixed inset-0 z-40 bg-navy-deep/45 transition-opacity duration-300',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        aria-hidden="true"
      />

      {/* 패널 */}
      <div
        id="mobile-menu"
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label="전체 메뉴"
        className={cx(
          'fixed right-0 top-0 z-50 flex h-dvh w-[86%] max-w-[380px] flex-col bg-ivory',
          'transition-transform duration-300 ease-out',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <Logo width={128} />
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              buttonRef.current?.focus();
            }}
            className="flex size-10 items-center justify-center rounded-full text-navy"
          >
            <span className="sr-only">메뉴 닫기</span>
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <nav aria-label="전체 메뉴" className="flex-1 overflow-y-auto px-5 py-3">
          <ul>
            {mainNav.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <li key={item.href} className="border-b border-line/70 last:border-b-0">
                  <Link
                    href={item.href}
                    aria-current={isActive ? 'page' : undefined}
                    className="flex items-baseline gap-3 py-4"
                  >
                    <span
                      className={cx(
                        'u-eyebrow-tight text-[12px] font-bold',
                        isActive ? 'text-gold-deep' : 'text-navy',
                      )}
                    >
                      {item.labelEn}
                    </span>
                    <span className="text-[14px] text-ink-2">{item.labelKo}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-line px-5 py-5">
          <Button href={mainCta.href} arrow fullWidth size="lg">
            {mainCta.label}
          </Button>
        </div>
      </div>
    </div>
  );
}
