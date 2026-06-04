# Next Claude Code Handoff

## Current Goal

공고 **리뷰 기능 전반(조회·통계·필터·작성·진입)** 프론트 구현이 완료되었습니다. 남은 것은 **백엔드 응답 필드 확정 후 마무리**(수료여부 저장/조회, helpful, 공모분야·지원서 첨부)와 부가기능(알림/검색기록/회원탈퇴 등)입니다.

- `상세내용` 탭: API 연결 + **디자인 세분화 완료**
- `리뷰` 탭: 조회·통계·필터 **연동 완료**, 디자인 정합 완료
- 리뷰 **작성 페이지**(3스텝+인증): PC/모바일 **구현 완료**
- 리뷰 **작성 진입**: 공고 상세 "리뷰 작성하기" + GNB 연필 두 경로 완료

## Current Worktree State

> **상태(업데이트):** 아래 작업은 모두 `dev`에 **커밋·푸시 완료** (working tree 깨끗).
> - `30ea323` fix: 회원가입 학교명·직장명 placeholder 색상 #A5ADBB 정합 + QA CSV 전체 감사 결과 반영 ← **최신**
> - `dfabdca` docs: handoff에 커밋·푸시 완료 상태 반영
> - `6143e65` feat: 리뷰 기능 전반 + 회원가입 정합 + Select/약관 UI 개선
> - `4b25d3c` chore: gitignore(picklab-be·.claude·.omc 제외)
> 추적 제외: `picklab-be/`, `.claude/`, `.omc/`. 미추적 보존: `docs/api-spec.json`, `issues/`.

이전 세션에서 구현·검증한 변경 내역입니다(이제 커밋됨).

### 신규 파일
| 파일 | 내용 |
|---|---|
| `src/types/review.types.ts` | 리뷰 타입, enum 라벨/배지색, 점수 정규화(`toFiveScale`/`toScorePercent`), 만족도 집계, 필터 옵션/타입 |
| `src/hooks/useActivityReviews.ts` | 리뷰 목록/만족도/직무연관성 조회 훅 3종 (`enabled`, `page`, `size`, `filter`) |
| `src/app/(home)/activity/[id]/_components/ReviewFilters.tsx` | 리뷰 필터(관심직무/총평점/수료여부 + 초기화) 공용 컴포넌트 |
| `src/app/(home)/activity/[id]/review/page.tsx` | 리뷰 작성 페이지(서버 컴포넌트, activity fetch + PC/Mobile 분기) |
| `src/app/(home)/activity/[id]/review/_components/*` | `useReviewWriteForm`, `ReviewWriteBody`, `ReviewSteps`, `ReviewWriteShared`, `ActivityChangeModal`, `CertificationUploadModal`, `Pc/MobileReviewWritePage` |
| `src/components/common/GNB/ReviewWriteModal.tsx` | GNB 연필 → "어떤 활동에 참여하셨나요?" 검색 모달 |

### 수정 파일
| 파일 | 내용 |
|---|---|
| `PcActivityDetailPage.tsx` / `MobileActivityDetailPage.tsx` | 리뷰 탭 연동·디자인 정합·필터, 상세내용 탭 세분화, "리뷰 작성하기" → `/activity/[id]/review` 라우팅 |
| `GNB/pc/GNB.tsx` / `GNB/mobile/GNB.tsx` | 연필 아이콘 → `ReviewWriteModal` 오픈 |
| (이전) `page.tsx`, `Select.tsx`, 아카이브 작성/프록시 | 모바일 홈 간격, Select 스크롤, 아카이브 record/status |
| 기존 untracked | `docs/api-spec.json`, `issues/`, `picklab-be/` |

검증: `yarn typecheck` EXIT 0, 변경 파일 `npx eslint <files>` EXIT 0. 리뷰 작성/모바일/상세탭은 dev + Playwright로 실제 렌더 검수 완료.
주의: `yarn lint`는 Next 16에서 `next lint` 제거로 깨짐 → ESLint는 `npx eslint <files>`로 직접 실행.

## Recently Completed

