Yarn Berry

- 오프라인 설치 및 빠른 재설치
- 일관된 개발 환경
- 디스크 공간 효율성

[통신 구조 - Backend for Frontend(BFF)]
Client(브라우저) -> Next Api Route -> 백엔드 API 서버 흐름

- BFF 프론트엔드 전용 백엔드를 위한 Next Api Route 서버 레이어 추가
- 필요한 데이터만 추려 클라이언트에서 사용하기 좋은 구조로 받기 위함 (응답 포맷 통일 / 데이터 가공)
- 브라우저에 노출되면 안되는 auth 처리 용이

[크롤링 MVP]

- DB 없이 먼저 크롤링 결과를 JSON으로 확인할 수 있도록 `scripts/crawl-page.mjs` 추가
- `playwright` 기반으로 페이지를 열고, CSS selector로 활동 목록을 추출

예시:

```bash
yarn crawl \
  --url "https://example.com/activities" \
  --list ".activity-card" \
  --title ".activity-card__title" \
  --organizer ".activity-card__org" \
  --summary ".activity-card__summary" \
  --link "a" \
  --category ".activity-card__category" \
  --thumbnail "img" \
  --startDate ".activity-card__start" \
  --endDate ".activity-card__end" \
  --limit 10
```

페이지 본문 텍스트만 먼저 보고 싶으면:

```bash
yarn crawl --url "https://example.com/activities" --dumpPageText
```
