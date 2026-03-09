import { Injectable, NotFoundException, Inject } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, ILike } from 'typeorm'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager'
import { Listing } from './entities/listing.entity'
import { MarketplaceCategory, ListingStatus } from '@chm/shared-types'

const LISTINGS_TTL = 5 * 60 * 1000

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
    page?: number
    limit?: number
  }) {
    const { communityId, category, keyword, page = 1, limit = 20 } = query
    const cacheKey = `listings:search:${communityId ?? ''}:${category ?? ''}:${keyword ?? ''}:${page}:${limit}`
    const cached = await this.cache.get<[Listing[], number]>(cacheKey)
    if (cached) return cached
    const where: any = { status: ListingStatus.ACTIVE }
    if (communityId) where.communityId = communityId
    if (category) where.category = category
    if (keyword) where.title = ILike(`%${keyword}%`)
    const result = await this.listingRepo.findAndCount({ where, take: limit, skip: (page - 1) * limit })
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

  private async invalidateListingsCache() {
    const store = (this.cache as any).store
    if (typeof store?.keys === 'function') {
      const keys: string[] = await store.keys('chm:listings:search:*')
      await Promise.all(keys.map((k: string) => this.cache.del(k)))
    }
  }
}
