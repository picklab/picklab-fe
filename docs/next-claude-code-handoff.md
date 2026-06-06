# Next Claude Code Handoff

## Current Goal

공고 **리뷰 기능 전반(조회·통계·필터·작성·진입)** 프론트 구현이 완료되었습니다. 남은 것은 **백엔드 응답 필드 확정 후 마무리**(수료여부 저장/조회, helpful, 공모분야·지원서 첨부)와 부가기능(알림/검색기록/회원탈퇴 등)입니다.

- `상세내용` 탭: API 연결 + **디자인 세분화 완료**
- `리뷰` 탭: 조회·통계·필터 **연동 완료**, 디자인 정합 완료
- 리뷰 **작성 페이지**(3스텝+인증): PC/모바일 **구현 완료**
- 리뷰 **작성 진입**: 공고 상세 "리뷰 작성하기" + GNB 연필 두 경로 완료

## 남은 작업 스냅샷 (2026-06 최신)

> 최근 완료: 리뷰 탭 Figma 정합 / 내 리뷰 목록·삭제 + 작성폼 edit 리팩터 / 부가기능(알림설정·이메일변경·최근검색기록·회원탈퇴) / 백엔드 답변 반영(helpful·수료여부 PATCH·활동변경/GNB 모달 results) / 활동목록 직무유형 필터 / **전수 감사 후 미연동 7건 일괄 수정(프로필 메인·계정·이메일동의·관심직무·북마크 등)**. 모두 `feat/my-reviews` 브랜치.

**A. 화면 있고 바로 가능 (비블로킹)**
- ✅ **회원탈퇴 연동 완료(2026-06)**: `WithdrawPage` client 전환 — 동의 체크 + 사유 라디오(6종 enum 매핑) → `POST /api/members/withdrawal-survey {reason}` → `DELETE /api/members` → 로그아웃(`clientLogout`+`/api/auth/logout`) → `/signin`. 탈퇴 전 `window.confirm` 가드. 취소→`/profile/account/info`. typecheck/eslint EXIT 0.

**B. 백엔드 추가 후 활성화 (코드/리팩터는 준비됨)**
- **리뷰 수정 저장** — `MyReviewsResponse`/`MyReviewDetail`에 `activity_id` 없음(participation 도입됐으니 재확인). 추가되면 `useReviewWriteForm mode="edit"`로 즉시 연결.
- **알림 설정 초기값** — on/off 조회 GET 부재 → 스위치 초기상태 표시 불가.
- **인기 검색어** — 랭킹+순위변동(↑↓) API 부재 → 검색 기록 카드의 인기검색어 섹션 미구현.
- **리뷰 마무리 잔여** — 만족도 전체평균, jobDetail 직렬화, 상세탭 공모분야·지원서 첨부 필드. *(수료여부·helpful은 완료)*

**C. Figma(디자인) 필요**
- **메인(MOBILE)** 배너/tab bar 위치·탭 너비 (Figma MCP 호출 한도 회복/PNG 필요).
- **이메일 변경 최종 UX** (footer vs 인라인 버튼 역할), **자동완성(WordList) 정합**.

**D. 복잡/별도**
- **실시간 알림(SSE)** — `/notifications` + subscribe. 별도 설계 권장.

**E. 비차단 접근성 1건**
- `LegalDocument` 리스트 수동 `1.`·`•` → CSS `list-decimal/list-disc` 교체(시안 재검증 필요).

## 코드 미연동 일괄 수정 (2026-06) — 전수 감사 + 1~7 수정

> 4영역 병렬 감사(활동/검색·인증/계정/프로필·리뷰/아카이브·부가/전역)로 "UI만 있고 미연동/mock/no-op"을 찾아, **코드만으로 가능한 7건을 일괄 수정**. typecheck/eslint EXIT 0, 재감사(빈 핸들러·하드코딩 더미 0건) 통과.

