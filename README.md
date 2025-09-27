# Workly

Workly는 협업 플랫폼 포트폴리오입니다. 사용자 인증, 게시판 관리, 포스트 작성 및 편집 기능을 제공하며, 재사용 가능한 디자인 시스템과 함께 확장 가능한 아키텍처로 설계되었습니다.

## 🚀 기술 스택

### 프론트엔드

- **Framework**: Next.js 15.4.1 (App Router)
- **Runtime**: React 19.1.0
- **Language**: TypeScript 5.8.3
- **Styling**: Vanilla Extract CSS
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Form Management**: React Hook Form + Zod
- **Rich Text Editor**: Lexical

### 개발 도구

- **Testing**: Vitest (Unit), Playwright (E2E), MSW (API Mocking)
- **Linting**: ESLint + Prettier
- **Icons**: SVG 기반 아이콘 시스템 (SVGR)

## 📦 주요 기능

### 🔐 사용자 인증

- 로그인/로그아웃 시스템
- JWT 기반 토큰 관리
- 자동 토큰 갱신
- 보호된 라우트

### 📋 게시판 시스템

- 다중 게시판 지원
- 게시판 카테고리 관리
- 게시판별 권한 관리

### ✍️ 포스트 관리

- 리치 텍스트 에디터 (Lexical 기반)
- 포스트 작성, 수정, 삭제
- 포스트 검색 및 필터링
- 파일 첨부 지원

### 🎨 UI 컴포넌트 라이브러리

- **Button**: 다양한 스타일과 색상 변형
- **Input**: 텍스트 입력 필드와 검증
- **CheckBox/Radio**: 폼 입력 컴포넌트
- **Select/Dropdown**: 선택 컴포넌트
- **Badge/Avatar**: 표시 컴포넌트
- **Editor**: 리치 텍스트 에디터 컴포넌트
- **Pagination**: 페이지네이션
- **LoadingSpinner/Skeleton**: 로딩 상태
- **EmptyState**: 빈 상태 표시

### 🎯 아이콘 시스템

- SVG 기반 아이콘 라이브러리
- TypeScript 타입 자동 생성
- SVGO를 통한 최적화
- 트리 쉐이킹 지원

## 🛠️ 설치 및 실행

### 필수 요구사항

- Node.js 18.0.0 이상
- npm, yarn, 또는 pnpm

### 설치

```bash
# 의존성 설치
npm install
# 또는
pnpm install
```

### 환경 설정

프로젝트는 다중 환경을 지원합니다:

```bash
# 개발 환경 (기본)
npm run dev

# 스테이징 환경
npm run dev:staging

# 프로덕션 환경
npm run dev:production
```

### 빌드 및 배포

```bash
# 프로덕션 빌드
npm run build

# 스테이징 빌드
npm run build:staging

# 프로덕션 서버 실행
npm run start
```

### 개발 도구

```bash
# 린팅
npm run lint
npm run lint:fix

# 코드 포맷팅
npm run format
npm run format:check

# 아이콘 타입 생성
npm run gen:icons

# SVG 최적화
npm run svgo
```

### 테스트

```bash
# 단위 테스트
npm run test
npm run test:watch

# E2E 테스트
npm run test:e2e

```

## 📁 프로젝트 구조

이 프로젝트는 **Feature-Sliced Design (FSD)** 아키텍처를 기반으로 구성되어 있습니다:

