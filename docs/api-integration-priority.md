# API Integration Tasks

현재 코드 기준 남아있는 API 연동 작업과 완료된 작업 정리입니다.

## Remaining Tasks

| 우선순위 | 상태 | 영역 | 현재 상태 | 필요한 API / 확인사항 | 해야 할 작업 | 차단 여부 |
|---|---|---|---|---|---|---|
| 1 | 백엔드 대기 | 검색 결과 목록 | `/search` 진입 화면 자동완성은 실제 API 연동, `/search/[search]` 결과 목록은 로컬 JSON 검색 | `GET /v1/search?keyword=&page=&size=` 실제 결과 응답 필요 | 검색 결과 응답 스펙 확정 후 PC/모바일 검색 결과 페이지 실제 API 연동 | 차단됨 |
| 2 | 확인 필요 | 추천 활동 | API 연결은 됐지만 응답 빈 배열 | `GET /v1/activities/recommendations` 추천 조건 / 데이터 존재 여부 확인 | 응답이 채워지면 홈 추천 활동 섹션 재검증 | 부분 차단 |
| 3 | 재확인 필요 | 최근 본 활동 섹션 | 상세 진입 시 view 기록 API는 호출 중, 목록 API는 빈 배열 응답 | `GET /v1/activities/recently-viewed` 기록 반영 조건 확인 | 상세 조회 후 최근 본 활동 목록이 채워지는지 재검증 | 부분 차단 |
| 4 | 작업 가능 | 회원가입 추가 정보 저장 | 마지막 단계가 `console.log` + `alert` TODO 상태 | `POST /v1/members/signup/additional-info` 명세 확인 완료 | 회원가입 완료 시 추가 정보 저장 API 호출 | 작업 가능 |
| 5 | 확인 필요 | 아카이브 조회 | 북마크 보관함은 연동 완료, 활동 기록 아카이브 목록 조회 API는 명세에서 미확인 | `GET /v1/archive` 또는 `GET /v1/archive/{archiveId}` 필요 | 활동 기록 아카이브 화면이 필요하면 조회 API 확인 후 연동 | 차단됨 |
| 6 | 확인 필요 | 목록 필터 정확도 | 카테고리 목록의 주최기관/관련직무만 클라이언트 필터 가능 | 참여대상/활동분야/모집지역 필드 추가 또는 백엔드 필터 쿼리 지원 필요 | 필드/쿼리 확정 후 목록 필터 실제 조건 반영 | 부분 차단 |

## Completed / Connected

| 우선순위 | 상태 | 영역 | 현재 상태 | 연동해야 할 API | 해야 할 작업 | 이유 / 영향 |
|---|---|---|---|---|---|---|
| 1 | 완료 | 활동 상세 페이지 | 실제 API 우선 조회, 실패 시 로컬 fallback | `GET /v1/activities/{activityId}` | 상세 페이지를 실제 API 응답으로 매핑 | 홈/목록에서 실제 API 공고를 눌렀을 때 상세 404 가능성 완화 |
| 2 | 완료 | 최근 본 활동 기록 | 상세 진입 시 API 호출 + 로컬스토리지 fallback | `POST /v1/activities/{activityId}/view` | 상세 진입 시 view API 호출 | `recently-viewed` API 데이터 적재 기반 마련 |
| 3 | 완료 | 카테고리 목록 페이지 | 실제 API 우선 조회, 실패 시 기존 fallback | `GET /v1/activities?category=&sort=&page=&size=` | `/activities`, `/education`, `/contest`, `/seminar` 목록 실제 API 연동 | 실제 DB 기준 카테고리 목록 표시 |
| 4 | 완료 | 홈 인기 활동 | 실제 API 우선 조회, 실패 시 로컬 fallback | `GET /v1/activities/popular` | 홈 인기 활동 실제 API 연동 | 실제 DB 기준 인기 활동 표시 |
| 5 | 완료 | 홈 추천 활동 | API 호출 연결 완료, 현재 응답 빈 배열 | `GET /v1/activities/recommendations` | 홈 추천 활동 API 연결 | 응답 데이터가 생기면 바로 화면 반영 가능 |
| 6 | 완료 | 홈 최근 본 활동 | API 호출 연결 완료, 현재 응답 빈 배열 | `GET /v1/activities/recently-viewed` | 홈 최근 본 활동 API 연결 | 응답 데이터가 생기면 바로 화면 반영 가능 |
| 7 | 완료 | 홈 방금 올라온 활동 | 실제 API 우선 조회, 실패 시 로컬 fallback | `GET /v1/activities` | 홈 최신 활동 실제 API 연동 | 실제 DB 기준 최신 활동 표시 |
| 8 | 완료 | 검색 자동완성 | `/search` 진입 화면에 실제 자동완성 연결 | `GET /v1/search/autocomplete?keyword=&limit=` | 자동완성 추천어 API 연동 | 검색 진입 UX 실제 데이터 기반 동작 |
| 9 | 완료 | 북마크 보관함 | 프로필 보관함 화면을 실제 북마크 목록 API로 교체 | `GET /v1/bookmarks` | PC/모바일 보관함 목록 실제 API 연동 | 사용자가 북마크한 활동 목록 표시 |

## Recommended Order

1. 검색 결과 목록 API 응답 스펙 확인
2. 회원가입 추가 정보 저장 연동
3. 최근 본 활동 / 추천 활동 빈 응답 재확인
4. 활동 기록 아카이브 조회 API 필요 여부 확인
5. 목록 필터용 필드 또는 쿼리 지원 확인

## Notes

- `popular`, `latest` 계열 홈 목록은 실제 API 호출을 우선 시도하도록 연결되어 있음.
- `GET /v1/search/autocomplete?keyword=&limit=`는 정상 응답 확인 후 `/search` 진입 화면에 연동함.
- `GET /v1/search?keyword=`는 인증 포함 요청에서도 현재 `"Search endpoint ready"`만 반환하므로 검색 결과 목록 API 응답 스펙 확인이 필요함.
- `recommendations`, `recently-viewed`는 인증 후 `200 OK`가 내려오지만 현재 `items: []` 상태가 확인됨.
- `POST /v1/members/signup/additional-info` 명세는 있음. 요청 body는 `nickname`, `education_level`, `school`, `graduation_status`, `employment_status`, `company`, `employment_type`, `interested_job_categories` 구조임.
- 보관함 관련으로 `GET /v1/bookmarks` 명세는 있고, PC/모바일 프로필 보관함 화면에 연동함. 아카이브 생성/수정은 `POST /v1/archive`, `PATCH /v1/archive/{archiveId}`가 있으나 `GET /v1/archive` 목록 조회는 현재 명세에서 확인되지 않음.
- 활동 목록 응답에는 실제 주최기관명 필드가 없고 `organization`이 기관 유형 enum으로 내려옴.
- 활동 상세 응답도 실제 주최기관명 필드 없이 `organization` 기관 유형 enum을 내려줌.
- 카테고리 목록의 백엔드 enum은 `EXTRACURRICULAR`, `EDUCATION`, `COMPETITION`, `SEMINAR` 기준으로 매핑함.
- 카테고리 필터 중 주최기관/관련직무는 API 목록 응답 기준으로 클라이언트 필터링 가능하지만, 참여대상/활동분야/모집지역은 목록 응답 필드가 부족해 정확한 필터링을 위해 백엔드 쿼리 지원 또는 목록 필드 추가가 필요함.
