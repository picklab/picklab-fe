# Remaining API / Planning Questions

현재 프론트에서 가능한 API 연동 작업은 반영했고, 아래 항목만 정책 확인이 필요합니다.

## Current Status

| 구분 | 상태 | 내용 |
|---|---|---|
| 검색 결과 | 완료 | `GET /v1/search/activities`를 카테고리별로 호출하도록 연동. 검색 결과 전체 목록과 PC 페이지네이션 대응 |
| 아카이브 목록 | 완료 | `GET /v1/archive` 연동 완료. 프로필 아카이브 목록에 수료 완료 활동 이력 표시 |
| 아카이브 상세/작성 | 완료 | 목록 API 데이터로 상세/작성 화면 상단 활동 정보와 `공고 보기` 이동 연결 |
| 아카이브 저장 | 완료 | `PATCH /v1/archive/{archiveId}/record`로 활동 기록, 역할, 세부 역할, 첨부 파일 URL, 참고 URL 저장 연결 |

## Backend Questions

| 우선순위 | 확인 항목 | 필요한 이유 |
|---|---|---|
| 1 | 아카이브 상세 초기 조회 API가 필요한지 확인 | 현재는 목록 API에서 해당 archiveId를 찾아 상세 상단 정보를 구성 중이라, 기존 작성 기록을 재진입 시 prefill할 수 없음 |

### Backend Message Draft

```text
아카이브 상세 조회 관련해서 확인 부탁드립니다.

현재 GET /v1/archive 목록 응답으로 작성 화면 상단 정보와 공고 보기는 연결했고,
PATCH /v1/archive/{archiveId}/record로 기록/파일/URL 저장도 연결했습니다.

다만 작성 화면 재진입 시 기존 activity_record, role, detail_role, file_urls, reference_urls를 불러올 상세 조회 API가 따로 있을까요?
없다면 목록에서 작성 완료 여부만 보여주고, 작성 화면은 신규 입력 상태로 진입하는 정책으로 이해하면 될까요?
```

## Planning / Design Questions

| 우선순위 | 확인 항목 | 필요한 이유 |
|---|---|---|
| 1 | 아카이브 작성 여부 문구를 `미작성` / `작성 중` / `작성 완료`로 확정해도 되는지 | 명세의 `write_status`가 `NOT_WRITTEN`, `IN_PROGRESS`, `COMPLETED` |
| 2 | 검색 결과가 비로그인에서도 보여야 하는지 확인 | 검색 API가 인증 필요하면 로그인 유도 정책 필요 |
| 3 | 마감 지난 공고 상세 URL 직접 진입 시 숨김/404/마감 표시 중 어떤 정책인지 확인 | 목록에서는 마감 지난 공고를 숨김 처리 중 |

### Planning / Design Message Draft

```text
아카이브 화면 관련 확인 부탁드립니다.

1. 작성 여부 문구는 미작성 / 작성 중 / 작성 완료로 확정하면 될까요?
2. 검색 결과가 비로그인에서도 보여야 하는지, 아니면 로그인 유도 정책이 맞는지 확인 부탁드립니다.
3. 마감 지난 공고 상세 URL 직접 진입 시 숨김/404/마감 표시 중 어떤 정책으로 처리하면 될까요?
```

## Notes

- 프론트 구현 기준으로 검색 결과, 아카이브 목록, 아카이브 상세 상단 정보, 아카이브 기록/파일/URL 저장 연결은 완료했습니다.
- 아카이브 상태 수정은 새 명세 기준 `PATCH /v1/archive/{archiveId}/status`, 기록 저장은 `PATCH /v1/archive/{archiveId}/record`로 분리됐습니다.
- `GET /v1/search`는 명세상 `groups[].items` 미리보기 구조라, 검색 결과 페이지는 `GET /v1/search/activities`를 사용하도록 변경했습니다.
- `yarn typecheck` 통과했습니다.
