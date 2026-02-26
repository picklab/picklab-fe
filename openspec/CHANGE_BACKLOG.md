# picklab-fe OpenSpec Change Backlog

목표: "picklab-fe 완성"을 구현 가능한 작은 change로 분해해 순차적으로 완료한다.

## 사용 방법

1. 아래 change 중 우선순위 1개를 선택
2. `/opsx:propose <change-name>` 또는 `openspec new change "<change-name>"` 실행
3. artifact(`proposal.md`, `design.md`, `tasks.md`) 작성/보완
4. `/opsx:apply <change-name>`로 구현
5. 완료 후 `/opsx:archive <change-name>`

## 추천 구현 순서

1. `stabilize-auth-session-flow`
2. `complete-activity-list-filter-and-pagination`
3. `complete-search-history-and-autocomplete-experience`
4. `complete-activity-detail-bookmark-and-review-flow`
5. `complete-signup-validation-and-submit`
6. `complete-profile-info-edit-flow`
7. `complete-profile-archive-list-and-detail`
8. `complete-notification-read-and-recent-flow`
9. `harden-bff-error-contract-and-retry-policy`
10. `add-smoke-e2e-for-core-user-journeys`

## Change 목록 (상세)

## 1) `stabilize-auth-session-flow`

- 목적: 로그인/콜백/로그아웃에서 세션 및 리다이렉트 흐름 안정화
- 포함 범위:
  - `src/app/(auth)/signin/page.tsx`
  - `src/app/(auth)/callback/[provider]/page.tsx`
  - `src/app/api/auth/*`
  - `src/contexts/AuthContext.tsx`
- 완료 기준:
  - 소셜 로그인 성공/실패 시 사용자 안내가 일관됨
  - 새로고침 후 세션 상태가 깨지지 않음
  - 로그아웃 시 캐시/상태가 즉시 초기화됨
- 의존성: 없음

## 2) `complete-signup-validation-and-submit`

- 목적: 회원가입 4단계 입력 검증, 에러 처리, 제출 성공 흐름 완성
- 포함 범위:
  - `src/app/(auth)/signup/page.tsx`
  - `src/app/(auth)/signup/components/*`
  - `src/app/api/members/*`
- 완료 기준:
  - 단계별 유효성 검증과 버튼 활성화 규칙 확정
  - API 실패 메시지 매핑 및 재시도 동작 구현
  - 완료 후 로그인 또는 홈 이동 흐름 정리
- 의존성: `stabilize-auth-session-flow`

## 3) `complete-activity-list-filter-and-pagination`

- 목적: 활동 목록 페이지 필터/정렬/페이지네이션 동작 완성 (PC/모바일)
- 포함 범위:
  - `src/app/(home)/[activities]/page.tsx`
  - `src/app/(home)/[activities]/_components/*`
  - `src/app/api/activities/route.ts`
- 완료 기준:
  - 필터 변경 시 목록/카운트가 정확히 동기화됨
  - 모바일 바텀시트 필터 적용/초기화 동작 완성
  - 페이지 이동과 쿼리 파라미터 동기화
- 의존성: 없음

## 4) `complete-activity-detail-bookmark-and-review-flow`

- 목적: 활동 상세에서 북마크/리뷰 조회·작성 UX 완성
- 포함 범위:
  - `src/app/(home)/activity/[id]/page.tsx`
  - `src/app/api/activities/[id]/*`
  - `src/app/api/review/route.ts`
  - `src/app/api/reviews/*`
- 완료 기준:
  - 북마크 토글 결과가 리스트/상세에 일관 반영
  - 리뷰 작성 후 낙관적 업데이트 또는 재조회 전략 확정
  - 비로그인 상태 액션 처리(로그인 유도) 명확화
- 의존성: `stabilize-auth-session-flow`

## 5) `complete-search-history-and-autocomplete-experience`

