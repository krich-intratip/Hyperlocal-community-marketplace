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

  async create(data: {
    email: string
    displayName: string
    avatarUrl?: string
    loginProvider: string
    role: UserRole
    googleId?: string
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
}
