import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, Index,
} from 'typeorm'
import { NotificationType } from '@chm/shared-types'
import { jsonCol, timestampCol } from '../../../common/db-types'

@Entity('notification_logs')
@Index(['userId', 'createdAt'])
export class NotificationLog {
  @PrimaryGeneratedColumn('uuid')
  id: string

  /** Recipient user ID */
  @Column({ name: 'user_id' })
  @Index()
  userId: string

  @Column({ name: 'type', type: 'simple-enum', enum: NotificationType })
  type: NotificationType

  @Column()
  title: string

  @Column({ type: 'text' })
  body: string

  /** Optional JSON payload — e.g. { orderId, bookingId } */
  @Column({ name: 'data', type: jsonCol(), nullable: true })
  data: Record<string, unknown> | null

  /** Deep link within the app, e.g. /orders/abc123 */
  @Column({ nullable: true })
  href: string | null

  @Column({ name: 'is_read', default: false })
  isRead: boolean

  @CreateDateColumn({ name: 'created_at', type: timestampCol() })
  createdAt: Date
}
