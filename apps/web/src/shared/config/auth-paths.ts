/**
 * Web 애플리케이션의 인증 경로 설정
 */

/**
 * 인증이 필요하지 않은 API 엔드포인트 패턴
 * 이 경로들은 401 응답 시 토큰 갱신을 시도하지 않습니다.
 */
export const PUBLIC_API_PATTERNS = ["/auth/login", "/auth/logout", "/auth/forgot-id", "/auth/forgot-password", "/auth/reset-password"] as const;

/**
 * 인증이 필요하지 않은 페이지 경로
 */
export const PUBLIC_PAGE_PATHS = ["/login", "/account-recovery", "/reset-password"] as const;

/**
 * 인증이 필요한 페이지 경로
 */
export const PROTECTED_PAGE_PATHS = ["/board", "/profile", "/dashboard", "/must-read", "/article", "/bookmarks", "/my-posts", "/trash"] as const;
