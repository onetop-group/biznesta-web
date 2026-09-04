import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,

  /* 개발 중 화면 좌하단 Next.js 배지를 끕니다 (화면 캡처가 깨끗해집니다) */
  devIndicators: false,

  /**
   * 관리자 이미지 업로드용 서버 액션 본문 상한 (Phase 7 대비).
   * 기본값 1MB 로는 디자인 시안 이미지를 받을 수 없습니다.
   */
  experimental: {
    serverActions: {
      bodySizeLimit: '8mb',
    },
  },

  images: {
    /* 51항 — 이미지가 수백~수천 장 쌓이는 쇼룸 특성상 최신 포맷을 우선합니다 */
    formats: ['image/avif', 'image/webp'],
    /* Phase 6 에서 Supabase Storage 연결 시 사용 */
    remotePatterns: [{ protocol: 'https', hostname: '**.supabase.co' }],
  },
};

export default nextConfig;
