import type { Metadata } from 'next';
import Mo15 from '@/components/mo15/Mo15';

export const metadata: Metadata = {
  title: 'BIZNESTA — BN_MO_15_ABOUT review',
  robots: { index: false, follow: false },
};

export default function ReviewMo15() {
  return <Mo15 />;
}
