import { designs } from '@/data/designs';
import { DeviceMockup } from '@/components/ui/DeviceMockup';

/**
 * 떠 있는 화면 군집 — BN_PC_02_BRAND_MESSAGE 의 핵심 비주얼입니다.
 *
 * 시안의 장면은 "빛이 들어오는 전시 공간에 홈페이지 화면들이 떠 있는" 구도입니다.
 * 사진 합성 없이 그 느낌을 만들기 위해 세 가지를 씁니다.
 *   1) 빛      — 골드 라디얼 글로우 + 세로 광원(문틈에서 들어오는 빛)
 *   2) 깊이    — 카드마다 scale · blur · opacity · z-index 를 다르게 (피사계 심도)
 *   3) 비대칭  — 격자에 맞추지 않고 서로 다른 각도 · 위치로 배치
 *
 * 카드 안의 화면은 실제 designs 데이터에서 가져오므로,
 * 관리자에서 디자인을 등록하면 이 벽면의 내용도 함께 바뀝니다.
 */

/** 배치 규칙 — 격자를 피하고 깊이를 만들기 위한 값들 */
const SLOTS = [
  { top: '4%', left: '26%', width: '34%', rotate: -5, blur: 2.2, opacity: 0.34, z: 10 },
  { top: '2%', left: '68%', width: '30%', rotate: 8, blur: 2.6, opacity: 0.26, z: 5 },
  { top: '20%', left: '0%', width: '40%', rotate: -8, blur: 0.8, opacity: 0.7, z: 20 },
  { top: '26%', left: '48%', width: '52%', rotate: 4, blur: 0, opacity: 1, z: 40 },
  { top: '58%', left: '8%', width: '48%', rotate: -3, blur: 0, opacity: 1, z: 45 },
  { top: '72%', left: '66%', width: '32%', rotate: 9, blur: 1.6, opacity: 0.46, z: 15 },
] as const;

export function FloatingMockupWall() {
  const items = designs.slice(0, SLOTS.length);

  return (
    <div aria-hidden="true" className="relative h-[440px] w-full xl:h-[520px]">
      {/* 문틈에서 들어오는 빛 */}
      <span
        className="absolute left-[42%] top-[-8%] h-[116%] w-[16%] -rotate-6 rounded-full opacity-70 blur-2xl"
        style={{
          background:
            'linear-gradient(180deg, rgba(228,205,169,0) 0%, rgba(228,205,169,0.55) 45%, rgba(201,167,122,0.18) 100%)',
        }}
      />
      {/* 따뜻한 광원 */}
      <span
        className="absolute right-[6%] top-[24%] size-[58%] rounded-full opacity-45 blur-[90px]"
        style={{ background: 'radial-gradient(circle, #C9A77A 0%, rgba(201,167,122,0) 70%)' }}
      />
      {/* 바닥 반사 — 가장자리가 각지지 않도록 타원 + 블러로 처리합니다 */}
      <span
        className="absolute inset-x-[-12%] bottom-[-6%] h-[30%] rounded-[50%] opacity-70 blur-[46px]"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(228,205,169,0.2) 0%, rgba(228,205,169,0) 72%)',
        }}
      />

      {items.map((design, index) => {
        const slot = SLOTS[index];
        return (
          <div
            key={design.id}
            className="absolute"
            style={{
              top: slot.top,
              left: slot.left,
              width: slot.width,
              zIndex: slot.z,
              transform: `rotate(${slot.rotate}deg)`,
              filter: slot.blur ? `blur(${slot.blur}px)` : undefined,
              opacity: slot.opacity,
            }}
          >
            <DeviceMockup
              source={{ palette: design.palette, layout: design.previewLayout }}
              variant="browser"
            />
          </div>
        );
      })}
    </div>
  );
}
