import type { Metadata } from 'next';
import Mo06 from '@/components/mo06/Mo06';

export const metadata: Metadata = {
  title: 'BIZNESTA — BN_MO_06_DESIGN_DETAIL review',
  robots: { index: false, follow: false },
};

export default function ReviewMo06() {
  return <Mo06 />;
}
