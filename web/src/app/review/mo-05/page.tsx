import type { Metadata } from 'next';
import Mo05 from '@/components/mo05/Mo05';

export const metadata: Metadata = {
  title: 'BIZNESTA — BN_MO_05_CATEGORY_DETAIL review',
  robots: { index: false, follow: false },
};

export default function ReviewMo05() {
  return <Mo05 />;
}
