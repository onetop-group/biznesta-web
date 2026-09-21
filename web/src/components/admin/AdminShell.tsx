import Link from 'next/link';
import { ADMIN_NAV, NAV_STATE_LABEL } from '@/lib/admin/nav';
import type { AdminUser } from '@/lib/admin/supabase';
import { signOut } from '@/app/admin/login/actions';
import NavDrawer from './NavDrawer';
import styles from './AdminShell.module.css';

/**
 * ADMIN CENTER 공통 틀 — 왼쪽 메뉴 · 위쪽 바 · 본문.
 *
 * PC: 왼쪽 메뉴 고정. 태블릿 이하: 메뉴가 서랍(drawer)으로 접히고
 * 위쪽 바의 버튼으로 연다 (NavDrawer 가 열고 닫기만 담당).
 * 메뉴 항목의 배지는 lib/admin/nav.ts 의 state 를 그대로 보여준다.
 */
export default function AdminShell({
  user, current, children,
}: { user: AdminUser; current: string; children: React.ReactNode }) {
  const nav = (
    <nav className={styles.nav} aria-label="관리자 메뉴">
      <ul className={styles.navList}>
        {ADMIN_NAV.map((n) => {
          const active = current === n.href || (n.href !== '/admin' && current.startsWith(n.href + '/'));
          return (
            <li key={n.href}>
              <Link href={n.href}
                    className={`${styles.navItem} ${active ? styles.navActive : ''} ${n.state !== 'live' ? styles.navDim : ''}`}
                    aria-current={active ? 'page' : undefined}>
                <span className={styles.navNo}>{n.no}</span>
                <span className={styles.navLabel}>{n.label}</span>
                <span className={`${styles.badge} ${styles['badge_' + n.state]}`}>{NAV_STATE_LABEL[n.state]}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );

  return (
    <div className={styles.shell}>
      <aside className={styles.side}>
        <div className={styles.brand}>
          <span className={styles.brandMark}>BIZNESTA</span>
          <span className={styles.brandSub}>ADMIN CENTER</span>
        </div>
        {nav}
        <div className={styles.sideFoot}>
          <span className={styles.version}>V1 · STEP 1</span>
        </div>
      </aside>

      <div className={styles.main}>
        <header className={styles.top}>
          <NavDrawer>{nav}</NavDrawer>
          <div className={styles.topSpacer} />
          <div className={styles.user}>
            <span className={styles.userMail} title={user.email}>{user.email}</span>
            <span className={styles.userRole}>{user.role}</span>
          </div>
          <form action={signOut}>
            <button type="submit" className={styles.logout}>로그아웃</button>
          </form>
        </header>
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
}
