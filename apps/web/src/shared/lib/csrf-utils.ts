/**
 * CSRF 토큰 검증 결과 인터페이스
 */
export interface CsrfValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * CSRF 토큰 검증
 * 쿠키와 헤더의 토큰이 일치하는지 확인 (더블 서브밋 패턴)
 *
 * @param cookieToken - 쿠키에서 추출한 csrfToken
 * @param headerToken - x-csrf-token 헤더 값
 * @returns 검증 결과 객체
 */
export function validateCsrfToken(cookieToken: string | undefined, headerToken: string | undefined): CsrfValidationResult {
  // 1. 토큰 존재 여부 확인
  if (!cookieToken || !headerToken) {
    return {
      valid: false,
      error: "CSRF token missing from cookie or header",
    };
  }

  // 2. 토큰 일치 여부 확인 (더블 서브밋 패턴)
  if (cookieToken !== headerToken) {
    return {
      valid: false,
      error: "CSRF token mismatch",
    };
  }

  return { valid: true };
}

/**
 * 요청이 상태 변경 메서드인지 확인
 * POST, PUT, PATCH, DELETE는 CSRF 검증 필요
 * GET, HEAD는 검증 불필요
 *
 * @param method - HTTP 메서드
 * @returns 상태 변경 메서드 여부
 */
export function isStateChangingMethod(method: string): boolean {
  return ["POST", "PUT", "PATCH", "DELETE"].includes(method.toUpperCase());
}
