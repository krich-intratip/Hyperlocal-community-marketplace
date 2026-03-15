import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm'

export type CouponType = 'PERCENT' | 'FIXED' | 'FREE_DELIVERY'
export type CouponScope = 'PLATFORM' | 'PROVIDER' // platform-wide or provider-specific

@Entity('coupons')
export class Coupon {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Index({ unique: true })
  @Column({ length: 50 })
  code: string // e.g. "SUMMER20", "NEWUSER50"

  @Column({ nullable: true })
  description: string | null

  @Column({ length: 20, default: 'PERCENT' })
  type: CouponType // PERCENT=% off, FIXED=฿ off, FREE_DELIVERY=free delivery

  @Column({ name: 'discount_value', type: 'real' })
  discountValue: number // % for PERCENT (e.g. 20 = 20%), ฿ for FIXED

  @Column({ name: 'min_order_amount', type: 'real', default: 0 })
  minOrderAmount: number // minimum order total to use coupon

  @Column({ name: 'max_discount_amount', type: 'real', nullable: true })
  maxDiscountAmount: number | null // cap for PERCENT type (e.g. max ฿100 off)

  @Column({ length: 20, default: 'PLATFORM' })
  scope: CouponScope

  @Column({ name: 'provider_id', nullable: true })
  providerId: string | null // if scope=PROVIDER, which provider

  @Column({ name: 'created_by_user_id' })
  createdByUserId: string

  @Column({ name: 'max_uses', type: 'integer', nullable: true })
  maxUses: number | null // null = unlimited

  @Column({ name: 'max_uses_per_user', type: 'integer', default: 1 })
  maxUsesPerUser: number

  @Column({ name: 'used_count', type: 'integer', default: 0 })
  usedCount: number

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean

  @Column({ name: 'starts_at', nullable: true })
  startsAt: Date | null

  @Column({ name: 'expires_at', nullable: true })
  expiresAt: Date | null

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
