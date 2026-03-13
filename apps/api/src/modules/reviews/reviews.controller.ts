import { Controller, Get, Post, Patch, Param, Body, Req, UseGuards } from '@nestjs/common'
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { ReviewsService } from './reviews.service'

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a review for a completed booking' })
  create(
    @Req() req: any,
    @Body() body: { bookingId: string; rating: number; comment?: string },
  ) {
    return this.reviewsService.create(req.user.id, body)
  }

  @Get('booking/:bookingId')
  @ApiOperation({ summary: 'Get review for a specific booking (if any)' })
  getByBooking(@Param('bookingId') bookingId: string) {
    return this.reviewsService.findByBooking(bookingId)
  }

  /**
   * Public endpoint — returns ONLY visible reviews with PDPA-masked reviewer IDs.
   * Transparency score included in provider stats endpoint.
   */
  @Get('provider/:id')
  @ApiOperation({ summary: 'Get visible reviews for a provider (public, PDPA-safe)' })
  getByProvider(@Param('id') id: string) {
    return this.reviewsService.findByProviderPublic(id)
  }

  /**
   * Provider dashboard — returns ALL reviews (visible + hidden) for management.
   * JWT required — provider sees their own reviews unmasked.
   */
  @Get('provider/:id/manage')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all reviews for provider dashboard (JWT, includes hidden)' })
  getByProviderManage(@Param('id') id: string) {
    return this.reviewsService.findByProvider(id)
  }

  @Get('provider/:id/stats')
  @ApiOperation({ summary: 'Get review stats for a provider (includes transparencyScore)' })
  getStats(@Param('id') id: string) {
    return this.reviewsService.getProviderStats(id)
  }

  @Patch(':id/reply')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Provider reply to a review' })
  reply(
    @Param('id') id: string,
    @Req() req: any,
    @Body() body: { replyText: string },
  ) {
    return this.reviewsService.addReply(id, req.user.id, body.replyText)
  }

  /** RV-2: Provider toggles visibility of a review (approve/hide) */
  @Patch(':id/visibility')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Provider sets review visibility (approve=true / hide=false)' })
  setVisibility(
    @Param('id') id: string,
    @Req() req: any,
    @Body() body: { isVisible: boolean },
  ) {
    return this.reviewsService.setVisibility(id, req.user.id, body.isVisible)
  }
}
