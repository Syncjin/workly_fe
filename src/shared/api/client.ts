import { log } from "@/lib/logger";
import { config, isDevelopment, useProxy } from "@/shared/config/environment";
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

class ApiClient {
  private baseURL: string;
  private apiVersion: string;

  constructor() {
    this.baseURL = config.NEXT_PUBLIC_API_URL;
    this.apiVersion = config.NEXT_PUBLIC_API_VERSION;
  }

  private getBaseUrl(): string {
    if (isDevelopment() && useProxy()) {
      return '/api';  // 프록시 경로 사용
    }
    return `${this.baseURL}/api/${this.apiVersion}`;
  }

  private getFullUrl(endpoint: string): string {
    const baseUrl = this.getBaseUrl();

    console.log("getFullUrl baseUrl", baseUrl, useProxy(), isDevelopment());
    // 엔드포인트 경로 정규화
    let cleanEndpoint = endpoint.trim();

    // 빈 엔드포인트 처리
    if (!cleanEndpoint) {
      return baseUrl;
    }

    // 앞의 슬래시 제거 (baseUrl과 결합할 때 중복 방지)
    if (cleanEndpoint.startsWith("/")) {
      cleanEndpoint = cleanEndpoint.slice(1);
    }

    // baseUrl 끝의 슬래시 정규화
    const normalizedBaseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;

    // 최종 URL 구성
    return `${normalizedBaseUrl}/${cleanEndpoint}`;
  }

  private async request<T>(method: string, endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = this.getFullUrl(endpoint);
    const startTime = Date.now();

    const defaultHeaders: HeadersInit = {
      "Content-Type": "application/json",
      "X-Environment": config.NEXT_PUBLIC_ENV,
    };

    // 인증 토큰이 있으면 Authorization 헤더 추가
    const accessToken = getAccessToken();
    if (accessToken) {
      defaultHeaders["Authorization"] = `Bearer ${accessToken}`;
    }

    // CSRF 토큰을 항상 쿠키에서 직접 읽어서 헤더에 추가
    const csrfToken = getCsrfTokenFromCookie();
    if (csrfToken) {
      defaultHeaders["X-CSRF-TOKEN"] = csrfToken;
      log.debug('API 요청에 CSRF 토큰 헤더 포함', {
        tokenLength: csrfToken.length,
        endpoint,
        method,
        operation: 'api-client'
      });
    } else {
      log.debug('CSRF 토큰이 없어 헤더에 포함하지 않습니다', {
        endpoint,
        method,
        operation: 'api-client'
      });
    }

    // 디버깅: 토큰 상태 로깅
    log.debug('API 요청 전 토큰 상태', {
      hasAccessToken: !!accessToken,
      hasCsrfToken: !!csrfToken,
      accessTokenLength: accessToken?.length || 0,
      csrfTokenLength: csrfToken?.length || 0,
      accessTokenPreview: accessToken ? `${accessToken.substring(0, 10)}...` : null,
      csrfTokenPreview: csrfToken ? `${csrfToken.substring(0, 10)}...` : null,
      endpoint,
      method,
      operation: 'api-client-debug'
    });
    // 개발 환경에서만 추가 헤더
    if (isDevelopment()) {
      defaultHeaders["X-Debug-Mode"] = "true";
    }

    const requestOptions: RequestInit = {
      method,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
      ...options,
    };

    try {
      log.debug(`API Request: ${method} ${url}`, { options: requestOptions });

      const response = await fetch(url, requestOptions);
      const duration = Date.now() - startTime;

      // API 호출 로깅
      log.apiCall(method, url, response.status, duration);

      if (!response.ok) {
        // 401 Unauthorized 에러인 경우 토큰 갱신 시도
        if (response.status === 401) {
          log.debug('Received 401, attempting to refresh token');

          const newToken = await refreshAccessToken();
          if (newToken) {
            // 토큰 갱신 성공 시 원래 요청을 다시 시도
            log.debug('Token refreshed successfully, retrying original request');

            const retryHeaders: any = {
              ...defaultHeaders,
              "Authorization": `Bearer ${newToken}`,
              ...options.headers,
            };

            // 재시도 시에도 CSRF 토큰을 쿠키에서 직접 읽어서 포함 (토큰 갱신 후 새로운 CSRF 토큰이 있을 수 있음)
            const retryCsrfToken = getCsrfTokenFromCookie();
            if (retryCsrfToken) {
              retryHeaders["X-CSRF-TOKEN"] = retryCsrfToken;
              log.debug('재시도 요청에 CSRF 토큰 헤더 포함', {
                tokenLength: retryCsrfToken.length,
                endpoint,
                method,
                operation: 'api-client-retry'
              });
            } else {
              log.debug('재시도 요청에 CSRF 토큰이 없습니다', {
                endpoint,
                method,
                operation: 'api-client-retry'
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
    if (csrfToken) {
      defaultHeaders["X-CSRF-TOKEN"] = csrfToken;
      log.debug('파일 업로드에 CSRF 토큰 헤더 포함', {
        tokenLength: csrfToken.length,
        endpoint,
        fileName: file.name,
        operation: 'api-client-upload'
      });
    } else {
      log.debug('CSRF 토큰이 없어 파일 업로드 헤더에 포함하지 않습니다', {
        endpoint,
        fileName: file.name,
        operation: 'api-client-upload'
      });
    }

    if (isDevelopment()) {
      defaultHeaders["X-Debug-Mode"] = "true";
    }

    const requestOptions: RequestInit = {
      method: "POST",
      headers: {
        ...defaultHeaders,
        ...options?.headers,
      },
      body: formData,
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
          log.debug('Upload received 401, attempting to refresh token');

          const newToken = await refreshAccessToken();
          if (newToken) {
            // 토큰 갱신 성공 시 원래 요청을 다시 시도
            log.debug('Token refreshed successfully, retrying upload');

            const retryHeaders: any = {
              ...defaultHeaders,
              "Authorization": `Bearer ${newToken}`,
              ...options?.headers,
            };

            // 재시도 시에도 CSRF 토큰을 쿠키에서 직접 읽어서 포함 (토큰 갱신 후 새로운 CSRF 토큰이 있을 수 있음)
            const retryCsrfToken = getCsrfTokenFromCookie();
            if (retryCsrfToken) {
              retryHeaders["X-CSRF-TOKEN"] = retryCsrfToken;
              log.debug('파일 업로드 재시도에 CSRF 토큰 헤더 포함', {
                tokenLength: retryCsrfToken.length,
                endpoint,
                fileName: file.name,
                operation: 'api-client-upload-retry'
              });
            } else {
              log.debug('파일 업로드 재시도에 CSRF 토큰이 없습니다', {
                endpoint,
                fileName: file.name,
                operation: 'api-client-upload-retry'
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
