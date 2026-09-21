# BIZNESTA — OFFICIAL VISUAL MASTER / FINAL LOCK

    BIZNESTA
    PC01~16 + MO01~16
    TOTAL 32 SCREEN
    OFFICIAL VISUAL MASTER
    FINAL LOCK

사용자 최종 승인일: 2026-09-06
승인 범위: PC 16화면 + MOBILE 16화면 = 총 32개 공식 디자인 화면
배포 상태: **Preview only. Production 미배포.**

---

## 1. LOCK 대상 32화면

| # | PC | 원본 시안 | 구현 | 상태 |
|---|----|-----------|------|------|
| 01 | HERO | BN_PC_01_HERO.png | `components/pc01` | FINAL LOCK |
| 02 | BRAND MESSAGE | BN_PC_02_BRAND_MESSAGE.png | `components/pc02` | FINAL LOCK |
| 03 | CATEGORY | BN_PC_03_CATEGORY.png | `components/pc03` | FINAL LOCK |
| 04 | DESIGN SHOWROOM | BN_PC_04_DESIGN_SHOWROOM.png | `components/pc04` | FINAL LOCK |
| 05 | CATEGORY DETAIL | BN_PC_05_CATEGORY_DETAIL.png | `components/pc05` | FINAL LOCK |
| 06 | DESIGN DETAIL | BN_PC_06_DESIGN_DETAIL.png | `components/pc06` | FINAL LOCK |
| 07 | NEW DESIGN | BN_PC_07_NEW_DESIGN.png | `components/pc07` | FINAL LOCK |
| 08 | SIGNATURE | BN_PC_08_SIGNATURE.png | `components/pc08` | FINAL LOCK |
| 09 | CONTENT GROWTH | BN_PC_09_CONTENT_GROWTH.png | `components/pc09` | FINAL LOCK |
| 10 | ADMIN SYSTEM | BN_PC_10_ADMIN_SYSTEM.png | `components/pc10` | FINAL LOCK |
| 11 | CUSTOM SOLUTION | BN_PC_11_CUSTOM_SOLUTION.png | `components/pc11` | FINAL LOCK |
| 12 | SERVICE SELECT | BN_PC_12_SERVICE_SELECT.png | `components/pc12` | FINAL LOCK |
| 13 | PRICE | BN_PC_13_PRICE.png | `components/pc13` | FINAL LOCK |
| 14 | PROCESS | BN_PC_14_PROCESS.png | `components/pc14` | FINAL LOCK |
| 15 | ABOUT | BN_PC_15_ABOUT.png | `components/pc15` | FINAL LOCK |
| 16 | CONTACT | BN_PC_16_CONTACT.png | `components/pc16` | FINAL LOCK |

| # | MOBILE | 원본 시안 | 구현 | 상태 |
|---|--------|-----------|------|------|
| 01 | HERO | BN_MO_01_HERO.png | `components/mo01` | FINAL LOCK |
| 02 | BRAND MESSAGE | BN_MO_02_BRAND_MESSAGE.png | `components/mo02` | FINAL LOCK |
| 03 | CATEGORY | BN_MO_03_CATEGORY.png | `components/mo03` | FINAL LOCK |
| 04 | DESIGN GALLERY | BN_MO_04_DESIGN_GALLERY.png | `components/mo04` | FINAL LOCK |
| 05 | CATEGORY DETAIL | BN_MO_05_CATEGORY_DETAIL.png | `components/mo05` | FINAL LOCK |
| 06 | DESIGN DETAIL | BN_MO_06_DESIGN_DETAIL.png | `components/mo06` | FINAL LOCK |
| 07 | NEW DESIGN | BN_MO_07_NEW_DESIGN.png | `components/mo07` | FINAL LOCK |
| 08 | SIGNATURE | BN_MO_08_SIGNATURE.png | `components/mo08` | FINAL LOCK |
| 09 | CONTENT GROWTH | BN_MO_09_CONTENT.png | `components/mo09` | FINAL LOCK |
| 10 | ADMIN SYSTEM | BN_MO_10_ADMIN.png | `components/mo10` | FINAL LOCK |
| 11 | CUSTOM SOLUTION | BN_MO_11_CUSTOM_SOLUTION.png | `components/mo11` | FINAL LOCK |
| 12 | SERVICE SELECT | BN_MO_12_SERVICE.png | `components/mo12` | FINAL LOCK |
| 13 | PRICE | BN_MO_13_PRICE.png | `components/mo13` | FINAL LOCK |
| 14 | PROCESS | BN_MO_14_PROCESS.png | `components/mo14` | FINAL LOCK |
| 15 | ABOUT | BN_MO_15_ABOUT.png | `components/mo15` | FINAL LOCK |
| 16 | CONTACT | BN_MO_16_CONTACT.png | `components/mo16` | FINAL LOCK |

검수 경로: `/review` (개발 전용, `robots: noindex`)

---

## 2. 변경 금지 항목

별도 지시가 없는 한 32화면의 다음 요소는 수정하지 않는다.

- 레이아웃 / section position / whitespace
- 이미지 및 이미지 crop
- typography hierarchy
- color area / layering / perspective
- artwork (인페인트 플레이트, 컷 자산)
- CTA 위치 / card composition

각 화면은 `components/<screen>/` + `data/<screen>.ts` + `public/assets/<screen>/`로 격리되어 있다.
공용 코드(`components/shared/`)는 읽기 전용으로 취급하고, 화면별로 필요한 아이콘은
해당 화면 파일 안에 로컬로 정의한다.

### 재현 시스템 (수정 시 반드시 유지)

- PC: 아트워크 1536×1024, `--s: min(calc(100cqw / 1536), 1.32px)`
- MOBILE: 아트워크 1024×1536, `--s: min(calc(100cqw / 1024), 0.4199px)`
- 모든 좌표·크기는 `calc(N * var(--s))`
- 사진·목업·그림자는 원본 픽셀(인페인트 플레이트), 글자·버튼·링크는 실제 HTML
- 회귀 기준: PC 1536px 캡처, MOBILE viewport 430 × deviceScaleFactor 1024/430

---

## 3. 사실성 정책 (LOCK된 대체 문구)

시안에 인쇄된 값 중 **BIZNESTA가 확정하지 않은 것**은 게시하지 않는다.
슬롯의 위치·크기·굵기·색은 그대로 두었으므로, 확정 시 데이터 값만 교체하면 된다.

| 항목 | 시안 값 | 현재 게시 값 | 위치 |
|------|---------|--------------|------|
| 플랜 가격 | 690,000 / 1,290,000 / 2,490,000원~ 등 | `상담 후 안내` | `data/pc13.ts`, `data/mo13.ts` |
| 맞춤 견적 | 맞춤 견적 / 별도 견적 | 원본 유지 (사실) | 동일 |
| 제작 기간 | 약 2주 / 4주 / 6주 | `상담 후 안내` | `data/mo06.ts` |
| 사후 관리 기간 | 제작 후 1 / 3 / 6개월 관리 | `제작 후 관리 지원` | `data/mo13.ts` |
| 인기 플랜 표기 | BEST / 가장 인기 있는 기본 플랜 | `추천` / `표준 제작 플랜` | `data/mo13.ts` |
| 전화번호 | 010-1234-5678 | `상담 신청 후 안내` | `data/mo16.ts` |
| 이메일 | biznesta@biznesta.kr | `상담 신청 후 안내` | `data/mo16.ts` |
| 주소 · 지도 | 경기도 고양시 … / 지도 바로보기 | `상담은 온라인으로 진행됩니다` / `상담 신청하기` | `data/mo16.ts` |
| 영업시간 | 평일 09:00-18:00 (주말·공휴일 휴무) | `상담 가능 시간은 상담 시 안내드립니다` | `data/mo16.ts` |
| 고객 후기 | "— 실제 고객 후기" 인용 | BIZNESTA 자체 원칙 (귀속 명시) | `data/mo11.ts`, `data/mo14.ts` |

추가로 게시하지 않는 것: 직원 수 · 팀 구성 · 사무실 · 회사 규모 · 고객 수 · 프로젝트 수 ·
성공률 · 만족도 · 수상 · 파트너 · 경력 · 사업자등록번호 · 통신판매업 신고번호 ·
카카오톡 ID · 대표자 연락처.

SNS는 공개 수준(채널 연계 / 콘텐츠 활용 / 온라인 홍보 지원 / SNS 통합 운영 지원)까지만
표기하고, 자동화 엔진·자동 발행 workflow·내부 아키텍처는 노출하지 않는다.

대체 사유는 각 `data/*.ts` 파일 헤더 주석에 개별 기록되어 있다.

---

## 4. 배포 상태

- 환경: **Preview only**
- Production 배포, Production Domain / Alias, `biznesta.vercel.app` — **모두 미변경**
- Production 배포는 사용자 최종 승인 후 별도 단계에서 진행

---

## 4-A. FINAL MOBILE USABILITY OPTIMIZATION

FINAL LOCK 은 **해제되지 않았다.** 아래는 승인된 Visual Master 를 다시 디자인한
것이 아니라, 실제 스마트폰에서 본문을 읽을 수 있게 만드는
**FINAL MOBILE USABILITY OVERRIDE** 다.

### 사용자 승인 (2026-09-06)

> **430px Visual Master 의 exact pixel reproduction 보다 실제 모바일 가독성을
> 우선하기로 사용자 승인.**

430px 에서도 주요 본문이 9.2~9.7 CSS px 로 남아 실제 서비스용 모바일
홈페이지로는 너무 작다는 판단에 따른 결정이다. 따라서 430px 렌더링이 Visual
Master 와 픽셀 단위로 달라지는 것을 허용한다. 단, 달라져도 되는 것은 **본문 ·
설명 · menu · CTA 등 텍스트와 그에 따른 최소한의 내부 여백**뿐이다.

이미지 · image crop · artwork · 배경 · 카드 구조 · grid · section order ·
section composition · 색상 · perspective · layering · CTA 위치의 기본 구조 ·
headline hierarchy · editorial identity 는 그대로 유지한다.

### 구현 방식

- **breakpoint 없음.** 모바일 스테이지는 `--s` 가 `.4199px` 로 상한이 걸려
  430px 에서 고정되므로, 상한 없는 규칙은 430px 이상 모든 폭에서 430px 과
  동일하게 렌더링된다. 360 → 430px 사이 어디에서도 글자가 갑자기 작아지는
  구간이 없다 (400 → 401px 단절 제거 완료, 8개 폭 실측 확인).
- **px 로 적은 값** = 폭과 무관하게 유지할 실사용 크기 (핵심 본문 · CTA · 메뉴).
- **`calc(N * --s)` 로 남긴 값** = 격자 칸 폭에 묶여 칸과 함께 커져야 하는
  보조 텍스트. 칸을 넘지 않으면서 얻을 수 있는 최대값이다.
