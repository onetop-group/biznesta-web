import type { Metadata } from 'next';
import Mo13 from '@/components/mo13/Mo13';

export const metadata: Metadata = {
  title: 'BIZNESTA — BN_MO_13_PRICE review',
  robots: { index: false, follow: false },
};

export default function ReviewMo13() {
  return <Mo13 />;
}
