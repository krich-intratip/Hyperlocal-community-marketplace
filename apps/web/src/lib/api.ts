/**
 * Typed API call helpers — wraps apiClient with proper response types.
 * Import these in pages/components instead of calling apiClient directly.
 */
import { apiClient } from './api-client'
import type {
  ApiResponse,
  PaginatedResponse,
  AuthUser,
  SignInRequest,
  Community,
  CreateCommunityDto,
  Provider,
  ProviderApplyDto,
  Booking,
  CreateBookingDto,
  Announcement,
  CreateAnnouncementDto,
  Coupon,
  UserProfile,
  Listing,
  Notification,
  AnalyticsResponse,
  Order,
  CreateOrderDto,
  Review,
  CreateReviewDto,
} from '@/types'

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const authApi = {
  signIn: (dto: SignInRequest) =>
    apiClient.post<ApiResponse<AuthUser>>('/auth/signin', dto),

  signOut: () =>
    apiClient.post('/auth/signout'),

  me: () =>
    apiClient.get<ApiResponse<AuthUser>>('/auth/me'),
}

// ─── Communities ──────────────────────────────────────────────────────────────

export const communitiesApi = {
  list: (params?: { page?: number; pageSize?: number; province?: string }) =>
    apiClient.get<PaginatedResponse<Community>>('/communities', { params }),

  get: (id: string) =>
    apiClient.get<ApiResponse<Community>>(`/communities/${id}`),

  create: (dto: CreateCommunityDto) =>
    apiClient.post<ApiResponse<Community>>('/communities', dto),

  updateStatus: (id: string, status: Community['status']) =>
    apiClient.patch<ApiResponse<Community>>(`/communities/${id}/status`, { status }),
}

// ─── Providers ────────────────────────────────────────────────────────────────

export const providersApi = {
  list: (params?: { communityId?: string; category?: string; page?: number }) =>
    apiClient.get<PaginatedResponse<Provider>>('/providers', { params }),

  get: (id: string) =>
    apiClient.get<ApiResponse<Provider>>(`/providers/${id}`),

  apply: (dto: ProviderApplyDto) =>
    apiClient.post<ApiResponse<Provider>>('/providers/apply', dto),

  updateStatus: (id: string, status: Provider['status']) =>
    apiClient.patch<ApiResponse<Provider>>(`/providers/${id}/status`, { status }),

  pending: (communityId: string) =>
    apiClient.get<ApiResponse<Provider[]>>(`/providers/pending/${communityId}`),
}

// ─── Bookings ─────────────────────────────────────────────────────────────────

export const bookingsApi = {
  create: (dto: CreateBookingDto) =>
    apiClient.post<ApiResponse<Booking>>('/bookings', dto),

  list: (params?: { status?: Booking['status']; page?: number }) =>
    apiClient.get<PaginatedResponse<Booking>>('/bookings', { params }),

  get: (id: string) =>
    apiClient.get<ApiResponse<Booking>>(`/bookings/${id}`),

  confirm: (id: string) =>
    apiClient.patch<ApiResponse<Booking>>(`/bookings/${id}/confirm`),

  complete: (id: string) =>
    apiClient.patch<ApiResponse<Booking>>(`/bookings/${id}/complete`),

  cancel: (id: string, reason?: string) =>
    apiClient.patch<ApiResponse<Booking>>(`/bookings/${id}/cancel`, { reason }),
}

// ─── Announcements ────────────────────────────────────────────────────────────

export const announcementsApi = {
  list: (params?: { scope?: Announcement['scope']; communityId?: string; status?: Announcement['status'] }) =>
    apiClient.get<ApiResponse<Announcement[]>>('/announcements', { params }),

  create: (dto: CreateAnnouncementDto) =>
    apiClient.post<ApiResponse<Announcement>>('/announcements', dto),

  update: (id: string, dto: Partial<CreateAnnouncementDto>) =>
    apiClient.patch<ApiResponse<Announcement>>(`/announcements/${id}`, dto),

  approve: (id: string) =>
    apiClient.patch<ApiResponse<Announcement>>(`/announcements/${id}/approve`),

  reject: (id: string) =>
    apiClient.patch<ApiResponse<Announcement>>(`/announcements/${id}/reject`),

  delete: (id: string) =>
    apiClient.delete(`/announcements/${id}`),
}

// ─── Coupons ──────────────────────────────────────────────────────────────────

export const couponsApi = {
  validate: (code: string, communityId?: string) =>
    apiClient.post<ApiResponse<Coupon>>('/coupons/validate', { code, communityId }),
}

// ─── Listings ─────────────────────────────────────────────────────────────────

export const listingsApi = {
  list: (params?: { search?: string; category?: string; status?: string; page?: number }) =>
    apiClient.get<PaginatedResponse<Listing>>('/listings', { params }),

  search: (params?: {
    communityId?: string
    category?: string
    keyword?: string
    isHealthOption?: boolean
    minPrice?: number
    maxPrice?: number
    sort?: 'newest' | 'price_asc' | 'price_desc' | 'promoted'
    page?: number
    limit?: number
  }) =>
    apiClient.get<{ data: Listing[]; total: number; page: number; limit: number }>(
      '/listings/search',
      { params },
    ),

  get: (id: string) =>
    apiClient.get<ApiResponse<Listing>>(`/listings/${id}`),
}

// ─── Notifications ────────────────────────────────────────────────────────────

