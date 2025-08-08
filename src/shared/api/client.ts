import { log } from "@/lib/logger";
import { config, isDevelopment } from "@/shared/config/environment";

interface ApiResponse<T = any> {
  data: T;
  status: number;
  message?: string;
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

  private getFullUrl(endpoint: string): string {
    const cleanEndpoint = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;
    return `${this.baseURL}/api/${this.apiVersion}/${cleanEndpoint}`;
  }

  private async request<T>(method: string, endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = this.getFullUrl(endpoint);
    const startTime = Date.now();

    const defaultHeaders: HeadersInit = {
      "Content-Type": "application/json",
      "X-Environment": config.NEXT_PUBLIC_ENV,
    };

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

      return {
        data,
        status: response.status,
      };
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

      return {
        data,
        status: response.status,
      };
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
