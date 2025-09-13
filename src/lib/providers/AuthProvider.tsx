"use client";

import { getAccessToken, logout, setAccessToken } from "@/shared/lib/auth";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function AuthProvider({ children, fallback = <div>auth...</div> }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  const pathname = usePathname();
  const [ready, setReady] = useState(!!getAccessToken());
  const authPaths = ["/login", "/register"];
  
  useEffect(() => {
    
    if (ready) return;
    let alive = true;

    (async () => {
      const isAuthPath = authPaths.some((path) => pathname?.startsWith(path));
      if(isAuthPath) {
        setReady(true);
        return;
      }
      const res = await fetch("/api/auth/refresh", { method: "POST", credentials: "include" });
      if (!alive) return;

      if (res.ok) {
        const body = await res.json();
        const at = body?.data?.accessToken ?? body?.accessToken;
        if (at) {
          setAccessToken(at);
          setReady(true);
          return;
        }
      }
      await logout();
      setReady(true);
    })();

    return () => { alive = false; };
  }, [ready, pathname]);

  if (!ready) return <>{fallback}</>;
  return <>{children}</>;
}