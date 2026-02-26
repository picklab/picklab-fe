## ADDED Requirements

### Requirement: Member API routes SHALL enforce cookie-based authentication
회원 관련 프록시 라우트는 요청 쿠키에서 `accessToken`을 확인해야 하며, 토큰이 없으면 백엔드 호출 없이 401 응답을 반환해야 한다.

대상 라우트:
- `PUT /api/members/profile-image`
- `PUT /api/members/job-categories`
- `PUT /api/members/info`
- `POST /api/members/withdrawal-survey`
- `POST /api/members/signup/additional-info`
- `POST /api/members/email`
- `POST /api/members/email/code/send`
- `POST /api/members/email/code/verify`
- `GET /api/members/social-logins`

#### Scenario: Missing access token
- **WHEN** 요청 쿠키에 `accessToken`이 없다
- **THEN** API route는 401 상태로 JSON 오류 응답을 반환한다

### Requirement: Member API routes SHALL proxy method, path, and payload rules to backend
대상 라우트는 명세된 백엔드 `/v1/...` 엔드포인트로 동일 HTTP method를 사용해 요청을 전달해야 하며, body가 있는 요청은 JSON body를 전달해야 한다.

매핑 규칙:
- `/api/members/profile-image` -> `PUT /v1/members/profile-image`
- `/api/members/job-categories` -> `PUT /v1/members/job-categories`
- `/api/members/info` -> `PUT /v1/members/info`
- `/api/members/withdrawal-survey` -> `POST /v1/members/withdrawal-survey`
- `/api/members/signup/additional-info` -> `POST /v1/members/signup/additional-info`
- `/api/members/email` -> `POST /v1/members/email`
- `/api/members/email/code/send` -> `POST /v1/members/email/code/send`
- `/api/members/email/code/verify` -> `POST /v1/members/email/code/verify`
- `/api/members/social-logins` -> `GET /v1/members/social-logins`

#### Scenario: Authorized member request is proxied
- **WHEN** 클라이언트가 유효한 `accessToken`과 JSON body로 요청한다
- **THEN** API route는 `Authorization: Bearer <token>` 헤더와 JSON body를 포함해 백엔드로 전달한다

### Requirement: Member API routes SHALL preserve backend response status and body
대상 라우트는 백엔드 응답의 상태 코드와 본문을 그대로 클라이언트에 전달해야 한다.

#### Scenario: Backend returns business validation error
- **WHEN** 백엔드가 400/401/500 등 비정상 상태와 JSON 본문을 반환한다
- **THEN** API route는 동일 상태 코드와 본문을 클라이언트에 반환한다
