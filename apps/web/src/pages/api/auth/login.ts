// pages/api/auth/login.ts
import type { NextApiRequest, NextApiResponse } from "next";

// CSRF 토큰을 Set-Cookie 헤더에서 추출하는 함수
function extractCsrfTokenFromSetCookie(setCookieHeader: string): string | null {
  try {
    // Set-Cookie 헤더는 여러 쿠키를 포함할 수 있으므로 분리
    const cookies = setCookieHeader.split(",").map((cookie) => cookie.trim());

    for (const cookie of cookies) {
      // csrfToken= 으로 시작하는 쿠키 찾기
      if (cookie.startsWith("csrfToken=")) {
        const tokenMatch = cookie.match(/csrfToken=([^;]+)/);
        if (tokenMatch && tokenMatch[1]) {
          return tokenMatch[1];
        }
      }
    }
    return null;
  } catch (error) {
    console.error("Error extracting CSRF token from Set-Cookie header:", error);
    return null;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    console.log("api token request", req.body);
    const loginRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });

    const data = await loginRes.json();

    // 백엔드의 Set-Cookie 헤더를 그대로 전달
    const backendCookies = loginRes.headers.get("set-cookie");

    if (backendCookies) {
      // 개발 환경에서 쿠키 설정 문제를 해결하기 위해 쿠키 옵션 수정
      let modifiedCookies = backendCookies;

      // 개발 환경에서 Secure 속성 제거 (HTTPS가 아닌 경우)
      if (process.env.NODE_ENV === "development") {
        modifiedCookies = backendCookies.replace(/;\s*Secure/gi, "");
        console.log("개발 환경: Secure 속성 제거됨");
      }

      res.setHeader("Set-Cookie", modifiedCookies);
      console.log("Set-Cookie header forwarded to client");
      console.log("Set-Cookie 내용:", modifiedCookies);

      // Set-Cookie 헤더에서 CSRF 토큰 추출하여 응답 데이터에 포함
      const csrfToken = extractCsrfTokenFromSetCookie(backendCookies);

      console.log("CSRF token????", csrfToken);
      if (csrfToken) {
        // 응답 데이터에 csrfToken 추가
        data.data = {
          ...data.data,
          csrfToken: csrfToken,
        };
        console.log("CSRF token extracted and added to response data");
      } else {
        console.log("No CSRF token found in Set-Cookie header");
      }
    } else {
      console.log("No Set-Cookie header from backend");
    }

    // API 서버 응답을 전달 (csrfToken이 포함된 데이터)
    console.log("loginRes data:", data);
    return res.status(data.status).json(data);
  } catch (error) {
    console.error("Token API error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
