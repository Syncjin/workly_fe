import { expect, test } from "@playwright/test";

test.describe("접근성", () => {
  test("로그인 페이지가 키보드로 탐색 가능하다", async ({ page }) => {
    await page.goto("/login");

    // 첫 번째 입력 필드로 Tab 이동
    await page.keyboard.press("Tab");

    // 포커스된 요소가 있는지 확인
    const focusedElement = await page.evaluate(() => {
      return document.activeElement?.tagName;
    });

    expect(focusedElement).toBeTruthy();
    expect(["INPUT", "BUTTON", "A"]).toContain(focusedElement);
  });

  test("페이지에 적절한 제목이 있다", async ({ page }) => {
    await page.goto("/login");

    // 페이지 타이틀이 비어있지 않은지 확인
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
  });

  test("폼 입력 필드에 적절한 레이블이나 placeholder가 있다", async ({ page }) => {
    await page.goto("/login");

    // ID 입력 필드
    const userIdInput = page.locator("input#userId");
    const userIdPlaceholder = await userIdInput.getAttribute("placeholder");
    expect(userIdPlaceholder).toBeTruthy();

    // 비밀번호 입력 필드
    const passwordInput = page.locator("input#password");
    const passwordPlaceholder = await passwordInput.getAttribute("placeholder");
    expect(passwordPlaceholder).toBeTruthy();
  });

  test("버튼에 접근 가능한 텍스트가 있다", async ({ page }) => {
    await page.goto("/login");

    // 로그인 버튼
    const loginButton = page.locator('button[type="submit"]');
    const loginButtonText = await loginButton.textContent();
    expect(loginButtonText?.trim()).toBeTruthy();

    // 아이디/비밀번호 찾기 버튼
    const findButton = page.locator('button:has-text("아이디/비밀번호 찾기")');
    const findButtonText = await findButton.textContent();
    expect(findButtonText?.trim()).toBeTruthy();
  });

  test("체크박스에 레이블이 있다", async ({ page }) => {
    await page.goto("/login");

    // 자동 로그인 체크박스의 레이블 확인
    const autoLoginLabel = page.locator('label:has-text("자동 로그인")');
    await expect(autoLoginLabel).toBeVisible();
  });
});
