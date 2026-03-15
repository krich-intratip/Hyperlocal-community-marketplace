import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { IsNull, Not, Repository } from 'typeorm'
import { Provider } from './entities/provider.entity'
import { VerificationStatus, ProviderStatus, ShopStatus } from '@chm/shared-types'
import { SetLocationDto } from './dto/set-location.dto'
import { NearbyQueryDto } from './dto/nearby-query.dto'

@Injectable()
export class ProvidersService {
  constructor(
    @InjectRepository(Provider)
    private readonly providerRepo: Repository<Provider>,
  ) {}

  async apply(
    userId: string,
    data: {
      communityId: string
      displayName: string
      bio?: string
      serviceRadius?: number
      address?: string
      locationLat?: number
      locationLng?: number
    },
  ) {
    // Check for existing profile in ANY community (active or suspended)
    const existingAny = await this.providerRepo.findOne({
      where: { userId, communityId: Not(IsNull()) },
    })

    if (existingAny) {
      // Same community re-apply → idempotent
      if (existingAny.communityId === data.communityId) return existingAny

      // LEFT status → allowed to re-apply to a NEW community (different account not required)
      if (existingAny.providerStatus === ProviderStatus.LEFT) {
        // Update the existing record with new community + reset status
        await this.providerRepo.update(existingAny.id, {
          communityId: data.communityId,
          displayName: data.displayName,
          bio: data.bio,
          serviceRadius: data.serviceRadius,
          address: data.address ?? existingAny.address,
          locationLat: data.locationLat ?? existingAny.locationLat,
          locationLng: data.locationLng ?? existingAny.locationLng,
          verificationStatus: VerificationStatus.PENDING,
          providerStatus: ProviderStatus.ACTIVE,
          leftCommunityAt: null,
          leftReason: null,
          isActive: true,
        })
        return this.providerRepo.findOne({ where: { id: existingAny.id } })
      }

      // Active/Suspended/Inactive → must use new account
      throw new ConflictException(
        `บัญชีนี้เป็น Provider ในชุมชน "${existingAny.communityId}" อยู่แล้ว ` +
        `หากต้องการสมัครในชุมชนอื่น กรุณาออกจากชุมชนเดิมก่อน หรือใช้บัญชีใหม่`,
      )
    }

    const provider = this.providerRepo.create({
      userId,
      ...data,
      verificationStatus: VerificationStatus.PENDING,
      providerStatus: ProviderStatus.ACTIVE,
    })
    return this.providerRepo.save(provider)
  }

  async findAll(params: { communityId?: string } = {}) {
    const where: Record<string, unknown> = { verificationStatus: VerificationStatus.APPROVED, isActive: true }
    if (params.communityId) where['communityId'] = params.communityId
    return this.providerRepo.find({ where, order: { createdAt: 'DESC' } })
  }

  async findMyProfile(userId: string) {
    return this.providerRepo.findOne({ where: { userId } })
  }

