import type { Metadata } from 'next';
import Mo07 from '@/components/mo07/Mo07';

export const metadata: Metadata = {
  title: 'BIZNESTA — BN_MO_07_NEW_DESIGN review',
  robots: { index: false, follow: false },
};

export default function ReviewMo07() {
  return <Mo07 />;
}
