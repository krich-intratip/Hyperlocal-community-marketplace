import { BookingStatus, PaymentStatus } from './enums'

export interface Booking {
  id: string
  listingId: string
  customerId: string
  providerId: string
  communityId: string
  scheduledAt: string
  note?: string
  status: BookingStatus
  totalAmount: number
  commissionAmount: number
  revenueShareAmount: number
  paymentStatus: PaymentStatus
  createdAt: string
  updatedAt: string
}

export interface BookingHistory {
  id: string
  bookingId: string
  status: BookingStatus
  note?: string
  changedBy: string
  createdAt: string
}

export interface CreateBookingDto {
  listingId: string
  scheduledAt: string
  note?: string
}

export interface UpdateBookingStatusDto {
  status: BookingStatus
  note?: string
}
