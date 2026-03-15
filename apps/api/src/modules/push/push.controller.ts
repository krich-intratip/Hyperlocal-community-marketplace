import { Controller, Post, Delete, Get, Body, Query, Req, UseGuards } from '@nestjs/common'
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../auth/decorators/roles.decorator'
import { PushService } from './push.service'
import { SubscribeDto } from './dto/subscribe.dto'
import { SendPushDto } from './dto/send-push.dto'
import { UserRole } from '@chm/shared-types'

@ApiTags('push')
@Controller('push')
export class PushController {
  constructor(private readonly pushService: PushService) {}

  /** Authenticated user — register push subscription */
  @Post('subscribe')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Register browser push subscription' })
  subscribe(@Req() req: any, @Body() dto: SubscribeDto) {
    return this.pushService.subscribe(req.user.id, dto)
  }

  /** Authenticated user — unsubscribe */
  @Delete('unsubscribe')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Unsubscribe from push notifications' })
  unsubscribe(@Req() req: any, @Query('endpoint') endpoint: string) {
    return this.pushService.unsubscribe(req.user.id, endpoint)
  }

  /** Authenticated user — list my subscriptions */
  @Get('my-subscriptions')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my push subscriptions' })
  getMySubscriptions(@Req() req: any) {
    return this.pushService.getUserSubscriptions(req.user.id)
  }

  /** SuperAdmin — send push notification */
  @Post('send')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Send push notification (SuperAdmin)' })
  send(@Body() dto: SendPushDto) {
    return this.pushService.sendPush(dto)
  }

  /** SuperAdmin — stats */
  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Push subscription stats (SuperAdmin)' })
  getStats() {
    return this.pushService.getStats()
  }
}
