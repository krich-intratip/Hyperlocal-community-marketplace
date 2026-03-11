import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index,
} from 'typeorm'
import { jsonCol } from '../../../common/db-types'

@Entity('business_templates')
export class BusinessTemplate {
  @PrimaryGeneratedColumn('uuid')
  id: string

  /** Unique code matching MarketplaceCategory / BusinessTemplateCode enum */
  @Column({ unique: true })
  code: string

  @Column()
  name: string

  @Column({ type: 'text', nullable: true })
  description: string | null

  /** Emoji icon representing this template */
  @Column({ nullable: true, type: 'text' })
  icon: string | null

  /** Default catalog structure for this business type */
  @Column({ name: 'default_catalog_schema', type: jsonCol(), nullable: true })
  defaultCatalogSchema: object | null

  /** Default order flow steps for this business type */
  @Column({ name: 'default_order_flow', type: jsonCol(), nullable: true })
  defaultOrderFlow: object | null

  /** NONE | COUNT | INGREDIENT */
  @Column({ name: 'inventory_policy', default: 'NONE' })
  inventoryPolicy: string

  /** Array of ModuleCode strings enabled by default for this template */
  @Column({ name: 'default_modules', type: jsonCol(), nullable: true })
  defaultModules: string[] | null

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date
}