1. ✅ **프로필 메인**(`PcProfilePage`/`MobileProfilePage`) — 통째 mock → 실데이터: 활동결과=`useParticipationSummary`(신규, `GET /api/activity-participations/summary` 프록시 신규), 아카이브=`useArchiveActivities`, 저장공고=`useBookmarks`(북마크 토글 낙관적 제거). 로딩/빈 상태 처리.
2. ✅ **계정 이메일/이름**(`Pc/MobileAccountPage`) — 하드코딩(kjyook01@/이름이름/test@test.com) 제거 → `useMe`.
3. ✅ **이메일 마케팅 수신 동의 토글** — `PATCH /api/members/email-agreement {email_agreement}` 낙관적 연결. (초기값은 백엔드 read 부재로 기본 off — alarm과 동일 한계)
4. ✅ **관심직무 초기 로드**(`JobSection`) — `useMe`의 `selected_interested_jobs`를 컴포넌트 value로 역매핑해 편집 진입 시 기존값 표시.
5. ✅ **활동 카드 북마크**(`NewActivityList`) — 빈 핸들러 → `toggleBookmark` 낙관적 토글, `is_bookmarked`를 `useActivities` 매핑에 반영.
6. ✅ **검색결과 카드 북마크**(`PcSearchPage`) — 동일.
7. ✅ **홈 `ActivityList.tsx` Select** — 해당 파일은 **미사용 데드코드**로 확인(실 렌더 트리는 `NewActivityList`/`MobileActivityList`, 이미 연동). 빈 핸들러 위 주석만 추가.

**남은 한계**: 프로필 "더보기"는 아카이브만 `/profile/archive` 연결(활동결과/저장공고는 전용 목록 페이지 없어 미연결). 알림/이메일동의 초기값 read·인기검색어·리뷰수정 activity_id 등은 여전히 외부 대기(외부 확인 요청 참고).

## 활동 목록 필터 (2026-06)

- ✅ **직무유형(jobTag) 백엔드 연동 완료**: 대외활동 목록 필터의 직무유형 선택을 `GET /v1/activities?jobTag=...`(배열=반복 param)로 전송. 라벨→코드 매핑(기획=PLANNING, 디자인=DESIGN, 개발=DEVELOPMENT, 마케팅=MARKETING, AI=AI). PC(`NewActivityList`+`useActivities` 'latest' 분기)·모바일(`MobileActivityList`) 모두. **이전엔 백엔드 미전송 + 클라이언트 임시 필터라 불완전**했음(현재 불러온 목록 내에서만 필터).
- ✅ **모바일 "전체" 탭 필터 깨짐 수정**: `MobileActivityList`가 "전체" 탭에서 `fallbackOnEmpty` 미설정(기본 true)이라 필터 결과가 비면 **mock 데이터로 새던 문제** → 활동 목록은 항상 `fallbackOnEmpty:"false"`로 변경. (PC는 항상 카테고리가 있어 영향 없었음)
- ✅ **홈 메인(`/`) 모바일 "따끈따끈"(latest) 직무유형 필터 수정**: `_components/mobile/ActivityList.tsx`가 ① jobTag를 백엔드 미전송(클라 필터만) ② 데이터 비면 `CardData` mock fallback으로 필터 무시 → "안 바뀜". 직무유형→jobTag 백엔드 전송 + 필터 활성 시 mock 차단(빈 결과는 "조건에 맞는 활동 없음")으로 수정. (PC 홈 따끈따끈은 `NewActivityList`라 원래 정상)
- ⏳ **나머지 필터는 미연동/무동작**: 주최기관=클라 필터만(백엔드 `organizerType` param 미사용), **참여대상/활동분야/모집지역=선택해도 무동작(no-op)**. 백엔드 `GET /v1/activities`는 `organizerType/target/field/location` param을 모두 지원하나, **프론트 한글 라벨→백엔드 코드값 매핑을 몰라 미연동** → 아래 외부 요청 참고.

## 외부 확인 요청 (2026-06 최신) — 백엔드/디자이너 전달용

