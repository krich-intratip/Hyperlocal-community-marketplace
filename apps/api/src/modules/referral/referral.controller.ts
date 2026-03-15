import { Controller, Get, Req, UseGuards } from '@nestjs/common'
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { ReferralService } from './referral.service'

@ApiTags('Referral')
@Controller('referral')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ReferralController {
  constructor(private readonly referralService: ReferralService) {}

  @Get('my-code')
  @ApiOperation({ summary: 'Get referral code for current user' })
  getMyCode(@Req() req: { user: { id: string } }) {
    return this.referralService.getMyCode(req.user.id)
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get referral statistics for current user' })
  getStats(@Req() req: { user: { id: string } }) {
    return this.referralService.getStats(req.user.id)
  }
}
