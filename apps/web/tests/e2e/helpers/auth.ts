import { Page } from "@playwright/test";

/**
 * 테스트용 로그인 헬퍼 함수
 * @param page Playwright Page 객체
 */
export async function login(page: Page) {
  await page.goto("/login");

  // 페이지가 완전히 로드될 때까지 대기
  await page.waitForLoadState("networkidle");

  // ID 입력
  await page.locator("input#userId").fill("admin");

  // 비밀번호 입력
  await page.locator("input#password").fill("admin1111");

  // 로그인 버튼 클릭
  await page.locator('button[type="submit"]:has-text("로그인")').click();

  // 게시판 페이지로 이동할 때까지 대기
  await page.waitForURL("**/board", { timeout: 15000 });

  // 페이지가 완전히 로드되고 쿠키가 설정될 때까지 추가 대기
  await page.waitForLoadState("networkidle");

  // CSRF 토큰 쿠키가 설정되었는지 확인
  const cookies = await page.context().cookies();
  const hasCsrfToken = cookies.some((cookie) => cookie.name === "csrfToken");

  if (!hasCsrfToken) {
    // CSRF 토큰이 없으면 짧은 대기 후 재확인
    await page.waitForTimeout(1000);
  }
}

/**
 * 로그아웃 헬퍼 함수 (필요시 사용)
 * @param page Playwright Page 객체
 */
export async function logout(page: Page) {
  // 로그아웃 버튼이나 링크를 찾아서 클릭
  // 실제 구현에 따라 셀렉터 조정 필요
  const logoutButton = page.locator('button:has-text("로그아웃")');
  if (await logoutButton.isVisible()) {
    await logoutButton.click();
    await page.waitForURL("**/login", { timeout: 5000 });
  }
}
