import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { PushSubscription } from './entities/push-subscription.entity'
import { SubscribeDto } from './dto/subscribe.dto'
import { SendPushDto } from './dto/send-push.dto'

@Injectable()
export class PushService {
  private readonly logger = new Logger(PushService.name)

  constructor(
    @InjectRepository(PushSubscription)
    private readonly subRepo: Repository<PushSubscription>,
  ) {}

  /** Save or update a push subscription for a user */
  async subscribe(userId: string, dto: SubscribeDto): Promise<PushSubscription> {
    // Check if this endpoint already exists for this user
    let sub = await this.subRepo.findOne({
      where: { userId, endpoint: dto.endpoint },
    })
    if (!sub) {
      sub = this.subRepo.create({ userId })
    }
    sub.endpoint = dto.endpoint
    sub.p256dh = dto.p256dh
    sub.auth = dto.auth
    sub.userAgent = dto.userAgent ?? null
    sub.isActive = true
    return this.subRepo.save(sub)
  }

  /** Remove a push subscription (user unsubscribes) */
  async unsubscribe(userId: string, endpoint: string): Promise<void> {
    await this.subRepo.update(
      { userId, endpoint },
      { isActive: false },
    )
  }

  /** Get all active subscriptions for a user */
  async getUserSubscriptions(userId: string): Promise<PushSubscription[]> {
    return this.subRepo.find({ where: { userId, isActive: true } })
  }

  /**
   * Send push notification.
   * In this phase, logs the payload. Real web-push (VAPID) to be wired later.
   */
  async sendPush(dto: SendPushDto): Promise<{ sent: number; failed: number }> {
    let subs: PushSubscription[]

    if (dto.userIds && dto.userIds.length > 0) {
      // Target specific users
      subs = await this.subRepo
        .createQueryBuilder('ps')
        .where('ps.user_id IN (:...ids)', { ids: dto.userIds })
        .andWhere('ps.is_active = :active', { active: true })
        .getMany()
    } else {
      // Broadcast to all active subscribers
      subs = await this.subRepo.find({ where: { isActive: true } })
    }

    const payload = {
      title: dto.title,
      body: dto.body,
      url: dto.url ?? '/',
      icon: dto.icon ?? '/icons/icon-192x192.png',
    }

    this.logger.log(
      `[PUSH] Sending to ${subs.length} subscription(s): ${JSON.stringify(payload)}`,
    )

    // TODO: Wire real web-push here when VAPID keys are configured
    // For now, simulate success
    return { sent: subs.length, failed: 0 }
  }

  /** Admin: count all active subscriptions */
  async getStats(): Promise<{ total: number; active: number }> {
    const [total, active] = await Promise.all([
      this.subRepo.count(),
      this.subRepo.count({ where: { isActive: true } }),
    ])
    return { total, active }
  }
}
