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
  constructor(private readonly communitiesService: CommunitiesService) { }

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

  /* ─── Invite Link System ────────────────────────────────────────── */

  /**
   * GET /communities/join/:code
   * Public endpoint — validates an invite code and returns community preview.
   * Called by the /join/[code] Next.js page before displaying community info.
   */
  @Get('join/:code')
  @ApiOperation({ summary: 'Validate invite code and return community info (public)' })
  getInviteInfo(@Param('code') code: string) {
    return this.communitiesService.getByInviteCode(code)
  }

  /**
   * GET /communities/my/invite-code
   * Returns the invite code + community name for the requesting CA.
   */
  @Get('my/invite-code')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.COMMUNITY_ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my community invite code (CA)' })
  getMyInviteCode(@Req() req: any) {
    return this.communitiesService.getInviteCodeForAdmin(req.user.id)
  }

  /**
   * GET /communities/my/pending-members
   * Returns providers with PENDING approval status in the CA's community.
   */
  @Get('my/pending-members')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.COMMUNITY_ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List pending provider members (CA)' })
  getPendingMembers(@Req() req: any) {
    return this.communitiesService.getPendingMembers(req.user.id)
  }

  /**
   * PATCH /communities/my/members/:memberId/approve
   * CA approves a pending provider member.
   */
  @Patch('my/members/:memberId/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.COMMUNITY_ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Approve a pending provider member (CA)' })
  approveMember(
    @Param('memberId') memberId: string,
    @Req() req: any,
  ) {
    return this.communitiesService.approveMember(memberId, req.user.id)
  }

  /**
   * PATCH /communities/my/members/:memberId/reject
   * CA rejects a pending provider member.
   */
  @Patch('my/members/:memberId/reject')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.COMMUNITY_ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reject a pending provider member (CA)' })
  rejectMember(
    @Param('memberId') memberId: string,
    @Req() req: any,
  ) {
    return this.communitiesService.rejectMember(memberId, req.user.id)
  }
}
