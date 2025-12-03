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

## 🚀 CI/CD 파이프라인

이 프로젝트는 GitHub Actions를 사용하여 완전 자동화된 CI/CD 파이프라인을 구축하고 있습니다.

### 파이프라인 개요

#### 1. CI (Continuous Integration)
Pull Request 생성 시 자동으로 실행되어 코드 품질을 검증합니다.

**실행 조건:**
- Pull Request 생성 또는 업데이트 (`main` 또는 `develop` 브랜치 대상)
- `develop` 브랜치로의 push

**검증 항목:**
- ✅ **Lint**: ESLint를 통한 코드 스타일 검증
- ✅ **Typecheck**: TypeScript 타입 안정성 검증
- ✅ **Test**: Vitest 단위 테스트 실행 (커버리지 포함)
- ✅ **E2E**: Playwright E2E 테스트 실행 (main 브랜치 또는 수동 트리거 시)
- ✅ **Build**: 프로덕션 빌드 검증
- ✅ **Security**: pnpm audit를 통한 보안 취약점 스캔

**성능 최적화:**
- 🚀 병렬 실행: 6개 job이 동시에 실행되어 전체 시간 단축
- 💾 캐싱: pnpm store, node_modules, Turborepo 캐시 활용
- ⚡ 목표 실행 시간: 10분 이내 (캐시 히트 시 3-5분)

#### 2. Deploy Staging (스마트 배포)
`main` 브랜치에 코드가 병합되면 **변경된 앱만** 자동으로 staging 환경에 배포됩니다.

**실행 조건:**
- `main` 브랜치로의 push (자동)
- 수동 트리거 (배포할 앱 선택 가능: web, admin, both)

**스마트 배포 로직:**
- 📦 `apps/web/**` 변경 → Web Staging만 배포
- 📦 `apps/admin/**` 변경 → Admin Staging만 배포
- 📦 `packages/**` 변경 → Web + Admin Staging 모두 배포

**배포 프로세스:**
1. 변경 감지 (Path Filter)
2. 환경 설정 및 의존성 설치
3. 변경된 앱만 Staging 환경 빌드 (`NEXT_PUBLIC_ENV=staging`)
4. Docker 이미지 빌드 (Blue/Green 태그)
5. GitHub Container Registry에 푸시
6. 서버별 SSH 접속하여 배포
7. Blue-Green 배포 방식으로 무중단 배포
8. 배포 검증 및 헬스 체크

**배포 URL:**
- Web Staging: `https://staging.worklyteam.cloud`
- Admin Staging: `https://admin-staging.worklyteam.cloud`

**환경 변수:**
- GitHub Secrets/Variables로 중앙 관리
- 서버별 독립적인 SSH 키 및 호스트
- 환경별 API URL 자동 주입

#### 3. Deploy Production
수동 승인을 통해 production 환경에 배포합니다.

**실행 조건:**
- 수동 트리거 (GitHub Actions UI에서 실행)

**배포 옵션:**
- `app`: 배포할 앱 선택 (web, admin, both)
- `version`: 배포 버전 지정 (선택사항)
- `rollback`: 롤백 모드 활성화

**배포 프로세스:**
1. 선택한 앱만 Production 환경 빌드 (`NEXT_PUBLIC_ENV=production`)
2. Docker 이미지 빌드 (Blue/Green 태그)
3. GitHub Container Registry에 푸시
4. 서버별 SSH 접속하여 배포
5. Blue-Green 배포 방식으로 무중단 배포
6. 배포 검증 및 헬스 체크
7. 실패 시 롤백 가이드 제공

**배포 URL:**
- Web Production: `https://worklyteam.cloud`
- Admin Production: `https://admin.worklyteam.cloud`

**환경 변수:**
- GitHub Secrets/Variables로 중앙 관리
- 서버별 독립적인 SSH 키 및 호스트
- 환경별 API URL 자동 주입

### 배포 프로세스

#### Staging 배포 (자동)
```bash
# 자동 배포 (main 브랜치 병합 시)
git checkout main
git merge feature-branch
git push origin main

# → GitHub Actions가 자동으로 다음을 수행:
#    1. 변경된 파일 감지 (apps/web, apps/admin, packages)
#    2. 변경된 앱만 Docker 이미지 빌드
#    3. GitHub Container Registry에 푸시
#    4. 해당 서버에만 배포 파일 전송
#    5. Blue-Green 배포 실행
#    6. 헬스 체크 수행

# 예시: apps/web만 변경 → Web Staging만 배포
# 예시: packages 변경 → Web + Admin Staging 모두 배포
```

#### Staging 배포 (수동)
```bash
# 1. GitHub 저장소 → Actions 탭
# 2. "Deploy Staging" 워크플로우 선택
# 3. "Run workflow" 클릭
# 4. 배포할 앱 선택:
#    - web: Web Staging만 배포
#    - admin: Admin Staging만 배포
#    - both: 둘 다 배포
# 5. "Run workflow" 실행
```

