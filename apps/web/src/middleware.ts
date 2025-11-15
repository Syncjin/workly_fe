// middleware.ts (프로젝트 루트에 위치)
import { PROTECTED_PAGE_PATHS, PUBLIC_PAGE_PATHS } from "@/shared/config/auth-paths";
import { isProtectedPage, isPublicPage } from "@workly/api";
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // API 경로는 통합 프록시에서 처리하므로 미들웨어에서는 건너뛰기
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // refreshToken, csrfToken 쿠키 확인
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const csrfToken = request.cookies.get("csrfToken")?.value;

  const isProtectedPath = isProtectedPage(pathname, PROTECTED_PAGE_PATHS);
  const isAuthPath = isPublicPage(pathname, PUBLIC_PAGE_PATHS);

  if (pathname === "/") {
    if (!refreshToken || !csrfToken) {
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
    const boardUrl = new URL("/board", request.url);
    return NextResponse.redirect(boardUrl);
  }
  // 보호된 경로에 refreshToken 없이 접근하는 경우
  if (isProtectedPath && (!refreshToken || !csrfToken)) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname); // 로그인 후 돌아갈 경로 저장
    return NextResponse.redirect(loginUrl);
  }

  // 이미 로그인된 사용자가 로그인/회원가입 페이지에 접근하는 경우
  if (isAuthPath && refreshToken && csrfToken) {
    const redirectPath = request.nextUrl.searchParams.get("redirect") || "/board";
    return NextResponse.redirect(new URL(redirectPath, request.url));
  }
  return NextResponse.next();
}

// 미들웨어가 실행될 경로 설정
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|fonts/|.well-known/|public/).*)",
  ],
};
