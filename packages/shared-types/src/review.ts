export interface Review {
  id: string
  bookingId: string
  reviewerId: string
  providerId: string
  listingId?: string
  listingTitle?: string
  rating: number
  comment?: string
  providerReply?: string
  isFlagged: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateReviewDto {
  bookingId: string
  rating: number
  comment?: string
  // providerId intentionally omitted — server derives it from the booking record
}
