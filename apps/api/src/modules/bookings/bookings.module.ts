import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { BookingsController } from './bookings.controller'
import { BookingsService } from './bookings.service'
import { Booking } from './entities/booking.entity'
import { Listing } from '../listings/entities/listing.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Booking, Listing])],
  controllers: [BookingsController],
  providers: [BookingsService],
  exports: [BookingsService],
})
export class BookingsModule {}
