import type { Metadata } from 'next';
import Mo16 from '@/components/mo16/Mo16';

export const metadata: Metadata = {
  title: 'BIZNESTA — BN_MO_16_CONTACT review',
  robots: { index: false, follow: false },
};

export default function ReviewMo16() {
  return <Mo16 />;
}
