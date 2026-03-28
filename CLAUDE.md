# Picklab Frontend

## Tech Stack
- **Framework**: Next.js 16 (App Router) + React 19
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3 (커스텀 디자인 토큰)
- **State**: Zustand 5, React Context (AuthContext)
- **Data Fetching**: TanStack React Query 5
- **HTTP Client**: ky
- **Form**: React Hook Form 7 + Zod 3
- **Test**: Vitest + Playwright
- **UI Docs**: Storybook 8
- **Package Manager**: Yarn 4 (Berry)
- **Node**: 22.x

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
│   └── api/                 # API Route Handlers
│       ├── _lib/            # API 내부 유틸
│       ├── auth/            # 인증 (로그인, 콜백, 토큰 리프레시)
│       ├── activities/      # 활동 CRUD, 북마크, 리뷰, 조회수
│       ├── members/         # 회원 정보, 이메일, 직무, 프로필
│       ├── notifications/   # 알림 (SSE subscribe, 읽기)
│       ├── reviews/         # 리뷰 관리, 통계
│       ├── search/          # 검색, 자동완성, 히스토리
│       ├── bookmarks/       # 북마크
│       ├── archive/         # 아카이브
│       ├── files/           # 파일 업로드 (presigned URL)
│       └── proxy/[...path]/ # 백엔드 프록시
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
├── config/                  # 에러 코드, 공유 설정
├── constants/               # 메뉴 등 상수
├── contexts/                # AuthContext
├── hooks/                   # useModal 등 커스텀 훅
├── lib/                     # API 클라이언트 (ky), bookmarks
├── providers/               # React Query 등 프로바이더
├── stores/                  # Zustand 스토어
├── stories/                 # Storybook 스토리
├── styles/                  # 글로벌 스타일, 테마
├── types/                   # 공통 타입 (response.types.ts)
└── utils/                   # day, debounce 등 유틸
```

## Conventions
- **반응형**: `mobile` (max: 1439px) / `pc` (min: 1440px) 브레이크포인트
- **컴포넌트 구조**: 페이지별 `_components/` 폴더에 pc/mobile 분리
- **API 프록시**: `/api/proxy/[...path]`로 백엔드 요청 프록시
- **이미지 호스트**: api.linkareer.com, media-cdn.linkareer.com
- **폰트**: Pretendard-Regular
- **디자인 토큰**: tailwind.config.ts에 spacing, radius, elevation, colors, fontSize 정의
- **색상 체계**: primary(green), gray, danger, warning, info, success + 직군별 컬러 (planning, development, marketing, design, ai)
