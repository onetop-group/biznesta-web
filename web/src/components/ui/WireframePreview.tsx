import type { Palette, PreviewLayout } from '@/types';
import { cx } from '@/lib/utils';

/**
 * 디자인 미리보기 — 실제 시안 이미지가 등록되기 전까지 쓰는 추상 화면.
 *
 * ⚠️ 왜 이렇게 만드는가
 *    · 시안 PNG 를 잘라 붙이면 "이미지를 통이미지로 사용"이 되어 금지 사항입니다.
 *    · 가짜 고객사 로고 · 사진 · 후기를 만들 수 없습니다.
 *    그래서 사진 없이 구조만 CSS 로 그립니다. 각 디자인의 palette 를 써서
 *    쇼룸에 색과 레이아웃의 다양성이 보이도록 했습니다.
 *
 * ⚠️ Phase 7 에서 design_images 에 실제 이미지가 등록되면
 *    DeviceMockup 이 이 컴포넌트 대신 <Image> 를 렌더합니다.
 *    이 파일을 지울 필요는 없습니다 — 이미지가 아직 없는 디자인의
 *    폴백으로 계속 쓰입니다.
 */

interface WireframePreviewProps {
  palette: Palette;
  layout: PreviewLayout;
  device?: 'pc' | 'mobile';
  className?: string;
}

/** 색을 옅게 쓰기 위한 헬퍼 — hex 에 알파를 붙입니다 */
function alpha(hex: string, value: number) {
  const clamped = Math.round(Math.min(1, Math.max(0, value)) * 255);
  return `${hex}${clamped.toString(16).padStart(2, '0')}`;
}

function Bar({
  w,
  h = 4,
  color,
  round = 2,
}: {
  w: string;
  h?: number;
  color: string;
  round?: number;
}) {
  return (
    <span
      style={{ width: w, height: h, backgroundColor: color, borderRadius: round }}
      className="block"
    />
  );
}

