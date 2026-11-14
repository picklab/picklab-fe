# Picklab Frontend

## Tech Stack
- **Framework**: Next.js 16 (App Router) + React 19
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3 (커스텀 디자인 토큰)
- **State**: React Context (AuthContext), 서버 데이터는 React Query 캐시
- **Data Fetching**: TanStack React Query 5 (`src/hooks/use*.ts`, 설정은 `src/providers/providers.tsx`)
- **HTTP Client**: 브라우저는 `fetch`로 `/api/*` 호출, Route Handler는 `ky`로 백엔드 호출
- **Test**: 자동화 테스트 없음 (Playwright는 `scripts/` 크롤러 전용)
- **UI Docs**: Storybook 10 (Chromatic CI는 dev에 PR이 머지될 때만 실행)
- **Package Manager**: Yarn 4 (Berry)
- **Node**: `.nvmrc` 22.21.1 (Storybook 10은 22.12 이상 필요, `nvm use` 후 실행)

## Commands
- `yarn dev` - 개발 서버
- `yarn build` - 빌드
- `yarn lint` - ESLint
- `yarn typecheck` - 타입 체크
- `yarn storybook` - Storybook (port 6006)

## Project Structure
```
src/
├── app/
│   ├── (auth)/              # 인증 관련 (signin, signup)
│   ├── (home)/              # 메인 레이아웃
│   │   ├── [activities]/    # 활동 목록 (동적 라우트)
│   │   ├── activity/[id]/   # 활동 상세
│   │   ├── search/          # 검색
│   │   └── profile/         # 프로필, 계정, 아카이브, 알림
│   ├── (root)/              # 루트 레이아웃
│   ├── @modal/              # 병렬 라우트 모달 (이메일 변경 등)
│   └── api/                 # API Route Handlers (대부분 _lib/proxy.ts의 proxyWithAuth로 백엔드 호출)
│       ├── _lib/            # proxyWithAuth(토큰 재발급·쿠키 처리), token(쿠키 수명)
│       ├── auth/            # 인증 (로그인, 콜백, 토큰 리프레시)
│       ├── activities/      # 활동 CRUD, 북마크, 리뷰, 조회수
│       ├── members/         # 회원 정보, 이메일, 직무, 프로필
│       ├── notifications/   # 알림 (SSE subscribe, 읽기)
│       ├── reviews/         # 리뷰 관리, 통계
│       ├── search/          # 검색, 자동완성, 히스토리
│       ├── bookmarks/       # 북마크
│       ├── archive/         # 아카이브
│       └── files/           # 파일 업로드 (presigned URL)
├── components/
│   └── common/              # 공통 UI 컴포넌트
│       ├── Button/          # Button, IconButton, ThreeDImageButton
│       ├── Card/            # Card, ReviewCard (pc/mobile)
│       ├── Calendar/        # Day, Chip
│       ├── Chart/           # ChartList, RecentList, ChartBadge
│       ├── CheckBox/        # CheckBox, CheckBoxLabel
│       ├── Control/         # 컨트롤 UI
│       ├── Divider/
│       ├── Field/           # TextField, TextArea, Search, Label
│       ├── Footer/
│       ├── Funnel/          # 퍼널 패턴
│       ├── GNB/             # 글로벌 내비게이션 (pc/mobile)
│       ├── Icon/            # 아이콘 시스템
│       ├── List/            # ListItem (pc/mobile)
│       ├── Modal/
│       ├── Option/          # Option, OptionGroup, FunctionOption
│       ├── Pagination/      # Pagination, DotPagination
│       ├── Select/
│       ├── SNB/             # 사이드 내비게이션
│       ├── Tab/             # Tab, BoxTab, SortTab, TabView
│       └── TextLink/
├── config/                  # 에러 코드, 백엔드 주소(backend.ts)
├── constants/               # 메뉴 등 상수
├── contexts/                # AuthContext
├── hooks/                   # useModal 등 커스텀 훅
├── lib/                     # bookmarks, 목업 데이터(activity-data), 최근 본 활동
├── providers/               # React Query, AuthContext 프로바이더
├── stories/                 # Storybook 스토리
├── styles/                  # 글로벌 스타일, 테마
├── types/                   # 공통 타입 (response.types.ts)
└── utils/                   # day, debounce 등 유틸
```

## Conventions
- **반응형**: `mobile` (max: 1439px) / `pc` (min: 1440px) 브레이크포인트
- **컴포넌트 구조**: 페이지별 `_components/` 폴더에 pc/mobile 분리
- **API 호출**: 기능별 Route Handler(`src/app/api/**`)가 `proxyWithAuth`로 백엔드를 호출한다. 백엔드 주소는 `src/config/backend.ts`(환경 변수 `EXTERNAL_API_BASE_URL`, `NEXT_PUBLIC_BACKEND_URL`, 예시는 `.env.example`)
- **데이터 훅**: React Query 기본값은 재시도·포커스 재요청 없음, gcTime 0. 화면에는 `useReadyAfterMount`로 마운트 후 받은 응답만 쓴다
- **이미지 호스트**: api.linkareer.com, media-cdn.linkareer.com
- **폰트**: Pretendard-Regular
- **디자인 토큰**: tailwind.config.ts에 spacing, radius, elevation, colors, fontSize 정의
- **색상 체계**: primary(green), gray, danger, warning, info, success + 직군별 컬러 (planning, development, marketing, design, ai)
