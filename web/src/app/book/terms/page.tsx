import type { Metadata } from 'next';
import PolicyPage from '@/components/book/PolicyPage';
import { PENDING, TERMS } from '@/data/book-policy';

/**
 * BIZNESTA BOOK 이용약관.
 *
 * 홈페이지 제작 서비스 약관이 아니다 — 전자책 등 디지털콘텐츠에만 적용된다.
 * 본문은 src/data/book-policy.ts 에 있고 이 파일은 화면만 만든다.
 */
export const metadata: Metadata = {
  title: 'BIZNESTA BOOK 이용약관',
  description: 'BIZNESTA BOOK 에서 판매하는 전자책 등 디지털콘텐츠의 구매와 이용에 관한 약관입니다.',
  alternates: { canonical: '/book/terms' },
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <PolicyPage
      title="BIZNESTA BOOK 이용약관"
      sections={TERMS}
      current="/book/terms"
      pendingNote={PENDING.delivery
        ? '전자책을 전달하는 방법(이메일 발송 수단)은 서비스 개시 전에 확정하여 이 약관과 상품 상세페이지에 반영합니다. 해당 조항에는 「확정 전」 표시를 해 두었습니다.'
        : undefined}
    />
  );
}
