import {
  Controller, Get, Post, Patch, Body, Param, Query, UseGuards, Request,
} from '@nestjs/common'
import { ReturnsService } from './returns.service'
import { CreateReturnDto, UpdateReturnStatusDto } from './dto/create-return.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../auth/decorators/roles.decorator'
import { UserRole, ReturnStatus } from '@chm/shared-types'

@Controller('returns')
export class ReturnsController {
  constructor(private readonly service: ReturnsService) {}

  /** Customer: create a return request */
  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Request() req: any, @Body() dto: CreateReturnDto) {
    return this.service.create(req.user.id, dto)
  }

  /** Customer: get return request for their order */
  @Get('order/:orderId')
  @UseGuards(JwtAuthGuard)
  findByOrder(@Request() req: any, @Param('orderId') orderId: string) {
    return this.service.findByOrderId(orderId, req.user.id)
  }

  /** CA / Super Admin: list all return requests */
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.COMMUNITY_ADMIN, UserRole.SUPER_ADMIN)
  findAll(
    @Query('status') status?: ReturnStatus,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.service.findAll({
      status,
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
    })
  }

  /** CA / Super Admin: update return status */
  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.COMMUNITY_ADMIN, UserRole.SUPER_ADMIN)
  updateStatus(@Param('id') id: string, @Body() dto: UpdateReturnStatusDto) {
    return this.service.updateStatus(id, dto)
  }
}
