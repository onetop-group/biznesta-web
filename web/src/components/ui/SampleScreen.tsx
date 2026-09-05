import type { ArtMotif, Artwork, DesignSummary, SampleSpec } from '@/types';
import { cx } from '@/lib/utils';

/**
 * BIZNESTA 샘플 디자인 화면.
 *
 * ▸ 이것이 목업 안에 들어가는 "실제 홈페이지"입니다.
 *   이전의 WireframePreview(회색 막대)는 폴백으로 내려갔고,
 *   사용자에게 보이는 주 비주얼은 이 컴포넌트가 그립니다.
 *
 * ▸ 크기 대응 — 컨테이너 쿼리
 *   목업은 히어로에서 700px, 카드에서 240px 로 크기가 크게 달라집니다.
 *   px 로 짜면 작은 카드에서 글자가 뭉개지고 큰 화면에서 빈약해집니다.
 *   그래서 루트 폰트 크기를 1cqw(컨테이너 폭의 1%)로 두고
 *   내부 치수를 전부 em 으로 씁니다. 어느 크기에서도 비율이 같습니다.
 *
 * ▸ 사진을 쓰지 않는 이유
 *   실제 고객 사례가 없고, 만들어 낼 수도 없습니다(지시서 19항).
 *   대신 그라디언트 + 기하 모티프로 "아트워크"를 그립니다.
 *   회색 박스가 아니라 화면의 주인공이 되도록 설계했습니다.
 *
 * ▸ 실제 이미지로 교체
 *   design_images 가 연결되면 DeviceMockup 이 이 컴포넌트 대신
 *   <Image> 를 렌더합니다. 이 파일은 폴백으로 계속 남습니다.
 */

/* ------------------------------------------------------------------ */
/* 아트워크 — 사진 자리를 대신하는 추상 조형                             */
/* ------------------------------------------------------------------ */

function Motif({ motif, ink }: { motif: ArtMotif; ink: string }) {
  const common = {
    fill: 'none',
    stroke: ink,
    vectorEffect: 'non-scaling-stroke' as const,
  };

  if (motif === 'arc') {
    return (
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 size-full">
        <circle cx="72" cy="34" r="26" {...common} strokeWidth="0.6" opacity="0.5" />
        <circle cx="72" cy="34" r="40" {...common} strokeWidth="0.4" opacity="0.3" />
        <path d="M0 78 Q 40 52 100 70" {...common} strokeWidth="0.7" opacity="0.45" />
      </svg>
    );
  }
  if (motif === 'bars') {
    return (
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 size-full">
        {[10, 26, 42, 58, 74, 90].map((x, i) => (
          <rect
            key={x}
            x={x}
            y={100 - (24 + i * 11)}
            width="7"
            height={24 + i * 11}
            fill={ink}
            opacity={0.1 + i * 0.045}
          />
        ))}
      </svg>
    );
  }
  if (motif === 'orb') {
    return (
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 size-full">
        <circle cx="58" cy="46" r="30" fill={ink} opacity="0.16" />
        <circle cx="58" cy="46" r="30" {...common} strokeWidth="0.5" opacity="0.4" />
        <circle cx="26" cy="72" r="13" fill={ink} opacity="0.1" />
      </svg>
    );
  }
  if (motif === 'grid') {
    return (
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 size-full">
        {[20, 40, 60, 80].map((v) => (
          <line key={`h${v}`} x1="0" y1={v} x2="100" y2={v} {...common} strokeWidth="0.35" opacity="0.3" />
        ))}
        {[20, 40, 60, 80].map((v) => (
          <line key={`v${v}`} x1={v} y1="0" x2={v} y2="100" {...common} strokeWidth="0.35" opacity="0.3" />
        ))}
        <rect x="40" y="20" width="40" height="40" fill={ink} opacity="0.14" />
      </svg>
    );
  }
  if (motif === 'wave') {
    return (
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 size-full">
        {[0, 1, 2, 3, 4].map((i) => (
          <path
            key={i}
            d={`M0 ${44 + i * 12} Q 25 ${28 + i * 12} 50 ${44 + i * 12} T 100 ${44 + i * 12}`}
            {...common}
            strokeWidth="0.5"
            opacity={0.42 - i * 0.06}
          />
        ))}
      </svg>
    );
  }
  if (motif === 'diagonal') {
    return (
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 size-full">
        <path d="M-10 100 L 60 0 L 82 0 L 12 100 Z" fill={ink} opacity="0.13" />
        <path d="M34 100 L 104 0 L 116 0 L 46 100 Z" fill={ink} opacity="0.08" />
        <line x1="0" y1="72" x2="100" y2="72" {...common} strokeWidth="0.4" opacity="0.35" />
      </svg>
    );
  }
  if (motif === 'tower') {
    return (
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 size-full">
        <rect x="18" y="30" width="20" height="70" fill={ink} opacity="0.17" />
        <rect x="43" y="14" width="24" height="86" fill={ink} opacity="0.24" />
        <rect x="72" y="42" width="18" height="58" fill={ink} opacity="0.13" />
        {[24, 36, 48, 60, 72, 84].map((y) => (
          <line key={y} x1="43" y1={y} x2="67" y2={y} {...common} strokeWidth="0.3" opacity="0.35" />
        ))}
      </svg>
    );
  }
  /* bloom */
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 size-full">
      {[0, 45, 90, 135].map((deg) => (
        <ellipse
          key={deg}
          cx="56"
          cy="50"
          rx="34"
          ry="12"
          {...common}
          strokeWidth="0.45"
          opacity="0.35"
          transform={`rotate(${deg} 56 50)`}
        />
      ))}
      <circle cx="56" cy="50" r="7" fill={ink} opacity="0.25" />
    </svg>
  );
}

