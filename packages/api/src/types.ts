// API response types
export interface ApiResponse<T = any> {
  status: number
  code: string
  message: string
  data: T
  timestamp: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
}

// Common API types
export interface User {
  id: number
  email: string
  name: string
  createdAt: string
  updatedAt: string
}

export interface Board {
  boardId: number
  boardName: string
  description: string
  visibility: 'PUBLIC' | 'PRIVATE'
  sortOrder: number
  categoryId: number
  createdDateTime: string
  updatedDateTime: string
}

export interface BoardCategory {
  categoryId: number
  categoryName: string
  sortOrder: number
}