# E2E 테스트 가이드

## 개요

이 디렉토리에는 Playwright를 사용한 E2E(End-to-End) 테스트가 포함되어 있습니다.

## 테스트 실행 방법

### 로컬 환경에서 실행

```bash
# 개발 서버를 먼저 실행 (별도 터미널)
pnpm --filter workly dev

# E2E 테스트 실행
pnpm --filter workly test:e2e

# UI 모드로 실행 (디버깅용)
pnpm --filter workly exec playwright test --ui

# 특정 테스트만 실행
pnpm --filter workly exec playwright test tests/e2e/auth/login.e2e.ts
```

### CI 환경에서 실행

CI에서는 E2E 테스트가 선택적으로 실행됩니다:

- main 브랜치에 푸시할 때
- 수동으로 워크플로우를 트리거할 때

## 테스트 작성 가이드

### 기본 구조

\`\`\`typescript
import { test, expect } from '@playwright/test';

test.describe('기능 이름', () => {
test.beforeEach(async ({ page }) => {
// 각 테스트 전에 실행
await page.goto('/페이지-경로');
});

test('테스트 케이스 설명', async ({ page }) => {
// 테스트 로직
const element = page.locator('셀렉터');
await expect(element).toBeVisible();
});
});
\`\`\`

### 베스트 프랙티스

1. **명확한 테스트 이름**: 테스트가 무엇을 검증하는지 명확하게 작성
2. **독립적인 테스트**: 각 테스트는 다른 테스트에 의존하지 않아야 함
3. **적절한 대기**: `waitForLoadState`, `waitForSelector` 등을 활용
4. **의미있는 셀렉터**: data-testid 속성 사용 권장
5. **에러 처리**: 예상되는 에러 상황도 테스트

## 현재 테스트 파일

- `smoke.e2e.ts` - 기본 기능 빠른 확인 (Smoke 테스트)
- `auth/login.e2e.ts` - 로그인 페이지 및 폼 검증
- `auth/login-flow.e2e.ts` - 로그인 플로우 전체 테스트
- `board/board.e2e.ts` - 게시판 페이지 테스트
- `accessibility.e2e.ts` - 접근성 검증
- `helpers/auth.ts` - 로그인/로그아웃 헬퍼 함수

## 테스트 종류

### Smoke 테스트

가장 기본적인 기능이 작동하는지 빠르게 확인하는 테스트입니다.

- 로그인 페이지 로드
- 로그인 후 게시판 접근
- 주요 페이지 접근 가능 여부
- 페이지 전환

### 기능 테스트

특정 기능이 제대로 작동하는지 상세하게 확인하는 테스트입니다.

- 로그인 폼 검증
- 로그인 플로우
- 게시판 페이지 렌더링

### 접근성 테스트

웹 접근성 표준을 준수하는지 확인하는 테스트입니다.

## 주의사항

- E2E 테스트는 실제 브라우저에서 실행되므로 시간이 오래 걸립니다
- 로컬에서 테스트 시 개발 서버가 실행 중이어야 합니다
- `playwright.config.ts`에서 `webServer` 설정이 활성화되어 있으면 자동으로 서버를 시작합니다

## 문제 해결

### 테스트가 실패하는 경우

1. 개발 서버가 실행 중인지 확인
2. 포트 3000이 사용 가능한지 확인
3. Playwright 브라우저가 설치되어 있는지 확인: `pnpm --filter workly exec playwright install`

### 디버깅

```bash
# 헤드리스 모드 비활성화 (브라우저 창 표시)
pnpm --filter workly exec playwright test --headed

# 특정 테스트만 디버그 모드로 실행
pnpm --filter workly exec playwright test --debug tests/e2e/auth/login.e2e.ts
```
