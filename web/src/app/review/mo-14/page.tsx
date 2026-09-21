import type { Metadata } from 'next';
import Mo14 from '@/components/mo14/Mo14';

export const metadata: Metadata = {
  title: 'BIZNESTA — BN_MO_14_PROCESS review',
  robots: { index: false, follow: false },
};

export default function ReviewMo14() {
  return <Mo14 />;
}
