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

## 5. 대표 결정 (2026-09-22) — 08 주문 · 결제 잠정 보류

주문 · 결제 모듈은 **보류**한다. Placeholder(연결 예정)는 그대로 두고, Payment 관련
DB · API · UI · 외부 PG 연동을 설계하거나 구현하지 않는다. PURPLE SAJU 의 결제 방식 전환과
실결제 검증이 끝난 뒤, 검증된 Payment 구조를 별도 Reference 로 분석해 BIZNESTA 적용 범위를
정한다. 이 결정은 STEP 1-B(문의함 · Auth · Foundation)에 영향을 주지 않는다.

## 6. 이 단계에서 하지 않은 것

JOURNAL DB 이관 · CMS · 콘텐츠 자동화 · 결제 · 프로젝트 DB · 포트폴리오 DB · Storage 전환 ·
Public 디자인/SEO/Visual Master 수정 · 문의 DELETE.

## 7. STEP 1-B 검증 기록 (2026-09-22, Preview = 커밋 ebe19b2)

**대표 실사용 검수 (Preview, 관리자 계정)** — 로그인 · 오늘의 운영 · 문의함 조회(실제 5건) ·
문의 상세 · 상태 변경 · 관리자 메모 저장 · 목록/대시보드 반영 · 로그아웃 · 재로그인 **전부 정상**.

**자동 검증**

| 항목 | 결과 |
|---|---|
| 비로그인 `/admin`, `/admin/inquiries`, `/admin/inquiries/<id>`, `/admin/orders`, `/admin/settings` | 307 → `/admin/login?next=…` |
| `/admin/login` | 200 · `Cache-Control: no-store` · `X-Robots-Tag: noindex` · meta robots noindex |
| 잘못된 이메일/비밀번호 | `?error=invalid` · "이메일 또는 비밀번호가 맞지 않습니다." (이유 비구분) |
| 클라이언트 번들(.next/static) | supabase 주소 0 · 토큰 패턴 0 · `SUPABASE_` 0 |
| 공개 상담폼 INSERT (Preview 모바일 폼) | "상담 신청이 접수되었습니다." — anon INSERT 그대로 |
| Public 회귀: 이 빌드 vs Production 본문 (11 경로) | 11/11 일치 · `/contact` 표식 일치 |
| Public 렌더 (PC 1024px · MO 719px · 넘침 0 · 방침 링크) | 변경 전과 동일 |
| 공개 화면이 proxy 를 거치는가 | 아니오 (matcher `/admin` 뿐, `X-Robots-Tag` 없음) |

**DB 권한 (마이그레이션 0005 실행 결과)** — anon INSERT 유지 · authenticated SELECT ·
UPDATE(status, admin_note) · DELETE 없음. 관리자 1명 등록.

**남은 확인** — `set role anon; select count(*) from public.inquiries;` 가 permission denied 인지
대시보드에서 1회 확인(anon key 가 Vercel Sensitive 라 코드 밖에서 자동 검증 불가).

---

# STEP 2 — PROJECT OPERATIONS (프로젝트)

브랜치 `admin-v1/step2b-project-ui`. Production 반영 전 (main 은 여전히 87e9167).

## 8. 경계 — 문의와 프로젝트

`inquiries` 는 **접수 당시의 원본 기록**이고 `projects` 는 **상담 이후 실제로 진행되는
업무**다. 문의를 프로젝트로 옮기거나 변형하지 않는다. 연결은 `projects.source_inquiry_id`
한 방향 참조뿐이며, 전환해도 **문의 상태를 자동으로 바꾸지 않는다**(대표 확정).

고객은 별도 테이블로 빼지 않고 프로젝트 안에 스냅샷(`client_name` · `client_contact` ·
`client_email`)으로 둔다. 프로젝트가 충분히 쌓여 중복 관리 필요가 실제로 보이면 그때
`customers` 를 별도 설계한다.

## 9. DB — `supabase/migrations/0006_projects.sql` (STEP 2-A · Production 적용 완료)

| 대상 | 내용 |
|---|---|
| `public.projects` | 15컬럼. 상태 7값(CONSULTING · PREPARING · IN_PROGRESS · REVIEW · DONE · ON_HOLD · CANCELLED), 유형 6값, 플랜 4값 |
| `project_no` | `BN-2026-001`. DB 시퀀스 + BEFORE INSERT 트리거가 채번한다. 코드에서 만들지 않는다 |
| RLS | `admin can read/insert/update projects` — 셋 다 `is_admin()` |
| GRANT | select · insert · update(10컬럼). `project_no` · `created_at` · `source_inquiry_id` 는 수정 불가 |
| DELETE | 정책도 GRANT 도 없다. 취소(CANCELLED)도 기록으로 남긴다 |
| `inquiries` | **변경 0** — 컬럼 · 정책 · GRANT 그대로 |

STEP 2-A 적용 확인(대표 실행, 2026-09-22): 확인 쿼리 1~10 PASS · 프로젝트 0건.

## 10. 코드 (STEP 2-B)

```
src/lib/admin/projects.ts                  목록(진행 중 우선) · 검색 · 필터 · 건수 · 상세 ·
                                           생성 · 상태/메모/정보 수정 · 문의별 조회
src/app/admin/(shell)/projects/page.tsx    목록 (PC 표 · 모바일 카드)
                       /new/page.tsx       생성 (문의에서 오면 초기값)
                       /[id]/page.tsx      상세 · 상태 · 메모 · 원본 문의 보기
                       /actions.ts         Server Action 4개 (관리자 재확인 후 실행)
```
추가만 한 곳: `nav.ts`(03 활성화) · `(shell)/page.tsx`(프로젝트 지표) ·
`inquiries/[id]/page.tsx`(프로젝트 카드) · `ui.tsx`(ProjectStatusBadge).

## 11. STEP 2-B 검증 기록 (2026-09-25)

**대표 실사용 검수 (Preview, 관리자 계정)** — 문의함 → 문의 상세 → 「프로젝트로 전환」 →
문의 정보가 생성 화면에 정상 전달 → 프로젝트 생성 성공 → **`BN-2026-001` 자동 채번 확인** →
상세 화면 정상 → 상태를 「제작 중」으로 변경 → **상태 배지 · 운영 정보 반영 확인** →
내부 메모 「STEP 2-B 프로젝트 메모 저장 테스트」 저장 → **저장 후 유지 확인** →
**원본 문의 연결 표시 확인**. 전 구간 정상.

**자동 검증** — 격리 Postgres(PGlite)에 0001→0005→0006 을 실제 적용하고 역할을 바꿔 가며
운영 FLOW 를 끝까지 따라감: **28/28 PASS**. 접수(anon INSERT) → 전환 초기값 → 생성 →
채번 → 목록 → 상세 → 상태 → 메모 → updated_at 갱신 → 정보 수정 → 원본 문의 →
연결 확인 / 한 문의 2건 / 문의 없이 생성 / `source_inquiry_id` · `project_no` 수정 거부 /
DELETE 불가 / 취소 기록 보존 / anon · 비관리자 차단 / 공개 상담폼 정상 / 날짜 제약.

**문의 원본 보존** — 이름 · 연락처 · 이메일 · 내용 불변, 상태 NEW 유지, `admin_note` null 유지,
`updated_at` 까지 그대로.

**Public Regression** — Public 파일 변경 0 · 본문 11/11 Production 일치 ·
PC 1024px / MO 719px / 넘침 0 · 클라이언트 번들 비밀값 0.

**Production** — 영향 없음. `biznesta.com` 은 `87e9167` 빌드이고 `/admin` 은 404.