| 영역 | 완료 내용 |
|---|---|
| 리뷰 조회/통계 | 목록·만족도·직무연관성 3 API 연동, PC/모바일 하드코딩 제거 |
| 리뷰 탭 디자인 정합 | 블러/잠금 제거, 도움이돼요 복원, PC 작성 유도 박스, 다건 목록 + 페이지네이션(size=10) |
| 리뷰 필터(3-4) | 관심직무(직군탭+세부 멀티칩+적용)/총평점/수료여부 + 초기화, query 연결(반복 param), 필터 변경 시 page 1 |
| 리뷰 작성 페이지(3-3/3-5) | Step1(직무/세부/수료) → Step2(총평점+5단계 점수) → Step3(텍스트+직무연관성) + 인증자료 업로드(presigned), POST /api/review, 활동변경/나가기 모달. PC/모바일 반응형 |
| 리뷰 작성 진입 | 공고 상세 "리뷰 작성하기" + GNB 연필 → 검색 모달 → `/activity/[id]/review` |
| 한 줄 평 검증 | 입력 제한 → **초과 시 에러 메시지** 방식(빨강 테두리 + "최대 20자" + 빨강 카운터) |
| 수료여부 칸 | 활동 검색/변경 모달에서 잘못된 데이터 대신 **빈 셀**로 표시 |
| 상세내용 탭 세분화 | 활동내용/모집대상/지원기간/혜택/필수 지원서 양식 (값 없는 섹션 자동 숨김) |

## Connection Notes (의도적 결정 / 명세 불명확 가정)

| 항목 | 처리 | 후속 조치 |
|---|---|---|
| 점수 스케일(0~5 vs 0~100) | `toScorePercent`/`toFiveScale`(×20 환산) 방어 처리 | 기획서로 1~5 확정됨. 실응답 확인 후 단순화 가능 |
| 리뷰 세부평점 매핑 | 직무경험=`info_score`, 활동강도=`difficulty_score`, 혜택=`benefit_score` 추론 | 백엔드 확인 |
| 만족도 "전체" 평균 | 통계가 직무별 `items[]`만 줘서 단순 평균 집계 | 전체 평균 필드 유무 확인 |
| `jobDetail` 멀티 필터 | api-spec상 array 타입 확정 → **반복 param**(`jobDetail=A&jobDetail=B`)으로 전송 | 백엔드 직렬화 방식(반복/콤마) 최종 확인 |
| helpful(도움이 돼요) | 버튼만 표시, 카운트·onClick 미연결 | helpful API 생기면 연결 |
| 수료여부(작성/조회) | POST body·archive 응답에 필드 없음 → 작성 시 `progress_status`로 함께 전송 시도, 모달 표시 칸은 비움 | 백엔드 수료여부 필드 확정 후 연결 |
| 활동 변경/검색 모달 데이터 | `GET /api/archive`(참여활동) + 클라이언트 제목 검색 | 전용 목록/검색 API·수료여부 필드 확인 |
| presigned category | `'REVIEW'` (api-spec enum에 존재 확인됨) | 없음 |
| 별점 칩/5단계 라디오 문구 | 디자인 1장 기준 추정 하드코딩 | 디자인 확인 시 조정 |
| 상세탭 공모분야/모집인원/지원서 첨부 | 응답 필드 없어 미반영(공모분야·모집인원 생략, 지원서 "파일 없음" 고정) | 백엔드 필드 제공 시 채움 |

## 기획서로 확정된 스펙 (PICKLAB 기획서 No.3 리뷰)

| No. | 항목 | 확정 내용 | 반영 |
|---|---|---|---|
| 3-1 | 직무 연관성 | 레이더, 점수 1~5 평균, 큰 직무 단위 기준 | ✅ |
| 3-2 | 활동 만족도 | 별점+바 각 1~5, Default 필터=전체 | ✅(전체평균은 클라 집계) |
| 3-3 | 작성 버튼 | 페이지 이동(모달 아님) | ✅ |
| 3-4 | 필터 | 총평점/관심직무/수료여부 + 초기화 | ✅ |
| 3-5 | 작성 리뷰 | 본인 리뷰엔 수정/삭제 버튼 | ⏳ 미구현(아래 참고) |
| 3-6 | 페이지네이션 | 리뷰 10개 도달 시(size=10) | ✅ |

