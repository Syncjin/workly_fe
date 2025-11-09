import { createExpiredCookie } from "@/shared/lib/cookie-utils";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // 클라이언트가 보낸 Authorization 헤더에서 accessToken 추출
    const authHeader = req.headers.authorization;
    const accessToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

    if (accessToken) {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }).catch(console.error);
    }

    // 쿠키 삭제
    res.setHeader("Set-Cookie", [createExpiredCookie("refreshToken"), createExpiredCookie("csrfToken")]);

    return res.status(200).json({ message: "logout" });
  } catch (error) {
    console.error("Logout API error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
