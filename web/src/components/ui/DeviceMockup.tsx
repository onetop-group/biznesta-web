import Image from 'next/image';
import type { DesignSummary } from '@/types';
import { cx } from '@/lib/utils';
import { SampleScreen } from './SampleScreen';
import { WireframePreview } from './WireframePreview';

/**
 * 디바이스 목업 — 시안 32장을 관통하는 핵심 시각 요소입니다.
 * 시안 이미지를 잘라 쓰지 않고 전부 HTML/CSS 로 그립니다.
 *
 * ▸ 화면 안에 들어가는 것 (우선순위)
 *   1) pcImage / mobileImage      실제 등록된 시안 이미지  ← Phase 7 이후
 *   2) design.sample              BIZNESTA 샘플 디자인     ← 현재 주 비주얼
 *   3) WireframePreview           폴백 · 빈 상태 · 로딩
 *   화면 코드를 고치지 않고 1) 로 승격됩니다.
 *
 * ▸ variant
 *   duo      노트북 + 폰 중첩            (기본 구도)
 *   stack    노트북 + 폰 + 뒤쪽 크롭 화면 (히어로 · 상세 — 깊이 3단)
 *   laptop   노트북 단독
 *   phone    폰 단독
 *   browser  브라우저 카드              (전시 공간의 떠 있는 화면)
 *   frame    베젤 없는 화면              (에디토리얼 갤러리 — 작품 자체)
 */

export interface MockupSource {
  design: DesignSummary;
  /** Phase 7 이후 design_images 에서 채워집니다 */
  pcImage?: string;
  mobileImage?: string;
  alt?: string;
}

function Screen({ source, device }: { source: MockupSource; device: 'pc' | 'mobile' }) {
  const src = device === 'pc' ? source.pcImage : source.mobileImage;

  if (src) {
    return (
      <Image
        src={src}
        alt={source.alt ?? source.design.title}
        fill
        sizes="(max-width: 1024px) 60vw, 45vw"
        className="object-cover object-top"
      />
    );
  }

  if (source.design.sample) {
    return <SampleScreen design={source.design} device={device} />;
  }

  /* 폴백 — 샘플 명세도 이미지도 없을 때만 */
  return (
    <WireframePreview
      palette={source.design.palette}
      layout={source.design.previewLayout}
      device={device}
    />
  );
}

/* ------------------------------------------------------------------ */

function Laptop({
  source,
  className,
  elevated = true,
}: {
  source: MockupSource;
  className?: string;
  elevated?: boolean;
}) {
  return (
    <div className={cx('relative', className)}>
      <div
        className={cx(
          'relative overflow-hidden rounded-[0.9cqw] bg-[#0B1420] p-[0.5cqw] ring-1 ring-black/25',
          elevated && 'shadow-[0_40px_90px_-30px_rgba(8,20,36,0.62),0_14px_30px_-14px_rgba(8,20,36,0.4)]',
        )}
        style={{ aspectRatio: '16 / 10', containerType: 'inline-size' }}
      >
        <div className="relative size-full overflow-hidden rounded-[0.45cqw] bg-white">
          <Screen source={source} device="pc" />
          {/* 유리 반사 */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'linear-gradient(112deg, rgba(255,255,255,0.26) 0%, rgba(255,255,255,0.05) 30%, rgba(255,255,255,0) 52%)',
            }}
          />
        </div>
      </div>
      {/* 받침 */}
      <div className="relative mx-auto h-[0.9%] min-h-[7px] w-[112%] -translate-x-[5.35%] rounded-b-[8px] bg-gradient-to-b from-[#cfd4da] via-[#aeb5bf] to-[#7f8894] shadow-[0_14px_26px_-12px_rgba(8,20,36,0.55)]">
        <span className="absolute left-1/2 top-0 h-[35%] w-[13%] -translate-x-1/2 rounded-b-full bg-[#78828f]" />
      </div>
    </div>
  );
}

