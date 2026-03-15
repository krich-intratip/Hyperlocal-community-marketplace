import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm'

@Entity('push_subscriptions')
export class PushSubscription {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Index()
  @Column({ name: 'user_id' })
  userId: string

  /** Browser push endpoint URL */
  @Column({ name: 'endpoint', type: 'text' })
  endpoint: string

  /** Web Push p256dh key */
  @Column({ name: 'p256dh', type: 'text' })
  p256dh: string

  /** Web Push auth secret */
  @Column({ name: 'auth', type: 'text' })
  auth: string

  /** User agent / device hint */
  @Column({ name: 'user_agent', type: 'text', nullable: true })
  userAgent: string | null

  @Column({ name: 'is_active', default: true })
  isActive: boolean

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