### 🔧 백엔드 요청/확인
| # | 항목 | 왜 필요 | 우선 |
|---|---|---|---|
| 1 | **리뷰 수정용 `activity_id`** — `GET /v1/reviews/{id}`(`MyReviewResponse`) 응답에 `activity_id` 추가 **또는** `ReviewUpdateRequest`의 `activity_id`를 optional로(서버가 review id로 식별) | 수정 PUT의 `activity_id`가 **required**인데 내 리뷰 단건/목록 응답에 그 값이 없어 **수정 저장 불가**. 응답에 추가되면 `mode="edit"` 리팩터로 즉시 완성 | ★최우선 |
| 2 | **알림 설정 현재값 조회 GET** (me 응답 포함 또는 별도) | PATCH 토글만 있어 스위치 **초기 on/off 표시 불가**(항상 off) | 중 |
| 3 | **인기 검색어 랭킹 API** (순위 + 순위변동 ↑↓ + 집계시각) | 검색 기록 카드의 **인기 검색어** 섹션 미구현(`recent-keywords`는 순위 없는 단순목록) | 중 |
| 4 | **만족도 "전체" 평균** 직접 제공 여부 | 현재 클라 집계 → 제공 시 단순화 | 낮 |
| 5 | **jobDetail 멀티 직렬화** 방식 (반복 param vs 콤마) | 리뷰 필터 직렬화 최종 확정 | 낮 |
| 6 | **상세탭 공모분야·모집인원·지원서 첨부 필드** 제공 여부 | 공고 상세내용 탭 빈 섹션 채움 | 낮 |
| 7 | (확인) `can_write_review=true`인데 `progress-status` PATCH 막히는 케이스 있는지 (ACCEPTED 조건) | 수료여부 저장 엣지케이스 | 낮 |
| 8 | **활동 목록 필터 코드값** — `GET /v1/activities`의 `organizerType/target/field/location` 각 허용 코드(enum) 리스트 | 주최기관·참여대상·활동분야·모집지역 필터 백엔드 연동(현재 라벨→코드 매핑 불가로 미동작). jobTag(직무유형)은 코드 확인되어 연동 완료 | 중 |

### 🎨 Figma(디자인) 확인
| # | 항목 | 비고 |
|---|---|---|
| 1 | **메인(MOBILE) 배너·tab bar** 위치·탭 너비 | MCP 호출 한도 회복 또는 PNG |
| 2 | **이메일 변경 최종 UX** | CustomModal footer(취소/확인) vs 인라인 버튼 역할 (현재 "확인하기"에서 검증+변경) |
| 3 | **자동완성(WordList) 정합** | 돋보기+행·hover 스타일 |
| 4 | **회원탈퇴 확인 모달** 전용 시안 유무 | 현재 `window.confirm`으로 가드 |
| 5 | **접근성** `LegalDocument` 리스트 시맨틱 교체 | 교체 시 시안 재검증 |

## 백엔드 답변 반영 (2026-06) — 도메인 분리 + 수료여부/ helpful 확정

> 백엔드가 **활동 결과 상태(지원/합불/수료)=`ActivityParticipation`** / **아카이브=기록 작성 여부**로 도메인 분리 후 배포 완료. api-spec엔 helpful 등록/취소(`POST·DELETE /v1/reviews/{reviewId}/helpful`) **단 하나만 미반영**, 나머지는 모두 반영됨.

**확정된 흐름 / 후속 작업:**
1. ✅ **수료여부 저장 방식 재작업 완료(2026-06)**: POST review body의 `progress_status` 제거 → 작성(create) submit에서 **`PATCH /api/activity-participations/{participationId}/progress-status {progress_status}` 선행 → `POST /api/review`**. 프록시 신규(`activity-participations/results` GET, `.../{participationId}/progress-status` PATCH), 타입 `ActivityParticipationResult`/`ApplicationStatus`/`ParticipationProgressStatus` 추가. `review/page.tsx`(서버)가 `results`에서 `activity_id` 매칭으로 `participationId`를 구해 폼까지 배선(Pc/Mobile→ReviewWriteBody→useReviewWriteForm). typecheck/eslint EXIT 0.
   - ⚠️ **한계**: participationId 없으면(미참여/비로그인) PATCH 스킵하고 review만 POST. (활동 변경 모달 교체는 2번에서 완료 → 모달 선택 시 participationId 전달됨.)
