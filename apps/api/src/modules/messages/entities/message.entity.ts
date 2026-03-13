import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, Index,
} from 'typeorm'
import { timestampCol } from '../../../common/db-types'

@Entity('messages')
@Index(['conversationId', 'createdAt'])
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'conversation_id' })
  conversationId: string

  /** user.id of the sender (works for both customer and provider users) */
  @Column({ name: 'sender_id' })
  senderId: string

  @Column({ type: 'text' })
  body: string

  @Column({ name: 'is_read', default: false })
  isRead: boolean

  @CreateDateColumn({ name: 'created_at', type: timestampCol() })
  createdAt: Date
}
