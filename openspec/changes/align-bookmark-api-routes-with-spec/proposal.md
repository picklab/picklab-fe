## Why

북마크 관련 API 명세(`/v1/activities/{activityId}/bookmarks`, `/v1/bookmarks`)와 현재 Next.js API route 구현의 계약을 명확히 맞춰야 합니다. 명세 기반으로 범위와 검증 기준을 먼저 고정해 북마크 생성/해제/목록 조회 동작의 회귀 위험을 줄입니다.

## What Changes

- 활동 북마크 생성/해제 API route의 메서드/경로/인증/응답 전달 규칙을 명세 기준으로 정렬합니다.
- 북마크 목록 조회 API route의 필터/정렬/페이징 쿼리 파라미터 전달 규칙을 명세화합니다.
- 구현 단계에서 일관된 프록시 처리(인증 토큰 처리, backend status/body 전달, 예외 처리)를 적용할 수 있도록 작업 단위를 정의합니다.

## Capabilities

### New Capabilities
- `activity-bookmark-api-proxy`: 활동 북마크 생성/해제 및 북마크 목록 조회 API route 프록시 요구사항

### Modified Capabilities
- (none)

## Impact

- Affected code:
  - `src/app/api/activities/[id]/bookmarks/route.ts`
  - `src/app/api/bookmarks/route.ts`
  - (필요 시) `src/app/api/_lib/proxy.ts`
- Related bookmark UI surfaces:
  - `src/app/(home)/_components/pc/ActivityList.tsx`
  - `src/app/(home)/_components/mobile/ActivityList.tsx`
  - `src/app/(home)/[activities]/_components/ActivityList.tsx`
  - `src/app/(home)/[activities]/_components/MobileActivityList.tsx`
  - `src/app/(home)/activity/[id]/_components/PcActivityDetailPage.tsx`
  - `src/app/(home)/activity/[id]/_components/MobileActivityDetailPage.tsx`
  - `src/components/common/Card/Card.tsx`
  - `src/components/common/Card/mobile/Card.tsx`
  - `src/components/common/List/ListItem.tsx`
  - `src/components/common/List/mobile/MoList.tsx`
- API behavior:
  - `POST /api/activities/:id/bookmarks` -> `POST /v1/activities/{activityId}/bookmarks` (201 포함)
  - `DELETE /api/activities/:id/bookmarks` -> `DELETE /v1/activities/{activityId}/bookmarks`
  - `GET /api/bookmarks` -> `GET /v1/bookmarks` (query pass-through)
- Dependencies: `ky`, `NextRequest/NextResponse`, `EXTERNAL_API_BASE_URL`
