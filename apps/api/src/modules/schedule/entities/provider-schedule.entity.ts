import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm'

@Entity('provider_schedules')
@Index(['providerId', 'dayOfWeek'], { unique: true })
export class ProviderSchedule {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'provider_id' })
  providerId: string // Provider.id (not userId)

  @Column({ name: 'day_of_week', type: 'integer' })
  dayOfWeek: number // 0=Sunday, 1=Monday, ..., 6=Saturday

  @Column({ name: 'is_open', type: 'boolean', default: true })
  isOpen: boolean

  @Column({ name: 'open_time', default: '09:00' })
  openTime: string // HH:mm

  @Column({ name: 'close_time', default: '18:00' })
  closeTime: string // HH:mm
}