  async findById(id: string) {
    const provider = await this.providerRepo.findOne({ where: { id } })
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

  /** หยุดให้บริการชั่วคราว — กลับมา ACTIVE ได้เองผ่าน reactivate() */
  async suspend(userId: string) {
    const provider = await this.providerRepo.findOne({ where: { userId } })
    if (!provider) throw new NotFoundException('Provider profile not found')
    if (provider.providerStatus === ProviderStatus.LEFT)
      throw new BadRequestException('ออกจากชุมชนแล้ว — ไม่สามารถ suspend ได้')
    await this.providerRepo.update(provider.id, {
      providerStatus: ProviderStatus.SUSPENDED,
      isActive: false,
    })
    return this.findById(provider.id)
  }

  /** กลับมาให้บริการอีกครั้งหลัง suspend */
  async reactivate(userId: string) {
    const provider = await this.providerRepo.findOne({ where: { userId } })
    if (!provider) throw new NotFoundException('Provider profile not found')
    if (provider.providerStatus === ProviderStatus.LEFT)
      throw new BadRequestException('ออกจากชุมชนแล้ว — ต้องสมัครชุมชนใหม่ก่อน')
    if (provider.verificationStatus !== VerificationStatus.APPROVED)
      throw new BadRequestException('โปรไฟล์ยังไม่ได้รับการอนุมัติ')
    await this.providerRepo.update(provider.id, {
      providerStatus: ProviderStatus.ACTIVE,
      isActive: true,
    })
    return this.findById(provider.id)
  }

  /** เลิกกิจการถาวร — ต้องให้ Admin re-activate */
  async deactivate(userId: string) {
    const provider = await this.providerRepo.findOne({ where: { userId } })
    if (!provider) throw new NotFoundException('Provider profile not found')
    await this.providerRepo.update(provider.id, {
      providerStatus: ProviderStatus.INACTIVE,
      isActive: false,
    })
    return this.findById(provider.id)
  }

  /**
   * ออกจากชุมชน (เช่น ย้ายที่อยู่)
   * บัญชียังอยู่ แต่ communityId จะถูก null เพื่อปลด unique constraint
   * ทำให้สามารถสมัครชุมชนใหม่ได้ด้วยบัญชีเดิม
   */
  async leaveCommunity(userId: string, reason?: string) {
    const provider = await this.providerRepo.findOne({ where: { userId } })
    if (!provider) throw new NotFoundException('Provider profile not found')
    if (provider.providerStatus === ProviderStatus.LEFT)
      throw new BadRequestException('ออกจากชุมชนไปแล้ว')
    await this.providerRepo.update(provider.id, {
      providerStatus: ProviderStatus.LEFT,
      isActive: false,
      leftCommunityAt: new Date(),
      leftReason: reason ?? null,
      communityId: null as unknown as string,   // release unique constraint
    })
    return this.findById(provider.id)
  }

  getPendingByCommunity(communityId: string) {
    return this.providerRepo.find({
      where: { communityId, verificationStatus: VerificationStatus.PENDING },
    })
  }

  // ─── GEO-1: Geolocation & Nearby Discovery ────────────────────────────────

  /** Haversine formula — returns distance in km between two lat/lng points */
  private haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371 // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = Math.sin(dLat / 2) ** 2
      + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180)
      * Math.sin(dLon / 2) ** 2
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  }

  /** Provider: update own GPS coordinates */
  async setLocation(userId: string, dto: SetLocationDto): Promise<Provider> {
    const provider = await this.providerRepo.findOne({ where: { userId } })
    if (!provider) throw new NotFoundException('ไม่พบข้อมูล Provider')
    provider.locationLat = dto.latitude
    provider.locationLng = dto.longitude
    return this.providerRepo.save(provider)
  }

  /** Public: list providers within radius km, sorted by distance */
  async getNearby(dto: NearbyQueryDto): Promise<Array<Provider & { distanceKm: number }>> {
    const radius = dto.radius ?? 10

    const providers = await this.providerRepo
      .createQueryBuilder('p')
      .where('p.location_lat IS NOT NULL')
      .andWhere('p.location_lng IS NOT NULL')
      .andWhere('p.is_active = :active', { active: true })
      .andWhere('p.verification_status = :status', { status: VerificationStatus.APPROVED })
      .getMany()

    const results = providers
      .map(p => ({
        ...p,
        distanceKm: this.haversine(dto.lat, dto.lng, p.locationLat!, p.locationLng!),
      }))
      .filter(p => p.distanceKm <= radius)
      .sort((a, b) => a.distanceKm - b.distanceKm)

    return results
  }

  /** Provider: set shop vacation status (VAC-1) */
  async setVacation(
    userId: string,
    data: { shopStatus: 'OPEN' | 'VACATION' | 'CLOSED'; vacationMessage?: string; vacationUntil?: string },
  ) {
    const provider = await this.providerRepo.findOne({ where: { userId } })
    if (!provider) throw new NotFoundException('Provider profile not found')
    await this.providerRepo.update(provider.id, {
      shopStatus: data.shopStatus as ShopStatus,
      vacationMessage: data.vacationMessage ?? null,
      vacationUntil: data.vacationUntil ? new Date(data.vacationUntil) : null,
    })
    return this.findById(provider.id)
  }
}
