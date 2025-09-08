// pages/api/auth/refresh.ts
import { log } from "@/lib/logger";
import { serialize } from "cookie";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const startTime = Date.now();

  if (req.method !== "POST") {
    log.warn("Refresh API: 허용되지 않은 HTTP 메서드", { method: req.method, operation: "refresh-api" });
    return res.status(405).json({ message: "Method not allowed" });
  }

  log.debug("Refresh API 요청 시작", { operation: "refresh-api" });

  try {
    // 클라이언트에서 body로 받은 refreshToken 또는 쿠키에서 가져오기
    const refreshToken = req.cookies.refreshToken; // HttpOnly이지만 서버 측이므로 접근 가능
    const csrfToken = req.cookies.csrfToken; // 비-HttpOnly

    if (!refreshToken) {
      log.warn("Refresh API: 리프레시 토큰을 찾을 수 없습니다", { hasCsrf: !!csrfToken, operation: "refresh-api" });

      return res.status(401).json({ message: "Refresh token not found" });
    }

    // 백엔드로 넘길 요청 헤더 구성
    const headers: Record<string, string> = {
      Accept: "application/json",
    };

    // 요청 쿠키 헤더
    const cookieParts: string[] = [serialize("refreshToken", refreshToken)];
    if (csrfToken) cookieParts.push(serialize("csrfToken", csrfToken));
    headers["cookie"] = cookieParts.join("; ");

    // CSRF 헤더
    if (csrfToken) headers["X-CSRF-TOKEN"] = csrfToken;

    const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/refresh`;
    log.debug("백엔드 API 호출 시작", { url: backendUrl, hasCsrfToken: !!csrfToken, operation: "refresh-api" });

    const backendRes = await fetch(backendUrl, {
      method: "POST",
      headers,
    });
    const resultData = await backendRes.json();
    console.log("resultData!! headers", headers);
    console.log("resultData!!", resultData);
    const backendDuration = Date.now() - startTime;

    if (!backendRes.ok) {
      log.error("백엔드 API 응답 오류", {
        status: backendRes.status,
        statusText: backendRes.statusText,
        duration: backendDuration,
        operation: "refresh-api",
      });
    } else {
      log.debug("백엔드 API 응답 성공", {
        status: backendRes.status,
        duration: backendDuration,
        operation: "refresh-api",
      });
    }

    const newRefreshToken: string | undefined = resultData?.data?.refreshToken;
    const expiresIn: number | undefined = resultData?.data?.expiresIn;
    if (!newRefreshToken || !expiresIn) {
      log.warn("응답에 refreshToken, expiresIn 누락", { operation: "refresh-api" });
      return res.status(502).json({ message: "Upstream payload missing refreshToken" });
    }
    const isProd = process.env.NODE_ENV === "production";
    const maxAge = Math.max(0, Math.floor(expiresIn));
    const cookie = serialize("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      path: "/",
      maxAge,
      expires: new Date(Date.now() + maxAge * 1000),
    });

    res.setHeader("Set-Cookie", cookie);
    return res.status(backendRes.status).json(resultData);
  } catch (error) {
    const duration = Date.now() - startTime;
    log.error("Refresh API 처리 중 오류 발생", {
      error,
      duration,
      operation: "refresh-api",
    });
    res.status(500).json({ message: "Internal server error" });
  }
}
