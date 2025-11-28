import { expect, test } from "@playwright/test";
import { login } from "./helpers/auth";

/**
 * Smoke 테스트 - 기본적인 기능이 작동하는지 빠르게 확인
 */
test.describe("Smoke 테스트", () => {
  test("로그인 페이지가 로드된다", async ({ page }) => {
    await page.goto("/login");

    // URL 확인
    expect(page.url()).toContain("/login");

    // 로그인 폼이 있는지 확인
    const loginButton = page.locator('button[type="submit"]:has-text("로그인")');
    await expect(loginButton).toBeVisible();
  });

  test("로그인 후 게시판 페이지로 이동한다", async ({ page }) => {
    await login(page);

    // URL 확인
    expect(page.url()).toContain("/board");

    // 페이지가 로드되었는지 확인
    await page.waitForLoadState("networkidle");
  });

  test("주요 페이지들이 접근 가능하다", async ({ page }) => {
    await login(page);

    // 게시판
    await page.goto("/board");
    expect(page.url()).toContain("/board");

    // 북마크
    await page.goto("/bookmarks");
    expect(page.url()).toContain("/bookmarks");

    // 내 게시글
    await page.goto("/my-posts");
    expect(page.url()).toContain("/my-posts");

    // 휴지통
    await page.goto("/trash");
    expect(page.url()).toContain("/trash");
  });

  test("페이지 전환이 정상적으로 작동한다", async ({ page }) => {
    await login(page);

    // 게시판에서 시작
    expect(page.url()).toContain("/board");

    // 북마크로 이동
    await page.goto("/bookmarks");
    await page.waitForLoadState("networkidle");
    expect(page.url()).toContain("/bookmarks");

    // 다시 게시판으로
    await page.goto("/board");
    await page.waitForLoadState("networkidle");
    expect(page.url()).toContain("/board");
  });
});
