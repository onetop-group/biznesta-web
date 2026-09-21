# BIZNESTA — 상담 문의 저장 (SUPABASE INQUIRY DB / PHASE 2)

CONTACT 화면의 상담 폼이 실제로 제출되어 Supabase `inquiries` 테이블에
저장되기까지의 구조를 적어 둔다. 화면 디자인 문서는 `VISUAL_MASTER_LOCK.md`
에 있고, 이 문서는 기능 쪽만 다룬다.

이 단계에서 만든 것은 **문의 저장까지**다. 관리자 문의관리 화면 · 메일 알림 ·
Webhook · Kakao 알림 · Auth · 결제는 아직 없다.

---

## 1. 흐름

```
브라우저 (CONTACT 폼)
  → client 검증        src/lib/inquiry.ts        validateInquiry()
  → Server Action      src/app/actions/inquiry.ts submitInquiry()
      · honeypot 확인
      · rate limit
      · 서버 재검증 + snake_case 매핑  src/lib/inquiry-db.ts  toInquiryRow()
      · Supabase insert               src/lib/supabase.ts     getSupabase()
  → 성공 / 실패 상태만 화면에 표시
```

브라우저가 Supabase 를 직접 호출하지 않는다. 검증 · 스팸 방어 · 로그를 한
곳에 모으고, 나중에 rate limit 이나 알림을 붙일 자리를 하나로 두기 위해서다.
`src/lib/supabase.ts` 는 `server-only` 라 클라이언트에서 import 하면 빌드가
실패한다.

## 2. 테이블

`supabase/migrations/0001_inquiries.sql` 하나로 재현된다. 여러 번 실행해도
안전하다. Supabase 대시보드 > SQL Editor 에 붙여 실행하거나
`supabase db push` 로 적용한다.

| 컬럼 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `id` | uuid | ✓ | 기본키 |
| `created_at` | timestamptz | ✓ | 기본값 now() |
| `name` | text | ✓ | 이름 (1~100자) |
| `contact` | text | ✓ | 연락처 (1~50자, 숫자 8자리 이상) |
| `email` | text | | PC 폼에만 있는 선택 항목 (≤200자) |
| `service` | text | ✓ | 문의 유형 / 상담 분야 (화면 select 값만 허용) |
| `message` | text | ✓ | 문의 내용 (1~2000자) |
| `privacy_consent` | boolean | ✓ | **true 만 저장 가능** (check 제약) |
| `consultation_source` | text | | 어디에서 상담으로 들어왔는지 |
| `selected_category` | text | | 카테고리 상세에서 왔을 때 |
| `selected_design` | text | | 디자인 상세에서 왔을 때 |
| `selected_service` | text | | 서비스 카드에서 왔을 때 |
| `selected_plan` | text | | 가격 플랜 카드에서 왔을 때 |
| `screen` | text | | `pc` 또는 `mobile` |
| `submitted_path` | text | | 제출한 경로 (≤500자) |
| `status` | text | ✓ | 기본값 `NEW`. 다음 단계(문의관리)용 |

인덱스: `created_at desc`, `status`.

## 3. RLS

```sql
alter table public.inquiries enable row level security;

create policy "anon can insert inquiries"
  on public.inquiries for insert to anon
  with check (privacy_consent = true);

revoke all on public.inquiries from anon, authenticated;
grant insert on public.inquiries to anon;
```

최소 권한 원칙에 따라 지금 열려 있는 것은 **공개 상담 폼의 anon INSERT 하나**뿐이다.

| 역할 | INSERT | SELECT | UPDATE | DELETE |
|---|---|---|---|---|
| `anon` | 허용 (`privacy_consent = true` 일 때만) | 거부 | 거부 | 거부 |
| `authenticated` | 거부 | 거부 | 거부 | 거부 |

- `authenticated` 에는 이번 단계에서 아무 권한도 열지 않는다. 관리자 조회·수정
  정책은 ADMIN / AUTH 단계에서 따로 설계한다.
- SELECT / UPDATE / DELETE 정책 자체를 만들지 않았고, RLS 가 켜져 있으면
  정책 없는 동작은 거부된다. 테이블 권한(GRANT) 도 INSERT 만 준다 —
  정책과 권한 두 겹으로 막힌다.
- `force row level security` 는 쓰지 않는다. FORCE 는 테이블 소유자에게도 정책을
  적용해 대시보드에서 접수 내용을 확인하는 것까지 막는데, anon 의 접근은 정책과
  GRANT 로만 결정되므로 보안 경계는 달라지지 않는다.
- anon key 가 브라우저에서 보이는 것은 정상이며, 실제 경계는 이 정책이다.
- service_role 키는 이 기능에 쓰지 않는다.

## 4. 검증

같은 규칙을 두 번 확인한다. 클라이언트 검증만 믿지 않는 이유는 Server Action
이 UI 를 거치지 않고 POST 로도 호출될 수 있기 때문이다.

