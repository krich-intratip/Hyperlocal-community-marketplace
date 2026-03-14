import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm'
import { UserRole, KycStatus } from '@chm/shared-types'

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ unique: true })
  email: string

  @Column({ nullable: true })
  phone: string

  @Column({ name: 'display_name' })
  displayName: string

  @Column({ name: 'avatar_url', nullable: true })
  avatarUrl: string

  @Column({ type: 'simple-enum', enum: UserRole, default: UserRole.CUSTOMER })
  role: UserRole

  /** bcrypt hash — null for OAuth-only accounts */
  @Column({ name: 'password_hash', nullable: true, select: false })
  passwordHash: string | null

  @Column({ name: 'login_provider', default: 'google' })
  loginProvider: string

  @Column({ name: 'google_id', nullable: true })
  googleId: string

  @Column({ name: 'is_active', default: true })
  isActive: boolean

  /* ── KYC / Identity & Location fields ── */

  @Column({ name: 'kyc_status', type: 'simple-enum', enum: KycStatus, default: KycStatus.UNVERIFIED })
  kycStatus: KycStatus

  @Column({ name: 'address', nullable: true, type: 'text' })
  address: string | null

  @Column({ name: 'location_lat', nullable: true, type: 'double precision' })
  locationLat: number | null

  @Column({ name: 'location_lng', nullable: true, type: 'double precision' })
  locationLng: number | null

  @Column({ name: 'id_card_url', nullable: true, type: 'text' })
  idCardUrl: string | null

  @Column({ name: 'id_verified_at', nullable: true, type: 'datetime' })
  idVerifiedAt: Date | null

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
