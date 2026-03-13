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
import { Provider } from '../providers/entities/provider.entity'
import { User } from '../users/entities/user.entity'

// ── PDPA helper ───────────────────────────────────────────────────────────────

/**
 * Extracts the first name from a full display name for PDPA-safe public display.
 * "สมใจ รักดี" → "สมใจ" (only first name shown, last name omitted)
 */
function extractFirstName(displayName: string): string {
  return displayName.split(' ')[0] ?? displayName
}

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepo: Repository<Review>,

    @InjectRepository(Booking)
    private readonly bookingRepo: Repository<Booking>,

    @InjectRepository(Listing)
    private readonly listingRepo: Repository<Listing>,

    @InjectRepository(Provider)
    private readonly providerRepo: Repository<Provider>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
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

    // 5. Snapshot listing title + reviewer first name (best-effort — nullable)
    const [listing, reviewer] = await Promise.all([
      this.listingRepo.findOne({ where: { id: booking.listingId } }),
      this.userRepo.findOne({ where: { id: reviewerId } }),
    ])

    const review = this.reviewRepo.create({
      reviewerId,
      bookingId: data.bookingId,
      providerId: booking.providerId,   // derived server-side — never from client
      listingId: booking.listingId,
      listingTitle: listing?.title ?? null,
      reviewerName: reviewer ? extractFirstName(reviewer.displayName) : null,
      rating: data.rating,
      comment: data.comment,
      isVisible: true,
      approvedAt: null,
    })
    return this.reviewRepo.save(review)
  }

  /**
   * Returns all reviews for a provider — for PROVIDER DASHBOARD (no PDPA masking).
   * Shows both visible and hidden reviews so provider can manage them.
   */
  async findByProvider(providerId: string) {
    return this.reviewRepo.find({ where: { providerId }, order: { createdAt: 'DESC' } })
  }

  /**
   * Returns only VISIBLE reviews for public display — with PDPA reviewer masking.
   * Used by public provider profile page.
   */
  async findByProviderPublic(providerId: string): Promise<(Omit<Review, 'reviewerId'> & { reviewerMasked: string })[]> {
    const reviews = await this.reviewRepo.find({
      where: { providerId, isVisible: true },
      order: { createdAt: 'DESC' },
    })
    return reviews.map(r => {
      const { reviewerId, ...rest } = r
      // Show first name only; fall back to "ลูกค้า" for old rows without snapshot
      return { ...rest, reviewerMasked: r.reviewerName ?? 'ลูกค้า' }
    })
  }

  async findByBooking(bookingId: string) {
    return this.reviewRepo.findOne({ where: { bookingId } })
  }

  /**
   * Provider stats — includes transparencyScore (visible / total × 100).
   * Uses only visible reviews for averageRating (public-facing stats).
   */
  async getProviderStats(providerId: string) {
    const [allResult, visibleResult] = await Promise.all([
      this.reviewRepo
        .createQueryBuilder('r')
        .select('COUNT(r.id)', 'totalReviews')
        .where('r.provider_id = :providerId', { providerId })
        .getRawOne(),
      this.reviewRepo
        .createQueryBuilder('r')
        .select('AVG(r.rating)', 'averageRating')
        .addSelect('COUNT(r.id)', 'visibleReviews')
        .where('r.provider_id = :providerId', { providerId })
        .andWhere('r.is_visible = :v', { v: true })
        .getRawOne(),
    ])

    const totalReviews  = parseInt(allResult.totalReviews)   || 0
    const visibleReviews = parseInt(visibleResult.visibleReviews) || 0
    const averageRating  = parseFloat(visibleResult.averageRating) || 0
    const transparencyScore = totalReviews > 0
      ? Math.round((visibleReviews / totalReviews) * 100)
      : 100   // 100% if no reviews yet

    return { averageRating, totalReviews, visibleReviews, transparencyScore }
  }

  async addReply(id: string, userId: string, replyText: string) {
    const review = await this.reviewRepo.findOne({ where: { id } })
    if (!review) throw new NotFoundException('Review not found')

    // Resolve provider profile by userId
    const provider = await this.providerRepo.findOne({ where: { userId } })
    if (!provider || review.providerId !== provider.id)
      throw new ForbiddenException('Only the reviewed provider can reply to this review')

    await this.reviewRepo.update(id, { providerReply: replyText })
    return { success: true }
  }

  /** RV-2: Provider toggles visibility of a specific review */
  async setVisibility(id: string, userId: string, isVisible: boolean) {
    const review = await this.reviewRepo.findOne({ where: { id } })
    if (!review) throw new NotFoundException('Review not found')

    // Resolve provider profile by userId
    const provider = await this.providerRepo.findOne({ where: { userId } })
    if (!provider || review.providerId !== provider.id)
      throw new ForbiddenException('Only the reviewed provider can manage review visibility')

    const approvedAt = isVisible ? new Date() : null
    await this.reviewRepo.update(id, { isVisible, approvedAt })
    return { success: true, isVisible }
  }

  async flag(id: string) {
    const review = await this.reviewRepo.findOne({ where: { id } })
    if (!review) throw new NotFoundException('Review not found')
    await this.reviewRepo.update(id, { isFlagged: true })
    return { success: true }
  }
}
