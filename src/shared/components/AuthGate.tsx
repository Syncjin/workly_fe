// shared/components/AuthGate.tsx
"use client";

import { getAccessToken, initializeAuth } from "@/shared/lib/auth";
import { useEffect, useState } from "react";

let bootOnce: Promise<boolean> | null = null;
function ensureAuthOnce() {
  if (!bootOnce) {
    bootOnce = initializeAuth()
      .then((ok) => !!ok)
      .catch(() => false);
  }
  return bootOnce;
}

/**
 * 초기 진입 시 accessToken을 확보할 때까지 children 렌더를 지연
 * - refreshToken은 HttpOnly 라서 JS로 "읽지" 않지만, /api/auth/refresh 로 요청시 쿠키가 자동 전송됨
 * - initializeAuth 안에서 /api/auth/refresh 호출 + setAccessToken 수행
 */
export function AuthGate({
  children,
  fallback = null, // 필요하면 스켈레톤/스피너 넣으세요
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  // 이미 AT가 있으면 바로 통과
  const [ready, setReady] = useState<boolean>(!!getAccessToken());

  useEffect(() => {
    if (ready) return;
    let alive = true;

    ensureAuthOnce().finally(() => {
      if (!alive) return;
      // initializeAuth() 성공/실패와 무관하게 '초기화 완료' 시점에 열어줌
      // (성공이면 AT가 set 되어 있고, 실패면 비로그인 상태로 진행)
      setReady(true);
    });

    return () => {
      alive = false;
    };
  }, [ready]);

  if (!ready) return <>{fallback}</>;
  return <>{children}</>;
}