2. ✅ **활동 변경 모달 교체 완료(2026-06)**: `ActivityChangeModal` 데이터 소스를 `GET /api/archive` → **`GET /api/activity-participations/results`**로 교체(`useActivityParticipationResults` 훅 신규). `can_write_review === true`만 노출, 수료여부(progress_status) 컬럼 표시, 선택 시 `onApply(activity, activityId, participation_id)` → `changeActivity`로 participationId 전달(수료여부 PATCH 흐름 완결). typecheck/eslint EXIT 0.
   - ✅ **GNB 연필 진입 모달도 교체 완료(2026-06)**: `components/common/GNB/ReviewWriteModal.tsx`를 `useActivityParticipationResults`(results) 기반으로 전환 — `can_write_review`만 노출, 수료여부 컬럼 표시, activity_id로 `/activity/[id]/review` 이동(page.tsx가 participationId 재해석). 리뷰 작성 진입 2경로(공고상세 활동변경 / GNB 연필) 모두 results 기준 일관. typecheck/eslint EXIT 0.
3. ✅ **helpful(도움이 돼요) 연결 완료(2026-06)**: api-spec에 `POST·DELETE /v1/reviews/{id}/helpful`(body 없음, resp Unit) 추가 확인. 프록시 `src/app/api/reviews/[id]/helpful/route.ts`(POST/DELETE) 신규, 타입 `ActivityReviewItem`에 `helpful_count`·`is_helpful` 추가, `useActivityReviews`에 `toggleReviewHelpful`+`useReviewHelpful`(낙관적+롤백) 추가, PC `ReviewCard`·모바일 `ReviewListCard` 버튼에 카운트·토글·활성스타일 연결(잠금 카드는 비활성). typecheck/eslint EXIT 0.
4. **활동 결과 상태 API(신규 활용처)**: 지원완료 `POST /v1/activities/{id}/participations`, 취소 `DELETE`, 합불 `PATCH .../application-status`, 수료 `PATCH .../progress-status`(applicationStatus=ACCEPTED일 때만, 아니면 progressStatus=NOT_SELECTED 초기화). 결과목록 `.../results`, 카운트 `.../summary`. → 프로필 "활동 결과" 섹션·지원완료 토글 등에 활용 가능.
5. **아카이브 변경(영향 범위)**: 이제 `participationId` 기준 생성(progressStatus=COMPLETED만 가능). `GET /v1/archive`는 수료완료 참여이력 기준, 미작성도 목록에 나옴(`archiveId=null, writeStatus=NOT_WRITTEN`), 작성완료는 `writeStatus=COMPLETED`. 응답에 `activity_participation_id`(아카이브 작성용)·`activity_id`(공고보기용) 둘 다. → 기존 아카이브 작성/조회 코드 점검 필요.

> ※ **리뷰 수정의 `activity_id` 블로커**는 이 답변에 직접 언급 없음 — `MyReviewsResponse`/`MyReviewResponse`에 `activity_id` 추가 여부는 별도 확인 필요(participation 도입으로 경로가 생겼을 수 있음).

## Current Worktree State

> **상태(2026-06 업데이트):** 현재 작업 브랜치 **`feat/my-reviews`** (dev에서 분기, **아직 push 안 됨**, working tree 깨끗).
> - `79c4e16` feat: 부가기능 연동(알림 설정·이메일 변경·최근 검색기록) ← **최신**
> - `eb746aa` feat: 내가 작성한 리뷰 목록·삭제 + 작성 폼 edit 모드 재사용 리팩터
> - `60d99cd` style: 리뷰 탭 Figma 정합(만족도 헤딩 18px·gray-80, 드롭다운 15px, 칩 13px)
> - (이전 dev) `30ea323` 회원가입 placeholder 정합 / `6143e65` 리뷰 기능 전반 …
> 추적 제외: `picklab-be/`, `.claude/`, `.omc/`. 미추적 보존: `docs/api-spec.json`, `issues/`.
> **다음 세션 시작 시**: `feat/my-reviews` 브랜치에서 이어서. 필요 시 push/PR.

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

