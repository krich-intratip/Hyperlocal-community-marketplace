import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { BusinessTemplate } from './entities/business-template.entity'

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
}
