import type { Metadata } from 'next';
import { Section } from '@/components/layout/Section';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { Icon, type IconName } from '@/components/ui/Icon';
import { IconTile } from '@/components/ui/IconTile';
import { Logo } from '@/components/ui/Logo';
import { ScriptAccent } from '@/components/ui/ScriptAccent';
import { site } from '@/data/site';
import { SITE_URL, IS_DOMAIN_CONFIRMED } from '@/lib/seo';

/**
 * 디자인 시스템 확인용 페이지 (Phase 2 산출물).
 * 운영 사이트에는 노출하지 않습니다 — 색인을 차단합니다.
 */
export const metadata: Metadata = {
  title: 'Design System',
  robots: { index: false, follow: false },
};

const COLORS: Array<{ token: string; hex: string; use: string }> = [
  { token: 'navy', hex: '#0D2340', use: 'MAIN · 로고 · 헤더 · 다크 밴드' },
  { token: 'navy-deep', hex: '#081726', use: '푸터 최심부' },
  { token: 'navy-soft', hex: '#1B3A5C', use: '다크 밴드 안의 카드' },
  { token: 'gold', hex: '#C9A77A', use: 'POINT · CTA · 로고 N · 강조' },
  { token: 'gold-deep', hex: '#A8834F', use: 'hover · 아이콘 라인' },
  { token: 'gold-soft', hex: '#E4CDA9', use: '골드 그라디언트 밝은 끝' },
  { token: 'gold-pale', hex: '#F0E2CD', use: '아이콘 타일 배경' },
  { token: 'ivory', hex: '#F6F2EB', use: 'SUB · 기본 섹션 배경' },
  { token: 'ivory-soft', hex: '#FBF8F3', use: '카드 배경' },
  { token: 'cream', hex: '#EFE7DA', use: '강조 블록 · 인용 밴드' },
  { token: 'ink', hex: '#333333', use: 'TEXT · 본문 기본' },
  { token: 'line', hex: '#E8E0D4', use: '구분선' },
];

const ICONS: IconName[] = [
  'monitor',
  'pencil',
  'share',
  'chart',
  'diamond',
  'bulb',
  'users',
  'gear',
  'doc',
  'chat',
  'headset',
  'check',
];

const TONE_SAMPLES: Array<{ tone: string; className: string }> = [
  { tone: 'ivory', className: 'bg-ivory text-ink' },
  { tone: 'ivory-soft', className: 'bg-ivory-soft text-ink' },
  { tone: 'cream', className: 'bg-cream text-ink' },
  { tone: 'paper', className: 'bg-paper text-ink' },
  { tone: 'navy', className: 'bg-navy text-white' },
];

/** 미입력 설정값을 개발 중에 확인하기 위한 표 */
const SETTINGS_ROWS: Array<[string, string]> = [
  ['전화번호', site.contact.phone],
  ['이메일', site.contact.email],
  ['카카오 채널', site.contact.kakao],
  ['상담 가능 시간', site.contact.consultHours],
  ['상호', site.business.companyName],
  ['대표자', site.business.owner],
  ['사업자등록번호', site.business.registrationNo],
  ['주소', site.business.address],
  ['인스타그램', site.social.instagram],
  ['블로그', site.social.blog],
];

function Block({
  title,
  note,
  children,
}: {
  title: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-t border-line pt-8">
      <h2 className="text-[20px] font-bold text-navy lg:text-[24px]">{title}</h2>
      {note && <p className="mt-2 text-[13px] leading-[1.7] text-muted">{note}</p>}
      <div className="mt-6">{children}</div>
    </div>
  );
}

