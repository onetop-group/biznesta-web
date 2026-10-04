/**
 * 승인 직후 발급된 접근 토큰이 **잠깐만** 머무는 자리.
 *
 * 왜 필요한가
 *   결제 승인(confirm)은 CORE 안에서 끝난다. 그 안의 hook 이 구매 권한을 만들고
 *   접근 토큰 원문을 한 번 내놓는데, 그 원문을 받을 곳이 호출한 쪽(라우트)이 아니라
 *   CORE 에 넘긴 콜백이다. 같은 요청 안에서 라우트로 되돌려 받기 위한 중계다.
 *
 * 규칙
 *   · 한 번만 읽힌다. 읽는 순간 지운다 (같은 토큰이 두 번 나가지 않는다).
 *   · 꺼내 가지 않은 것은 TTL 이 지나면 버린다. 해시는 DB 에 있으니 권한은 남고,
 *     원문만 사라진다 — 되살릴 수 없다. 그게 맞는 기본값이다.
 *   · 프로세스 메모리에만 있다. 디스크·DB·로그에 적지 않는다.
 *
 * ★ 이 파일에 'server-only' 를 붙이지 않았다. 검증 스크립트가 node 로 직접
 *   불러 보기 위해서다. 값을 들고 있는 것은 모듈 지역 Map 뿐이고, 서버에서
 *   채워지지 않으면 비어 있다 — 클라이언트로 갈 비밀이 애초에 없다.
 *   실제 토큰이 오가는 경로(payment.ts)는 'server-only' 로 잠겨 있다.
 */

export type TokenHandoff = {
  put(orderId: string, token: string): void;
  take(orderId: string): string | null;
  /** 들고 있는 건수. 검증·점검용이며 값은 돌려주지 않는다. */
  size(): number;
};

export const TOKEN_TTL_MS = 60_000;

export function createTokenHandoff(ttlMs: number = TOKEN_TTL_MS, now: () => number = Date.now): TokenHandoff {
  const pending = new Map<string, { token: string; at: number }>();

  /* 만료된 것을 먼저 버린다. 쓰기 때마다 하므로 따로 타이머를 두지 않는다 —
     타이머는 serverless 에서 살아 있지 않고, 살아 있으면 그게 더 문제다. */
  function prune(t: number) {
    for (const [k, v] of pending) if (t - v.at > ttlMs) pending.delete(k);
  }

  return {
    put(orderId, token) {
      if (!orderId || !token) return;
      const t = now();
      prune(t);
      pending.set(orderId, { token, at: t });
    },
    take(orderId) {
      const hit = pending.get(orderId);
      /* ★ 꺼내기 전에 지운다. 뒤에서 무엇이 터져도 두 번 나가지 않는다. */
      pending.delete(orderId);
      if (!hit) return null;
      if (now() - hit.at > ttlMs) return null;
      return hit.token;
    },
    size() {
      prune(now());
      return pending.size;
    },
  };
}
