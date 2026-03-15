import { Controller, Post, Patch, Get, Param, Body, Query, Req, UseGuards } from '@nestjs/common'
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../auth/decorators/roles.decorator'
import { ProvidersService } from './providers.service'
import { UserRole } from '@chm/shared-types'
import { SetLocationDto } from './dto/set-location.dto'
import { NearbyQueryDto } from './dto/nearby-query.dto'

@ApiTags('Providers')
@Controller('providers')
export class ProvidersController {
  constructor(private readonly providersService: ProvidersService) {}

  @Get()
  @ApiOperation({ summary: 'List approved providers (public)' })
  @ApiQuery({ name: 'communityId', required: false })
  findAll(@Query('communityId') communityId?: string) {
    return this.providersService.findAll({ communityId })
  }

  @Post('apply')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Apply to become a provider' })
  apply(
    @Req() req: any,
    @Body() body: { communityId: string; displayName: string; bio?: string; serviceRadius?: number },
  ) {
    return this.providersService.apply(req.user.id, body)
  }

  @Get('me')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get my provider profile' })
  getMyProfile(@Req() req: any) {
    return this.providersService.findMyProfile(req.user.id)
  }

  // ─── GEO-1: Geolocation & Nearby Discovery ────────────────────────────────

  @Get('nearby')
  @ApiOperation({ summary: 'Get providers near a location (public)' })
  getNearby(@Query() dto: NearbyQueryDto) {
    return this.providersService.getNearby(dto)
  }

  @Patch('me/location')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Set my GPS location (provider)' })
  setLocation(@Req() req: any, @Body() dto: SetLocationDto) {
    return this.providersService.setLocation(req.user.id, dto)
  }

  // ──────────────────────────────────────────────────────────────────────────

  @Get(':id')
  @ApiOperation({ summary: 'Get provider public profile' })
  findOne(@Param('id') id: string) {
    return this.providersService.findById(id)
  }

  @Post(':id/approve')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.COMMUNITY_ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Approve a provider (admin only)' })
  approve(@Param('id') id: string) {
    return this.providersService.approve(id)
  }

  @Post(':id/reject')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.COMMUNITY_ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Reject a provider (admin only)' })
  reject(@Param('id') id: string) {
    return this.providersService.reject(id)
  }

  /** Provider: set vacation / reopen shop */
  @Patch('me/vacation')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Set shop vacation status' })
  setVacation(
    @Req() req: any,
    @Body() body: { shopStatus: 'OPEN' | 'VACATION' | 'CLOSED'; vacationMessage?: string; vacationUntil?: string },
  ) {
    return this.providersService.setVacation(req.user.id, body)
  }
}
