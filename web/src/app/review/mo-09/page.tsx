import type { Metadata } from 'next';
import Mo09 from '@/components/mo09/Mo09';

export const metadata: Metadata = {
  title: 'BIZNESTA — BN_MO_09_CONTENT_GROWTH review',
  robots: { index: false, follow: false },
};

export default function ReviewMo09() {
  return <Mo09 />;
}
