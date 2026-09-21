import type { Metadata } from 'next';
import Mo04 from '@/components/mo04/Mo04';

export const metadata: Metadata = {
  title: 'BIZNESTA — BN_MO_04_DESIGN_GALLERY review',
  robots: { index: false, follow: false },
};

export default function ReviewMo04() {
  return <Mo04 />;
}
