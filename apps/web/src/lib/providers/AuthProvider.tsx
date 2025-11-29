"use client";

import { getAccessToken, getAutoLoginFlag, getCsrfTokenFromCookie, logout, removeAutoLoginFlag, setAccessToken } from "@/shared/lib/auth";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const authPaths = ["/login", "/register"];

export function AuthProvider({ children, fallback = <div>Loading authentication...</div> }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  const pathname = usePathname();
  const [ready, setReady] = useState(!!getAccessToken());

  const mountedRef = useRef(true);

  useEffect(() => {
    if (getAccessToken()) {
      setReady(true);
      return;
    }

    // 로그인/회원가입 페이지는 토큰 갱신 불필요
    const isAuthPath = authPaths.some((path) => pathname?.startsWith(path));
    if (isAuthPath) {
      setReady(true);
      return;
    }

    (async () => {
      mountedRef.current = true;
      const csrfToken = getCsrfTokenFromCookie();
      if (!csrfToken) {
        await logout();
        return;
      }
      const autoLoginEnabled = getAutoLoginFlag();

      try {
        const res = await fetch("/api/auth/refresh", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "x-csrf-token": csrfToken,
          },
          body: JSON.stringify({
            renewRefreshToken: autoLoginEnabled, // 자동 로그인 시에만 RefreshToken 갱신
          }),
        });

        const text = await res.text();
        let body: { data?: { accessToken?: string }; accessToken?: string; token?: string; code?: string; errorCode?: string; error?: string } | null = null;
        try {
          body = text ? JSON.parse(text) : null;
        } catch {
          body = null;
        }

        if (res.ok) {
          const at = body?.data?.accessToken ?? body?.accessToken ?? body?.token ?? null;
          if (at) {
            setAccessToken(at);
            setReady(true);
            return;
          }
        }

        // 갱신 실패 시 처리
        const code: string | undefined = body?.code ?? body?.errorCode ?? body?.error;
        const shouldLogout = !res.ok || res.status === 401 || res.status === 403 || code === "FORBIDDEN" || code === "CSRF_TOKEN_INVALID" || code === "CSRF_INVALID";

        if (shouldLogout) {
          if (autoLoginEnabled) {
            removeAutoLoginFlag();
          }
          await logout();
        }
      } catch {
        if (autoLoginEnabled) {
          removeAutoLoginFlag();
        }
        await logout();
      }
    })();

    return () => {
      mountedRef.current = false;
    };
  }, [pathname]);

  if (!ready) return <>{fallback}</>;
  return <>{children}</>;
}
