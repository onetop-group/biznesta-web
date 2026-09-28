import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,

  /* pg 는 서버에서만 쓰는 네이티브 성격의 패키지다. 번들러가 안으로 끌어들이면
     선택적 의존(pg-native 등) 때문에 깨진다. 서버 런타임이 직접 require 하게 둔다.
     ★ 이 설정은 클라이언트 번들과 무관하다 — pg 는 애초에 client 에서 import 되지 않는다
       (src/lib/book/* 가 전부 'server-only' 다). */
  serverExternalPackages: ['pg'],

  /* 손님에게 보이는 이름은 BIZNESTA BOOK 이므로 주소도 /book 이다.
     /store 는 내부에서 쓰던 이름이라 이미 나간 주소가 깨지지 않게 넘겨 준다. */
  async redirects() {
    return [
      { source: '/store', destination: '/book', permanent: false },
      { source: '/store/:path*', destination: '/book/:path*', permanent: false },
    ];
  },
};

export default nextConfig;
