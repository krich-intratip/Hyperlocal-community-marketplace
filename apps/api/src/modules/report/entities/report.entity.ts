import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm'
import { ReportType, ReportReason, ReportStatus } from '@chm/shared-types'

@Entity('reports')
@Index(['type', 'targetId'])
export class Report {
  @PrimaryGeneratedColumn('uuid')
  id: string

  /** User who submitted the report */
  @Index()
  @Column({ name: 'reporter_id' })
  reporterId: string

  @Column({
    name: 'type',
    type: 'simple-enum',
    enum: ReportType,
  })
  type: ReportType

  /** ID of the reported entity (listingId, providerId, reviewId, messageId) */
  @Column({ name: 'target_id' })
  targetId: string

  @Column({
    name: 'reason',
    type: 'simple-enum',
    enum: ReportReason,
  })
  reason: ReportReason

  @Column({ name: 'description', type: 'text', nullable: true })
  description: string | null

  @Column({
    name: 'status',
    type: 'simple-enum',
    enum: ReportStatus,
    default: ReportStatus.PENDING,
  })
  status: ReportStatus

  /** SuperAdmin note when resolving */
  @Column({ name: 'admin_note', type: 'text', nullable: true })
  adminNote: string | null

  /** Admin who handled the report */
  @Column({ name: 'resolved_by', nullable: true })
  resolvedBy: string | null

  @Column({ name: 'resolved_at', type: 'datetime', nullable: true })
  resolvedAt: Date | null

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
