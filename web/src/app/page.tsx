import { Section } from '@/components/layout/Section';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { IconTile } from '@/components/ui/IconTile';
import { ScriptAccent } from '@/components/ui/ScriptAccent';
import { brandMessage } from '@/data/site';
import type { IconName } from '@/components/ui/Icon';

/**
 * ⚠️ Phase 2 임시 홈.
 *
 * 이 페이지의 목적은 콘텐츠가 아니라 **기반 구조 검증**입니다.
 *   · 헤더 / 푸터 / 밴드 리듬이 실제로 동작하는지
 *   · 디자인 토큰이 PC · 모바일에서 의도대로 보이는지
 *   · 로고가 밝은 배경과 딥네이비 배경 모두에서 정상인지
 *
 * 실제 메인 화면(BN_PC_01 / BN_MO_01 시안)은 Phase 3 에서 구현합니다.
 * 여기에 있는 문구는 지시서 4항의 확정 브랜드 메시지만 사용했으며,
 * 실적 수치 · 후기 · 연락처 등 미확정 정보는 일절 넣지 않았습니다.
 */

const PILLARS: Array<{ icon: IconName; title: string; body: string }> = [
  { icon: 'diamond', title: 'DESIGN', body: '당신의 브랜드를 가장 잘 보여주는 디자인' },
  { icon: 'doc', title: 'CONTENT', body: '고객이 찾아오는 콘텐츠 구조' },
  { icon: 'gear', title: 'SYSTEM', body: '문의 · 예약 · 회원 등 필요한 기능과 관리자 시스템' },
  { icon: 'chart', title: 'GROWTH', body: '지속적인 성장을 위한 온라인 비즈니스 기반' },
];

export default function HomePage() {
  return (
    <>
      {/* ── 히어로 밴드 (밝음) ────────────────────────────── */}
      <Section tone="ivory-soft" padding="lg" ariaLabel="브랜드 소개">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-16">
          <div className="max-w-[680px]">
            <SectionHeader
              as="h1"
              eyebrow="Business Total Solution"
              title={brandMessage.question}
              description={[brandMessage.positioning]}
              accentLastLine
            />

            <div className="mt-9 flex flex-col gap-3 sm:flex-row lg:mt-11">
              <Button href="/design" size="lg" arrow>
                홈페이지 디자인 보기
              </Button>
              <Button href="/contact" variant="outline" size="lg" arrow>
                맞춤 제작 상담
              </Button>
            </div>
          </div>

          <div className="hidden shrink-0 border-l border-line pl-10 lg:block">
            <ScriptAccent lines={['Your Business,', 'A Brighter', 'Tomorrow']} size="lg" />
            <p className="u-eyebrow-tight mt-8 text-[11px] leading-[2.2] text-muted">
              WEBSITE
              <br />
              DESIGN
              <br />
              CONTENT
              <br />
              SYSTEM
              <br />
              GROWTH
            </p>
          </div>
        </div>
      </Section>

      {/* ── 브랜드 메시지 밴드 (네이비) ──────────────────── */}
      <Section tone="navy" padding="lg" ariaLabel="브랜드 메시지">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-end lg:gap-16">
          <SectionHeader
            eyebrow="Brand Message"
            title={brandMessage.main}
            description={[
              '홈페이지는 단순한 웹사이트가 아닙니다.',
              '당신의 비즈니스를 더 크게 성장시키는 온라인 비즈니스 자산입니다.',
            ]}
          />
          <ScriptAccent lines={['More Than', 'a Website']} size="lg" className="lg:text-right" />
        </div>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4 lg:gap-6">
          {PILLARS.map((pillar) => (
            <Card as="li" key={pillar.title}>
              <IconTile name={pillar.icon} />
              <h3 className="u-eyebrow-tight mt-5 text-[14px] font-bold text-gold">
                {pillar.title}
              </h3>
              <p className="mt-2 text-[14px] leading-[1.7] text-white/70">{pillar.body}</p>
            </Card>
          ))}
        </ul>
      </Section>

      {/* ── 관리자 시스템 철학 밴드 (밝음) ───────────────── */}
      <Section tone="ivory" padding="lg" ariaLabel="관리자 시스템 철학">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center lg:gap-20">
          <div>
            <Badge tone="level" className="mb-6">
              ADMIN SYSTEM
            </Badge>
            <SectionHeader
              title={brandMessage.adminPhilosophy}
              description={[
                '홈페이지가 오픈되는 순간은 제작의 끝이 아니라 운영의 시작입니다.',
                '비즈네스타는 고객이 보는 화면과 운영자가 쓰는 화면을 함께 설계합니다.',
              ]}
            />
          </div>

          <Card className="bg-paper">
            <ScriptAccent lines={['Manage,', 'Grow, Succeed']} size="sm" />
            <ul className="mt-6 space-y-3">
              {[
                '운영자가 개발자를 다시 부르지 않아도 되는 구조',
                '사업에 실제로 필요한 관리자 기능만 설계',
                '이미지 · 콘텐츠 · 노출 · 순서를 직접 관리',
              ].map((line) => (
                <li key={line} className="flex items-start gap-3 text-[14px] leading-[1.7]">
                  <span
                    aria-hidden="true"
                    className="mt-1 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-gold-pale text-[11px] font-bold text-gold-deep"
                  >
                    ✓
                  </span>
                  {line}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </Section>

      {/* ── Phase 2 안내 (개발 중에만 표시) ──────────────── */}
      <Section tone="cream" padding="sm" ariaLabel="개발 진행 안내">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[14px] text-ink-2">
            <strong className="font-semibold text-navy">Phase 2 기반 구축 완료.</strong> 실제 메인
            화면(BN_PC_01 / BN_MO_01)은 Phase 3 에서 구현합니다.
          </p>
          <Button href="/styleguide" variant="outline" size="sm" arrow>
            디자인 시스템 확인
          </Button>
        </div>
      </Section>
    </>
  );
}
