import { Controller, Get, Put, Param, Body } from '@nestjs/common'
import { MarketModulesService } from './market-modules.service'

@Controller('markets/:marketId/modules')
export class MarketModulesController {
  constructor(private readonly service: MarketModulesService) {}

  @Get()
  findAll(@Param('marketId') marketId: string) {
    return this.service.findByMarket(marketId)
  }

  @Put(':moduleId/enable')
  enable(
    @Param('marketId') marketId: string,
    @Param('moduleId') moduleId: string,
    @Body('enabledBy') enabledBy: string,
  ) {
    return this.service.enable(marketId, moduleId, enabledBy)
  }

  @Put(':moduleId/disable')
  disable(
    @Param('marketId') marketId: string,
    @Param('moduleId') moduleId: string,
  ) {
    return this.service.disable(marketId, moduleId)
  }
}
