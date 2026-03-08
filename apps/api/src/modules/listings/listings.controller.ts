import { Controller, Get, Post, Patch, Delete, Param, Body, Query, Req, UseGuards } from '@nestjs/common'
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { ListingsService } from './listings.service'
import { MarketplaceCategory } from '@chm/shared-types'

@ApiTags('Listings')
@Controller('listings')
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @Get()
  @ApiOperation({ summary: 'Search listings' })
  search(
    @Query('communityId') communityId?: string,
    @Query('category') category?: MarketplaceCategory,
    @Query('keyword') keyword?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.listingsService.search({ communityId, category, keyword, page, limit })
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get listing detail' })
  findOne(@Param('id') id: string) {
    return this.listingsService.findById(id)
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new listing' })
  create(
    @Req() req: any,
    @Body() body: {
      communityId: string; title: string; description: string
      category: MarketplaceCategory; price: number; priceUnit?: string
    },
  ) {
    return this.listingsService.create(req.user.id, body)
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a listing' })
  update(@Param('id') id: string, @Req() req: any, @Body() body: any) {
    return this.listingsService.update(id, req.user.id, body)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete (deactivate) a listing' })
  remove(@Param('id') id: string, @Req() req: any) {
    return this.listingsService.remove(id, req.user.id)
  }
}
