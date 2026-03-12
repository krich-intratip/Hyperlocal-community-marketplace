import { Entity, PrimaryColumn, Column, UpdateDateColumn } from 'typeorm'

/** Generic key-value system configuration store */
@Entity('system_config')
export class SystemConfig {
  @PrimaryColumn({ length: 100 })
  key: string

  @Column({ type: 'text' })
  value: string

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
