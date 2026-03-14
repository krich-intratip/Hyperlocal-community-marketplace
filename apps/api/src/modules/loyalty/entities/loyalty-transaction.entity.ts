import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm'

export type LoyaltyTxType = 'EARN' | 'REDEEM' | 'RESTORE' | 'BONUS'

@Entity('loyalty_transactions')
export class LoyaltyTransaction {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Index()
  @Column({ name: 'customer_id' })
  customerId: string

  @Column({ length: 20 })
  type: LoyaltyTxType

  @Column({ type: 'integer' })
  points: number

  @Column({ type: 'integer' })
  balance: number

  @Column({ length: 200, nullable: true })
  description: string | null

  @Column({ name: 'order_id', nullable: true })
  orderId: string | null

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date
}
