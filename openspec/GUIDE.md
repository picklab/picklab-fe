# OpenSpec 처음 사용 가이드

이 문서는 `picklab-fe` 저장소에서 OpenSpec을 처음 쓰는 사람을 위한 실전 가이드입니다.

## 1) OpenSpec이 하는 일

OpenSpec은 기능 개발을 아래 순서로 구조화합니다.

1. 변경 제안 작성 (`proposal.md`, `design.md`, `tasks.md`)
2. 태스크 기반 구현
3. 완료 후 변경 아카이브

핵심은 "코드 먼저"가 아니라 "변경 의도와 설계 먼저"입니다.

## 2) 이 저장소에서의 현재 상태

- OpenSpec 설정 파일: `openspec/config.yaml`
- 현재 스키마: `spec-driven`
- 기본 artifact: `proposal.md`, `design.md`, `tasks.md`

참고: 현재 이 저장소는 활성 change가 없습니다. (`openspec status --json` 실행 시 "No changes found")

## 3) 필수 명령 빠르게 보기

```bash
openspec --help
openspec list --json
openspec status --json
openspec show <change-name>
```

- `list`: 현재 change 목록
- `status`: change별/전체 진행 상태
- `show`: 특정 change 내용을 보기 좋게 출력

## 4) 가장 추천하는 시작 흐름 (CLI 기준)

### Step A. 새 change 만들기

```bash
openspec new change "add-user-auth"
```

생성 위치:

```text
openspec/changes/add-user-auth/
  ├─ .openspec.yaml
  ├─ proposal.md
  ├─ design.md
  └─ tasks.md
```

### Step B. 상태 확인

```bash
openspec status --change "add-user-auth" --json
```

`schemaName`, `artifacts`, `applyRequires`를 확인합니다.

### Step C. artifact 작성 가이드 가져오기

```bash
openspec instructions proposal --change "add-user-auth" --json
openspec instructions design --change "add-user-auth" --json
openspec instructions tasks --change "add-user-auth" --json
```

각 명령은 다음을 줍니다.

- `template`: 파일 구조
- `instruction`: 작성 지침
- `dependencies`: 선행 artifact
- `outputPath`: 작성 파일 경로

### Step D. 작성 완료 후 구현 준비 확인

```bash
openspec instructions apply --change "add-user-auth" --json
```

- `state: "ready"`면 구현 시작 가능
- `state: "blocked"`면 누락 artifact 먼저 작성
- `state: "all_done"`면 구현 태스크 완료 상태

### Step E. 구현하면서 tasks 체크

`openspec/changes/add-user-auth/tasks.md`에서 완료한 항목을:

```markdown
- [ ] API 스펙 반영
```

아래처럼 바꿉니다.

```markdown
- [x] API 스펙 반영
```

### Step F. 완료 후 아카이브

```bash
openspec archive "add-user-auth"
```

아카이브 후에는 보통 `openspec/changes/archive/` 아래로 이동합니다.

## 5) 이 저장소에서 자주 쓰는 `/opsx:*` 명령

Codex/에이전트 환경에서는 다음 단축 명령을 자주 씁니다.

- `/opsx:propose <name 또는 설명>`: change + artifact 초안 생성
- `/opsx:apply <name>`: tasks 기반 구현 진행
- `/opsx:explore <주제>`: 구현 전 탐색/요구사항 정리
- `/opsx:archive <name>`: 완료 change 아카이브

처음에는 아래 순서를 추천합니다.

1. `/opsx:propose add-user-auth`
2. 생성된 `proposal.md`, `design.md`, `tasks.md` 검토/수정
3. `/opsx:apply add-user-auth`
4. 구현 완료 후 `/opsx:archive add-user-auth`

## 6) 처음 작성할 때 품질 기준

### proposal.md (무엇을 왜 하는지)

- 문제/배경이 명확한가
- 목표와 비목표(Non-goal)가 분리됐는가
- 성공 조건(측정 가능한 결과)이 있는가

### design.md (어떻게 할지)

- 구조/흐름/대안 비교가 있는가
- 기존 코드 영향 범위가 명시됐는가
- 리스크 및 롤백 전략이 있는가

### tasks.md (구현 순서)

- 1~2시간 단위로 쪼개졌는가
- 검증 가능한 완료 조건이 있는가
- 순서 의존성이 드러나는가

## 7) 실전 예시 (복붙용)

```bash
# 1) change 생성
openspec new change "add-social-login-error-handling"

# 2) 현재 상태 확인
openspec status --change "add-social-login-error-handling" --json

# 3) 문서 작성 지침 확인
openspec instructions proposal --change "add-social-login-error-handling" --json
openspec instructions design --change "add-social-login-error-handling" --json
openspec instructions tasks --change "add-social-login-error-handling" --json

# 4) 구현 가능 상태 확인
openspec instructions apply --change "add-social-login-error-handling" --json

# 5) 완료 후 아카이브
openspec archive "add-social-login-error-handling"
```

## 8) 자주 막히는 지점과 해결법

### Q1. `No changes found`가 뜹니다

아직 change를 만들지 않은 상태입니다.

```bash
openspec new change "<새-change-이름>"
```

### Q2. apply가 blocked 상태입니다

대부분 `tasks.md` 또는 선행 artifact가 비어 있거나 미완료입니다.

```bash
openspec status --change "<name>" --json
openspec instructions tasks --change "<name>" --json
```

### Q3. change 이름을 어떻게 짓나요?

`kebab-case`로, 동사+대상 형태를 추천합니다.

- `add-user-auth`
- `improve-search-ranking`
- `fix-signin-callback-error`

## 9) 팀 운영 팁

- PR 하나에 change 하나를 유지하면 추적이 쉽습니다.
- `tasks.md` 완료 체크는 구현 직후 바로 반영합니다.
- 설계가 바뀌면 코드보다 먼저 `design.md`를 업데이트합니다.
- archive 전에 `status`를 확인해 누락 태스크를 막습니다.

## 10) 처음 시작 체크리스트

- [ ] `openspec --help`로 CLI 동작 확인
- [ ] `openspec new change "<name>"` 실행
- [ ] `proposal/design/tasks` 3개 artifact 작성
- [ ] `openspec instructions apply --change "<name>" --json`이 ready인지 확인
- [ ] 구현 진행 및 `tasks.md` 체크
- [ ] `openspec archive "<name>"`로 종료

---

원하면 다음 단계로, 실제 작업 주제 하나를 정해서 내가 바로 `change 이름` 추천부터 artifact 초안까지 같이 만들어줄 수 있습니다.
