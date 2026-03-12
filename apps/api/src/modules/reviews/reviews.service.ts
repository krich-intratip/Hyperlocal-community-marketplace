import {
  Injectable,
  ConflictException,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { BookingStatus } from '@chm/shared-types'
import { Review } from './entities/review.entity'
import { Booking } from '../bookings/entities/booking.entity'
import { Listing } from '../listings/entities/listing.entity'

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepo: Repository<Review>,
    @InjectRepository(Booking)
    private readonly bookingRepo: Repository<Booking>,
    @InjectRepository(Listing)
    private readonly listingRepo: Repository<Listing>,
  ) {}

  async create(
    reviewerId: string,
    data: { bookingId: string; rating: number; comment?: string },
  ) {
    // 1. Prevent duplicate review per booking
    const existing = await this.reviewRepo.findOne({ where: { bookingId: data.bookingId } })
    if (existing) throw new ConflictException('Review already exists for this booking')

    // 2. Validate booking exists
    const booking = await this.bookingRepo.findOne({ where: { id: data.bookingId } })
    if (!booking) throw new NotFoundException('Booking not found')

    // 3. Only the customer of this booking may review it
    if (booking.customerId !== reviewerId)
      throw new ForbiddenException('Only the booking customer can submit a review')

    // 4. Booking must be COMPLETED
    if (booking.status !== BookingStatus.COMPLETED)
      throw new BadRequestException('Can only review completed bookings')

    // 5. Snapshot listing title (best-effort — nullable)
    const listing = await this.listingRepo.findOne({ where: { id: booking.listingId } })

    const review = this.reviewRepo.create({
      reviewerId,
      bookingId: data.bookingId,
      providerId: booking.providerId,   // derived server-side — never from client
      listingId: booking.listingId,
      listingTitle: listing?.title ?? null,
      rating: data.rating,
      comment: data.comment,
    })
    return this.reviewRepo.save(review)
  }

  async findByProvider(providerId: string) {
    return this.reviewRepo.find({ where: { providerId }, order: { createdAt: 'DESC' } })
  }

  async findByBooking(bookingId: string) {
    return this.reviewRepo.findOne({ where: { bookingId } })
  }

  async getProviderStats(providerId: string) {
    const result = await this.reviewRepo
      .createQueryBuilder('r')
      .select('AVG(r.rating)', 'averageRating')
      .addSelect('COUNT(r.id)', 'totalReviews')
      .where('r.provider_id = :providerId', { providerId })
      .getRawOne()
    return {
      averageRating: parseFloat(result.averageRating) || 0,
      totalReviews: parseInt(result.totalReviews) || 0,
    }
  }

  async addReply(id: string, providerId: string, replyText: string) {
    const review = await this.reviewRepo.findOne({ where: { id } })
    if (!review) throw new NotFoundException('Review not found')
    if (review.providerId !== providerId)
      throw new ForbiddenException('Only the reviewed provider can reply to this review')
    await this.reviewRepo.update(id, { providerReply: replyText })
    return { success: true }
  }

  async flag(id: string) {
    const review = await this.reviewRepo.findOne({ where: { id } })
    if (!review) throw new NotFoundException('Review not found')
    await this.reviewRepo.update(id, { isFlagged: true })
    return { success: true }
  }
}
