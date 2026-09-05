import Link from 'next/link';
import type { DesignSummary } from '@/types';
import { getCategory } from '@/data/categories';
import { originShort } from '@/data/designs';
import { DeviceMockup } from '@/components/ui/DeviceMockup';
import { cx } from '@/lib/utils';

/**
 * 디자인 카드 — Editorial Gallery 의 기본 단위.
 *
 * ▸ 상품 카드가 아니라 "작품"으로 보이게 하는 규칙
 *   · 화면(작품)이 카드에서 가장 큰 요소입니다. 텍스트는 캡션 위치로 내립니다.
 *   · 베젤 없는 frame 을 기본으로 씁니다. 목업 프레임이 반복되면 카탈로그처럼 보입니다.
 *   · 그림자를 모든 카드에 똑같이 주지 않습니다. 크기별로 깊이를 다르게 둡니다.
 *
 * ▸ variant
 *   plate   작품 액자 — 갤러리 기본 (베젤 없음)
 *   device  목업 구도 — 큰 카드에서만
 *   wide    가로로 긴 프레젠테이션
 *
 * ⚠️ 실제 고객 사례가 아니라 BIZNESTA 자체 CONCEPT / SAMPLE 디자인이므로
 *    카드마다 origin 배지를 표기합니다 (지시서 4항).
 */
export function DesignCard({
  design,
  variant = 'plate',
  index,
  showTags = false,
  ratio,
  eager = false,
}: {
  design: DesignSummary;
  variant?: 'plate' | 'device' | 'wide';
  index?: number;
  showTags?: boolean;
  ratio?: string;
  eager?: boolean;
}) {
  const category = getCategory(design.categorySlug);
  const isDevice = variant === 'device';
  const frameRatio = ratio ?? (variant === 'wide' ? '16 / 9' : '4 / 3');

  return (
    <article className="group flex h-full flex-col">
      <Link href={`/design/${design.slug}`} className="block">
        <div
          className={cx(
            'relative overflow-hidden rounded-card',
            'transition-all duration-500 ease-out',
            isDevice
              ? 'shadow-[0_2px_10px_-4px_rgba(13,35,64,0.08)] group-hover:shadow-[0_30px_60px_-24px_rgba(13,35,64,0.34)]'
              : 'ring-1 ring-line shadow-[0_2px_10px_-4px_rgba(13,35,64,0.08)] group-hover:ring-line-gold group-hover:shadow-[0_28px_58px_-24px_rgba(13,35,64,0.32)]',
            'group-hover:-translate-y-1.5',
          )}
          style={
            isDevice
              ? {
                  aspectRatio: frameRatio,
                  background: `linear-gradient(152deg, ${design.palette.sub} 0%, #ffffff 54%, ${design.palette.sub} 100%)`,
                }
              : { aspectRatio: frameRatio }
          }
        >
          {isDevice ? (
            <>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -right-[18%] -top-[24%] size-[62%] rounded-full opacity-40 blur-3xl"
                style={{ backgroundColor: design.palette.point }}
              />
              <div className="absolute inset-0 flex items-end justify-center px-9 pt-10 lg:px-12 lg:pt-12">
                <DeviceMockup
                  source={{ design }}
                  variant="duo"
                  className="w-full translate-y-[6%] transition-transform duration-500 ease-out group-hover:translate-y-[3%]"
                  phoneScale={0.2}
                />
              </div>
            </>
          ) : (
            <div className="absolute inset-0 origin-top transition-transform duration-700 ease-out group-hover:scale-[1.04]">
              <DeviceMockup
                source={{ design }}
                variant="frame"
                ratio="16 / 10"
                className="size-full"
              />
            </div>
          )}

          {/* 출처 배지 — 고객 사례가 아님을 항상 명시합니다 */}
          <span className="u-eyebrow-tight absolute left-3.5 top-3.5 z-10 flex items-center gap-2">
            {design.isNew && (
              <span className="rounded-full bg-gradient-to-r from-gold-soft to-gold px-2.5 py-1 text-[10px] font-bold text-navy">
                NEW
              </span>
            )}
            <span className="rounded-full bg-navy/80 px-2.5 py-1 text-[9px] font-bold text-white/85 backdrop-blur-sm">
              {originShort[design.origin]}
            </span>
          </span>

          {typeof index === 'number' && (
            <span className="u-eyebrow-tight absolute right-3.5 top-3.5 z-10 text-[11px] font-bold text-navy/45 mix-blend-luminosity">
              {String(index).padStart(2, '0')}
            </span>
          )}
        </div>
      </Link>

      {/* 캡션 */}
      <div className="flex flex-1 items-start justify-between gap-4 pt-4">
        <div className="min-w-0">
          <h3
            className={cx(
              'font-bold text-navy transition-colors group-hover:text-gold-deep',
              variant === 'wide' ? 'text-[20px] lg:text-[22px]' : 'text-[16px]',
            )}
          >
            <Link href={`/design/${design.slug}`}>{design.title}</Link>
          </h3>
          <p
            className={cx(
              'mt-1.5 leading-[1.65] text-ink-2',
              variant === 'wide' ? 'text-[14px]' : 'text-[13px]',
            )}
          >
            {design.shortDescription}
          </p>

          <p className="u-eyebrow-tight mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] text-muted">
            <span>{category?.name}</span>
            <span aria-hidden="true">·</span>
            <span>{design.industry}</span>
            <span aria-hidden="true">·</span>
            <span className="text-gold-deep">{design.level}</span>
          </p>

          {showTags && design.tags.length > 0 && (
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {design.tags.slice(0, 3).map((tag) => (
                <li
                  key={tag}
                  className="rounded-pill border border-line bg-ivory-soft px-2.5 py-1 text-[11px] text-ink-2"
                >
                  {tag}
                </li>
              ))}
            </ul>
          )}
        </div>

        <span
          aria-hidden="true"
          className={cx(
            'mt-0.5 flex shrink-0 items-center justify-center rounded-full border border-line-gold text-gold-deep',
            'transition-all duration-300 group-hover:border-gold-deep group-hover:bg-gold group-hover:text-navy',
            variant === 'wide' ? 'size-11 text-[16px]' : 'size-9 text-[14px]',
          )}
        >
          →
        </span>
      </div>
      {eager && <span className="u-sr-only">주요 디자인</span>}
    </article>
  );
}
