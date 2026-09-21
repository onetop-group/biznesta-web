import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

/**
 * /admin 문지기.
 *
 * 1. 세션 쿠키를 읽어 Supabase 에 "이 사용자가 유효한가" 를 묻는다. 만료가
 *    가까우면 여기서 갱신된 쿠키를 응답에 실어 보낸다 (Server Component 는
 *    쿠키를 못 쓰므로 갱신은 이 파일의 몫이다).
 * 2. 로그인 안 된 요청이 /admin/* 에 오면 /admin/login 으로 보낸다.
 *    로그인된 요청이 /admin/login 에 오면 /admin 으로 보낸다.
 * 3. /admin/* 응답은 어디에도 캐시되지 않게 한다 (개인정보).
 *
 * 관리자 명단(admin_users) 확인은 여기서 하지 않는다 — 그건 DB 조회라
 * 화면 쪽 requireAdmin() 이 맡는다. 여기서는 "세션이 있는가" 만 본다.
 * 공개 화면(/, /design …)은 matcher 에 없어서 이 파일을 거치지 않는다.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLogin = pathname === '/admin/login';

  /* 화면(layout)이 현재 경로를 알 수 있게 요청 헤더에 실어 보낸다.
     쿠키가 갱신되면 요청도 다시 만들어야 하므로 함수로 둔다. */
  const next = () => {
    const hh = new Headers(request.headers);
    hh.set('x-admin-path', pathname);
    return NextResponse.next({ request: { headers: hh } });
  };
  let response = next();

  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  let signedIn = false;
  if (url && key) {
    const supabase = createServerClient(url, key, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(list) {
          for (const { name, value } of list) request.cookies.set(name, value);
          response = next();
          for (const { name, value, options } of list) response.cookies.set(name, value, options);
        },
      },
    });
    /* getUser() 는 토큰을 서버에서 검증한다. getSession() 은 쿠키를 믿기만 하므로 쓰지 않는다. */
    const { data: { user } } = await supabase.auth.getUser();
    signedIn = Boolean(user);
  }

  if (!signedIn && !isLogin) {
    const to = new URL('/admin/login', request.url);
    if (pathname !== '/admin') to.searchParams.set('next', pathname);
    const redirect = NextResponse.redirect(to);
    noStore(redirect);
    return redirect;
  }
  if (signedIn && isLogin) {
    const redirect = NextResponse.redirect(new URL('/admin', request.url));
    noStore(redirect);
    return redirect;
  }

  noStore(response);
  return response;
}

function noStore(res: NextResponse) {
  res.headers.set('Cache-Control', 'no-store, max-age=0');
  res.headers.set('X-Robots-Tag', 'noindex, nofollow');
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
};