## Main Remaining Work

### 1. 백엔드 답변 후 마무리 (요청 발송됨, 대기 중)
- **수료여부**: POST /v1/review에 필드 추가 → 작성 저장 + 모달 수료여부 칸 표시
- **helpful(도움이 돼요)**: 카운트/토글 API → 리뷰 카드 버튼 숫자·동작 연결
- **만족도 전체 평균**: 백엔드 직접 제공 시 클라 집계 제거
- **jobDetail 멀티 직렬화** 방식 최종 확인
- **상세탭**: 공모분야·모집인원·지원서 첨부 필드 제공 시 섹션 채움

### 2. 리뷰 수정/삭제 (기획 3-5)
```text
GET /api/reviews/[id]   PUT /api/reviews/[id]   DELETE /api/reviews/[id]
```
본인이 작성한 리뷰에 수정/삭제 버튼 노출. 본인 리뷰 식별 방법(응답에 작성자 플래그?) 백엔드 확인 필요.

### 3. 부가기능 (화면 미연동, 별도 영역)
검색 기록(`/search/history`), 알림(`/notifications` + SSE subscribe), 회원탈퇴(`withdrawal-survey`), 이메일 변경(`/members/email`), 알림 설정(`/members/notifications`) — 프록시 라우트는 있으나 화면 미구현.

## Remaining Questions (백엔드/기획에 발송됨)

| 대상 | 질문 | 상태 |
|---|---|---|
| 백엔드 | POST /v1/review 수료여부 필드 추가 가능 여부 | 대기 |
| 백엔드 | 활동 검색/변경 모달용 목록 API + 수료여부 필드 | 대기 |
| 백엔드/기획 | helpful(도움이 돼요) API 제공 여부 (디자인엔 있고 기획서엔 없음) | 대기 |
| 백엔드 | 만족도 "전체" 평균 직접 제공 여부 | 대기 |
| 백엔드 | 상세탭 공모분야·지원서 첨부 필드 제공 여부 | 신규 |
| 기획 | 비로그인 작성/조회 처리(로그인 유도/비노출) | 대기 |

## QA 3round-2 CSV 진행 현황 (issues/qa-issues-3round-2.csv)

figma 권한 막힘 → 사용자가 화면 PNG를 주면 작업하는 방식. 대부분 명시 스펙은 이미 충족돼 있었고 실제 수정만 아래.

> **전체 감사 완료(2026-06-04):** CSV 31개 항목을 코드와 1:1 대조(병렬 read-only 감사). 결론 — 수치 명확 항목은 **거의 다 이미 충족**. 추가로 검증한 A·B·C(아래)도 모두 충족 확인되어 코드 변경 없음. **진짜 남은 것은 "대상 불명확 → PNG/명세 필요" 항목들뿐**:
> - 리뷰 탭 50px/24px/20px가 **어느 요소인지** 불명, "삭제하여 노출" 대상 불명, 전반 디자인 node `2408-26558` → PNG 필요
> - ~~메인 드롭다운 레이블~~ → ✅ **충족 확정**: `NewActivityList.tsx:192-220` 활동유형/직무유형 `type="checkbox"`, `Select.findOption()`이 2개↑ 시 `"활동유형 2"`/`"직무유형 2"` 출력. CSV "/"는 두 드롭다운 나열 표기.
> - 메인(MOBILE) 배너/tab bar 위치·탭 너비 → 디자인 필요 (일부는 CSV상 "반영")
> - ~~회원가입 가입 후 자동 로그인~~ → ✅ **사실상 충족**: `additional-info/route.ts`가 `proxyWithAuth`로 호출(이미 인증 상태). OAuth 선로그인→추가정보 플로우라 가입 완료 시점에 로그인됨. (100% 확정은 소셜 가입 E2E 필요)
>
> **A·B·C 감사 상세(모두 이미 충족, 변경 없음):**
> - **A** 회원가입 간격 8px+서브텍스트 gray-50: `TitleTypography.tsx:12` `descriptionClassName` 기본값이 `text-gray-50`(Step2 적용됨), Step3는 의도적 `danger-50`. 간격 `Step2.tsx:91 gap-2`(8px). list 10px/칩 8px는 의도적 구분.
> - **B** 페이지네이션↔footer 여백 2배: `PcActivites.tsx:30 pb-20`(80px) 이미 적용. (`layout.tsx:8 mb-10`은 활동목록 외 페이지용, CSV 대상 아님)
> - **C** 공고상세 본문 14px: `InfoItem`(`PcActivityDetailPage.tsx:67,70`)은 이미 `Body3Medium`(14px). `DetailSection` 본문 15px는 **사용자 결정으로 유지**(CSV 요구 근거 없음).

