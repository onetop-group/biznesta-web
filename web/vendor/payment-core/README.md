# PAYMENT CORE — 사본 (직접 고치지 마십시오)

이 폴더는 별도 private 저장소 `onetop-group/biznesta-payment-core` 의 **사본**입니다.
원본 태그와 파일별 sha256 이 `MANIFEST.json` 에 적혀 있고, 빌드 전마다
(`prebuild`) 일치 여부를 확인합니다. 한 글자만 달라도 빌드가 멈춥니다.

## 고치는 방법

1. 원본 저장소에서 고치고 검증하고 커밋 · 태그
2. 여기서 다시 가져오기

```bash
npm run vendor:sync -- --from ../../../biznesta-payment-core
npm run vendor:check
npm run verify:core
```

## 왜 사본인가 (다른 방법을 못 쓰는 이유)

| 방법 | 왜 안 되는가 |
|---|---|
| `file:` 의존성 | Vercel 은 이 저장소 밖 파일을 올리지 않습니다. 배포에서 경로가 없습니다 |
| git+https private 의존성 | 빌드에 GitHub 토큰이라는 **Secret 이 새로 필요**합니다 |
| private npm 레지스트리 | 계정·요금·토큰이 새로 필요합니다 |
| 원본을 이 저장소로 이전 | PAYMENT CORE 가 독립 제품이라는 성질을 잃습니다 |

사본의 유일한 위험은 '몰래 달라지는 것' 이고, 그것은 해시 확인으로 막습니다.

## 이 README 는 사본이 아닙니다

`vendor/payment-core/README.md`(이 파일)는 우리가 쓴 것이고 sync 가 건드리지 않습니다.
sync 는 `core/` 와 `biznesta/` 두 폴더만 비우고 다시 채웁니다.

## 여기 없는 것

- `sql/core/*.sql` — CORE 스키마 파일. WEB 은 스키마를 적용하지 않습니다.
  그래서 `core/db/schema.js` 의 `apply()` 는 이 사본에서 동작하지 않습니다(의도한 것입니다).
  스키마 적용은 원본 저장소의 검증 도구로만 합니다.
- `test/` · 문서 · `.env*`

## 이 앱이 쓰는 자리

`src/lib/store/payment.ts` 하나뿐입니다. 그 파일은 `server-only` 라서
Client Component 가 import 하면 빌드가 깨집니다.
