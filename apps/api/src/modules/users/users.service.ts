import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from './entities/user.entity'
import { UserRole } from '@chm/shared-types'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id, isActive: true } })
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email, isActive: true } })
  }

  /** Returns user WITH passwordHash (for credential verification only) */
  async findByEmailWithPassword(email: string): Promise<User | null> {
    return this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password_hash', 'user_passwordHash')
      .where('user.email = :email AND user.isActive = :active', { email, active: true })
      .getOne()
  }

  async create(data: {
    email: string
    displayName: string
    avatarUrl?: string
    loginProvider: string
    role: UserRole
    googleId?: string
    passwordHash?: string
    phone?: string
  }): Promise<User> {
    const user = this.userRepository.create(data)
    return this.userRepository.save(user)
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    await this.userRepository.update(id, data)
    const updated = await this.findById(id)
    if (!updated) throw new NotFoundException('User not found')
    return updated
  }

  async setLanguage(userId: string, language: 'th' | 'en'): Promise<{ preferredLanguage: string }> {
    await this.userRepository.update(userId, { preferredLanguage: language })
    return { preferredLanguage: language }
  }
}
