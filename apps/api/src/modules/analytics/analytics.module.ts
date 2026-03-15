import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Order } from '../orders/entities/order.entity'
import { Listing } from '../listings/entities/listing.entity'
import { AnalyticsService } from './analytics.service'
import { AnalyticsController } from './analytics.controller'

@Module({
  imports: [TypeOrmModule.forFeature([Order, Listing])],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}
