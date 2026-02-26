## ADDED Requirements

### Requirement: Review API route SHALL create review via backend proxy
리뷰 등록 라우트는 클라이언트 요청을 백엔드 `POST /v1/review`로 전달해 리뷰 등록을 수행해야 한다.

#### Scenario: Create review request is proxied
- **WHEN** 클라이언트가 `/api/review`로 JSON body를 포함한 POST 요청을 보낸다
- **THEN** API route는 동일 body와 `Authorization` 헤더를 포함해 백엔드 `POST /v1/review`를 호출한다

### Requirement: Review API route SHALL enforce cookie-based authentication
리뷰 등록 라우트는 `accessToken` 쿠키를 필수로 요구해야 한다.

#### Scenario: Missing access token for review create
- **WHEN** `accessToken` 없이 `/api/review`를 호출한다
- **THEN** API route는 401 상태의 JSON 오류 응답을 반환한다

### Requirement: Review API route SHALL preserve backend response status and body
리뷰 등록 라우트는 백엔드 응답의 상태 코드와 본문을 그대로 반환해야 한다.

#### Scenario: Backend returns success response
- **WHEN** 백엔드가 리뷰 등록 성공 응답을 반환한다
- **THEN** API route는 동일한 상태 코드와 응답 본문을 반환한다
