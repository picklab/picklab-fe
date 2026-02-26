## 1. Spec Alignment

- [x] 1.1 북마크 명세 엔드포인트(`activities/{id}/bookmarks`, `bookmarks`)와 현재 route 매핑을 확정한다
- [x] 1.2 method/path/query/auth/status 기준으로 구현 갭을 식별한다

## 2. Route Implementation Updates

- [x] 2.1 `src/app/api/activities/[id]/bookmarks/route.ts`의 생성/해제 동작을 명세 기준으로 정렬한다
- [x] 2.2 `src/app/api/bookmarks/route.ts`의 목록 조회 query 전달 및 응답 전달을 명세 기준으로 정렬한다
- [x] 2.3 필요 시 공통 프록시 유틸을 사용해 인증/응답 처리 일관성을 맞춘다

## 3. Verification

- [ ] 3.1 토큰 누락(401), 생성 성공(201), 생성 실패(400), 해제 실패(404), 서버 오류(500) 시나리오를 점검한다
- [ ] 3.2 목록 조회 필터/정렬/페이징 쿼리 전달이 정상 동작하는지 점검한다
- [ ] 3.3 수동 호출 또는 테스트 코드로 회귀 검증 후 체크리스트를 완료한다
