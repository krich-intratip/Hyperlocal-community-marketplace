import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, Index,
} from 'typeorm'
import { timestampCol } from '../../../common/db-types'

@Entity('conversations')
@Index(['customerId', 'lastMessageAt'])
@Index(['providerUserId', 'lastMessageAt'])
export class Conversation {
  @PrimaryGeneratedColumn('uuid')
  id: string

  /** User ID of the customer */
  @Column({ name: 'customer_id' })
  customerId: string

  /** Provider entity ID */
  @Column({ name: 'provider_id' })
  providerId: string

  /** User ID of the provider (denormalized for efficient conversation queries) */
  @Column({ name: 'provider_user_id' })
  providerUserId: string

  /** Provider display name snapshot (avoids joins in conversation list) */
  @Column({ name: 'provider_display_name', nullable: true })
  providerDisplayName: string | null

  /** Optional linked order ID */
  @Column({ name: 'order_id', nullable: true })
  orderId: string | null

  /** Preview of the last message body (first 100 chars) */
  @Column({ name: 'last_message_preview', nullable: true, type: 'text' })
  lastMessagePreview: string | null

  @Column({ name: 'last_message_at', nullable: true, type: timestampCol() })
  lastMessageAt: Date | null

  @CreateDateColumn({ name: 'created_at', type: timestampCol() })
  createdAt: Date
}