function Art({ art, className, radius }: { art: Artwork; className?: string; radius?: string }) {
  return (
    <div
      className={cx('relative overflow-hidden', className)}
      style={{
        borderRadius: radius,
        background: `linear-gradient(148deg, ${art.from} 0%, ${art.via} 52%, ${art.to} 100%)`,
      }}
    >
      <Motif motif={art.motif} ink={art.ink} />
      {/* 빛 — 아트워크를 사진처럼 보이게 하는 핵심 */}
      <span
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 90% at 78% 8%, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 55%)',
        }}
      />
      <span
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.16), transparent 46%)' }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 화면 조각                                                            */
/* ------------------------------------------------------------------ */

const TYPE_FAMILY: Record<SampleSpec['type'], string> = {
  serif: 'var(--font-display)',
  sans: 'var(--font-sans)',
  condensed: 'var(--font-sans)',
};

function Nav({ spec, ink, accent }: { spec: SampleSpec; ink: string; accent: string }) {
  return (
    <div className="flex shrink-0 items-center justify-between px-[4em] py-[2.4em]">
      <span
        style={{
          fontFamily: TYPE_FAMILY[spec.type],
          fontSize: '2.5em',
          fontWeight: 700,
          letterSpacing: spec.type === 'condensed' ? '0.16em' : '0.04em',
          color: ink,
        }}
      >
        {spec.copy.mark}
      </span>
      <span className="flex items-center gap-[2.2em]">
        {spec.copy.nav.map((item) => (
          <span
            key={item}
            style={{ fontSize: '1.35em', letterSpacing: '0.06em', color: ink, opacity: 0.6 }}
          >
            {item}
          </span>
        ))}
        <span
          style={{
            fontSize: '1.3em',
            padding: '0.85em 2em',
            borderRadius: '99em',
            background: accent,
            color: spec.dark ? '#101820' : '#ffffff',
            fontWeight: 600,
          }}
        >
          {spec.copy.cta}
        </span>
      </span>
    </div>
  );
}

function Eyebrow({ text, color }: { text: string; color: string }) {
  return (
    <span
      style={{
        fontSize: '1.25em',
        letterSpacing: '0.32em',
        textTransform: 'uppercase',
        color,
        fontWeight: 600,
      }}
    >
      {text}
    </span>
  );
}

