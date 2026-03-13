import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'
import { floatCol, timestampCol } from '@/common/db-types'
import { OrderItem } from './order-item.entity'

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string

  /** Customer who placed the order */
  @Column()
  customerId: string

  /** Provider fulfilling the order */
  @Column()
  providerId: string

  /** Community the order belongs to */
  @Column()
  communityId: string

  /** Order status (OrderStatus enum values) */
  @Column({ default: 'PENDING_PAYMENT' })
  status: string

  @OneToMany(() => OrderItem, item => item.order, { cascade: true, eager: true })
  items: OrderItem[]

  @Column({ type: floatCol() })
  subtotal: number

  /** Platform fee = 5% of subtotal */
  @Column({ type: floatCol() })
  platformFee: number

  /** Total = subtotal + platformFee */
  @Column({ type: floatCol() })
  total: number

  @Column({ nullable: true })
  deliveryAddress: string | null

  /** Delivery method: self_pickup | lineman | grab_express */
  @Column({ nullable: true })
  deliveryMethod: string | null

  /** Carrier tracking ID (e.g. LM-001234 or GX-001234) */
  @Column({ nullable: true })
  trackingId: string | null

  @Column({ default: 'PROMPTPAY' })
  paymentMethod: string

  @Column({ nullable: true })
  note: string | null

  @CreateDateColumn({ type: timestampCol() })
  createdAt: Date

  @UpdateDateColumn({ type: timestampCol() })
  updatedAt: Date
}
