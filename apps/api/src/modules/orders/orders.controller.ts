import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { OrdersService } from './orders.service'
import { CreateOrderDto } from './dto/create-order.dto'
import { Order } from './entities/order.entity'

@ApiTags('orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Place a new cart order (multi-item)' })
  @ApiCreatedResponse({ type: Order })
  create(@Req() req: any, @Body() dto: CreateOrderDto): Promise<Order> {
    return this.ordersService.create(req.user.id, dto)
  }

  @Get('my')
  @ApiOperation({ summary: "Get the authenticated customer's orders" })
  @ApiOkResponse({ type: [Order] })
  findMyOrders(@Req() req: any): Promise<Order[]> {
    return this.ordersService.findMyOrders(req.user.id)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single order by ID' })
  @ApiOkResponse({ type: Order })
  findOne(@Req() req: any, @Param('id') id: string): Promise<Order> {
    return this.ordersService.findOne(id, req.user.id)
  }
}
