import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { PlatformModule } from './entities/platform-module.entity'

@Injectable()
export class PlatformModulesService {
  constructor(
    @InjectRepository(PlatformModule)
    private readonly repo: Repository<PlatformModule>,
  ) {}

  findAll() {
    return this.repo.find({ where: { isActive: true }, order: { category: 'ASC', code: 'ASC' } })
  }

  async findByCode(code: string) {
    const mod = await this.repo.findOne({ where: { code } })
    if (!mod) throw new NotFoundException(`Platform module '${code}' not found`)
    return mod
  }
}
