import type { Metadata } from 'next';
import { Playfair_Display, Parisienne } from 'next/font/google';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { brandMessage, site } from '@/data/site';
import { IS_DOMAIN_CONFIRMED, SITE_URL } from '@/lib/seo';
import './globals.css';

/**
 * 서체
 *   · Pretendard  — 한글 본문. jsDelivr CDN 에서 가변폰트로 불러옵니다.
 *   · Playfair    — 영문 대제목 (시안의 세리프 헤드라인)
 *   · Parisienne  — 필기체 악센트 (시안 30/32 장에 등장)
 *
 * Playfair · Parisienne 은 next/font 로 셀프호스팅되어
 * 폰트 로딩으로 인한 레이아웃 이동(CLS)이 발생하지 않습니다.
 */
const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-playfair',
  display: 'swap',
});

const parisienne = Parisienne({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-parisienne',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${site.brandNameEn} 비즈네스타 — ${brandMessage.main.join(' ')}`,
    template: `%s | ${site.brandNameEn} 비즈네스타`,
  },
  description:
    '비즈네스타는 단순한 홈페이지 제작이 아니라, 당신의 비즈니스가 성장하는 온라인 시스템을 함께 설계합니다. 디자인·콘텐츠·고객 유입·문의 DB·운영 시스템까지 맞춤 제작합니다.',
  openGraph: {
    type: 'website',
    siteName: `${site.brandNameEn} 비즈네스타`,
    locale: 'ko_KR',
    url: SITE_URL,
  },
  /**
   * ⚠️ 도메인이 확정되기 전에는 색인을 허용하지 않습니다.
   *    Preview 주소가 검색에 잡히면 나중에 정리하기 어렵습니다.
   *    NEXT_PUBLIC_SITE_URL 을 채우는 순간 자동으로 색인이 열립니다.
   */
  robots: IS_DOMAIN_CONFIRMED
    ? { index: true, follow: true }
    : { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${playfair.variable} ${parisienne.variable}`}>
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body className="flex min-h-dvh flex-col">
        {/* 59항 — 키보드 사용자를 위한 본문 바로가기 */}
        <a href="#main" className="u-skip-link rounded-pill bg-navy px-5 py-3 text-white">
          본문으로 바로가기
        </a>
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
