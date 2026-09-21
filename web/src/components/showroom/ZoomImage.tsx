'use client';

/**
 * 작품 이미지 — 누르면 크게 본다.
 *
 * "크게 보기" 는 화면을 가득 채우는 것이 아니라, 작품 전체의 인상을 편안하게
 * 볼 수 있는 크기로 여는 것이다. 어두운 배경은 화면 전체를 덮되 이미지는
 * 좌우 · 상하에 넉넉한 여백을 두고, PC 화면과 모바일 화면에 각각 다른 기본
 * 폭을 준다(모바일 화면은 세로로 길어 훨씬 좁게 연다).
 *
 *   · 기본 배율 1.0 에서 시작하고, 필요할 때만 사용자가 − / + 로 조절한다.
 *   · 배율은 0.75 ~ 2.5 로 제한하고 "기본 보기" 로 언제든 되돌린다.
 *   · 원본 비율 유지. 자르지도 늘이지도 않는다.
 *   · 길거나 확대한 이미지는 상하 · 좌우로 스크롤한다.
 *   · 닫기 = 닫기 버튼 · 바깥 클릭 · ESC. 열려 있는 동안 뒤 페이지는 잠긴다.
 */

import { useCallback, useEffect, useState } from 'react';
import type { ShowroomImage } from '@/data/showroom';
import styles from './Showroom.module.css';

/**
 * 기본 표시 크기 — 감상 영역 안에 "맞춰" 넣는다.
 *
 * 폭만 정하면 비율이 다른 작품끼리 체감 크기가 들쭉날쭉해진다(가로로 긴
 * 작품은 납작해 보이고, 세로로 긴 작품은 화면을 넘긴다). 그래서 보이는
 * 영역의 폭과 높이를 함께 재고, 여유를 남긴 상자 안에 원본 비율 그대로
 * 맞춘다.
 *   · 세로형끼리는 높이가, 가로형끼리는 폭이 같아져 체감 크기가 통일된다.
 *   · 어느 쪽도 화면을 가득 채우지 않는다. 확대는 사용자가 + 로 한다.
 */
function baseWidth(vw: number, vh: number, variant: 'pc' | 'mo', ratio: number) {
  const padX = vw <= 560 ? 16 : vw <= 1023 ? 28 : 44;
  const padY = vw <= 560 ? 14 : 24;
  const bar = 62;                                   /* 상단 이름 · 배율 줄 */
  const areaW = Math.max(120, vw - padX * 2);
  const areaH = Math.max(160, vh - bar - padY * 2);
  /* 감상 영역에서 실제로 쓰는 몫 — 나머지는 어두운 여백으로 남긴다 */
  const wide = vw > 1023 ? (variant === 'mo' ? 0.46 : 0.62)
    : vw > 560 ? (variant === 'mo' ? 0.55 : 0.8)
      : (variant === 'mo' ? 0.62 : 0.92);
  return Math.min(areaW * wide, areaH * 0.86 * ratio);
}

const MIN = 0.75;
const MAX = 2.5;
const STEP = 0.25;

type Props = {
  image: ShowroomImage;
  alt: string;
  /** 확대 화면 상단에 적는 이름 */
  caption: string;
  /** 상자 클래스 (크기 · 그림자는 쓰는 쪽이 정한다) */
  className?: string;
  style?: React.CSSProperties;
  eager?: boolean;
  hintLabel?: string;
  /** 확대했을 때의 기본 폭 — 가로형(pc)과 세로형(mo)이 다르다 */
  variant?: 'pc' | 'mo';
};

export default function ZoomImage({
  image, alt, caption, className, style, eager = false,
  hintLabel = '크게 보기', variant = 'pc',
}: Props) {
  const [open, setOpen] = useState(false);
  const [scale, setScale] = useState(1);
  const [box, setBox] = useState({ w: 1280, h: 800 });
  const close = useCallback(() => { setOpen(false); setScale(1); }, []);
  const step = (d: number) => setScale((s) => Math.min(MAX, Math.max(MIN, +(s + d).toFixed(2))));

  useEffect(() => {
    if (!open) return;
    const measure = () => setBox({ w: window.innerWidth, h: window.innerHeight });
    measure();
    const onResize = measure;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    window.addEventListener('resize', onResize);
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('resize', onResize);
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, close]);

  return (
    <>
      <button type="button" className={[className, styles.zoomBtn].filter(Boolean).join(' ')}
              style={style} onClick={() => setOpen(true)}
              aria-label={`${caption} 크게 보기`}>
        <img src={image.src} alt={alt} width={image.width} height={image.height}
             loading={eager ? undefined : 'lazy'} />
        <span className={styles.zoomHint} aria-hidden>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <circle cx="11" cy="11" r="6.5" />
            <path d="M15.8 15.8 21 21M11 8.4v5.2M8.4 11h5.2" strokeLinecap="round" />
          </svg>
          <span className={styles.zoomHintText}>{hintLabel}</span>
        </span>
      </button>

      {open && (
        /* 바깥을 누르면 닫힌다 — 안쪽(이미지)에서 올라온 클릭은 막는다. */
        <div className={styles.lightbox} role="dialog" aria-modal="true" aria-label={caption}
             onClick={close}>
          <div className={styles.lightboxBar} onClick={(e) => e.stopPropagation()}>
            <span className={styles.lightboxName}>{caption}</span>
            <span className={styles.lightboxSize}>{image.width} × {image.height}</span>

            <span className={styles.lightboxZoom}>
              <button type="button" className={styles.zoomStep} onClick={() => step(-STEP)}
                      disabled={scale <= MIN} aria-label="축소">−</button>
              <button type="button" className={styles.zoomReset} onClick={() => setScale(1)}
                      disabled={scale === 1}>기본 보기</button>
              <button type="button" className={styles.zoomStep} onClick={() => step(STEP)}
                      disabled={scale >= MAX} aria-label="확대">+</button>
            </span>

            <button type="button" className={styles.lightboxClose} onClick={close} aria-label="닫기">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <div className={styles.lightboxScroll} onClick={close}>
            {/* 원본 비율 그대로. 기본 폭은 화면을 가득 채우지 않는다. */}
            <img className={styles.lightboxImg}
                 style={{ width: Math.round(baseWidth(box.w, box.h, variant, image.width / image.height) * scale) }}
                 src={image.src} alt={alt} width={image.width} height={image.height}
                 onClick={(e) => e.stopPropagation()} />
          </div>
        </div>
      )}
    </>
  );
}
