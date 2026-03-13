import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ListingStatus, NotificationType } from '@chm/shared-types'
import { Order } from './entities/order.entity'
import { OrderItem } from './entities/order-item.entity'
import { Listing } from '../listings/entities/listing.entity'
import { Provider } from '../providers/entities/provider.entity'
import { CreateOrderDto } from './dto/create-order.dto'
import { UpdateOrderStatusDto, OrderStatus } from './dto/update-order-status.dto'
import { NotificationsService } from '../notifications/notifications.service'

/** Short order reference (last 8 chars of UUID, uppercased) */
function shortRef(id: string): string {
  return id.slice(-8).toUpperCase()
}

/** Maps an OrderStatus transition to a customer notification */
const ORDER_NOTIF_MAP: Partial<Record<OrderStatus, {
  type: NotificationType
  title: string
  body: (order: Order) => string
}>> = {
  [OrderStatus.CONFIRMED]: {
    type: NotificationType.BOOKING_CONFIRMED,
    title: 'ออเดอร์ได้รับการยืนยัน ✅',
    body: (o) => `ออเดอร์ #${shortRef(o.id)} ของคุณได้รับการยืนยันจากผู้ให้บริการแล้ว`,
  },
  [OrderStatus.IN_PROGRESS]: {
    type: NotificationType.BOOKING_IN_PROGRESS,
    title: 'ผู้ให้บริการกำลังดำเนินงาน 🔧',
    body: (o) => `ออเดอร์ #${shortRef(o.id)} อยู่ระหว่างดำเนินการ`,
  },
  [OrderStatus.PENDING_CONFIRMATION]: {
    type: NotificationType.BOOKING_COMPLETED_BY_PROVIDER,
    title: 'กรุณายืนยันการรับบริการ ⏰',
    body: (o) => `ผู้ให้บริการแจ้งว่าออเดอร์ #${shortRef(o.id)} เสร็จแล้ว กรุณายืนยันภายใน 72 ชั่วโมง`,
  },
  [OrderStatus.COMPLETED]: {
    type: NotificationType.BOOKING_COMPLETED,
    title: 'บริการเสร็จสมบูรณ์ 🎉',
    body: (o) => `ออเดอร์ #${shortRef(o.id)} เสร็จสมบูรณ์ ขอบคุณที่ใช้บริการ!`,
  },
  [OrderStatus.CANCELLED_BY_PROVIDER]: {
    type: NotificationType.BOOKING_CANCELLED,
    title: 'ออเดอร์ถูกยกเลิก ❌',
    body: (o) => `น่าเสียดาย — ออเดอร์ #${shortRef(o.id)} ถูกยกเลิกโดยผู้ให้บริการ`,
  },
  [OrderStatus.CANCELLED_BY_CUSTOMER]: {
    type: NotificationType.BOOKING_CANCELLED,
    title: 'ออเดอร์ถูกยกเลิก',
    body: (o) => `ออเดอร์ #${shortRef(o.id)} ถูกยกเลิกแล้ว`,
  },
}

/** Role-based status transition rules */
const ALLOWED_TRANSITIONS: Record<string, Record<string, OrderStatus[]>> = {
  customer: {
    [OrderStatus.PENDING_PAYMENT]:       [OrderStatus.CANCELLED_BY_CUSTOMER],
    [OrderStatus.PAYMENT_HELD]:          [OrderStatus.PAYMENT_HELD, OrderStatus.CANCELLED_BY_CUSTOMER],
  },
  provider: {
    [OrderStatus.PAYMENT_HELD]:          [OrderStatus.CONFIRMED, OrderStatus.CANCELLED_BY_PROVIDER],
    [OrderStatus.CONFIRMED]:             [OrderStatus.IN_PROGRESS, OrderStatus.CANCELLED_BY_PROVIDER],
    [OrderStatus.IN_PROGRESS]:           [OrderStatus.PENDING_CONFIRMATION, OrderStatus.COMPLETED, OrderStatus.CANCELLED_BY_PROVIDER],
    [OrderStatus.PENDING_CONFIRMATION]:  [OrderStatus.COMPLETED, OrderStatus.CANCELLED_BY_PROVIDER],
  },
}

