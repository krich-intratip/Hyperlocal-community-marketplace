import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, Between, FindOptionsWhere } from 'typeorm'
import { AuditLog } from './entities/audit-log.entity'
import { AuditAction } from '@chm/shared-types'

export interface LogAuditParams {
  userId?: string | null
  action: AuditAction
  resource?: string | null
  resourceId?: string | null
  meta?: Record<string, unknown> | null
  ipAddress?: string | null
  userAgent?: string | null
  success?: boolean
}

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditRepo: Repository<AuditLog>,
  ) {}

  /** Fire-and-forget audit log write */
  log(params: LogAuditParams): void {
    this.auditRepo
      .save(
        this.auditRepo.create({
          userId: params.userId ?? null,
          action: params.action,
          resource: params.resource ?? null,
          resourceId: params.resourceId ?? null,
          meta: params.meta ? JSON.stringify(params.meta) : null,
          ipAddress: params.ipAddress ?? null,
          userAgent: params.userAgent ? params.userAgent.slice(0, 200) : null,
          success: params.success ?? true,
        }),
      )
      .catch(() => {
        /* never throw from audit logging */
      })
  }

  /** SuperAdmin: query audit logs with filters */
  async query(opts: {
    userId?: string
    action?: AuditAction
    resource?: string
    success?: boolean
    from?: Date
    to?: Date
    limit?: number
    offset?: number
  }): Promise<{ logs: AuditLog[]; total: number }> {
    const where: FindOptionsWhere<AuditLog> = {}
    if (opts.userId) where.userId = opts.userId
    if (opts.action) where.action = opts.action
    if (opts.resource) where.resource = opts.resource
    if (opts.success !== undefined) where.success = opts.success
    if (opts.from && opts.to) where.createdAt = Between(opts.from, opts.to)

    const [logs, total] = await this.auditRepo.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      take: Math.min(opts.limit ?? 50, 200),
      skip: opts.offset ?? 0,
    })
    return { logs, total }
  }

  /** Quick stats for dashboard */
  async getStats(): Promise<{
    total: number
    failedLast24h: number
    loginFailedLast24h: number
  }> {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
    const [total, failedLast24h, loginFailedLast24h] = await Promise.all([
      this.auditRepo.count(),
      this.auditRepo.count({
        where: { success: false, createdAt: Between(yesterday, new Date()) },
      }),
      this.auditRepo.count({
        where: { action: AuditAction.LOGIN_FAILED, createdAt: Between(yesterday, new Date()) },
      }),
    ])
    return { total, failedLast24h, loginFailedLast24h }
  }
}
