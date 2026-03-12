import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm'
import { floatCol } from '@/common/db-types'
import { Order } from './order.entity'

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  orderId: string

  @ManyToOne(() => Order, order => order.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' })
  order: Order

  @Column()
  listingId: string

  /** Snapshot of listing title at order creation time */
  @Column()
  listingTitle: string

  @Column({ type: floatCol() })
  unitPrice: number

  @Column({ type: 'int' })
  qty: number

  /** lineTotal = unitPrice * qty */
  @Column({ type: floatCol() })
  lineTotal: number

  @Column({ nullable: true })
  note: string | null
}
