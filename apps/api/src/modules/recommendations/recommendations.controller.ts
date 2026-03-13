import { Controller, Get, Query } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger'
import { RecommendationsService } from './recommendations.service'

@ApiTags('Recommendations')
@Controller('recommendations')
export class RecommendationsController {
  constructor(private readonly recommendationsService: RecommendationsService) {}

  /**
   * SR-1: Get personalized listing recommendations.
   * Public endpoint — pass userId for personalisation, omit for popular fallback.
   */
  @Get()
  @ApiOperation({ summary: 'Get personalized listing recommendations (public)' })
  @ApiQuery({ name: 'userId', required: false, description: 'User UUID for personalised recommendations' })
  @ApiQuery({ name: 'limit',  required: false, description: 'Max results to return (default 8, max 20)' })
  get(
    @Query('userId') userId?: string,
    @Query('limit')  limit?: string,
  ) {
    const safeLimit = Math.min(20, Math.max(1, parseInt(limit ?? '8') || 8))
    return this.recommendationsService.getRecommendations(userId || undefined, safeLimit)
  }
}
