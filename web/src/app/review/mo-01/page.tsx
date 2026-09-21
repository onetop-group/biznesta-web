import type { Metadata } from 'next';
import Mo01 from '@/components/mo01/Mo01';

export const metadata: Metadata = {
  title: 'BIZNESTA — BN_MO_01_HERO review',
  robots: { index: false, follow: false },
};

export default function ReviewMo01() {
  return <Mo01 />;
}
