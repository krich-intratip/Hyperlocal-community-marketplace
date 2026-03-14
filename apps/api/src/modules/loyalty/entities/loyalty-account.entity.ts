import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm'

export type LoyaltyTier = 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM'

@Entity('loyalty_accounts')
export class LoyaltyAccount {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Index({ unique: true })
  @Column({ name: 'customer_id' })
  customerId: string

  @Column({ type: 'integer', default: 0 })
  points: number

  @Column({ name: 'total_earned', type: 'integer', default: 0 })
  totalEarned: number

  @Column({ name: 'total_redeemed', type: 'integer', default: 0 })
  totalRedeemed: number

  @Column({ length: 20, default: 'BRONZE' })
  tier: LoyaltyTier

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
