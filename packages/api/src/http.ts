// packages/api/src/http.ts
import type { ApiResponse } from "@workly/types/common";

export type ServiceKey = "main" | "admin";

export type BaseUrls = {
  [k in ServiceKey]?: { baseURL: string; apiVersion?: string };
};
export type ServiceRule = { pattern: RegExp; service: ServiceKey };

export interface AuthConfig {
  getAccessToken?: () => string | null | undefined;
  getCsrfToken?: () => string | null | undefined;
  refreshAccessToken?: () => Promise<string | null | undefined>;
}

export interface HttpClientOptions {
  baseUrls: BaseUrls;
  defaultService?: ServiceKey;
  routeOverrides?: Record<string, string>;    // e.g. {"/auth/login": "/api/auth/login"}
  serviceRules?: ServiceRule[];               // e.g. [/^\/admin/ => "admin"]
  auth?: AuthConfig;
  environment?: string;                       // X-Environment 헤더용
  debug?: boolean;
}

export interface RequestOptions extends RequestInit {
  service?: ServiceKey;
  absolute?: boolean;
}

let inflightRefresh: Promise<string | null | undefined> | null = null;

function nowIso() {
  return new Date().toISOString();
}

async function parseApiJsonSafe<T>(res: Response): Promise<ApiResponse<T>> {
  const ct = res.headers.get("content-type") ?? "";
  const len = res.headers.get("content-length");
  const noBody = res.status === 204 || res.status === 205 || res.status === 304 || len === "0";

  if (noBody) return { data: undefined as unknown as T, status: res.status, code: "NO_CONTENT", timestamp: nowIso() };

  const raw = await res.text();
  if (!raw) return { data: undefined as unknown as T, status: res.status, code: "NO_CONTENT", timestamp: nowIso() };

  if (ct.includes("application/json")) return JSON.parse(raw) as ApiResponse<T>;
  return { data: raw as unknown as T, status: res.status, code: "OK", timestamp: nowIso() };
}

