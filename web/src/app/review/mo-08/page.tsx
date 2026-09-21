import type { Metadata } from 'next';
import Mo08 from '@/components/mo08/Mo08';

export const metadata: Metadata = {
  title: 'BIZNESTA — BN_MO_08_SIGNATURE review',
  robots: { index: false, follow: false },
};

export default function ReviewMo08() {
  return <Mo08 />;
}
