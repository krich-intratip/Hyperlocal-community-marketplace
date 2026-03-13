import { Controller, Get, Patch, Param, Req, UseGuards } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { NotificationsService } from './notifications.service'

@ApiTags('Notifications')
@Controller('notifications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  /**
   * GET /notifications — list most-recent notifications for the authenticated user.
   */
  @Get()
  @ApiOperation({ summary: 'List notifications for current user' })
  async list(@Req() req: any) {
    const notifs = await this.notificationsService.findForUser(req.user.id)
    return { data: notifs }
  }

  /**
   * GET /notifications/unread-count — fast cached unread badge count.
   */
  @Get('unread-count')
  @ApiOperation({ summary: 'Get unread notification count' })
  async getUnreadCount(@Req() req: any) {
    const count = await this.notificationsService.getUnreadCount(req.user.id)
    return { count }
  }

  /**
   * PATCH /notifications/read-all — mark all as read.
   * IMPORTANT: must be declared BEFORE :id to avoid route collision.
   */
  @Patch('read-all')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  async markAllRead(@Req() req: any) {
    await this.notificationsService.markAllRead(req.user.id)
    return { success: true }
  }

  /**
   * PATCH /notifications/:id/read — mark a single notification as read.
   */
  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark a single notification as read' })
  async markRead(@Param('id') id: string, @Req() req: any) {
    await this.notificationsService.markRead(id, req.user.id)
    return { success: true }
  }
}
