import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ListingStatus } from '@chm/shared-types'
import { Order } from './entities/order.entity'
import { OrderItem } from './entities/order-item.entity'
import { Listing } from '../listings/entities/listing.entity'
import { CreateOrderDto } from './dto/create-order.dto'

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,

    @InjectRepository(OrderItem)
    private readonly orderItemRepo: Repository<OrderItem>,

    @InjectRepository(Listing)
    private readonly listingRepo: Repository<Listing>,
  ) {}

  /**
   * Create a new Order from the customer's cart.
   * Prices are always fetched from DB — client-supplied prices are NEVER trusted.
   */
  async create(customerId: string, dto: CreateOrderDto): Promise<Order> {
    // 1. Validate each listing exists and is ACTIVE
    const listings: Listing[] = []
    for (const item of dto.items) {
      const listing = await this.listingRepo.findOne({ where: { id: item.listingId } })
      if (!listing) {
        throw new NotFoundException(`Listing ${item.listingId} not found`)
      }
      if (listing.status !== ListingStatus.ACTIVE) {
        throw new BadRequestException(`Listing ${item.listingId} is not available`)
      }
      listings.push(listing)
    }

    // 2. Verify all listings belong to the stated provider (prevent cross-provider orders)
    for (const listing of listings) {
      if (listing.providerId !== dto.providerId) {
        throw new BadRequestException(
          `Listing ${listing.id} does not belong to provider ${dto.providerId}`,
        )
      }
    }

    // 3. Calculate prices server-side (use DB prices — never trust client)
    let subtotal = 0
    const orderItems: Partial<OrderItem>[] = dto.items.map((item, idx) => {
      const listing = listings[idx]
      const unitPrice = Number(listing.price)
      const lineTotal = Math.round(unitPrice * item.qty * 100) / 100
      subtotal += lineTotal
      return {
        listingId: item.listingId,
        listingTitle: listing.title,
        unitPrice,
        qty: item.qty,
        lineTotal,
        note: item.note ?? null,
      }
    })

    subtotal = Math.round(subtotal * 100) / 100
    const platformFee = Math.round(subtotal * 0.05 * 100) / 100
    const total = Math.round((subtotal + platformFee) * 100) / 100

    // 4. Persist
    const order = this.orderRepo.create({
      customerId,
      providerId: dto.providerId,
      communityId: dto.communityId,
      status: 'PENDING_PAYMENT',
      subtotal,
      platformFee,
      total,
      deliveryAddress: dto.deliveryAddress ?? null,
      paymentMethod: dto.paymentMethod ?? 'PROMPTPAY',
      note: dto.note ?? null,
      items: orderItems as OrderItem[],
    })

    return this.orderRepo.save(order)
  }

  /** Get all orders for the authenticated customer, newest first */
  async findMyOrders(customerId: string): Promise<Order[]> {
    return this.orderRepo.find({
      where: { customerId },
      order: { createdAt: 'DESC' },
    })
  }

  /** Get a single order — validates ownership */
  async findOne(id: string, customerId: string): Promise<Order> {
    const order = await this.orderRepo.findOne({ where: { id } })
    if (!order) {
      throw new NotFoundException(`Order ${id} not found`)
    }
    if (order.customerId !== customerId) {
      throw new ForbiddenException('You do not have access to this order')
    }
    return order
  }
}