- 목적: 검색 자동완성/최근검색어/검색결과 페이지를 하나의 흐름으로 완성
- 포함 범위:
  - `src/app/(home)/search/[search]/page.tsx`
  - `src/app/(home)/search/_components/*`
  - `src/app/api/search/*`
- 완료 기준:
  - 자동완성 선택, 직접 입력, 최근검색어 클릭 동작 통합
  - 삭제/전체삭제 동작 및 동기화 일관성 확보
  - 빈 결과/에러/로딩 상태 UI 확정
- 의존성: 없음

## 6) `complete-profile-info-edit-flow`

- 목적: 프로필 정보/직무/이미지/이메일 관련 수정 흐름 완성
- 포함 범위:
  - `src/app/(home)/profile/account/info/*`
  - `src/app/api/members/info/route.ts`
  - `src/app/api/members/profile-image/route.ts`
  - `src/app/api/members/email*`
- 완료 기준:
  - 입력 변경 감지 및 저장 버튼 상태 일관화
  - 이미지 업로드 실패/취소/재업로드 처리 명확화
  - 이메일 변경 모달 연동 및 코드 검증 동작 완료
- 의존성: `stabilize-auth-session-flow`

## 7) `complete-profile-archive-list-and-detail`

- 목적: 프로필의 아카이브 목록/상세 화면 완성
- 포함 범위:
  - `src/app/(home)/profile/archive/page.tsx`
  - `src/app/(home)/profile/archive/[id]/page.tsx`
  - `src/app/api/archive/*`
- 완료 기준:
  - 목록 페이징/정렬/빈 상태 UI 완성
  - 상세 데이터 표시 규칙과 예외 처리 통일
  - 모바일/PC UI 동등성 검증
- 의존성: 없음

## 8) `complete-notification-read-and-recent-flow`

- 목적: 알림 최근 목록, 읽음 처리, 전체 읽음 동작 완성
- 포함 범위:
  - `src/app/(home)/profile/alarm/page.tsx`
  - `src/app/api/notifications/*`
- 완료 기준:
  - 개별 읽음/전체 읽음 후 UI 즉시 반영
  - 최근 알림 조회 실패 시 대체 UX 제공
  - 페이지 진입 시점과 읽음 상태 동기화 정책 확정
- 의존성: `stabilize-auth-session-flow`

## 9) `harden-bff-error-contract-and-retry-policy`

- 목적: Next API Route(BFF) 에러 형식 표준화 + 재시도 정책 정리
- 포함 범위:
  - `src/app/api/**/route.ts`
  - `src/lib/api.ts`
  - `src/lib/ky.ts`
  - `src/config/error-codes.config.ts`
- 완료 기준:
  - 공통 에러 응답 포맷(코드/메시지/상세) 통일
  - 4xx/5xx/네트워크 에러 처리 규칙 문서화
  - 클라이언트 재시도 조건 명확화 및 적용
- 의존성: 없음 (하지만 다른 change 완료 전에 선행하면 품질 상승)

## 10) `add-smoke-e2e-for-core-user-journeys`

- 목적: 핵심 사용자 여정에 대한 스모크 E2E 테스트 추가
- 포함 범위:
  - 로그인
  - 활동 탐색/상세 진입
  - 북마크 또는 리뷰
  - 프로필 기본 조회
- 완료 기준:
  - CI에서 최소 스모크 시나리오 자동 실행
  - 실패 시 원인 추적 가능한 로그/스크린샷 확보
  - 릴리즈 전 수동 확인 범위 축소
- 의존성:
  - `stabilize-auth-session-flow`
  - `complete-activity-list-filter-and-pagination`
  - `complete-activity-detail-bookmark-and-review-flow`

## 첫 주 실행 추천

사용자 체감이 큰 핵심 여정 + 인증 안정화를 같이 가져가는 순서:

1. `stabilize-auth-session-flow`
2. `complete-activity-list-filter-and-pagination`
3. `complete-search-history-and-autocomplete-experience`

위 3개 완료 후 `activity detail`, `signup`, `profile` 순으로 확장하는 전략을 추천.
