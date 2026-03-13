import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RecommendationsController } from './recommendations.controller'
import { RecommendationsService } from './recommendations.service'
import { Listing } from '../listings/entities/listing.entity'
import { Order } from '../orders/entities/order.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Listing, Order])],
  controllers: [RecommendationsController],
  providers: [RecommendationsService],
})
export class RecommendationsModule {}
