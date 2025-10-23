# Workly

사내 협업툴 포트폴리오 프로젝트입니다. FSD(Feature-Sliced Design) 구조로 개발되고 있으며 vanilla-extract와 디자인시스템을 사용하고 있으며 Lexical 프레임워크를 활용한 에디터를 포함하고 있습니다.

## 🚀 빠른 시작

### 필수 요구사항

- Node.js 20+
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
│   ├── web/                 # 메인 웹 애플리케이션 (Next.js 15.4.1)
│   └── admin/               # 관리자 페이지 (개발 예정)
├── packages/
│   ├── api/                 # API 클라이언트 및 유틸리티
│   ├── editor/              # Lexical 기반 리치 텍스트 에디터
│   ├── eslint-config/       # 공유 ESLint 설정 (Next.js, React, TypeScript)
│   ├── icons/               # SVG 아이콘 컴포넌트 및 최적화 도구
│   ├── prettier-config/     # 공유 Prettier 설정
│   ├── testing/             # 테스팅 유틸리티 (현재 비어있음)
│   ├── tsconfig/            # 공유 TypeScript 설정
│   ├── types/               # 공유 타입 정의 및 도메인 엔티티
│   ├── ui/                  # 공유 UI 컴포넌트 라이브러리
│   └── utils/               # 공통 유틸리티 함수
└── ...
```

## 🏗 아키텍처

이 프로젝트는 **Feature-Sliced Design (FSD)** 구조와 **Next.js App Router**를 결합하여 개발되고 있습니다.

### FSD + Next.js App Router 구조
- **app**: Next.js App Router 기반 라우팅 및 서버 컴포넌트
  - `app/(main)/` - 메인 애플리케이션 라우트
- **pages**: API 라우트 핸들러
- **widgets**: 독립적인 UI 블록 (Zustand Provider로 상태 격리)
- **features**: 비즈니스 기능 (TanStack Query 낙관적 업데이트)
- **entities**: 비즈니스 엔티티 및 도메인 로직
- **shared**: 재사용 가능한 코드 및 UI 컴포넌트

### 상태 관리 패턴
- **전역 상태**: TanStack Query (서버 상태) + Zustand (클라이언트 상태)
- **위젯 상태**: 스코프 분리된 Zustand Provider로 독립적 관리
- **낙관적 업데이트**: TanStack Query를 활용한 즉시 UI 반영

## 🛠 기술 스택

### 프론트엔드
- **프레임워크**: Next.js 15.4.1
- **언어**: TypeScript 5.8.3
- **UI 라이브러리**: React 19.1.0
- **스타일링**: Vanilla Extract
- **상태 관리**: Zustand 5.0.8
- **데이터 페칭**: TanStack Query 5.84.1
- **폼**: React Hook Form 7.62.0 + Zod 4.0.14
- **에디터**: Lexical 0.37.0
- **날짜 처리**: Day.js 1.11.18
- **에러 처리**: React Error Boundary 6.0.0

### 개발 도구
- **패키지 매니저**: pnpm 9.9.0 with workspaces
- **빌드 도구**: Turbo 2.5.8
- **번들러**: tsup 8.5.0
- **테스팅**: Vitest 3.2.4 + Testing Library + Playwright + MSW 2.11.1
- **린팅**: ESLint 9 + Prettier 3.6.2
- **타입 체킹**: TypeScript strict mode

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
pnpm dev                    # 개발 모드 (기본)
pnpm dev:staging           # 스테이징 환경 개발
pnpm dev:production        # 프로덕션 환경 개발

# 환경별 빌드
pnpm build                 # 프로덕션 빌드 (기본)
pnpm build:staging         # 스테이징 빌드
pnpm build:production      # 프로덕션 빌드

# 환경별 실행
pnpm start                 # 프로덕션 서버 시작 (기본)
pnpm start:staging         # 스테이징 서버 시작
pnpm start:production      # 프로덕션 서버 시작

# 테스팅
pnpm test:e2e             # Playwright E2E 테스트 실행
pnpm lint                 # Next.js 린트 실행
```

### 패키지별 개발

