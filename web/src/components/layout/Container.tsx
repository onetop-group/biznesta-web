import { cx } from '@/lib/utils';

/**
 * 가로 폭 컨테이너.
 * 시안(1536px 기준)의 좌우 여백 비율을 재현합니다.
 */
export function Container({
  children,
  className,
  wide = false,
}: {
  children: React.ReactNode;
  className?: string;
  /** 갤러리처럼 넓게 써야 하는 섹션 */
  wide?: boolean;
  }) {
  return (
    <div
      className={cx(
        'mx-auto w-full px-5 sm:px-8 lg:px-10 xl:px-14',
        wide ? 'max-w-[1600px]' : 'max-w-[1440px]',
        className,
      )}
    >
      {children}
    </div>
  );
}