export const notificationsApi = {
  list: () =>
    apiClient.get<ApiResponse<Notification[]>>('/notifications'),

  markAllRead: () =>
    apiClient.patch('/notifications/read-all'),

  markRead: (id: string) =>
    apiClient.patch(`/notifications/${id}/read`),
}

// ─── User profile ─────────────────────────────────────────────────────────────

export const usersApi = {
  profile: () =>
    apiClient.get<ApiResponse<UserProfile>>('/users/me'),

  updateProfile: (dto: Partial<Pick<UserProfile, 'name' | 'phone' | 'avatarUrl'>>) =>
    apiClient.patch<ApiResponse<UserProfile>>('/users/me', dto),
}

// ─── Follow / Unfollow provider ───────────────────────────────────────────────

export const followApi = {
  check: (providerId: string) =>
    apiClient.get<ApiResponse<{ following: boolean }>>(`/users/follow/${providerId}`),

  follow: (providerId: string) =>
    apiClient.post<ApiResponse<void>>(`/users/follow/${providerId}`),

  unfollow: (providerId: string) =>
    apiClient.delete<ApiResponse<void>>(`/users/follow/${providerId}`),
}

// ─── File upload (presigned URL) ──────────────────────────────────────────────

export const uploadApi = {
  presignAvatar: (filename: string, contentType: string) =>
    apiClient.post<ApiResponse<{ uploadUrl: string; publicUrl: string }>>('/upload/presign', {
      filename,
      contentType,
      purpose: 'avatar',
    }),
}

// ─── Dashboard / Analytics ────────────────────────────────────────────────────

export const dashboardApi = {
  getAnalytics: (params?: { months?: number; communityId?: string }) =>
    apiClient.get<AnalyticsResponse>('/dashboard/analytics', { params }),
}

// ─── Orders (cart checkout) ───────────────────────────────────────────────────

export const ordersApi = {
  /** POST /orders — create a multi-item order from the cart */
  create: (dto: CreateOrderDto) =>
    apiClient.post<Order>('/orders', dto),

  /** GET /orders/my — all orders for the authenticated customer */
  listMy: () =>
    apiClient.get<Order[]>('/orders/my'),

  /** GET /orders/:id */
  get: (id: string) =>
    apiClient.get<Order>(`/orders/${id}`),
}

// ─── Reviews ──────────────────────────────────────────────────────────────────

export const reviewsApi = {
  /** POST /reviews — submit review for a completed booking (JWT required) */
  create: (dto: CreateReviewDto) =>
    apiClient.post<ApiResponse<Review>>('/reviews', dto),

  /** GET /reviews/booking/:bookingId — check if review exists for a booking */
  getByBooking: (bookingId: string) =>
    apiClient.get<ApiResponse<Review | null>>(`/reviews/booking/${bookingId}`),

  /** GET /reviews/provider/:id — list all reviews for a provider (public) */
  listByProvider: (providerId: string) =>
    apiClient.get<ApiResponse<Review[]>>(`/reviews/provider/${providerId}`),

  /** GET /reviews/provider/:id/stats — aggregate rating + count (public) */
  getProviderStats: (providerId: string) =>
    apiClient.get<ApiResponse<{ averageRating: number; totalReviews: number }>>(
      `/reviews/provider/${providerId}/stats`,
    ),

  /** PATCH /reviews/:id/reply — provider replies to a review (JWT required) */
  reply: (id: string, replyText: string) =>
    apiClient.patch<ApiResponse<{ success: boolean }>>(`/reviews/${id}/reply`, { replyText }),
}

// ─── Returns ──────────────────────────────────────────────────────────────────

export const returnsApi = {
  /** POST /returns — customer creates a return request */
  create: (dto: { orderId: string; reason: string; description: string; evidenceImages?: string[] }) =>
    apiClient.post<{ id: string; status: string }>('/returns', dto),

  /** GET /returns/order/:orderId — get return request for an order */
  getByOrder: (orderId: string) =>
    apiClient.get<{ id: string; status: string; reason: string; description: string } | null>(
      `/returns/order/${orderId}`,
    ),

  /** GET /returns — admin list (CA/SA) */
  listAll: (params?: { status?: string; page?: number; limit?: number }) =>
    apiClient.get<{ data: unknown[]; total: number; page: number; limit: number }>(
      '/returns',
      { params },
    ),

  /** PATCH /returns/:id/status — admin update status */
  updateStatus: (id: string, dto: { status: string; refundAmount?: number; resolutionNote?: string }) =>
    apiClient.patch(`/returns/${id}/status`, dto),
}

// ─── Provider vacation ────────────────────────────────────────────────────────

export const vacationApi = {
  /** PATCH /providers/me/vacation — set shop status */
  set: (dto: { shopStatus: 'OPEN' | 'VACATION' | 'CLOSED'; vacationMessage?: string; vacationUntil?: string }) =>
    apiClient.patch<{ shopStatus: string; vacationMessage: string | null; vacationUntil: string | null }>(
      '/providers/me/vacation',
      dto,
    ),
}

// ─── System mode ──────────────────────────────────────────────────────────────

export const systemApi = {
  /** GET /system/mode — public, returns current mode */
  getMode: () =>
    apiClient.get<{ mode: 'training' | 'production'; isTrainingMode: boolean }>('/system/mode'),

  /** PATCH /system/mode — Super Admin only */
  setMode: (trainingMode: boolean) =>
    apiClient.patch<{ success: boolean }>('/system/mode', { trainingMode }),
}