#### Production 배포 (수동)
```bash
# 1. GitHub 저장소 → Actions 탭
# 2. "Deploy Production" 워크플로우 선택
# 3. "Run workflow" 클릭
# 4. 배포 옵션 설정:
#    - app: 배포할 앱 (web, admin, both)
#    - version: 배포 버전 (예: v1.2.3, 선택사항)
#    - rollback: 롤백 모드 (기본: false)
# 5. "Run workflow" 실행

# → GitHub Actions가 자동으로 다음을 수행:
#    1. 선택한 앱만 Docker 이미지 빌드
#    2. GitHub Container Registry에 푸시
#    3. 해당 서버에만 배포 파일 전송
#    4. Blue-Green 배포 실행
#    5. 헬스 체크 수행
```

#### 롤백
```bash
# 방법 1: GitHub Actions에서 롤백
# 1. Actions 탭 → Deploy Production 선택
# 2. Run workflow 클릭
# 3. app 선택 (web 또는 admin)
# 4. rollback 옵션을 true로 설정
# 5. Run workflow 실행

# 방법 2: 서버에서 직접 롤백
# Web 서버
ssh root@<web-server-ip>
cd /opt/workly/deployment/web
bash /opt/workly/scripts/rollback.sh web

# Admin 서버
ssh root@<admin-server-ip>
cd /opt/workly/deployment/admin
bash /opt/workly/scripts/rollback.sh admin
```

### 캐싱 전략

파이프라인은 다음 캐싱 전략을 사용하여 실행 속도를 최적화합니다:

1. **pnpm Store 캐싱**
   - 캐시 키: `pnpm-lock.yaml` 해시
   - 효과: 패키지 다운로드 시간 단축

2. **node_modules 캐싱**
   - 캐시 키: `pnpm-lock.yaml` 해시
   - 효과: 의존성 설치 시간 단축

3. **Turborepo 캐싱**
   - 캐시 키: 커밋 SHA
   - 효과: 빌드 및 테스트 결과 재사용

**예상 성능:**
- 첫 실행 (캐시 없음): ~8-10분
- 캐시 히트: ~3-5분 (50-60% 단축)
- 병렬 실행: 순차 실행 대비 5-6배 빠름

### 트러블슈팅

#### CI 실패 시

**1. Lint 실패**
```bash
# 로컬에서 lint 실행 및 자동 수정
pnpm lint --fix

# 수정 후 커밋
git add .
git commit -m "fix: lint 오류 수정"
git push
```

**2. Typecheck 실패**
```bash
# 로컬에서 타입 체크
pnpm typecheck

# 타입 오류 확인 및 수정
# 수정 후 커밋
git add .
git commit -m "fix: 타입 오류 수정"
git push
```

**3. Test 실패**
```bash
# 로컬에서 테스트 실행
pnpm test

# 실패한 테스트 확인 및 수정
# 수정 후 커밋
git add .
git commit -m "fix: 테스트 오류 수정"
git push
```

**4. Build 실패**
```bash
# 로컬에서 빌드 실행
pnpm build

# 빌드 오류 확인 및 수정
# 수정 후 커밋
git add .
git commit -m "fix: 빌드 오류 수정"
git push
```

**5. Security 스캔 실패**
```bash
# 로컬에서 보안 스캔 실행
pnpm audit

# Critical 취약점 확인
pnpm audit --audit-level=critical

# 취약점 수정
pnpm audit fix

# 수동 업데이트가 필요한 경우
pnpm update <package-name>

# 수정 후 커밋
git add pnpm-lock.yaml
git commit -m "fix: 보안 취약점 수정"
git push
```

#### 배포 실패 시

**Staging 배포 실패**
1. GitHub Actions 로그 확인
2. 실패 원인 파악 (빌드 오류, 환경 변수 누락 등)
3. 문제 수정 후 `main` 브랜치에 다시 push
4. 자동으로 재배포 시작

**Production 배포 실패**
1. GitHub Actions 로그 확인
2. 실패 원인 파악
3. 문제 수정 후 다시 수동 배포 트리거
4. 또는 롤백 옵션을 활성화하여 이전 버전으로 복구

**롤백 방법:**
```bash
# 방법 1: GitHub Actions에서 롤백
# 1. Actions 탭 → Deploy Production 선택
# 2. Run workflow 클릭
# 3. rollback 옵션을 true로 설정
# 4. Run workflow 실행

# 방법 2: 서버에서 직접 롤백
ssh root@<server-ip>
cd /opt/workly/deployment/web
bash /opt/workly/scripts/rollback.sh web
```

#### 캐시 문제

**캐시가 제대로 작동하지 않는 경우:**
```bash
# 1. pnpm-lock.yaml이 변경되었는지 확인
git status

# 2. GitHub Actions에서 캐시 로그 확인
# Setup action의 "Restore cache" 단계 확인

# 3. 캐시 강제 무효화 (필요 시)
# pnpm-lock.yaml을 수정하거나
# GitHub Actions 캐시를 수동으로 삭제
```

