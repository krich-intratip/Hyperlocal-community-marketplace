import { Injectable, NotFoundException, Inject } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, ILike, Between, MoreThanOrEqual, LessThanOrEqual } from 'typeorm'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager'
import { Listing } from './entities/listing.entity'
import { MarketplaceCategory, ListingStatus } from '@chm/shared-types'

const LISTINGS_TTL = 5 * 60 * 1000

export type ListingSortOption = 'newest' | 'price_asc' | 'price_desc' | 'promoted'

@Injectable()
export class ListingsService {
  constructor(
    @InjectRepository(Listing)
    private readonly listingRepo: Repository<Listing>,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  async search(query: {
    communityId?: string
    category?: MarketplaceCategory
    keyword?: string
    isHealthOption?: boolean
    minPrice?: number
    maxPrice?: number
    sort?: ListingSortOption
    page?: number
    limit?: number
  }) {
    const safePage = Math.max(1, Number(query.page) || 1)
    const safeLimit = Math.min(100, Math.max(1, Number(query.limit) || 20))
    const { communityId, category, keyword, isHealthOption, minPrice, maxPrice, sort } = query
    const page = safePage
    const limit = safeLimit
    const cacheKey = `listings:search:${communityId ?? ''}:${category ?? ''}:${keyword ?? ''}:${isHealthOption ?? ''}:${minPrice ?? ''}:${maxPrice ?? ''}:${sort ?? ''}:${page}:${limit}`
    const cached = await this.cache.get<{ data: Listing[]; total: number; page: number; limit: number }>(cacheKey)
    if (cached) return cached

    const where: any = { status: ListingStatus.ACTIVE }
    if (communityId) where.communityId = communityId
    if (category) where.category = category
    if (keyword) where.title = ILike(`%${keyword}%`)
    if (isHealthOption === true) where.isHealthOption = true
    if (minPrice !== undefined && maxPrice !== undefined) {
      where.price = Between(minPrice, maxPrice)
    } else if (minPrice !== undefined) {
      where.price = MoreThanOrEqual(minPrice)
    } else if (maxPrice !== undefined) {
      where.price = LessThanOrEqual(maxPrice)
    }

    let order: any = { createdAt: 'DESC' }
    if (sort === 'price_asc') order = { price: 'ASC' }
    else if (sort === 'price_desc') order = { price: 'DESC' }
    else if (sort === 'promoted') order = { isPromoted: 'DESC', createdAt: 'DESC' }

    const [data, total] = await this.listingRepo.findAndCount({
      where,
      take: limit,
      skip: (page - 1) * limit,
      order,
    })
    const result = { data, total, page, limit }
    await this.cache.set(cacheKey, result, LISTINGS_TTL)
    return result
  }

  async findById(id: string) {
    const listing = await this.listingRepo.findOne({ where: { id, status: ListingStatus.ACTIVE } })
    if (!listing) throw new NotFoundException('Listing not found')
    return listing
  }

  async create(providerId: string, data: {
    communityId: string; title: string; description: string
    category: MarketplaceCategory; price: number; priceUnit?: string
  }) {
    const listing = this.listingRepo.create({ providerId, ...data })
    const saved = await this.listingRepo.save(listing)
    await this.invalidateListingsCache()
    return saved
  }

  async update(id: string, providerId: string, data: Partial<Listing>) {
    await this.listingRepo.update({ id, providerId }, data)
    await this.invalidateListingsCache()
    return this.findById(id)
  }

  async remove(id: string, providerId: string) {
    await this.listingRepo.update({ id, providerId }, { status: ListingStatus.INACTIVE })
    await this.invalidateListingsCache()
    return { success: true }
  }

  async setPromotion(id: string, providerId: string, data: {
    discountPercent: number | null
    discountEndsAt: string | null
  }) {
    const listing = await this.listingRepo.findOne({ where: { id, providerId } })
    if (!listing) throw new NotFoundException('Listing not found or not owned by provider')
    const discountEndsAt = data.discountEndsAt ? new Date(data.discountEndsAt) : null
    await this.listingRepo.update({ id }, { discountPercent: data.discountPercent, discountEndsAt })
    await this.invalidateListingsCache()
    return { success: true }
  }

  private async invalidateListingsCache() {
    const store = (this.cache as any).store
    if (typeof store?.keys === 'function') {
      const keys: string[] = await store.keys('chm:listings:search:*')
      await Promise.all(keys.map((k: string) => this.cache.del(k)))
    }
  }
}
