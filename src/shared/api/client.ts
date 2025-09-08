import { log } from "@/lib/logger";
import { config, isDevelopment } from "@/shared/config/environment";
import { getAccessToken, getCsrfTokenFromCookie, refreshAccessToken } from "../lib/auth";

interface ApiResponse<T = any> {
  data: T;
  status: number;
  message?: string;
  code: string;
  timestamp: string;
}

interface ApiError {
  message: string;
  status: number;
  code?: string;
}

let inflightRefresh: Promise<string | null> | null = null;

class ApiClient {
  private baseURL: string;
  private apiVersion: string;

  constructor() {
    this.baseURL = config.NEXT_PUBLIC_API_URL;
    this.apiVersion = config.NEXT_PUBLIC_API_VERSION;
  }

  private routeOverrides = new Map<string, string>([
    ["/auth/login", "/api/auth/login"],
    ["/auth/refresh", "/api/auth/refresh"],
    ["/auth/logout", "/api/auth/logout"],
  ]);

  private normalize(ep: string) {
    const s = (ep || "").trim();
    return s.startsWith("/") ? s : `/${s}`;
  }

  private shouldEnsure(endpoint: string) {
    const key = this.normalize(endpoint);
    return !this.routeOverrides.has(key);
  }

  private async ensureAccessTokenIfNeeded(endpoint: string) {

    console.log("ensureAccessTokenIfNeeded", endpoint);
    if (!this.shouldEnsure(endpoint)) return;       // 스킵 목록이면 건너뜀
    console.log("ensureAccessTokenIfNeeded shouldEnsure");
    if (getAccessToken()) return;                   // 이미 AT 있으면 OK
    console.log("ensureAccessTokenIfNeeded getAccessToken", getAccessToken());
    if (!inflightRefresh) {
      inflightRefresh = (async () => {
        try {
          return await refreshAccessToken();        // RT 쿠키 + CSRF로 갱신
        } finally {
          inflightRefresh = null;
        }
      })();
    }
    await inflightRefresh;
  }

  private getBaseUrl(): string {
    // if (isDevelopment() && isProxy()) {
    //   return "/api"; // 프록시 경로 사용
    // }
    return `${this.baseURL}/api/${this.apiVersion}`;
  }