- **코드 위치**: 각 화면 CSS 파일 맨 아래 `FINAL MOBILE USABILITY OPTIMIZATION`
  주석 블록. 기존 Visual Master 선언은 지우지 않았고 원래 토큰을 주석으로 남겼다.

### PHASE 1 — MO01~04 · 완료 (2026-09-06)

| 화면 | 조정한 역할 | 유지한 구조 |
|------|-------------|-------------|
| MO01 | menuLabel · body · ctaLabel · svcTitle · svcSub · stdLabel · bandBrand | 4열 서비스 구조 |
| MO02 | menuLabel · eyebrow · body · valTitle · valSub · pvBody · barText · barCtaLabel · ftBrand · ftTagline | 4열 value 구조 |
| MO03 | menuLabel · eyebrow · body · cardName · cardDesc · cardNum · bandHead · bandTagline · bandCtaLabel · bandLabel · footer | 3 x 3 category grid |
| MO04 | menuLabel · eyebrow · body · chip · cardTitle · cardCat · bandHead · bandTagline · bandCtaLabel | 2 x 3 gallery · filter chip |

레이아웃 이동은 텍스트를 담기 위한 최소 조정만: MO01 body top 648→582,
MO02 pvBody 1207→1196 · barText 1340→1332, MO03 eyebrow 138→132 ·
카드 padding 22→14 · 화살표 14→10 · cardName 162→158 · cardDesc 197→193,
MO04 캡션 padding 23→15 · 구분선 240→246 · 화살표 410→418.

터치 영역은 menu · CTA · chip · 카드 화살표에 보이지 않는 `::after` hit area만
추가했다 (시각적 크기 변화 없음).

**구조적 상한**: 4열 / 3x3 / 2x3 격자에 묶인 보조 텍스트 (MO01 svcSub,
MO02 valSub, MO03 cardDesc, MO04 chip · cardCat) 는 430px 에서 9.2~11.6px 가
격자를 유지한 채 얻을 수 있는 최대값이다. 12px 이상은 격자 자체를 바꿔야 하므로
적용하지 않는다 (격자 변경은 금지 항목).

### PHASE 2 — MO05~08 · 완료 (2026-09-06)

PHASE 1 과 동일한 계약: 화면별 연속 override, breakpoint 없음, JUMP 0건.

| 화면 | 조정한 역할 | 유지한 구조 |
|------|-------------|-------------|
| MO05 | menuLabel · back · catNum · catName · body · featTitle · featSub · recRow · moreLink · artCap · bandQuote 하단 · ctaLabel · supLabel | 4열 feature panel · 3-up 샘플 행 |
| MO06 | menuLabel · back · crumb · body · featLabel · specRow · pointRow · prevMore · pageCap · ctaLabel · supLabel | 5-up preview 행 · 좌우 사양 패널 |
| MO07 | menuLabel · eyebrow · body · chip · badge · cardTitle · bandTagline · bandCtaLabel · bandLabel | 2 x 3 그리드 · filter chip |
| MO08 | menuLabel · eyebrow · body · aside · asideLabel · featTitle · featSub · bandCheckRow · sigMore · thumbNote · promiseBy · ctaLabel · supLabel | 4열 value panel · DESIGN / SYSTEM / OPERATION · 5-up 썸네일 |

레이아웃 이동은 텍스트를 담기 위한 최소 조정만:
MO05 moreLink left 823→748 · artCap left 27→18,
MO06 feature 행 481→514 (커진 본문을 피함) · prevMore left 817→768,
MO08 sigMore left 833→760.

**사실성 정책 유지**: MO06 "제작 기간 : 상담 후 안내", MO08 Promise 문구와
"— 비즈네스타의 약속 —" 는 건드리지 않았다.

**구조적 상한 (430px 기준)**: MO05 4열 설명 10.92px · 3-up 캡션 8.82px,
MO06 5열 라벨 10.08px · 5-up 캡션 10.08px, MO07 chip 9.24px,
MO08 4열 설명 10.08px · 썸네일 캡션 8.4px · 오른쪽 세로 칼럼(aside) 9.24px.
모두 격자/칸 폭이 만드는 상한이며, 더 키우려면 격자를 바꿔야 하므로 적용하지 않는다.

**예외 1건**: MO08 `.aside` 는 기존 x1.18 floor 값(22.42)이 스테이지를 넘어가고
있었다. 넘지 않는 최대값 22 로 낮췄기 때문에 400px 이하에서만 이전보다 0.17px
작다. 그 외 1,288 개 역할/폭 조합은 모두 이전과 같거나 크다.

### PHASE 2 FINAL — MO08 캐러셀 화살표 최소 보정 (2026-09-07)

원본 시안 `BN_MO_08` 의 다음 화살표는 흰 원 32 unit 이 스테이지 오른쪽 끝
(x 991~1023 / y 997~1029) 에 붙어 있다. 구현은 같은 화살표를 44 unit 원으로
left 944 / top 989 에 두어 5번째 썸네일 가운데를 덮고 있었고, 시안 자체의
화살표가 `sig-05` 썸네일 이미지 안에 인쇄되어 있어 원이 두 개로 보였다.

```css
.sigNext { left: calc(980 * var(--s)); top: calc(991 * var(--s)); }  /* was 944 / 989 */
```

크기 · 스타일 · 썸네일 폭 · crop · 간격 · 캐러셀 구조 · 섹션 높이는 그대로 두고
오른쪽 여백 방향으로만 옮겼다. 썸네일을 덮는 면적은 51% → 28% 로 줄고, 시안에
인쇄된 화살표와 정확히 겹친다. 같이 조정한 것은 `.sigMore` left 760→728
(확대된 링크가 360px 에서 넘치던 것) 뿐이다.

이 보정 후 MO05~08 은 430 / 428 / 412 / 401 / 400 / 390 / 375 / 360 의
8개 폭 × 4화면 = **32/32 검사 모두 이상 0건**. PHASE 2 를 FINAL 로 확정한다.

### PHASE 3 — MO09~12 · 완료 (2026-09-07)

PHASE 1 / 2 와 동일한 계약: 화면별 연속 override, breakpoint 없음, 격자 유지.

| 화면 | 조정한 역할 | 유지한 구조 |
|------|-------------|-------------|
| MO09 | menuLabel · eyebrow · body · aside · secMore · secMore2 · cardTitle · cardDesc · bandBody · thumbTitle · thumbDesc · ctaLabel · supLabel | 4개 콘텐츠 서비스 카드 · 5개 예시 썸네일 |
| MO10 | menuLabel · eyebrow · body · secMore · secMore2 · cardTitle · cardDesc · screenCap · bandCtaLabel · supLabel | 5개 기능 카드 · 5개 관리자 미리보기 |
| MO11 | menuLabel · eyebrow · body · aside · secMore · secMore2 · stepTitle · stepDesc · recTitle · recWant · prQuote · prBy · ctaLabel · supLabel | 5단계 프로세스 행 · 4개 추천 카드 |
| MO12 | menuLabel · eyebrow · body · 행 변수 `--df` / `--cf` · bandBody · bandCtaLabel · supLabel | 2 / 2 / 3 비대칭 카드 그리드 · 행별 타입 스케일 |

레이아웃 이동은 커진 오른쪽 정렬 링크가 넘치지 않게 하는 최소 조정만:
MO09 secMore left 858→800 · secMore2 803→760,
MO10 secMore 898→830 · secMore2 844→800,
MO11 secMore 859→800 · secMore2 850→790,
MO11 stepTitle margin 30→22 · stepDesc margin 14→10 · recTitle 22→18 · recWant 20→14.

**MO12 행별 스케일 유지**: 공통 크기로 합치지 않고 행 변수의 값만 올렸다.
`.card { --df: 24; --cf: 22 }` / `.r3 { --df: 22; --cf: 20 }`.
430px 에서 1행 설명 10.08px vs 3행 설명 9.24px 로 행 간 차이가 그대로 남는다.

**사실성 정책 유지**: MO10 대시보드 숫자는 미리보기 이미지(DEMO artwork) 안에만
있고 HTML 지표로 옮기지 않았다. MO11 은 고객 후기 표현 없이 원칙 문구
"— 비즈네스타의 맞춤 설계 원칙 —" 와 중립 상담 공간 이미지를 유지한다.
MO12 는 SNS 자동화 · 발행 메커니즘을 노출하지 않는 현재 문구를 유지한다.

**주요 Before → After (430px, CSS px)**

| 화면 | 역할 | Before | After |
|------|------|--------|-------|
| MO09 | 본문 body | 9.45 | 13.50 |
| MO09 | 카드 제목 / 설명 | 9.45 / 8.31 | 10.92 / 10.50 |
| MO09 | 썸네일 제목 / 설명 | 7.56 / 6.72 | 8.82 / 8.61 |
| MO09 | 메뉴 · CTA | 8.61 / 13.02 | 13.00 / 14.00 |
| MO10 | 본문 body | 8.82 | 13.50 |
| MO10 | 기능 카드 제목 / 설명 | 9.24 / 7.14 | 10.08 / 9.24 |
| MO10 | 미리보기 캡션 | 7.56 | 9.66 |
| MO10 | 메뉴 · 밴드 CTA | 8.61 / 10.92 | 13.00 / 13.00 |
| MO11 | 본문 body | 8.82 | 13.50 |
| MO11 | 프로세스 제목 / 설명 | 8.40 / 6.72 | 9.66 / 8.40 |
| MO11 | 추천 카드 제목 / 문장 | 7.98 / 6.72 | 9.24 / 8.40 |
| MO11 | 원칙 인용 / 서명 | 9.24 / 7.56 | 10.50 / 8.61 |
| MO12 | 본문 body | 8.19 | 13.50 |
| MO12 | 카드 설명 1행 / 3행 | 7.56 / 6.93 | 10.08 / 9.24 |
| MO12 | 카드 자세히 보기 1행 / 3행 | 6.72 / 6.09 | 9.24 / 8.40 |
| MO12 | 메뉴 · 밴드 CTA | 7.98 / 7.98 | 13.00 / 13.00 |

**검증**: 8개 폭 × 4화면 = 32 검사 중 31 이상 0건.
남은 1건은 MO11 360px 에서 `.chev` 와 `.stepIcon` 사이 여유가 0.5px 인 것으로,
override 에 두 역할을 건드리는 규칙이 0개인 기존 상태 그대로다.
JUMP 0건 / 1,491 개 폭 전이 모두 단조 / 401→400 불연속 0건 /
1,704 개 역할·폭 조합 중 작아진 것 0개.

**구조적 상한 (430px 기준)**: MO09 썸네일 설명 8.61px, MO10 기능 카드 설명
9.24px, MO11 프로세스 설명 8.40px, MO12 3행 카드 설명 9.24px 은 각 격자 칸
폭이 만드는 상한이다. 더 키우려면 격자를 바꿔야 하므로 적용하지 않는다.

### 회귀 검증 방법 (PHASE 3 기준)

