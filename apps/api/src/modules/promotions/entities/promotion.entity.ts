import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, Index,
} from 'typeorm'
import { PromotionType, PromotionStatus, MarketplaceCategory } from '@chm/shared-types'

/**
 * Promotion / Campaign entity.
 *
 * Created by: Provider (own listings) or Community Admin (community-wide broadcast)
 * Approval:   Community Admin must approve before it goes ACTIVE
 * Broadcast:  CA can pin approved promotions as cards on the community landing page
 *
 * Commission impact:
 *   When a promotion discount is applied, commission is calculated on the
 *   POST-discount amount (discountedAmount), not the original price.
 *   This is stored per booking in Booking.discountAmount and Booking.discountedTotal.
 *
 * Coupon code:
 *   If type = COUPON_CODE, customer enters the code at checkout.
 *   The system validates against this record (usageLimit, validFrom, validTo).
 */
@Entity('promotions')
@Index(['communityId'])
@Index(['providerId'])
export class Promotion {
  @PrimaryGeneratedColumn('uuid')
  id: string

  /* ── Ownership ── */
  /** Provider who created this promotion (null if created by Community Admin) */
  @Column({ name: 'provider_id', nullable: true , type: 'text' })
  providerId: string | null

  @Column({ name: 'community_id' })
  communityId: string

  /** CA who approved (and optionally broadcast) this promotion */
  @Column({ name: 'approved_by_ca_id', nullable: true , type: 'text' })
  approvedByCaId: string | null

  /* ── Promotion details ── */
  @Column()
  title: string

  @Column({ nullable: true, type: 'text' })
  description: string | null

  @Column({ name: 'banner_image_url', nullable: true , type: 'text' })
  bannerImageUrl: string | null       // ภาพสำหรับ broadcast card

  @Column({
    name: 'promotion_type',
    type: 'simple-enum',
    enum: PromotionType,
  })
  promotionType: PromotionType

  /* ── Discount value ── */
  /**
   * For PERCENTAGE: 1–100 (เช่น 20 = ลด 20%)
   * For FIXED_AMOUNT: จำนวนเงิน (เช่น 50 = ลด ฿50)
   * For COUPON_CODE: ใช้ร่วมกับ discountValue
   * For BROADCAST: ไม่มี discount — เป็นแค่การประกาศ
   */
  @Column({ name: 'discount_value', type: 'decimal', precision: 10, scale: 2, default: 0 })
  discountValue: number

  /**
   * ส่วนลดสูงสุดในกรณี PERCENTAGE (ป้องกันส่วนลดเกินวงเงิน)
   * เช่น ลด 30% แต่ไม่เกิน ฿200
   */
  @Column({ name: 'max_discount_amount', nullable: true, type: 'decimal', precision: 10, scale: 2 })
  maxDiscountAmount: number | null

  /**
   * ยอดสั่งซื้อขั้นต่ำในการใช้โปรโมชั่น
   */
  @Column({ name: 'min_order_amount', nullable: true, type: 'decimal', precision: 10, scale: 2 })
  minOrderAmount: number | null

  /* ── Coupon code ── */
  @Column({ name: 'coupon_code', nullable: true, unique: true , type: 'text' })
  couponCode: string | null           // เช่น "SUMMER30"

  /* ── Scope ── */
  /**
   * หมวดหมู่ที่ใช้ได้ (null = ทุกหมวด)
   * JSON array of MarketplaceCategory values
   */
  @Column({ name: 'applicable_categories', nullable: true, type: 'text' })
  applicableCategories: string | null

  /**
   * listing IDs ที่ใช้ได้ (null = ทุก listing ของ provider)
   * JSON array of listing UUIDs
   */
  @Column({ name: 'applicable_listing_ids', nullable: true, type: 'text' })
  applicableListingIds: string | null

  /* ── Validity ── */
  @Column({ name: 'valid_from', type: 'datetime' })
  validFrom: Date

  @Column({ name: 'valid_to', type: 'datetime' })
  validTo: Date

  /** จำนวนครั้งสูงสุดที่ใช้ได้ทั้งหมด (null = ไม่จำกัด) */
  @Column({ name: 'usage_limit', nullable: true, type: 'int' })
  usageLimit: number | null

  /** จำนวนครั้งสูงสุดต่อลูกค้า 1 คน (null = ไม่จำกัด) */
  @Column({ name: 'usage_limit_per_customer', nullable: true, type: 'int' })
  usageLimitPerCustomer: number | null

  /** จำนวนครั้งที่ถูกใช้ไปแล้ว */
  @Column({ name: 'used_count', default: 0 })
  usedCount: number

  /* ── Status ── */
  @Column({
    name: 'promotion_status',
    type: 'simple-enum',
    enum: PromotionStatus,
    default: PromotionStatus.DRAFT,
  })
  promotionStatus: PromotionStatus

  @Column({ name: 'rejection_reason', nullable: true, type: 'text' })
  rejectionReason: string | null

  @Column({ name: 'approved_at', nullable: true, type: 'datetime' })
  approvedAt: Date | null

  /* ── Broadcast / Landing page ── */
  /**
   * เมื่อ CA เปิดให้ broadcast promotion เป็น card ใน community landing page
   */
  @Column({ name: 'is_broadcast', default: false })
  isBroadcast: boolean

  @Column({ name: 'broadcast_at', nullable: true, type: 'datetime' })
  broadcastAt: Date | null

  /** ลำดับการแสดงผลใน landing page (น้อย = แสดงก่อน) */
  @Column({ name: 'display_order', default: 0 })
  displayOrder: number

  /* ── Timestamps ── */
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
