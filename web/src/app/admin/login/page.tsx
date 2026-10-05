import type { Metadata } from 'next';
import { signIn } from './actions';
import styles from './login.module.css';

export const metadata: Metadata = {
  title: '관리자 로그인 — BIZNESTA ADMIN',
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = 'force-dynamic';

const MESSAGE: Record<string, { text: string; kind: 'error' | 'info' }> = {
  invalid:     { text: '이메일 또는 비밀번호가 맞지 않습니다.', kind: 'error' },
  empty:       { text: '이메일과 비밀번호를 모두 입력해 주세요.', kind: 'error' },
  rate:        { text: '시도가 너무 많습니다. 10분 뒤에 다시 해주세요.', kind: 'error' },
  unavailable: { text: '지금은 로그인할 수 없습니다. 잠시 후 다시 시도해 주세요.', kind: 'error' },
  denied:      { text: '관리자 권한이 필요한 화면입니다. 다시 로그인해 주세요.', kind: 'info' },
  signedout:   { text: '로그아웃되었습니다.', kind: 'info' },
};

/**
 * 관리자 로그인. proxy.ts 가 이미 로그인된 사용자는 /admin 으로 보내므로
 * 이 화면은 항상 "아직 로그인 안 됨" 상태에서만 보인다.
 */
export default async function Page({
  searchParams,
}: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? '';
  const msg = MESSAGE[one(sp.error) || one(sp.reason) || (one(sp.signedout) ? 'signedout' : '')];
  const next = one(sp.next);

  return (
    <main className={styles.wrap}>
      <section className={styles.panel} aria-labelledby="login-title">
        <p className={styles.brand}>BIZNESTA</p>
        <p className={styles.sub}>ADMIN CENTER</p>
        <h1 id="login-title" className={styles.title}>관리자 로그인</h1>

        {msg && (
          <p className={msg.kind === 'error' ? styles.error : styles.info} role={msg.kind === 'error' ? 'alert' : 'status'}>
            {msg.text}
          </p>
        )}

        <form action={signIn} className={styles.form}>
          {next && <input type="hidden" name="next" value={next} />}
          <label className={styles.label} htmlFor="email">이메일</label>
          <input id="email" name="email" type="email" autoComplete="username" required
                 className={styles.input} placeholder="admin@biznesta.com" />
          <label className={styles.label} htmlFor="password">비밀번호</label>
          <input id="password" name="password" type="password" autoComplete="current-password" required
                 className={styles.input} />
          <button type="submit" className={styles.submit}>로그인</button>
        </form>

        <p className={styles.note}>등록된 관리자만 들어갈 수 있습니다. 계정 문의는 대표에게 해주세요.</p>
      </section>
    </main>
  );
}
