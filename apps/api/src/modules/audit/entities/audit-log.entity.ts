import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm'
import { AuditAction } from '@chm/shared-types'

@Entity('audit_logs')
@Index(['userId'])
@Index(['action'])
@Index(['createdAt'])
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string

  /** User who performed the action (null for anonymous) */
  @Column({ name: 'user_id', nullable: true })
  userId: string | null

  @Column({
    name: 'action',
    type: 'simple-enum',
    enum: AuditAction,
  })
  action: AuditAction

  /** Target entity type (e.g. 'Listing', 'Order') */
  @Column({ name: 'resource', type: 'varchar', length: 50, nullable: true })
  resource: string | null

  /** Target entity ID */
  @Column({ name: 'resource_id', nullable: true })
  resourceId: string | null

  /** Extra context (JSON string) */
  @Column({ name: 'meta', type: 'text', nullable: true })
  meta: string | null

  /** IP address */
  @Column({ name: 'ip_address', type: 'varchar', length: 45, nullable: true })
  ipAddress: string | null

  /** User agent string (truncated to 200 chars) */
  @Column({ name: 'user_agent', type: 'varchar', length: 200, nullable: true })
  userAgent: string | null

  /** true = operation succeeded, false = denied/failed */
  @Column({ name: 'success', default: true })
  success: boolean

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date
}
