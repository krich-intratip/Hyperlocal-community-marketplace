import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common'
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CouponService } from './coupon.service'
import { CreateCouponDto } from './dto/create-coupon.dto'
import { ValidateCouponDto } from './dto/validate-coupon.dto'

@ApiTags('Coupons')
@Controller('coupons')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  // ── Public: validate coupon code ─────────────────────────────────────────────
  @Post('validate')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Validate a coupon code and get discount amount' })
  validate(@Req() req: Request & { user: { id: string } }, @Body() dto: ValidateCouponDto) {
    return this.couponService.validate(req.user.id, dto)
  }

  // ── Admin/SuperAdmin: manage coupons ─────────────────────────────────────────
  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all coupons (admin/superadmin)' })
  findAll() {
    return this.couponService.findAll()
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a coupon (admin/superadmin/provider)' })
  create(
    @Req() req: Request & { user: { id: string } },
    @Body() dto: CreateCouponDto,
  ) {
    return this.couponService.create(req.user.id, dto)
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a single coupon by ID' })
  getOne(@Param('id') id: string) {
    return this.couponService.findOne(id)
  }

  @Patch(':id/deactivate')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Deactivate a coupon' })
  deactivate(@Param('id') id: string) {
    return this.couponService.deactivate(id)
  }

  @Patch(':id/activate')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Activate a coupon' })
  activate(@Param('id') id: string) {
    return this.couponService.activate(id)
  }
}