```bash
# 특정 패키지 개발 모드
cd packages/editor && pnpm dev    # 에디터 패키지 watch 모드
cd packages/ui && pnpm dev        # UI 패키지 watch 모드
cd packages/api && pnpm dev       # API 패키지 watch 모드

# 패키지 빌드
cd packages/icons && pnpm build   # 아이콘 최적화 및 빌드
cd packages/types && pnpm build   # 타입 정의 빌드

# 패키지 테스트
cd packages/editor && pnpm test   # 에디터 단위 테스트
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
    "@workly/types": "workspace:*",
    "@workly/api": "workspace:*",
    "@workly/editor": "workspace:*"
  },
  "devDependencies": {
    "@workly/eslint-config": "workspace:*",
    "@workly/prettier-config": "workspace:*",
    "@workly/tsconfig": "workspace:*"
  }
}
```

### 타입 정의 사용

`@workly/types` 패키지는 세분화된 경로 접근을 지원합니다:

```typescript
// 공통 타입
import type { ApiResponse } from '@workly/types/common'

// 도메인별 타입
import type { PostEntity } from '@workly/types/domain'
import type { UserEntity } from '@workly/types/domain'
```

### FSD + Next.js App Router 패턴

```typescript
// apps/web/src/app/(main)/article/[postId]/page.tsx - 실제 서버 컴포넌트
type PageProps = {
  params: Promise<{ postId: string }>;
};

export default async function ArticleDetailPage({ params }: PageProps) {
  const { postId } = await params;
  const id = Number(postId);

  return (
    <>
      <PostDetailContainer postId={id} />
      <CommentThreadProvider>
        <CommentActionHeader postId={id} />
        <CommentList postId={id} />
        <CommentCreate postId={id} />
      </CommentThreadProvider>
    </>
  );
}
```

### TanStack Query 낙관적 업데이트

```typescript
// apps/web/src/features/post/post-like/model/usePostLikeAction.ts - 실제 구현
export function usePostLikeAction() {
  const qc = useQueryClient();
  const { mutateAsync, isPending } = usePostLike();

  const run = useCallback(
    async (postId: number) => {
      // 관련 쿼리들 취소
      await qc.cancelQueries({
        predicate: ({ queryKey }) => isPostListKey(queryKey) || isPostDetailKey(queryKey, postId),
      });

      // 현재 상태 스냅샷 저장
      const snapshots = qc.getQueriesData({
        predicate: ({ queryKey }) => isPostListKey(queryKey) || isPostDetailKey(queryKey, postId),
      });

      // 낙관적 업데이트 - 모든 관련 쿼리에 즉시 반영
      for (const [key, old] of snapshots) {
        qc.setQueryData(key, patchAnyLike(old, postId));
      }

      try {
        const result = await mutateAsync({ postId });
        qc.invalidateQueries({
          predicate: ({ queryKey }) => isPostListKey(queryKey) || isPostDetailKey(queryKey, postId),
        });
        return result;
      } catch (error) {
        // 에러 시 모든 스냅샷 롤백
        for (const [key, snap] of snapshots) {
          qc.setQueryData(key, snap);
        }
        throw error;
      }
    },
    [qc, mutateAsync]
  );

  return { run, isPending };
}
```

### UI 컴포넌트 패턴

```typescript
// apps/web/src/entities/comment/ui/CommentItem.tsx - 실제 Compound + Slot 패턴
export const CommentItem = {
  Root,
  Profile,
  Author,
  Date,
  Content,
  ReplyButton,
  ReactionButton,
  HeaderSlot,
  ContentSlot,
  FooterSlot,
  RightSlot,
};

// 사용 예시 - 기본 레이아웃
<CommentItem.Root 
  comment={comment} 
  replyOnClick={handleReply}
  footer={<CommentItem.ReactionButton />}
  right={<CommentItem.ReplyButton />}
/>

// 사용 예시 - 커스텀 레이아웃 (Slot 패턴)
<CommentItem.Root comment={comment}>
  <CommentItem.Profile />
  <div className={styles.main}>
    <CommentItem.HeaderSlot>
      <CommentItem.Author />
      <CommentItem.Date />
      <Badge>관리자</Badge>
    </CommentItem.HeaderSlot>
    <CommentItem.ContentSlot />
    <CommentItem.FooterSlot>
      <CommentItem.ReactionButton />
    </CommentItem.FooterSlot>
  </div>
</CommentItem.Root>
```

### 위젯 상태 격리