픽셀 캡처는 사진 영역에서 실행마다 흔들리므로 (동일 빌드 두 번 캡처 시 최대
1,504px 차이 관측), PHASE 3 회귀는 **DOM 기하 비교**로 확인했다.
override 를 제거한 빌드와 적용한 빌드를 각각 production build 로 만들어
32화면 전 요소의 위치 · 크기 · font-size · line-height · letter-spacing ·
word-spacing · color · background · opacity · transform 을 해시 비교했다.

- 보호 대상 28화면 (PC01~16 · MO01~08 · MO13~16): **28/28 해시 일치 = 변경 0**
- MO09~12: 폰트 커진 요소 222개 · 작아진 요소 **0개**

### PHASE 4 — MO13~16 · 완료 (2026-09-07)

PHASE 1~3 과 동일한 계약: 화면별 연속 override, breakpoint 없음, 구조 유지.
MO13~16 에는 아직 예전 `@media (max-width: 400px)` readability floor 블록이
남아 있었다. 그 블록은 (1) 400px 에서 글자가 갑자기 커지는 401→400 불연속을
만들고 (2) 커진 값이 카드/스텝 폭을 넘어 MO13 featText 3건, MO14 step 8건의
겹침을 ≤400px 에서 발생시키고 있었다. PHASE 4 는 이 블록을 연속 override 로
대체하면서 두 문제를 함께 해결한다.

| 화면 | 조정한 역할 | 유지한 구조 |
|------|-------------|-------------|
| MO13 | menuLabel · eyebrow · body · secSub · secMore · planDesc · price · badge · featText · planCta · bandSub · bandCtaLabel · supLabel | 4개 plan card · feature row · 추천 배지 · support row |
| MO14 | menuLabel · eyebrow · body · secSub · secMore · stepNum · stepTitle · stepDesc · bandItem · bandQuote · tesQuote · tesBy · ctaLabel · supLabel | 6단계 process row · 원형 step · 연결선 · navy 밴드 · 원칙 패널 |
| MO15 | menuLabel · eyebrow · body · brEyebrow · brBody · brItem · vsEyebrow · vsBody · vsQuote · clSub · caption · ctaLabel · supLabel | hero · brand story · 3개 가치 · vision band · closing |
| MO16 | menuLabel · eyebrow · body · cardTitle · cardValue · cardLines · cardNotes · cardBtn · formSub · field · consentLabel · consentMore · submit · bandSub · supLabel | 4개 상담 카드 · form UI 4필드 + 동의 + 버튼 · closing band |

레이아웃 이동은 커진 텍스트를 담기 위한 최소 조정만:
MO13 hero body 372→366 · heroRule 491→503 · heroLabel 482→494 ·
badge padding 13→10 · feature row padding 17→12 / 아이콘 간격 10→7,
MO14 hero body 347→341 · stepTitle margin 9→7 · stepDesc margin 15→11,
MO16 입력 높이 44→52 · f3 871→875 · f4 924→933 · counter 1008→1018 ·
consent 1055→1060 · submit 1092→1090(높이 55→58).

**사실성 정책 유지**: MO13 은 숫자 가격을 복원하지 않고 "상담 후 안내" /
"맞춤 견적" / "추천" / "표준 제작 플랜" / "제작 후 관리 지원" 을 유지하며 관리
개월 수를 추가하지 않았다. MO14 는 제작 소요 기간을 넣지 않고 고객 후기 표현
없이 "— 비즈네스타의 제작 원칙 —" 을 유지한다. MO15 는 대표 인물 사진 슬롯이
없는 공식 시안 그대로이며 직원 수 · 사무실 · 설립일 · 고객 수 · 수상 · 파트너 ·
팀 규모를 만들지 않았다. MO16 은 전화번호 · 이메일 · 주소 · 영업시간
placeholder 를 되살리지 않고 "상담 신청 후 안내" / "상담은 온라인으로
진행됩니다" / "상담 신청하기" / "상담 가능 시간은 상담 시 안내드립니다" 를
유지하며, form 은 UI 구조까지만이고 submit handler · DB · 메일 · Webhook 은
만들지 않았다.

**주요 Before → After (430px, CSS px)**

| 화면 | 역할 | Before | After |
|------|------|--------|-------|
| MO13 | 본문 body | 9.24 | 13.50 |
| MO13 | plan 설명 / 가격 라벨 | 7.77 / 11.76 | 9.24 / 12.60 |
| MO13 | feature 행 / plan CTA | 7.14 / 7.98 | 8.19 / 10.50 |
| MO13 | 메뉴 · 밴드 CTA | 8.82 / 9.66 | 13.00 / 13.00 |
| MO14 | 본문 body | 8.48 | 13.50 |
| MO14 | step 제목 / step 설명 | 9.03 / 7.35 | 10.08 / 7.77 |
| MO14 | 밴드 문장 / 원칙 인용 | 7.14 / 7.77 | 8.82 / 10.50 |
| MO14 | 메뉴 · CTA | 8.82 / 11.76 | 13.00 / 14.00 |
| MO15 | 본문 body | 8.82 | 13.50 |
| MO15 | 브랜드 스토리 / 가치 항목 | 8.65 / 7.98 | 12.50 / 9.87 |
| MO15 | vision 본문 / closing | 7.98 / 7.98 | 11.34 / 11.76 |
| MO15 | 메뉴 · CTA | 8.82 / 11.76 | 13.00 / 14.00 |
| MO16 | 본문 body | 9.24 | 13.50 |
| MO16 | 카드 제목 / 카드 값 | 9.87 / 8.82 | 12.60 / 11.34 |
| MO16 | 폼 입력 글자 / 동의 문구 | 7.98 / 7.35 | 11.50 / 10.08 |
| MO16 | 메뉴 · 카드 버튼 | 8.82 / 7.56 | 13.00 / 10.08 |

**검증**: 8개 폭 × 4화면 = **32/32 검사 이상 0건**.
JUMP 0건 / 401→400 불연속 0건 / 실뷰포트 430·390·375·360 overflow 0 ·
가로 스크롤 없음. 1,816 개 역할·폭 조합 중 작아진 것은 아래 2건뿐이다.

**의도적으로 이전보다 작은 2건 (겹침 수정)**: ≤400px 에서만 해당한다.
MO13 `featText` (7.05→6.86 @360) 와 MO14 `stepDesc` (7.26→6.50 @360) 는
예전 floor 값이 카드·스텝 폭을 넘어 실제로 겹치고 있었다. 겹치지 않는 최대값
으로 낮췄고, 430px 에서는 둘 다 이전보다 크다 (7.14→8.19 / 7.35→7.77).

**MO16 form usability**: 입력 높이 44→52 unit (430px 기준 18.5→21.8px,
textarea 47px), 동의 checkbox 를 감싸는 label 의 터치 영역 30px,
submit 의 터치 영역 42.3px (표시 크기 24.3px 유지), 카드 버튼 35.6px,
메뉴 50.1px. label/input · field 간 겹침 0건.

**구조적 상한 (430px 기준)**: MO13 feature 행 8.19px (4개 plan card 폭),
MO14 step 설명 7.77px (6단계 행 간격), MO15 브랜드 스토리 12.5px 이후 가치
항목 9.87px (3분할 칸 폭), MO16 카드 설명 10.5px (232 unit 카드 폭).
입력 높이 21.8px 는 스테이지 자체가 1024×1536 아트워크를 430px 로 축소하는
구조에서 나오는 상한이며, 44px 터치 규격은 이 스테이지 안에서는 불가능하다.

### 전체 진행 상태 — 사용자 승인 완료 (2026-09-07)

| PHASE | 대상 | 상태 |
|-------|------|------|
| PHASE 1 | MO01~04 | 완료 |
| PHASE 2 / FINAL | MO05~08 | 완료 |
| PHASE 3 | MO09~12 | 완료 |
| PHASE 4 | MO13~16 | 완료 |

사용자 최종 승인(2026-09-07)에 따라 아래 상태를 확정한다.

    FINAL MOBILE USABILITY OPTIMIZATION
    MO01~16
    COMPLETE

PC01~16 과 MO01~16 은 OFFICIAL VISUAL MASTER / FINAL LOCK 상태를 그대로
유지한다. 다음 단계는 NAVIGATION / CTA / LINK / INQUIRY FLOW 다.

## 4-B. NAVIGATION / CTA / LINK / INQUIRY FLOW — PHASE 1 (2026-09-07)

화면을 새로 만들거나 고치는 단계가 아니라, 완성된 32개 화면을 실제로 이동할 수
있는 사이트로 연결하는 단계다. 32개 화면의 DOM 기하 · 타이포는 **32/32 해시
일치 = 변경 0** 으로 확인했다.

### 착수 시점의 상태

실제 사용자 route 는 `/`(PC01 단독) 와 `/review/*` 뿐이었고, 화면 데이터에
선언된 179개 링크(`/design`, `/price`, `/contact` …)는 **전부 존재하지 않는
경로**였다. 모바일 16화면의 햄버거 버튼은 아무 동작이 없었고, PC 쪽에는
`href="#"` 링크 20여 개와 대상 없는 `#next` 앵커가 있었다.

### ROUTE MAP (src/data/navigation.ts 에 기록)

| route | 화면 | route | 화면 |
|---|---|---|---|
| `/` | 01 HERO | `/content` | 09 CONTENT GROWTH |
| `/brand` | 02 BRAND MESSAGE | `/admin-system` | 10 ADMIN SYSTEM |
| `/category` | 03 CATEGORY | `/solution` | 11 CUSTOM SOLUTION |
| `/design` | 04 DESIGN SHOWROOM | `/service` | 12 SERVICE SELECT |
| `/category/[slug]` | 05 CATEGORY DETAIL | `/price` | 13 PRICE |
| `/design/[slug]` | 06 DESIGN DETAIL | `/process` | 14 PROCESS |
| `/design/new` | 07 NEW DESIGN | `/about` | 15 ABOUT |
| `/portfolio` | 08 SIGNATURE | `/contact` | 16 CONTACT |

`/privacy` 는 상담 동의 링크가 가리키는 보조 페이지로, 방침 본문은 사업자
정보가 확정된 뒤에 넣는다. 각 route 는 1024px 를 기준으로 PC 시안과 MOBILE
시안을 바꿔 보여준다(`components/site/Screen`). 시안 자체는 건드리지 않는다.

### 메뉴

PC 헤더의 7개 메뉴는 원래 각 화면 데이터에 있던 항목이며 그대로 쓴다. 모바일
시안에는 메뉴 항목 목록이 없고 햄버거 버튼만 있어서, 버튼을 누르면 같은 7개
항목을 담은 오버레이가 열리도록 했다(`components/site/MobileMenu`). 닫혀
있는 동안에는 DOM 이 늘지 않아 32개 화면의 렌더링 결과가 이전과 같다.

### CTA 연결 원칙

1. 목적지는 문구의 뜻을 따른다 — 디자인 → 쇼룸/상세, 서비스 → 서비스 선택,
   관리 시스템 → ADMIN SYSTEM, 콘텐츠 → CONTENT GROWTH, 가격 → PRICE,
   상담 → CONTACT.
