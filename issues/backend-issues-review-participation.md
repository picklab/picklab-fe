# 백엔드 전달용 이슈 — 리뷰/활동참여 (2026-06-11)

작성: 프론트엔드. 대상 서버: `http://161.153.21.86:8080`. 계정: member 3(김범수) 토큰으로 검증.
BE 로컬 기준: `main` `4aa8f7c` (2026-06-06).

## 요약

| # | 항목 | 심각도 | 상태 |
|---|---|---|---|
| 1 | `GET /v1/activity-participations/results` 가 **항상 500** | 🔴 Critical | **수정/재배포 필요** |
| 2 | (확인요청) 리뷰 작성 게이팅 정책이 의도대로인지 | ℹ️ 확인 | 소스상 정상, 의도 확인만 |
| 3 | (확인요청) 인증자료 유무 → 승인상태 / 공개 정책 | ℹ️ 확인 | 소스상 정상, 의도 확인만 |
| 4 | api-spec 필터 enum 표기 불일치(설명문 소문자 vs schema 대문자) | 🟡 Minor | 문서 정정 권장 |

---

## 🔴 #1. `GET /v1/activity-participations/results` 500 (최우선)

### 증상
```
GET /v1/activity-participations/results
GET /v1/activity-participations/results?page=1&size=10
GET /v1/activity-participations/results?page=1&size=10&applicationStatus=ACCEPTED
→ 모두 {"code":500,"message":"서버 오류입니다."}
```
- member 3은 참여이력 **0건**인데도 500 (참여 1건 만들어도 동일).
- 같은 인증/같은 멤버로 `GET /v1/activity-participations/summary` 는 **200 정상**
  → 인증·멤버 조회 문제는 아님. `results` 경로 고유 문제.

### 영향 (프론트)
이 엔드포인트는 **리뷰 작성 진입 모달("어떤 활동에 참여하셨나요?")** 과 **수료여부 PATCH 흐름**이 의존합니다.
또한 `participationId`를 반환하는 **유일한** API라, 이게 죽으면:
- 리뷰 작성 진입 모달이 빈 목록/에러
- `application-status` / `progress-status` PATCH에 필요한 `participationId`를 클라가 얻을 방법이 사라짐
- → 결과적으로 **합격/수료 처리 + 리뷰 작성 플로우 전체가 막힘** (프론트 검증 불가)

### 원인 분석 (로컬 소스 기준)
로컬 코드상으론 0건에서 500이 날 이유가 없음:
- `ActivityParticipationUseCase.getResults` = `@Transactional(readOnly = true)` 정상
- `ActivityParticipationRepository.findAllByMemberId(memberId, pageable)` 표준 파생 쿼리
- `Sort.by("createdAt")` → `BaseEntity`에 `@Column("created_at")` 정상 매핑
- `toPageResponse`는 0건이면 매핑 람다 미호출

→ **로컬 코드는 정상.** 따라서 배포 서버 측 문제로 추정:
- `spring.jpa.hibernate.ddl-auto: none` → 스키마는 전적으로 **Flyway** 의존
- 참여/리절트는 `V1.10__refactor_archive_to_participation.sql` 등에 의존, results는 `#84`(2026-06-04)에서 추가
- **가설 A**: 배포 DB에 최신 마이그레이션(V1.10~V1.12) 미적용 → `activity_participation` 테이블에 `deleted_at`/`application_status` 등 컬럼 부재 → `WHERE deleted_at IS NULL` 쿼리가 SQL 예외 → 0건이어도 500 (증상과 일치)
- **가설 B**: 배포 jar이 구버전

### 요청
1. **배포 서버 애플리케이션 로그의 스택트레이스** 확인 (정확한 예외 한 줄이면 확정)
2. 배포 DB `flyway_schema_history` 가 **V1.12까지 적용**됐는지 확인
3. 최신 코드 + 마이그레이션으로 **재배포**

---

## ℹ️ #2. 리뷰 작성 게이팅 — 의도 확인

리뷰 POST(`POST /v1/review`) 실패를 단계별 재현:
```
참여이력 없음          → 404 "해당 활동에 대한 참여 이력이 존재하지 않습니다."
참여 지원완료(applied) → 400 "해당 활동에 대해 리뷰를 작성할 수 없는 상태입니다."
```
소스(`ActivityParticipation.canWriteReview`):
```kotlin
fun canWriteReview() = progressStatus == COMPLETED || progressStatus == DROPPED
```
→ **수료완료(COMPLETED) 또는 중도포기(DROPPED) 상태에서만 리뷰 작성 가능.**
- 이 정책이 의도된 것인지 확인 부탁 (프론트는 이 가정대로 동작).
- 참고: 정책상 정상 동작이며 프론트/페이로드 문제 아님.

---

## ℹ️ #3. 인증자료 → 승인상태 / 공개 정책 — 의도 확인

소스(`ReviewApprovalDecider.decideOnCreate`):
```kotlin
fun decideOnCreate(url: String?) =
    if (url.isNullOrBlank()) REJECTED else PENDING
```
공개 목록/통계 쿼리는 **APPROVED만** 노출 (`ReviewOverviewQueryRepositoryImpl.kt:86` `reviewApprovalStatus.eq(APPROVED)`).

정리:
| 등록 방식 | approval_status | 공개 |
|---|---|---|
| 인증자료 URL 있음 | PENDING(승인중) | ❌ 관리자 승인 후 공개 |
| 인증자료 URL 없음 | REJECTED(미승인) | ❌ 비공개 |

→ **인증자료를 올려도 즉시 공개되지 않고 관리자 승인을 거침.** 의도 맞는지 확인 부탁.
→ (정책 질문) 인증자료 없이 작성하면 즉시 REJECTED인데, 이게 의도인지(프론트에 "인증없이 등록" 버튼 존재).

---

## 🟡 #4. api-spec 필터 enum 표기 불일치 (Minor)

`GET /v1/activities` 의 `target/field/location/format`:
- **설명문(description)**: 소문자 예시 (`all, university_student, online` ...)
- **parameter schema enum**: 대문자 (`ALL, UNIVERSITY_STUDENT, ONLINE` ...)

실제 동작 검증 결과 **백엔드는 대소문자 모두 허용(case-insensitive)** — `field=supporters` 와 `field=SUPPORTERS` 모두 25건으로 동일 동작.
→ 기능 문제는 없으나, 스펙 문서의 설명문/enum 표기를 일치시키면 혼선 방지.

---

## 검증 못 한 것 (현재 블로킹)

- **리뷰 작성 성공(200) 케이스를 실측 못 함.** 이유: #1(`results` 500)로 `participationId`를 못 얻어 → 합격(ACCEPTED)→수료(COMPLETED) 처리 불가 → 리뷰 작성 자격을 만들 수 없음.
- #1이 해결되면(또는 DB에서 member 3의 참여 1건을 COMPLETED로 세팅해주면) 프론트에서 작성→공개까지 즉시 실측 가능.
