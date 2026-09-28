import Link from 'next/link';
import styles from './Breadcrumb.module.css';

/**
 * 지금 어디에 있는지 알려 주는 줄.
 * 마지막 칸은 현재 위치라 링크가 아니다 (aria-current 로 알려 준다).
 */
export default function Breadcrumb({ trail }: { trail: { label: string; href?: string }[] }) {
  return (
    <nav className={styles.wrap} aria-label="현재 위치">
      <ol className={styles.list}>
        {trail.map((t, i) => (
          <li key={t.label + i} className={styles.item}>
            {t.href ? (
              <Link href={t.href} className={styles.link}>{t.label}</Link>
            ) : (
              <span className={styles.current} aria-current="page">{t.label}</span>
            )}
            {i < trail.length - 1 && <span className={styles.sep} aria-hidden="true">›</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
