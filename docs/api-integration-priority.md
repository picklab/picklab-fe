# API Integration Tasks

현재 코드 기준 API 연동 상태와 남은 확인 사항입니다.

## Now Connected

| 우선순위 | 상태 | 영역 | 연결 API | 반영 내용 | 검증 |
|---|---|---|---|---|---|
| 1 | 완료 | 활동 목록/홈 | `GET /v1/activities`, `GET /v1/activities/popular`, `GET /v1/activities/recommendations`, `GET /v1/activities/recently-viewed` | 홈/카테고리/목록 카드 실제 API 연동 | 타입 체크 통과 |
| 2 | 완료 | 활동 상세 | `GET /v1/activities/{activityId}` | 상세 화면 실제 API 우선 조회, 실패 시 기존 fallback | 타입 체크 통과 |
| 3 | 완료 | 최근 본 활동 기록 | `POST /v1/activities/{activityId}/view` | 상세 진입 시 조회 기록 API 호출 | 타입 체크 통과 |
| 4 | 완료 | 검색 자동완성 | `GET /v1/search/autocomplete?keyword=&limit=` | 검색 진입 화면 자동완성 실제 API 연동 | 타입 체크 통과 |
| 5 | 완료 | 검색 결과 | `GET /v1/search/activities` | PC/모바일 검색 결과를 카테고리별 페이지 API로 연동 | 타입 체크/빌드 통과 / 인증 응답 재검증 필요 |
| 6 | 완료 | 북마크 보관함 | `GET /v1/bookmarks`, 북마크 토글 API | 프로필 보관함 PC/모바일 실제 북마크 목록 연동 | 타입 체크 통과 |
| 7 | 완료 | 아카이브 활동 목록 | `GET /v1/archive` | 프로필 아카이브 PC/모바일을 수료 완료 활동 이력 목록으로 교체 | 타입 체크/빌드 통과 / 인증 응답 재검증 필요 |
| 8 | 부분 완료 | 아카이브 상세/작성 | `GET /v1/archive` | 상세/작성 화면 상단 활동 정보와 공고 보기 이동을 목록 API 데이터로 연결 | 저장 API 스펙 확인 필요 |
| 9 | 완료 | 회원가입 추가 정보 저장 | `POST /v1/members/signup/additional-info` | `/signup` Step3 완료 시 추가 정보 저장 | 타입 체크 통과 / 소셜 로그인 후 실환경 검증 필요 |
| 10 | 완료 | 소셜 로그인 provider 분기 | `GET /v1/auth/login/{provider}` | 카카오/네이버/구글/깃허브 버튼별 provider 분기 | 타입 체크 통과 |
| 11 | 완료 | 마감 지난 공고 숨김 | 목록 응답의 `recruitment_end_type`, `dday` | `FIXED` + `dday < 0` 공고를 프론트 목록에서 제외 | 타입 체크 통과 |
| 12 | 완료 | 기관명 분리 | 목록/상세 응답의 `organization`, `organizerType` | `organization`은 실제 기관명, `organizerType`은 기관 유형으로 매핑 | 타입 체크 통과 |

## Waiting / Needs Verification

| 우선순위 | 상태 | 영역 | 확인할 내용 | 다음 작업 |
|---|---|---|---|---|
| 1 | 검증 필요 | 검색 결과 | `GET /v1/search/activities`가 인증 환경에서 정상 응답하는지 확인 | 유효 토큰/배포 로그인 상태로 검색 결과 화면 확인 |
| 2 | 검증 필요 | 아카이브 목록 | `GET /v1/archive` 응답 필드명 확인. 현재 여러 필드명을 방어적으로 매핑 중 | 유효 토큰으로 실제 응답 확인 후 매퍼를 확정 필드로 단순화 |
| 3 | 확인 필요 | 아카이브 상세/작성 저장 | 현재 `PATCH /v1/archive/{archiveId}` 스펙에는 활동 기록/역할 저장 필드가 없음 | 기록 저장용 API 또는 수정 요청 body 확정 후 저장 버튼 연결 |
| 4 | 확인 필요 | 추천 활동 | 추천 목록이 로그인 사용자에게 정상 채워지는지 확인 | 데이터가 채워진 계정으로 홈 추천 섹션 재검증 |
| 5 | 확인 필요 | 최근 본 활동 | 조회 기록 저장 후 `recently-viewed`에 반영되는 조건/시간 확인 | 상세 진입 후 홈 최근 본 활동 섹션 재검증 |
| 6 | 확인 필요 | 목록 필터 정확도 | 참여대상/활동분야/모집지역 필드 또는 백엔드 필터 쿼리 지원 여부 | 필드/쿼리 확정 후 목록 필터 실제 조건 반영 |

