import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { StoreMarket } from './entities/store-market.entity'

@Injectable()
export class StoreMarketsService {
  constructor(
    @InjectRepository(StoreMarket)
    private readonly repo: Repository<StoreMarket>,
  ) {}

  findByStore(storeId: string) {
    return this.repo.find({ where: { storeId }, order: { isMainBranch: 'DESC', joinedAt: 'ASC' } })
  }

  findByMarket(marketId: string) {
    return this.repo.find({ where: { marketId, status: 'ACTIVE' } })
  }

  async addBranch(storeId: string, marketId: string, isMainBranch = false) {
    const existing = await this.repo.findOne({ where: { storeId, marketId } })
    if (existing) {
      existing.status = 'ACTIVE'
      return this.repo.save(existing)
    }
    return this.repo.save(this.repo.create({ storeId, marketId, isMainBranch, status: 'ACTIVE' }))
  }

  async suspend(storeId: string, marketId: string) {
    const record = await this.repo.findOne({ where: { storeId, marketId } })
    if (!record) throw new NotFoundException('Store-market relationship not found')
    record.status = 'SUSPENDED'
    return this.repo.save(record)
  }
}
