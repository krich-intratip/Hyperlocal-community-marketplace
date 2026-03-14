import {
  Controller, Get, Post, Patch, Body, Param,
  UseGuards, Query, ParseIntPipe, DefaultValuePipe,
} from '@nestjs/common'
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger'
import { IsBoolean, IsEnum } from 'class-validator'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../auth/decorators/roles.decorator'
import { CommunitiesService } from '../communities/communities.service'
import { ProvidersService } from '../providers/providers.service'
import { AdminService } from './admin.service'
import { UserRole } from '@chm/shared-types'

class SetUserStatusDto {
  @IsBoolean()
  isActive: boolean
}

class SetUserRoleDto {
  @IsEnum(UserRole)
  role: UserRole
}

@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SUPER_ADMIN)
@Controller('admin')
export class AdminController {
  constructor(
    private readonly communitiesService: CommunitiesService,
    private readonly providersService: ProvidersService,
    private readonly adminService: AdminService,
  ) {}

  @Get('communities')
  listCommunities() { return this.communitiesService.findAll() }

  @Post('communities')
  createCommunity(@Body() body: any) { return body }

  @Get('communities/:id/pending-providers')
  getPendingProviders(@Param('id') id: string) {
    return this.providersService.getPendingByCommunity(id)
  }

  @Get('users')
  listUsers(
    @Query('search') search?: string,
    @Query('role') role?: string,
    @Query('isActive') isActive?: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit?: number,
  ) {
    return this.adminService.listUsers({ search, role, isActive, page, limit })
  }

  @Patch('users/:id/status')
  setUserStatus(@Param('id') id: string, @Body() dto: SetUserStatusDto) {
    return this.adminService.setUserStatus(id, dto.isActive)
  }

  @Patch('users/:id/role')
  setUserRole(@Param('id') id: string, @Body() dto: SetUserRoleDto) {
    return this.adminService.setUserRole(id, dto.role)
  }

  @Get('providers/pending-all')
  getPendingAll() { return this.adminService.getPendingAll() }

  @Get('providers/all')
  getAllProviders(@Query('status') status?: string, @Query('communityId') communityId?: string) {
    return this.adminService.getAllProviders({ status, communityId })
  }

  @Post('providers/:id/approve')
  approveProvider(@Param('id') id: string) { return this.providersService.approve(id) }

  @Post('providers/:id/reject')
  rejectProvider(@Param('id') id: string) { return this.providersService.reject(id) }

  @Get('revenue')
  getRevenue() { return this.adminService.getRevenueSummary() }

  @Get('stats')
  getStats() { return this.adminService.getPlatformStats() }
}
