import { Icon } from '@/components/ui/Icon';

/**
 * 자리표시자 안내.
 *
 * ⚠️ 지금 쇼룸에 보이는 디자인은 레이아웃 확인용 Placeholder 입니다.
 *    실제 제작 사례처럼 보이게 두면 허위 정보가 되므로,
 *    개발 단계에서는 이 사실을 화면에 명시합니다.
 *
 * Phase 7 에서 관리자가 실제 시안을 등록하기 시작하면
 * 이 컴포넌트 호출을 제거합니다.
 */
export function PlaceholderNotice({ children }: { children?: React.ReactNode }) {
  return (
    <aside className="flex items-start gap-3 rounded-tile border border-dashed border-line-gold bg-gold-pale/40 px-5 py-4">
      <Icon name="bulb" size={20} className="mt-0.5 shrink-0 text-gold-deep" />
      <p className="text-[13px] leading-[1.7] text-ink-2">
        {children ?? (
          <>
            현재 표시되는 디자인은 <strong className="font-semibold text-navy">레이아웃 확인용 자리표시자</strong>
            입니다. 실제 제작 사례가 아니며, 화면 안의 미리보기도 사진이 아니라 구조만 그린 것입니다.
            실제 시안은 관리자 디자인 등록 기능(Phase 7)이 완성된 뒤 하나씩 등록됩니다.
          </>
        )}
      </p>
    </aside>
  );
}