| # | 화면 | 결과 |
|---|---|---|
| 1 | 공고상세 > 리뷰 | ✅ **로그인 분기**: 비로그인=블러 잠금(대표1개+"리뷰 작성하고 전체보기"), 로그인=전체공개(다건+페이지네이션+작성유도박스). `ReviewCard`/`ReviewListCard`에 `locked` prop, `useAuthClient().isAuthenticated`로 분기. PC/모바일 둘 다. **기준이 로그인 여부 — 실제 기준이 '본인 작성 여부'면 백엔드 플래그 필요** |
| 2 | 메인 > 카테고리 목록 | ✅ 버튼 크기고정·페이지네이션 컴포넌트는 이미 충족. `PcActivites` `pb-10`→`pb-20`(footer 여백 2배), `FilterSection` 선택칩→새로고침 순서로 변경 |
| 3 | 메인 홈 | ✅ 드롭다운 레이블/체크박스/option 스크롤/GNB border 이미 충족. `ActivityList` 캐러셀 `scrollBy 300px`→카드 1개 너비(offsetLeft 차이) 단위로 변경 |
| 4 | 회원가입 | 🔶 진행 중 — 아래 |

### 회원가입(`src/app/(auth)/signup/`) 진행
- 현재 상태: 공통(진행바/버튼/나가기 다이얼로그)·Step1 약관·Step3·Step4 거의 구현됨. Step2는 검증이 비어 있었음.
- ✅ **Step2 검증 완료**: 닉네임 5종(빈값/띄어쓰기/특수문자/20자/성공) `validateNickname`+TextField status/helpMessage, 재직 중 외 선택 시 직장명 disabled+값clear, 옵션 정정(학력 고등학교/대학교2,3년/대학교4년/대학원, 졸업 졸업/재학중/휴학/중퇴, 재직 +휴직), 최종학력·졸업여부 성공 메시지. (`Step2.tsx`, `constants.ts`, `page.tsx` 라벨매핑)
- ✅ **Step3 정합 완료**: 세부직무를 직무분야 카드 아래로(구분선/제목 제거), max-w-[420px]·좌측정렬, 대분류 텍스트 gray-80/gray-50, description 빨강(`TitleTypography`에 `descriptionClassName` 옵션 추가), 선택칩 8px/list 10px.
- ✅ **Select 디테일 완료**: ① 클릭 시 primary 테두리(테두리 우선순위 에러>열림>선택>기본 단일식) ② 드롭다운 간격 portal 포함 4px 통일(`rect.bottom`+ul `mt-1`) ③ `OptionGroup` `max-h-60`→`max-h-[224px]`로 6개(재직상태) 스크롤. Playwright 측정 검증(borderColor rgb(0,188,125), gapPx 4, 재직 scrollable true).
- ✅ **Step1 약관 본문 아코디언 완료 + 법무 확정본 연결**: `SIGNUP_TERMS`를 `LegalDoc` 참조(`doc?`)로 변경, 이용약관=`TERMS_OF_SERVICE`/개인정보=`PRIVACY_POLICY` **전문 inline 표시**(`max-h-[150px]` 스크롤, `LegalDocument variant="embed"`). 마케팅 수신 동의는 figma 시안대로 토글/패널 없음. **임시 placeholder 제거 완료**.