> **🔑 Figma MCP 연결 가능해짐 (2026-06):** picklab 파일(`fileKey=7PEqXV7XjAN2R6l1nnbAI9`) 권한 초대 적용됨. `mcp__figma__whoami`=Bumsu(qjatn50089@gmail.com), `get_metadata`/`get_design_context`/`get_screenshot`로 **node-id만 있으면 직접 디자인 추출 가능**. → 이전 "PNG 필요"로 막혔던 항목들(아래 4번)을 이제 figma로 직접 진행 가능. (주의: 큰 프레임은 메타데이터 토큰 초과 → 하위 node-id로 좁히거나 subagent로 파싱)

### 1. 백엔드 답변 후 마무리 (요청 발송됨, 대기 중)
- **수료여부**: POST /v1/review에 필드 추가 → 작성 저장 + 모달 수료여부 칸 표시
- **helpful(도움이 돼요)**: 카운트/토글 API → 리뷰 카드 버튼 숫자·동작 연결
- **만족도 전체 평균**: 백엔드 직접 제공 시 클라 집계 제거
- **jobDetail 멀티 직렬화** 방식 최종 확인
- **상세탭**: 공모분야·모집인원·지원서 첨부 필드 제공 시 섹션 채움

### 2. 리뷰 수정/삭제 (기획 3-5) — 🔶 데이터 레이어 골격 완료(2026-06), UI 진입점 결정 대기
**본인 식별 질문 해소**: api-spec 확인 결과 공고 상세 리뷰 목록(`ActivityReviewResponse`)에는 **작성자 플래그가 없다** → 공고 상세에서 "본인 리뷰"를 식별할 방법이 없음. 대신 백엔드가 본인 전용 엔드포인트를 제공(본인 판별은 서버 권한, 타인 접근 시 403):
```text
GET    /v1/reviews          내가 작성한 리뷰 목록   (MyReviewItem: id·title·organizer·organizer_type·activity_type·created_at·approval_status)
GET    /v1/reviews/{id}     내 리뷰 단건(수정 프리필)(MyReviewDetail: 점수+텍스트+url, 타인 403)
PUT    /v1/reviews/{id}     리뷰 수정              (ReviewUpdateRequest = Create와 동일 필드)
DELETE /v1/reviews/{id}     리뷰 삭제
```
→ **수정/삭제 UI는 "내 리뷰" 컨텍스트(프로필 영역)에서 노출하는 것이 스펙 정합.** (공고 상세에 버튼 달려면 백엔드가 `ActivityReviewResponse`에 `is_mine` 추가 필요 — 별도 요청 대상.)

**완료(골격):**
- 프록시 라우트: `GET/PUT/DELETE /api/reviews/[id]` + `GET /api/reviews` **이미 구현돼 있음**(확인). `POST /api/review`(작성)도 존재.
- 타입(`review.types.ts`): `ReviewApprovalStatus`(+라벨 PENDING/APPROVED/REJECTED), `MyReviewItem`, `MyReviewListData`, `MyReviewDetail`, `ReviewUpdatePayload` 추가.
- 훅(`src/hooks/useMyReviews.ts`): `useMyReviews`(목록·refetch), `useMyReview`(단건·프리필), `updateReview(id,payload)`, `deleteReview(id)`. typecheck/eslint EXIT 0.

**완료(수정 폼 재사용 리팩터, 2026-06):** `useReviewWriteForm`/`ReviewWriteBody`/`Step1`을 주입형으로 전환. **작성 동작 100% 보존**(기본 `mode='create'`).
- `useReviewWriteForm({ mode, reviewId, initialState, initialFileUrl, onSuccess, onLeave })`: `mode='edit'`이면 submit이 **PUT `updateReview`**로 분기, 미교체 시 `initialFileUrl`(기존 인증자료) 유지, 성공/나가기 목적지는 `onSuccess`/`onLeave`로 주입(미지정 시 활동 상세).
- `myReviewDetailToFormState(detail)` 헬퍼 추가: `MyReviewDetail` → 폼 초기값. (※ 수료여부·활동정보는 단건 응답에 없어 프리필 불가 → 빈 값.)
- `ReviewWriteBody`에 `mode`/`reviewId`/`initialState`/`initialFileUrl`/`onSuccess`/`onLeave` props 추가. `mode='edit'`이면 **"활동 변경" 트리거·모달 숨김**.
- `Step1`의 `onOpenChangeModal` 옵셔널화(미전달 시 활동 변경 버튼 숨김). typecheck/eslint EXIT 0.

