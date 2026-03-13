import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, In, Not } from 'typeorm'
import { Listing } from '../listings/entities/listing.entity'
import { Order } from '../orders/entities/order.entity'
import { ListingStatus } from '@chm/shared-types'

const MAX_ORDERS_SCAN = 20
const FILL_POOL_LIMIT = 50

@Injectable()
export class RecommendationsService {
  constructor(
    @InjectRepository(Listing) private readonly listingRepo: Repository<Listing>,
    @InjectRepository(Order)   private readonly orderRepo:   Repository<Order>,
  ) {}

  async getRecommendations(userId?: string, limit = 8): Promise<Listing[]> {
    if (userId) {
      const personalized = await this.getPersonalized(userId, limit)
      if (personalized.length > 0) return personalized
    }
    return this.getPopular(limit)
  }

  // ── Private helpers ────────────────────────────────────────────────────────

  private async getPersonalized(userId: string, limit: number): Promise<Listing[]> {
    // 1. Fetch user's recent orders (eager-loaded items)
    const orders = await this.orderRepo.find({
      where: { customerId: userId },
      order: { createdAt: 'DESC' },
      take: MAX_ORDERS_SCAN,
    })
    if (orders.length === 0) return []

    // 2. Collect listing IDs the user has already ordered
    const orderedListingIds = new Set<string>()
    for (const order of orders) {
      for (const item of order.items ?? []) {
        orderedListingIds.add(item.listingId)
      }
    }
    if (orderedListingIds.size === 0) return []

    // 3. Resolve preferred categories from ordered listings
    const orderedListings = await this.listingRepo.find({
      where: { id: In([...orderedListingIds]) },
      select: ['id', 'category'],
    })
    const preferredCategories = [...new Set(orderedListings.map(l => l.category))]
    if (preferredCategories.length === 0) return []

    // 4. Find active listings in preferred categories, excluding already-ordered ones
    const excludeIds = [...orderedListingIds]
    const whereConditions = preferredCategories.map(cat => ({
      status: ListingStatus.ACTIVE,
      category: cat,
      ...(excludeIds.length > 0 ? { id: Not(In(excludeIds)) } : {}),
    }))

    const recs = await this.listingRepo.find({
      where: whereConditions,
      order: { isPromoted: 'DESC', createdAt: 'DESC' },
      take: limit,
    })
    if (recs.length >= limit) return recs

    // 5. Fill remaining slots with popular listings not already included
    const usedIds = [...orderedListingIds, ...recs.map(r => r.id)]
    const fillCount = limit - recs.length
    const filler = await this.listingRepo.find({
      where: { status: ListingStatus.ACTIVE, id: Not(In(usedIds)) },
      order: { isPromoted: 'DESC', createdAt: 'DESC' },
      take: fillCount,
    })
    return [...recs, ...filler]
  }

  private async getPopular(limit: number): Promise<Listing[]> {
    return this.listingRepo.find({
      where: { status: ListingStatus.ACTIVE },
      order: { isPromoted: 'DESC', createdAt: 'DESC' },
      take: limit,
    })
  }
}