```
workly/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # 인증 관련 페이지
│   │   ├── (main)/            # 메인 애플리케이션 페이지
│   │   ├── layout.tsx         # 루트 레이아웃
│   │   └── page.tsx           # 홈 페이지
│   ├── pages/
│   │   └── api/               # API 라우트
│   │       ├── auth/          # 인증 API
│   │       └── [...proxy].ts  # API 프록시
│   ├── widgets/               # 복합 UI 블록
│   │   ├── board-sidebar/     # 게시판 사이드바
│   │   ├── post-editor/       # 포스트 에디터
│   │   └── post-list/         # 포스트 목록
│   ├── features/              # 비즈니스 기능
│   │   ├── auth/              # 인증 기능
│   │   ├── board/             # 게시판 관리
│   │   └── post/              # 포스트 관리
│   ├── entities/              # 비즈니스 엔티티
│   │   ├── auth/              # 사용자 인증
│   │   ├── board/             # 게시판
│   │   ├── boardCategory/     # 게시판 카테고리
│   │   ├── post/              # 포스트
│   │   ├── file/              # 파일
│   │   └── users/             # 사용자
│   ├── shared/                # 공유 리소스
│   │   ├── ui/                # UI 컴포넌트 라이브러리
│   │   ├── api/               # API 클라이언트
│   │   ├── hooks/             # 공통 훅
│   │   ├── lib/               # 유틸리티
│   │   ├── config/            # 설정
│   │   └── styles/            # 스타일 시스템
│   ├── assets/                # 정적 자산
│   │   ├── images/icons/      # SVG 아이콘
│   │   └── styles/            # 글로벌 스타일
│   ├── lib/                   # 라이브러리 설정
│   │   └── providers/         # React Provider
│   └── middleware.ts          # Next.js 미들웨어
├── tests/                     # 테스트 파일
│   ├── e2e/                   # E2E 테스트 (Playwright)
│   ├── jest/                  # 단위 테스트 (Jest)
│   └── msw/                   # API 모킹 (MSW)
├── scripts/                   # 빌드 스크립트
│   ├── generate-icon-types.js # 아이콘 타입 생성
│   └── optimize-svgs.js       # SVG 최적화
└── public/                    # 정적 파일
    └── fonts/                 # 웹 폰트


```

## 🎨 디자인 시스템

### 스타일링 접근법

이 프로젝트는 **Vanilla Extract CSS**를 사용하여 타입 안전한 CSS-in-JS 솔루션을 제공합니다. monorepo로의 전환이 아직 이루어지지 않은 상태입니다.

- **타입 안전성**: CSS 속성과 값에 대한 TypeScript 지원
- **제로 런타임**: 빌드 타임에 CSS 생성
- **CSS Modules**: 자동 클래스명 스코핑
- **테마 지원**: 다이나믹 테마 변경 가능

### 파일 구조

```
src/shared/ui/ComponentName/
├── index.tsx              # 컴포넌트 로직
├── component.css.ts       # 스타일 정의
└── types.ts              # 타입 정의 (선택적)
```

### 색상 시스템

- **색상 토큰**: 일관된 색상 팔레트
- **시맨틱 컬러**: 의미 기반 색상 명명
- **다크/라이트 모드**: 테마별 색상 변형
- **접근성**: WCAG 가이드라인 준수

### 타이포그래피

- **Pretendard 폰트**: 한글 최적화 웹 폰트
- **반응형 타이포그래피**: 화면 크기별 최적화
- **타입 스케일**: 일관된 텍스트 크기 체계

## 아키텍처 특징

### Feature-Sliced Design (FSD)

FSD 개발 규칙을 준수하여 개발중입니다.

### API 설계

- **프록시 패턴**: 백엔드 API를 Next.js API 라우트로 프록시
- **인증 미들웨어**: JWT 토큰 기반 인증 처리
- **에러 핸들링**: 일관된 에러 응답 형식
- **타입 안전성**: API 응답에 대한 TypeScript 타입 정의

### 상태 관리

- **Zustand**: 경량 상태 관리 라이브러리
- **TanStack Query**: 서버 상태 관리 및 캐싱
- **React Hook Form**: 폼 상태 관리

## 📝 개발 가이드

### 새로운 기능 추가

1. **Entity 정의**: `src/entities/`에 비즈니스 모델 생성
2. **Feature 구현**: `src/features/`에 기능 로직 작성
3. **Widget 조합**: `src/widgets/`에 UI 블록 구성
4. **Page 연결**: `src/app/`에 라우트 연결

### 컴포넌트 개발

```bash
# 새로운 UI 컴포넌트 생성
src/shared/ui/NewComponent/
├── index.tsx              # 컴포넌트 구현
├── component.css.ts       # 스타일 정의
├── types.ts              # 타입 정의
└── index.ts              # 내보내기
```

### 아이콘 관리

```bash
# 1. SVG 파일 추가
src/assets/images/icons/new-icon.svg

# 2. 타입 생성 및 최적화
npm run gen:icons
npm run svgo
```

## 🚀 배포

### 환경별 배포

```bash
# 스테이징 환경
npm run build:staging
npm run start:staging

# 프로덕션 환경
npm run build:production
npm run start:production
```
