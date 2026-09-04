import type { Metadata } from 'next';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { BandCta } from '@/components/blocks/BandCta';
import { CheckList } from '@/components/design/DesignFacts';
import { DeviceMockup } from '@/components/ui/DeviceMockup';
import { Icon } from '@/components/ui/Icon';
import { ScriptAccent } from '@/components/ui/ScriptAccent';
import { WireframePreview } from '@/components/ui/WireframePreview';
import { designs } from '@/data/designs';
import { signatureIntro, signatureReasons, signatureSteps } from '@/data/signature';

/**
 * BN_PC_08_SIGNATURE
 *
 * ⚠️ 지시서 18항의 디자인 등급 SIGNATURE 와 이름만 같고 다른 개념입니다.
 *    등급은 designs.level, 이 페이지는 "왜 비즈네스타인가"를 보여줍니다.
 *    (승인된 M-10 · 명칭 분리)
 */
export const metadata: Metadata = {
  title: '비즈네스타 시그니처',
  description:
    '전략부터 디자인, 시스템 구축, 운영 지원까지. 비즈네스타가 홈페이지를 만드는 방식과 차별점을 소개합니다.',
};

export default function SignaturePage() {
  const heroDesign = designs.find((design) => design.level === 'SIGNATURE') ?? designs[0];

  return (
    <>
      {/* ══ 다크 히어로 ═══════════════════════════════════════════ */}
      <section
        aria-label="비즈네스타 시그니처 소개"
        className="on-navy relative overflow-hidden text-white"
        style={{
          backgroundImage:
            'radial-gradient(75% 75% at 78% 34%, rgba(201,167,122,0.26) 0%, rgba(27,58,92,0.36) 32%, #0D2340 64%, #050F1B 100%)',
        }}
      >
        {/* 벽면을 타고 내려오는 빛 */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-[8%] top-[-25%] h-[150%] w-[22%] rotate-3 opacity-30 blur-[70px]"
          style={{
            background:
              'linear-gradient(180deg, rgba(228,205,169,0.55) 0%, rgba(228,205,169,0.1) 60%, transparent 100%)',
          }}
        />

        <Container>
          <div className="relative grid gap-12 py-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.02fr)] lg:items-center lg:gap-14 lg:py-18">
            <div className="max-w-[560px]">
              <p className="u-eyebrow text-[11px] font-semibold text-gold lg:text-[13px]">
                Our Signature
              </p>

              <h1 className="mt-6 text-[32px] font-bold leading-[1.26] tracking-[-0.03em] sm:text-[40px] lg:mt-7 lg:text-[50px]">
                <span className="block">BIZNESTA의 시그니처,</span>
                <span className="block text-gold">결과로 증명합니다.</span>
              </h1>

              <p className="mt-6 text-[15px] leading-[1.85] text-white/70 lg:mt-7 lg:text-[16px]">
                전략부터 디자인, 시스템 구축, 운영 지원까지
                <br />
                모든 과정을 하나의 기준으로 완성합니다.
              </p>

              <ul className="mt-10 grid gap-x-6 gap-y-7 sm:grid-cols-2 lg:mt-12 lg:grid-cols-4 lg:gap-x-0">
                {signatureIntro.map((item, index) => (
                  <li
                    key={item.title}
                    className={
                      index > 0 ? 'lg:border-l lg:border-navy-line lg:pl-5' : 'lg:pr-5'
                    }
                  >
                    <Icon name={item.icon} size={26} className="text-gold" />
                    <p className="mt-3.5 text-[13px] font-bold text-white">{item.title}</p>
                    <p className="mt-1.5 text-[12px] leading-[1.65] text-white/55">
                      {item.body.map((line) => (
                        <span key={line} className="block">
                          {line}
                        </span>
                      ))}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative">
              <ScriptAccent
                lines={['More Than a Website.', "It's Your Growth Partner."]}
                size="sm"
                className="mb-5 lg:mb-6"
              />
              <DeviceMockup
                source={{ palette: heroDesign.palette, layout: heroDesign.previewLayout }}
                variant="duo"
                className="w-full"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* ══ 5단계 제작 방식 ═══════════════════════════════════════ */}
      <Section tone="ivory" padding="lg" ariaLabel="비즈네스타의 제작 방식">
        <div className="text-center">
          <p className="u-eyebrow text-[11px] font-semibold text-gold-deep lg:text-[13px]">
            BIZNESTA Signature
          </p>
          <h2 className="mt-5 text-[26px] font-bold leading-[1.3] tracking-[-0.03em] text-navy sm:text-[32px] lg:text-[38px]">
            생각의 차이가 결과의 차이를 만듭니다.
          </h2>
          <span
            aria-hidden="true"
            className="mx-auto mt-7 block h-px w-24 bg-line-gold lg:mt-9"
          />
        </div>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3 xl:grid-cols-6">
          {signatureSteps.map((step) => (
            <li
              key={step.no}
              className="group flex flex-col overflow-hidden rounded-card border border-line bg-paper shadow-[var(--shadow-card)] transition-all duration-400 hover:-translate-y-1.5 hover:border-line-gold hover:shadow-[var(--shadow-card-hover)]"
            >
              <div className="shrink-0 px-5 pb-5 pt-6">
                <p className="font-display text-[26px] font-bold leading-none text-gold-deep">
                  {step.no}
                </p>
                <h3 className="mt-4 text-[16px] font-bold text-navy">{step.title}</h3>
                <p className="mt-2.5 text-[13px] leading-[1.7] text-ink-2">
                  {step.body.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </p>
              </div>
              {/*
                각 단계의 결과물을 구조로 암시합니다 (사진 대신).
                남는 세로 공간을 이 영역이 채워 카드 높이가 서로 달라도 빈 공간이 생기지 않습니다.
              */}
              <div
                className="min-h-[110px] flex-1 overflow-hidden border-t border-line"
                style={{ backgroundColor: '#F6F2EB' }}
              >
                <WireframePreview
                  palette={{ main: '#0D2340', point: '#C9A77A', sub: '#FBF8F3', text: '#333333' }}
                  layout={
                    (['corporate', 'gallery', 'dashboard', 'landing', 'commerce'] as const)[
                      Number(step.no) - 1
                    ]
                  }
                />
              </div>
            </li>
          ))}

          {/* 6번째 자리 — 왜 비즈네스타인가 */}
          <li className="on-navy flex flex-col justify-center rounded-card bg-navy px-6 py-7 text-white shadow-[var(--shadow-card)] sm:col-span-2 lg:col-span-3 xl:col-span-1">
            <span aria-hidden="true" className="text-[16px] text-gold">
              ♛
            </span>
            <h3 className="mt-3 text-[16px] font-bold">BIZNESTA가 특별한 이유</h3>
            <div className="mt-5">
              <CheckList items={signatureReasons} tone="dark" />
            </div>
            <p className="mt-6 text-[13px] font-semibold leading-[1.6] text-gold">
              “당신의 성장을 디자인합니다.”
            </p>
          </li>
        </ul>
      </Section>

      <BandCta
        quote={['단순한 홈페이지 제작이 아닌,', '비즈니스 성장을 위한 최적의 솔루션.']}
        points={[
          { icon: 'bulb', label: '전략적 기획' },
          { icon: 'pencil', label: '차별화된 디자인' },
          { icon: 'gear', label: '안정적인 기술' },
          { icon: 'chart', label: '지속적인 성장' },
        ]}
        ctaLabel="제작 상담하기"
        ctaHref="/contact"
        tone="navy"
      />
    </>
  );
}
