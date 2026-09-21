# BIZNESTA ADMIN CENTER — V1 STEP 1-B (Foundation · Auth · 문의함)

2026-09-21. 브랜치 `admin-v1/step1b-foundation`. Production 반영 전.

## 1. 경계

Admin 은 Public 홈페이지와 **분리된 운영 화면**이다. 32개 시안 · 렌더러 · URL · SEO ·
상담폼 · BusinessInfo · `src/data/journal.ts` 는 이 단계에서 한 줄도 바뀌지 않았다.
Admin 은 `/admin/*` 아래에만 산다. 공개 화면은 `src/proxy.ts` 조차 거치지 않는다
(matcher 가 `/admin` 뿐이다).

## 2. 인증 — Supabase Auth, 전부 서버에서

```
브라우저 ── form POST ──▶ Server Action signIn()
                          └─ supabase.auth.signInWithPassword (anon key, 서버)
                          └─ admin_users 에 있는가?  없으면 signOut + 실패
                          └─ 세션 쿠키 Set-Cookie
브라우저 ── /admin/* ──▶ src/proxy.ts  (세션 검증 · 만료 임박 시 갱신 · 없으면 /admin/login)
                     ──▶ app/admin/(shell)/layout.tsx  requireAdmin()  (세션 + 명단 재확인)
```

- 브라우저에는 **어떤 키도 내려가지 않는다.** anon key 도 서버 전용 env(`SUPABASE_URL`,
  `SUPABASE_ANON_KEY`)로만 읽는다. `NEXT_PUBLIC_*` 를 새로 만들지 않았다.
- `service_role` 은 쓰지 않는다. 관리자 접근은 authenticated 세션 + RLS 로만 한다.
- 관리자 = `auth.users` 에 있고 **그리고** `public.admin_users` 에 등록된 사용자.
  로그인만 되는 계정은 관리자가 아니다 (로그인 직후 세션을 끊는다).
- 역할은 V1 `ADMIN` 하나. `admin_users.role` 과 check 제약으로 자리를 남겨 두었다.
- 로그인 실패는 이유를 구분해 알려주지 않는다. 같은 IP 10분 10회 제한.
- `/admin/*` 응답: `Cache-Control: no-store`, `X-Robots-Tag: noindex`, metadata robots noindex.
  `robots.ts` 는 건드리지 않았다(DO NOT TOUCH).

## 3. DB — `supabase/migrations/0005_admin_inquiries.sql`

| 대상 | 내용 |
|---|---|
| `public.admin_users` 신설 | `user_id`(auth.users FK) · `role`('ADMIN') · `created_at`. RLS: 본인 행 SELECT 만 |
| `public.is_admin()` | security definer. RLS 정책이 쓴다 |
| `inquiries.admin_note` | text, nullable, ≤4000자 |
| `inquiries.updated_at` | timestamptz, 기본 now(), UPDATE 트리거로 자동 갱신 |
| RLS `admin can read inquiries` | authenticated · `is_admin()` |
| RLS `admin can update inquiries` | authenticated · `is_admin()` |
| GRANT | `select` 전체 · `update (status, admin_note)` **두 컬럼만** · delete 없음 |
| anon | **변경 없음** — INSERT 정책 · GRANT 그대로 |

관리자 등록은 대시보드에서 사람이 한다 (Authentication > Users > Add user → SQL 로
`admin_users` 에 insert). API 로는 등록할 수 없다.

## 4. 코드 지도

```
src/proxy.ts                               /admin 문지기 (세션 검증 · 갱신 · 리다이렉트 · no-store)
src/lib/admin/supabase.ts                  세션 쿠키 기반 서버 클라이언트 · getAdminUser()
src/lib/admin/auth.ts                      requireAdmin() · currentAdmin()
src/lib/admin/inquiries.ts                 목록/검색/필터/건수/상세/상태/메모 (실제 컬럼만)
src/lib/admin/nav.ts                       메뉴 10개 + 상태 배지 (운영 중 · 준비 중 · 연결 예정)
src/components/admin/AdminShell.tsx/.css   왼쪽 메뉴 · 상단 바 · 본문 틀 (태블릿 이하 서랍)
src/components/admin/NavDrawer.tsx         서랍 열기/닫기 (client)
src/components/admin/ui.tsx/.css           PageHead · Card · StatusBadge · Placeholder · 날짜/유입 표기
src/app/admin/login/                       로그인 화면 · signIn/signOut Server Action
src/app/admin/(shell)/layout.tsx           requireAdmin + AdminShell
src/app/admin/(shell)/page.tsx             오늘의 운영 (문의 지표만)
src/app/admin/(shell)/inquiries/           목록(검색·상태·서비스·페이지) · 상세 · 상태/메모 Action
src/app/admin/(shell)/{projects,designs,journal,content-studio,services,orders,settings,system}/
                                           자리만 있는 화면 (Placeholder)
```

## 5. 이 단계에서 하지 않은 것

JOURNAL DB 이관 · CMS · 콘텐츠 자동화 · 결제 · 프로젝트 DB · 포트폴리오 DB · Storage 전환 ·
Public 디자인/SEO/Visual Master 수정 · 문의 DELETE.
