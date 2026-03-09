/**
 * Shared API response/request types used across the web app.
 * These mirror the backend DTOs — update when backend schema changes.
 */

// ─── Common wrappers ──────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface ApiError {
  statusCode: number
  message: string
  error?: string
}

// ─── Enums ────────────────────────────────────────────────────────────────────

export type UserRole = 'CUSTOMER' | 'PROVIDER' | 'COMMUNITY_ADMIN' | 'SUPER_ADMIN'

export type CommunityStatus = 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'TAKEOVER'

export type ProviderStatus = 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'REJECTED'

export type BookingStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'DISPUTED'

export type PaymentStatus = 'PENDING' | 'ESCROWED' | 'RELEASED' | 'REFUNDED'

export type AnnouncementStatus = 'PUBLISHED' | 'PENDING' | 'REJECTED'

export type AnnouncementType = 'info' | 'warning' | 'success'

export type AnnouncementScope = 'GLOBAL' | 'COMMUNITY'

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string
  email: string
  name: string
  role: UserRole
  avatarUrl?: string
  communityIds?: string[]   // for COMMUNITY_ADMIN: communities they manage
  communityId?: string      // for PROVIDER/CUSTOMER: primary community
}

export interface SignInRequest {
  email: string
  password: string
}

export interface SignInResponse {
  user: AuthUser
  /** token is set as httpOnly cookie — not returned in body */
}

// ─── User / Profile ───────────────────────────────────────────────────────────

export interface UserProfile {
  id: string
  email: string
  name: string
  phone?: string
  avatarUrl?: string
  role: UserRole
  createdAt: string
}

// ─── Community ────────────────────────────────────────────────────────────────

export interface Community {
  id: string
  name: string
  location: string
  province: string
  zone?: string
  lat?: number
  lng?: number
  status: CommunityStatus
  memberCount: number
  providerCount: number
  monthlyBookings: number
  rating: number
  trialEndsAt?: string
  marketCreated: boolean
  adminId: string
  adminName: string
  createdAt: string
}

export interface CreateCommunityDto {
  name: string
  location: string
  province: string
  zone?: string
  lat?: number
  lng?: number
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export interface Provider {
  id: string
  userId: string
  name: string
  communityId: string
  category: string
  description: string
  priceMin: number
  priceMax: number
  priceUnit: string
  rating: number
  reviewCount: number
  status: ProviderStatus
  verified: boolean
  avatarUrl?: string
  lat?: number
  lng?: number
  address?: string
  createdAt: string
}

export interface ProviderApplyDto {
  communityId: string
  category: string
  description: string
  priceMin: number
  priceMax: number
  priceUnit: string
  address: string
  lat?: number
  lng?: number
  idCardUrl?: string
  selfieUrl?: string
  phone: string
}

// ─── Booking ──────────────────────────────────────────────────────────────────

export interface Booking {
  id: string
  customerId: string
  customerName: string
  providerId: string
  providerName: string
  serviceDescription: string
  scheduledAt: string
  amount: number
  tax: number
  discount: number
  totalAmount: number
  status: BookingStatus
  paymentStatus: PaymentStatus
  communityId: string
  note?: string
  createdAt: string
}

export interface CreateBookingDto {
  providerId: string
  serviceDescription: string
  scheduledAt: string
  amount: number
  couponCode?: string
  note?: string
}

// ─── Announcement ─────────────────────────────────────────────────────────────

export interface Announcement {
  id: string
  title: string
  body: string
  type: AnnouncementType
  scope: AnnouncementScope
  status: AnnouncementStatus
  fromSA: boolean
  authorId: string
  authorName: string
  communityId?: string
  communityName?: string
  createdAt: string
  updatedAt: string
}

export interface CreateAnnouncementDto {
  title: string
  body: string
  type: AnnouncementType
  scope: AnnouncementScope
  communityId?: string
}

// ─── Promotion / Coupon ───────────────────────────────────────────────────────

export interface Coupon {
  id: string
  code: string
  discountType: 'PERCENTAGE' | 'FIXED'
  discountValue: number
  minOrderAmount?: number
  maxUses?: number
  usedCount: number
  expiresAt?: string
  communityId?: string
  isActive: boolean
}

// ─── Listing ──────────────────────────────────────────────────────────────────

export type ListingStatus = 'available' | 'booked' | 'closed'

export type ListingCategory =
  | 'FOOD'
  | 'REPAIR'
  | 'EDUCATION'
  | 'CARE'
  | 'CLEANING'
  | 'BEAUTY'
  | 'FITNESS'
  | 'OTHER'

export interface Listing {
  id: string
  title: string
  description: string
  category: ListingCategory
  price: number
  priceUnit: string
  status: ListingStatus
  rating: number
  reviewCount: number
  provider: string
  providerId: string
  communityId: string
  tags: string[]
  imageUrl?: string
  lat?: number
  lng?: number
  address?: string
  createdAt: string
}

// ─── Notification ─────────────────────────────────────────────────────────────

export type NotifType = 'booking' | 'review' | 'promo' | 'system'

export interface Notification {
  id: string
  type: NotifType
  title: string
  body: string
  read: boolean
  createdAt: string
  href?: string
}

// ─── KYC / Address ────────────────────────────────────────────────────────────

export interface AddressDto {
  addressLine: string
  subdistrict: string
  district: string
  province: string
  postalCode: string
  lat?: number
  lng?: number
}

// ─── Analytics / Dashboard ────────────────────────────────────────────────────

export interface AnalyticsMonthlySeries {
  month: string          // 'YYYY-MM'
  orders: number
  sales: number
  commission: number
}

export interface AnalyticsTopProvider {
  providerId: string
  providerName: string
  orders: number
  revenue: number
}

export interface AnalyticsSummary {
  totalOrders: number
  totalSales: number
  totalCommission: number
}

export interface AnalyticsResponse {
  period: number
  communityId?: string
  summary: AnalyticsSummary
  monthlySeries: AnalyticsMonthlySeries[]
  topProviders: AnalyticsTopProvider[]
}
