import type { Metadata } from 'next';
import {
  GOOGLE_SITE_VERIFICATION, NAVER_SITE_VERIFICATION,
  ROBOTS, SITE_DESCRIPTION, SITE_NAME, SITE_URL,
} from '@/lib/site';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'BIZNESTA — 당신의 비즈니스가 오늘보다 내일 더 빛나도록',
    template: '%s — BIZNESTA',
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  /* Production 배포에서만 열린다 — src/lib/site.ts 참고 */
  robots: ROBOTS,
  /* 구글·네이버에 사이트 소유를 증명하는 표식일 뿐이다. 검색 노출을 켜지는
     않는다 — 노출은 위의 robots 와 각 검색도구에서의 수집 요청이 따로 정한다. */
  verification: {
    google: GOOGLE_SITE_VERIFICATION,
    other: { 'naver-site-verification': NAVER_SITE_VERIFICATION },
  },
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    locale: 'ko_KR',
    url: '/',
    title: 'BIZNESTA — 당신의 비즈니스가 오늘보다 내일 더 빛나도록',
    description: SITE_DESCRIPTION,
    /* 2026-09-10 — 사용자가 만든 링크 미리보기 사진으로 바꿨다. 파일 이름을
       og.png 에서 og.jpg 로 바꾼 건 카카오톡·페이스북이 같은 주소의 옛 그림을
       한동안 붙들고 있기 때문이다. 이전 og.png 는 참조 없이 그대로 남겨 뒀다. */
    images: [{ url: '/brand/og.jpg', width: 1200, height: 630, alt: 'BIZNESTA' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BIZNESTA — 당신의 비즈니스가 오늘보다 내일 더 빛나도록',
    description: SITE_DESCRIPTION,
    images: ['/brand/og.jpg'],
  },
  icons: {
    icon: [
      { url: '/brand/icon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/brand/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [{ url: '/brand/icon-180.png', sizes: '180x180', type: 'image/png' }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="preload"
          href="/fonts/pretendard-subset.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
