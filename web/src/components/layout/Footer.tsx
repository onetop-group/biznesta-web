import Link from 'next/link';
import { footerLinks, mainCta, mainNav, trustPoints } from '@/data/navigation';
import { brandMessage, site } from '@/data/site';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Logo } from '@/components/ui/Logo';
import { Container } from './Container';

/**
 * 푸터 — BN_PC / BN_MO 시안 공통의 딥네이비 밴드.
 *
 *   [로고]  " 인용구 "        [아이콘3]        [CTA →]
 *   ─────────────────────────────────────────────────
 *   메뉴 · 사업자정보 · 저작권
 *
 * ⚠️ 사업자정보는 site_settings 값이 비어 있으면 렌더하지 않습니다.
 *    확정되지 않은 정보를 임의로 채우지 않습니다 (지시서 60항).
 */

const TRUST_ICONS = {
  consult: 'chat',
  proposal: 'doc',
  expert: 'headset',
} as const;

export function Footer() {
  const { business, contact, brandNameEn, tagline } = site;

  const businessLines = [
    business.companyName && `상호 ${business.companyName}`,
    business.owner && `대표 ${business.owner}`,
    business.registrationNo && `사업자등록번호 ${business.registrationNo}`,
    business.address,
  ].filter(Boolean) as string[];

  const contactLines = [
    contact.phone && `T. ${contact.phone}`,
    contact.email && `E. ${contact.email}`,
    contact.consultHours,
  ].filter(Boolean) as string[];

  return (
    <footer className="on-navy bg-navy text-white">
      {/* 상단 CTA 밴드 */}
      <Container>
        <div className="flex flex-col gap-8 border-b border-navy-line py-10 lg:flex-row lg:items-center lg:justify-between lg:gap-10 lg:py-12">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-10">
            <Logo variant="white" width={168} />
            <p className="border-navy-line text-[15px] leading-[1.7] text-white/80 lg:border-l lg:pl-10 lg:text-base">
              {brandMessage.adminPhilosophy.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </p>
          </div>

          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-8">
            <ul className="flex items-center gap-6 lg:gap-8">
              {trustPoints.map((point) => (
                <li key={point.key} className="flex items-center gap-2 text-[13px] text-white/70">
                  <Icon name={TRUST_ICONS[point.key]} size={20} className="text-gold" />
                  {point.label}
                </li>
              ))}
            </ul>
            <Button href={mainCta.href} arrow size="lg" className="shrink-0">
              {mainCta.label}
            </Button>
          </div>
        </div>
      </Container>

      {/* 하단 정보 */}
      <Container>
        <div className="flex flex-col gap-8 py-9 lg:flex-row lg:justify-between lg:gap-16 lg:py-11">
          <nav aria-label="푸터 메뉴">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="u-eyebrow-tight text-[11px] font-semibold text-white/70 transition-colors hover:text-gold"
                  >
                    {item.labelEn}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="text-[13px] leading-[1.9] text-white/55">
            {businessLines.length > 0 && <p>{businessLines.join('  ·  ')}</p>}
            {contactLines.length > 0 && <p>{contactLines.join('  ·  ')}</p>}
            <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1">
              {footerLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="transition-colors hover:text-gold"
                >
                  {link.labelKo}
                </Link>
              ))}
              <span className="u-eyebrow-tight text-[11px] text-white/35">
                © {new Date().getFullYear()} {brandNameEn} · {tagline}
              </span>
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
