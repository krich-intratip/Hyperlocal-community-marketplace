import { Controller, Get, Put, Param } from '@nestjs/common'
import { StoreModulesService } from './store-modules.service'

@Controller('stores/:storeId/modules')
export class StoreModulesController {
  constructor(private readonly service: StoreModulesService) {}

  @Get()
  findAll(@Param('storeId') storeId: string) {
    return this.service.findByStore(storeId)
  }

  @Put(':moduleId/enable')
  enable(@Param('storeId') storeId: string, @Param('moduleId') moduleId: string) {
    return this.service.enable(storeId, moduleId)
  }

  @Put(':moduleId/disable')
  disable(@Param('storeId') storeId: string, @Param('moduleId') moduleId: string) {
    return this.service.disable(storeId, moduleId)
  }
}
