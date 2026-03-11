import {
  Entity, PrimaryGeneratedColumn, Column, Index, Unique,
} from 'typeorm'
import { jsonCol } from '../../../common/db-types'

@Entity('store_modules')
@Unique(['storeId', 'moduleId'])
export class StoreModule {
  @PrimaryGeneratedColumn('uuid')
  id: string

  /** FK → providers.id */
  @Index()
  @Column({ name: 'store_id' })
  storeId: string

  /** FK → platform_modules.id */
  @Column({ name: 'module_id' })
  moduleId: string

  @Column({ name: 'is_enabled', default: true })
  isEnabled: boolean

  /** Store-specific config overrides for this module */
  @Column({ type: jsonCol(), nullable: true })
  config: object | null
}