**완료(내 리뷰 목록 + 삭제 UI, 2026-06, Figma PROFILE-004-001 `1136-75951` 정합):**
- 라우트 `/profile/posts`(`page.tsx` → `PcMyReviewsPage`/`MobileMyReviewsPage`).
- PC: SNB + "내가 작성한 리뷰" 테이블(width 750px, 6열: 활동명·주체기관·활동구분칩·작성일·승인여부·수정/삭제 pill). 활동명/주체기관 1줄 truncate.
- 모바일: `MobileProfile` 헤더 + 3탭(MY 활동/작성글/계정) + 카드 리스트(승인상태색+구분칩 / title / organizer / 작성일 / 케밥 `threeDots`→수정·삭제 드롭다운).
- 삭제: `DeleteReviewModal`("정말 삭제하시겠어요?" / green "삭제 안 할래요"=닫기 / outline "네, 삭제할게요"=삭제). 확인 시 `deleteReview` → `refetch`.
- 승인상태 라벨/색 디자인 정합: PENDING=승인중(gray-50), APPROVED=승인(info-50), REJECTED=미승인(danger-50). `REVIEW_APPROVAL_STATUS_LABELS`/`_TEXT_CLASS`/`reviewApprovalStatusLabel` 추가.
- `menus.ts`: SNB "작성 글"→"작성글", href `/profile/archive`→`/profile/posts`.
- typecheck/eslint EXIT 0. (적응: 모바일 디자인은 프로필 내 탭이지만 기존 mock 프로필 탭이 비동작이라 `/profile/posts` 별도 라우트 + 자체 헤더/탭(Link)으로 구현.)

**🚧 수정(edit) 블로커 — 백엔드 `activity_id` 필요:**
- `MyReviewsResponse`(목록)·`MyReviewResponse`(단건) 둘 다 **`activity_id` 없음**. 수정은 작성 폼 재사용이라 ① Step1 활동 카드 ② presigned ③ **PUT 페이로드 `activity_id`(필수)** 에 activity_id가 있어야 함 → **현재 응답만으론 수정 저장 불가**.
- 그래서 "수정" 버튼은 렌더하되 임시 안내(`window.alert`) + `TODO(edit)` 주석. 백엔드가 리뷰 응답에 `activity_id`(+ title/organizer) 추가하면, 이미 만든 `useReviewWriteForm mode="edit"` + `myReviewDetailToFormState`로 즉시 연결 가능.
- 페이지네이션 UI는 디자인에 없어 미구현(`useMyReviews` 기본 page 1/size 10).

### 3. 부가기능 (화면 미연동, 별도 영역)
검색 기록(`/search/history`), 알림(`/notifications` + SSE subscribe), 회원탈퇴(`withdrawal-survey`), 이메일 변경(`/members/email`), 알림 설정(`/members/notifications`) — 프록시 라우트는 있으나 화면 미구현.

**진행(2026-06, 부가기능 연동):**
- ✅ **알림 설정**(`profile/alarm`) — 토글 2개(인기 공고=POPULAR/저장한 공고=BOOKMARKED) → `PATCH /api/members/notifications {type}` 낙관적 업데이트+롤백. 🔧 **백엔드 read 필요**: PATCH 토글만 있고 현재 on/off 조회 GET이 없음(me 응답에도 없음) → 스위치 초기상태 항상 off. 조회 제공 시 마운트 초기값 채울 것.
- ✅ **이메일 변경**(`@modal/change-email`) — 인증요청(POST `email/code/send {email}`) → 확인하기(POST `email/code/verify {code}` 성공 시 POST `members/email {email}` 변경 적용) + 성공/오류 메시지. 🎨 **figma 확인 권장**: CustomModal footer(취소/확인)와 모달 내 인증요청/확인하기 버튼 역할 분담(현재 "확인하기"에서 검증+변경 처리, footer는 닫기).
- ✅ **최근 검색기록**(`search/_components/RecentSearchHistory` + `useSearchHistory` + `SearchEntryPage`) — Figma "검색 기록" 카드의 최근검색기록부 구현. 입력 비었을 때 칩 목록(8px gap, 308px wrap, 텍스트클릭=검색이동/X=개별삭제) + 전체삭제, 검색 실행 시 `POST /api/search/history {keyword}` 저장. GET/DELETE/DELETE-all 연동. 🚧 **인기 검색어(1~10위+순위변동 ↑↓)는 백엔드 미제공**(`recent-keywords`는 `{id,keyword,searched_at}` 단순목록·순위/변동 없음) → 랭킹+순위변동 API 추가 필요. 🎨 자동완성(WordList)은 기존 연동, 디자인 정합만 추후.
- ⏳ **회원탈퇴**: 화면(`WithdrawPage`) 있음, 연동 가능(다음 후보). **실시간 알림(SSE)**: 복잡, 별도.