const TERMINAL_STATUSES = new Set([
  OrderStatus.COMPLETED,
  OrderStatus.CANCELLED_BY_CUSTOMER,
  OrderStatus.CANCELLED_BY_PROVIDER,
])

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,

    @InjectRepository(OrderItem)
    private readonly orderItemRepo: Repository<OrderItem>,

    @InjectRepository(Listing)
    private readonly listingRepo: Repository<Listing>,

    @InjectRepository(Provider)
    private readonly providerRepo: Repository<Provider>,

    private readonly notificationsService: NotificationsService,
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

    // 4. Generate tracking ID for courier deliveries (server-side — not from client)
    const deliveryMethod = dto.deliveryMethod ?? 'self_pickup'
    let trackingId: string | null = null
    if (deliveryMethod === 'lineman') {
      trackingId = `LM-${String(Math.floor(Math.random() * 1_000_000)).padStart(6, '0')}`
    } else if (deliveryMethod === 'grab_express') {
      trackingId = `GX-${String(Math.floor(Math.random() * 1_000_000)).padStart(6, '0')}`
    }

    // 5. Persist
    const order = this.orderRepo.create({
      customerId,
      providerId: dto.providerId,
      communityId: dto.communityId,
      status: 'PENDING_PAYMENT',
      subtotal,
      platformFee,
      total,
      deliveryAddress: dto.deliveryAddress ?? null,
      deliveryMethod,
      trackingId,
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

  // ── BE-1: Delivery info ──────────────────────────────────────────────────────

  /**
   * Returns delivery metadata for a given order.
   * Accessible by customer (owns order) or provider (fulfils order) or admin/superadmin.
   */
  async getDelivery(id: string, userId: string, role: string): Promise<{
    orderId: string
    deliveryMethod: string
    trackingId: string | null
    carrier: 'lineman' | 'grab_express' | 'self_pickup'
    status: string
  }> {
    const order = await this.orderRepo.findOne({ where: { id } })
    if (!order) throw new NotFoundException(`Order ${id} not found`)

    const isAdmin = role === 'admin' || role === 'superadmin'
    if (!isAdmin && order.customerId !== userId) {
      // Check if caller is the provider
      const provider = await this.providerRepo.findOne({ where: { userId } })
      if (!provider || order.providerId !== provider.id) {
        throw new ForbiddenException('Access denied')
      }
    }

    const deliveryMethod = (order.deliveryMethod ?? 'self_pickup') as 'lineman' | 'grab_express' | 'self_pickup'
    return {
      orderId: order.id,
      deliveryMethod,
      trackingId: order.trackingId,
      carrier: deliveryMethod,
      status: order.status,
    }
  }

  // ── BE-2: Status transitions ─────────────────────────────────────────────────

  /**
   * Update order status with role-based transition guards.
   * SuperAdmin can set any status. Provider and customer are restricted to valid transitions.
   */
  async updateStatus(
    id: string,
    userId: string,
    role: string,
    dto: UpdateOrderStatusDto,
  ): Promise<Order> {
    const order = await this.orderRepo.findOne({ where: { id } })
    if (!order) throw new NotFoundException(`Order ${id} not found`)

    if (TERMINAL_STATUSES.has(order.status as OrderStatus)) {
      throw new BadRequestException(`Order is already in terminal status: ${order.status}`)
    }

    const currentStatus = order.status as OrderStatus
    const nextStatus = dto.status

    if (role === 'superadmin') {
      // SuperAdmin can force any status
    } else if (role === 'provider') {
      const provider = await this.providerRepo.findOne({ where: { userId } })
      if (!provider || order.providerId !== provider.id) {
        throw new ForbiddenException('Not the fulfilling provider of this order')
      }
      const allowed = ALLOWED_TRANSITIONS.provider[currentStatus] ?? []
      if (!allowed.includes(nextStatus)) {
        throw new BadRequestException(
          `Provider cannot transition order from ${currentStatus} to ${nextStatus}`,
        )
      }
    } else if (role === 'customer') {
      if (order.customerId !== userId) {
        throw new ForbiddenException('Not your order')
      }
      const allowed = ALLOWED_TRANSITIONS.customer[currentStatus] ?? []
      if (!allowed.includes(nextStatus)) {
        throw new BadRequestException(
          `Cannot transition order from ${currentStatus} to ${nextStatus}`,
        )
      }
    } else {
      throw new ForbiddenException('Insufficient role to update order status')
    }

    await this.orderRepo.update(id, { status: nextStatus })
    const updatedOrder = await this.orderRepo.findOne({ where: { id } }) as Order

    // NF-1: fire notification to customer on relevant status changes
    const notifDef = ORDER_NOTIF_MAP[nextStatus]
    if (notifDef) {
      this.notificationsService
        .send(
          updatedOrder.customerId,
          notifDef.type,
          notifDef.title,
          notifDef.body(updatedOrder),
          { href: `/orders/${updatedOrder.id}`, data: { orderId: updatedOrder.id } },
        )
        .catch(() => { /* never throw — notification failure must not fail the request */ })
    }

    return updatedOrder
  }

  // ── BE-3: Provider incoming orders ──────────────────────────────────────────

  /**
   * Returns all orders assigned to the authenticated provider, newest first.
   * Derives providerId from the user's Provider profile.
   */
  async findProviderOrders(userId: string): Promise<Order[]> {
    const provider = await this.providerRepo.findOne({ where: { userId } })
    if (!provider) {
      throw new NotFoundException('Provider profile not found. Apply to a community first.')
    }
    return this.orderRepo.find({
      where: { providerId: provider.id },
      order: { createdAt: 'DESC' },
    })
  }
}
