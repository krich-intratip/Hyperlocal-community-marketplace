import { Injectable, Logger, Inject } from '@nestjs/common'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager'
import { NotificationType } from '@chm/shared-types'

const NOTIF_COUNT_TTL = 30 * 1000

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name)

  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  async send(userId: string, type: NotificationType, payload: Record<string, unknown>) {
    this.logger.log(`[NOTIFICATION] userId=${userId} type=${type} payload=${JSON.stringify(payload)}`)
    await this.cache.del(`notif:count:${userId}`)
  }

  async getUnreadCount(userId: string): Promise<number> {
    const cacheKey = `notif:count:${userId}`
    const cached = await this.cache.get<number>(cacheKey)
    if (cached !== undefined && cached !== null) return cached
    const count = 0
    await this.cache.set(cacheKey, count, NOTIF_COUNT_TTL)
    return count
  }
}