### 4. Figma로 이제 가능 (이전 "PNG 필요"로 막혔던 QA 항목)
- ✅ **리뷰 탭 디자인 정합**(node `2408-26558`) **완료(2026-06)**: figma `get_design_context`로 전 요소 1:1 대조. 모호했던 50/24/20/132px·"삭제하여 노출"의 정체 규명 결과 — **대부분 이미 충족**(132px 드롭다운폭, 카드패딩 40/28, 총평점 24px+별점40, 세부별점24, 50px 마진, 만족도 gap 20px, 레이더 컨테이너 border/rounded·"삭제" 가설은 figma에도 border 있어 기각). 실제 figma 불일치 3건만 수정: ① "활동 만족도 평가" 헤딩 20px/gray-90 → **18px/gray-80**(`PcActivityDetailPage.tsx:592`) ② 정렬 드롭다운 텍스트 `Body3Medium`(14) → **`Body2Medium`(15)**(`ReviewFilters.tsx:67`) ③ 만족도 필터칩 `Caption1Medium`(12) → **`Body4Medium`(13)**(`JobFilterChip`). typecheck/eslint EXIT 0. (※ 로그인 전체공개 다건 카드는 별도 미검증 — 비로그인 잠금 카드 기준 figma와 일치)
- **메인 드롭다운 레이블** "활동유형 2 / 직무유형 2" 통합 형식 여부(현재 각 Select별 표시는 충족)
- **메인(MOBILE)** 배너/tab bar 위치·탭 너비(일부 CSV상 "반영")

### 5. 후속(비차단) 접근성 1건
- `LegalDocument` 리스트가 `<ol>/<ul>`에 수동 `1.`·`•` 주입 → 스크린리더 이중 announce. CSS `list-decimal/list-disc`로 교체 시 **시안 재검증 필요**.

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
> - ~~리뷰 탭 50px/24px/20px가 **어느 요소인지** 불명, "삭제하여 노출" 대상 불명~~ → ✅ **figma 직접 대조로 해소(2026-06)**: 132/50/40·28/24·40px 등은 이미 충족, "삭제하여 노출"(레이더 border 제거) 가설은 figma에도 border 있어 기각. figma 불일치 3건(만족도 헤딩 18px·gray-80, 드롭다운 15px, 칩 13px)만 수정 완료 → 위 Main Remaining Work 4번 참고.
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
수료여부 저장/조회, helpful API, 만족도 전체평균, jobDetail 멀티 직렬화, 닉네임 중복 체크 API, 회원가입 새 enum(college/dropped_out/on_leave), 상세탭 공모분야·지원서 첨부 필드, **리뷰 응답(`MyReviewsResponse`/`MyReviewResponse`)에 `activity_id`(+title/organizer) 추가 — 리뷰 수정 기능 활성화에 필수**.

## Recommended Next Prompt

```text
docs/next-claude-code-handoff.md 읽고 이어서 작업해줘.
백엔드 답변이 오면 Main Remaining Work 1번(수료여부/helpful/만족도 전체평균)을 마무리하고,
이어서 2번 리뷰 수정/삭제(기획 3-5)를 구현해줘.
이미 구현된 리뷰 조회/통계/필터/작성/상세탭은 건드리지 말고, Connection Notes의 가정만 실응답으로 확정해줘.
```
