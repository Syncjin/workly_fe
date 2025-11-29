import { expect, test } from "@playwright/test";

test.describe("로그인 플로우", () => {
  test("성공적인 로그인 후 게시판으로 이동한다", async ({ page }) => {
    // 로그인 페이지로 이동
    await page.goto("/login");

    // ID 입력
    const userIdInput = page.locator("input#userId");
    await userIdInput.fill("admin");

    // 비밀번호 입력
    const passwordInput = page.locator("input#password");
    await passwordInput.fill("admin1111");

    // 로그인 버튼 클릭
    const loginButton = page.locator('button[type="submit"]:has-text("로그인")');
    await loginButton.click();

    // 게시판 페이지로 리다이렉트될 때까지 대기
    await page.waitForURL("**/board", { timeout: 10000 });

    // URL 확인
    expect(page.url()).toContain("/board");
  });

  test("잘못된 비밀번호로 로그인 시 에러 메시지가 표시된다", async ({ page }) => {
    await page.goto("/login");

    // ID 입력
    await page.locator("input#userId").fill("admin");

    // 잘못된 비밀번호 입력
    await page.locator("input#password").fill("wrongpassword");

    // 로그인 버튼 클릭
    await page.locator('button[type="submit"]:has-text("로그인")').click();

    // 에러 메시지가 표시될 때까지 대기
    await page.waitForTimeout(1000);

    // 여전히 로그인 페이지에 있는지 확인
    expect(page.url()).toContain("/login");
  });

  test("자동 로그인 체크 후 로그인", async ({ page }) => {
    await page.goto("/login");

    // ID 입력
    await page.locator("input#userId").fill("admin");

    // 비밀번호 입력
    await page.locator("input#password").fill("admin1111");

    // 자동 로그인 체크
    const autoLoginCheckbox = page.locator("input#autoLogin");
    await autoLoginCheckbox.check();
    await expect(autoLoginCheckbox).toBeChecked();

    // 로그인 버튼 클릭
    await page.locator('button[type="submit"]:has-text("로그인")').click();

    // 게시판 페이지로 이동
    await page.waitForURL("**/board", { timeout: 10000 });
    expect(page.url()).toContain("/board");
  });
});
