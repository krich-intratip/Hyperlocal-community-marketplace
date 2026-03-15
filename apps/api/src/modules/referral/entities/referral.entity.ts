import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm'

export type ReferralStatus = 'PENDING' | 'COMPLETED'

@Entity('referrals')
export class Referral {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Index()
  @Column({ name: 'referrer_id' })
  referrerId: string   // userId who shared the code

  @Index()
  @Column({ name: 'referred_id', nullable: true })
  referredId: string | null   // userId who registered via the code

  @Index({ unique: true })
  @Column({ name: 'code', length: 20 })
  code: string   // e.g. "CHM-AB12CD"

  @Column({ length: 20, default: 'PENDING' })
  status: ReferralStatus

  @Column({ name: 'bonus_awarded', type: 'boolean', default: false })
  bonusAwarded: boolean

  @Column({ name: 'bonus_points', type: 'integer', default: 50 })
  bonusPoints: number   // points awarded to referrer when friend completes first order

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @Column({ name: 'completed_at', nullable: true })
  completedAt: Date | null
}
