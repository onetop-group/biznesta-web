import { designs } from '@/data/designs';
import { DeviceMockup } from '@/components/ui/DeviceMockup';

/**
 * 전시 공간 — BN_PC_02_BRAND_MESSAGE 의 핵심 비주얼이자
 * BIZNESTA 사이트 전체의 Visual Quality Benchmark 입니다.
 *
 * ▸ 이전 구현의 문제
 *   화면 5개를 absolute 로 띄우고 blur 를 준 것뿐이라
 *   "카드가 흩어져 있다"로 보였고 공간감이 없었습니다.
 *
 * ▸ 이번 구현이 공간을 만드는 방법
 *   1) 실제 원근 — perspective + rotateY/translateZ 로 화면마다
 *      카메라와의 거리가 다릅니다. 2D 회전이 아닙니다.
 *   2) 바닥면 — rotateX 로 눕힌 평면에 그라디언트를 깔아 바닥을 만듭니다.
 *   3) 대기 원근 — 멀수록 blur ↑ · 대비 ↓ · 밝기 ↓.
 *   4) 방향광 — 우상단에서 들어오는 샴페인 골드 빔 + 앰비언트 글로우.
 *   5) 반사 — 각 화면 아래에 눌린 그림자와 옅은 반영.
 *   6) 빈 어둠 — 화면을 꽉 채우지 않고 어두운 여백을 크게 남깁니다.
 *
 * ▸ 톤 제한 (지시서 7항)
 *   Black + Gold 럭셔리 컨설팅이 아니라 Modern Premium Design Studio.
 *   네이비는 깊이를 만들고, 실제로 빛나는 것은 아이보리 톤의 디자인 작품입니다.
 */

/** 카메라와의 거리별 배치 — 값이 겹치지 않게 의도적으로 흩었습니다 */
const PLANES = [
  /* 뒤 — 벽면에 걸린 듯한 작은 화면 */
  { slug: 'landing-001', x: '4%', y: '6%', w: '25%', z: -520, ry: 24, rx: 2, blur: 3.4, dim: 0.34 },
  { slug: 'store-002', x: '74%', y: '2%', w: '24%', z: -560, ry: -26, rx: 2, blur: 3.8, dim: 0.28 },
  /* 중간 */
  { slug: 'portfolio-001', x: '2%', y: '38%', w: '34%', z: -260, ry: 18, rx: 1, blur: 1.3, dim: 0.62 },
  { slug: 'education-001', x: '70%', y: '34%', w: '33%', z: -230, ry: -18, rx: 1, blur: 1.1, dim: 0.66 },
  /* 앞 */
  { slug: 'corporate-001', x: '24%', y: '20%', w: '52%', z: 40, ry: -4, rx: 1, blur: 0, dim: 1 },
] as const;

export function ShowroomStage() {
  const byslug = new Map(designs.map((design) => [design.slug, design]));
  const front = byslug.get('store-001');

  return (
    <div
      aria-hidden="true"
      className="relative h-[420px] w-full select-none sm:h-[500px] lg:h-[560px] xl:h-[620px]"
      style={{ perspective: '1500px', perspectiveOrigin: '52% 42%' }}
    >
      {/* ── 공간 ─────────────────────────────────────────────── */}

      {/* 뒷벽 */}
      <span
        className="absolute inset-x-[-14%] top-[-12%] h-[86%]"
        style={{
          background:
            'radial-gradient(72% 86% at 62% 22%, rgba(52,86,124,0.5) 0%, rgba(13,35,64,0.2) 46%, rgba(5,15,27,0) 78%)',
        }}
      />

      {/* 바닥 — 눕힌 평면 */}
      <span
        className="absolute inset-x-[-25%] bottom-[-30%] h-[62%] origin-bottom"
        style={{
          transform: 'rotateX(72deg)',
          background:
            'linear-gradient(to top, rgba(228,205,169,0.16) 0%, rgba(120,150,180,0.07) 34%, rgba(5,15,27,0) 74%)',
        }}
      />

      {/* 문틈에서 들어오는 방향광 */}
      <span
        className="absolute right-[16%] top-[-24%] h-[150%] w-[13%] opacity-70 blur-[38px]"
        style={{
          transform: 'rotate(9deg)',
          background:
            'linear-gradient(180deg, rgba(240,222,192,0) 0%, rgba(240,222,192,0.62) 38%, rgba(201,167,122,0.18) 78%, rgba(201,167,122,0) 100%)',
        }}
      />

      {/* 앰비언트 글로우 */}
      <span
        className="absolute right-[8%] top-[24%] size-[58%] rounded-full opacity-45 blur-[110px]"
        style={{ background: 'radial-gradient(circle, #C9A77A 0%, rgba(201,167,122,0) 70%)' }}
      />
      <span
        className="absolute left-[6%] bottom-[10%] size-[42%] rounded-full opacity-35 blur-[110px]"
        style={{ background: 'radial-gradient(circle, #2F5E8F 0%, rgba(47,94,143,0) 72%)' }}
      />

      {/* ── 작품들 ───────────────────────────────────────────── */}
      <div className="absolute inset-0" style={{ transformStyle: 'preserve-3d' }}>
        {PLANES.map((plane) => {
          const design = byslug.get(plane.slug);
          if (!design) return null;

          return (
            <div
              key={plane.slug}
              className="absolute"
              style={{
                left: plane.x,
                top: plane.y,
                width: plane.w,
                transform: `translateZ(${plane.z}px) rotateY(${plane.ry}deg) rotateX(${plane.rx}deg)`,
                transformStyle: 'preserve-3d',
                filter: plane.blur ? `blur(${plane.blur}px)` : undefined,
                opacity: plane.dim,
              }}
            >
              <DeviceMockup
                source={{ design }}
                variant="browser"
                chrome={plane.z > -300}
              />
              {/* 바닥에 눌린 그림자 */}
              <span
                className="absolute inset-x-[8%] bottom-[-9%] h-[16%] rounded-[50%] blur-[18px]"
                style={{ background: 'rgba(2,8,16,0.6)' }}
              />
            </div>
          );
        })}

        {/* 가장 앞 — 폰. 공간의 최전면을 잡아줍니다 */}
        {front && (
          <div
            className="absolute bottom-[2%] left-[14%] w-[13%]"
            style={{ transform: 'translateZ(190px) rotateY(-9deg)' }}
          >
            <DeviceMockup source={{ design: front }} variant="phone" />
            <span
              className="absolute inset-x-[-14%] bottom-[-7%] h-[12%] rounded-[50%] blur-[14px]"
              style={{ background: 'rgba(2,8,16,0.66)' }}
            />
          </div>
        )}
      </div>

      {/* 공간 앞쪽의 어둠 — 깊이를 마무리합니다 */}
      <span
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[22%]"
        style={{ background: 'linear-gradient(to top, rgba(5,15,27,0.55), rgba(5,15,27,0))' }}
      />
    </div>
  );
}
