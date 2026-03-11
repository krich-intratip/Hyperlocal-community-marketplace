import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { StoreModule } from './entities/store-module.entity'

@Injectable()
export class StoreModulesService {
  constructor(
    @InjectRepository(StoreModule)
    private readonly repo: Repository<StoreModule>,
  ) {}

  findByStore(storeId: string) {
    return this.repo.find({ where: { storeId } })
  }

  async enable(storeId: string, moduleId: string) {
    const existing = await this.repo.findOne({ where: { storeId, moduleId } })
    if (existing) {
      existing.isEnabled = true
      return this.repo.save(existing)
    }
    return this.repo.save(this.repo.create({ storeId, moduleId, isEnabled: true }))
  }

  async disable(storeId: string, moduleId: string) {
    const existing = await this.repo.findOne({ where: { storeId, moduleId } })
    if (!existing) throw new NotFoundException('Store module not found')
    existing.isEnabled = false
    return this.repo.save(existing)
  }
}