2. 자기 페이지를 가리키던 "더보기" 는 같은 페이지 anchor 로 바꿨다
   (`#plans`, `#features`, `#preview`, `#examples`, `#process`,
   `#services`, `#form`). anchor 대상은 stage 안에서 실제로 그 자리에 놓인
   요소에 붙였다 — section 은 높이가 0 이라 스크롤이 맨 위로 가버린다.
3. 상세 화면이 없는 카드(서비스 7종 · 플랜 4종)는 그 서비스를 실제로 설명하는
   화면으로 보내거나, 무엇을 보고 있었는지를 달고 상담으로 보낸다.
4. 같은 뜻의 CTA 는 PC 와 모바일이 같은 곳으로 간다 (자동 검사 통과).

### 상담 맥락 (저장은 아직 하지 않는다)

상담 진입 링크는 `?source=` 로 어디에서 왔는지를, 필요하면
`category` / `design` / `service` / `plan` 을 함께 넘긴다. `/contact` 는 이
값을 폼 안 hidden field 로 실어 두기만 한다. 화면에는 아무것도 나타나지 않고,
다음 단계의 inquiry 저장에서 그대로 쓴다.

### 이 단계에서 하지 않은 것

Supabase · DB · Auth · Admin · 이메일 · Webhook · SNS 자동화 · 결제 ·
실제 문의 저장 · 관리자 알림. 상담 폼은 UI 와 입력 동작까지만이고 제출은
아무 일도 하지 않는다.

### 남은 사항

- `/brand`, `/process` 는 공식 시안 안에 이 페이지로 들어가는 링크가 없다.
  메뉴 추가 여부는 사용자 결정이 필요하다. `/design/new` 는 PC 쇼룸에서만
  들어갈 수 있고 모바일에는 해당 CTA 가 없다.
- 카테고리별 · 디자인별 실제 콘텐츠 데이터가 아직 없어서
  `/category/[slug]` 와 `/design/[slug]` 는 어떤 slug 로 들어와도 공식
  상세 화면을 연다. `/design?filter=` 값도 전달만 되고 필터링은 아직 없다.
- 카카오톡 채널 · 전화 · 이메일 등 실제 외부 채널 URL 은 만들지 않았다.
- 모바일 상담 폼의 입력 높이는 430px 에서 21.8px 다. 스테이지가 1024×1536
  아트워크를 축소하는 구조라 44px 터치 규격을 이 안에서 만들 수 없다.
  실제 기능 단계에서 폼 영역만 real-size 로 분리하는 것을 권장한다.

## 4-C. INQUIRY FORM REAL IMPLEMENTATION — PHASE 1 (2026-09-07)

사용자 승인(B안)에 따라 CONTACT 의 **상담 폼 영역만** real-size 로 분리했다.
CONTACT 화면의 hero · 상담 채널 카드 · 마무리 밴드 · support · 방문 상담 안내 ·
색 · 사진 · 타이포 위계는 그대로다. 저장 · 발송 · Webhook 은 아직 없다.

### 왜 분리했는가

1024x1536 아트워크가 430px 로 축소되면 상담 폼의 입력 높이가 21.8px,
체크박스가 10.9px 가 된다. 44px 규격을 스테이지 안에서 만들려면 컨트롤 하나에
105 unit 이 필요한데 폼 칼럼의 세로 여유는 330 unit 뿐이라 구조적으로 불가능하다.

### 모바일 — 화면을 두 장으로 나누고 사이에 real-size 폼

`Mo16` 에 `slice` 옵션을 넣었다. CONTACT route 에서만 쓰고, 값을 주지 않으면
(`/review/mo-16` 포함) 지금까지와 완전히 같은 한 장이 나온다.

| 조각 | 아트워크 범위 | 내용 |
|---|---|---|
| `slice="top"` | y 0~778 unit | hero + 상담 채널 카드 4개 |
| real-size 폼 | — | 실제 CSS px 로 만든 상담 폼 |
| `slice="bottom"` | y 1160~1536 unit | 마무리 밴드 + support |

폼 위의 사진 띠는 시안의 상담 패널 사진에서 잘라 썼다
(`/assets/mo16/form-banner.*`). 아트워크가 그려 놓은 가짜 입력칸과 철자가
흐트러진 장식 스크립트가 실제 크기에서는 읽히기 때문에 그 부분을 뺀 영역만
쓴다. 원본 `form.jpg` 는 그대로 두었다.

### PC — 패널 안에서 최대치로

PC16 의 폼은 아트워크 패널(x 43~830) 안에 있고 오른쪽에 방문 상담 정보와 안내
패널이 같은 높이로 붙어 있어 잘라낼 수 없다. 그래서 패널 안쪽 여백을 재배치해
컨트롤만 키웠다. 패널 · 제목 · 설명 · 사진 · 오른쪽 칼럼 좌표는 그대로다.

| | 이전 (1440) | 이후 (1440) | 이후 (1280) |
|---|---|---|---|
| 입력 높이 | 31.9px | **41.3px** | 36.7px |
| 입력 글자 | 12.56px | **14.06px** | 12.5px |
| 체크박스 | 12.2px | **16.9px** | 15.0px |
| 버튼 높이 | 34.7px | **39.4px** | 35.0px |

### 실제 크기 (모바일 real-size 폼)

430 / 412 / 390 / 375 / 360px 어디서나 입력 **48px** · 글자 **16px**
(16px 미만이면 iOS 가 포커스 때 화면을 확대한다) · textarea 148px ·
체크박스 22px(터치 영역 44px) · 버튼 52px · 라벨 14px.

### 데이터 모델

`src/lib/inquiry.ts` 하나를 PC 와 모바일이 같이 쓴다. 사용자가 입력하는 값과
시스템이 붙이는 맥락을 나눠 두었다.

| 사용자 입력 | 시스템 맥락 |
|---|---|
| name · contact · email(PC 만, 선택) · service · message · privacyConsent | consultationSource · selectedCategory · selectedDesign · selectedService · selectedPlan · screen · submittedPath · createdAt |

공식 시안에 없는 입력 항목은 만들지 않았다. 모바일 시안에는 이메일 칸이 없어
모바일 폼에도 없다.

### 검증

필수값 누락 · 연락 가능한 번호 · 이메일 형식(PC) · 동의 누락을 inline 으로
알린다. alert 은 쓰지 않는다. 첫 오류 항목으로 포커스가 이동하고
`aria-invalid` 와 `aria-describedby` 가 붙는다.

### 제출

`preventDefault` 로 새로고침을 막고 검증만 한다. **접수된 것처럼 보이는 성공
안내를 띄우지 않는다.** 개발 확인용 상태는 폼의 `data-ready` 속성뿐이라 화면에
아무것도 나타나지 않는다.

### 이 단계에서 하지 않은 것

Supabase · DB · Auth · Admin · 이메일 발송 · Webhook · 실제 문의 저장 ·
관리자 알림. 개인정보처리방침 본문(가짜 법률 문구를 만들지 않는다) ·
전화번호 · 이메일 · 주소 · 상담시간 · 사업자정보 · 카카오톡/SNS URL.

### 회귀

32개 화면 DOM 기하 · 타이포 해시 비교에서 **31/32 완전 일치**. 유일한 차이인
PC16 은 **폼 영역 27건, 폼 밖 0건** 이다. MO16 은 `/review` 에서 slice 를
주지 않으므로 완전히 같다. PHASE 1~4 usability override 와 navigation/CTA/link
는 건드리지 않았다.

## 4-D. SUPABASE INQUIRY DB / ACTUAL FORM SUBMISSION — PHASE 2 (2026-09-07)

기능 구현 단계이며 화면은 바꾸지 않았다. 기술 문서는 `docs/INQUIRY.md` 에 있다.

- CONTACT 상담 폼이 Server Action 을 거쳐 Supabase `inquiries` 테이블에
  저장되도록 연결했다. 브라우저가 Supabase 를 직접 호출하지 않는다.
- 서버 재검증 · honeypot · rate limit · 성공/실패 상태 표시 · 중복 제출 방지.
- 스키마와 RLS 는 `supabase/migrations/0001_inquiries.sql` 하나로 재현된다.
- 화면 변화: PC16 폼에 **보이지 않는 honeypot 칸 3개**(화면 밖 x -9999)가
  늘었고, 그 밖의 요소는 위치 · 크기 · 타이포 모두 그대로다. MO16 은 변화 0.
  나머지 30개 화면도 변화 0.
- 성공/실패 안내는 폼 영역 안에서만 나타나며, 보장할 수 없는 표현
  (즉시 연락 · 몇 분 내 · 오늘 연락 · 100% 회신)은 쓰지 않는다.
- 실제 Supabase 프로젝트에 연결해 Preview 에서 검증 완료(2026-09-07):
  FLOW A~E 저장 5/5 성공, anon 은 INSERT 만 가능하고 SELECT · UPDATE · DELETE
  거부, 동의하지 않은 문의 거부. 검증 상세는 `docs/INQUIRY.md` 8절.
- 관리자 문의관리 · 메일 · Webhook · Auth · 결제는 시작하지 않았다.

## 4-E. 공개 준비 — BUSINESS / PRIVACY / SEO (2026-09-07)

기능·메타데이터 단계이며 32개 화면은 건드리지 않았다 (DOM 기하·타이포 32/32 일치).

- 사업자 정보 · 연락처는 여전히 어디에도 표시하지 않는다. 화면은 전부 안전
  문구("추후 안내 예정" · "준비 중" · "상담 신청 후 안내")를 유지한다.
- `/privacy` 를 실제 방침 초안으로 채웠다. 본문은 코드와 DB 가 실제로 수집하는
  것만 적었고, 확정이 필요한 값은 "확정 후 안내 예정" 으로 표시했다.
- SEO 기반: route 별 title / description / canonical, Open Graph · Twitter 카드,
  sitemap(공개 route 15개, `/review/*` 제외), robots(Production 에서만 허용).
- 공식 로고에서 잘라낸 파비콘과 OG 카드를 넣었다. 로고를 다시 그리지 않았다.
- `<main>` 랜드마크를 추가했다 (화면 변화 없음).
- Preview 는 계속 noindex 다. Production 배포·도메인·Alias 는 건드리지 않았다.
- 공개 전 체크리스트는 `docs/LAUNCH.md`.

## 4-F. SERVICE 섹션 이동 요소 정리 (2026-09-07, 사용자 지시)

PC12 · MO12 두 화면만 바뀌었다. 나머지 30개 화면은 DOM 기하·타이포 해시가
그대로다 (`imgtool/cmp32.js p8after.json p9after.json` → 달라진 화면 2/32).

- PC12 우측 상단 "전체 서비스 보기" 링크를 없앴다. 자기 페이지(`/service`)를
  가리키던 링크였다.
