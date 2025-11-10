"use client";

import { getAccessToken, getCsrfTokenFromCookie, logout, setAccessToken } from "@/shared/lib/auth";
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

    const isAuthPath = authPaths.some((path) => pathname?.startsWith(path));
    if (isAuthPath) {
      setReady(true);
      return;
    }

    (async () => {
      mountedRef.current = true;
      // 갱신 시도 시작
      const csrfToken = getCsrfTokenFromCookie();
      if (!csrfToken) {
        await logout();
        return;
      }
      try {
        const res = await fetch("/api/auth/refresh", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "x-csrf-token": csrfToken,
          },
        });

        const text = await res.text();
        let body: any = null;
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

        const code: string | undefined = body?.code ?? body?.errorCode ?? body?.error;
        const shouldLogout =
          !isAuthPath &&
          (!res.ok || // 4xx/5xx
            res.status === 401 ||
            res.status === 403 ||
            code === "FORBIDDEN" ||
            code === "CSRF_TOKEN_INVALID" ||
            code === "CSRF_INVALID");

        if (shouldLogout) {
          await logout();
        }
      } catch (e: any) {
        if (!isAuthPath) await logout();
      }
    })();

    return () => {
      mountedRef.current = false;
    };
  }, [pathname]);

  if (!ready) return <>{fallback}</>;
  return <>{children}</>;
}
