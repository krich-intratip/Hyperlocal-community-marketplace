import { Injectable, NotFoundException, ConflictException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { BusinessTemplate } from './entities/business-template.entity'

export interface UpsertTemplateDto {
  code: string
  name: string
  description?: string
  icon?: string
  inventoryPolicy?: string
  defaultModules?: string[]
  defaultCatalogSchema?: object
  defaultOrderFlow?: object
}

@Injectable()
export class BusinessTemplatesService {
  constructor(
    @InjectRepository(BusinessTemplate)
    private readonly repo: Repository<BusinessTemplate>,
  ) {}

  findAll() {
    return this.repo.find({ order: { code: 'ASC' } })
  }

  async findByCode(code: string) {
    const template = await this.repo.findOne({ where: { code } })
    if (!template) throw new NotFoundException(`Business template '${code}' not found`)
    return template
  }

  async create(dto: UpsertTemplateDto): Promise<BusinessTemplate> {
    const existing = await this.repo.findOne({ where: { code: dto.code } })
    if (existing) throw new ConflictException(`Template code '${dto.code}' already exists`)
    const tmpl = this.repo.create({
      code: dto.code,
      name: dto.name,
      description: dto.description ?? null,
      icon: dto.icon ?? null,
      inventoryPolicy: dto.inventoryPolicy ?? 'NONE',
      defaultModules: dto.defaultModules ?? null,
      defaultCatalogSchema: dto.defaultCatalogSchema ?? null,
      defaultOrderFlow: dto.defaultOrderFlow ?? null,
    })
    return this.repo.save(tmpl)
  }

  async update(code: string, dto: Partial<UpsertTemplateDto>): Promise<BusinessTemplate> {
    const tmpl = await this.findByCode(code)
    Object.assign(tmpl, {
      ...(dto.name !== undefined && { name: dto.name }),
      ...(dto.description !== undefined && { description: dto.description }),
      ...(dto.icon !== undefined && { icon: dto.icon }),
      ...(dto.inventoryPolicy !== undefined && { inventoryPolicy: dto.inventoryPolicy }),
      ...(dto.defaultModules !== undefined && { defaultModules: dto.defaultModules }),
      ...(dto.defaultCatalogSchema !== undefined && { defaultCatalogSchema: dto.defaultCatalogSchema }),
      ...(dto.defaultOrderFlow !== undefined && { defaultOrderFlow: dto.defaultOrderFlow }),
    })
    return this.repo.save(tmpl)
  }

  async remove(code: string): Promise<{ success: boolean }> {
    await this.findByCode(code)
    await this.repo.delete({ code })
    return { success: true }
  }
}
