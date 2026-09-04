# BIZNESTA — 공식 홈페이지

> 예쁜 홈페이지에서 끝나지 않습니다. 운영할 수 있는 홈페이지를 만듭니다.

## 실행 방법

```bash
cd web
npm install
npm run dev      # http://localhost:3000
```

| 명령 | 설명 |
| --- | --- |
| `npm run dev` | 개발 서버 |
| `npm run build` | 프로덕션 빌드 |
| `npm run typecheck` | 타입 검사 |
| `npm run logo` | 공식 로고에서 투명본 · 반전본 재생성 |

## 확인용 페이지

| 경로 | 내용 |
| --- | --- |
| `/` | 임시 홈 (Phase 2 기반 검증용 — 실제 메인은 Phase 3) |
| `/styleguide` | 디자인 토큰 · 공통 컴포넌트 · 사이트 설정 미입력 현황 |

## 규칙

**색상 · 서체 · 간격은 `src/app/globals.css` 의 `@theme` 블록에서만 바꿉니다.**
화면 파일에 hex 값을 직접 적지 않습니다.

**배경색은 `<Section tone="...">` 으로만 지정합니다.**
시안 32장 실측 비율(밝은 68% / 딥네이비 32%)을 지키기 위해서입니다.

**도메인은 `src/lib/seo.ts` 한 곳에서만 결정됩니다.**
`NEXT_PUBLIC_SITE_URL` 이 비어 있으면 Vercel 배포 URL → localhost 순으로 자동 대체되며,
값이 비어 있는 동안에는 검색 색인이 차단됩니다.

**확정되지 않은 회사 정보를 임의로 만들지 않습니다.**
`src/data/site.ts` 의 빈 값은 화면에 렌더되지 않습니다. Phase 8 에서 관리자로 입력합니다.

**로고는 `<Logo>` 컴포넌트로만 사용합니다.**
SVG 원본을 받으면 `src/components/ui/Logo.tsx` 의 `LOGO_SOURCES` 경로만 교체하면 됩니다.

## 진행 단계

- [x] **Phase 2** — Git · 프로젝트 구조 · Design System · Header/Footer/Section · 로고
- [ ] Phase 3 — PC UI 16화면
- [ ] Phase 4 — 모바일 반응형
- [ ] Phase 5 — 카테고리 · 디자인 갤러리 · 상세
- [ ] Phase 6 — Supabase 스키마 · RLS · Storage · Auth
- [ ] Phase 7 — ADMIN 핵심 (인증 · 대시보드 · 디자인 관리 · 이미지 슬롯)
- [ ] Phase 8 — ADMIN 운영 (문의 · 콘텐츠 · 설정 · 가격 · 모바일 관리자)
- [ ] Phase 9~13 — Admin Demo · 점검 · Preview · 검수 · Production
