import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm'

@Entity('coupon_usages')
@Index(['couponId', 'userId'])
export class CouponUsage {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'coupon_id' })
  couponId: string

  @Column({ name: 'user_id' })
  userId: string

  @Column({ name: 'order_id' })
  orderId: string

  @Column({ name: 'discount_applied', type: 'real' })
  discountApplied: number // actual ฿ discount given

  @CreateDateColumn({ name: 'used_at' })
  usedAt: Date
}
