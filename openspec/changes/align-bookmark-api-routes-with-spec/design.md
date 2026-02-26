## Context

북마크 API는 활동 상세/목록 화면에서 빈번하게 사용되며, 상태 코드와 응답 본문 전달 일관성이 중요합니다. 현재 구현은 기본 프록시 형태이나, 명세에서 요구하는 생성(201), 해제(200), 목록 조회(200) 및 오류 케이스를 기준으로 계약을 명확히 확인해야 합니다.

이번 change는 북마크 API route를 명세 기준으로 정렬하고, 이후 UI 연동 단계에서 안정적으로 사용할 수 있도록 검증 가능한 기준을 제공합니다.

## Goals / Non-Goals

**Goals:**
- 북마크 생성/해제/목록 조회 API route의 method/path/query/auth 계약을 명확히 한다.
- backend 응답(status/body)을 프론트에 일관되게 전달하도록 정렬한다.
- 필터/정렬/페이징 query 전달 누락 가능성을 제거한다.

**Non-Goals:**
- 북마크 도메인 로직 변경
- 백엔드 API 스펙 변경
- 북마크 UI/디자인 변경

## Decisions

1. 기존 BFF route 경로를 유지한다.
- 이유: 프론트 호출 경로 변경 없이 명세 정합성만 확보 가능
- 대안: 프론트에서 backend 직접 호출
- 미채택 이유: 인증/보안/환경 설정 분리가 깨짐

2. 인증 토큰 누락은 route 계층에서 401로 즉시 처리한다.
- 이유: backend 호출 전 빠른 실패와 일관된 클라이언트 처리
- 대안: backend에만 위임
- 미채택 이유: 불필요한 트래픽 및 동작 예측성 저하

3. query는 `activityTypes`, `jobGroups`, `recruitmentStatus`, `sortType`, `page`, `size`를 포함해 pass-through 한다.
- 이유: 목록 필터/정렬 요구사항 충족
- 대안: 일부 파라미터만 화이트리스트 전달
- 미채택 이유: 스펙 변경 시 유지보수 비용 증가

## Related UI Surfaces

- `src/app/(home)/_components/pc/ActivityList.tsx`
- `src/app/(home)/_components/mobile/ActivityList.tsx`
- `src/app/(home)/[activities]/_components/ActivityList.tsx`
- `src/app/(home)/[activities]/_components/MobileActivityList.tsx`
- `src/app/(home)/activity/[id]/_components/PcActivityDetailPage.tsx`
- `src/app/(home)/activity/[id]/_components/MobileActivityDetailPage.tsx`

## Risks / Trade-offs

- [Risk] 명세 원문 일부가 잘려 응답 스키마 세부 필드가 누락될 수 있음
  - Mitigation: 본 change는 route 프록시 계약(method/path/status/query) 중심으로 정렬
- [Risk] 비JSON/빈 body 응답에서 파싱 오류 발생 가능
  - Mitigation: 공통 프록시 유틸 사용 여부를 구현 단계에서 점검
- [Trade-off] UI 연동 이전에는 실제 사용자 시나리오 검증이 제한됨
  - Mitigation: 401/200/201/404 케이스의 수동 API 검증 태스크 포함