```typescript
// apps/web/src/widgets/comment-thread/model/CommentThreadStore.tsx - 실제 구현
export type CommentThreadState = {
  commentCnt?: number;
  reaction?: Reaction;
  setCommentCnt: (v?: number) => void;
  setReaction: (v?: Reaction) => void;
  reset: () => void;
};

function makeStore() {
  return createStore<CommentThreadState>((set) => ({
    commentCnt: undefined,
    reaction: undefined,
    setCommentCnt: (v) => set({ commentCnt: v }),
    setReaction: (v) => set({ reaction: v }),
    reset: () => set({ commentCnt: undefined, reaction: undefined }),
  }));
}

export function CommentThreadProvider({ children }: { children: React.ReactNode }) {
  const [store] = React.useState(() => makeStore());
  return <Ctx.Provider value={store}>{children}</Ctx.Provider>;
}

// 사용법 - 각 위젯은 독립적인 상태를 가짐
<CommentThreadProvider>
  <CommentActionHeader postId={id} />
  <CommentList postId={id} />
  <CommentCreate postId={id} />
</CommentThreadProvider>
```

### 환경 설정

웹 앱은 다음 환경을 지원합니다:
- 개발 환경 (기본값)
- 스테이징 (`NEXT_PUBLIC_ENV=staging`)
- 프로덕션 (`NEXT_PUBLIC_ENV=production`)

## 🧪 테스팅

### 테스트 도구
- **단위 테스트**: Vitest 3.2.4 + Testing Library
- **E2E 테스트**: Playwright (웹 앱)
- **API 모킹**: MSW 2.11.1
- **컴포넌트 테스트**: React Testing Library 16.3.0

### 테스트 실행
```bash
# 전체 테스트 실행
pnpm test

# 웹 앱 E2E 테스트
cd apps/web && pnpm test:e2e

# 에디터 패키지 단위 테스트
cd packages/editor && pnpm test
```

### 테스트 파일 위치
- **단위 테스트**: 각 패키지 내 `src/` 디렉토리
- **E2E 테스트**: `apps/web/tests/` 디렉토리
- **테스트 설정**: `vitest.config.ts`, `playwright.config.ts`

## 📦 패키지 상세 정보

### Apps

#### `apps/web`
메인 웹 애플리케이션으로 Next.js 15.4.1 기반의 사용자 인터페이스를 제공합니다.
- **주요 기능**: 협업 도구의 핵심 기능 구현
- **환경 지원**: development, staging, production
- **테스팅**: Playwright E2E 테스트 포함
- **스타일링**: Vanilla Extract + 디자인 시스템

#### `apps/admin`
관리자 페이지 (현재 개발 예정 상태)

### Packages

#### `@workly/api`
API 클라이언트 및 HTTP 요청 관련 유틸리티를 제공합니다.
- **TanStack Query 통합**: 낙관적 업데이트 및 캐싱 최적화
- **실시간 업데이트**: 서버 상태와 클라이언트 UI 동기화
- **에러 처리**: 자동 재시도 및 에러 바운더리 연동
- **의존성**: `@workly/types`, `@workly/utils`
- **빌드**: tsup으로 ESM 모듈 생성

#### `@workly/editor`
Lexical 프레임워크 기반의 고급 리치 텍스트 에디터 컴포넌트입니다.
- **핵심 기능**: 
  - 리사이즈 가능한 이미지 삽입 및 편집
  - YouTube 임베드 지원
  - 코드 블록, 링크, 리스트, 마크다운, 테이블
- **고급 기능**: 드래그 앤 드롭, 실시간 협업 준비
- **의존성**: Lexical 0.37.0, `@workly/ui`
- **테스팅**: Vitest 단위 테스트 포함

#### `@workly/eslint-config`
프로젝트 전반에 사용되는 ESLint 설정을 제공합니다.
- **설정 파일**: api.mjs, editor.mjs, next.mjs, types.mjs, ui.mjs
- **지원**: Next.js, React, TypeScript 환경별 최적화

#### `@workly/icons`
SVG 아이콘을 React 컴포넌트로 변환하고 최적화하는 패키지입니다.
- **기능**: SVG 최적화 (SVGO), 타입 자동 생성
- **빌드**: 최적화된 SVG와 TypeScript 타입 생성

#### `@workly/prettier-config`
프로젝트 전반의 코드 포맷팅 규칙을 정의합니다.

#### `@workly/testing`
테스팅 관련 유틸리티 (현재 비어있음, 향후 확장 예정)

