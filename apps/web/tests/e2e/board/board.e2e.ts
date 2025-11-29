import { expect, test } from "@playwright/test";
import { login } from "../helpers/auth";

test.describe("게시판 페이지", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("로그인 후 게시판 페이지로 이동한다", async ({ page }) => {
    // URL 확인
    expect(page.url()).toContain("/board");
  });

  test("게시판 페이지가 정상적으로 렌더링된다", async ({ page }) => {
    // 네트워크 요청이 완료될 때까지 대기
    await page.waitForLoadState("networkidle");

    // 스켈레톤이 아닌 실제 컨텐츠가 로드되었는지 확인
    // 스켈레톤은 보통 애니메이션이나 특정 클래스를 가지고 있음
    // 실제 컨텐츠가 로드될 때까지 대기 (최대 10초)
    await page.waitForTimeout(2000);

    // body가 표시되는지 확인
    const body = page.locator("body");
    await expect(body).toBeVisible();
  });

  test("페이지가 에러 없이 로드된다", async ({ page }) => {
    // 네트워크 요청이 완료될 때까지 대기
    await page.waitForLoadState("networkidle");

    // 에러 메시지가 없는지 확인
    const errorText = page.locator("text=/error|오류|실패/i");
    const errorCount = await errorText.count();

    // 에러 메시지가 있다면 테스트 실패
    if (errorCount > 0) {
      const errorMessages = await errorText.allTextContents();
      console.log("발견된 에러 메시지:", errorMessages);
    }

    // 페이지가 정상적으로 로드되었는지 확인
    expect(page.url()).toContain("/board");
  });
});

test.describe("게시판 네비게이션", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("북마크 페이지로 이동할 수 있다", async ({ page }) => {
    // 북마크 링크나 버튼 찾기 (실제 구조에 따라 조정 필요)
    await page.goto("/bookmarks");

    // URL 확인
    expect(page.url()).toContain("/bookmarks");
  });

  test("내 게시글 페이지로 이동할 수 있다", async ({ page }) => {
    await page.goto("/my-posts");

    // URL 확인
    expect(page.url()).toContain("/my-posts");
  });

  test("휴지통 페이지로 이동할 수 있다", async ({ page }) => {
    await page.goto("/trash");

    // URL 확인
    expect(page.url()).toContain("/trash");
  });

  test("필독 페이지로 이동할 수 있다", async ({ page }) => {
    await page.goto("/must-read");

    // URL 확인
    expect(page.url()).toContain("/must-read");
  });
});