  private getFullUrl(endpoint: string): string {
    console.log("getFullUrl", endpoint);
    let clean = (endpoint || "").trim();
    if (!clean) return this.getBaseUrl();

    // 2) 절대 URL은 그대로 사용 (우회)
    if (/^https?:\/\//i.test(clean)) return clean;

    // 3) /api/ 로 시작하면 로컬 Next API로 보냄 (프록시/핸들러용)
    if (clean.startsWith("/api/")) return clean;

    // 4) 라우팅 예외 적용
    const key = this.normalize(clean);
    const override = this.routeOverrides.get(key);
    if (override) return override;

    // 5) 기본: 원격 API Prefix를 붙여서 보냄
    const base = this.getBaseUrl().replace(/\/$/, "");
    const ep = key.replace(/^\//, "");
    return `${base}/${ep}`;

  }

  private async request<T>(method: string, endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    await this.ensureAccessTokenIfNeeded(endpoint);
    const url = this.getFullUrl(endpoint);
    const startTime = Date.now();

    const defaultHeaders: HeadersInit = {
      "Content-Type": "application/json",
      "X-Environment": config.NEXT_PUBLIC_ENV,
      ...(isDevelopment() ? { "X-Debug-Mode": "true" } : {}),
    };

    // 인증 토큰이 있으면 Authorization 헤더 추가
    const accessToken = getAccessToken();
    if (accessToken) {
      defaultHeaders["Authorization"] = `Bearer ${accessToken}`;
    }

    // CSRF 토큰을 항상 쿠키에서 직접 읽어서 헤더에 추가
    const csrfToken = getCsrfTokenFromCookie();
    if (csrfToken) defaultHeaders["X-CSRF-TOKEN"] = csrfToken;

    const isLocalApi = typeof url === "string" && url.startsWith("/api/");
    const requestOptions: RequestInit = {
      method,
      headers: { ...defaultHeaders, ...options.headers },
      credentials: isLocalApi ? "include" : options.credentials,
      ...options,
    };

    try {
      log.debug(`API Request: ${method} ${url} isAccess?${accessToken}`, { options: requestOptions });

      const response = await fetch(url, requestOptions);
      const duration = Date.now() - startTime;
      log.debug(`API response: ${method} ${url}`, response);
      // API 호출 로깅
      log.apiCall(method, url, response.status, duration);

      if (!response.ok) {
        // 401 Unauthorized 에러인 경우 토큰 갱신 시도
        if (response.status === 401) {
          log.debug("Received 401, attempting to refresh token");

          const newToken = await refreshAccessToken();
          if (newToken) {
            // 토큰 갱신 성공 시 원래 요청을 다시 시도
            log.debug("Token refreshed successfully, retrying original request");

            const retryHeaders: any = {
              ...defaultHeaders,
              Authorization: `Bearer ${newToken}`,
              ...options.headers,
            };

            // 재시도 시에도 CSRF 토큰을 쿠키에서 직접 읽어서 포함 (토큰 갱신 후 새로운 CSRF 토큰이 있을 수 있음)
            const retryCsrfToken = getCsrfTokenFromCookie();
            if (retryCsrfToken) {
              retryHeaders["X-CSRF-TOKEN"] = retryCsrfToken;
              log.debug("재시도 요청에 CSRF 토큰 헤더 포함", {
                tokenLength: retryCsrfToken.length,
                endpoint,
                method,
                operation: "api-client-retry",
              });
            } else {
              log.debug("재시도 요청에 CSRF 토큰이 없습니다", {
                endpoint,
                method,
                operation: "api-client-retry",
              });
            }

            const retryOptions: RequestInit = {
              ...requestOptions,
              headers: retryHeaders,
            };

            const retryResponse = await fetch(url, retryOptions);
            const retryDuration = Date.now() - startTime;

            log.apiCall(`${method} (retry)`, url, retryResponse.status, retryDuration);

            if (retryResponse.ok) {
              const retryData = await retryResponse.json();
              log.debug(`API Response (retry): ${method} ${url}`, { data: retryData, duration: retryDuration });
              return retryData;
            }

            // 재시도도 실패한 경우 에러 처리
            const retryErrorData = await retryResponse.json().catch(() => ({}));
            const retryError: ApiError = {
              message: retryErrorData.message || `HTTP ${retryResponse.status}`,
              status: retryResponse.status,
              code: retryErrorData.code,
            };

            log.error(`API Error (retry): ${method} ${url}`, retryError);
            throw retryError;
          }
        }

        const errorData = await response.json().catch(() => ({}));
        const error: ApiError = {
          message: errorData.message || `HTTP ${response.status}`,
          status: response.status,
          code: errorData.code,
        };

        log.error(`API Error: ${method} ${url}`, error);
        throw error;
      }

      const data = await response.json();

      log.debug(`API Response: ${method} ${url}`, { data, duration });
      return data;
    } catch (error) {
      const duration = Date.now() - startTime;
      log.error(`API Request Failed: ${method} ${url}`, { error, duration });
      throw error;
    }
  }

  // GET 요청
  async get<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>("GET", endpoint, options);
  }

  // POST 요청
  async post<T>(endpoint: string, data?: any, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>("POST", endpoint, {
      ...options,
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PUT 요청
  async put<T>(endpoint: string, data?: any, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>("PUT", endpoint, {
      ...options,
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PATCH 요청
  async patch<T>(endpoint: string, data?: any, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>("PATCH", endpoint, {
      ...options,
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // DELETE 요청
  async delete<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>("DELETE", endpoint, options);
  }

  // 파일 업로드
  async upload<T>(endpoint: string, file: File, options?: RequestInit): Promise<ApiResponse<T>> {
    const url = this.getFullUrl(endpoint);
    const startTime = Date.now();

    const formData = new FormData();
    formData.append("file", file);

    const defaultHeaders: HeadersInit = {
      "X-Environment": config.NEXT_PUBLIC_ENV,
    };

    // 인증 토큰이 있으면 Authorization 헤더 추가
    const accessToken = getAccessToken();
    if (accessToken) {
      defaultHeaders["Authorization"] = `Bearer ${accessToken}`;
    }

    // CSRF 토큰을 쿠키에서 직접 읽어서 헤더에 추가
    const csrfToken = getCsrfTokenFromCookie();
    if (csrfToken) defaultHeaders["X-CSRF-TOKEN"] = csrfToken;

    if (isDevelopment()) defaultHeaders["X-Debug-Mode"] = "true";
    const isLocalApi = url.startsWith("/api/");
    const requestOptions: RequestInit = {
      method: "POST",
      headers: { ...defaultHeaders, ...options?.headers },
      body: formData,
      credentials: isLocalApi ? "include" : options?.credentials, // ★
      ...options,
    };

    try {
      log.debug(`File Upload: POST ${url}`, { fileName: file.name, fileSize: file.size });

      const response = await fetch(url, requestOptions);
      const duration = Date.now() - startTime;

      log.apiCall("POST", url, response.status, duration);

      if (!response.ok) {
        // 401 Unauthorized 에러인 경우 토큰 갱신 시도
        if (response.status === 401) {
          log.debug("Upload received 401, attempting to refresh token");

          const newToken = await refreshAccessToken();
          if (newToken) {
            // 토큰 갱신 성공 시 원래 요청을 다시 시도
            log.debug("Token refreshed successfully, retrying upload");

            const retryHeaders: any = {
              ...defaultHeaders,
              Authorization: `Bearer ${newToken}`,
              ...options?.headers,
            };

            // 재시도 시에도 CSRF 토큰을 쿠키에서 직접 읽어서 포함 (토큰 갱신 후 새로운 CSRF 토큰이 있을 수 있음)
            const retryCsrfToken = getCsrfTokenFromCookie();
            if (retryCsrfToken) {
              retryHeaders["X-CSRF-TOKEN"] = retryCsrfToken;
              log.debug("파일 업로드 재시도에 CSRF 토큰 헤더 포함", {
                tokenLength: retryCsrfToken.length,
                endpoint,
                fileName: file.name,
                operation: "api-client-upload-retry",
              });
            } else {
              log.debug("파일 업로드 재시도에 CSRF 토큰이 없습니다", {
                endpoint,
                fileName: file.name,
                operation: "api-client-upload-retry",
              });
            }

            const retryOptions: RequestInit = {
              ...requestOptions,
              headers: retryHeaders,
            };

            const retryResponse = await fetch(url, retryOptions);
            const retryDuration = Date.now() - startTime;

            log.apiCall(`POST (retry)`, url, retryResponse.status, retryDuration);

            if (retryResponse.ok) {
              const retryData = await retryResponse.json();
              log.debug(`Upload Success (retry): POST ${url}`, { data: retryData, duration: retryDuration });

              return retryData;
            }

            // 재시도도 실패한 경우 에러 처리
            const retryErrorData = await retryResponse.json().catch(() => ({}));
            const retryError: ApiError = {
              message: retryErrorData.message || `Upload failed: HTTP ${retryResponse.status}`,
              status: retryResponse.status,
              code: retryErrorData.code,
            };

            log.error(`Upload Error (retry): POST ${url}`, retryError);
            throw retryError;
          }
        }

        const errorData = await response.json().catch(() => ({}));
        const error: ApiError = {
          message: errorData.message || `Upload failed: HTTP ${response.status}`,
          status: response.status,
          code: errorData.code,
        };

        log.error(`Upload Error: POST ${url}`, error);
        throw error;
      }

      const data = await response.json();

      log.debug(`Upload Success: POST ${url}`, { data, duration });

      return data;
    } catch (error) {
      const duration = Date.now() - startTime;
      log.error(`Upload Failed: POST ${url}`, { error, duration });
      throw error;
    }
  }
}

export const apiClient = new ApiClient();

// 편의 함수들
export const api = {
  get: <T>(endpoint: string, options?: RequestInit) => apiClient.get<T>(endpoint, options),
  post: <T>(endpoint: string, data?: any, options?: RequestInit) => apiClient.post<T>(endpoint, data, options),
  put: <T>(endpoint: string, data?: any, options?: RequestInit) => apiClient.put<T>(endpoint, data, options),
  patch: <T>(endpoint: string, data?: any, options?: RequestInit) => apiClient.patch<T>(endpoint, data, options),
  delete: <T>(endpoint: string, options?: RequestInit) => apiClient.delete<T>(endpoint, options),
  upload: <T>(endpoint: string, file: File, options?: RequestInit) => apiClient.upload<T>(endpoint, file, options),
};
