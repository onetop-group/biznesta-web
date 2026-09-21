import type { Metadata } from 'next';
import Mo12 from '@/components/mo12/Mo12';

export const metadata: Metadata = {
  title: 'BIZNESTA — BN_MO_12_SERVICE_SELECT review',
  robots: { index: false, follow: false },
};

export default function ReviewMo12() {
  return <Mo12 />;
}
