import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn,
} from 'typeorm'
import { MarketplaceCategory, ListingStatus } from '@chm/shared-types'

@Entity('listings')
export class Listing {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'provider_id' })
  providerId: string

  @Column({ name: 'community_id' })
  communityId: string

  @Column()
  title: string

  @Column({ type: 'text' })
  description: string

  @Column({ type: 'enum', enum: MarketplaceCategory })
  category: MarketplaceCategory

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number

  @Column({ name: 'price_unit', nullable: true })
  priceUnit: string

  @Column({ type: 'enum', enum: ListingStatus, default: ListingStatus.ACTIVE })
  status: ListingStatus

  @Column({ name: 'images', type: 'jsonb', default: [] })
  images: string[]

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
