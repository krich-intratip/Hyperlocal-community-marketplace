import { Injectable, Logger, Inject } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager'
import { NotificationType } from '@chm/shared-types'
import { NotificationLog } from './entities/notification-log.entity'

const UNREAD_COUNT_TTL = 30 * 1000 // 30 s

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name)

  constructor(
    @InjectRepository(NotificationLog)
    private readonly notifRepo: Repository<NotificationLog>,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  // ── Write ────────────────────────────────────────────────────────────────────

  /**
   * Persist a notification for a user and bust the unread-count cache.
   * Called internally by other services (e.g. OrdersService on status change).
   */
  async send(
    userId: string,
    type: NotificationType,
    title: string,
    body: string,
    opts: { href?: string; data?: Record<string, unknown> } = {},
  ): Promise<NotificationLog> {
    this.logger.log(`[NOTIF] userId=${userId} type=${type}`)
    const notif = this.notifRepo.create({
      userId,
      type,
      title,
      body,
      href: opts.href ?? null,
      data: opts.data ?? null,
      isRead: false,
    })
    const saved = await this.notifRepo.save(notif)
    await this.cache.del(`notif:count:${userId}`)
    return saved
  }

  // ── Read ─────────────────────────────────────────────────────────────────────

  async findForUser(userId: string, limit = 30): Promise<NotificationLog[]> {
    return this.notifRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: limit,
    })
  }

  async getUnreadCount(userId: string): Promise<number> {
    const cacheKey = `notif:count:${userId}`
    const cached = await this.cache.get<number>(cacheKey)
    if (cached !== undefined && cached !== null) return cached
    const count = await this.notifRepo.count({ where: { userId, isRead: false } })
    await this.cache.set(cacheKey, count, UNREAD_COUNT_TTL)
    return count
  }

  // ── Mark-read ─────────────────────────────────────────────────────────────────

  /** Mark a single notification as read (validates ownership via userId). */
  async markRead(id: string, userId: string): Promise<void> {
    await this.notifRepo.update({ id, userId }, { isRead: true })
    await this.cache.del(`notif:count:${userId}`)
  }

  /** Mark all of the user's notifications as read. */
  async markAllRead(userId: string): Promise<void> {
    await this.notifRepo.update({ userId, isRead: false }, { isRead: true })
    await this.cache.set(`notif:count:${userId}`, 0, UNREAD_COUNT_TTL)
  }
}
