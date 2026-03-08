import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, Index,
} from 'typeorm'
import { BookingStatus, EscrowStatus, PricingType } from '@chm/shared-types'

/**
 * Commission impact of promotions/discounts:
 *   Commission is calculated on discountedTotal (post-discount amount), NOT the original price.
 *   discountedTotal = finalAmount - discountAmount
 *   All commission/payout fields use discountedTotal as the base.
 *
 * Tax impact:
 *   taxSnapshot (JSON) stores a frozen copy of all active TaxConfig rules at booking time.
 *   This ensures the correct rates are preserved even if SA updates rates later.
 *   taxTotal = sum of all computed tax amounts from taxSnapshot.
 */

/**
 * Booking + Escrow entity.
 *
 * Full state machine (see BookingStatus enum for diagram):
 *   PENDING_PAYMENT → PAYMENT_HELD → CONFIRMED → IN_PROGRESS
 *     → [PRICE_ADJUSTMENT_REQUESTED → PRICE_ADJUSTMENT_APPROVED]
 *     → PENDING_CONFIRMATION
 *     → COMPLETED (customer confirms OR auto-release after 72h)
 *     → DISPUTED → DISPUTE_RESOLVED → COMPLETED | REFUNDED
 *   → NO_SHOW (provider absent 12h) → REFUNDED
 *   → CANCELLED_BY_CUSTOMER | CANCELLED_BY_PROVIDER → REFUNDED
 *   → BANNED_AND_REFUNDED (fraud/collusion)
 *
 * Money flow:
 *   Customer pays → escrowStatus=HELD (money locked in platform)
 *   On COMPLETED   → escrowStatus=RELEASED (payout to provider after commission split)
 *   On refund      → escrowStatus=REFUNDED | PARTIAL_REFUND
 *
 * Commission split (stored for audit):
 *   totalAmount = providerPayout + platformCommission + communityAdminShare
 */
