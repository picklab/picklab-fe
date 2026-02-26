## 1. Spec Alignment

- [x] 1.1 명세 대상 엔드포인트(회원/검색기록/리뷰)와 현재 `src/app/api` 라우트 매핑표를 확정한다
- [x] 1.2 엔드포인트별 method/path/auth/status 전달 요구사항 기준으로 구현 갭을 식별한다

## 2. Members API Route Updates

- [x] 2.1 `members/profile-image`, `members/job-categories`, `members/info` 라우트의 요청 전달/응답 전달 로직을 명세 기준으로 정렬한다
- [x] 2.2 `members/withdrawal-survey`, `members/signup/additional-info` 라우트의 인증/응답 전달 로직을 점검하고 필요한 수정을 반영한다
- [x] 2.3 `members/email`, `members/email/code/send`, `members/email/code/verify`, `members/social-logins` 라우트의 인증/요청 전달/상태코드 전달을 명세 기준으로 정렬한다

## 3. Search and Review API Route Updates

- [x] 3.1 `search/history` GET/POST/DELETE 라우트의 query/body 전달과 응답 전달을 명세 기준으로 정렬한다
- [x] 3.2 `review` POST 라우트의 인증/요청 전달/응답 전달을 명세 기준으로 정렬한다

## 4. Verification

- [ ] 4.1 토큰 누락(401), 정상 요청(200), 백엔드 검증 오류(400) 시나리오를 라우트별로 점검한다
- [ ] 4.2 변경된 라우트에 대해 수동 호출 또는 테스트 코드로 회귀 확인 후 체크리스트를 완료한다
