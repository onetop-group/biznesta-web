import Image from 'next/image';
import type { Palette, PreviewLayout } from '@/types';
import { cx } from '@/lib/utils';
import { WireframePreview } from './WireframePreview';

/**
 * 디바이스 목업 — 시안 32장 전체를 관통하는 핵심 시각 요소입니다.
 *
 * 시안에서는 사진으로 합성돼 있지만, 여기서는 전부 HTML/CSS 로 그립니다.
 * (시안 이미지를 잘라 쓰는 것은 금지 사항입니다.)
 *
 * ▸ 화면 안에 들어가는 것
 *   1) imageSrc 가 있으면 실제 시안 이미지        ← Phase 7 이후
 *   2) 없으면 palette · layout 기반 추상 와이어프레임 ← 현재
 *   이 분기 덕분에 design_images 가 연결되면 화면 코드 수정 없이
 *   실제 이미지로 바뀝니다.
 *
 * ▸ variant
 *   duo     노트북 + 폰 중첩 (BN_PC_01 · 04 · 06 · 07)
 *   laptop  노트북 단독
 *   phone   폰 단독
 *   browser 브라우저 카드 (BN_PC_02 의 떠 있는 화면 군집용)
 */

interface ScreenSource {
  palette: Palette;
  layout: PreviewLayout;
  /** Phase 7 이후 design_images 에서 채워집니다 */
  pcImage?: string;
  mobileImage?: string;
  /** 접근성 — 이미지가 실제로 있을 때만 사용 */
  alt?: string;
}

function Screen({
  source,
  device,
  className,
}: {
  source: ScreenSource;
  device: 'pc' | 'mobile';
  className?: string;
}) {
  const src = device === 'pc' ? source.pcImage : source.mobileImage;

  if (src) {
    return (
      <Image
        src={src}
        alt={source.alt ?? ''}
        fill
        sizes="(max-width: 1024px) 50vw, 40vw"
        className={cx('object-cover object-top', className)}
      />
    );
  }

  return (
    <WireframePreview palette={source.palette} layout={source.layout} device={device} className={className} />
  );
}

/* ------------------------------------------------------------------ */
/* 노트북                                                               */
/* ------------------------------------------------------------------ */

function Laptop({ source, className }: { source: ScreenSource; className?: string }) {
  return (
    <div className={cx('relative', className)}>
      {/* 화면 */}
      <div
        className="relative overflow-hidden rounded-[10px] bg-navy p-[6px] shadow-[0_30px_70px_-24px_rgba(13,35,64,0.5)] ring-1 ring-navy/25"
        style={{ aspectRatio: '16 / 10' }}
      >
        <div className="relative h-full w-full overflow-hidden rounded-[5px] bg-white">
          <Screen source={source} device="pc" />
          {/* 화면 유리 반사 */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'linear-gradient(115deg, rgba(255,255,255,0.32) 0%, rgba(255,255,255,0) 42%)',
            }}
          />
        </div>
      </div>
      {/* 받침 */}
      <div className="relative mx-auto h-[9px] w-[112%] -translate-x-[5.35%] rounded-b-[10px] bg-gradient-to-b from-[#c8cdd4] to-[#8e97a3] shadow-[0_10px_22px_-10px_rgba(13,35,64,0.55)]">
        <span className="absolute left-1/2 top-0 h-[3px] w-[14%] -translate-x-1/2 rounded-b-full bg-[#7d8794]" />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 폰                                                                   */
/* ------------------------------------------------------------------ */

function Phone({ source, className }: { source: ScreenSource; className?: string }) {
  return (
    <div
      className={cx(
        'relative overflow-hidden rounded-[18px] bg-navy p-[4px]',
        'shadow-[0_24px_50px_-18px_rgba(13,35,64,0.6)] ring-1 ring-navy/25',
        className,
      )}
      style={{ aspectRatio: '9 / 18.5' }}
    >
      <div className="relative h-full w-full overflow-hidden rounded-[14px] bg-white">
        <Screen source={source} device="mobile" />
        <span
          aria-hidden="true"
          className="absolute left-1/2 top-[3px] h-[4px] w-[34%] -translate-x-1/2 rounded-full bg-navy/85"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background: 'linear-gradient(120deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 46%)',
          }}
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 브라우저 카드 — 떠 있는 화면 군집용                                   */
/* ------------------------------------------------------------------ */

function BrowserCard({ source, className }: { source: ScreenSource; className?: string }) {
  return (
    <div
      className={cx(
        'overflow-hidden rounded-[8px] bg-white/95 shadow-[0_28px_60px_-20px_rgba(4,12,24,0.75)] ring-1 ring-white/15',
        className,
      )}
    >
      <div className="flex items-center gap-[3px] bg-[#e9ecef] px-[6px] py-[4px]">
        <span className="size-[4px] rounded-full bg-[#c2c8ce]" />
        <span className="size-[4px] rounded-full bg-[#c2c8ce]" />
        <span className="size-[4px] rounded-full bg-[#c2c8ce]" />
      </div>
      <div className="relative" style={{ aspectRatio: '16 / 10' }}>
        <Screen source={source} device="pc" />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 공개 컴포넌트                                                        */
/* ------------------------------------------------------------------ */

interface DeviceMockupProps {
  source: ScreenSource;
  variant?: 'duo' | 'laptop' | 'phone' | 'browser';
  className?: string;
  /** duo 에서 폰의 크기 비율 (노트북 폭 대비) */
  phoneScale?: number;
}

export function DeviceMockup({
  source,
  variant = 'duo',
  className,
  phoneScale = 0.26,
}: DeviceMockupProps) {
  if (variant === 'laptop') {
    return <Laptop source={source} className={className} />;
  }
  if (variant === 'phone') {
    return <Phone source={source} className={className} />;
  }
  if (variant === 'browser') {
    return <BrowserCard source={source} className={className} />;
  }

  /* duo — 노트북 위에 폰을 겹칩니다. 시안의 대표 구도입니다. */
  return (
    <div className={cx('relative', className)}>
      <Laptop source={source} className="w-[88%]" />
      <div
        className="absolute bottom-[-9%] right-0"
        style={{ width: `${phoneScale * 100}%` }}
      >
        <Phone source={source} />
      </div>
    </div>
  );
}
