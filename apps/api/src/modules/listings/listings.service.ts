import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, ILike } from 'typeorm'
import { Listing } from './entities/listing.entity'
import { MarketplaceCategory, ListingStatus } from '@chm/shared-types'

@Injectable()
export class ListingsService {
  constructor(
    @InjectRepository(Listing)
    private readonly listingRepo: Repository<Listing>,
  ) {}

  search(query: {
    communityId?: string
    category?: MarketplaceCategory
    keyword?: string
    page?: number
    limit?: number
  }) {
    const { communityId, category, keyword, page = 1, limit = 20 } = query
    const where: any = { status: ListingStatus.ACTIVE }
    if (communityId) where.communityId = communityId
    if (category) where.category = category
    if (keyword) where.title = ILike(`%${keyword}%`)
    return this.listingRepo.findAndCount({ where, take: limit, skip: (page - 1) * limit })
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
    return this.listingRepo.save(listing)
  }

  async update(id: string, providerId: string, data: Partial<Listing>) {
    await this.listingRepo.update({ id, providerId }, data)
    return this.findById(id)
  }

  async remove(id: string, providerId: string) {
    await this.listingRepo.update({ id, providerId }, { status: ListingStatus.INACTIVE })
    return { success: true }
  }
}
