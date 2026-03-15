import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm'
import { SubscriptionTier } from '@chm/shared-types'

@Entity('provider_subscriptions')
export class ProviderSubscription {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Index({ unique: true })
  @Column({ name: 'provider_id' })
  providerId: string

  @Column({
    name: 'tier',
    type: 'simple-enum',
    enum: SubscriptionTier,
    default: SubscriptionTier.FREE,
  })
  tier: SubscriptionTier

  @Column({ name: 'starts_at', type: 'datetime' })
  startsAt: Date

  @Column({ name: 'expires_at', type: 'datetime', nullable: true })
  expiresAt: Date | null

  /** Monthly price paid in THB */
  @Column({ name: 'price_thb', type: 'real', default: 0 })
  priceTHB: number

  @Column({ name: 'is_active', default: true })
  isActive: boolean

  /** Auto-renewal enabled */
  @Column({ name: 'auto_renew', default: false })
  autoRenew: boolean

  @Column({ name: 'cancelled_at', type: 'datetime', nullable: true })
  cancelledAt: Date | null

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
