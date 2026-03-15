import { Controller, Get, UseGuards } from '@nestjs/common'
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { AnalyticsService } from './analytics.service'

@ApiTags('Analytics')
@Controller('analytics')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('platform')
  @ApiOperation({ summary: 'Get platform-wide analytics (superadmin)' })
  getPlatformAnalytics() {
    return this.analyticsService.getPlatformAnalytics()
  }
}
