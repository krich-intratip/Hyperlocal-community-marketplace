import { Controller, Get, Param } from '@nestjs/common'
import { BusinessTemplatesService } from './business-templates.service'

@Controller('business-templates')
export class BusinessTemplatesController {
  constructor(private readonly service: BusinessTemplatesService) {}

  @Get()
  findAll() {
    return this.service.findAll()
  }

  @Get(':code')
  findOne(@Param('code') code: string) {
    return this.service.findByCode(code)
  }
}