function Title({ spec, ink, accent }: { spec: SampleSpec; ink: string; accent: string }) {
  return (
    <h1
      style={{
        fontFamily: TYPE_FAMILY[spec.type],
        fontSize: spec.type === 'serif' ? '5.4em' : '4.9em',
        fontWeight: spec.type === 'serif' ? 600 : 700,
        lineHeight: 1.2,
        letterSpacing: spec.type === 'condensed' ? '-0.045em' : '-0.025em',
        color: ink,
        margin: 0,
      }}
    >
      {spec.copy.title.map((line, index) => (
        <span key={line} className="block" style={index === 1 ? { color: accent } : undefined}>
          {line}
        </span>
      ))}
    </h1>
  );
}

function Sub({ text, ink }: { text: string; ink: string }) {
  return (
    <p style={{ fontSize: '1.6em', lineHeight: 1.75, color: ink, opacity: 0.62, margin: 0 }}>
      {text}
    </p>
  );
}

function CtaPill({ label, bg, fg }: { label: string; bg: string; fg: string }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.8em',
        fontSize: '1.5em',
        fontWeight: 600,
        padding: '1.1em 2.6em',
        borderRadius: '99em',
        background: bg,
        color: fg,
      }}
    >
      {label} <span style={{ opacity: 0.75 }}>→</span>
    </span>
  );
}