@Entity('bookings')
@Index(['customerId'])
@Index(['providerId'])
@Index(['communityId'])
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string

  /* ── Parties ── */
  @Column({ name: 'listing_id' })
  listingId: string

  @Column({ name: 'customer_id' })
  customerId: string

  @Column({ name: 'provider_id' })
  providerId: string

  @Column({ name: 'community_id' })
  communityId: string

  /* ── Scheduling ── */
  @Column({ name: 'scheduled_at', type: 'timestamptz' })
  scheduledAt: Date

  /**
   * Extended deadline (ลูกค้าขยายเวลา 6–24h เมื่อ no-show).
   * หาก scheduledAt + 12h ผ่านไปแล้ว และ extendedDeadline ยังไม่ถึง
   * ระบบจะยังไม่ trigger no-show flow
   */
  @Column({ name: 'extended_deadline', nullable: true, type: 'timestamptz' })
  extendedDeadline: Date | null

  @Column({ name: 'provider_started_at', nullable: true, type: 'timestamptz' })
  providerStartedAt: Date | null    // เมื่อ Provider กด "เริ่มงาน"

  @Column({ name: 'provider_completed_at', nullable: true, type: 'timestamptz' })
  providerCompletedAt: Date | null  // เมื่อ Provider กด "เสร็จงาน"

  @Column({ name: 'customer_confirmed_at', nullable: true, type: 'timestamptz' })
  customerConfirmedAt: Date | null  // เมื่อลูกค้ากด "ยืนยัน" หรือ auto-release

  /* ── Auto-release deadline ── */
  /**
   * Timestamp ที่ระบบจะ auto-release เงินให้ Provider โดยอัตโนมัติ
   * ถูกตั้งเมื่อ status → PENDING_CONFIRMATION
   * = providerCompletedAt + 72h
   * หากมีการเปิด DISPUTED ก่อน deadline นี้ → auto-release จะถูกระงับ
   */
  @Column({ name: 'auto_release_at', nullable: true, type: 'timestamptz' })
  autoReleaseAt: Date | null

  /* ── Booking state ── */
  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.PENDING_PAYMENT,
  })
  status: BookingStatus

  @Column({ nullable: true, type: 'text' })
  note: string | null

  @Column({ name: 'customer_reject_reason', nullable: true, type: 'text' })
  customerRejectReason: string | null   // เหตุผลที่ลูกค้าปฏิเสธ/ร้องเรียน

  @Column({ name: 'cancellation_reason', nullable: true, type: 'text' })
  cancellationReason: string | null

  /* ── Pricing ── */
  @Column({
    name: 'pricing_type',
    type: 'enum',
    enum: PricingType,
    default: PricingType.FIXED,
  })
  pricingType: PricingType

  /**
   * ราคาเริ่มต้น (ตาม Listing หรือ Provider กำหนดขั้นต้น สำหรับ VARIABLE)
   * ต้องไม่ต่ำกว่า platform minimum price
   */
  @Column({ name: 'quoted_amount', type: 'decimal', precision: 10, scale: 2, default: 0 })
  quotedAmount: number               // ราคาที่ลูกค้าถูกเรียกเก็บตอนนัด

  /**
   * ราคาที่อัพเดตหลัง Provider เห็นงานจริง (เฉพาะ VARIABLE)
   * ต้องผ่าน CA approve ก่อน
   */
  @Column({ name: 'adjusted_amount', nullable: true, type: 'decimal', precision: 10, scale: 2 })
  adjustedAmount: number | null

  @Column({ name: 'adjusted_reason', nullable: true, type: 'text' })
  adjustedReason: string | null

  @Column({ name: 'price_adjustment_approved_by', nullable: true })
  priceAdjustmentApprovedBy: string | null  // CA userId

  @Column({ name: 'price_adjustment_approved_at', nullable: true, type: 'timestamptz' })
  priceAdjustmentApprovedAt: Date | null

  /**
   * ราคาสุดท้ายที่ใช้คำนวณ commission
   * = adjustedAmount ถ้ามี, มิฉะนั้น = quotedAmount
   */
  @Column({ name: 'final_amount', type: 'decimal', precision: 10, scale: 2, default: 0 })
  finalAmount: number

  /* ── Discount / Promotion ── */
  /**
   * Promotion ID ที่ใช้ใน booking นี้ (nullable = ไม่มีส่วนลด)
   */
  @Column({ name: 'promotion_id', nullable: true })
  promotionId: string | null

  /** จำนวนส่วนลดที่ได้รับจริง (คำนวณ ณ checkout) */
  @Column({ name: 'discount_amount', type: 'decimal', precision: 10, scale: 2, default: 0 })
  discountAmount: number

  /**
   * ยอดหลังหักส่วนลด = finalAmount - discountAmount
   * ใช้เป็นฐานในการคำนวณ commission และ tax ทั้งหมด
   */
  @Column({ name: 'discounted_total', type: 'decimal', precision: 10, scale: 2, default: 0 })
  discountedTotal: number

  /* ── Tax breakdown (stored for audit + accounting) ── */
  /**
   * JSON snapshot ของ TaxConfig rules ที่ active ณ เวลาสร้าง booking
   * รูปแบบ: Array<{ taxCode, taxName, rate, applyTo, borneBy, isInclusive, amount }>
   * Frozen at creation — ไม่เปลี่ยนแม้ SA จะอัพเดต rate ภายหลัง
   */
  @Column({ name: 'tax_snapshot', nullable: true, type: 'jsonb' })
  taxSnapshot: Record<string, unknown>[] | null

  /** ภาษีรวมทั้งหมดที่ลูกค้าจ่าย (VAT inclusive หรือ exclusive ตาม config) */
  @Column({ name: 'customer_tax_total', type: 'decimal', precision: 10, scale: 2, default: 0 })
  customerTaxTotal: number

  /** ภาษีหัก ณ ที่จ่ายหรือค่าธรรมเนียมที่หักจาก Provider payout */
  @Column({ name: 'provider_tax_total', type: 'decimal', precision: 10, scale: 2, default: 0 })
  providerTaxTotal: number

  /* ── Commission breakdown (stored for audit + accounting) ── */
  /** % commission รวม ณ เวลานั้น (ตาม Super Admin config) */
  @Column({ name: 'commission_rate', type: 'decimal', precision: 5, scale: 2, default: 0 })
  commissionRate: number             // เช่น 12.00 = 12%

  /** % ที่ Community Admin ได้รับจาก commission (ตามสัญญา franchise) */
  @Column({ name: 'revenue_share_rate', type: 'decimal', precision: 5, scale: 2, default: 0 })
  revenueShareRate: number           // เช่น 30.00 = 30% ของ commission

  @Column({ name: 'platform_fee', type: 'decimal', precision: 10, scale: 2, default: 0 })
  platformFee: number                // finalAmount × commissionRate × (1 - revenueShareRate/100)

  @Column({ name: 'community_admin_share', type: 'decimal', precision: 10, scale: 2, default: 0 })
  communityAdminShare: number        // finalAmount × commissionRate × revenueShareRate/100

  @Column({ name: 'provider_payout', type: 'decimal', precision: 10, scale: 2, default: 0 })
  providerPayout: number             // finalAmount - platformFee - communityAdminShare

  /* ── Escrow / Payment ── */
  @Column({
    name: 'escrow_status',
    type: 'enum',
    enum: EscrowStatus,
    default: EscrowStatus.PENDING,
  })
  escrowStatus: EscrowStatus

  @Column({ name: 'escrow_held_at', nullable: true, type: 'timestamptz' })
  escrowHeldAt: Date | null          // เมื่อเงิน hold

  @Column({ name: 'escrow_released_at', nullable: true, type: 'timestamptz' })
  escrowReleasedAt: Date | null      // เมื่อโอนให้ Provider

  @Column({ name: 'escrow_refunded_at', nullable: true, type: 'timestamptz' })
  escrowRefundedAt: Date | null      // เมื่อคืนเงินลูกค้า

  /** จำนวนเงินที่คืน (อาจน้อยกว่า quotedAmount ถ้า PARTIAL_REFUND) */
  @Column({ name: 'refund_amount', nullable: true, type: 'decimal', precision: 10, scale: 2 })
  refundAmount: number | null

  /* ── Trust / Rating impact ── */
  /**
   * บันทึกว่า no-show นี้ถูกนำไป deduct trust score ของ Provider แล้วหรือยัง
   * ป้องกันการ deduct ซ้ำหากระบบ retry
   */
  @Column({ name: 'trust_score_deducted', default: false })
  trustScoreDeducted: boolean

  @Column({ name: 'trust_deduction_amount', nullable: true, type: 'decimal', precision: 4, scale: 2 })
  trustDeductionAmount: number | null

  /* ── Ban record ── */
  @Column({ name: 'banned_by', nullable: true })
  bannedBy: string | null            // Super Admin userId ที่กด ban

  @Column({ name: 'ban_reason', nullable: true, type: 'text' })
  banReason: string | null

  /* ── Timestamps ── */
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
