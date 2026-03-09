import { Controller, Get, Post, Patch, Param, Body, Req, UseGuards } from '@nestjs/common'
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { BookingsService } from './bookings.service'
import { BookingStatus } from '@chm/shared-types'

@ApiTags('Bookings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a booking (price calculated server-side from listing)' })
  create(
    @Req() req: any,
    @Body() body: {
      listingId: string
      providerId: string
      communityId: string
      scheduledAt: string
      note?: string
    },
  ) {
    return this.bookingsService.create(req.user.id, body)
  }

  @Get('my')
  @ApiOperation({ summary: 'Get my bookings (as customer)' })
  getMyBookings(@Req() req: any) {
    return this.bookingsService.getByCustomer(req.user.id)
  }

  @Get('provider')
  @ApiOperation({ summary: 'Get my bookings (as provider)' })
  getProviderBookings(@Req() req: any) {
    return this.bookingsService.getByProvider(req.user.id)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get booking detail' })
  findOne(@Param('id') id: string) {
    return this.bookingsService.findById(id)
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update booking status' })
  updateStatus(
    @Param('id') id: string,
    @Req() req: any,
    @Body() body: { status: BookingStatus },
  ) {
    return this.bookingsService.updateStatus(id, req.user.id, body.status)
  }
}
