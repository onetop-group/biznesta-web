import Link from 'next/link';
import { mainCta, mainNav } from '@/data/navigation';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/ui/Logo';
import { Container } from './Container';
import { MobileDrawer } from './MobileDrawer';

/**
 * 상단 헤더 — BN_PC 시안 16장 공통 구조.
 *
 *   [로고]      DESIGN  SERVICE  SOLUTION  PRICE  PORTFOLIO  ABOUT  CONTACT   [제작 상담하기 →]
 *              홈페이지  제작     맞춤      제작    제작       회사    제작
 *              디자인    서비스   솔루션    비용    사례       소개    상담
 *
 * 모바일은 [로고] + [메뉴] 버튼만 (BN_MO 시안 16장 공통).
 */
export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-line/80 bg-ivory-soft/92 backdrop-blur-md">
      <Container>
        <div className="flex h-header-mo items-center justify-between gap-6 lg:h-header">
          <Link href="/" aria-label="BIZNESTA 홈으로" className="shrink-0">
            <span className="lg:hidden">
              <Logo width={136} priority />
            </span>
            <span className="hidden lg:block xl:hidden">
              <Logo width={150} priority />
            </span>
            <span className="hidden xl:block">
              <Logo width={186} priority />
            </span>
          </Link>

          <nav aria-label="주 메뉴" className="hidden lg:block">
            <ul className="flex items-center">
              {mainNav.map((item) => (
                <li key={item.href} className="border-r border-line last:border-r-0">
                  {/*
                    1024~1279px 에서는 영문만 보여줍니다.
                    이 구간에서 국문까지 두 줄로 넣으면 7개 메뉴가 줄바꿈되어
                    시안의 한 줄 구성이 깨집니다. 시안의 2줄 표기는 xl(1280px+)
                    부터 적용합니다.
                  */}
                  <Link
                    href={item.href}
                    className="group block whitespace-nowrap px-3 py-2 text-center transition-colors xl:px-5 2xl:px-6"
                  >
                    <span className="u-eyebrow-tight block whitespace-nowrap text-[12px] font-bold text-navy transition-colors group-hover:text-gold-deep xl:text-[13px]">
                      {item.labelEn}
                    </span>
                    <span className="mt-1 hidden whitespace-nowrap text-[12px] text-muted transition-colors group-hover:text-ink-2 xl:block">
                      {item.labelKo}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="hidden shrink-0 lg:block">
            <Button href={mainCta.href} arrow size="md">
              {mainCta.label}
            </Button>
          </div>

          <MobileDrawer />
        </div>
      </Container>
    </header>
  );
}
