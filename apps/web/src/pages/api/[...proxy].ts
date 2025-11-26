import { log } from "@/lib/logger";
import { NextApiRequest, NextApiResponse } from "next";
import { isStateChangingMethod, validateCsrfToken } from "../../shared/lib/csrf-utils";
// 인증이 필요한 API 경로들
const protectedPaths = ["/board", "/admin", "/profile", "/dashboard", "/settings", "/must-read", "/my-posts", "/bookmarks", "/trash"];

// 특별 처리가 필요한 경로들 (프록시하지 않음)
const specialPaths = ["/auth/login", "/auth/refresh", "/auth/logout"];

// 토큰 갱신 Promise를 저장할 변수 (동시 요청 처리용)
let refreshPromise: Promise<string | null> | null = null;

// refreshToken으로 새 accessToken 가져오기
async function refreshAccessToken(refreshToken: string): Promise<string | null> {
  try {
    log.debug("refreshAccessToken 요청 시도", {
      operation: "proxy-api",
    });
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refreshToken: refreshToken,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return data.accessToken || null;
    }
    return null;
  } catch (error) {
    console.error("Token refresh failed:", error);
    return null;
  }
}

async function getRefreshedToken(refreshToken: string): Promise<string | null> {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = refreshAccessToken(refreshToken);

  try {
    const result = await refreshPromise;
    return result;
  } finally {
    refreshPromise = null;
  }
}

// 백엔드 API 요청 함수
async function makeApiRequest(apiPath: string, req: NextApiRequest, authHeader?: string) {
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1${apiPath}`, {
    method: req.method,
    headers: {
      "Content-Type": "application/json",
      ...(authHeader && { Authorization: authHeader }),
      // 쿠키도 전달
      ...(req.headers.cookie && { Cookie: req.headers.cookie }),
    },
    body: req.method !== "GET" && req.method !== "HEAD" ? JSON.stringify(req.body) : undefined,
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { proxy } = req.query;
  const apiPath = Array.isArray(proxy) ? `/${proxy.join("/")}` : `/${proxy}`;

  // 특별 처리 경로는 건너뛰기
  if (specialPaths.some((path) => apiPath.startsWith(path))) {
    return res.status(404).json({
      status: 404,
      code: "NOT_FOUND",
      message: "API endpoint not found",
      timestamp: new Date().toISOString(),
    });
  }

  // CSRF 검증 (상태 변경 요청에만 적용)
  if (isStateChangingMethod(req.method || "GET")) {
    const csrfCookie = req.cookies.csrfToken;
    const csrfHeader = req.headers["x-csrf-token"] as string | undefined;

    const validation = validateCsrfToken(csrfCookie, csrfHeader);

    if (!validation.valid) {
      log.warn("Proxy API: CSRF 검증 실패", {
        operation: "proxy-api",
        path: apiPath,
        method: req.method,
        hasCookie: !!csrfCookie,
        hasHeader: !!csrfHeader,
        error: validation.error,
      });

      return res.status(403).json({
        status: 403,
        code: "CSRF_TOKEN_INVALID",
        message: validation.error || "CSRF token validation failed",
        timestamp: new Date().toISOString(),
      });
    }

    log.debug("Proxy API: CSRF 검증 성공", {
      operation: "proxy-api",
      path: apiPath,
      method: req.method,
    });
  }

  // 인증이 필요한 경로인지 확인
  const needsAuth = protectedPaths.some((path) => apiPath.startsWith(path));

  if (needsAuth) {
    // Authorization 헤더에서 토큰 확인
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
    if (!token) {
      return res.status(401).json({
        status: 401,
        code: "MISSING_TOKEN",
        message: "Access token is required",
        timestamp: new Date().toISOString(),
      });
    }
  }

  // 백엔드 API로 프록시
  try {
    const authHeader = req.headers.authorization;

    // 첫 번째 요청 시도
    let response = await makeApiRequest(apiPath, req, authHeader);
    let data = await response.json();

    // 401 에러이고 인증이 필요한 경로인 경우 토큰 갱신 시도
    if (response.status === 401 && needsAuth) {
      // refreshToken 쿠키 확인
      const cookies = req.headers.cookie || "";
      const refreshTokenMatch = cookies.match(/refreshToken=([^;]+)/);
      const refreshToken = refreshTokenMatch ? refreshTokenMatch[1] : null;

      if (refreshToken) {
        // 새 accessToken 가져오기 (동시 요청 시 한 번만 실행)
        const newAccessToken = await getRefreshedToken(refreshToken);

        if (newAccessToken) {
          // 새 토큰으로 재시도
          const newAuthHeader = `Bearer ${newAccessToken}`;
          response = await makeApiRequest(apiPath, req, newAuthHeader);
          data = await response.json();
        }
      }
    }

    const backendCookies = response.headers.get("set-cookie");
    if (backendCookies) {
      res.setHeader("Set-Cookie", backendCookies);
    }

    res.status(response.status).json(data);
  } catch (error) {
    console.error("API Proxy error:", error);
    res.status(500).json({
      status: 500,
      code: "PROXY_ERROR",
      message: "Failed to communicate with backend",
      timestamp: new Date().toISOString(),
    });
  }
}
