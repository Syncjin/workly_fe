/**
 * 인증 관련 공통 유틸리티
 *
 * 각 애플리케이션(web, admin)은 자신의 경로 설정을 정의하고
 * 이 유틸리티 함수들을 사용하여 인증 체크를 수행합니다.
 */

/**
 * URL이 공개 API 패턴과 일치하는지 확인
 */
export function isPublicApiEndpoint(url: string, patterns: readonly string[] = []): boolean {
  return patterns.some((pattern) => url.includes(pattern));
}

/**
 * 경로가 공개 페이지인지 확인
 */
export function isPublicPage(pathname: string, paths: readonly string[] = []): boolean {
  return paths.some((path) => pathname.startsWith(path));
}

/**
 * 경로가 보호된 페이지인지 확인
 */
export function isProtectedPage(pathname: string, paths: readonly string[] = []): boolean {
  return paths.some((path) => pathname.startsWith(path));
}
