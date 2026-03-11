import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { StoreMarket } from './entities/store-market.entity'
import { StoreMarketsService } from './store-markets.service'
import { StoreMarketsController } from './store-markets.controller'

@Module({
  imports: [TypeOrmModule.forFeature([StoreMarket])],
  controllers: [StoreMarketsController],
  providers: [StoreMarketsService],
  exports: [StoreMarketsService],
})
export class StoreMarketsModule {}