## Backend Confirmed

| 주제 | 답변 | 프론트 반영 |
|---|---|---|
| 기관명 | `organization`은 실제 기관명 문자열, `organizerType`은 기관 유형 | 카드/상세 매핑 수정 완료 |
| 마감 공고 | 인기 공고, 직무 추천 목록에서 모집 마감 공고 제외 | 프론트 전체 목록에서도 `dday < 0` 숨김 유지 |
| 통합 검색 | `GET /v1/search?keyword={keyword}` 추가 | 검색 결과 PC/모바일 연결 완료 |
| 아카이브 목록 | `GET /v1/archive` 추가 | 프로필 아카이브 목록 연결 완료 |

## Planning Questions

| 대상 | 확인 질문 |
|---|---|
| 기획 | 검색 결과가 로그인 필요 화면이어도 되는지, 비로그인 검색 결과는 어떻게 처리할지 |
| 기획 | 아카이브 작성 여부 문구를 `미작성` / `작성 중` / `작성 완료`로 확정해도 되는지 |
| 기획 | 활동 기록 작성 페이지는 아카이브 목록의 `archiveId` 기준 진입이 맞는지 |
| 기획 | 상세 URL 직접 진입 시 마감 지난 공고를 숨김/404/마감 표시 중 어떤 정책으로 처리할지 |
| 백엔드 | 아카이브 기록 저장 API 확인. 현재 `PATCH /v1/archive/{archiveId}`는 `activity_progress_status`, `pass_or_fail_status`만 받으므로 `activity_record`, `role`, `detail_role`, 파일/URL 저장 방식 확인 필요 |
| 백엔드 | `GET /v1/archive` 응답에 원본 활동 ID(`activity_id`) 추가 가능 여부. `공고 보기` 버튼 연결에 필요 |
| 백엔드 | 아카이브 상세 초기 조회 API 필요 여부 |
| 백엔드 | 목록 필터용 참여대상/활동분야/모집지역 필드 또는 쿼리 지원 가능 여부 |

## Questions To Send

### Backend

```text
아카이브 작성 페이지 저장 연동 관련 확인 부탁드립니다.

현재 명세상 PATCH /v1/archive/{archiveId}는 activity_progress_status, pass_or_fail_status만 받는 것으로 보입니다.
활동 기록 저장에 필요한 activity_record, role, detail_role, file_urls, reference_urls는 어떤 API로 저장하면 될까요?

그리고 GET /v1/archive 응답에 원본 활동 ID(activity_id)를 추가할 수 있을까요?
아카이브 작성 화면의 공고 보기 버튼을 /activity/{activityId}로 연결하려면 필요합니다.

```

### Planning / Design

```text
아카이브 화면 관련 확인 부탁드립니다.

1. 작성 여부 문구는 미작성 / 작성 중 / 작성 완료로 확정하면 될까요?
2. 아카이브 작성 페이지 진입 기준은 archiveId 기준이 맞을까요?
3. 검색 결과가 비로그인에서도 보여야 하는지, 아니면 로그인 유도 정책이 맞는지 확인 부탁드립니다.
4. 마감 지난 공고 상세 URL 직접 진입 시 숨김/404/마감 표시 중 어떤 정책으로 처리하면 될까요?
```

## Notes

- 검색 결과와 아카이브 목록은 인증이 필요한 API로 확인되어, 로컬 직접 호출에서는 401이 날 수 있습니다.
- 현재 검색/아카이브 매퍼는 백엔드 최종 필드명이 조금 달라도 깨지지 않도록 방어적으로 작성했습니다. 실제 응답 확인 후 필드명을 좁히는 것이 좋습니다.
- 아카이브 상세/작성 화면은 목록 API에서 찾은 활동 정보로 상단 카드와 공고 보기를 연결했습니다. 저장 버튼은 기록 저장 API 스펙이 맞지 않아 비활성화 상태입니다.
- `GET /v1/search`는 명세상 `groups[].items` 미리보기 구조라, 검색 결과 페이지는 `GET /v1/search/activities`를 사용하도록 변경했습니다.
- 마감 지난 공고 숨김 기준은 `recruitment_end_type === 'FIXED' && dday < 0`입니다.
