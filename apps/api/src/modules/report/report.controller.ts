import { Controller, Post, Get, Patch, Body, Param, Query, Req, UseGuards } from '@nestjs/common'
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../auth/decorators/roles.decorator'
import { ReportService } from './report.service'
import { CreateReportDto } from './dto/create-report.dto'
import { ResolveReportDto } from './dto/resolve-report.dto'
import { ReportStatus, ReportType, UserRole } from '@chm/shared-types'

@ApiTags('reports')
@Controller('reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  /** Authenticated user — submit a report */
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Submit a report' })
  create(@Req() req: Request & { user: { id: string } }, @Body() dto: CreateReportDto) {
    return this.reportService.create(req.user.id, dto)
  }

  /** SuperAdmin — stats (declared before :id param routes to avoid collision) */
  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get report stats (SuperAdmin)' })
  getStats() {
    return this.reportService.getStats()
  }

  /** SuperAdmin — list all reports */
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all reports (SuperAdmin)' })
  @ApiQuery({ name: 'status', required: false, enum: ReportStatus })
  @ApiQuery({ name: 'type', required: false, enum: ReportType })
  listAll(
    @Query('status') status?: ReportStatus,
    @Query('type') type?: ReportType,
  ) {
    return this.reportService.listAll(status, type)
  }

  /** SuperAdmin — resolve or dismiss a report */
  @Patch(':id/resolve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Resolve or dismiss a report (SuperAdmin)' })
  resolve(
    @Param('id') id: string,
    @Req() req: Request & { user: { id: string } },
    @Body() dto: ResolveReportDto,
  ) {
    return this.reportService.resolve(id, req.user.id, dto)
  }
}
