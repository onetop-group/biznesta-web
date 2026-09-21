import type { Metadata } from 'next';
import Mo02 from '@/components/mo02/Mo02';

export const metadata: Metadata = {
  title: 'BIZNESTA — BN_MO_02_BRAND_MESSAGE review',
  robots: { index: false, follow: false },
};

export default function ReviewMo02() {
  return <Mo02 />;
}
