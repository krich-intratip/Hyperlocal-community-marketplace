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

  register: (dto: {
    email: string
    password: string
    displayName: string
    role: 'customer' | 'provider' | 'admin'
    phone?: string
  }) => apiClient.post<{ id: string; email: string; displayName: string; role: string; avatarUrl: string | null }>(
    '/auth/register',
    dto,
    { withCredentials: true },
  ),

  login: (dto: { email: string; password: string }) =>
    apiClient.post<{ id: string; email: string; displayName: string; role: string; avatarUrl: string | null }>(
      '/auth/login',
      dto,
      { withCredentials: true },
    ),

  logout: () =>
    apiClient.post('/auth/logout', {}, { withCredentials: true }),

  getMe: () =>
    apiClient.get<{ id: string; email: string; displayName: string; role: string; avatarUrl?: string }>(
      '/auth/me',
      { withCredentials: true },
    ),
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

  setPromotion: (id: string, body: { discountPercent: number | null; discountEndsAt: string | null }) =>
    apiClient.patch<{ success: boolean }>(`/listings/${id}/promotion`, body),

  setImages: (id: string, images: string[]) =>
    apiClient.patch<Listing>(`/listings/${id}/images`, { images }),
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

  setLanguage: (language: 'th' | 'en') =>
    apiClient.patch<{ preferredLanguage: string }>('/users/me/language', { language }),
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

  presignListing: (filename: string, contentType: string) =>
    apiClient.post<ApiResponse<{ uploadUrl: string; publicUrl: string }>>('/upload/presign', {
      filename,
      contentType,
      purpose: 'listing',
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

  /** GET /orders/provider/incoming — all orders assigned to the authenticated provider */
  listProviderIncoming: () =>
    apiClient.get<Order[]>('/orders/provider/incoming'),

  /** GET /orders/:id */
  get: (id: string) =>
    apiClient.get<Order>(`/orders/${id}`),

  /** GET /orders/:id/delivery — delivery info + tracking ID */
  getDelivery: (id: string) =>
    apiClient.get<{
      orderId: string
      deliveryMethod: string
      trackingId: string | null
      carrier: 'lineman' | 'grab_express' | 'self_pickup'
      status: string
    }>(`/orders/${id}/delivery`),

  /** PATCH /orders/:id/status — update order status (role-gated) */
  updateStatus: (id: string, status: string) =>
    apiClient.patch<Order>(`/orders/${id}/status`, { status }),
}

// ─── Reviews ──────────────────────────────────────────────────────────────────

export const reviewsApi = {
  /** POST /reviews — submit review for a completed booking (JWT required) */
  create: (dto: CreateReviewDto) =>
    apiClient.post<ApiResponse<Review>>('/reviews', dto),

  /** GET /reviews/booking/:bookingId — check if review exists for a booking */
  getByBooking: (bookingId: string) =>
    apiClient.get<ApiResponse<Review | null>>(`/reviews/booking/${bookingId}`),

  /** GET /reviews/provider/:id — PDPA-safe public list (visible only) */
  listByProvider: (providerId: string) =>
    apiClient.get<ApiResponse<Review[]>>(`/reviews/provider/${providerId}`),

  /** GET /reviews/provider/:id/manage — all reviews incl. hidden (JWT, provider dashboard) */
  listByProviderManage: (providerId: string) =>
    apiClient.get<ApiResponse<Review[]>>(`/reviews/provider/${providerId}/manage`),

  /** GET /reviews/provider/:id/stats — rating + count + transparencyScore (public) */
  getProviderStats: (providerId: string) =>
    apiClient.get<ApiResponse<{
      averageRating: number
      totalReviews: number
      visibleReviews: number
      transparencyScore: number
    }>>(
      `/reviews/provider/${providerId}/stats`,
    ),

  /** PATCH /reviews/:id/reply — provider replies to a review (JWT required) */
  reply: (id: string, replyText: string) =>
    apiClient.patch<ApiResponse<{ success: boolean }>>(`/reviews/${id}/reply`, { replyText }),

  /** PATCH /reviews/:id/visibility — RV-2: provider approves or hides a review (JWT required) */
  setVisibility: (id: string, isVisible: boolean) =>
    apiClient.patch<ApiResponse<{ success: boolean; isVisible: boolean }>>(
      `/reviews/${id}/visibility`,
      { isVisible },
    ),
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

// ─── Recommendations (SR-1) ───────────────────────────────────────────────────

export const recommendationsApi = {
  /**
   * GET /recommendations?userId={uuid}&limit={n}
   * Returns ranked Listing[] — personalized when userId provided, popular fallback otherwise.
   */
  get: (userId?: string, limit = 8) =>
    apiClient.get<any[]>('/recommendations', {
      params: { ...(userId ? { userId } : {}), limit },
    }),
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

// ─── Messages (CM-1) ──────────────────────────────────────────────────────────

export interface ConversationSummary {
  id: string
  customerId: string
  providerId: string
  providerUserId: string
  providerDisplayName: string | null
  orderId: string | null
  lastMessagePreview: string | null
  lastMessageAt: string | null
  createdAt: string
  unreadCount: number
}

export interface ChatMessage {
  id: string
  conversationId: string
  senderId: string
  body: string
  isRead: boolean
  createdAt: string
}

export const messagesApi = {
  /** POST /messages — start or resume a conversation */
  start: (dto: { providerId: string; orderId?: string; message: string }) =>
    apiClient.post<{ conversation: ConversationSummary; messages: ChatMessage[] }>('/messages', dto),

  /** GET /messages — list all conversations */
  list: () =>
    apiClient.get<ConversationSummary[]>('/messages'),

  /** GET /messages/unread-count — total unread for navbar badge */
  getUnreadCount: () =>
    apiClient.get<{ count: number }>('/messages/unread-count'),

  /** GET /messages/:id — messages in conversation */
  getMessages: (id: string) =>
    apiClient.get<ChatMessage[]>(`/messages/${id}`),

  /** POST /messages/:id — send a message */
  send: (id: string, body: string) =>
    apiClient.post<ChatMessage>(`/messages/${id}`, { body }),

  /** PATCH /messages/:id/read — mark as read */
  markRead: (id: string) =>
    apiClient.patch(`/messages/${id}/read`),
}

// ─── Payments ─────────────────────────────────────────────────────────────────

export type PaymentMethod = 'promptpay' | 'card' | 'cod'
export type OrderPaymentStatus = 'PENDING' | 'PAID' | 'EXPIRED' | 'CANCELLED'

export interface PaymentRecord {
  id: string
  orderId: string
  amount: number
  method: PaymentMethod
  status: OrderPaymentStatus
  qrData: string | null
  paidAt: string | null
  expiresAt: string
  createdAt: string
  updatedAt: string
}

export const paymentsApi = {
  /** POST /payments/initiate — create/resume a payment for an order */
  initiate: (dto: { orderId: string; method: PaymentMethod }) =>
    apiClient.post<PaymentRecord>('/payments/initiate', dto),

  /** GET /payments/order/:orderId — get latest payment status */
  getByOrder: (orderId: string) =>
    apiClient.get<PaymentRecord>(`/payments/order/${orderId}`),

  /** POST /payments/:id/simulate-pay — dev: simulate successful payment */
  simulatePay: (paymentId: string) =>
    apiClient.post<PaymentRecord>(`/payments/${paymentId}/simulate-pay`),
}

// ─── Inventory (INVENTORY-1) ───────────────────────────────────────────────────

export interface InventoryListing {
  id: string; title: string; category: string; price: number; priceUnit: string | null
  status: string; stockQty: number | null; lowStockThreshold: number
  images: string[] | null; isPromoted: boolean; communityId: string
}

export const inventoryApi = {
  getMyListings: () =>
    apiClient.get<InventoryListing[]>('/listings/provider/my'),
  getLowStock: () =>
    apiClient.get<InventoryListing[]>('/listings/provider/low-stock'),
  updateStock: (id: string, data: { stockQty: number | null; lowStockThreshold?: number }) =>
    apiClient.patch<InventoryListing>(`/listings/${id}/stock`, data),
}

// ─── Provider Earnings (EARN-1) ────────────────────────────────────────────────

export interface EarningTransaction {
  id: string
  service: string
  date: string
  gross: number
  fee: number
  net: number
  status: string
}
export interface MonthlyEarning {
  month: string        // "2026-03"
  gross: number
  net: number
  orderCount: number
}
export interface ProviderEarnings {
  period: string
  totalGross: number
  totalFees: number
  totalNet: number
  pendingPayout: number
  completedOrders: number
  monthlyBreakdown: MonthlyEarning[]
  transactions: EarningTransaction[]
}

export const earningsApi = {
  /** GET /orders/provider/earnings?period=7d|30d|90d|all */
  get: (period = '30d') =>
    apiClient.get<ProviderEarnings>('/orders/provider/earnings', { params: { period } }),
}

// ─── Loyalty ──────────────────────────────────────────────────────────────────

export interface LoyaltyAccount {
  id: string
  customerId: string
  points: number
  totalEarned: number
  totalRedeemed: number
  tier: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM'
  nextTier: 'SILVER' | 'GOLD' | 'PLATINUM' | null
  pointsToNextTier: number | null
  redeemValue: number   // baht value of current points
  createdAt: string
  updatedAt: string
}

export interface LoyaltyTransaction {
  id: string
  customerId: string
  type: 'EARN' | 'REDEEM' | 'RESTORE' | 'BONUS'
  points: number
  balance: number
  description: string | null
  orderId: string | null
  createdAt: string
}

export const loyaltyApi = {
  getAccount: () => apiClient.get<LoyaltyAccount>('/loyalty/me'),
  getTransactions: (limit = 20) => apiClient.get<LoyaltyTransaction[]>(`/loyalty/transactions?limit=${limit}`),
}

// ─── Referral ─────────────────────────────────────────────────────────────────

export interface ReferralStats {
  code: string
  referralLink: string
  totalReferred: number
  completedReferrals: number
  totalBonusEarned: number
  referrals: Array<{
    id: string
    status: 'PENDING' | 'COMPLETED'
    bonusPoints: number
    createdAt: string
    completedAt: string | null
  }>
}

export const referralApi = {
  getMyCode: () => apiClient.get<{ code: string; referralLink: string }>('/referral/my-code'),
  getStats: () => apiClient.get<ReferralStats>('/referral/stats'),
}

// ─── Admin (SuperAdmin only) ───────────────────────────────────────────────────

export interface AdminUser {
  id: string; email: string; displayName: string; role: string
  isActive: boolean; loginProvider: string; createdAt: string; avatarUrl?: string
}
export interface AdminUserList {
  users: AdminUser[]; total: number; page: number; limit: number; pages: number
}
export interface RevenueSummary {
  gmv: number; platformFees: number; totalOrders: number
  completedOrders: number; cancelledOrders: number
  paidPayments: number; totalRevenue: number
  thisMonth: { gmv: number; fees: number; orders: number }
  statusBreakdown: Record<string, number>
  methodBreakdown: Record<string, number>
  topCommunities: { communityId: string; gmv: number }[]
}
export interface PlatformStats {
  totalUsers: number; activeUsers: number; totalProviders: number
  pendingProviders: number; totalOrders: number
}

export const adminApi = {
  // Users
  listUsers: (params?: { search?: string; role?: string; isActive?: string; page?: number; limit?: number }) =>
    apiClient.get<AdminUserList>('/admin/users', { params }),
  setUserStatus: (userId: string, isActive: boolean) =>
    apiClient.patch<{ success: boolean; user: AdminUser }>(`/admin/users/${userId}/status`, { isActive }),
  setUserRole: (userId: string, role: string) =>
    apiClient.patch<{ success: boolean; user: AdminUser }>(`/admin/users/${userId}/role`, { role }),
  // Providers
  getPendingAll: () =>
    apiClient.get<unknown[]>('/admin/providers/pending-all'),
  getAllProviders: (params?: { status?: string; communityId?: string }) =>
    apiClient.get<unknown[]>('/admin/providers/all', { params }),
  approveProvider: (id: string) =>
    apiClient.post(`/admin/providers/${id}/approve`),
  rejectProvider: (id: string) =>
    apiClient.post(`/admin/providers/${id}/reject`),
  // Revenue & Stats
  getRevenue: () =>
    apiClient.get<RevenueSummary>('/admin/revenue'),
  getStats: () =>
    apiClient.get<PlatformStats>('/admin/stats'),
}

// ─── Schedule ─────────────────────────────────────────────────────────────────

export interface DaySchedule {
  dayOfWeek: number  // 0=Sun 6=Sat
  isOpen: boolean
  openTime: string   // HH:mm
  closeTime: string  // HH:mm
}

export interface ProviderHolidayEntry {
  id: string
  date: string       // YYYY-MM-DD
  reason: string | null
  createdAt: string
}

export interface PublicSchedule {
  schedule: DaySchedule[]
  holidays: ProviderHolidayEntry[]
  todayOpen: boolean
  todayHours: string
}

export const scheduleApi = {
  getMySchedule: () => apiClient.get<DaySchedule[]>('/providers/me/schedule'),
  setMySchedule: (days: DaySchedule[]) => apiClient.patch<DaySchedule[]>('/providers/me/schedule', { days }),
  getMyHolidays: () => apiClient.get<ProviderHolidayEntry[]>('/providers/me/holidays'),
  addHoliday: (date: string, reason?: string) => apiClient.post<ProviderHolidayEntry>('/providers/me/holidays', { date, reason }),
  removeHoliday: (date: string) => apiClient.delete<{ removed: boolean }>(`/providers/me/holidays/${date}`),
  getPublicSchedule: (providerId: string) => apiClient.get<PublicSchedule>(`/providers/${providerId}/schedule`),
}

// ─── Coupon (COUPON-1) ────────────────────────────────────────────────────────

export type CouponType = 'PERCENT' | 'FIXED' | 'FREE_DELIVERY'
export type CouponScope = 'PLATFORM' | 'PROVIDER'

export interface CouponV2 {
  id: string
  code: string
  description: string | null
  type: CouponType
  discountValue: number
  minOrderAmount: number
  maxDiscountAmount: number | null
  scope: CouponScope
  providerId: string | null
  maxUses: number | null
  maxUsesPerUser: number
  usedCount: number
  isActive: boolean
  startsAt: string | null
  expiresAt: string | null
  createdAt: string
}

export interface CouponValidation {
  valid: boolean
  coupon?: CouponV2
  discountAmount: number
  message: string
}

export const couponApi = {
  validate: (code: string, orderTotal: number, providerId?: string) =>
    apiClient.post<CouponValidation>('/coupons/validate', { code, orderTotal, providerId }),
  list: () => apiClient.get<CouponV2[]>('/coupons'),
  create: (dto: {
    code: string; description?: string; type: CouponType; discountValue: number;
    minOrderAmount?: number; maxDiscountAmount?: number; scope?: CouponScope;
    providerId?: string; maxUses?: number; maxUsesPerUser?: number;
    startsAt?: string; expiresAt?: string
  }) => apiClient.post<CouponV2>('/coupons', dto),
  deactivate: (id: string) => apiClient.patch<CouponV2>(`/coupons/${id}/deactivate`, {}),
  activate: (id: string) => apiClient.patch<CouponV2>(`/coupons/${id}/activate`, {}),
}

// ─── Subscription ─────────────────────────────────────────────────────────────

export type SubscriptionTier = 'FREE' | 'BASIC' | 'PRO' | 'ENTERPRISE'

export interface PlanConfig {
  tier: SubscriptionTier
  nameEN: string
  nameTH: string
  priceMonthlyTHB: number
  maxListings: number
  maxImages: number
  featuredSlots: number
  analyticsAccess: boolean
  prioritySupport: boolean
  customBranding: boolean
}

export interface ProviderSubscription {
  id: string
  providerId: string
  tier: SubscriptionTier
  startsAt: string
  expiresAt: string | null
  priceTHB: number
  isActive: boolean
  autoRenew: boolean
  cancelledAt: string | null
  createdAt: string
  updatedAt: string
}

export const subscriptionApi = {
  getPlans: () => apiClient.get<PlanConfig[]>('/subscriptions/plans'),
  getMySubscription: () => apiClient.get<ProviderSubscription>('/subscriptions/me'),
  cancel: () => apiClient.post<ProviderSubscription>('/subscriptions/me/cancel', {}),
  adminSetTier: (providerId: string, tier: SubscriptionTier, months?: number) =>
    apiClient.patch<ProviderSubscription>('/subscriptions/admin/set-tier', { providerId, tier, months }),
  adminListAll: (tier?: SubscriptionTier) =>
    apiClient.get<ProviderSubscription[]>('/subscriptions/admin/list', { params: tier ? { tier } : {} }),
}

// ─── Push Notifications ────────────────────────────────────────────────────────

export interface PushSubscriptionData {
  id: string
  userId: string
  endpoint: string
  p256dh: string
  auth: string
  userAgent: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface PushStats {
  total: number
  active: number
}

export const pushApi = {
  subscribe: (data: { endpoint: string; p256dh: string; auth: string; userAgent?: string }) =>
    apiClient.post<PushSubscriptionData>('/push/subscribe', data),
  unsubscribe: (endpoint: string) =>
    apiClient.delete('/push/unsubscribe', { params: { endpoint } }),
  getMySubscriptions: () =>
    apiClient.get<PushSubscriptionData[]>('/push/my-subscriptions'),
  send: (data: { userIds?: string[]; title: string; body: string; url?: string }) =>
    apiClient.post<{ sent: number; failed: number }>('/push/send', data),
  getStats: () => apiClient.get<PushStats>('/push/stats'),
}

// ─── Reports ──────────────────────────────────────────────────────────────────

export type ReportType = 'LISTING' | 'PROVIDER' | 'REVIEW' | 'MESSAGE'
export type ReportReason = 'SPAM' | 'INAPPROPRIATE' | 'FAKE' | 'SCAM' | 'HARASSMENT' | 'OTHER'
export type ReportStatus = 'PENDING' | 'REVIEWED' | 'RESOLVED' | 'DISMISSED'

export interface Report {
  id: string
  reporterId: string
  type: ReportType
  targetId: string
  reason: ReportReason
  description: string | null
  status: ReportStatus
  adminNote: string | null
  resolvedBy: string | null
  resolvedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface ReportStats {
  pending: number
  resolved: number
  dismissed: number
  total: number
}

export const reportApi = {
  create: (data: { type: ReportType; targetId: string; reason: ReportReason; description?: string }) =>
    apiClient.post<Report>('/reports', data),
  listAll: (params?: { status?: ReportStatus; type?: ReportType }) =>
    apiClient.get<Report[]>('/reports', { params }),
  getStats: () => apiClient.get<ReportStats>('/reports/stats'),
  resolve: (id: string, data: { status: 'RESOLVED' | 'DISMISSED'; adminNote?: string }) =>
    apiClient.patch<Report>(`/reports/${id}/resolve`, data),
}

// ─── Search (SEARCH-2) ────────────────────────────────────────────────────────

export type SortBy = 'newest' | 'price_asc' | 'price_desc' | 'rating' | 'popular'

export interface SearchParams {
  q?: string
  category?: string
  communityId?: string
  minPrice?: number
  maxPrice?: number
  minRating?: number
  sortBy?: SortBy
  page?: number
  limit?: number
}

export interface SearchResult {
  data: Listing[]
  total: number
  page: number
  limit: number
}

export const searchApi = {
  search: (params: SearchParams) => {
    const qs = new URLSearchParams()
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== '' && v !== null) qs.set(k, String(v))
    })
    return apiClient.get<SearchResult>(`/listings/search?${qs.toString()}`)
  },
}

// ─── Platform Analytics ───────────────────────────────────────────────────────

export interface PlatformKPI {
  totalRevenue: number
  totalOrders: number
  completedOrders: number
  activeListings: number
  uniqueCustomers: number
  conversionRate: number
  revenueGrowth: number   // % vs last month
  ordersGrowth: number    // % vs last month
}

export interface DailyRevenuePt { date: string; revenue: number; orders: number }
export interface MonthlyRevenuePt { month: string; revenue: number; orders: number }
export interface StatusBreakdown { status: string; count: number }
export interface CategoryDist { category: string; count: number }
export interface TopProvider { providerId: string; orderCount: number; revenue: number }

export interface PlatformAnalytics {
  kpi: PlatformKPI
  dailyRevenue: DailyRevenuePt[]
  monthlyRevenue: MonthlyRevenuePt[]
  orderStatusBreakdown: StatusBreakdown[]
  categoryDistribution: CategoryDist[]
  topProviders: TopProvider[]
}

export const analyticsApi = {
  getPlatform: () => apiClient.get<PlatformAnalytics>('/analytics/platform'),
}

// ─── Geolocation ─────────────────────────────────────────────────────────────

export interface NearbyProvider {
  id: string
  displayName: string
  bio: string | null
  category: string | null
  avatarUrl: string | null
  rating: number
  reviewCount: number
  distanceKm: number
  latitude: number
  longitude: number
  isVerified?: boolean
}

export const geoApi = {
  getNearby: (lat: number, lng: number, radius?: number, category?: string) => {
    const qs = new URLSearchParams({ lat: String(lat), lng: String(lng) })
    if (radius) qs.set('radius', String(radius))
    if (category) qs.set('category', category)
    return apiClient.get<NearbyProvider[]>(`/providers/nearby?${qs.toString()}`)
  },
  getInBounds: (params: { north: number; south: number; east: number; west: number }) =>
    apiClient.get<NearbyProvider[]>('/providers/in-bounds', { params }),
  setMyLocation: (latitude: number, longitude: number) =>
    apiClient.patch('/providers/me/location', { latitude, longitude }),
}
