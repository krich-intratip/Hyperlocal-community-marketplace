import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm'
import { UserRole } from '@chm/shared-types'

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Index({ unique: true })
  @Column({ unique: true })
  email: string

  @Column({ nullable: true })
  phone: string

  @Column({ name: 'display_name' })
  displayName: string

  @Column({ name: 'avatar_url', nullable: true })
  avatarUrl: string

  @Column({ type: 'enum', enum: UserRole, default: UserRole.CUSTOMER })
  role: UserRole

  @Column({ name: 'login_provider', default: 'google' })
  loginProvider: string

  @Column({ name: 'google_id', nullable: true })
  googleId: string

  @Column({ name: 'is_active', default: true })
  isActive: boolean

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