function SectionRow({
  items,
  ink,
  accent,
  art,
}: {
  items: string[];
  ink: string;
  accent: string;
  art: Artwork;
}) {
  return (
    <div className="flex gap-[1.6em] px-[4em] pb-[3.4em]">
      {items.map((item, index) => (
        <div key={item} className="flex-1">
          <Art art={art} className="h-[7em] w-full" radius="0.7em" />
          <p
            style={{
              fontSize: '1.3em',
              marginTop: '1em',
              color: ink,
              opacity: 0.82,
              fontWeight: 600,
            }}
          >
            {item}
          </p>
          <span
            style={{
              display: 'block',
              width: '2.4em',
              height: '0.25em',
              marginTop: '0.7em',
              background: accent,
              opacity: index === 0 ? 1 : 0.35,
            }}
          />
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 본체                                                                 */
/* ------------------------------------------------------------------ */

export function SampleScreen({
  design,
  device = 'pc',
}: {
  design: Pick<DesignSummary, 'sample' | 'palette'>;
  device?: 'pc' | 'mobile';
}) {
  const spec = design.sample;
  const ink = spec.dark ? '#F4F1EA' : design.palette.text;
  const accent = design.palette.point;
  const heading = spec.dark ? '#FFFFFF' : design.palette.main;

  /* ── 모바일 화면 ─────────────────────────────────────────── */
  if (device === 'mobile') {
    return (
      <div
        className="flex size-full flex-col overflow-hidden"
        style={{ containerType: 'inline-size', background: spec.canvas }}
      >
        <div className="flex size-full flex-col" style={{ fontSize: '1cqw' }}>
          <div className="flex shrink-0 items-center justify-between px-[6em] py-[5em]">
            <span
              style={{
                fontFamily: TYPE_FAMILY[spec.type],
                fontSize: '5.4em',
                fontWeight: 700,
                letterSpacing: '0.06em',
                color: heading,
              }}
            >
              {spec.copy.mark}
            </span>
            <span className="flex flex-col gap-[1.1em]">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  style={{ width: '5em', height: '0.5em', background: heading, opacity: 0.65 }}
                />
              ))}
            </span>
          </div>

          <div className="flex flex-col gap-[3.4em] px-[6em] pb-[5em]">
            <Eyebrow text={spec.copy.eyebrow} color={accent} />
            <h2
              style={{
                fontFamily: TYPE_FAMILY[spec.type],
                fontSize: '9.6em',
                fontWeight: spec.type === 'serif' ? 600 : 700,
                lineHeight: 1.22,
                letterSpacing: '-0.03em',
                color: heading,
                margin: 0,
              }}
            >
              {spec.copy.title.map((line, index) => (
                <span key={line} className="block" style={index === 1 ? { color: accent } : undefined}>
                  {line}
                </span>
              ))}
            </h2>
            <p style={{ fontSize: '3.4em', lineHeight: 1.7, color: ink, opacity: 0.6, margin: 0 }}>
              {spec.copy.sub}
            </p>
            <span
              style={{
                alignSelf: 'flex-start',
                fontSize: '3.2em',
                fontWeight: 600,
                padding: '1em 2.4em',
                borderRadius: '99em',
                background: accent,
                color: spec.dark ? '#101820' : '#ffffff',
              }}
            >
              {spec.copy.cta} →
            </span>
          </div>

          <Art art={spec.art} className="mx-[6em] h-[38em] shrink-0" radius="2.4em" />

          <div className="mt-[5em] flex gap-[2.4em] px-[6em]">
            {spec.copy.sections.slice(0, 2).map((item) => (
              <div key={item} className="flex-1">
                <Art art={spec.art} className="h-[16em] w-full" radius="1.6em" />
                <p style={{ fontSize: '2.8em', marginTop: '1.4em', color: ink, opacity: 0.8 }}>
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ── PC 화면 ─────────────────────────────────────────────── */
  const body = () => {
    switch (spec.hero) {
      /* 좌 카피 / 우 아트워크 */
      case 'split':
        return (
          <>
            <div className="flex flex-1 items-center gap-[4em] px-[4em] pb-[3em]">
              <div className="flex flex-[0.92] flex-col gap-[1.9em]">
                <Eyebrow text={spec.copy.eyebrow} color={accent} />
                <Title spec={spec} ink={heading} accent={accent} />
                <Sub text={spec.copy.sub} ink={ink} />
                <span className="mt-[0.6em]">
                  <CtaPill label={spec.copy.cta} bg={design.palette.main} fg="#ffffff" />
                </span>
              </div>
              <Art art={spec.art} className="h-full flex-[1.08]" radius="1em" />
            </div>
            <SectionRow items={spec.copy.sections} ink={ink} accent={accent} art={spec.art} />
          </>
        );

      /* 아트워크가 화면 전체를 덮고 카피가 위에 */
      case 'fullbleed':
        return (
          <div className="relative flex-1">
            <Art art={spec.art} className="absolute inset-0 size-full" />
            <span
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(100deg, rgba(6,14,24,0.74) 0%, rgba(6,14,24,0.34) 46%, rgba(6,14,24,0) 74%)',
              }}
            />
            <div className="relative flex h-full flex-col justify-center gap-[1.9em] px-[5em]">
              <Eyebrow text={spec.copy.eyebrow} color={accent} />
              <div style={{ maxWidth: '58%' }}>
                <Title spec={spec} ink="#FFFFFF" accent={accent} />
              </div>
              <div style={{ maxWidth: '46%' }}>
                <Sub text={spec.copy.sub} ink="#FFFFFF" />
              </div>
              <span className="mt-[0.6em]">
                <CtaPill label={spec.copy.cta} bg={accent} fg="#12202E" />
              </span>
            </div>
            <div className="absolute inset-x-[5em] bottom-[2.6em] flex gap-[3.4em]">
              {spec.copy.sections.map((item) => (
                <span
                  key={item}
                  style={{ fontSize: '1.3em', letterSpacing: '0.16em', color: '#fff', opacity: 0.6 }}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        );

      /* 중앙 정렬 — 여백이 주인공 */
      case 'centered':
        return (
          <>
            <div className="flex flex-[1.1] flex-col items-center justify-center gap-[1.7em] px-[9em] text-center">
              <Eyebrow text={spec.copy.eyebrow} color={accent} />
              <Title spec={spec} ink={heading} accent={accent} />
              <Sub text={spec.copy.sub} ink={ink} />
              <span className="mt-[0.5em]">
                <CtaPill label={spec.copy.cta} bg={design.palette.main} fg="#ffffff" />
              </span>
            </div>
            <div className="flex flex-1 gap-[1.4em] px-[4em] pb-[3.4em]">
              <Art art={spec.art} className="flex-[1.4]" radius="0.8em" />
              <Art art={spec.art} className="flex-1" radius="0.8em" />
              <Art art={spec.art} className="flex-[0.7]" radius="0.8em" />
            </div>
          </>
        );

      /* 아트워크가 우측으로 넘치는 비대칭 */
      case 'asymmetric':
        return (
          <div className="relative flex-1 overflow-hidden">
            <Art
              art={spec.art}
              className="absolute right-[-6%] top-[6%] h-[86%] w-[54%]"
              radius="1.4em 0 0 1.4em"
            />
            <div className="relative flex h-full flex-col justify-center gap-[1.8em] px-[5em]" style={{ maxWidth: '52%' }}>
              <Eyebrow text={spec.copy.eyebrow} color={accent} />
              <Title spec={spec} ink={heading} accent={accent} />
              <Sub text={spec.copy.sub} ink={ink} />
              <span className="mt-[0.4em]">
                <CtaPill label={spec.copy.cta} bg={design.palette.main} fg="#ffffff" />
              </span>
              <span
                className="mt-[1em] flex gap-[2.4em]"
                style={{ fontSize: '1.25em', letterSpacing: '0.14em', color: ink, opacity: 0.45 }}
              >
                {spec.copy.sections.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </span>
            </div>
          </div>
        );

      /* 잡지형 — 큰 타이포 + 좁은 이미지 컬럼 */
      case 'editorial':
        return (
          <>
            <div className="flex flex-1 gap-[3em] px-[4em]">
              <div className="flex flex-[1.25] flex-col justify-center gap-[1.6em]">
                <Eyebrow text={spec.copy.eyebrow} color={accent} />
                <h1
                  style={{
                    fontFamily: TYPE_FAMILY[spec.type],
                    fontSize: '6.6em',
                    fontWeight: 600,
                    lineHeight: 1.08,
                    letterSpacing: '-0.03em',
                    color: heading,
                    margin: 0,
                  }}
                >
                  {spec.copy.title.map((line, index) => (
                    <span key={line} className="block" style={index === 1 ? { color: accent } : undefined}>
                      {line}
                    </span>
                  ))}
                </h1>
                <span style={{ width: '5em', height: '0.18em', background: accent }} />
                <Sub text={spec.copy.sub} ink={ink} />
              </div>
              <div className="flex flex-1 flex-col gap-[1.2em] py-[1.6em]">
                <Art art={spec.art} className="flex-[1.5]" radius="0.7em" />
                <Art art={spec.art} className="flex-1" radius="0.7em" />
              </div>
            </div>
            <div className="flex items-center justify-between px-[4em] pb-[3em] pt-[2.4em]">
              <span className="flex gap-[3em]">
                {spec.copy.sections.map((item) => (
                  <span key={item} style={{ fontSize: '1.35em', color: ink, opacity: 0.55 }}>
                    {item}
                  </span>
                ))}
              </span>
              <CtaPill label={spec.copy.cta} bg={design.palette.main} fg="#ffffff" />
            </div>
          </>
        );

      /* 갤러리형 — 작품 타일이 주인공 */
      case 'masonry':
        return (
          <>
            <div className="flex items-end justify-between px-[4em] pb-[2.4em]">
              <div className="flex flex-col gap-[1.2em]">
                <Eyebrow text={spec.copy.eyebrow} color={accent} />
                <h1
                  style={{
                    fontFamily: TYPE_FAMILY[spec.type],
                    fontSize: '4.6em',
                    fontWeight: 600,
                    lineHeight: 1.15,
                    letterSpacing: '-0.02em',
                    color: heading,
                    margin: 0,
                  }}
                >
                  {spec.copy.title.join(' ')}
                </h1>
              </div>
              <span style={{ fontSize: '1.35em', color: ink, opacity: 0.5 }}>{spec.copy.sub}</span>
            </div>
            <div className="grid flex-1 grid-cols-4 gap-[1.1em] px-[4em] pb-[3.4em]">
              <Art art={spec.art} className="col-span-2 row-span-2" radius="0.6em" />
              <Art art={spec.art} className="" radius="0.6em" />
              <Art art={spec.art} className="row-span-2" radius="0.6em" />
              <Art art={spec.art} className="" radius="0.6em" />
            </div>
          </>
        );

      /* 어두운 화면 위 중앙 오버레이 */
      case 'overlay':
        return (
          <div className="relative flex-1">
            <Art art={spec.art} className="absolute inset-0 size-full" />
            <span
              className="absolute inset-0"
              style={{ background: 'linear-gradient(180deg, rgba(8,12,18,0.36), rgba(8,12,18,0.72))' }}
            />
            <div className="relative flex h-full flex-col items-center justify-center gap-[1.7em] px-[8em] text-center">
              <Eyebrow text={spec.copy.eyebrow} color={accent} />
              <Title spec={spec} ink="#FFFFFF" accent={accent} />
              <div style={{ maxWidth: '62%' }}>
                <Sub text={spec.copy.sub} ink="#FFFFFF" />
              </div>
              <span className="mt-[0.5em]">
                <CtaPill label={spec.copy.cta} bg={accent} fg="#14202C" />
              </span>
            </div>
          </div>
        );

      /* 관리자 · 웹앱 화면 */
      default:
        return (
          <div className="flex flex-1">
            <div
              className="flex w-[19%] shrink-0 flex-col gap-[1.5em] px-[2em] py-[2.4em]"
              style={{ background: design.palette.main }}
            >
              <span
                style={{
                  fontSize: '1.7em',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  color: '#fff',
                  marginBottom: '0.8em',
                }}
              >
                {spec.copy.mark}
              </span>
              {spec.copy.nav.map((item, index) => (
                <span
                  key={item}
                  style={{
                    fontSize: '1.3em',
                    color: '#fff',
                    opacity: index === 0 ? 1 : 0.45,
                    padding: '0.6em 0.8em',
                    borderRadius: '0.5em',
                    background: index === 0 ? 'rgba(255,255,255,0.14)' : 'transparent',
                  }}
                >
                  {item}
                </span>
              ))}
            </div>

            <div className="flex flex-1 flex-col gap-[1.6em] p-[2.6em]">
              <div className="flex items-baseline justify-between">
                <span style={{ fontSize: '2.1em', fontWeight: 700, color: heading }}>
                  {spec.copy.title[0]}
                </span>
                <span style={{ fontSize: '1.3em', color: ink, opacity: 0.5 }}>{spec.copy.sub}</span>
              </div>

              <div className="flex gap-[1.2em]">
                {spec.copy.sections.map((item, index) => (
                  <div
                    key={item}
                    className="flex flex-1 flex-col gap-[0.5em] rounded-[0.6em] p-[1.4em]"
                    style={{ background: index === 0 ? accent : 'rgba(0,0,0,0.045)' }}
                  >
                    <span
                      style={{
                        fontSize: '1.2em',
                        color: index === 0 ? '#fff' : ink,
                        opacity: index === 0 ? 0.85 : 0.55,
                      }}
                    >
                      {item}
                    </span>
                    <span
                      style={{
                        fontSize: '2.6em',
                        fontWeight: 700,
                        color: index === 0 ? '#fff' : heading,
                      }}
                    >
                      {[24, 8, 6, 32][index] ?? 12}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex flex-1 gap-[1.2em]">
                <div
                  className="flex flex-[1.5] items-end gap-[0.8em] rounded-[0.6em] p-[1.4em]"
                  style={{ background: 'rgba(0,0,0,0.04)' }}
                >
                  {[0.32, 0.55, 0.4, 0.78, 0.52, 0.92, 0.66].map((h, i) => (
                    <span
                      key={i}
                      className="flex-1 rounded-[0.2em]"
                      style={{ height: `${h * 100}%`, background: accent, opacity: 0.35 + h * 0.6 }}
                    />
                  ))}
                </div>
                <div
                  className="flex flex-1 flex-col justify-between rounded-[0.6em] p-[1.4em]"
                  style={{ background: 'rgba(0,0,0,0.04)' }}
                >
                  {[0, 1, 2, 3].map((i) => (
                    <span key={i} className="flex items-center gap-[0.8em]">
                      <span
                        className="rounded-full"
                        style={{ width: '1.4em', height: '1.4em', background: accent, opacity: 0.5 }}
                      />
                      <span
                        style={{
                          height: '0.5em',
                          flex: 1,
                          background: ink,
                          opacity: 0.16,
                          borderRadius: '99em',
                        }}
                      />
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div
      className="size-full overflow-hidden"
      style={{ containerType: 'inline-size', background: spec.canvas }}
    >
      <div className="flex size-full flex-col" style={{ fontSize: '1cqw' }}>
        {spec.hero !== 'console' && <Nav spec={spec} ink={heading} accent={accent} />}
        {body()}
      </div>
    </div>
  );
}