### 이용약관·개인정보처리방침 페이지 신규 완료 (2026-06)
- `src/constants/legal.ts`: 약관 확정본 데이터(`LegalDoc`/`LegalBlock` 타입 + `TERMS_OF_SERVICE`/`PRIVACY_POLICY`). **페이지·회원가입 아코디언이 이 단일 소스 공유** — 본문 수정 시 이 파일만.
- `src/app/(home)/_components/LegalDocument.tsx`: 렌더러(`variant: 'page' | 'embed'`). Server Component(’use client’ 없음)라 /terms·/privacy는 server-render, client인 Step1에도 임베드 가능.
- **page 타이포 규격(디자인 확정)**: 제목 24px/700(`Title3Bold`), 부제 13px/500(`Body4Medium`), 섹션제목 16px/600(`Body1Semibold`), 본문 12px/400(`Caption1Regular`) — **전부 gray-90(#101828)**. Playwright computed-style 측정 일치 검증. embed(회원가입 아코디언)는 별도 규격 유지.
- `/terms`, `/privacy` 페이지(`(home)` 그룹 → GNB+Footer 자동). footer 링크 연결(`menus.ts`: 이용약관→`/terms`, 개인정보처리방침→`/privacy`).
- 검증: typecheck/eslint EXIT 0, Playwright 실렌더(페이지 2종 + 회원가입 Step1 펼침) 시안 정합 확인. 코드리뷰 통과(critical/high 0).
- ⏳ **후속(비차단) 접근성 1건 남음**: ① `LegalDocument` 리스트가 `<ol>/<ul>`에 수동 `1.`·`•` 주입 → CSS `list-decimal/list-disc`로 교체 시 **시안 재검증 필요**.
- ✅ **접근성 ② 완료**: `Step1` 아코디언 패널을 항상 렌더 + `hidden={!isOpen}` 토글로 변경 → `aria-controls` 대상 상시 존재. Playwright로 닫힘(빈 공간 없음)/열림 동작 검증.
- ✅ **학교명 search 정정 완료**: 디자인 확인 결과 학교명은 **드롭다운 없는 자유 입력 필드**(돋보기 아이콘은 장식)였음. 이전 세션의 "optionGroup·직접 추가하기"는 오해 — 별도 검색 API/드롭다운 불필요, 기존 `TextField icon="search"`로 이미 충족. 추가로 **학교명/직장명 placeholder 색 `#A5ADBB` 정합**(`Step2.tsx`: `placeholder:!text-[#A5ADBB]`, 직장명은 활성 시에만 적용, disabled 시 기존 회색 유지). 라벨은 `label=" "` 공백이라 이미 투명(Select와 높이 정렬). 토큰(`gray.40`) 미변경.

### QA CSV 남은 figma 의존 (PNG 필요)
- 4번 회원가입: ✅ 완료 (학교명 search 오해 정정 + placeholder 정합)
- 5번 회원가입 진입(`1136-72980`): ✅ 완료 — signin "PICKLAB 회원가입"→`/signup`(`signin/page.tsx:102-112`), PC GNB 회원가입 버튼→`/signup`(`GNB/pc/GNB.tsx:96-98`) 모두 이미 충족. 기능 요구 충족, 픽셀 정합만 PNG로 추가 대조 가능
- 리뷰 블러 분기 기준(로그인 vs 작성여부) 기획 확인

### 백엔드 확인 대기 (누적)
수료여부 저장/조회, helpful API, 만족도 전체평균, jobDetail 멀티 직렬화, 닉네임 중복 체크 API, 회원가입 새 enum(college/dropped_out/on_leave), 상세탭 공모분야·지원서 첨부 필드.

## Recommended Next Prompt

```text
docs/next-claude-code-handoff.md 읽고 이어서 작업해줘.
백엔드 답변이 오면 Main Remaining Work 1번(수료여부/helpful/만족도 전체평균)을 마무리하고,
이어서 2번 리뷰 수정/삭제(기획 3-5)를 구현해줘.
이미 구현된 리뷰 조회/통계/필터/작성/상세탭은 건드리지 말고, Connection Notes의 가정만 실응답으로 확정해줘.
```
