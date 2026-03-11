import {
  Entity, PrimaryGeneratedColumn, Column, Index,
} from 'typeorm'

@Entity('platform_modules')
export class PlatformModule {
  @PrimaryGeneratedColumn('uuid')
  id: string

  /** Unique code matching ModuleCode enum */
  @Column({ unique: true })
  code: string

  @Column()
  name: string

  @Column({ type: 'text', nullable: true })
  description: string | null

  /** ModuleCategory: COMMERCE | CATALOG | SERVICES | MARKETPLACE | FINANCE */
  @Column()
  category: string

  /** Core modules cannot be disabled by markets/stores */
  @Column({ name: 'is_core', default: false })
  isCore: boolean

  @Column({ name: 'is_active', default: true })
  isActive: boolean
}
