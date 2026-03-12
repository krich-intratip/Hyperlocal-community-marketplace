import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, Index,
} from 'typeorm'
import { ReturnReason, ReturnStatus } from '@chm/shared-types'

@Entity('return_requests')
export class ReturnRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string

  /** Cart order that is being returned */
  @Index()
  @Column({ name: 'order_id' })
  orderId: string

  /** Customer who placed the order */
  @Index()
  @Column({ name: 'customer_id' })
  customerId: string

  @Column({ type: 'simple-enum', enum: ReturnReason })
  reason: ReturnReason

  @Column({ type: 'text' })
  description: string

  /** URLs of evidence photos uploaded by customer */
  @Column({ name: 'evidence_images', type: 'simple-json', nullable: true })
  evidenceImages: string[] | null

  @Column({ type: 'simple-enum', enum: ReturnStatus, default: ReturnStatus.PENDING })
  status: ReturnStatus

  /** Amount to refund — filled by CA/Super Admin on approval */
  @Column({ name: 'refund_amount', type: 'real', nullable: true })
  refundAmount: number | null

  /** Admin note explaining the decision */
  @Column({ name: 'resolution_note', type: 'text', nullable: true })
  resolutionNote: string | null

  @Column({ name: 'resolved_at', type: 'datetime', nullable: true })
  resolvedAt: Date | null

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
