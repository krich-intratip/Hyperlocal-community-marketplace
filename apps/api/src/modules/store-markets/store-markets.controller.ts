import { Controller, Get, Post, Put, Param, Body } from '@nestjs/common'
import { StoreMarketsService } from './store-markets.service'

@Controller('stores/:storeId/markets')
export class StoreMarketsController {
  constructor(private readonly service: StoreMarketsService) {}

  @Get()
  findAll(@Param('storeId') storeId: string) {
    return this.service.findByStore(storeId)
  }

  @Post()
  addBranch(
    @Param('storeId') storeId: string,
    @Body('marketId') marketId: string,
    @Body('isMainBranch') isMainBranch?: boolean,
  ) {
    return this.service.addBranch(storeId, marketId, isMainBranch)
  }

  @Put(':marketId/suspend')
  suspend(
    @Param('storeId') storeId: string,
    @Param('marketId') marketId: string,
  ) {
    return this.service.suspend(storeId, marketId)
  }
}