export function createHttpClient(opts: HttpClientOptions) {
  const {
    baseUrls,
    defaultService = "main",
    routeOverrides = {},
    serviceRules = [{ pattern: /^\/admin(\/|$)/i, service: "admin" }],
    auth,
    environment,
    debug = false,
  } = opts;

  const normalize = (ep: string) => (ep.startsWith("/") ? ep : `/${ep}`);
  const getBaseUrl = (service: ServiceKey) => {
    const b = baseUrls[service] ?? baseUrls[defaultService];
    if (!b?.baseURL) return "";
    const base = b.baseURL.replace(/\/$/, "");
    const ver = b.apiVersion ? `/api/${b.apiVersion}` : "";
    return `${base}${ver}`;
  };
  const resolveService = (endpoint: string, explicit?: ServiceKey) => {
    if (explicit) return explicit;
    const key = normalize(endpoint);
    for (const r of serviceRules) if (r.pattern.test(key)) return r.service;
    return defaultService;
  };
  const getFullUrl = (endpoint: string, service: ServiceKey, absolute?: boolean) => {
    const clean = (endpoint || "").trim();
    if (!clean) return getBaseUrl(service);
    if (absolute || /^https?:\/\//i.test(clean)) return clean;
    if (clean.startsWith("/api/")) return clean;

    const key = normalize(clean);
    if (routeOverrides[key]) return routeOverrides[key];

    const base = getBaseUrl(service).replace(/\/$/, "");
    const ep = key.replace(/^\//, "");
    return `${base}/${ep}`;
  };

  async function ensureAccessTokenIfNeeded(endpoint: string) {
    const key = normalize(endpoint);
    const skip = Object.prototype.hasOwnProperty.call(routeOverrides, key);
    if (skip || !auth?.refreshAccessToken || auth?.getAccessToken?.()) return;

    if (!inflightRefresh) {
      inflightRefresh = auth.refreshAccessToken().finally(() => {
        inflightRefresh = null;
      });
    }
    await inflightRefresh;
  }

  async function request<T>(method: string, endpoint: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    await ensureAccessTokenIfNeeded(endpoint);

    const service = resolveService(endpoint, options.service);
    const url = getFullUrl(endpoint, service, options.absolute);

    const defaultHeaders: HeadersInit = {
      "Content-Type": "application/json",
      ...(environment ? { "X-Environment": environment } : {}),
    };

    const at = auth?.getAccessToken?.();
    if (at) (defaultHeaders as any).Authorization = `Bearer ${at}`;

    const csrf = auth?.getCsrfToken?.();
    if (csrf) (defaultHeaders as any)["X-CSRF-TOKEN"] = csrf;

    const isLocalApi = typeof url === "string" && url.startsWith("/api/");
    const req: RequestInit = {
      method,
      headers: { ...defaultHeaders, ...options.headers },
      credentials: isLocalApi ? "include" : options.credentials,
      ...options,
    };

    if (debug) console.debug("[http]", method, url, req);

    const res = await fetch(url, req);

    if (!res.ok) {
      if (res.status === 401 && auth?.refreshAccessToken) {
        const newToken = await auth.refreshAccessToken();
        if (newToken) {
          const retryHeaders: any = { ...defaultHeaders, ...options.headers, Authorization: `Bearer ${newToken}` };
          const retryCsrf = auth.getCsrfToken?.();
          if (retryCsrf) retryHeaders["X-CSRF-TOKEN"] = retryCsrf;

          const retryRes = await fetch(url, { ...req, headers: retryHeaders });
          if (retryRes.ok) return parseApiJsonSafe<T>(retryRes);
          const retryText = await retryRes.text().catch(() => "");
          throw { message: retryText || `HTTP ${retryRes.status}`, status: retryRes.status } as any;
        }
      }
      const text = await res.text().catch(() => "");
      let json: any = {};
      try { json = text ? JSON.parse(text) : {}; } catch {}
      throw { message: json.message || `HTTP ${res.status}`, status: res.status, code: json.code } as any;
    }

    return parseApiJsonSafe<T>(res);
  }

  return {
    get:  <T>(endpoint: string, options?: RequestOptions) => request<T>("GET", endpoint, options),
    post: <T>(endpoint: string, body?: any, options?: RequestOptions) =>
      request<T>("POST", endpoint, { ...options, body: body ? JSON.stringify(body) : undefined }),
    put:  <T>(endpoint: string, body?: any, options?: RequestOptions) =>
      request<T>("PUT", endpoint, { ...options, body: body ? JSON.stringify(body) : undefined }),
    patch:<T>(endpoint: string, body?: any, options?: RequestOptions) =>
      request<T>("PATCH", endpoint, { ...options, body: body ? JSON.stringify(body) : undefined }),
    delete:<T>(endpoint: string, body?: any, options?: RequestOptions) =>
      request<T>("DELETE", endpoint, { ...options, body: body ? JSON.stringify(body) : undefined }),

    // 간단 업로드(필요 시 확장)
    upload: async <T>(endpoint: string, file: File, options: RequestOptions = {}) => {
      const service = resolveService(endpoint, options.service);
      const url = getFullUrl(endpoint, service, options.absolute);

      const fd = new FormData();
      fd.append("file", file);

      const headers: HeadersInit = {};
      const at = auth?.getAccessToken?.(); if (at) (headers as any).Authorization = `Bearer ${at}`;
      const csrf = auth?.getCsrfToken?.(); if (csrf) (headers as any)["X-CSRF-TOKEN"] = csrf;
      if (environment) (headers as any)["X-Environment"] = environment;

      const isLocalApi = url.startsWith("/api/");
      const res = await fetch(url, {
        method: "POST",
        body: fd,
        headers: { ...headers, ...options.headers },
        credentials: isLocalApi ? "include" : options.credentials,
        ...options,
      });
      if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
      return parseApiJsonSafe<T>(res);
    },
  };
}

export type HttpClient = ReturnType<typeof createHttpClient>;
