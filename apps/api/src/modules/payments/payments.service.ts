import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, LessThan } from 'typeorm'
import { Cron } from '@nestjs/schedule'
import { NotificationType } from '@chm/shared-types'
import { Payment } from './entities/payment.entity'
import { Order } from '../orders/entities/order.entity'
import { NotificationsService } from '../notifications/notifications.service'
import { InitiatePaymentDto } from './dto/initiate-payment.dto'

const PAYMENT_TTL_MS = 15 * 60 * 1000 // 15 minutes

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment) private readonly paymentRepo: Repository<Payment>,
    @InjectRepository(Order)   private readonly orderRepo: Repository<Order>,
    private readonly notificationsService: NotificationsService,
  ) {}

  async initiate(customerId: string, dto: InitiatePaymentDto): Promise<Payment> {
    const order = await this.orderRepo.findOne({ where: { id: dto.orderId } })
    if (!order) throw new NotFoundException('ไม่พบคำสั่งซื้อ')
    if (order.customerId !== customerId) throw new ForbiddenException('ไม่มีสิทธิ์เข้าถึง')
    if (order.status !== 'PENDING_PAYMENT') {
      throw new BadRequestException('คำสั่งซื้อนี้ไม่อยู่ในสถานะรอชำระเงิน')
    }

    // Idempotent — return existing PENDING if not expired
    const existing = await this.paymentRepo.findOne({
      where: { orderId: dto.orderId, status: 'PENDING' },
      order: { createdAt: 'DESC' },
    })
    if (existing && existing.expiresAt > new Date()) {
      return existing
    }

    // Cancel any lingering PENDING payments (expired but not yet swept)
    await this.paymentRepo.update(
      { orderId: dto.orderId, status: 'PENDING' },
      { status: 'CANCELLED' },
    )

    // COD: immediately mark paid + advance order
    if (dto.method === 'cod') {
      const payment = this.paymentRepo.create({
        orderId: dto.orderId,
        amount: order.total,
        method: 'cod',
        status: 'PAID',
        qrData: null,
        paidAt: new Date(),
        expiresAt: new Date(),
      })
      await this.paymentRepo.save(payment)
      await this.orderRepo.update(dto.orderId, { status: 'PAYMENT_HELD' })
      this.notificationsService.send(
        customerId,
        NotificationType.BOOKING_PAYMENT_HELD,
        'ชำระเงินสำเร็จ ✅',
        `ออเดอร์ #${dto.orderId.slice(-8).toUpperCase()} ชำระเงินเรียบร้อยแล้ว รอผู้ให้บริการยืนยัน`,
        { href: `/orders/${dto.orderId}`, data: { orderId: dto.orderId } },
      ).catch(() => {})
      return payment
    }

    // PromptPay / Card — generate mock payload
    const qrData = dto.method === 'promptpay'
      ? this.buildMockPromptPayQR(order.total)
      : null

    const payment = this.paymentRepo.create({
      orderId: dto.orderId,
      amount: order.total,
      method: dto.method,
      status: 'PENDING',
      qrData,
      paidAt: null,
      expiresAt: new Date(Date.now() + PAYMENT_TTL_MS),
    })
    return this.paymentRepo.save(payment)
  }

  async getByOrder(orderId: string, customerId: string): Promise<Payment | null> {
    const order = await this.orderRepo.findOne({ where: { id: orderId } })
    if (!order) throw new NotFoundException('ไม่พบคำสั่งซื้อ')
    if (order.customerId !== customerId) throw new ForbiddenException('ไม่มีสิทธิ์เข้าถึง')
    return this.paymentRepo.findOne({
      where: { orderId },
      order: { createdAt: 'DESC' },
    })
  }

  async simulatePay(paymentId: string, customerId: string): Promise<Payment> {
    const payment = await this.paymentRepo.findOne({ where: { id: paymentId } })
    if (!payment) throw new NotFoundException('ไม่พบข้อมูลการชำระเงิน')

    const order = await this.orderRepo.findOne({ where: { id: payment.orderId } })
    if (!order) throw new NotFoundException('ไม่พบคำสั่งซื้อ')
    if (order.customerId !== customerId) throw new ForbiddenException('ไม่มีสิทธิ์เข้าถึง')
    if (payment.status !== 'PENDING') {
      throw new BadRequestException(`ไม่สามารถชำระเงินได้ — สถานะปัจจุบัน: ${payment.status}`)
    }
    if (payment.expiresAt < new Date()) {
      await this.paymentRepo.update(paymentId, { status: 'EXPIRED' })
      throw new BadRequestException('QR Code หมดอายุแล้ว กรุณาสร้างใหม่')
    }

    await this.paymentRepo.update(paymentId, { status: 'PAID', paidAt: new Date() })
    await this.orderRepo.update(payment.orderId, { status: 'PAYMENT_HELD' })

    this.notificationsService.send(
      customerId,
      NotificationType.BOOKING_PAYMENT_HELD,
      'ชำระเงินสำเร็จ ✅',
      `ออเดอร์ #${payment.orderId.slice(-8).toUpperCase()} ชำระเงินเรียบร้อยแล้ว รอผู้ให้บริการยืนยัน`,
      { href: `/orders/${payment.orderId}`, data: { orderId: payment.orderId } },
    ).catch(() => {})

    return this.paymentRepo.findOne({ where: { id: paymentId } }) as Promise<Payment>
  }

  /** Expire stale PENDING payments every 5 minutes */
  @Cron('*/5 * * * *')
  async expireStalePayments(): Promise<void> {
    await this.paymentRepo.update(
      { status: 'PENDING', expiresAt: LessThan(new Date()) },
      { status: 'EXPIRED' },
    )
  }

  /** Mock PromptPay EMV-like payload for dev/demo */
  private buildMockPromptPayQR(amount: number): string {
    const amountStr = amount.toFixed(2)
    return `00020101021229370016A000000677010111011300660000000000005303764540${amountStr}5802TH6304MOCK`
  }
}
