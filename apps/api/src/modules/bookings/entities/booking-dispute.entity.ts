import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, Index,
} from 'typeorm'
import { DisputeStatus } from '@chm/shared-types'

/**
 * BookingDispute — one dispute record per booking (1:1 or 1:many if re-opened).
 *
 * Lifecycle:
 *   OPEN → UNDER_REVIEW → RESOLVED_FOR_CUSTOMER | RESOLVED_FOR_PROVIDER | RESOLVED_PARTIAL
 *       → ESCALATED (Super Admin) → CLOSED
 *
 * When ESCALATED and collusion is found → booking goes BANNED_AND_REFUNDED,
 * both customer and provider accounts are banned by Super Admin.
 *
 * Financial outcome stored here for audit:
 *   - resolvedRefundAmount   : เงินที่คืนลูกค้า (full or partial)
 *   - resolvedProviderPayout : เงินที่โอนให้ Provider (อาจน้อยลงจากราคาเดิม)
 */
@Entity('booking_disputes')
@Index(['bookingId'])
@Index(['communityAdminId'])
export class BookingDispute {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Index()
  @Column({ name: 'booking_id' })
  bookingId: string

  /* ── Parties ── */
  @Column({ name: 'opened_by_customer_id' })
  openedByCustomerId: string

  @Column({ name: 'provider_id' })
  providerId: string

  /** Community Admin ที่รับผิดชอบ community นี้ */
  @Column({ name: 'community_admin_id', nullable: true })
  communityAdminId: string | null

  /* ── Dispute details ── */
  @Column({ type: 'text' })
  reason: string                       // เหตุผลที่ลูกค้าเปิดข้อพิพาท

  @Column({ name: 'customer_evidence_urls', nullable: true, type: 'text' })
  customerEvidenceUrls: string | null  // JSON array of URLs (ภาพถ่าย, วิดีโอ)

  @Column({ name: 'provider_response', nullable: true, type: 'text' })
  providerResponse: string | null      // คำชี้แจงจาก Provider

  @Column({ name: 'provider_evidence_urls', nullable: true, type: 'text' })
  providerEvidenceUrls: string | null

  /* ── Status ── */
  @Column({
    name: 'dispute_status',
    type: 'enum',
    enum: DisputeStatus,
    default: DisputeStatus.OPEN,
  })
  disputeStatus: DisputeStatus

  @Column({ name: 'reviewed_at', nullable: true, type: 'timestamptz' })
  reviewedAt: Date | null              // เมื่อ CA รับเรื่อง

  @Column({ name: 'resolved_at', nullable: true, type: 'timestamptz' })
  resolvedAt: Date | null

  /* ── Resolution decision ── */
  @Column({ name: 'resolution_note', nullable: true, type: 'text' })
  resolutionNote: string | null        // CA/SA อธิบายการตัดสิน

  /**
   * เงินที่คืนลูกค้า (0 = ไม่คืน, เต็มจำนวน = คืนทั้งหมด)
   * ถูกตั้งเมื่อ RESOLVED_FOR_CUSTOMER หรือ RESOLVED_PARTIAL
   */
  @Column({ name: 'resolved_refund_amount', nullable: true, type: 'decimal', precision: 10, scale: 2 })
  resolvedRefundAmount: number | null

  /**
   * เงินที่โอนให้ Provider หลังจบข้อพิพาท
   * (อาจต่างจาก providerPayout ใน Booking ถ้า partial)
   */
  @Column({ name: 'resolved_provider_payout', nullable: true, type: 'decimal', precision: 10, scale: 2 })
  resolvedProviderPayout: number | null

  /* ── Escalation (fraud/collusion) ── */
  @Column({ name: 'escalated_to_sa_at', nullable: true, type: 'timestamptz' })
  escalatedToSaAt: Date | null

  @Column({ name: 'escalated_reason', nullable: true, type: 'text' })
  escalatedReason: string | null

  @Column({ name: 'sa_decision', nullable: true, type: 'text' })
  saDecision: string | null           // Super Admin ตัดสินใจ (รวมถึง ban หรือไม่)

  @Column({ name: 'sa_decided_at', nullable: true, type: 'timestamptz' })
  saDecidedAt: Date | null

  @Column({ name: 'sa_user_id', nullable: true })
  saUserId: string | null             // Super Admin ที่ตัดสิน

  /* ── Timestamps ── */
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