- PC12 · MO12 카드마다 반복되던 "자세히 보기" 버튼을 없앴다.
- 상세 페이지 연결은 유지한다. 지금까지 보이지 않는 보조 링크였던 카드 전체
  탭 영역(`.tapArea`)을 그 카드의 정식 링크로 승격시켰다 — `aria-hidden` ·
  `tabIndex={-1}` 을 떼고 `aria-label`("서비스명 자세히 보기")을 붙여
  스크린리더 이름과 키보드 초점을 갖게 했다. 목적지는 이전 화살표 링크와 같다.
- PC12 은 버튼(273~302 unit)을 없애면 카드 아래 51 unit 이 빈다. 카드 크기 ·
  위치 · 여백은 그대로 두고, 이미 있던 카드 이미지의 높이만 112 → 163 unit 로
  늘려 카드 아래 끝까지 닿게 했다 (`.card` 는 `overflow: hidden`). MO12 의
  버튼은 절대 배치라 없애도 빈자리가 생기지 않아 CSS 를 건드리지 않았다.
- 카드 번호 · 아이콘 · 서비스명 · 설명 · 색 · 폰트 · 카드 간격 · 전체 레이아웃은
  좌표까지 그대로다. 하단 "어떤 서비스가 필요하실지 고민되시나요? / 맞춤 상담
  신청하기"(PC12), "지금 문의하기"(MO12) 밴드도 그대로다.
- 검증: 카드 가운데를 실제 마우스로 눌러 PC 6개 · 모바일 7개 모두 이동 확인
  (로컬 · Preview). 내부 링크 전수 검사 404 · dead 0.

## 4-G. 반응형 겹침 · 주소 넘침 · 지도 (2026-09-07, 사용자 지시)

PC12 · PC16 두 화면만 바뀌었다 (32화면 DOM 비교: 달라진 화면 2/32).

### 서브셋 글꼴에 빠진 글자 — 두 문제의 공통 원인

`public/fonts/pretendard-subset.woff2` 는 `src/**` 에 있는 글자만 담는다.
연락처를 넣은 뒤로 다시 만들지 않아 **숲 · 풍 · 층** 세 글자가 빠져 있었고,
그 세 글자만 시스템 글꼴로 그려졌다. 주소가 설계보다 넓어진 이유다.
`node scripts/build-font.mjs` 로 다시 만들었다 (737자). 문구·글자 크기는
그대로이고, 빠진 글자가 있는지는 브라우저에서 폭을 비교해 확인했다.

### PC12 SERVICE — 제목 · 라인 · 설명 겹침

원인은 화면 폭이 아니라 **글꼴이었다**. 셋이 각각 절대좌표(제목 56, 라인
405, 설명 971)로 고정돼 있었는데, 제목과 라인 사이 여백이 시안에서 이미
17~23px 뿐이라 글자가 조금만 넓어지면 파고든다. 웹폰트는 `font-display:
swap` 이라 파일이 도착하기 전에는 시스템 글꼴로 먼저 그려지고, 그때 제목이
**모든 폭에서** 라인을 27~41px 침범한다(측정치). 폰트를 막고 재현했다.

고친 방법: 셋을 `.svcHead` 한 행으로 묶고 가운데 라인이 남는 폭을 흡수하게
했다. 시안 좌표는 그대로 재현되고(라인 앞뒤 여백 18.3u · 25u), 글자가 87%
넓어질 때까지 겹치지 않는다. 글자 크기 · 자간은 건드리지 않았다.
카드 6개와 하단 상담 CTA 는 그대로다.

### PC16 LOCATION — 주소가 카드 밖으로

주소가 카드(399u) 오른쪽으로 넘쳤다. 4행이 절대좌표 + `white-space: nowrap`
이라 긴 글이 그대로 흘러나갔다. 목록을 카드 안쪽 폭(359u) · 안쪽 높이
(135.5u)를 가진 세로 flex 로 바꾸고 `justify-content: space-between` 을 줬다.
한 줄씩 들어갈 때는 간격이 시안과 같은 36.5u 이고, 주소가 두 줄이 되면 남은
여백에서 알아서 좁혀진다. 글자 크기 · 아이콘 · 아이콘과 글자 사이 18u 는
그대로다. 아이콘은 첫 줄 한가운데에 맞췄다(오차 0.8px 이하).

### PC16 LOCATION — 지도

`지도는 준비 중입니다` 자리표시를 `LocationMap` 컴포넌트로 바꿨다.

- 카카오 지도 JavaScript 키(`NEXT_PUBLIC_KAKAO_MAP_KEY`)가 있으면 확정된
  주소를 지오코딩해 그 좌표에 지도 · 마커 · 확대/축소 컨트롤을 그린다.
  좌표는 코드에 적지 않는다 — 임의 좌표를 만들지 않기 위해서다.
- 키가 없거나 주소를 못 찾으면 지도를 켜지 않는다. 가짜 지도를 넣지 않는다.
- 어느 쪽이든 `카카오맵에서 보기` 링크는 항상 있다. 실제로 열어 주소가
  잡히는 것을 확인한 형식이다(`map.kakao.com/link/search/…`, 결과 화면에
  길찾기 버튼 포함). 좌표를 알아낸 경우에만 `길찾기` 링크가 하나 더 붙는다.
- 상자 크기 · 위치 · 모서리는 시안 그대로(399×137u)다.
- 모바일 시안(MO16)에는 지도 자리가 없어 아직 넣지 않았다 — 넣으려면 모바일
  화면 구조를 바꿔야 해서 사용자 판단이 필요하다.

## 4-H. DESIGN SHOWROOM 작업 — 화면 변경분 원복 (2026-09-08, 사용자 지시)

2026-09-07 에 /design 화면(PC04 · MO04)을 8개 공식 카테고리 쇼룸으로 바꿨으나,
승인된 시안이 바뀌어 사용자 지시로 **화면 변경분만 원복**했다.

원복한 파일 9개: `data/pc04.ts`, `pc04/Pc04.tsx`, `pc04/Pc04.module.css`,
`mo04/Mo04.tsx`, `mo04/Mo04.module.css`, `pc07/Pc07.tsx`, `mo07/Mo07.tsx`,
`app/sitemap.ts`, `app/design/[slug]/page.tsx`.
(`data/mo04.ts` 는 애초에 건드리지 않았다.)

검증: 작업 직전 빌드에서 뜬 DOM 기하 · 타이포 기준(p11after)과 **32/32 화면
해시 일치**. 링크도 원래 값 그대로다 — PC04 칩 10개 `/design?filter=…`,
`···` → `/category`, 카드 8개 원래 slug, "더 많은 디자인 보기" →
`/design/new`, 동작하지 않는 페이지 화살표 버튼 2개까지 복구.

남겨둔 것 (어느 화면에서도 링크되지 않아 화면에 영향이 없다):
`public/portfolio/` WebP 129장, `data/showroom.ts`, `components/showroom/`,
`/design/category/[category]` route. 다시 쓸 때를 위해 보존한다.
원본 PNG 86장(`홈페이지 종류` 폴더)도 그대로다.

43개 디자인의 실제 내용 기준 카테고리 재검수 결과(이동 필요 5건 · 검토 2건 ·
보류 2건)는 아직 코드에 반영하지 않았다.

## 4-I. DESIGN 카테고리 → 내부 포트폴리오 연결 (2026-09-08, 사용자 지시)

「입구는 그대로 두고, 문 안에 작품만 넣는다.」 /design 입구(PC04 · MO04)는
복구 상태를 그대로 두고, 카테고리를 누르면 그 안에서 실제 43개 작품이 나온다.

### 공식 카테고리 8개 (유일한 출처: `src/data/showroom.ts`)

| # | id | 공식 표기 |
|---|---|---|
| 01 | corporate | 기업 · 브랜드형 |
| 02 | local | 소상공인 · 매장형 |
| 03 | education | 교육형 |
| 04 | expert | 전문가 · 개인형 |
| 05 | beauty | 뷰티 · 미용형 |
| 06 | medical | 병원 · 의료형 |
| 07 | franchise | 프랜차이즈형 |
| 08 | shopping | 쇼핑 · 판매형 |

`전체 보기`(all)는 9번째 카테고리가 아니라 8개를 모두 보는 필터다.
랜딩페이지 · DB수집 · 채용 · 포트폴리오 등은 1차 카테고리가 아니며,
`tags / purpose / functions` 자리를 비워 두었다(확정 전까지 채우지 않는다).

### 입구에서 바꾼 것 — 표시명과 목적지뿐

- PC04 대표 카드 8장: 표시명을 공식 표기로(실제로 바뀐 것은 `전문가 개인형`
  → `전문가 · 개인형` 하나뿐), 링크를 `/design/category/<id>` 로.
  이미지 · 카드 · 좌표 · 타이포 · 여백은 손대지 않았다.
- PC04 상단 칩 10개: 글자와 좌표 그대로, 목적지만 공식 카테고리로.
  공식 카테고리가 아닌 4개(랜딩페이지형 · DB 수집형 · 채용 · 리크루팅형 ·
  포트폴리오형)는 전체 보기로 보낸다.
- MO04 칩 8개: 글자 · 폭 · 좌표 그대로, 목적지만 연결. 부동산 · 기타는 전체 보기.
- 회귀: 복구 기준선(p13revert) 대비 **31/32 화면 완전 일치**, pc-04 는 위
  글자 하나와 그 글자가 넓어진 만큼(칩 62.6→67.5px, 카드 이름 80.0→86.3px)만
  다르다. 좌우 구분선까지 33 unit 여유가 있어 겹치지 않는다. mo-04 는 100% 동일.

### 남은 문제 (임의로 고치지 않았다 — 사용자 판단 필요)

PC04 상단 칩은 좌표 10개가 못 박혀 있어 **개수를 8개로 줄이거나 뷰티 · 미용형 ·
병원 · 의료형을 추가하면 배치가 달라진다.** 그래서 지금은 6개 카테고리만
상단 칩에서 열리고, 뷰티 · 미용형 · 병원 · 의료형은 대표 카드로만 들어간다.
MO04 칩도 폭이 고정이라 공식 표기로 바꾸면 알약을 넘친다(현재는 시안 문구 유지).

### 안쪽 화면 (새로 만든 화면)

| route | 내용 |
|---|---|
| `/design/category/[category]` | 카테고리별 목록 (all 포함 9개, 12개씩) |
| `/design/portfolio/[id]` | 작품 상세 — PC + 모바일 한 쌍, 원본 비율 유지 |

`/design/[slug]`(PC06 · MO06 시안)은 건드리지 않았다. 실제 작품 상세를 별도
route 로 분리한 이유다.

## 4-J. NEW DESIGN(PC07 · MO07) 카테고리 연결 (2026-09-08, 사용자 지시)

화면은 그대로 두고 **카드 순서 · 카테고리 표기 · 목적지**만 바꿨다.

