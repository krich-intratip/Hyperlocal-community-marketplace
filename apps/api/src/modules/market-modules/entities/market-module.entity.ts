import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index, Unique,
} from 'typeorm'
import { jsonCol } from '../../../common/db-types'

@Entity('market_modules')
@Unique(['marketId', 'moduleId'])
export class MarketModule {
  @PrimaryGeneratedColumn('uuid')
  id: string

  /** FK → communities.id (= marketId semantically) */
  @Index()
  @Column({ name: 'market_id' })
  marketId: string

  /** FK → platform_modules.id */
  @Column({ name: 'module_id' })
  moduleId: string

  @Column({ name: 'is_enabled', default: true })
  isEnabled: boolean

  /** Module-specific config overrides for this market */
  @Column({ type: jsonCol(), nullable: true })
  config: object | null

  @CreateDateColumn({ name: 'enabled_at' })
  enabledAt: Date

  /** userId of the operator who enabled/configured this module */
  @Column({ name: 'enabled_by', nullable: true, type: 'text' })
  enabledBy: string | null
}
