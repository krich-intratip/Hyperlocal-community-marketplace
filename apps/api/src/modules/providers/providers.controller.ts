import { Controller, Post, Get, Patch, Param, Body, Req, UseGuards } from '@nestjs/common'
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../auth/decorators/roles.decorator'
import { ProvidersService } from './providers.service'
import { UserRole } from '@chm/shared-types'

@ApiTags('Providers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('providers')
export class ProvidersController {
  constructor(private readonly providersService: ProvidersService) {}

  @Post('apply')
  @ApiOperation({ summary: 'Apply to become a provider' })
  apply(
    @Req() req: any,
    @Body() body: { communityId: string; displayName: string; bio?: string; serviceRadius?: number },
  ) {
    return this.providersService.apply(req.user.id, body)
  }

  @Get('me')
  @ApiOperation({ summary: 'Get my provider profile' })
  getMyProfile(@Req() req: any) {
    return this.providersService.findMyProfile(req.user.id)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get provider public profile' })
  findOne(@Param('id') id: string) {
    return this.providersService.findById(id)
  }

  @Post(':id/approve')
  @UseGuards(RolesGuard)
  @Roles(UserRole.COMMUNITY_ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Approve a provider (admin only)' })
  approve(@Param('id') id: string) {
    return this.providersService.approve(id)
  }

  @Post(':id/reject')
  @UseGuards(RolesGuard)
  @Roles(UserRole.COMMUNITY_ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Reject a provider (admin only)' })
  reject(@Param('id') id: string) {
    return this.providersService.reject(id)
  }
}