- PC07 노출 순서: 기업 · 브랜드형 → 뷰티 · 미용형 → 교육형 → 소상공인 · 매장형.
  지정 순서(기업 → 전문가 → 뷰티 → 쇼핑) 중 **이 화면에 있는 작품만** 앞으로
  당겼다. 이 화면의 아트워크는 4장(TRUST · BEAUTY · LEARN · CAFE NESTA)뿐이라
  전문가 · 개인형 · 쇼핑 · 판매형 카드는 존재하지 않는다. 이미지를 만들거나
  바꾸지 않았다.
- PC07 은 3번 자리만 폭이 353 unit 이고 그 자리 이미지도 353 이라, 353 짜리
  카드(교육형)를 3번 자리에 그대로 두어 **이미지가 다른 폭으로 잘리지 않게**
  했다. 나머지 세 자리는 폭이 같아 순서만 바뀐다.
- MO07 노출 순서: 기업 · 브랜드형 → 전문가 · 개인형 → 쇼핑 · 판매형 →
  교육형 → 병원 · 의료형 → 부동산 · 분양. 카드 크기가 모두 같아 순서를 바꿔도
  이미지가 달라지지 않는다. 부동산 · 분양은 공식 8개에 없어 표기를 그대로 두고
  전체 보기로 보낸다.
- 카드 목적지는 전부 `/design/category/<id>` — 별도 카테고리 페이지를 만들지
  않았다. 실제 클릭 검증 PC 4/4 · 모바일 확인 완료.
- 회귀: 직전 상태 대비 **30/32 화면 완전 일치**. pc-07 · mo-07 은 글자와 그
  글자 폭(그리고 카드가 자리를 바꾼 만큼 태그 칩이 함께 이동한 것)만 다르다.
  글자가 카드 밖으로 나가지 않는다(가장 빠듯한 곳도 58px 여유).
- 상단 필터 칩(신규 · 인기 · 심플 · 모던 …)은 업종이 아니라 성격 · 목적이라
  1차 카테고리가 아니다. 이번 지시 범위 밖이라 손대지 않았다.

## 4-K. PC06 DESIGN DETAIL 오른쪽 카피 위치 미세조정 (2026-09-08, 사용자 지시)

오른쪽 다크 영역의 글자가 아트워크에 그려진 밝은 세로 띠에 걸쳐 첫 글자가
흐려 보였다. 띠는 그림 안에 있고(1283~1303 unit) 글자 묶음이 1303 에서
시작하고 있었다.

`.asideRule` · `.asideQuote` · `.asideKeywords` 의 left 를 **1303 → 1321**
(18 unit) 로만 옮겼다. 세로 위치 · 크기 · 글자 크기 · 자간 · 색 · 폭 · 목업 ·
배경은 그대로다. 오른쪽 끝은 1456 unit 이라 무대(1536)까지 80 unit 남는다.
아트워크의 손글씨 `Your Next Stage` 는 그림에 인쇄된 것이라 옮기지 않았다.

회귀: 직전 대비 31/32 화면 완전 일치, pc-06 에서도 위 세 요소(와 그 줄들)의
x 좌표만 18 unit 이동했고 나머지는 전부 동일하다.

## 4-L. LOCATION 실제 지도 표시 (2026-09-08, 사용자 지시)

회색 자리표시 상자를 **실제 지도**로 바꿨다. 버튼을 누르지 않아도 화면 안에서
위치가 바로 보인다.

- 주소: 프로젝트에 저장된 확정 주소 하나만 쓴다 (src/lib/map.ts 의
  OFFICE_ADDRESS = 경기도 고양시 일산동구 숲속마을로 26 풍동프라자 3층 304호).
  좌표를 코드에 적지 않는다 — 임의 위치를 만들지 않기 위해서다.
- 방식: 카카오 지도 키가 없으므로 키가 필요 없는 지도 임베드(iframe)로
  같은 주소를 띄운다. 키(NEXT_PUBLIC_KAKAO_MAP_KEY)가 등록되면 카카오 지도가
  우선 적용되고 임베드는 자동으로 대체된다 (코드에 두 경로 모두 있다).
- 상자 크기 · 위치 · 모서리(399 x 137 unit)는 시안 그대로다. 지도가 상자를
  꽉 채우고, 카카오맵 링크만 오른쪽 위에 얹힌다.
- 회귀: 직전 대비 31/32 화면 완전 일치. pc-16 에서도 지도 상자 안쪽
  (자리표시 문구 → 지도)만 바뀌었고 제목 · 안내문 · 주소 카드 · 폼 · 밴드는 그대로다.
- 모바일 시안(MO16)에는 LOCATION 지도 자리가 없다. 넣으려면 모바일 화면
  구조를 바꿔야 해서 사용자 판단이 필요하다.
- 지도 임베드는 방문자 IP 가 지도 제공자로 전달된다 → /privacy 에 제3자 전송
  한 줄이 필요하다 (docs/LAUNCH.md B6).

## 4-M. /design 상단 카테고리 바 공식 8개 통일 (2026-09-08, 사용자 지시)

바의 디자인은 그대로 두고 표시명과 목적지만 공식 체계로 맞췄다.

- 칩 10개 → 공식 8개. 랜딩페이지형 · DB 수집형 · 채용 · 리크루팅형 ·
  포트폴리오형은 업종이 아니라 구성 · 목적이라 1차 카테고리에서 뺐다
  (개념은 남는다 — 앞으로 태그로 다룬다).
- 칩이 줄어든 만큼 가로 위치만 다시 계산했다. 첫 칩(217)과 마지막 칩(1342.5)
  중심은 시안 그대로 두고 그 사이를 균등 분할해서 바가 차지하는 폭과 좌우
  여백이 달라지지 않는다. 알약 · 글자 크기 · 색 · 세로 구분선 굵기/높이 ·
  세로 위치 · ··· 버튼은 모두 그대로다. 칩과 구분선 사이 여유 29.3 unit.
- 전체 보기 알약은 눌리지 않는 span 이었다. 모양은 그대로 두고 링크로만
  바꿔 43개 전체 목록으로 간다 (DOM 비교 결과 화면 변화 0).
- 상단 칩과 아래 8개 대표 카드는 같은 category id 를 쓴다 — 실제 클릭 검증 8/8.
- 대표 카드 이미지 8장은 그대로다. ZIP 의 43개 작품은 카테고리 안쪽에만 있다.

## 4-N. 카테고리 안쪽 갤러리 재작업 (2026-09-08, 사용자 지시)

/design 입구(PC04 · MO04)는 손대지 않았다 (32화면 DOM 해시 변경 0건).
바뀐 것은 카테고리를 누른 뒤의 목록과 작품 상세뿐이다.

- **자르지 않는다**: 예전에는 카드 틀에 cover 로 넣어 홈페이지 좌우가
  잘렸다. 지금은 두 이미지 모두 원본 비율 그대로 폭에 맞춰 들어간다.
  전수 검사 crop 0건 · 비율 왜곡 0건.
- **PC + 모바일 한 쌍**: 목록에서도 두 화면을 나란히 세운다. flex-grow 를
  각 이미지의 가로세로비로 주면 두 이미지 높이가 저절로 같아진다.
- **표기 3단**: 공식 카테고리(작은 라벨) / 업종명 / PC + MOBILE DESIGN.
  업종명은 화면에 인쇄된 로고 · 메뉴 · 메인카피로 확인한 것만 적었고
  브랜드명은 쓰지 않는다 (고객 실적으로 오해될 수 있다).
- **색은 새로 만들지 않았다**: globals.css 토큰만 쓴다 — 배경 --bn-ivory /
  --bn-header-bg, 글자 --bn-ink · --bn-body, 강조 --bn-bronze · --bn-eyebrow,
  선 --bn-hairline, 감청 --bn-navy.
- 머리말은 BIZNESTA DESIGN COLLECTION / 공식 카테고리명 / 한 줄 설명.
  과장 문구 · 실적은 넣지 않았다.
- route 는 그대로다: /design/category/[category] → /design/portfolio/[id].


## 4-O. 작품 상세 — 모바일 옆 상담 CTA (2026-09-08, 사용자 지시)

모바일 화면은 세로로 길어 오른쪽에 큰 자리가 남았다. 그 자리를 비워 두지 않고
작품을 다 본 지점에서 상담으로 이어지도록 CTA 를 놓았다.

- 버튼은 새로 만들지 않았다 — 이미 쓰고 있는 네이비 제작 상담하기(.topCta)
  그대로다. 문구도 제작 상담하기 → 로 사이트와 통일.
- 목적지는 /contact?source=design&category=<id>&design=<작품 id> — 보던 작품이
  상담에 그대로 실린다.
- 모바일 이미지 아래 끝에 맞춰 세로 정렬했고, 이미지와는 넉넉히 떨어뜨렸다.
  좁은 화면에서는 이미지 아래로 자연스럽게 내려간다.
- 작품 이미지의 크기 · 비율 · 잘림에는 영향이 없다 (crop 0건 · 왜곡 0건 유지).
- 상세 위쪽의 기존 제작 상담하기 버튼은 그대로다 → 상단 · 감상 후 두 곳에서
  상담으로 갈 수 있다. 관련 디자인 아래의 기존 상담 신청하기 도 그대로 두었다.
- 32화면 · /design 입구 변경 0건.

## 4-P. 포트폴리오 데이터 확정 · 크게 보기 (2026-09-08, 사용자 지시)

/design 입구와 32화면은 그대로다 (DOM 해시 변경 0건). 카테고리 안쪽만 바뀌었다.

### 실제 화면 기준 재분류 (5건)

파일명 분류가 아니라 홈페이지의 실제 업종 · 목적을 따랐다.

| 작품 id | 화면 내용 | 파일명 분류 | 최종 카테고리 |
|---|---|---|---|
| corporate-01 | 치과 | 기업 · 브랜드형 | **병원 · 의료형** |
| corporate-02 | 학원 | 기업 · 브랜드형 | **교육형** |
| local-03 | 헤어살롱 | 소상공인 · 매장형 | **뷰티 · 미용형** |
| beauty-04 | 여성 패션 쇼핑몰 | 뷰티 · 미용형 | **쇼핑 · 판매형** |
| franchise-01 | 반려동물 용품 쇼핑몰 | 프랜차이즈형 | **쇼핑 · 판매형** |

재분류 후: 기업 3 · 매장 4 · 교육 6 · 전문가 5 · 뷰티 5 · 병원 7 · 프랜차이즈 4 ·
쇼핑 9 = 43. 개수를 맞추려고 억지로 옮기지 않았다.

작품 id 는 이미지 파일 이름이라 그대로 둔다 — id 의 앞부분(corporate-01 등)은
처음 받은 폴더 이름일 뿐 카테고리가 아니다.

### 작품 제목 · 소개문

제목은 업종 · 용도(예: 정형외과 홈페이지), 소개문은 한 줄. 화면에 인쇄된 로고 ·
메뉴 · 메인카피에서 확인한 것만 썼고 브랜드명은 쓰지 않는다 — 실제 고객사나
제작실적으로 오해될 수 있다. 성과 · 후기 · 수치도 넣지 않았다.

