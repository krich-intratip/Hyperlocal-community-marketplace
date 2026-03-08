export interface Review {
  id: string
  bookingId: string
  reviewerId: string
  providerId: string
  rating: number
  comment?: string
  isFlagged: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateReviewDto {
  bookingId: string
  rating: number
  comment?: string
}
