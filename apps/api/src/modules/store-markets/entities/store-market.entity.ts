import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index, Unique,
} from 'typeorm'

@Entity('store_markets')
@Unique(['storeId', 'marketId'])
export class StoreMarket {
  @PrimaryGeneratedColumn('uuid')
  id: string

  /** FK → providers.id */
  @Index()
  @Column({ name: 'store_id' })
  storeId: string

  /** FK → communities.id */
  @Index()
  @Column({ name: 'market_id' })
  marketId: string

  /** true = the store's home market (first registered market) */
  @Column({ name: 'is_main_branch', default: false })
  isMainBranch: boolean

  /** PENDING | ACTIVE | SUSPENDED */
  @Column({ name: 'status', default: 'ACTIVE' })
  status: string

  /** Override commission rate for this market (null = use market default) */
  @Column({ name: 'fee_rate', type: 'float', nullable: true })
  feeRate: number | null

  @Column({ type: 'text', nullable: true })
  notes: string | null

  @CreateDateColumn({ name: 'joined_at' })
  joinedAt: Date
}
