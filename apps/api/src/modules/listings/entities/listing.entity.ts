import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn,
} from 'typeorm'
import { MarketplaceCategory, ListingStatus } from '@chm/shared-types'
import { jsonCol } from '../../../common/db-types'

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

  @Column({ type: 'simple-enum', enum: MarketplaceCategory })
  category: MarketplaceCategory

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number

  @Column({ name: 'price_unit', nullable: true })
  priceUnit: string

  @Column({ type: 'simple-enum', enum: ListingStatus, default: ListingStatus.ACTIVE })
  status: ListingStatus

  @Column({ name: 'images', type: jsonCol(), nullable: true })
  images: string[]

  // Extended fields for marketplace display
  @Column({ name: 'location_lat', nullable: true, type: 'real' })
  locationLat: number | null

  @Column({ name: 'location_lng', nullable: true, type: 'real' })
  locationLng: number | null

  @Column({ name: 'is_promoted', default: false })
  isPromoted: boolean

  @Column({ name: 'tags', type: jsonCol(), nullable: true })
  tags: string[] | null

  @Column({ name: 'available_days', type: jsonCol(), nullable: true })
  availableDays: number[] | null

  @Column({ name: 'open_time', nullable: true, type: 'text' })
  openTime: string | null

  @Column({ name: 'close_time', nullable: true, type: 'text' })
  closeTime: string | null

  @Column({ name: 'menu_stock', type: jsonCol(), nullable: true })
  menuStock: Array<{ name: string; stock: number; max: number; price: number }> | null

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
