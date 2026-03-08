import { MarketplaceCategory, ListingStatus } from './enums'

export interface Listing {
  id: string
  providerId: string
  communityId: string
  title: string
  description: string
  category: MarketplaceCategory
  price: number
  priceUnit?: string
  status: ListingStatus
  images: ListingMedia[]
  createdAt: string
  updatedAt: string
}

export interface ListingMedia {
  id: string
  listingId: string
  fileUrl: string
  order: number
}

export interface CreateListingDto {
  communityId: string
  title: string
  description: string
  category: MarketplaceCategory
  price: number
  priceUnit?: string
}

export interface ListingSearchQuery {
  communityId?: string
  category?: MarketplaceCategory
  keyword?: string
  minPrice?: number
  maxPrice?: number
  page?: number
  limit?: number
}
