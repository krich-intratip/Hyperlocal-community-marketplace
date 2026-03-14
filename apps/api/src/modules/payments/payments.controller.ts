import {
  Controller, Post, Get, Param, Body,
  UseGuards, Req, HttpCode, HttpStatus,
} from '@nestjs/common'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { PaymentsService } from './payments.service'
import { InitiatePaymentDto } from './dto/initiate-payment.dto'

@ApiTags('payments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('initiate')
  @HttpCode(HttpStatus.CREATED)
  initiate(@Req() req: any, @Body() dto: InitiatePaymentDto) {
    return this.paymentsService.initiate(req.user.sub, dto)
  }

  @Get('order/:orderId')
  getByOrder(@Req() req: any, @Param('orderId') orderId: string) {
    return this.paymentsService.getByOrder(orderId, req.user.sub)
  }

  @Post(':id/simulate-pay')
  @HttpCode(HttpStatus.OK)
  simulatePay(@Req() req: any, @Param('id') id: string) {
    return this.paymentsService.simulatePay(id, req.user.sub)
  }
}
