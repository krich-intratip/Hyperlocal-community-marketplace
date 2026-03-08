import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, Index,
} from 'typeorm'
import { TaxType, TaxApplyTo } from '@chm/shared-types'

/**
 * TaxConfig — platform-level tax/fee configuration managed by Super Admin.
 *
 * Design:
 *   - Multiple tax rules can be active simultaneously (e.g., VAT + withholding)
 *   - Each rule specifies what it applies to (TaxApplyTo) and who bears it
 *   - All active rules are fetched at booking creation and their amounts
 *     are computed + stored in the Booking entity for audit immutability
 *   - SA can add, update (by deactivating old + creating new), or disable rules
 *
 * Thailand defaults (MVP):
 *   - VAT 7% on AFTER_DISCOUNT amount → borne by customer (included in total)
 *   - Withholding tax 3% on PROVIDER_PAYOUT → borne by provider (deducted from payout)
 *     only if provider is a registered business (future: check provider.isBusiness)
 *
 * Future extensibility:
 *   - Service tax for specific categories
 *   - Platform fee adjustments
 *   - Community-specific surcharges
 */
@Entity('tax_configs')
export class TaxConfig {
  @PrimaryGeneratedColumn('uuid')
  id: string

  /* ── Tax identity ── */
  @Column({ name: 'tax_name' })
  taxName: string                      // เช่น "VAT 7%", "หัก ณ ที่จ่าย 3%"

  @Column({ name: 'tax_code', unique: true })
  taxCode: string                      // เช่น "TH_VAT_7", "TH_WHT_3"

  @Column({
    name: 'tax_type',
    type: 'enum',
    enum: TaxType,
  })
  taxType: TaxType

  /* ── Rate ── */
  /** อัตราภาษีเป็น % (เช่น 7.00 = 7%) */
  @Column({ name: 'rate', type: 'decimal', precision: 6, scale: 3 })
  rate: number

  /** ใช้กับยอดส่วนไหนของ booking */
  @Column({
    name: 'apply_to',
    type: 'enum',
    enum: TaxApplyTo,
    default: TaxApplyTo.AFTER_DISCOUNT,
  })
  applyTo: TaxApplyTo

  /* ── Who bears this tax ── */
  /**
   * CUSTOMER — บวกเพิ่มในราคาที่ลูกค้าจ่าย (inclusive or exclusive)
   * PROVIDER — หักออกจาก providerPayout
   * PLATFORM — หักออกจาก platformFee
   */
  @Column({
    name: 'borne_by',
    type: 'enum',
    enum: ['CUSTOMER', 'PROVIDER', 'PLATFORM'],
    default: 'CUSTOMER',
  })
  borneBy: 'CUSTOMER' | 'PROVIDER' | 'PLATFORM'

  /**
   * Tax included (VAT inclusive) หรือ exclusive
   * true  = ราคาที่แสดงรวม VAT แล้ว (gross price)
   * false = บวก VAT เพิ่มจากราคาที่แสดง (net price + tax)
   */
  @Column({ name: 'is_inclusive', default: true })
  isInclusive: boolean

  /* ── Scope ── */
  /**
   * ใช้กับหมวดหมู่เหล่านี้เท่านั้น (JSON array of MarketplaceCategory)
   * null = ทุกหมวดหมู่
   */
  @Column({ name: 'applicable_categories', nullable: true, type: 'text' })
  applicableCategories: string | null

  /**
   * ใช้กับ community เหล่านี้เท่านั้น (JSON array of community UUIDs)
   * null = ทุก community (platform-wide)
   */
  @Column({ name: 'applicable_community_ids', nullable: true, type: 'text' })
  applicableCommunityIds: string | null

  /**
   * ยอดขั้นต่ำที่ต้องเสียภาษีนี้ (เช่น withholding เริ่มที่ ฿1000/transaction)
   * null = ทุกยอด
   */
  @Column({ name: 'threshold_amount', nullable: true, type: 'decimal', precision: 10, scale: 2 })
  thresholdAmount: number | null

  /* ── Activation ── */
  @Column({ name: 'is_active', default: true })
  isActive: boolean

  @Column({ name: 'effective_from', type: 'timestamptz' })
  effectiveFrom: Date

  @Column({ name: 'effective_to', nullable: true, type: 'timestamptz' })
  effectiveTo: Date | null             // null = ไม่มีวันหมดอายุ

  /* ── Audit ── */
  @Column({ name: 'created_by_sa_id' })
  createdBySaId: string               // Super Admin userId

  @Column({ name: 'last_updated_by_sa_id', nullable: true })
  lastUpdatedBySaId: string | null

  @Column({ nullable: true, type: 'text' })
  notes: string | null                // SA หมายเหตุ

  /* ── Timestamps ── */
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
