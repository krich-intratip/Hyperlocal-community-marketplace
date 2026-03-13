import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { NotificationsController } from './notifications.controller'
import { NotificationsService } from './notifications.service'
import { NotificationsGateway } from './notifications.gateway'
import { NotificationLog } from './entities/notification-log.entity'

@Module({
  imports: [TypeOrmModule.forFeature([NotificationLog])],
  controllers: [NotificationsController],
  providers: [NotificationsService, NotificationsGateway],
  exports: [NotificationsService, NotificationsGateway],
})
export class NotificationsModule {}
