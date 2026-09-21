import type { Metadata } from 'next';
import Pc16 from '@/components/pc16/Pc16';
import Mo16 from '@/components/mo16/Mo16';
import InquiryForm from '@/components/site/InquiryForm';
import BusinessInfo from '@/components/site/BusinessInfo';
import { readContext } from '@/data/navigation';
import styles from './contact.module.css';

export const metadata: Metadata = {
  title: '제작 상담',
  description: '업종과 목표를 알려주시면 비즈네스타가 맞는 홈페이지와 온라인 운영 방식을 함께 정리해 드립니다.',
  alternates: { canonical: '/contact' },
};

/**
 * 상담 진입점.
 *
 * 어디에서 눌러 들어왔는지를 query 로 받아(source / category / design /
 * service / plan) 폼에 실어 둔다. 아직 저장하지 않는다.
 *
 * 모바일에서는 공식 CONTACT 화면의 상담 폼 영역만 real-size 폼으로 바꾼다.
 * 1024x1536 아트워크가 430px 로 축소되면 입력 높이가 21.8px 밖에 되지 않기
 * 때문이다. 위(hero + 상담 채널 카드)와 아래(마무리 밴드 + support)는 공식
 * 화면 그대로 이어 붙인다. PC 는 폼이 화면 가운데 패널 안에 있고 좌우에 다른
 * 칼럼이 있어 잘라낼 수 없으므로, 패널 안에서 실제로 쓸 수 있는 크기까지
 * 키운 폼을 그대로 쓴다.
 */
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const context = readContext(await searchParams);
  return (
    <>
      <main>
        <div className={styles.desktop}>
          <Pc16 context={context} />
        </div>
        <div className={styles.mobile}>
          <Mo16 slice="top" />
          <InquiryForm context={context} />
          <Mo16 slice="bottom" />
        </div>
      </main>
      <BusinessInfo />
    </>
  );
}
