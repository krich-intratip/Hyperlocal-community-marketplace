import { Entity, PrimaryGeneratedColumn, Column, Index, CreateDateColumn } from 'typeorm'

@Entity('provider_holidays')
@Index(['providerId', 'date'], { unique: true })
export class ProviderHoliday {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'provider_id' })
  providerId: string

  @Column({ type: 'text' }) // stored as 'YYYY-MM-DD'
  date: string

  @Column({ nullable: true })
  reason: string | null

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date
}
