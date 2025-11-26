import { log } from "@/lib/logger";
import { serialize } from "cookie";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const startTime = Date.now();

  if (req.method !== "POST") {
    log.warn("Revoke API: 허용되지 않은 HTTP 메서드", { method: req.method, operation: "revoke-api" });
    return res.status(405).json({ message: "Method not allowed" });
  }

  log.debug("Revoke API 요청 시작", { operation: "revoke-api" });

  try {
    // HttpOnly 쿠키에서 refreshToken 가져오기
    const refreshToken = req.cookies.refreshToken;
    const csrfTokenFromCookie = req.cookies?.["csrfToken"];

    if (!refreshToken) {
      log.warn("Revoke API: 리프레시 토큰 없음", { operation: "revoke-api" });
      return res.status(401).json({ message: "Refresh token not found" });
    }

    const headers: Record<string, string> = { Accept: "application/json" };

    const cookieHeader = [serialize("refreshToken", refreshToken)];
    if (csrfTokenFromCookie) {
      cookieHeader.push(serialize("csrfToken", csrfTokenFromCookie));
    }
    headers["cookie"] = cookieHeader.join("; ");

    const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/revoke`;
    const backendRes = await fetch(backendUrl, {
      method: "POST",
      headers,
    });

    const resultData = await backendRes.json();
    log.debug("Revoke API 응답", { operation: "revoke-api", status: backendRes.status });

    if (!backendRes.ok) {
      log.error("백엔드 API 응답 오류", {
        status: backendRes.status,
        resultData,
        operation: "revoke-api",
      });
      return res.status(backendRes.status).json(resultData);
    }

    return res.status(backendRes.status).json(resultData);
  } catch (error) {
    const duration = Date.now() - startTime;
    log.error("Revoke API 처리 중 오류 발생", {
      error,
      duration,
      operation: "revoke-api",
    });
    return res.status(500).json({ message: "Internal server error" });
  }
}
