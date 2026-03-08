import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common'
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../auth/decorators/roles.decorator'
import { CommunitiesService } from '../communities/communities.service'
import { ProvidersService } from '../providers/providers.service'
import { UserRole } from '@chm/shared-types'

@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SUPER_ADMIN)
@Controller('admin')
export class AdminController {
  constructor(
    private readonly communitiesService: CommunitiesService,
    private readonly providersService: ProvidersService,
  ) {}

  @Get('communities')
  @ApiOperation({ summary: '[Super Admin] List all communities' })
  listCommunities() {
    return this.communitiesService.findAll()
  }

  @Post('communities')
  @ApiOperation({ summary: '[Super Admin] Create a community' })
  createCommunity(
    @Body() body: {
      name: string; slug: string; description?: string
      adminId: string; commissionRate?: number; revenueShareRate?: number
    },
  ) {
    return body
  }

  @Get('communities/:id/pending-providers')
  @ApiOperation({ summary: '[Super Admin] List pending providers for a community' })
  getPendingProviders(@Param('id') id: string) {
    return this.providersService.getPendingByCommunity(id)
  }
}
