import { expect, test } from "@playwright/test";

test.describe("로그인 페이지", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
  });

  test("로그인 페이지가 정상적으로 로드된다", async ({ page }) => {
    // URL 확인
    expect(page.url()).toContain("/login");

    // 로고가 표시되는지 확인
    const logo = page.locator("svg");
    await expect(logo.first()).toBeVisible();
  });

  test("로그인 폼이 렌더링된다", async ({ page }) => {
    // ID 입력 필드 확인
    const userIdInput = page.locator("input#userId");
    await expect(userIdInput).toBeVisible();
    await expect(userIdInput).toHaveAttribute("placeholder", "ID를 입력해주세요");

    // 비밀번호 입력 필드 확인
    const passwordInput = page.locator('input#password[type="password"]');
    await expect(passwordInput).toBeVisible();
    await expect(passwordInput).toHaveAttribute("placeholder", "비밀번호를 입력해주세요");

    // 자동 로그인 체크박스 확인
    const autoLoginCheckbox = page.locator('input#autoLogin[type="checkbox"]');
    await expect(autoLoginCheckbox).toBeVisible();

    // 로그인 버튼 확인
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeVisible();
    await expect(submitButton).toHaveText("로그인");
  });

  test("아이디/비밀번호 찾기 링크가 있다", async ({ page }) => {
    const findLink = page.locator('button:has-text("아이디/비밀번호 찾기")');
    await expect(findLink).toBeVisible();
  });

  test("빈 폼 제출 시 유효성 검사가 작동한다", async ({ page }) => {
    // 로그인 버튼 클릭
    const submitButton = page.locator('button[type="submit"]:has-text("로그인")');
    await submitButton.click();

    // 에러 메시지가 표시될 때까지 대기
    await page.waitForTimeout(500);

    // 여전히 로그인 페이지에 있는지 확인
    expect(page.url()).toContain("/login");
  });

  test("ID와 비밀번호를 입력할 수 있다", async ({ page }) => {
    // ID 입력
    const userIdInput = page.locator("input#userId");
    await userIdInput.fill("testuser");
    await expect(userIdInput).toHaveValue("testuser");

    // 비밀번호 입력
    const passwordInput = page.locator("input#password");
    await passwordInput.fill("testpassword123");
    await expect(passwordInput).toHaveValue("testpassword123");
  });

  test("자동 로그인 체크박스를 토글할 수 있다", async ({ page }) => {
    const autoLoginCheckbox = page.locator("input#autoLogin");

    // 초기 상태 확인 (체크 안됨)
    await expect(autoLoginCheckbox).not.toBeChecked();

    // 체크박스 클릭
    await autoLoginCheckbox.check();
    await expect(autoLoginCheckbox).toBeChecked();

    // 다시 클릭하여 체크 해제
    await autoLoginCheckbox.uncheck();
    await expect(autoLoginCheckbox).not.toBeChecked();
  });

  test("아이디/비밀번호 찾기 버튼 클릭 시 페이지 이동", async ({ page }) => {
    const findLink = page.locator('button:has-text("아이디/비밀번호 찾기")');
    await findLink.click();

    // account-recovery 페이지로 이동하는지 확인
    await page.waitForURL("**/account-recovery");
    expect(page.url()).toContain("/account-recovery");
  });
});