### 크게 보기 (ZoomImage)

목록의 PC · 모바일, 상세의 PC · 모바일 어디서나 이미지를 누르면 어두운 배경
위에 원본이 펼쳐진다. 원본 비율 유지 · 자르지 않음 · 긴 화면은 위아래 스크롤 ·
닫기 버튼 · 바깥 클릭 · ESC · 열려 있는 동안 뒤 페이지 스크롤 잠금.
이미지 위에는 돋보기 + 크게 보기 표시를 옅게 둔다(손가락 환경에서는 항상 보임).

### 데이터 구조

src/data/showroom.ts 한 곳에 id · category · order · title · desc · pc · mo ·
thumb 와 확장용 tags / purpose / functions 자리가 있다. 새 작품은 이미지 3장
(-pc / -mo / -thumb)과 배열 한 줄만 더하면 목록 · 상세 · 관련 디자인에 자동으로
들어간다. 화면 코드에는 작품을 하나도 박아 넣지 않았다.

### 아직 하지 않은 것

노트북 · 스마트폰 목업 프레임을 씌우는 프레젠테이션은 넣지 않았다. 승인된
기본틀(아이보리 전시대 + 원본 두 장)을 유지하는 쪽을 택했고, 목업이 필요하면
샘플 1개로 먼저 만들어 확인받는다.

## 5. 다음 단계 (별도 지시 후 진행)

1. FINAL MOBILE USABILITY OPTIMIZATION — 완료 (사용자 승인 2026-09-07)
2. Navigation 연결 — 완료 (4-B)
3. CTA / Button / Link 연결 — 완료 (4-B)
4. 상담·문의 사용자 동선 정리 — 진입 동선 + 상담 폼 완료 (4-B, 4-C), 문의 저장은 다음 단계
5. 실제 사업자정보 반영
6. Footer / Contact 최종 정리
7. Form 구조 검수 — front 구현 완료 (4-C), 실제 접수는 다음 단계
8. 전체 PC / Mobile 기능 QA
9. SEO / metadata / social preview 정리
10. Production 공개 전 FINAL QA
11. 사용자 최종 승인
12. Production 배포

### 현재 단계에서 시작하지 않는 작업

Production 배포 · Admin 개발 · Supabase · DB · Auth · Storage · 결제 ·
문의 DB · 이메일 발송 · Webhook · SNS 자동화 · 가격 확정 ·
사업자정보 임의 생성 · 기존 32개 디자인 재디자인

## §4-Q · 크게 보기 기본 크기 = 감상 영역 맞춤(Fit to Viewing Area)

폭만 정하던 기본 크기를 **폭 + 높이 동시** 방식으로 바꾼다.

`ZoomImage.baseWidth(vw, vh, variant, ratio)`
- 감상 영역 = 뷰포트 − 상단 줄(62px) − 좌우/상하 여백
- 기본 폭 = `min(areaW × wide, areaH × 0.86 × ratio)`
- `wide` = ≥1024px: PC 0.62 · Mobile 0.46 / 561~1023px: 0.8 · 0.55 / ≤560px: 0.92 · 0.62

결과(1440×900): 가로형 PC 838px(가로 58.2%) — 이전 979px(68%)보다 한 단계 축소.
세로형 Mobile 은 비율과 무관하게 높이 679~680px(세로 75.5%)로 통일.

`DesignCard.tsx` · `DesignDetail.tsx` 에 `variant="pc" / "mo"` 를 전달한다.
(누락 시 세로형 모바일 화면이 PC 기준 폭으로 열려 화면을 넘겼다.)

원본 이미지 · Portfolio UI · 기존 32화면 변경 없음.

## §4-R · CATEGORY PORTFOLIO MASTER — 8개 카테고리 공통 적용

소상공인 · 매장형에서 승인된 화면을 **하나의 MASTER TEMPLATE**으로 삼고,
8개 카테고리와 전체 보기가 모두 같은 파일을 쓴다.

- `src/app/design/category/[category]/page.tsx` → 분기 없이 `PortfolioTemplate`
- `DesignList` 는 더 이상 쓰지 않는다(카테고리 화면 하드코딩 금지)
- 카테고리마다 바뀌는 것은 데이터뿐: 이름 · 한 줄 메시지 · 작품 목록
- 작품이 늘면 `src/data/showroom.ts` 한 줄만 더하면 8개 화면에 자동 반영

공통 문구
- PORTFOLIO 설명: `BIZNESTA가 제안하는 [카테고리명] 홈페이지 디자인 샘플을 만나보세요.`
  (전체 보기는 카테고리명 없이 `BIZNESTA가 제안하는 홈페이지 디자인 샘플을 만나보세요.`)
- 마무리 네이비 패널: `BIZNESTA DESIGN PORTFOLIO` / 좋은 디자인은 좋은 비즈니스를
  만듭니다. / 공식 4문장 / 오른쪽 `제작 상담하기 →`
  좁은 화면(≤760px)에서는 `br` 을 숨겨 문장이 자연스럽게 흐르게 한다.

유지: 히어로(PC16 리셉션 사진 · 흰 워드마크) · WEB PORTFOLIO · 카테고리명 ·
한 줄 메시지 · BRAND/DESIGN/BUSINESS · 카테고리 Navigation 9개 · 현재 항목 네이비 ·
작품 수 · PC+MOBILE 짝 · 제목 · 소개문 · VIEW MORE · 크게 보기(− / 기본 보기 / +) ·
Detail 연결 · 상담 CTA · 원본 비율 · crop 0.

작품 수 3 · 4 · 6 · 5 · 5 · 7 · 4 · 9 = 43 (전체 보기 43, 12개씩 4쪽).

부수 확인: 새 문구 때문에 서브셋 폰트를 다시 만들었고(737 → 805자),
그 결과 PC16 「카카오맵에서 보기」가 처음으로 전부 서브셋 글자로 그려져
폭이 104.78 → 103.22px 로 1.56px 줄었다(누락 글자 보정. 좌표 · 색 · 배치 동일).

## §4-S · NEW DESIGN 임시 비공개 · PC12 카드 상자 시안 복원

### 공개 동선
- `/design` 하단 「더 많은 디자인 보기 →」 → `/design/category/all`
  (버튼의 문구 · 위치 655/947 · 크기 227×40 · 색 · 화살표는 그대로)
- `/design/new`(07 NEW DESIGN)는 **삭제하지 않고 그대로 보존**한다.
  공개 링크에서만 빼고 `robots: noindex, nofollow, nocache` 를 붙였으며
  `PUBLIC_ROUTES` 에서 제외해 sitemap 에도 넣지 않는다.
  주소를 직접 입력하면 그대로 열린다(인증 · 잠금 아님).
  태그 · 필터 기능이 끝나면 이 세 곳만 되돌리면 다시 공개된다.

### PC12 OUR SERVICES 겹침
원본 시안을 다시 재보니 카드 흰 상자가 **520.5 ~ 838.5 unit** 인데
구현은 **505 ~ 820** 이었다(상자만 15.5 위로, 3 짧게). 그래서 제목
「원하는 서비스를 선택하세요.」의 잉크 아랫선(507.4)이 카드 윗변(505)을
2.4 unit 파고들고 있었다.

카드 안의 번호 · 아이콘 · 제목 · 설명 · 사진은 절대 위치가 이미 시안과
맞았으므로, **상자만 시안 자리로 내리고 안쪽 좌표에서 같은 값을 뺐다.**
- `.card` top 505 → 520.5, height 315 → 318 (아래끝 838.5 = 상담바 839)
- 안쪽 −15.5: 번호 35→19.5 · 아이콘 28→12.5 · 제목 72→56.5 · 설명 104→88.5
- `.cardImg` top 152→136.5, height 163→181.5 (절대 위치 658 그대로, 아래끝까지)

결과: 제목 잉크와 카드 사이 여백 −2.4 → **+13.1 unit** (시안 14.5).
카드 6장의 폭 · 글자 · 아이콘 · 사진 · 문구 · 전체 클릭은 변경 없음.
1920 · 1600 · 1440 · 1366 · 1280 및 대체글꼴 상태 모두 겹침 0.

## §5-A · BIZNESTA JOURNAL PHASE 1 — PC · MOBILE VISUAL MASTER (승인 대기)

기존 32화면과 섞지 않은 **신규 전용 MASTER**. 공개 경로에는 아직 연결하지 않았고
검수 주소로만 연다(`/review/journal-pc`, `/review/journal-mo`, 둘 다 noindex).

- `src/data/journal.ts` — 분류 5 · 글 4. 글이 늘면 배열 한 줄만 더하면 된다.
- `src/components/journal/Journal.tsx` + `Journal.module.css`
  기본 규칙이 **모바일 MASTER**, `@container journal (min-width:1024px)` 가
  **PC MASTER** 다. 컨테이너 기준이라 축소가 아니라 두 벌의 지면이다.
- `/review/journal-mo` 는 390px 폭 받침대에 그대로 올려 PC 브라우저에서도
  진짜 휴대폰 지면을 본다.

만들지 않은 것: 임의 발행일(모두 「발행일 미정」) · 조회수 · 고객사 · 실적 ·
새 사진(승인된 PC07 · PC11 · PC14 · PC16 브랜드 사진 재사용) · 빈 링크
(분류 · READ STORY · READ MORE · RELATED 태그는 표시만, 실제 링크는
「제작 상담하기」 둘과 홈 로고뿐).

검수: 360 · 375 · 390 · 430 / 1024 · 1280 · 1366 · 1440 · 1600 · 1920 가로 넘침 0,
기존 32화면 변경 0.

## §5-B · BIZNESTA JOURNAL — 공식 PC · MOBILE VISUAL MASTER (승인 대기)

§5-A 의 첫 JOURNAL 시안은 **폐기**한다. 사용자가 지정한 첨부 PC / MOBILE 이미지가
공식 MASTER 이며, 화면은 그것을 기준으로 다시 만들었다.

- `BN_PC_JOURNAL` — **1536 × 1024 한 장**. HEADER → JOURNAL HERO → CATEGORY →
  LATEST JOURNAL(4열) → NAVY BAND 까지 한 화면에서 끝난다.
- `BN_MO_JOURNAL` — 1024 × 2106. PC 를 줄인 것이 아니라 따로 짠 지면
  (히어로 · 분류 한 줄 · 사진 + 글 목록 · 네이비 · 꼬리).
- 좌표는 다른 32화면과 같은 방식으로 적고 `--s` 로 함께 줄인다.

지킨 것
- 머리줄은 **공식 Global Header** 그대로(로고 78/22 · 태그라인 · 7개 메뉴 좌표 ·
  상담 버튼 1274/22). 시안 속 AI 메뉴는 쓰지 않았다.
