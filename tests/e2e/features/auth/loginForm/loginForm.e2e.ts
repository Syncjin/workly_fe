import { expect, test } from "@playwright/test";

test.describe("LoginForm", () => {
  test.beforeEach(async ({ page }) => {
    // 로그인 화면으로 이동
    await page.goto("/login");
  });
  test("빈 값 제출 시 검증 에러가 표시된다", async ({ page }) => {
    // '로그인' 버튼 클릭
    await page.getByRole("button", { name: "로그인" }).click();

    // RHF + zod 스키마 메시지에 맞춰 수정
    await expect(page.getByText(/ID를 입력/)).toBeVisible();
    await expect(page.getByText(/비밀번호를 입력/)).toBeVisible();
  });

  test("자동 로그인 체크박스 토글이 동작한다", async ({ page }) => {
    const checkbox = page.getByRole("checkbox", { name: "자동 로그인" });
    await expect(checkbox).not.toBeChecked();
    await checkbox.check();
    await expect(checkbox).toBeChecked();
    await checkbox.uncheck();
    await expect(checkbox).not.toBeChecked();
  });

  test("아이디/비밀번호 찾기 링크로 이동한다", async ({ page }) => {
    // 링크/버튼 클릭
    await page.getByRole("button", { name: "아이디/비밀번호 찾기" }).click();
    // 이동 경로
    await expect(page).toHaveURL(/\/auth\/(forgot|find)/);
  });

  test("성공 로그인 시 API가 호출되고 폼이 로딩/해제된다", async ({ page }) => {
    // 로그인 API 모킹
    const loginApiPattern = "**/api/v1/auth/login";
    const expectedBody = { userId: "eunji", password: "secret123", autoLogin: false };

    // 요청 본문/헤더 검사 + 응답 모킹
    await page.route(loginApiPattern, async (route) => {
      const req = route.request();
      const body = req.postDataJSON();

      // 바디 필드명은 실제 백엔드 스펙에 맞춰 확인
      expect(body.userId).toBe(expectedBody.userId);
      expect(body.password).toBe(expectedBody.password);
      // RHF 필드명이 autoLogin이라면 아래도 통과
      expect(body.autoLogin ?? true).toBeTruthy();

      // CSRF 헤더 등을 쓰는 경우 이렇게 검증 가능(실제 이름으로 교체)
      // expect(req.headers()['x-csrf-token']).toBeTruthy();

      // 성공 응답 (백엔드 응답 스키마에 맞춰 수정)
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          code: 200,
          message: "OK",
          data: {
            accessToken: "fake-at",
            csrfToken: "fake-csrf",
          },
        }),
      });
    });

    // 입력
    await page.getByPlaceholder("ID를 입력해주세요").fill(expectedBody.userId);
    await page.getByPlaceholder("비밀번호를 입력해주세요").fill(expectedBody.password);
    await page.getByRole("checkbox", { name: "자동 로그인" }).check();

    // 제출 직전 버튼 활성/문구
    const submit = page.getByRole("button", { name: "로그인" });
    await expect(submit).toBeEnabled();

    // 제출
    await Promise.all([page.waitForResponse(loginApiPattern), submit.click()]);

    // 제출 직후 로딩 문구가 잠시 보였다가 해제되는지(문구/상태는 실제 구현대로 조정)
    await expect(page.getByRole("button", { name: "로그인 중..." })).toBeVisible();
    // 로딩 해제 대기
    await expect(page.getByRole("button", { name: "로그인" })).toBeEnabled({ timeout: 5000 });

    // 성공 후 이동/토스트 등을 검증 (실제 동작에 맞춰 선택)
    // 예: await expect(page).toHaveURL(/\/dashboard/);
    // 또는 성공 토스트 텍스트:
    // await expect(page.getByText('로그인 성공')).toBeVisible();
  });

  test("실패 로그인 시 에러 메시지가 노출된다", async ({ page }) => {
    await page.route("**/api/v1/auth/login", async (route) => {
      await route.fulfill({
        status: 401,
        contentType: "application/json",
        body: JSON.stringify({
          code: 401,
          message: "INVALID_CREDENTIALS",
          data: null,
        }),
      });
    });

    await page.getByPlaceholder("ID를 입력해주세요").fill("wrong");
    await page.getByPlaceholder("비밀번호를 입력해주세요").fill("nope");
    await Promise.all([page.waitForResponse("**/api/v1/auth/login"), page.getByRole("button", { name: "로그인" }).click()]);

    // UI에 나타나는 에러 텍스트를 실제 구현대로 맞추세요.
    await expect(page.getByText(/아이디 또는 비밀번호/)).toBeVisible();
  });
});
