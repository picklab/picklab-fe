## ADDED Requirements

### Requirement: Activity bookmark routes SHALL enforce cookie-based authentication
Activity bookmark create/delete/list API routes MUST verify `accessToken` in request cookies and MUST return 401 without calling backend when the token is missing.

대상 라우트:
- `POST /api/activities/{activityId}/bookmarks`
- `DELETE /api/activities/{activityId}/bookmarks`
- `GET /api/bookmarks`

#### Scenario: Missing access token
- **WHEN** 요청 쿠키에 `accessToken`이 없다
- **THEN** API route는 401 상태의 JSON 오류 응답을 반환한다

### Requirement: Activity bookmark create/delete SHALL proxy path parameter and method
Activity bookmark create/delete routes MUST preserve path parameter `activityId` and MUST proxy using the same HTTP method to backend endpoints.

매핑 규칙:
- `POST /api/activities/{activityId}/bookmarks` -> `POST /v1/activities/{activityId}/bookmarks`
- `DELETE /api/activities/{activityId}/bookmarks` -> `DELETE /v1/activities/{activityId}/bookmarks`

#### Scenario: Create bookmark request is proxied
- **WHEN** 인증된 사용자가 특정 `activityId`로 북마크 생성 요청을 보낸다
- **THEN** API route는 동일 `activityId` 경로로 backend 생성 엔드포인트를 호출한다

#### Scenario: Remove bookmark request is proxied
- **WHEN** 인증된 사용자가 특정 `activityId`로 북마크 해제 요청을 보낸다
- **THEN** API route는 동일 `activityId` 경로로 backend 해제 엔드포인트를 호출한다

### Requirement: Bookmark list route SHALL forward query filters to backend
Bookmark list route MUST forward spec-defined query parameters to backend without dropping or renaming keys.

지원 쿼리:
- `activityTypes[]`
- `jobGroups[]`
- `recruitmentStatus`
- `sortType`
- `page`
- `size`

#### Scenario: Filtered bookmark list request
- **WHEN** 사용자가 필터/정렬/페이징 쿼리를 포함해 `/api/bookmarks`를 호출한다
- **THEN** API route는 동일 쿼리로 `GET /v1/bookmarks`를 호출한다

### Requirement: Activity bookmark routes SHALL preserve backend response status and body
Bookmark routes MUST preserve backend response status code and response body as-is.

#### Scenario: Create returns 201
- **WHEN** backend가 북마크 생성 성공으로 201을 반환한다
- **THEN** API route는 201 상태와 응답 본문을 그대로 반환한다

#### Scenario: Delete returns not found
- **WHEN** backend가 북마크 미존재로 404를 반환한다
- **THEN** API route는 404 상태와 응답 본문을 그대로 반환한다

### Requirement: Bookmark integration surfaces SHALL be documented for implementation traceability
Bookmark integration UI surfaces MUST be documented for implementation traceability and MUST be maintained against the paths listed below.

대상 경로:
- `src/app/(home)/_components/pc/ActivityList.tsx`
- `src/app/(home)/_components/mobile/ActivityList.tsx`
- `src/app/(home)/[activities]/_components/ActivityList.tsx`
- `src/app/(home)/[activities]/_components/MobileActivityList.tsx`
- `src/app/(home)/activity/[id]/_components/PcActivityDetailPage.tsx`
- `src/app/(home)/activity/[id]/_components/MobileActivityDetailPage.tsx`

#### Scenario: Bookmark implementation planning
- **WHEN** 팀이 북마크 관련 구현 또는 유지보수를 수행한다
- **THEN** 문서에 명시된 UI 경로를 기준으로 영향 범위를 확인할 수 있다
