import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, Index,
} from 'typeorm'
import { floatCol, timestampCol } from '@/common/db-types'

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Index()
  @Column({ name: 'order_id' })
  orderId: string

  @Column({ type: floatCol() })
  amount: number

  /** promptpay | card | cod */
  @Column({ type: 'simple-enum', enum: ['promptpay', 'card', 'cod'] })
  method: string

  /** PENDING | PAID | EXPIRED | CANCELLED */
  @Column({
    type: 'simple-enum',
    enum: ['PENDING', 'PAID', 'EXPIRED', 'CANCELLED'],
    default: 'PENDING',
  })
  status: string

  /** PromptPay EMV payload or null for card/cod */
  @Column({ name: 'qr_data', type: 'text', nullable: true })
  qrData: string | null

  @Column({ name: 'paid_at', type: timestampCol(), nullable: true })
  paidAt: Date | null

  @Column({ name: 'expires_at', type: timestampCol() })
  expiresAt: Date

  @CreateDateColumn({ name: 'created_at', type: timestampCol() })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at', type: timestampCol() })
  updatedAt: Date
}
