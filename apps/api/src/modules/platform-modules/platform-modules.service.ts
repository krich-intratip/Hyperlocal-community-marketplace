import { Injectable, NotFoundException, ConflictException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { PlatformModule } from './entities/platform-module.entity'

export interface UpsertModuleDto {
  code: string
  name: string
  description?: string
  category: string
  isCore?: boolean
  isActive?: boolean
}

@Injectable()
export class PlatformModulesService {
  constructor(
    @InjectRepository(PlatformModule)
    private readonly repo: Repository<PlatformModule>,
  ) {}

  findAll() {
    return this.repo.find({ where: { isActive: true }, order: { category: 'ASC', code: 'ASC' } })
  }

  findAllIncludeInactive() {
    return this.repo.find({ order: { category: 'ASC', code: 'ASC' } })
  }

  async findByCode(code: string) {
    const mod = await this.repo.findOne({ where: { code } })
    if (!mod) throw new NotFoundException(`Platform module '${code}' not found`)
    return mod
  }

  async create(dto: UpsertModuleDto): Promise<PlatformModule> {
    const existing = await this.repo.findOne({ where: { code: dto.code } })
    if (existing) throw new ConflictException(`Module code '${dto.code}' already exists`)
    const mod = this.repo.create({
      code: dto.code,
      name: dto.name,
      description: dto.description ?? null,
      category: dto.category,
      isCore: dto.isCore ?? false,
      isActive: dto.isActive ?? true,
    })
    return this.repo.save(mod)
  }

  async update(code: string, dto: Partial<UpsertModuleDto>): Promise<PlatformModule> {
    const mod = await this.findByCode(code)
    Object.assign(mod, {
      ...(dto.name !== undefined && { name: dto.name }),
      ...(dto.description !== undefined && { description: dto.description }),
      ...(dto.category !== undefined && { category: dto.category }),
      ...(dto.isCore !== undefined && { isCore: dto.isCore }),
      ...(dto.isActive !== undefined && { isActive: dto.isActive }),
    })
    return this.repo.save(mod)
  }

  async remove(code: string): Promise<{ success: boolean }> {
    await this.findByCode(code)
    await this.repo.delete({ code })
    return { success: true }
  }
}
