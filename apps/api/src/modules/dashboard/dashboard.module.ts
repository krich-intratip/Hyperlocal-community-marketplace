import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DashboardController } from './dashboard.controller'
import { DashboardService } from './dashboard.service'
import { Booking } from '../bookings/entities/booking.entity'
import { Review } from '../reviews/entities/review.entity'
import { Provider } from '../providers/entities/provider.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Booking, Review, Provider])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
