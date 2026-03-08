import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Provider } from './entities/provider.entity'
import { VerificationStatus } from '@chm/shared-types'

@Injectable()
export class ProvidersService {
  constructor(
    @InjectRepository(Provider)
    private readonly providerRepo: Repository<Provider>,
  ) {}

  async apply(userId: string, data: { communityId: string; displayName: string; bio?: string; serviceRadius?: number }) {
    const existing = await this.providerRepo.findOne({ where: { userId, communityId: data.communityId } })
    if (existing) return existing
    const provider = this.providerRepo.create({ userId, ...data, verificationStatus: VerificationStatus.PENDING })
    return this.providerRepo.save(provider)
  }

  async findMyProfile(userId: string) {
    return this.providerRepo.findOne({ where: { userId, isActive: true } })
  }

  async findById(id: string) {
    const provider = await this.providerRepo.findOne({ where: { id, isActive: true } })
    if (!provider) throw new NotFoundException('Provider not found')
    return provider
  }

  async approve(id: string) {
    await this.providerRepo.update(id, { verificationStatus: VerificationStatus.APPROVED })
    return this.findById(id)
  }

  async reject(id: string) {
    await this.providerRepo.update(id, { verificationStatus: VerificationStatus.REJECTED })
    return this.findById(id)
  }

  getPendingByCommunity(communityId: string) {
    return this.providerRepo.find({
      where: { communityId, verificationStatus: VerificationStatus.PENDING },
    })
  }
}