export function WireframePreview({
  palette,
  layout,
  device = 'pc',
  className,
}: WireframePreviewProps) {
  const isMobile = device === 'mobile';
  const ink = palette.text;
  const soft = alpha(ink, 0.16);
  const softer = alpha(ink, 0.09);
  const point = palette.point;

  /* 상단 네비게이션 — 모든 레이아웃 공통 */
  const topBar = (
    <div
      className="flex items-center justify-between"
      style={{ padding: isMobile ? '5px 6px' : '7px 10px', backgroundColor: alpha('#ffffff', 0.72) }}
    >
      <Bar w={isMobile ? '22px' : '34px'} h={isMobile ? 4 : 6} color={palette.main} />
      {isMobile ? (
        <span className="flex flex-col gap-[2px]">
          <Bar w="9px" h={1.5} color={soft} />
          <Bar w="9px" h={1.5} color={soft} />
          <Bar w="9px" h={1.5} color={soft} />
        </span>
      ) : (
        <span className="flex items-center gap-[6px]">
          <Bar w="14px" h={3} color={soft} />
          <Bar w="14px" h={3} color={soft} />
          <Bar w="14px" h={3} color={soft} />
          <Bar w="14px" h={3} color={soft} />
          <Bar w="24px" h={9} color={point} round={99} />
        </span>
      )}
    </div>
  );

  const gap = isMobile ? 'gap-[4px]' : 'gap-[6px]';
  const pad = isMobile ? 'p-[6px]' : 'p-[10px]';

  let body: React.ReactNode = null;

  if (layout === 'corporate') {
    body = (
      <div className="flex flex-1 flex-col">
        {/* 히어로 밴드 — 사진 자리를 색면으로 대신합니다 */}
        <div
          className={cx('flex flex-[1.5]', pad, isMobile ? 'flex-col gap-[5px]' : 'gap-[9px]')}
          style={{
            background: `linear-gradient(120deg, ${alpha(palette.main, 0.1)} 0%, ${alpha(point, 0.13)} 100%)`,
          }}
        >
          <div className={cx('flex flex-col justify-center', gap, isMobile ? '' : 'flex-1')}>
            <Bar w={isMobile ? '82%' : '88%'} h={isMobile ? 6 : 10} color={palette.main} />
            <Bar w={isMobile ? '60%' : '64%'} h={isMobile ? 6 : 10} color={point} />
            <span className="mt-[3px] flex flex-col gap-[3px]">
              <Bar w="92%" h={2.5} color={soft} />
              <Bar w="74%" h={2.5} color={soft} />
            </span>
            <Bar
              w={isMobile ? '46px' : '56px'}
              h={isMobile ? 10 : 14}
              color={palette.main}
              round={99}
            />
          </div>
          <div
            className={cx('overflow-hidden rounded-[4px]', isMobile ? 'h-[40%]' : 'flex-[1.2]')}
            style={{
              background: `linear-gradient(150deg, ${alpha(palette.main, 0.34)} 0%, ${alpha(palette.main, 0.16)} 55%, ${alpha(point, 0.3)} 100%)`,
            }}
          />
        </div>
        {/* 카드 3 */}
        <div className={cx('flex flex-1', gap, pad)}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="flex flex-1 flex-col justify-center gap-[3px] rounded-[3px] px-[4px]"
              style={{ backgroundColor: softer }}
            >
              <span
                className="block rounded-full"
                style={{ width: 7, height: 7, backgroundColor: alpha(point, 0.85) }}
              />
              <Bar w="72%" h={2.5} color={alpha(ink, 0.4)} />
              <Bar w="52%" h={2} color={soft} />
            </div>
          ))}
        </div>
      </div>
    );
  } else if (layout === 'store') {
    body = (
      <div className="flex flex-1 flex-col">
        <div
          className={cx('flex flex-col justify-end', pad, gap)}
          style={{ flex: 1.4, backgroundColor: alpha(palette.main, 0.82) }}
        >
          <Bar w="58%" h={isMobile ? 6 : 9} color={alpha('#ffffff', 0.92)} />
          <Bar w="40%" h={isMobile ? 6 : 9} color={point} />
          <Bar w={isMobile ? '40px' : '48px'} h={isMobile ? 9 : 12} color={alpha('#ffffff', 0.9)} round={99} />
        </div>
        <div className={cx('grid flex-1 grid-cols-2', gap, pad)}>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="rounded-[3px]" style={{ backgroundColor: softer }} />
          ))}
        </div>
      </div>
    );
  } else if (layout === 'gallery') {
    body = (
      <div className={cx('flex flex-1 flex-col', gap, pad)}>
        <Bar w="52%" h={isMobile ? 6 : 8} color={palette.main} />
        <div className={cx('grid flex-1', gap, isMobile ? 'grid-cols-2' : 'grid-cols-3')}>
          {[0.3, 0.15, 0.22, 0.18, 0.32, 0.13].slice(0, isMobile ? 4 : 6).map((tone, i) => (
            <div
              key={i}
              className="rounded-[3px]"
              style={{
                background: `linear-gradient(${140 + i * 25}deg, ${alpha(palette.main, tone)} 0%, ${alpha(point, tone * 0.8)} 100%)`,
              }}
            />
          ))}
        </div>
      </div>
    );
  } else if (layout === 'landing') {
    body = (
      <div className={cx('flex flex-1 flex-col items-center justify-center text-center', gap, pad)}>
        <Bar w="70%" h={isMobile ? 7 : 10} color={palette.main} />
        <Bar w="46%" h={isMobile ? 7 : 10} color={point} />
        <span className="mt-[2px] flex w-full flex-col items-center gap-[3px]">
          <Bar w="80%" h={2.5} color={soft} />
          <Bar w="64%" h={2.5} color={soft} />
        </span>
        <div
          className="mt-[3px] w-[72%] rounded-[3px]"
          style={{ height: isMobile ? 22 : 30, backgroundColor: alpha(palette.main, 0.1) }}
        />
        <Bar w={isMobile ? '54px' : '64px'} h={isMobile ? 10 : 13} color={point} round={99} />
      </div>
    );
  } else if (layout === 'commerce') {
    body = (
      <div className={cx('flex flex-1 flex-col', gap, pad)}>
        <div
          className="rounded-[3px]"
          style={{ height: isMobile ? 26 : 34, backgroundColor: alpha(palette.main, 0.16) }}
        />
        <div className={cx('grid flex-1', gap, isMobile ? 'grid-cols-2' : 'grid-cols-4')}>
          {[0, 1, 2, 3, 4, 5, 6, 7].slice(0, isMobile ? 4 : 8).map((i) => (
            <div key={i} className="flex flex-col gap-[2px]">
              <div
                className="flex-1 rounded-[3px]"
                style={{
                  background: `linear-gradient(160deg, ${alpha(palette.main, 0.2)} 0%, ${alpha(point, 0.24)} 100%)`,
                }}
              />
              <Bar w="70%" h={2} color={soft} />
              <Bar w="40%" h={2} color={point} />
            </div>
          ))}
        </div>
      </div>
    );
  } else {
    /* dashboard — 관리자 화면 미리보기 */
    body = (
      <div className="flex flex-1">
        <div
          className={cx('flex flex-col', isMobile ? 'w-[16%] gap-[3px] p-[4px]' : 'w-[18%] gap-[4px] p-[6px]')}
          style={{ backgroundColor: palette.main }}
        >
          {[0, 1, 2, 3, 4].map((i) => (
            <Bar key={i} w="100%" h={isMobile ? 3 : 4} color={alpha('#ffffff', i === 0 ? 0.85 : 0.28)} />
          ))}
        </div>
        <div className={cx('flex flex-1 flex-col', gap, pad)}>
          <div className={cx('flex', gap)}>
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex-1 rounded-[3px]"
                style={{ height: isMobile ? 14 : 20, backgroundColor: softer }}
              />
            ))}
          </div>
          <div className={cx('flex flex-1', gap)}>
            <div
              className="flex flex-[1.4] items-end gap-[3px] rounded-[3px] p-[4px]"
              style={{ backgroundColor: softer }}
            >
              {[0.35, 0.6, 0.45, 0.8, 0.55, 1].map((h, i) => (
                <span
                  key={i}
                  className="flex-1 rounded-[1px]"
                  style={{ height: `${h * 100}%`, backgroundColor: alpha(point, 0.75) }}
                />
              ))}
            </div>
            <div className={cx('flex flex-1 flex-col justify-between rounded-[3px] p-[4px]', gap)}
              style={{ backgroundColor: softer }}
            >
              {[0, 1, 2, 3].map((i) => (
                <Bar key={i} w={i % 2 === 0 ? '86%' : '68%'} h={2.5} color={soft} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      className={cx('flex h-full w-full flex-col overflow-hidden', className)}
      style={{ backgroundColor: palette.sub }}
    >
      {topBar}
      {body}
    </div>
  );
}
