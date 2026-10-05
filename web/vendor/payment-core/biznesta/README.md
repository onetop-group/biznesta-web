# BIZNESTA STORE — 도메인 · Adapter

PAYMENT CORE 와 BIZNESTA 사업을 잇는 자리입니다. **CORE 가 아닙니다.**

## 경계

```
   biznesta/          →   core/          (이 방향만)
   core/              →   biznesta/      ★ 없습니다
```

- `core/` 와 `sql/core/` 에는 `biznesta` 라는 글자가 코드로 존재하지 않습니다.
  `npm run verify` 의 `NO_DOMAIN_IN_CORE` 게이트가 매번 확인합니다.
- `biznesta/` 가 `core/` 를 부르는 것은 정상입니다. 가게가 결제기를 쓰는 것과 같습니다.
- `test/biznesta-adapter.js` 의 「CORE 는 biznesta 를 require 하지 않는다」 검사가
  반대 방향이 생기는 순간 실패합니다.

## 왜 이 저장소에 있나

`[판단]` BIZNESTA WEB 저장소(Next.js)에는 DB 수준 검증 장치가 없고, 공개 화면은
FINAL LOCK 상태입니다. 여기에는 pglite 격리 검증 · 실환경 스위트 · 스냅샷 ·
rollback 도구가 이미 있어 **검증 가능한 자리**가 여기뿐입니다.
`examples/demo_shop` · `examples/demo_course` 가 이미 같은 저장소에 사는 것과 같은 구조입니다.

STORE 화면(`/store`)을 실제로 만들 때 이 폴더를 WEB 쪽으로 옮길지는 그때 다시 정합니다.
옮기더라도 `core/` 는 한 줄도 바뀌지 않습니다 — 그러라고 이렇게 나눠 두었습니다.

## 무엇이 어디에 있나

| 파일 | 역할 |
|---|---|
| `sql/30_store.sql` | `biz_products` · `biz_buyers` · `biz_entitlements` + 쓰기 진입점 RPC |
| `sql/31_rls.sql` | 권한 · RLS (역할과 `is_admin()` 이 있는 환경 전용) |
| `schema.js` | 위 두 파일의 목록 · 로더 |
| `store-port.js` | 도메인 데이터 계약 (Adapter 는 SQL 을 모릅니다) |
| `sql-store.js` | 그 계약의 SQL 구현 — pg 와 pglite 양쪽에서 같은 코드가 돕니다 |
| `token.js` | 상품 접근 토큰 생성 · sha256 |
| `adapter.js` | CORE Adapter 계약 구현 |
| `index.js` | 조립 + `beginGuestPurchase` · `checkAccess` |

## 비회원 구매에서 '누구'

```
BIZNESTA :  biz_buyers 행          (이메일을 보관하는 유일한 자리)
CORE     :  pay_orders.user_ref = 그 행의 uuid 문자열
```

CORE 는 그 uuid 가 사람인지도 모릅니다. **이메일은 CORE 로 넘어가지 않습니다.**
`adapter_meta` 에도 개인정보를 넣지 않습니다(`{channel, kind}` 뿐).

## 상품 접근 토큰

- 32바이트(256비트) 난수. 주문번호와 아무 관계가 없습니다.
- DB 에는 **sha256 해시만** 저장합니다. 해시는 서버에서 계산해 넘기므로
  원문은 DB 연결조차 타지 않습니다(쿼리 로그에도 안 남습니다).
- 그래서 **이미 발급된 링크는 다시 만들어 낼 수 없습니다.** hook 재시도 시
  토큰을 새로 돌리지 않는 이유이기도 합니다(이미 보낸 링크가 죽으면 안 됩니다).
- 재발급이 필요하면 별도 절차를 만들어야 합니다 — 아직 없습니다.

## 검증

```bash
npm run verify:biz        # 격리(pglite) — 38 검사
npm run verify:biz-db     # 실제 Supabase — 37 검사  (--apply 로 schema 적용)
```

`npm run verify`(265)에는 **일부러 넣지 않았습니다.** 대표님이 잠근 기준선을
이 작업이 움직이지 않게 하기 위해서입니다.

## 아직 없는 것

- `/store` 화면 · 상품 상세 · 실제 상품 · 실제 가격
- 전자책 파일 저장 · 다운로드
- 이메일 발송 (그래서 `deliverAccess` 를 주지 않으면 토큰은 버려집니다)
- 토큰 재발급 절차
- Toss 연결
