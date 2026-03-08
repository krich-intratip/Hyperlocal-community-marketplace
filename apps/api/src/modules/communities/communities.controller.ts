import { Controller, Get, Post, Delete, Param, Req, UseGuards, Body, Patch } from '@nestjs/common'
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../auth/decorators/roles.decorator'
import { CommunitiesService } from './communities.service'
import { UserRole } from '@chm/shared-types'

@ApiTags('Communities')
@Controller('communities')
export class CommunitiesController {
  constructor(private readonly communitiesService: CommunitiesService) {}

  @Get()
  @ApiOperation({ summary: 'List all active communities' })
  findAll() {
    return this.communitiesService.findAll()
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get community detail' })
  findOne(@Param('id') id: string) {
    return this.communitiesService.findById(id)
  }

  @Post(':id/join')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Join a community' })
  join(@Param('id') id: string, @Req() req: any) {
    return this.communitiesService.join(id, req.user.id)
  }

  @Delete(':id/leave')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Leave a community' })
  leave(@Param('id') id: string, @Req() req: any) {
    return this.communitiesService.leave(id, req.user.id)
  }

  @Get(':id/members')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.COMMUNITY_ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List community members (admin only)' })
  getMembers(@Param('id') id: string) {
    return this.communitiesService.getMembers(id)
  }

  @Patch(':id/trial')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.COMMUNITY_ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Set community trial period' })
  setTrial(
    @Param('id') id: string,
    @Body() body: { startDate: string; endDate: string },
  ) {
    return this.communitiesService.setTrialPeriod(
      id,
      new Date(body.startDate),
      new Date(body.endDate),
    )
  }
}
