import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Booking } from './entities/booking.entity'
import { Listing } from '../listings/entities/listing.entity'
import { BookingStatus, ListingStatus } from '@chm/shared-types'

/** Default platform rates — override via commission module in future */
const DEFAULT_COMMISSION_RATE = 10   // 10%
const DEFAULT_REVENUE_SHARE_RATE = 40 // 40% of commission to community admin

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepo: Repository<Booking>,
    @InjectRepository(Listing)
    private readonly listingRepo: Repository<Listing>,
  ) {}

  async create(customerId: string, data: {
    listingId: string
    providerId: string
    communityId: string
    scheduledAt: string
    note?: string
  }) {
    // Fetch listing from DB — never trust client-supplied price
    const listing = await this.listingRepo.findOne({
      where: { id: data.listingId, status: ListingStatus.ACTIVE },
    })
    if (!listing) throw new NotFoundException('Listing not found or inactive')
    if (listing.providerId !== data.providerId) {
      throw new BadRequestException('Provider does not own this listing')
    }

    const quotedAmount = Number(listing.price)
    const commissionRate = DEFAULT_COMMISSION_RATE
    const revenueShareRate = DEFAULT_REVENUE_SHARE_RATE
    const totalCommission = (quotedAmount * commissionRate) / 100
    const communityAdminShare = (totalCommission * revenueShareRate) / 100
    const platformFee = totalCommission - communityAdminShare
    const providerPayout = quotedAmount - totalCommission

    const booking = this.bookingRepo.create({
      customerId,
      listingId: data.listingId,
      providerId: data.providerId,
      communityId: data.communityId,
      scheduledAt: new Date(data.scheduledAt),
      note: data.note ?? null,
      quotedAmount,
      finalAmount: quotedAmount,
      discountedTotal: quotedAmount,
      commissionRate,
      revenueShareRate,
      platformFee,
      communityAdminShare,
      providerPayout,
    })
    return this.bookingRepo.save(booking)
  }

  async findById(id: string) {
    const booking = await this.bookingRepo.findOne({ where: { id } })
    if (!booking) throw new NotFoundException('Booking not found')
    return booking
  }

  getByCustomer(customerId: string) {
    return this.bookingRepo.find({ where: { customerId }, order: { createdAt: 'DESC' } })
  }

  getByProvider(providerId: string) {
    return this.bookingRepo.find({ where: { providerId }, order: { createdAt: 'DESC' } })
  }

  async updateStatus(id: string, actorId: string, status: BookingStatus) {
    const booking = await this.findById(id)
    const isCustomer = booking.customerId === actorId
    const isProvider = booking.providerId === actorId

    const allowedTransitions: Partial<Record<BookingStatus, BookingStatus[]>> = {
      [BookingStatus.PENDING_PAYMENT]: [BookingStatus.PAYMENT_HELD, BookingStatus.CANCELLED_BY_CUSTOMER],
      [BookingStatus.PAYMENT_HELD]: [BookingStatus.CONFIRMED, BookingStatus.CANCELLED_BY_PROVIDER],
      [BookingStatus.CONFIRMED]: [BookingStatus.IN_PROGRESS, BookingStatus.CANCELLED_BY_PROVIDER, BookingStatus.CANCELLED_BY_CUSTOMER],
      [BookingStatus.IN_PROGRESS]: [BookingStatus.PENDING_CONFIRMATION, BookingStatus.PRICE_ADJUSTMENT_REQUESTED],
      [BookingStatus.PENDING_CONFIRMATION]: [BookingStatus.COMPLETED, BookingStatus.DISPUTED],
    }

    const allowed = allowedTransitions[booking.status as BookingStatus] ?? []
    if (!allowed.includes(status)) {
      throw new ForbiddenException(`Cannot transition from ${booking.status} to ${status}`)
    }
    if (
      (status === BookingStatus.CANCELLED_BY_CUSTOMER && !isCustomer) ||
      (status === BookingStatus.CANCELLED_BY_PROVIDER && !isProvider)
    ) {
      throw new ForbiddenException('Not authorised to perform this cancellation')
    }

    await this.bookingRepo.update(id, { status })
    return this.findById(id)
  }
}
