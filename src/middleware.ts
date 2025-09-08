// middleware.ts (프로젝트 루트에 위치)
import { NextRequest, NextResponse } from "next/server";
// import { log } from './lib/logger';

// 보호된 페이지 경로들
const protectedPaths = ["/board", "/posts", "/profile", "/dashboard", "/admin"];
const authPaths = ["/login", "/register"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  console.log("middleware----------", pathname);
  // API 경로는 통합 프록시에서 처리하므로 미들웨어에서는 건너뛰기
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // refreshToken, csrfToken 쿠키 확인
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const csrfToken = request.cookies.get("csrfToken")?.value;

  const isProtectedPath = protectedPaths.some((path) => pathname.startsWith(path));
  const isAuthPath = authPaths.some((path) => pathname.startsWith(path));

  if (pathname === "/") {
    console.log("loginUrl로 이동");
    if (!refreshToken || !csrfToken) {
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
    const boardUrl = new URL("/board", request.url);
    return NextResponse.redirect(boardUrl);
  }
  // 보호된 경로에 refreshToken 없이 접근하는 경우
  if (isProtectedPath && (!refreshToken || !csrfToken)) {
    console.log("middleware---------보호된 경로", pathname);
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname); // 로그인 후 돌아갈 경로 저장
    return NextResponse.redirect(loginUrl);
  }

  // 이미 로그인된 사용자가 로그인/회원가입 페이지에 접근하는 경우
  if (isAuthPath && refreshToken && csrfToken) {
    console.log("이미 로그인된 사용자");
    const redirectPath = request.nextUrl.searchParams.get("redirect") || "/posts";
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
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
