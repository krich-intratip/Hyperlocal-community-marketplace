import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { MarketModule } from './entities/market-module.entity'

@Injectable()
export class MarketModulesService {
  constructor(
    @InjectRepository(MarketModule)
    private readonly repo: Repository<MarketModule>,
  ) {}

  findByMarket(marketId: string) {
    return this.repo.find({ where: { marketId }, order: { enabledAt: 'ASC' } })
  }

  async enable(marketId: string, moduleId: string, enabledBy: string) {
    const existing = await this.repo.findOne({ where: { marketId, moduleId } })
    if (existing) {
      existing.isEnabled = true
      return this.repo.save(existing)
    }
    return this.repo.save(this.repo.create({ marketId, moduleId, isEnabled: true, enabledBy }))
  }

  async disable(marketId: string, moduleId: string) {
    const existing = await this.repo.findOne({ where: { marketId, moduleId } })
    if (!existing) throw new NotFoundException('Market module not found')
    existing.isEnabled = false
    return this.repo.save(existing)
  }
}
