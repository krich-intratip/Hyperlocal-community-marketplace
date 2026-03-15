import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Coupon } from './entities/coupon.entity'
import { CouponUsage } from './entities/coupon-usage.entity'
import { CreateCouponDto } from './dto/create-coupon.dto'
import { ValidateCouponDto } from './dto/validate-coupon.dto'

export interface CouponValidationResult {
  valid: boolean
  coupon?: Coupon
  discountAmount: number
  message: string
}

@Injectable()
export class CouponService {
  constructor(
    @InjectRepository(Coupon)
    private readonly couponRepo: Repository<Coupon>,
    @InjectRepository(CouponUsage)
    private readonly usageRepo: Repository<CouponUsage>,
  ) {}

  async create(userId: string, dto: CreateCouponDto): Promise<Coupon> {
    const existing = await this.couponRepo.findOne({
      where: { code: dto.code.toUpperCase() },
    })
    if (existing) throw new BadRequestException(`โค้ด "${dto.code}" มีอยู่แล้ว`)

    return this.couponRepo.save(
      this.couponRepo.create({
        code: dto.code.toUpperCase(),
        description: dto.description ?? null,
        type: dto.type,
        discountValue: dto.discountValue,
        minOrderAmount: dto.minOrderAmount ?? 0,
        maxDiscountAmount: dto.maxDiscountAmount ?? null,
        scope: dto.scope ?? 'PLATFORM',
        providerId: dto.providerId ?? null,
        createdByUserId: userId,
        maxUses: dto.maxUses ?? null,
        maxUsesPerUser: dto.maxUsesPerUser ?? 1,
        isActive: true,
        startsAt: dto.startsAt ? new Date(dto.startsAt) : null,
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
      }),
    )
  }

  async findAll(): Promise<Coupon[]> {
    return this.couponRepo.find({ order: { createdAt: 'DESC' } })
  }

  async findOne(id: string): Promise<Coupon> {
    const coupon = await this.couponRepo.findOne({ where: { id } })
    if (!coupon) throw new NotFoundException('ไม่พบคูปอง')
    return coupon
  }

  async deactivate(id: string): Promise<Coupon> {
    const coupon = await this.findOne(id)
    coupon.isActive = false
    return this.couponRepo.save(coupon)
  }

  async activate(id: string): Promise<Coupon> {
    const coupon = await this.findOne(id)
    coupon.isActive = true
    return this.couponRepo.save(coupon)
  }

  /** Validate coupon — does NOT use it, just checks and returns discount */
  async validate(userId: string, dto: ValidateCouponDto): Promise<CouponValidationResult> {
    const coupon = await this.couponRepo.findOne({
      where: { code: dto.code.toUpperCase(), isActive: true },
    })
    if (!coupon)
      return { valid: false, discountAmount: 0, message: 'ไม่พบคูปองหรือคูปองหมดอายุ' }

    const now = new Date()
    if (coupon.startsAt && coupon.startsAt > now)
      return { valid: false, discountAmount: 0, message: 'คูปองยังไม่เริ่มต้น' }
    if (coupon.expiresAt && coupon.expiresAt < now)
      return { valid: false, discountAmount: 0, message: 'คูปองหมดอายุแล้ว' }
    if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses)
      return { valid: false, discountAmount: 0, message: 'คูปองถูกใช้ครบจำนวนแล้ว' }
    if (dto.orderTotal < coupon.minOrderAmount)
      return {
        valid: false,
        discountAmount: 0,
        message: `ยอดสั่งซื้อขั้นต่ำ ฿${coupon.minOrderAmount.toLocaleString()}`,
      }
    if (
      coupon.scope === 'PROVIDER' &&
      coupon.providerId &&
      dto.providerId !== coupon.providerId
    )
      return { valid: false, discountAmount: 0, message: 'คูปองใช้ได้เฉพาะร้านที่กำหนด' }

    // Check per-user usage
    const userUsageCount = await this.usageRepo.count({
      where: { couponId: coupon.id, userId },
    })
    if (userUsageCount >= coupon.maxUsesPerUser)
      return {
        valid: false,
        discountAmount: 0,
        message: `คูปองนี้ใช้ได้สูงสุด ${coupon.maxUsesPerUser} ครั้งต่อผู้ใช้`,
      }

    const discountAmount = this.calcDiscount(coupon, dto.orderTotal)
    return {
      valid: true,
      coupon,
      discountAmount,
      message: `ลด ${this.discountLabel(coupon)}`,
    }
  }

  private calcDiscount(coupon: Coupon, orderTotal: number): number {
    if (coupon.type === 'FREE_DELIVERY') return 0 // handled separately
    if (coupon.type === 'FIXED') return Math.min(coupon.discountValue, orderTotal)
    // PERCENT
    const discount = (coupon.discountValue / 100) * orderTotal
    return coupon.maxDiscountAmount !== null
      ? Math.min(discount, coupon.maxDiscountAmount)
      : discount
  }

  private discountLabel(coupon: Coupon): string {
    if (coupon.type === 'PERCENT')
      return `${coupon.discountValue}%${coupon.maxDiscountAmount ? ` (สูงสุด ฿${coupon.maxDiscountAmount})` : ''}`
    if (coupon.type === 'FIXED') return `฿${coupon.discountValue}`
    return 'ฟรีค่าส่ง'
  }

  /** Apply coupon — called from OrdersService when creating order */
  async applyCoupon(
    userId: string,
    code: string,
    orderTotal: number,
    orderId: string,
    providerId?: string,
  ): Promise<number> {
    const result = await this.validate(userId, { code, orderTotal, providerId })
    if (!result.valid || !result.coupon) throw new BadRequestException(result.message)

    // Record usage
    await this.usageRepo.save(
      this.usageRepo.create({
        couponId: result.coupon.id,
        userId,
        orderId,
        discountApplied: result.discountAmount,
      }),
    )

    // Increment used count
    result.coupon.usedCount += 1
    await this.couponRepo.save(result.coupon)

    return result.discountAmount
  }
}
