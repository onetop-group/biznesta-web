import Link from 'next/link';
import {
  ALL_FILTER, TOTAL_DESIGNS, categoryHref, designsIn, getCategory,
} from '@/data/showroom';
import { consultHref } from '@/data/navigation';
import DesignCard from './DesignCard';
import { CategoryChips, Crumb, ShowroomFoot, ShowroomTop } from './ShowroomChrome';
import styles from './Showroom.module.css';

/** 한 화면에 올리는 작품 수. 43개를 한 번에 쏟아붓지 않는다. */
export const PER_PAGE = 12;

export default function DesignList({ categoryId, page }: { categoryId: string; page: number }) {
  const all = designsIn(categoryId);
  const isAll = categoryId === ALL_FILTER.id;
  const category = getCategory(categoryId);
  const pages = Math.max(1, Math.ceil(all.length / PER_PAGE));
  const current = Math.min(Math.max(1, page), pages);
  const shown = all.slice((current - 1) * PER_PAGE, current * PER_PAGE);

  const title = isAll ? '전체 디자인' : (category?.name ?? '디자인');
  const lead = isAll
    ? 'BIZNESTA가 만든 홈페이지 디자인을 업종별로 모았습니다. 각 작품은 PC와 모바일 화면이 한 쌍입니다.'
    : category?.desc;

  return (
    <main className={styles.page}>
      <div className={styles.wrap}>
        <ShowroomTop />
        <Crumb trail={[
          { label: '홈', href: '/' },
          { label: '홈페이지 디자인', href: '/design' },
          { label: title },
        ]} />

        <header className={styles.head}>
          <p className={styles.collection}>BIZNESTA DESIGN COLLECTION</p>
          <p className={styles.eyebrow}>{isAll ? 'ALL DESIGN' : category?.label}</p>
          <h1 className={styles.title}>{title}</h1>
          {lead && <p className={styles.lead}>{lead}</p>}
          <p className={styles.count}><b>{all.length}</b> DESIGN · PC + MOBILE</p>
          <span className={styles.headRule} aria-hidden />
        </header>

        <CategoryChips current={categoryId} />

        {shown.length ? (
          <div className={styles.gallery}>
            {shown.map((d, i) => <DesignCard key={d.id} design={d} eager={i < 2} />)}
          </div>
        ) : (
          <p className={styles.empty}>이 카테고리에는 아직 공개된 디자인이 없습니다.</p>
        )}

        {pages > 1 && (
          <nav className={styles.pager} aria-label="디자인 목록 페이지">
            {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
              <Link key={n}
                    href={n === 1 ? categoryHref(categoryId) : `${categoryHref(categoryId)}?page=${n}`}
                    className={`${styles.pageLink} ${n === current ? styles.pageOn : ''}`}
                    aria-current={n === current ? 'page' : undefined}>
                {String(n).padStart(2, '0')}
              </Link>
            ))}
          </nav>
        )}

        <ShowroomFoot
          href={consultHref('design', isAll ? {} : { category: categoryId })}
          text="마음에 드는 디자인이 있으신가요?"
          note={isAll
            ? `${TOTAL_DESIGNS}개 디자인 중 원하는 분위기를 알려주시면 그 방향으로 함께 정리해 드립니다.`
            : '이 카테고리를 기준으로 상담을 시작하실 수 있습니다.'}
        />
      </div>
    </main>
  );
}