#### `@workly/tsconfig`
TypeScript 설정을 제공합니다.
- **설정**: base.json (기본), next-app.json (Next.js 앱용)

#### `@workly/types`
프로젝트 전반에서 사용되는 타입 정의를 제공합니다.
- **구조**: common (공통 타입), domain (도메인 엔티티)
- **내보내기**: 세분화된 경로별 타입 접근 지원

#### `@workly/ui`
재사용 가능한 UI 컴포넌트 라이브러리입니다.
- **컴포넌트 패턴**: 
  - Compound Components (조합 가능한 컴포넌트)
  - Slot Components (유연한 컨텐츠 삽입)
  - Provider 패턴 (독립적인 상태 관리)
- **스타일링**: Vanilla Extract + Recipe 패턴
- **상태 관리**: 스코프 분리된 Zustand Provider
- **의존성**: `@workly/icons`, `@workly/utils`
- **특별 내보내기**: overlays (모달, 팝오버 등)
- **유지보수성**: 조립 가능한 컴포넌트 구조로 높은 재사용성

#### `@workly/utils`
공통 유틸리티 함수를 제공합니다.
- **타입**: React 18+ 호환

## 📋 패키지 카탈로그

프로젝트는 pnpm catalog 기능을 사용하여 패키지 간 일관된 의존성 버전을 관리합니다. 
카탈로그 정의는 `pnpm-workspace.yaml`에서 확인할 수 있습니다.

### 주요 카탈로그 의존성
- **React 생태계**: React 19.1.0, Next.js 15.4.1
- **상태 관리**: TanStack Query 5.84.1, Zustand 5.0.8
- **스타일링**: Vanilla Extract 1.17.4+
- **폼**: React Hook Form 7.62.0, Zod 4.0.14
- **개발 도구**: TypeScript 5.8.3, ESLint 9, Prettier 3.6.2
- **테스팅**: Vitest 3.2.4, Testing Library, Playwright

## 🎯 프로젝트 목표

Workly는 협업툴 포트폴리오 프로젝트입니다.

### 주요 특징
- **모노레포 구조**: pnpm workspace를 활용한 효율적인 패키지 관리
- **하이브리드 아키텍처**: FSD + Next.js App Router로 서버/클라이언트 최적화
- **타입 안전성**: TypeScript strict mode와 공유 타입 시스템
- **고급 UI 패턴**: Compound/Slot 컴포넌트로 조립 가능한 인터페이스
- **상태 관리**: 스코프 분리된 Zustand Provider + TanStack Query 낙관적 업데이트
- **현대적 스타일링**: Vanilla Extract를 활용한 타입 안전한 CSS-in-JS
- **고급 에디터**: 이미지 리사이즈, YouTube 임베드 지원 Lexical 에디터
- **개발자 경험**: 통합된 린팅, 포맷팅, 테스팅 환경

### 제공 기능
- **웹 애플리케이션**: 협업 도구의 핵심 사용자 인터페이스
  - 게시글 작성/편집 (고급 에디터)
  - 댓글 시스템 (실시간 반응)
  - 좋아요/반응 시스템 (낙관적 업데이트)
- **고급 에디터 기능**:
  - 📷 리사이즈 가능한 이미지 (드래그로 크기 조절)
  - 🎥 YouTube 임베드 (URL 자동 변환)
  - 📝 마크다운 지원 (실시간 프리뷰)
  - 🎨 코드 블록 (문법 하이라이팅)
- **관리자 도구**: 시스템 관리 및 모니터링 (개발 예정)
- **디자인 시스템**: 조립 가능한 UI 컴포넌트 라이브러리
- **개발 도구**: 코드 품질과 개발 효율성을 위한 통합 도구

### 기술적 목표
- **확장성**: FSD 레이어 구조와 모듈화된 아키텍처로 기능 확장 용이
- **성능**: Next.js App Router + TanStack Query로 최적화된 데이터 페칭
- **유지보수성**: Compound/Slot 패턴으로 조립 가능한 컴포넌트 설계
- **상태 격리**: 위젯별 독립적인 Zustand Provider로 사이드 이펙트 최소화
- **사용자 경험**: 낙관적 업데이트로 즉시 반응하는 인터페이스
- **품질**: 포괄적인 테스트 커버리지와 타입 안전성
- **협업**: 일관된 코딩 스타일과 개발 워크플로우
