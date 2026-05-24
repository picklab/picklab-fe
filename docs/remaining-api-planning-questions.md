# Remaining API / Planning Questions

현재 프론트에서 가능한 작업은 반영했고, 아래 항목만 확인이 필요합니다.

## Current Status

| 구분 | 상태 | 내용 |
|---|---|---|
| 검색 결과 | 완료 | `GET /v1/search/activities`를 카테고리별로 호출하도록 연동. 검색 결과 전체 목록과 PC 페이지네이션 대응 |
| 아카이브 목록 | 완료 | `GET /v1/archive` 연동 완료. 프로필 아카이브 목록에 수료 완료 활동 이력 표시 |
| 아카이브 상세/작성 | 부분 완료 | 목록 API 데이터로 상세/작성 화면 상단 활동 정보와 `공고 보기` 이동 연결 |
| 아카이브 저장 | 확인 필요 | 현재 `PATCH /v1/archive/{archiveId}` 명세에 활동 기록/역할 저장 필드가 없어 저장 버튼 비활성화 |

## Backend Questions

| 우선순위 | 확인 항목 | 필요한 이유 |
|---|---|---|
| 1 | `PATCH /v1/archive/{archiveId}`로 `activity_record`, `role`, `detail_role`, `file_urls`, `reference_urls` 저장이 가능한지 | 아카이브 작성 페이지 저장 버튼 연동 필요 |
| 2 | 저장 API가 따로 있다면 endpoint와 request body 공유 | 현재 명세상 수정 API는 `activity_progress_status`, `pass_or_fail_status`만 받음 |
| 3 | `GET /v1/archive` 응답에 원본 활동 ID(`activity_id`)를 추가할 수 있는지 | 아카이브 작성 화면의 `공고 보기` 버튼을 `/activity/{activityId}`로 연결하기 위해 필요 |
| 4 | 아카이브 상세 초기 조회 API가 필요한지 확인 | 현재는 목록 API에서 해당 archiveId를 찾아 상세 상단 정보를 구성 중 |

### Backend Message Draft

```text
아카이브 작성 페이지 저장 연동 관련 확인 부탁드립니다.

현재 명세상 PATCH /v1/archive/{archiveId}는 activity_progress_status, pass_or_fail_status만 받는 것으로 보입니다.
활동 기록 저장에 필요한 activity_record, role, detail_role, file_urls, reference_urls는 어떤 API로 저장하면 될까요?

그리고 GET /v1/archive 응답에 원본 활동 ID(activity_id)를 추가할 수 있을까요?
아카이브 작성 화면의 공고 보기 버튼을 /activity/{activityId}로 연결하려면 필요합니다.
```

## Planning / Design Questions

| 우선순위 | 확인 항목 | 필요한 이유 |
|---|---|---|
| 1 | 아카이브 작성 여부 문구를 `미작성` / `작성 중` / `작성 완료`로 확정해도 되는지 | 명세의 `write_status`가 `NOT_WRITTEN`, `IN_PROGRESS`, `COMPLETED` |
| 2 | 아카이브 작성 페이지 진입 기준이 `archiveId` 기준인지 확인 | 현재 `/profile/archive/{archiveId}`로 이동 |
| 3 | 검색 결과가 비로그인에서도 보여야 하는지 확인 | 검색 API가 인증 필요하면 로그인 유도 정책 필요 |
| 4 | 마감 지난 공고 상세 URL 직접 진입 시 숨김/404/마감 표시 중 어떤 정책인지 확인 | 목록에서는 마감 지난 공고를 숨김 처리 중 |

### Planning / Design Message Draft

```text
아카이브 화면 관련 확인 부탁드립니다.

1. 작성 여부 문구는 미작성 / 작성 중 / 작성 완료로 확정하면 될까요?
2. 아카이브 작성 페이지 진입 기준은 archiveId 기준이 맞을까요?
3. 검색 결과가 비로그인에서도 보여야 하는지, 아니면 로그인 유도 정책이 맞는지 확인 부탁드립니다.
4. 마감 지난 공고 상세 URL 직접 진입 시 숨김/404/마감 표시 중 어떤 정책으로 처리하면 될까요?
```

## Notes

- 프론트 구현 기준으로 검색 결과, 아카이브 목록, 아카이브 상세 상단 정보 연결은 완료했습니다.
- 아카이브 저장은 API 명세가 맞지 않아 임의로 요청하지 않았습니다.
- `GET /v1/search`는 명세상 `groups[].items` 미리보기 구조라, 검색 결과 페이지는 `GET /v1/search/activities`를 사용하도록 변경했습니다.
- `yarn typecheck`, `yarn build` 통과했습니다.
