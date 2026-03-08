import { Injectable, Logger } from '@nestjs/common'
import { NotificationType } from '@chm/shared-types'

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name)

  async send(userId: string, type: NotificationType, payload: Record<string, unknown>) {
    this.logger.log(`[NOTIFICATION] userId=${userId} type=${type} payload=${JSON.stringify(payload)}`)
  }
}
