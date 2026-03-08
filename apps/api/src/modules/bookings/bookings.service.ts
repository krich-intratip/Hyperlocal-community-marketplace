import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Booking } from './entities/booking.entity'
import { BookingStatus } from '@chm/shared-types'

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepo: Repository<Booking>,
  ) {}

  async create(customerId: string, data: {
    listingId: string
    providerId: string
    communityId: string
    scheduledAt: string
    totalAmount: number
    commissionRate: number
    revenueShareRate: number
    note?: string
  }) {
    const commissionAmount = (data.totalAmount * data.commissionRate) / 100
    const revenueShareAmount = (commissionAmount * data.revenueShareRate) / 100

    const booking = this.bookingRepo.create({
      customerId,
      listingId: data.listingId,
      providerId: data.providerId,
      communityId: data.communityId,
      scheduledAt: new Date(data.scheduledAt),
      note: data.note,
      totalAmount: data.totalAmount,
      commissionAmount,
      revenueShareAmount,
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

    const allowedTransitions: Record<string, BookingStatus[]> = {
      [BookingStatus.PENDING]: [BookingStatus.ACCEPTED, BookingStatus.REJECTED, BookingStatus.CANCELLED],
      [BookingStatus.ACCEPTED]: [BookingStatus.COMPLETED, BookingStatus.CANCELLED],
    }

    const allowed = allowedTransitions[booking.status] ?? []
    if (!allowed.includes(status)) {
      throw new ForbiddenException(`Cannot transition from ${booking.status} to ${status}`)
    }
    if (status === BookingStatus.CANCELLED && !isCustomer && !isProvider) {
      throw new ForbiddenException('Only customer or provider can cancel')
    }

    await this.bookingRepo.update(id, { status })
    return this.findById(id)
  }
}
