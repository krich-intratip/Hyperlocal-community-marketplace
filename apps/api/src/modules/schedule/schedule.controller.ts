import { Controller, Get, Post, Patch, Delete, Param, Body, Req, UseGuards } from '@nestjs/common'
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { ScheduleService } from './schedule.service'
import { SetScheduleDto } from './dto/set-schedule.dto'
import { AddHolidayDto } from './dto/add-holiday.dto'

// ── Public endpoints: GET /providers/:id/schedule ───────────────────────────

@ApiTags('Schedule')
@Controller('providers')
export class ProviderSchedulePublicController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Get(':id/schedule')
  @ApiOperation({ summary: 'Get provider schedule (public)' })
  getPublicSchedule(@Param('id') id: string) {
    return this.scheduleService.getPublicSchedule(id)
  }
}

// ── Authenticated provider endpoints: /providers/me/... ─────────────────────
// Declared as a SEPARATE controller with 'providers/me' prefix so that
// NestJS registers it before the ':id' wildcard controller above, avoiding
// route collision between GET /providers/me/schedule and GET /providers/:id/schedule.

@ApiTags('Schedule')
@Controller('providers/me')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProviderScheduleMeController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Get('schedule')
  @ApiOperation({ summary: 'Get my weekly schedule' })
  getMySchedule(@Req() req: any) {
    return this.scheduleService.getScheduleByUserId(req.user.id as string)
  }

  @Patch('schedule')
  @ApiOperation({ summary: 'Update my weekly schedule' })
  setMySchedule(@Req() req: any, @Body() dto: SetScheduleDto) {
    return this.scheduleService.setSchedule(req.user.id as string, dto)
  }

  @Get('holidays')
  @ApiOperation({ summary: 'Get my holidays/off days' })
  getMyHolidays(@Req() req: any) {
    return this.scheduleService.getHolidays(req.user.id as string)
  }

  @Post('holidays')
  @ApiOperation({ summary: 'Add a holiday/off day' })
  addHoliday(@Req() req: any, @Body() dto: AddHolidayDto) {
    return this.scheduleService.addHoliday(req.user.id as string, dto)
  }

  @Delete('holidays/:date')
  @ApiOperation({ summary: 'Remove a holiday/off day (date: YYYY-MM-DD)' })
  removeHoliday(@Req() req: any, @Param('date') date: string) {
    return this.scheduleService.removeHoliday(req.user.id as string, date)
  }
}
