import { Controller, Get, Param } from '@nestjs/common'
import { PlatformModulesService } from './platform-modules.service'

@Controller('platform-modules')
export class PlatformModulesController {
  constructor(private readonly service: PlatformModulesService) {}

  @Get()
  findAll() {
    return this.service.findAll()
  }

  @Get(':code')
  findOne(@Param('code') code: string) {
    return this.service.findByCode(code)
  }
}