**Turborepo 캐시 문제:**
```bash
# 로컬 캐시 삭제
rm -rf .turbo

# 다시 빌드
pnpm build
```

#### 환경 변수 문제

**환경 변수가 누락된 경우:**

GitHub 저장소 → Settings → Secrets and variables → Actions

**필수 Secrets (8개):**
- `WEB_STAGING_SSH_KEY` - Web Staging 서버 SSH 개인 키
- `WEB_STAGING_HOST` - Web Staging 서버 IP 주소
- `WEB_PRODUCTION_SSH_KEY` - Web Production 서버 SSH 개인 키
- `WEB_PRODUCTION_HOST` - Web Production 서버 IP 주소
- `ADMIN_STAGING_SSH_KEY` - Admin Staging 서버 SSH 개인 키
- `ADMIN_STAGING_HOST` - Admin Staging 서버 IP 주소
- `ADMIN_PRODUCTION_SSH_KEY` - Admin Production 서버 SSH 개인 키
- `ADMIN_PRODUCTION_HOST` - Admin Production 서버 IP 주소

**필수 Variables (14개):**
- `REPOSITORY_NAME` - GitHub 저장소 경로 (예: Syncjin/workly_fe)
- `SSL_EMAIL` - SSL 인증서 발급용 이메일
- `WEB_STAGING_DOMAIN`, `WEB_STAGING_API_URL`, `WEB_STAGING_ADMIN_API_URL`
- `WEB_PRODUCTION_DOMAIN`, `WEB_PRODUCTION_API_URL`, `WEB_PRODUCTION_ADMIN_API_URL`
- `ADMIN_STAGING_DOMAIN`, `ADMIN_STAGING_API_URL`, `ADMIN_STAGING_ADMIN_API_URL`
- `ADMIN_PRODUCTION_DOMAIN`, `ADMIN_PRODUCTION_API_URL`, `ADMIN_PRODUCTION_ADMIN_API_URL`

**환경 변수 매핑:**
```
GitHub Variables → 빌드 시 환경 변수

WEB_STAGING_API_URL → NEXT_PUBLIC_API_URL
WEB_STAGING_ADMIN_API_URL → NEXT_PUBLIC_API2_URL
```

**상세 설정 가이드:** [deployment/GITHUB_SETUP.md](deployment/GITHUB_SETUP.md)

**참고:** Docker 이미지는 GitHub Container Registry를 사용하므로 `GITHUB_TOKEN`이 자동으로 사용됩니다.

#### 알림 문제

**Slack 알림이 오지 않는 경우:**
1. GitHub Actions 기본 알림 설정 확인
2. Slack webhook URL이 올바른지 확인
3. Secret이 제대로 설정되었는지 확인
4. Slack 앱 권한 확인

### 워크플로우 파일 위치

```
.github/
├── workflows/
│   ├── ci.yml                    # CI 워크플로우 (PR 검증)
│   ├── deploy-staging.yml        # Staging 자동 배포 (스마트 배포)
│   └── deploy-production.yml     # Production 수동 배포
└── actions/
    └── setup/
        └── action.yml            # 공통 설정 액션 (캐싱 포함)

deployment/
├── web/
│   ├── docker-compose.yml        # Web 서버 Docker 설정
│   ├── nginx/                    # Nginx 설정
│   └── scripts/                  # 배포 스크립트
├── admin/
│   ├── docker-compose.yml        # Admin 서버 Docker 설정
│   ├── nginx/                    # Nginx 설정
│   └── scripts/                  # 배포 스크립트
├── scripts/                      # 공통 스크립트 (SSL, 롤백 등)
├── README.md                     # 배포 설정 가이드
└── GITHUB_SETUP.md              # GitHub Secrets/Variables 설정 가이드
```

### 배포 아키텍처

```
GitHub Actions
  ↓
변경 감지 (Path Filter)
  ↓
├─ apps/web/** 변경 → Web 빌드 → Web 서버 배포
├─ apps/admin/** 변경 → Admin 빌드 → Admin 서버 배포
└─ packages/** 변경 → 둘 다 빌드 → 모든 서버 배포
  ↓
Docker 이미지 (Blue/Green)
  ↓
GitHub Container Registry
  ↓
서버별 SSH 배포
  ↓
Blue-Green 무중단 배포
  ↓
헬스 체크 및 검증
```

### 추가 리소스

- [GitHub Actions 문서](https://docs.github.com/en/actions)
- [Turborepo 캐싱 가이드](https://turbo.build/repo/docs/core-concepts/caching)
- [Docker 문서](https://docs.docker.com/)
- [pnpm 워크스페이스](https://pnpm.io/workspaces)
- [배포 설정 가이드](deployment/README.md)
- [GitHub Secrets/Variables 설정](deployment/GITHUB_SETUP.md)
- [배포 스크립트 가이드](deployment/scripts/README.md)

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
