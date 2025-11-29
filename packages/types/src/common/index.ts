export interface ApiResponse<T = unknown> {
  data: T;
  status: number;
  code: string;
  message?: string;
  timestamp: string;
}

// API 에러 타입
export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

export interface PageParams {
  page?: number;
  size?: number;
}

export interface Pagination<T> {
  items: T[];
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  hasPrev: boolean;
  hasNext: boolean;
  prevPage: number;
  nextPage: number;
}
