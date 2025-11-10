import { createCsrfTokenCookie } from "@/shared/lib/cookie-utils";
import type { NextApiRequest, NextApiResponse } from "next";

function getBackendSetCookiesArray(loginRes: Response): string[] {
  const anyHeaders = loginRes.headers as any;
  let setCookieHeader: string | string[] | undefined;

  if (typeof anyHeaders.raw === "function") {
    const raw = anyHeaders.raw();
    setCookieHeader = raw && raw["set-cookie"];
  } else {
    const single = loginRes.headers.get("set-cookie");
    setCookieHeader = single ? [single] : undefined;
  }

  if (!setCookieHeader) return [];

  const allCookies: string[] = [];
  (Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader]).forEach((cString) => {
    cString.split(/,\s*(?=\S+=)/g).forEach((cookie) => {
      allCookies.push(cookie);
    });
  });

  return allCookies;
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

    const backendCookiesArr = getBackendSetCookiesArray(loginRes);
    if (backendCookiesArr.length > 0) {
      const forwardedCookies = backendCookiesArr.map((c) => (process.env.NODE_ENV === "development" ? c.replace(/;\s*Secure/gi, "") : c));

      let extractedCsrfToken: string | null = null;
      let filteredForwardedCookies: string[] = [];

      backendCookiesArr.forEach((c) => {
        const csrfMatch = c.match(/(?:^|;\s*)csrfToken=([^;]+)/i);
        if (csrfMatch && csrfMatch[1]) {
          extractedCsrfToken = csrfMatch[1];
        } else {
          filteredForwardedCookies.push(process.env.NODE_ENV === "development" ? c.replace(/;\s*Secure/gi, "") : c);
        }
      });

      if (extractedCsrfToken) {
        const csrfCookie = createCsrfTokenCookie({ token: extractedCsrfToken });
        res.setHeader("Set-Cookie", [...filteredForwardedCookies, csrfCookie]);
      } else {
        res.setHeader("Set-Cookie", filteredForwardedCookies);
      }
    }

    return res.status(data.status).json(data);
  } catch (error) {
    console.error("Token API error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
