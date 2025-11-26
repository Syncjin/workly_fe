import { serialize } from "cookie";

/**
 * CSRF 토큰 쿠키 생성 옵션
 */
export interface CreateCsrfCookieOptions {
  token: string;
  maxAge?: number; // 기본값: 14일
}

/**
 * Refresh Token 쿠키 생성 옵션
 */
export interface CreateRefreshTokenCookieOptions {
  token: string;
  maxAge: number;
}

/**
 * 현재 환경이 프로덕션인지 확인
 */
function isProduction(): boolean {
  return process.env.NODE_ENV === "production";
}

const CSRF_MAX_AGE = 60 * 60 * 24 * 14; // 14일

/**
 * CSRF 토큰 쿠키 생성
 * - httpOnly: false (클라이언트에서 읽기 가능)
 * - sameSite: lax (일반적인 네비게이션에서 전송 허용)
 * - secure: 프로덕션에서만 true
 * - maxAge: 14일 (기본값)
 */
export function createCsrfTokenCookie({ token, maxAge = CSRF_MAX_AGE }: CreateCsrfCookieOptions): string {
  return serialize("csrfToken", token, {
    httpOnly: false,
    secure: isProduction(),
    sameSite: "lax",
    path: "/",
    maxAge,
  });
}

/**
 * Refresh Token 쿠키 생성
 * - httpOnly: true (JavaScript 접근 차단)
 * - sameSite: lax (일반적인 네비게이션에서 전송 허용)
 * - secure: 프로덕션에서만 true
 * - maxAge: 백엔드에서 제공한 값 사용
 */
export function createRefreshTokenCookie({ token, maxAge }: CreateRefreshTokenCookieOptions): string {
  return serialize("refreshToken", token, {
    httpOnly: true,
    secure: isProduction(),
    sameSite: "lax",
    path: "/",
    maxAge,
    expires: new Date(Date.now() + maxAge * 1000),
  });
}

/**
 * 쿠키 삭제용 (maxAge: 0)
 * @param name - 삭제할 쿠키 이름 ("csrfToken" 또는 "refreshToken")
 */
export function createExpiredCookie(name: "csrfToken" | "refreshToken"): string {
  return serialize(name, "", {
    httpOnly: name === "refreshToken",
    secure: isProduction(),
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}
