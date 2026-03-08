import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common'
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../auth/decorators/roles.decorator'
import { DashboardService } from './dashboard.service'
import { UserRole } from '@chm/shared-types'

@ApiTags('Dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('provider')
  @ApiOperation({ summary: 'Provider dashboard metrics' })
  providerDashboard(@Req() req: any) {
    return this.dashboardService.getProviderDashboard(req.user.id)
  }

  @Get('community-admin')
  @UseGuards(RolesGuard)
  @Roles(UserRole.COMMUNITY_ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Community admin dashboard metrics' })
  communityAdminDashboard(@Query('communityId') communityId: string) {
    return this.dashboardService.getCommunityAdminDashboard(communityId)
  }

  @Get('super-admin')
  @UseGuards(RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Super admin platform-wide metrics' })
  superAdminDashboard() {
    return this.dashboardService.getSuperAdminDashboard()
  }
}
