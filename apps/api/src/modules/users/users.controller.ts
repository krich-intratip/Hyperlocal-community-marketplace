import { Controller, Get, Patch, Body, Req, UseGuards } from '@nestjs/common'
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { UsersService } from './users.service'
import { UpdateLanguageDto } from './dto/update-language.dto'

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  getMe(@Req() req: any) {
    return req.user
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update current user profile' })
  updateMe(@Req() req: any, @Body() body: { displayName?: string; phone?: string }) {
    return this.usersService.update(req.user.id, body)
  }

  @Patch('me/language')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Set preferred language (th/en)' })
  async setLanguage(@Req() req: any, @Body() dto: UpdateLanguageDto) {
    return this.usersService.setLanguage(req.user.id, dto.language)
  }
}
