import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, Check,
} from 'typeorm'

@Entity('reviews')
@Check('"rating" >= 1 AND "rating" <= 5')
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'booking_id', unique: true })
  bookingId: string

  @Column({ name: 'reviewer_id' })
  reviewerId: string

  @Column({ name: 'provider_id' })
  providerId: string

  @Column({ type: 'smallint' })
  rating: number

  @Column({ nullable: true, type: 'text' })
  comment: string

  @Column({ name: 'is_flagged', default: false })
  isFlagged: boolean

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
