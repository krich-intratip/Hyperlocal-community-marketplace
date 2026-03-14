import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common'
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { LoyaltyService } from './loyalty.service'

@ApiTags('Loyalty')
@Controller('loyalty')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class LoyaltyController {
  constructor(private readonly loyaltyService: LoyaltyService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get loyalty account for current user' })
  getMyAccount(@Req() req: any) {
    return this.loyaltyService.getAccount(req.user.id)
  }

  @Get('transactions')
  @ApiOperation({ summary: 'Get loyalty transaction history' })
  getTransactions(@Req() req: any, @Query('limit') limit?: string) {
    return this.loyaltyService.getTransactions(req.user.id, limit ? parseInt(limit) : 20)
  }
}
