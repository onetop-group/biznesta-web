import { Button } from '@/components/ui/Button';
import { Section } from '@/components/layout/Section';
import { SectionHeader } from '@/components/layout/SectionHeader';

export default function NotFound() {
  return (
    <Section padding="lg">
      <div className="mx-auto max-w-2xl py-16 text-center">
        <SectionHeader
          as="h1"
          eyebrow="404"
          title={['요청하신 페이지를', '찾을 수 없습니다.']}
          description={['주소가 바뀌었거나 삭제된 페이지일 수 있습니다.']}
          align="center"
        />
        <div className="mt-10 flex justify-center">
          <Button href="/" arrow size="lg">
            홈으로 돌아가기
          </Button>
        </div>
      </div>
    </Section>
  );
}
