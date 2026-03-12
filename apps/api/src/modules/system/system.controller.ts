import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { UserRole } from '@chm/shared-types'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../auth/decorators/roles.decorator'
import { SystemService } from './system.service'

@ApiTags('system')
@Controller('system')
export class SystemController {
  constructor(private readonly systemService: SystemService) {}

  /**
   * GET /system/mode — public endpoint.
   * Returns current system mode (training or production).
   * Frontend polls this on load; 5-minute client-side cache.
   */
  @Get('mode')
  @ApiOperation({ summary: 'Get current system mode (training or production)' })
  async getMode(): Promise<{ mode: 'training' | 'production'; isTrainingMode: boolean }> {
    const isTrainingMode = await this.systemService.getTrainingMode()
    return { mode: isTrainingMode ? 'training' : 'production', isTrainingMode }
  }

  /**
   * PATCH /system/mode — Super Admin only.
   * Toggle training mode on or off.
   */
  @Patch('mode')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Toggle system mode — Super Admin only' })
  async setMode(@Body() body: { trainingMode: boolean }): Promise<{ success: boolean }> {
    return this.systemService.setTrainingMode(body.trainingMode)
  }
}
