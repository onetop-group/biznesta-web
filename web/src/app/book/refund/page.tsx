import type { Metadata } from 'next';
import PolicyPage from '@/components/book/PolicyPage';
import { REFUND } from '@/data/book-policy';

/**
 * 전자책 환불·취소·청약철회 정책.
 *
 * "다운로드하면 환불 불가" 한 줄로 끝내지 않는다. 관련 법령은 제공 개시로
 * 청약철회를 제한하려면 사업자가 미리 알리고 필요한 조치를 하도록 정하고 있고,
 * 표시·광고와 다른 경우에는 별도의 권리를 두고 있다. 그 구조를 그대로 적는다.
 */
export const metadata: Metadata = {
  title: '전자책 환불·취소·청약철회 정책',
  description: 'BIZNESTA BOOK 전자책의 청약철회, 환불, 취소에 관한 정책입니다.',
  alternates: { canonical: '/book/refund' },
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <PolicyPage
      title="전자책 환불·취소·청약철회 정책"
      sections={REFUND}
      current="/book/refund"
    />
  );
}
