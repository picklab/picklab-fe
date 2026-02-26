## Why

회원 관련 API 명세와 Next.js API route 구현을 change 단위로 정렬해, 구현 시작 전에 요구사항과 범위를 고정해야 합니다. 현재 라우트가 존재하더라도 명세 기반 검증 기준이 없어 회귀 위험이 있습니다.

## What Changes

- 회원 API 프록시 라우트(소셜 로그인 정보 조회 포함)의 메서드/경로/인증/응답 전달 규칙을 명세화합니다.
- 검색 기록 API(`/v1/search/history`)의 조회/생성/전체 삭제 동작을 명세화합니다.
- 리뷰 등록 API(`/v1/review`) 프록시 동작을 명세화합니다.
- 이후 구현 단계에서 라우트 정합성 점검 및 필요한 수정(요청 전달, 상태코드/응답 본문 전달, 오류 처리 통일)을 수행할 수 있도록 작업 단위를 정의합니다.

## Capabilities

### New Capabilities
- `member-api-proxy-alignment`: 회원 정보 수정/이메일 변경/이메일 인증/추가 정보/탈퇴 설문/소셜 로그인 정보 조회 관련 API route의 프록시 요구사항
- `search-history-api-proxy`: 검색 기록 조회/생성/전체 삭제 API route의 프록시 요구사항
- `review-api-proxy`: 리뷰 등록 API route의 프록시 요구사항

### Modified Capabilities
- (none)

## Impact

- Affected code:
  - `src/app/api/members/profile-image/route.ts`
  - `src/app/api/members/job-categories/route.ts`
  - `src/app/api/members/info/route.ts`
  - `src/app/api/members/withdrawal-survey/route.ts`
  - `src/app/api/members/signup/additional-info/route.ts`
  - `src/app/api/members/email/route.ts`
  - `src/app/api/members/email/code/send/route.ts`
  - `src/app/api/members/email/code/verify/route.ts`
  - `src/app/api/members/social-logins/route.ts`
  - `src/app/api/search/history/route.ts`
  - `src/app/api/review/route.ts`
- API behavior: 인증 토큰 누락 처리와 백엔드 응답(status/body) 전달 일관성
- Dependencies: `ky`, `NextRequest/NextResponse`, `EXTERNAL_API_BASE_URL`
