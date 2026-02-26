## ADDED Requirements

### Requirement: Search history API route SHALL support list/create/delete-all operations
검색 기록 프록시 라우트는 조회(GET), 생성(POST), 전체 삭제(DELETE)를 지원해야 한다.

#### Scenario: Search history methods are available
- **WHEN** 클라이언트가 `/api/search/history`로 GET, POST, DELETE 요청을 보낸다
- **THEN** API route는 각 method를 처리하고 대응되는 백엔드 `/v1/search/history`로 전달한다

### Requirement: Search history API route SHALL enforce cookie-based authentication
검색 기록 라우트는 요청 쿠키의 `accessToken`을 확인하고, 누락 시 401 응답을 반환해야 한다.

#### Scenario: Missing access token for search history
- **WHEN** `accessToken` 없이 `/api/search/history`를 호출한다
- **THEN** API route는 401 상태의 JSON 오류 응답을 반환한다

### Requirement: Search history GET SHALL forward pagination query parameters
검색 기록 조회(GET)는 `page`, `size` 등 쿼리 파라미터를 백엔드로 그대로 전달해야 한다.

#### Scenario: Forward query parameters
- **WHEN** 클라이언트가 `/api/search/history?page=1&size=20`으로 요청한다
- **THEN** API route는 동일한 쿼리 파라미터로 백엔드 `GET /v1/search/history`를 호출한다

### Requirement: Search history API route SHALL preserve backend response status and body
검색 기록 라우트는 백엔드 응답의 status와 body를 그대로 반환해야 한다.

#### Scenario: Backend returns successful page response
- **WHEN** 백엔드가 200 상태로 검색 기록 응답을 반환한다
- **THEN** API route는 동일한 200 상태와 응답 본문을 반환한다
