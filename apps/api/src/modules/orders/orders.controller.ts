import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Body,
  Req,
  Query,
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
import { UpdateOrderStatusDto } from './dto/update-order-status.dto'
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

  // ── BE-3: Provider incoming orders ──────────────────────────────────────────
  // Must be declared BEFORE :id to avoid route collision

  @Get('provider/incoming')
  @ApiOperation({ summary: "Get all orders assigned to the authenticated provider" })
  @ApiOkResponse({ type: [Order] })
  findProviderOrders(@Req() req: any): Promise<Order[]> {
    return this.ordersService.findProviderOrders(req.user.id)
  }

  // ── EARN-1: Provider earnings ────────────────────────────────────────────────

  @Get('provider/earnings')
  @ApiOperation({ summary: "Get the provider's earnings summary for a given period" })
  getProviderEarnings(
    @Req() req: any,
    @Query('period') period: string = '30d',
  ) {
    return this.ordersService.getProviderEarnings(req.user.id, period)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single order by ID' })
  @ApiOkResponse({ type: Order })
  findOne(@Req() req: any, @Param('id') id: string): Promise<Order> {
    return this.ordersService.findOne(id, req.user.id)
  }

  // ── BE-1: Delivery info ──────────────────────────────────────────────────────

  @Get(':id/delivery')
  @ApiOperation({ summary: 'Get delivery info and tracking ID for an order' })
  getDelivery(@Req() req: any, @Param('id') id: string) {
    return this.ordersService.getDelivery(id, req.user.id, req.user.role)
  }

  // ── BE-2: Status transition ──────────────────────────────────────────────────

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update order status (role-gated transitions)' })
  @ApiOkResponse({ type: Order })
  updateStatus(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto,
  ): Promise<Order> {
    return this.ordersService.updateStatus(id, req.user.id, req.user.role, dto)
  }
}