function Phone({ source, className }: { source: MockupSource; className?: string }) {
  return (
    <div
      className={cx(
        'relative overflow-hidden rounded-[9%] bg-[#0B1420] p-[1.6%] ring-1 ring-black/25',
        'shadow-[0_30px_60px_-22px_rgba(8,20,36,0.68)]',
        className,
      )}
      style={{ aspectRatio: '9 / 18.6', containerType: 'inline-size' }}
    >
      <div className="relative size-full overflow-hidden rounded-[7.5%] bg-white">
        <Screen source={source} device="mobile" />
        <span
          aria-hidden="true"
          className="absolute left-1/2 top-[1.2%] h-[1.6%] w-[32%] -translate-x-1/2 rounded-full bg-[#0B1420]"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background: 'linear-gradient(120deg, rgba(255,255,255,0.24) 0%, rgba(255,255,255,0) 44%)',
          }}
        />
      </div>
    </div>
  );
}

function BrowserCard({
  source,
  className,
  chrome = true,
}: {
  source: MockupSource;
  className?: string;
  chrome?: boolean;
}) {
  return (
    <div
      className={cx(
        'overflow-hidden rounded-[0.7cqw] bg-white ring-1 ring-black/10',
        'shadow-[0_34px_70px_-24px_rgba(4,10,20,0.72)]',
        className,
      )}
      style={{ containerType: 'inline-size' }}
    >
      {chrome && (
        <div className="flex items-center gap-[0.45cqw] bg-[#e7eaee] px-[1cqw] py-[0.65cqw]">
          <span className="size-[0.5cqw] rounded-full bg-[#c3c9d0]" />
          <span className="size-[0.5cqw] rounded-full bg-[#c3c9d0]" />
          <span className="size-[0.5cqw] rounded-full bg-[#c3c9d0]" />
        </div>
      )}
      <div className="relative" style={{ aspectRatio: '16 / 10' }}>
        <Screen source={source} device="pc" />
      </div>
    </div>
  );
}

/** 베젤 없는 화면 — 작품 자체를 보여주는 에디토리얼 갤러리용 */
function Frame({
  source,
  className,
  ratio = '16 / 10',
}: {
  source: MockupSource;
  className?: string;
  ratio?: string;
}) {
  return (
    <div
      className={cx('relative overflow-hidden bg-white', className)}
      style={{ aspectRatio: ratio }}
    >
      <Screen source={source} device="pc" />
    </div>
  );
}

/* ------------------------------------------------------------------ */

interface DeviceMockupProps {
  source: MockupSource;
  variant?: 'duo' | 'stack' | 'laptop' | 'phone' | 'browser' | 'frame';
  className?: string;
  phoneScale?: number;
  ratio?: string;
  chrome?: boolean;
  /** stack 에서 뒤쪽에 겹칠 두 번째 디자인 */
  behind?: DesignSummary;
}

export function DeviceMockup({
  source,
  variant = 'duo',
  className,
  phoneScale = 0.24,
  ratio,
  chrome = true,
  behind,
}: DeviceMockupProps) {
  if (variant === 'laptop') return <Laptop source={source} className={className} />;
  if (variant === 'phone') return <Phone source={source} className={className} />;
  if (variant === 'browser') return <BrowserCard source={source} className={className} chrome={chrome} />;
  if (variant === 'frame') return <Frame source={source} className={className} ratio={ratio} />;

  /* stack — 뒤쪽 크롭 화면 / 노트북 / 폰의 3단 깊이 */
  if (variant === 'stack') {
    return (
      <div className={cx('relative', className)}>
        {/* 뒤 — 살짝 흐리고 어두운, 잘린 화면 */}
        {behind && (
          <div
            aria-hidden="true"
            className="absolute right-[-4%] top-[-9%] w-[52%] opacity-55 blur-[1.6px]"
            style={{ transform: 'rotate(3.5deg)' }}
          >
            <BrowserCard source={{ design: behind }} chrome={false} />
          </div>
        )}
        {/* 중 — 주 화면 */}
        <Laptop source={source} className="relative z-20 w-[86%]" />
        {/* 앞 — 폰 */}
        <div
          className="absolute bottom-[-11%] right-[2%] z-30"
          style={{ width: `${phoneScale * 100}%` }}
        >
          <Phone source={source} />
        </div>
      </div>
    );
  }

  /* duo */
  return (
    <div className={cx('relative', className)}>
      <Laptop source={source} className="w-[88%]" />
      <div className="absolute bottom-[-9%] right-0" style={{ width: `${phoneScale * 100}%` }}>
        <Phone source={source} />
      </div>
    </div>
  );
}
