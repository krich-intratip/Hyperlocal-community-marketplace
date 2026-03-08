export interface PaginationQuery {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ApiResponse<T = void> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface GeoPoint {
  lat: number
  lng: number
}

export interface GeoRadius {
  center: GeoPoint
  radiusKm: number
}
