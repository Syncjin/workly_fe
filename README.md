# Workly

사내 협업툴 포트폴리오 프로젝트입니다. FSD 구조로 개발되고 있으며 vanilla-extract과 디자인시스템을 사용하고 있으며 Lexical 프레임워클를 활용한 에디터를 포함하고 있습니다. 

## 🚀 빠른 시작

### 필수 요구사항

- Node.js 18+ 
- pnpm 9.9.0+

### 설치

```bash
# 의존성 설치
pnpm install

# 개발 서버 시작
pnpm dev
```

## 📁 프로젝트 구조

```
workly/
├── apps/
│   ├── web/                 # 사용자 페이지 (Next.js)
│   └── admin/               # 관리자 페이지 (개발 예정)
├── packages/
│   ├── api/                 # API 유틸리티 및 타입
│   ├── editor/              # 에디터 컴포넌트
│   ├── eslint-config/       # 공유 ESLint 설정
│   ├── icons/               # 아이콘 컴포넌트
│   ├── testing/             # 테스팅 유틸리티
│   ├── tsconfig/            # 공유 TypeScript 설정
│   ├── types/               # 공유 타입 및 엔티티
│   ├── ui/                  # 공유 UI 컴포넌트
│   └── utils/               # 유틸리티 함수
├── tests/                   # 테스트 파일 (Vitest, MSW, Playwright)
└── ...
```

## 🏗 아키텍처

이 프로젝트는 **Feature-Sliced Design (FSD)** 구조를 따라 개발되고 있습니다.

### FSD 레이어 구조
- **app**: 애플리케이션 초기화 및 라우팅
- **pages**: 페이지 컴포넌트
- **widgets**: 독립적인 UI 블록
- **features**: 비즈니스 기능
- **entities**: 비즈니스 엔티티
- **shared**: 재사용 가능한 코드

## 🛠 기술 스택

- **프레임워크**: Next.js 15.4.1
- **언어**: TypeScript 5.6.2
- **패키지 매니저**: pnpm with workspaces
- **빌드 도구**: Turbo
- **스타일링**: Vanilla Extract
- **상태 관리**: Zustand
- **데이터 페칭**: TanStack Query
- **폼**: React Hook Form + Zod
- **테스팅**: Vitest + Testing Library + Playwright + MSW
- **린팅**: ESLint + Prettier

## 📦 사용 가능한 스크립트

### 루트 레벨

```bash
# 개발
pnpm dev          # 모든 앱을 개발 모드로 시작
pnpm build        # 모든 앱과 패키지 빌드
pnpm lint         # 모든 패키지 린트
pnpm test         # 모든 테스트 실행
pnpm typecheck    # 모든 패키지 타입 체크
pnpm clean        # 빌드 결과물 및 node_modules 정리
```

### 웹 앱 전용

```bash
# 웹 앱으로 이동
cd apps/web

# 환경별 개발
pnpm dev                    # 개발 모드
pnpm dev:staging           # 스테이징 환경 개발
pnpm dev:production        # 프로덕션 환경 개발

# 환경별 빌드
pnpm build                 # 프로덕션 빌드
pnpm build:staging         # 스테이징 빌드
pnpm build:production      # 프로덕션 빌드

# 테스팅
pnpm test:e2e             # Playwright E2E 테스트 실행
```

## 🏗 개발 가이드

### 새 패키지 추가

1. `packages/` 디렉토리에 새 폴더 생성
2. `@workly/package-name` 네이밍 컨벤션으로 `package.json` 추가
3. 필요에 따라 워크스페이스 의존성 업데이트

### 공유 패키지 사용

모든 공유 패키지는 워크스페이스 의존성으로 사용 가능합니다:

```json
{
  "dependencies": {
    "@workly/ui": "workspace:*",
    "@workly/utils": "workspace:*",
    "@workly/icons": "workspace:*",
    "@workly/types": "workspace:*"
  }
}
```

### 환경 설정

웹 앱은 다음 환경을 지원합니다:
- 개발 환경 (기본값)
- 스테이징 (`NEXT_PUBLIC_ENV=staging`)
- 프로덕션 (`NEXT_PUBLIC_ENV=production`)

## 🧪 테스팅

- **단위 테스트**: Vitest + Testing Library
- **E2E 테스트**: Playwright
- **API 모킹**: MSW
- **테스트 파일 위치**: `tests/` 디렉토리

## 📋 패키지 카탈로그

프로젝트는 pnpm catalog 기능을 사용하여 패키지 간 일관된 의존성 버전을 관리합니다. 
카탈로그 정의는 `pnpm-workspace.yaml`에서 확인할 수 있습니다.

## 🎯 프로젝트 목표

Workly는 협업툴 포트폴리오 프로젝트로, 다음과 같은 기능을 제공합니다:
- 사용자 페이지: 협업 도구의 주요 기능
- 관리자 페이지: 시스템 관리 및 모니터링 (개발 예정)
