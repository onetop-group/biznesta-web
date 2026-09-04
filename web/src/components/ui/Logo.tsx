import Image from 'next/image';
import { cx } from '@/lib/utils';

/**
 * BIZNESTA 공식 로고.
 *
 * ⚠️ 로고는 이 컴포넌트를 통해서만 사용합니다.
 *    화면 파일에서 <Image src="/brand/..."> 를 직접 쓰지 마세요.
 *
 * ▸ 향후 SVG 교체 방법
 *   1) public/brand/ 에 logo-navy.svg · logo-white.svg 를 넣고
 *   2) 아래 LOGO_SOURCES 의 경로만 .svg 로 바꾸면 끝입니다.
 *   화면 코드는 한 줄도 고치지 않습니다.
 *
 * ▸ variant
 *   navy  — 밝은 배경(아이보리 · 화이트)용. 원본 색 그대로.
 *   white — 딥네이비 배경용. 네이비 글자만 흰색, 골드 N 은 유지.
 */

const LOGO_SOURCES = {
  navy: '/brand/logo-navy.png',
  white: '/brand/logo-white.png',
} as const;

/** 여백을 제거한 원본 파일의 실제 비율 (576 x 160) */
const INTRINSIC = { width: 576, height: 160 } as const;

export type LogoVariant = keyof typeof LOGO_SOURCES;

interface LogoProps {
  variant?: LogoVariant;
  /** 렌더 폭(px). 높이는 비율로 자동 계산됩니다. */
  width?: number;
  /** 헤더 최상단 로고에만 true — LCP 개선용 */
  priority?: boolean;
  className?: string;
}

export function Logo({ variant = 'navy', width = 176, priority = false, className }: LogoProps) {
  const height = Math.round((width * INTRINSIC.height) / INTRINSIC.width);

  return (
    <Image
      src={LOGO_SOURCES[variant]}
      alt="BIZNESTA — BUSINESS TOTAL SOLUTION"
      width={width}
      height={height}
      priority={priority}
      className={cx('h-auto w-auto', className)}
      style={{ width, height }}
    />
  );
}
