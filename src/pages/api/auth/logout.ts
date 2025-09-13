// pages/api/users/logout.ts
import { getAccessToken } from "@/shared/lib/auth";
import { serialize } from "cookie";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const accessToken = getAccessToken();
    if (accessToken) {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `${accessToken}`,
        },
      }).catch(console.error);
    }

    // 쿠키 삭제
    res.setHeader("Set-Cookie", [
      serialize("refreshToken", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 0, // 즉시 만료
      }),
      serialize("csrfToken", "", {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 0, // 즉시 만료
      }),
    ]);

    return res.status(200).json({ message: "logout"});

  } catch (error) {
    console.error("Logout API error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