export default function StyleguidePage() {
  return (
    <>
      <Section tone="ivory-soft" padding="md">
        <SectionHeader
          as="h1"
          eyebrow="Phase 2 · Design System"
          title={['BIZNESTA', '디자인 시스템']}
          description={[
            'BN_PC · BN_MO 시안 32장에서 추출한 토큰과 공통 컴포넌트입니다.',
            '색상 · 서체 · 간격 변경은 src/app/globals.css 의 @theme 블록에서만 합니다.',
          ]}
        />
      </Section>

      <Section tone="ivory" padding="md">
        <div className="space-y-14">
          {/* 1. 로고 */}
          <Block
            title="1. 로고"
            note="공식 로고 파일에서 배경만 투명 처리하고 여백을 제거했습니다. 형태 · 비율 · 골드 N 은 원본 그대로입니다."
          >
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="flex flex-col items-center justify-center gap-4 rounded-card border border-line bg-paper py-10">
                <Logo width={200} />
                <span className="text-[12px] text-muted">navy · 화이트 배경</span>
              </div>
              <div className="flex flex-col items-center justify-center gap-4 rounded-card border border-line bg-ivory py-10">
                <Logo width={200} />
                <span className="text-[12px] text-muted">navy · 아이보리 배경</span>
              </div>
              <div className="flex flex-col items-center justify-center gap-4 rounded-card bg-navy py-10">
                <Logo variant="white" width={200} />
                <span className="text-[12px] text-white/60">white · 딥네이비 배경</span>
              </div>
            </div>
            <p className="mt-4 text-[13px] leading-[1.7] text-ink-2">
              향후 SVG 원본을 받으면 <code className="rounded bg-cream px-1.5 py-0.5">Logo.tsx</code>{' '}
              의 <code className="rounded bg-cream px-1.5 py-0.5">LOGO_SOURCES</code> 경로만 바꾸면
              됩니다. 화면 코드는 수정하지 않습니다.
            </p>
          </Block>

          {/* 2. 컬러 */}
          <Block
            title="2. 컬러 토큰"
            note="BN_PC_06_DESIGN_DETAIL 시안이 명시한 팔레트(MAIN #0D2340 / POINT #C9A77A / SUB #F6F2EB / TEXT #333333)를 근거로 확정했습니다."
          >
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {COLORS.map((color) => (
                <div
                  key={color.token}
                  className="flex items-center gap-4 rounded-tile border border-line bg-paper p-3"
                >
                  <span
                    className="size-14 shrink-0 rounded-tile border border-line"
                    style={{ backgroundColor: color.hex }}
                  />
                  <span className="min-w-0">
                    <span className="block font-mono text-[13px] font-semibold text-navy">
                      {color.token}
                    </span>
                    <span className="block font-mono text-[12px] text-muted">{color.hex}</span>
                    <span className="mt-0.5 block text-[12px] leading-tight text-ink-2">
                      {color.use}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </Block>

          {/* 3. 타이포 */}
          <Block
            title="3. 타이포그래피"
            note="한글 Pretendard / 영문 대제목 Playfair Display / 필기체 Parisienne"
          >
            <div className="space-y-6 rounded-card border border-line bg-paper p-6 lg:p-8">
              <div>
                <p className="u-eyebrow mb-3 text-[11px] font-semibold text-gold-deep lg:text-[13px]">
                  SECTION LABEL · 자간 0.28em
                </p>
                <p className="text-[30px] font-bold leading-[1.28] sm:text-[38px] lg:text-[52px]">
                  <span className="block">대제목 첫째 줄은 네이비</span>
                  <span className="block text-gold-deep">둘째 줄은 골드로 강조합니다.</span>
                </p>
              </div>
              <p className="text-[15px] leading-[1.8] text-ink-2 lg:text-base">
                본문 텍스트입니다. 한글이 어절 중간에서 끊기지 않도록 word-break: keep-all 을
                적용했습니다. PC 16px / 모바일 15px, 행간 1.75 를 기본으로 합니다.
              </p>
              <ScriptAccent lines={['Good Business, Better Tomorrow']} />
              <p className="font-display text-[28px] text-navy lg:text-[34px]">
                A More Valuable Tomorrow
              </p>
            </div>
          </Block>

          {/* 4. 버튼 */}
          <Block title="4. 버튼">
            <div className="space-y-5">
              <div className="flex flex-wrap items-center gap-3 rounded-card border border-line bg-paper p-6">
                <Button size="lg" arrow>
                  제작 상담하기
                </Button>
                <Button variant="navy" size="lg" arrow>
                  무료 상담 신청
                </Button>
                <Button variant="outline" size="lg" arrow>
                  디자인 보기
                </Button>
              </div>
              <div className="on-navy flex flex-wrap items-center gap-3 rounded-card bg-navy p-6">
                <Button size="md" arrow>
                  제작 상담하기
                </Button>
                <Button variant="outline" size="md" arrow>
                  자세히 보기
                </Button>
                <span className="text-[12px] text-white/50">
                  딥네이비 밴드 안에서는 outline 이 자동으로 반전됩니다
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
                <Button size="md" disabled>
                  비활성
                </Button>
              </div>
            </div>
          </Block>

          {/* 5. 칩 · 뱃지 */}
          <Block
            title="5. 칩 · 뱃지"
            note="디자인 갤러리 필터(BN_PC_04 / BN_PC_07)와 등급 표시(BN_PC_06)에 사용합니다."
          >
            <div className="flex flex-wrap items-center gap-2 rounded-card border border-line bg-paper p-6">
              <Chip active>전체 보기</Chip>
              <Chip>기업 · 브랜드형</Chip>
              <Chip>소상공인 · 매장형</Chip>
              <Chip>교육형</Chip>
              <span className="mx-3 h-6 w-px bg-line" />
              <Badge tone="new">NEW</Badge>
              <Badge tone="best">BEST</Badge>
              <Badge tone="level">SIGNATURE</Badge>
              <Badge tone="muted">비공개</Badge>
            </div>
          </Block>

          {/* 6. 아이콘 */}
          <Block
            title="6. 아이콘"
            note="stroke 1.5px 인라인 SVG. 외부 아이콘 라이브러리를 쓰지 않습니다 — 시안의 라인 톤을 유지하고 번들을 가볍게 하기 위해서입니다."
          >
            <div className="grid grid-cols-4 gap-3 sm:grid-cols-6 lg:grid-cols-12">
              {ICONS.map((name) => (
                <div
                  key={name}
                  className="flex flex-col items-center gap-2 rounded-tile border border-line bg-paper py-4"
                >
                  <Icon name={name} className="text-gold-deep" />
                  <span className="text-[10px] text-muted">{name}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-4">
              <IconTile name="diamond" size="sm" />
              <IconTile name="monitor" size="md" />
              <IconTile name="chart" size="lg" />
            </div>
          </Block>

          {/* 7. 카드 */}
          <Block title="7. 카드">
            <div className="grid gap-4 sm:grid-cols-3">
              <Card>
                <IconTile name="monitor" />
                <h3 className="mt-5 text-[17px] font-bold text-navy">홈페이지 제작</h3>
                <p className="mt-2 text-[14px] leading-[1.7] text-ink-2">
                  브랜드에 맞는 맞춤형 홈페이지
                </p>
              </Card>
              <Card hover>
                <IconTile name="share" />
                <h3 className="mt-5 text-[17px] font-bold text-navy">hover 카드</h3>
                <p className="mt-2 text-[14px] leading-[1.7] text-ink-2">
                  마우스를 올리면 살짝 떠오릅니다
                </p>
              </Card>
              <div className="on-navy rounded-card bg-navy p-1">
                <Card>
                  <IconTile name="gear" />
                  <h3 className="mt-5 text-[17px] font-bold text-white">네이비 밴드 안</h3>
                  <p className="mt-2 text-[14px] leading-[1.7] text-white/70">
                    카드가 자동으로 반전됩니다
                  </p>
                </Card>
              </div>
            </div>
          </Block>

          {/* 8. 밴드 리듬 */}
          <Block
            title="8. 밴드 리듬"
            note="시안 32장 실측 결과 밝은 영역 68% / 딥네이비 32%. Section 의 tone 으로만 배경을 지정하며, 화면 파일에서 bg-* 를 직접 쓰지 않습니다."
          >
            <div className="overflow-hidden rounded-card border border-line">
              {TONE_SAMPLES.map((sample) => (
                <div
                  key={sample.tone}
                  className={`flex h-16 items-center px-6 font-mono text-[13px] ${sample.className}`}
                >
                  tone = &quot;{sample.tone}&quot;
                </div>
              ))}
            </div>
          </Block>

          {/* 9. 사이트 설정 */}
          <Block
            title="9. 사이트 설정 — 미입력 항목"
            note="확정되지 않은 회사 정보를 임의로 만들지 않습니다. 비어 있는 항목은 실제 화면에 렌더되지 않으며, Phase 8 에서 관리자로 입력합니다."
          >
            <div className="overflow-x-auto rounded-card border border-line bg-paper">
              <table className="w-full min-w-[520px] text-[13px]">
                <tbody>
                  {SETTINGS_ROWS.map(([label, value]) => (
                    <tr key={label} className="border-b border-line last:border-b-0">
                      <th
                        scope="row"
                        className="w-40 bg-ivory px-4 py-3 text-left font-medium text-navy"
                      >
                        {label}
                      </th>
                      <td className="px-4 py-3">
                        {value ? (
                          <span className="text-ink">{value}</span>
                        ) : (
                          <span className="text-muted">[추후 입력] — 화면에 렌더되지 않음</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  <tr className="border-t-2 border-line">
                    <th
                      scope="row"
                      className="w-40 bg-ivory px-4 py-3 text-left font-medium text-navy"
                    >
                      사이트 URL
                    </th>
                    <td className="px-4 py-3">
                      <span className="font-mono text-ink">{SITE_URL}</span>
                      <span className="ml-3 text-muted">
                        {IS_DOMAIN_CONFIRMED
                          ? '도메인 확정 · 색인 허용'
                          : '도메인 미확정 · 색인 차단(noindex)'}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Block>
        </div>
      </Section>
    </>
  );
}