| 항목 | 클라이언트 (`lib/inquiry.ts`) | 서버 (`lib/inquiry-db.ts`) | DB (check 제약) |
|---|---|---|---|
| name | 필수 | 필수 · ≤100 | 1~100 |
| contact | 필수 · 숫자 8자리 이상 | 동일 · ≤50 | 1~50 |
| email | 형식(PC, 입력 시) | 형식 · ≤200 | ≤200 |
| service | 필수 | 필수 · **화면 select 목록에 있는 값만** | 1~100 |
| message | 필수 | 필수 · ≤2000 | 1~2000 |
| privacyConsent | 필수 | `true` 아니면 거부 | `= true` |
| screen | — | `pc`/`mobile` 만 | 동일 |
| submitted_path | — | `/` 로 시작 · ≤500 | ≤500 |
| context 4종 | — | 각 ≤200 | 각 ≤200 |

## 5. 스팸 방어

**A. honeypot** — 폼에 사람에게 보이지 않는 `company` 칸이 있다
(`left: -9999px`, `tabIndex={-1}`, `aria-hidden`). 값이 채워져 오면 저장하지
않고 성공처럼 조용히 끝낸다(봇에게 실패를 알려주지 않는다).

**B. rate limit** — Server Action 인스턴스 메모리에서 IP 당 **10분에 5건**.
새 유료 인프라를 도입하지 않기 위한 1차 방어다.

> **한계**: 서버리스에서는 인스턴스마다 따로 세므로 분산 환경에서 정확하지
> 않다. Production 공개 전에 트래픽 규모를 보고 공유 저장소(Upstash Redis
> 등) 기반 rate limit 또는 Vercel WAF 규칙이 필요한지 판단한다.

## 6. 상태 표시

| 상황 | 화면 |
|---|---|
| 전송 중 | 버튼 비활성 + `aria-busy` + "접수 중…" |
| 성공 | "상담 신청이 접수되었습니다. / 확인 후 안내드리겠습니다." + `다시 작성하기`. 입력값은 비우고 성공 상태는 유지 |
| 실패 | "접수 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요." (입력값 유지) |
| rate limit | "요청이 많습니다. 잠시 후 다시 시도해주세요." |

- 즉시 연락 · 몇 분 내 · 오늘 연락 · 100% 회신 같은 보장 표현은 쓰지 않는다.
- Supabase 오류 코드 · 메시지 · 스택은 사용자 화면에 절대 노출하지 않고
  서버 로그에만 남긴다.
- 성공/실패 블록은 `role="status"` / `role="alert"` 로 읽어 준다.

## 7. 환경변수

`.env.example` 참고. 값은 저장소에 넣지 않는다.

| 이름 | 쓰이는 곳 | 비고 |
|---|---|---|
| `SUPABASE_URL` | 서버(Server Action) | Supabase > Project Settings > API |
| `SUPABASE_ANON_KEY` | 서버(Server Action) | 공개 키. 보호는 RLS 가 한다 |

`NEXT_PUBLIC_` 접두사가 붙은 이름도 인식하지만, 서버에서만 쓰므로 접두사 없는
이름을 권장한다(접두사가 붙으면 클라이언트 번들에 인라인될 수 있다).
Vercel 에는 Secret 타입으로 등록해 두었고, Secret 은 `vercel env pull` 로
내려받히지 않는다.

환경변수가 없으면 Server Action 이 실패 결과를 돌려주고 화면에는 일반적인
오류 안내만 나온다. **접수된 것처럼 보이지 않는다.**

## 8. LIVE 검증 결과 (2026-09-07, Preview) — FINAL APPROVED / COMPLETE

사용자 최종 승인(2026-09-07). 실제 Supabase 기준으로 아래를 모두 확인했고,
QA 테스트 행도 정리했다. Production 공개는 아직 하지 않는다.

실제 Supabase 프로젝트에 연결해 확인한 결과.

| 검사 | 결과 |
|---|---|
| FLOW A~E 실제 화면 제출 | 5/5 저장 성공, 런타임 오류 로그 0건 |
| anon INSERT (동의 true) | 허용 |
| anon INSERT (동의 false) | 거부 — `42501 new row violates row-level security policy` |
| 길이 제약 (service 120자) | 거부 — `23514 inquiries_service_len` |
| anon SELECT | 거부 — `42501 permission denied for table` |
| anon UPDATE | 거부 — 동일 |
| anon DELETE | 거부 — 동일 |
| client 번들 키 노출 | 0건 |

**연결 과정에서 걸렸던 것 두 가지** (같은 증상이 다시 나오면 여기부터 본다)

1. `permission denied for table inquiries` (42501) 는 RLS 정책 위반이 아니라
   **테이블 GRANT 부족** 메시지다. 정책 위반이면 `new row violates row-level
   security policy` 로 나온다. 두 메시지를 구분해서 봐야 한다.
2. 처음에 `SUPABASE_ANON_KEY` 에 **secret key(`sb_secret_…`)** 가 들어가 있었다.
   공개 폼에는 **publishable key(`sb_publishable_…`)** 또는 레거시 anon JWT 를
   넣어야 한다. secret key 는 용도가 다르므로 잘못 보관됐다면 폐기(rotate)한다.

## 9. 아직 하지 않은 것

관리자 문의관리 · 메일/Webhook/Kakao 알림 · Auth · 결제 · SNS · 실제 사업자 정보.
개인정보처리방침은 초안까지 작성했고(확정 필요 항목 표시), Production 배포도
하지 않았다. 공개 전 체크리스트는 LAUNCH.md.
