import { Controller, Get, Post, Param, Body, Req, UseGuards } from '@nestjs/common'
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
    @Body() body: { bookingId: string; providerId: string; rating: number; comment?: string },
  ) {
    return this.reviewsService.create(req.user.id, body)
  }

  @Get('provider/:id')
  @ApiOperation({ summary: 'Get reviews for a provider' })
  getByProvider(@Param('id') id: string) {
    return this.reviewsService.findByProvider(id)
  }

  @Get('provider/:id/stats')
  @ApiOperation({ summary: 'Get review stats for a provider' })
  getStats(@Param('id') id: string) {
    return this.reviewsService.getProviderStats(id)
  }
}
