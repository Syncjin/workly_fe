import { config } from "@/shared/config/environment";
import { createHttpClient } from "@workly/api";
import { getAccessToken, getCsrfTokenFromCookie, refreshAccessToken } from "../lib/auth";

export const http = createHttpClient({
  baseUrls: {
    main: { baseURL: config.NEXT_PUBLIC_API_URL, apiVersion: config.NEXT_PUBLIC_API_VERSION },
    admin: { baseURL: config.NEXT_PUBLIC_API2_URL, apiVersion: config.NEXT_PUBLIC_API2_VERSION },
  },
  defaultService: "main",
  routeOverrides: {
    "/auth/login": "/api/auth/login",
    "/auth/refresh": "/api/auth/refresh",
    "/auth/logout": "/api/auth/logout",
  },
  serviceRules: [{ pattern: /^\/admin(\/|$)/i, service: "admin" }],
  auth: {
    getAccessToken,
    getCsrfToken: getCsrfTokenFromCookie,
    refreshAccessToken,
  },
  environment: config.NEXT_PUBLIC_ENV,
  debug: process.env.NODE_ENV !== "production",
});