- 문구는 지시서의 공식 텍스트만 쓴다(시안 이미지 속 글자를 옮기지 않는다).
- 사진은 승인된 브랜드 사진만: 히어로 `pc09/hero`, 표지 `pc16` · `pc14` ·
  `pc07` · `pc12` hero. 원본은 고치지 않고 보여줄 자리만 정한다.
- 발행일 · 조회수 · 작성자 · 설명문 · RELATED · JOURNAL CONNECTS 는 넣지 않는다.
- 아직 이어붙이지 않은 곳은 링크로 만들지 않는다 — 분류 · VIEW ALL JOURNAL ·
  READ MORE 는 표시만. 실제 링크는 로고 · 공식 메뉴 · `/contact?source=journal`.

검수: PC 1280 · 1366 · 1440 · 1536 · 1600 · 1920 에서 스테이지 비율 1.500 고정,
MOBILE 360 · 375 · 390 · 430 — 가로 넘침 · 겹침 · 잘림 0.

## §6-A · 실제 사업자정보 반영 (디자인 변경 없음)

브랜드 표기는 **BIZNESTA**, 사업 주체(상호)는 **비즈네스타**다 — 2026-09-21 갱신.
처음엔 라이브마스터아카데미(107-34-51426)를 사업 주체로 적었으나, 비즈네스타가
2026-09-14 별도 사업자(416-23-63780)로 등록되어 그쪽으로 바꿨다. 로고 · 화면 제목 ·
메뉴 · CTA 는 전부 BIZNESTA 그대로이고, 법적으로 사업 주체를 밝혀야 하는 자리에서만
상호를 쓴다.

- `src/data/business.ts` 신설 — 상호 · 대표자 · 사업자등록번호 · 사업장 소재지 ·
  공식 상담 연락처를 한 곳에서 관리한다(페이지마다 다시 적지 않는다).
- `src/data/privacy.ts` — 「사업자 및 개인정보 보호책임자」 절이 위 값을 읽는다.
  출처: 국세청 사업자등록증명(416-23-63780, 2026-09-18 발급) ·
  통신판매업신고증(제 2026-고양일산동-1885 호, 2026-09-21).
- 상담 연락처 `050-7875-1892` · `biznestahome@gmail.com`. 전화번호는 2026-09-17
  사용자가 알린 새 고객센터 번호로 바꿨다(이전 `010-3304-2324`). `src/data/business.ts`
  의 `CONSULT_PHONE` 한 곳에서만 읽는다.
- 여전히 비워 둔 것: 보관기간. (개인정보 보호책임자는 2026-09-21 대표자 본인으로 확정.)

## §6-D · 최소형 BUSINESS INFO 영역 (2026-09-21, 시안 바깥)

전자상거래법이 요구하는 통신판매업자 표시를 모든 공개 route 맨 아래에 붙였다
(`src/components/site/BusinessInfo.tsx`). **시안 32장은 그대로다** — `Screen` 의
`<main>` 뒤와 `/contact` 의 `<main>` 뒤에만 놓여서, 시안의 배치 · 높이(PC 1024px ·
MOBILE 719px)에 아무 영향이 없고 `/review/*` 에는 나오지 않는다.

- 값은 전부 `src/data/business.ts` 에서 읽는다. 페이지마다 다시 적지 않는다.
- 팔레트는 globals.css 토큰(ivory 바탕 · gold 눈썹 · navy 워드마크)만 쓴다.
  글자 11~12px, 낮은 대비 — 시안보다 눈에 띄지 않게.
- 주소는 같은 호실을 용도별로 두 표기로 둔다: 법적 자리(이 영역 · 방침)는
  `BUSINESS_ADDRESS`(304-B호), 방문 안내(LOCATION · 상담 카드 · 지도)는
  `VISIT_ADDRESS`(3층 304호). 다른 사업장이 아니다.
- 업종 정정(컴퓨터 프로그래밍 서비스업 · 시각 디자인업)은 새 등록증 발급 전이라
  어디에도 적지 않았다.

주소 표기가 두 가지인 이유
- 법적 표시(`/privacy`): 등록증 표기 그대로 `… 숲속마을로 26, 304호 (풍동, 풍동프라자)`
- 방문 안내(PC16 LOCATION · 지도): 기존 확정 표기 `… 숲속마을로 26 풍동프라자 3층 304호`
같은 장소이며, PC16 은 FINAL LOCK 화면이라 표기를 건드리지 않았다.

화면 · 레이아웃 · 색 · 타이포 변경 0. 기존 32화면 변경 0.

## §6-B · 사업자등록증 2026-09-08 정정 발급본 반영

§6-A 의 기준본(2026-01-03)을 **2026-09-08 정정 발급본**으로 교체한다.
등록번호 · 상호 · 대표자 · 소재지는 동일하고, 다음이 더해졌다.

- 개업연월일 2024년 02월 14일 · 과세유형 일반과세자
- 업태 5: 도매 및 소매업 · 정보통신업 · 전문, 과학 및 기술서비스업 ·
  교육서비스업 · 정보통신업 (등록증 표기와 순서 그대로, 중복도 그대로)
- 종목 5: 전자상거래 소매업 · **컴퓨터 프로그래밍 서비스업** · **시각 디자인업** ·
  온라인 교육학원 · 미디어콘텐츠창작업

업태 · 종목은 `src/data/business.ts` 에만 보관하고 화면에 나열하지 않는다
(법적 표시에 필요한 항목만 `/privacy` 에 정돈해 둔다).

화면 · 레이아웃 · 색 · 타이포 변경 0. 기존 32화면 변경 0. JOURNAL 미변경.

### 주소 표기 — 사용자 확정 (2026-09-08)

두 표기를 **그대로 유지한다**. 통일하지 않는다.
- 법적 표시(`/privacy`): 등록증 표기 `… 숲속마을로 26, 304호 (풍동, 풍동프라자)`
- 방문 안내(PC16 · MO16 LOCATION · 지도): `… 숲속마을로 26 풍동프라자 3층 304호`

같은 장소이며, PC16 · MO16 은 FINAL LOCK 이므로 앞으로도 손대지 않는다.
사업자정보 반영 작업은 여기서 종료한다.

### 공식 도메인 — 확보 완료 · 연결 전 (2026-09-08)

`biznesta.com` 을 공식 도메인으로 확보했다. **아직 연결하지 않는다.**
Vercel 도메인 연결과 `SITE_URL` 등록은 Production 작업이므로 사용자의 지시가
있을 때만 진행한다. 그때까지 코드는 Vercel 배포 주소를 그대로 쓴다.

## §5-C · BIZNESTA JOURNAL — FINAL LOCK (2026-09-08 사용자 최종 승인)

`BN_PC_JOURNAL` · `BN_MO_JOURNAL` 을 **JOURNAL 공식 Visual Master 기준**으로
확정한다. 기준 화면은 `/review/journal-pc` · `/review/journal-mo` 다.

### 변경 금지 (별도 지시 없이 손대지 않는다)
- PC · 모바일 JOURNAL 히어로 전체 구성
- `BIZNESTA` + `JOURNAL` 타이포그래피와 골드 포인트(그라데이션 구간 포함)
- 히어로 이미지(`pc09/hero`) · 배치 · 크롭(오버사이즈 후 아래 정렬)
- 히어로 카피와 위치 — 공식 문구 `JOURNAL_COPY` 그대로
- 아이보리 · 네이비 · 샴페인 골드 색 구조
- `ALL / NEWS / INSIGHT / NEW DESIGN / NOTICE` 분류 구성과 ALL 활성 상태
- `LATEST JOURNAL` 구성(eyebrow · 제목 · VIEW ALL · 짧은 실선)
- PC 4열 콘텐츠 구성(카드 좌표 281 / 581.75 / 882.5 / 1183.25, 폭 278.75, 표지 128)
- 모바일 리스트형 콘텐츠 구성(사진 300×122 + 글, 줄 좌표 930 / 1128 / 1362 / 1560)
- `START YOUR PROJECT` 하단 네이비 CTA
- 모바일 꼬리(로고 · 태그라인 · 개인정보처리방침)
- 전체 여백 · 비율 · 타이포 위계
- **PC 1536 × 1024 한 페이지형 밀도** (모든 폭에서 비율 1.500 고정)
- 모바일 1024 × 2106

### 함께 승인된 결정
- 머리줄은 공식 Global Header 를 그대로 쓴다(시안 속 AI 메뉴 미사용).
- 히어로 캐러셀 화살표와 `01 / 04` 는 **넣지 않는다**(실제 캐러셀이 아님).
- 모바일 꼬리는 현재 구성 그대로 둔다.

### 앞으로 기능을 붙일 때
데이터와 기능만 연결하고 레이아웃 · 디자인은 바꾸지 않는다. 분류 고르기 ·
`VIEW ALL JOURNAL` · `READ MORE` · 상세 이동은 **같은 자리에 링크만 얹는다**.
발행일은 `publishedAt` 이 실제로 생겼을 때만 화면에 나온다.

Production 미변경. 공개 경로(`/journal`)는 아직 열지 않았다.

## §6-C · 모바일 16화면 구조 안전화 (2026-09-09)

`/about`(MO15)에서 사용자 승인을 받은 방식을 MO01~MO14 · MO16 에 그대로 옮겼다.

**원인** — 모든 모바일 화면의 글이 절대 좌표(`--s` 배수)로 놓여 있는데,
PHASE 4 에서 본문 글자만 px 로 못 박았다. 안드로이드 크롬 「텍스트 배율」은
px 글자만 키우고 좌표는 그대로여서 배율 120% 부터 글이 아래 요소를 덮었다.
`--p1` 같은 밀어내기 변수는 폭에는 반응하지만 글자 배율에는 반응하지 못한다.

**적용** — 각 화면을 3~6 개의 면(section)으로 세로로 쌓고, 좌표는 면 안에서만
쓴다. 글이 들어가는 기둥(라벨 · 제목 · 본문 · 인용)만 흐름으로 바꿔 면이 글
높이만큼 자라고, 다음 면이 스스로 밀려난다. 사진 · 카드 · 아이콘 · 구분선은
절대 배치 그대로다. 밀어내기 변수(`--p1`/`--p2`)는 전부 걷어냈다.
히어로 본문은 승인된 `/about` 기준(12.5px / 행간 1.62)으로 통일했다.
`.inner` 에 `text-size-adjust: 100%` 를 넣어 크롬 자동 확대를 막았다.

**MO16** — `/contact` 의 slice(top/form/bottom)는 좌표 오프셋(`--plane -1160u`)
대신 내용 높이를 따르도록 바꿨다. 상담 폼의 필드 · 검증 · 저장 로직은 손대지
않았다.

**검수** — 360 / 375 / 390 / 412 / 430px · 안드로이드 글자 배율 100 / 120 / 150%
전 조합에서 16화면 모두 겹침 0 · 가로 넘침 0.
PC 16화면 기하·타이포 해시 회귀 0건.
높이 변화: 1536u → 1526~1991u (평균 +4%).
