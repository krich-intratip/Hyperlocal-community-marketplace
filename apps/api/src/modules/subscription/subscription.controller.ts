import { Controller, Get, Patch, Post, Body, Query, Req, UseGuards } from '@nestjs/common'
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../auth/decorators/roles.decorator'
import { SubscriptionService } from './subscription.service'
import { SubscriptionTier, UserRole } from '@chm/shared-types'

@ApiTags('subscriptions')
@Controller('subscriptions')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  /** Public — list all available plans */
  @Get('plans')
  @ApiOperation({ summary: 'List all subscription plans (public)' })
  getPlans() {
    return this.subscriptionService.getPlans()
  }

  /** Provider — get my current subscription */
  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my subscription (provider)' })
  getMySubscription(@Req() req: any) {
    // req.user.providerId should be available, else use userId as fallback key
    return this.subscriptionService.getMySubscription(req.user.id)
  }

  /** Provider — cancel subscription */
  @Post('me/cancel')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancel subscription (revert to FREE at expiry)' })
  cancel(@Req() req: any) {
    return this.subscriptionService.cancel(req.user.id)
  }

  /** SuperAdmin — set tier for a provider */
  @Patch('admin/set-tier')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Set subscription tier (Super Admin only)' })
  setTier(@Body() body: { providerId: string; tier: SubscriptionTier; months?: number }) {
    return this.subscriptionService.setTier(body.providerId, body.tier, body.months ?? 1)
  }

  /** SuperAdmin — list all subscriptions */
  @Get('admin/list')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all subscriptions (Super Admin only)' })
  @ApiQuery({ name: 'tier', required: false, enum: SubscriptionTier })
  listAll(@Query('tier') tier?: SubscriptionTier) {
    return this.subscriptionService.listAll(tier)
  }
}
