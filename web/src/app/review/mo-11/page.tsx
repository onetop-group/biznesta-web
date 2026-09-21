import type { Metadata } from 'next';
import Mo11 from '@/components/mo11/Mo11';

export const metadata: Metadata = {
  title: 'BIZNESTA — BN_MO_11_CUSTOM_SOLUTION review',
  robots: { index: false, follow: false },
};

export default function ReviewMo11() {
  return <Mo11 />;
}
