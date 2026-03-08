import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, Index, Unique,
} from 'typeorm'

/**
 * CouponUsage — tracks each time a coupon/promotion is redeemed.
 *
 * Used for:
 *   - Enforcing usageLimit and usageLimitPerCustomer on Promotion
 *   - Audit trail of discount usage
 *   - Revenue impact reporting
 */
@Entity('coupon_usages')
@Unique(['promotionId', 'bookingId'])          // 1 booking can only use 1 coupon once
@Index(['promotionId'])
@Index(['customerId'])
export class CouponUsage {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'promotion_id' })
  promotionId: string

  @Column({ name: 'booking_id' })
  bookingId: string

  @Column({ name: 'customer_id' })
  customerId: string

  /** ยอดส่วนลดจริงที่ได้รับ (คำนวณ ณ เวลา checkout) */
  @Column({ name: 'discount_applied', type: 'decimal', precision: 10, scale: 2 })
  discountApplied: number

  /** ยอดก่อนส่วนลด */
  @Column({ name: 'original_amount', type: 'decimal', precision: 10, scale: 2 })
  originalAmount: number

  /** ยอดหลังส่วนลด (ยอดที่เก็บจากลูกค้าจริง) */
  @Column({ name: 'discounted_amount', type: 'decimal', precision: 10, scale: 2 })
  discountedAmount: number

  @CreateDateColumn({ name: 'used_at' })
  usedAt: Date
}
