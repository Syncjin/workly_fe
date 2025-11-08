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
  routeOverrides?: Record<string, string>; // e.g. {"/auth/login": "/api/auth/login"}
  serviceRules?: ServiceRule[]; // e.g. [/^\/admin/ => "admin"]
  auth?: AuthConfig;
  environment?: string; // X-Environment 헤더용
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
  const { baseUrls, defaultService = "main", routeOverrides = {}, serviceRules = [{ pattern: /^\/admin(\/|$)/i, service: "admin" }], auth, environment, debug = false } = opts;

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

  function isFormDataBody(b: unknown): b is FormData {
    return typeof FormData !== "undefined" && b instanceof FormData;
  }

  async function refreshAndRetry<T>(req: RequestInit, url: string): Promise<ApiResponse<T>> {
    if (!inflightRefresh) {
      inflightRefresh = auth!.refreshAccessToken!().finally(() => {
        inflightRefresh = null;
      });
    }

    const newToken = await inflightRefresh;

    if (newToken) {
      // 새 토큰으로 헤더 교체
      const newHeaders = new Headers(req.headers);
      newHeaders.set("Authorization", `Bearer ${newToken}`);

      const retryRes = await fetch(url, { ...req, headers: newHeaders });

      if (retryRes.ok) return parseApiJsonSafe<T>(retryRes);

      // 재시도도 실패하면 에러
      const retryText = await retryRes.text().catch(() => "");
      throw { message: retryText || `HTTP ${retryRes.status}`, status: retryRes.status } as any;
    } else {
      throw { message: "Session expired, unable to refresh.", status: 401 } as any;
    }
  }
  async function request<T>(method: string, endpoint: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    const service = resolveService(endpoint, options.service);
    const url = getFullUrl(endpoint, service, options.absolute);

    const baseHeaders: HeadersInit = {
      ...(environment ? { "X-Environment": environment } : {}),
    };

    const at = auth?.getAccessToken?.();
    if (at) (baseHeaders as any).Authorization = `Bearer ${at}`;
    const csrf = auth?.getCsrfToken?.();
    if (csrf) (baseHeaders as any)["x-csrf-token"] = csrf;

    const body = options.body == null ? undefined : isFormDataBody(options.body) ? options.body : typeof options.body === "string" ? options.body : options.body;

    // Content-Type 결정: FormData면 지정하지 않음(브라우저가 boundary 포함 자동 설정)
    const isForm = isFormDataBody(body);

    const headers: HeadersInit = {
      ...(isForm ? {} : { "Content-Type": "application/json" }),
      ...baseHeaders,
      ...(options.headers ?? {}),
    };

    const isLocalApi = typeof url === "string" && url.startsWith("/api/");
    const req: RequestInit = {
      method,
      headers,
      credentials: isLocalApi ? "include" : options.credentials,
      ...options,
      body, // 위에서 결정한 body 사용
    };

    if (debug) console.debug("[http]", method, url, req);

    const res = await fetch(url, req);

    if (!res.ok) {
      if (res.status === 401 && auth?.refreshAccessToken) {
        if (debug) console.debug("[http]", "Token expired (401). Attempting refresh and retry...");
        return refreshAndRetry<T>(req, url);
      }
      const text = await res.text().catch(() => "");
      let json: any = {};
      try {
        json = text ? JSON.parse(text) : {};
      } catch {}
      throw { message: json.message || `HTTP ${res.status}`, status: res.status, code: json.code } as any;
    }

    return parseApiJsonSafe<T>(res);
  }

  return {
    get: <T>(endpoint: string, options?: RequestOptions) => request<T>("GET", endpoint, options),
    post: <T>(endpoint: string, body?: any, options?: RequestOptions) => request<T>("POST", endpoint, { ...options, body: body ? JSON.stringify(body) : undefined }),
    postMultipart: <T>(endpoint: string, form: FormData, options?: RequestOptions) => request<T>("POST", endpoint, { ...options, body: form }),
    put: <T>(endpoint: string, body?: any, options?: RequestOptions) => request<T>("PUT", endpoint, { ...options, body: body ? JSON.stringify(body) : undefined }),
    patch: <T>(endpoint: string, body?: any, options?: RequestOptions) => request<T>("PATCH", endpoint, { ...options, body: body ? JSON.stringify(body) : undefined }),
    patchMultipart: <T>(endpoint: string, form: FormData, options?: RequestOptions) => request<T>("PATCH", endpoint, { ...options, body: form }),
    delete: <T>(endpoint: string, body?: any, options?: RequestOptions) => request<T>("DELETE", endpoint, { ...options, body: body ? JSON.stringify(body) : undefined }),

    // 간단 업로드(필요 시 확장)
    upload: async <T>(endpoint: string, file: File, options: RequestOptions = {}) => {
      const service = resolveService(endpoint, options.service);
      const url = getFullUrl(endpoint, service, options.absolute);

      const fd = new FormData();
      fd.append("file", file);

      const headers: HeadersInit = {};
      const at = auth?.getAccessToken?.();
      if (at) (headers as any).Authorization = `Bearer ${at}`;
      const csrf = auth?.getCsrfToken?.();
      if (csrf) (headers as any)["x-csrf-token"] = csrf;
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
