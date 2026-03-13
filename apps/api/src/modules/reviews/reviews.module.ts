import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ReviewsController } from './reviews.controller'
import { ReviewsService } from './reviews.service'
import { Review } from './entities/review.entity'
import { Booking } from '../bookings/entities/booking.entity'
import { Listing } from '../listings/entities/listing.entity'
import { Provider } from '../providers/entities/provider.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Review, Booking, Listing, Provider])],
  controllers: [ReviewsController],
  providers: [ReviewsService],
  exports: [ReviewsService],
})
export class ReviewsModule {}
