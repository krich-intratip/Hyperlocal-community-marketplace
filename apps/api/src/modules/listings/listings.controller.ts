import { Controller, Get, Post, Patch, Delete, Param, Body, Query, Req, UseGuards } from '@nestjs/common'
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { ListingsService, ListingSortOption } from './listings.service'
import { MarketplaceCategory } from '@chm/shared-types'
import { SearchListingsDto } from './dto/search-listings.dto'
import { SetImagesDto } from './dto/set-images.dto'

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
    @Query('isHealthOption') isHealthOptionRaw?: string,
    @Query('minPrice') minPriceRaw?: string,
    @Query('maxPrice') maxPriceRaw?: string,
    @Query('sort') sort?: ListingSortOption,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const isHealthOption = isHealthOptionRaw === 'true' ? true : undefined
    const minPrice = minPriceRaw !== undefined ? parseFloat(minPriceRaw) : undefined
    const maxPrice = maxPriceRaw !== undefined ? parseFloat(maxPriceRaw) : undefined
    return this.listingsService.search({
      communityId, category, keyword, isHealthOption, minPrice, maxPrice, sort, page, limit,
    })
  }

  // ── INVENTORY-1: Provider listing management ─────────────────────────────────
  // Declared BEFORE :id to avoid route collision

  @Get('provider/my')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get all listings owned by the authenticated provider" })
  getMyListings(@Req() req: any) {
    return this.listingsService.getProviderListings(req.user.id)
  }

  @Get('provider/low-stock')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get listings with stock at or below the low-stock threshold" })
  getLowStockListings(@Req() req: any) {
    return this.listingsService.getLowStockListings(req.user.id)
  }

  // ── SEARCH-2: Advanced Search & Discovery ────────────────────────────────────
  // Declared BEFORE :id to avoid route collision

  @Get('search')
  @ApiOperation({ summary: 'Advanced search with full-text, filters, and pagination' })
  advancedSearch(@Query() dto: SearchListingsDto) {
    return this.listingsService.advancedSearch(dto)
  }

  @Patch(':id/stock')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update stock quantity for a listing' })
  updateStock(
    @Param('id') id: string,
    @Req() req: any,
    @Body() body: { stockQty: number | null; lowStockThreshold?: number },
  ) {
    return this.listingsService.updateStock(id, req.user.id, body)
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

  // ── MULTI-1: Multi-Image Listings ─────────────────────────────────────────────
  // Declared BEFORE generic :id PATCH to avoid route collision

  @Patch(':id/images')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Set/replace the images array for a listing (provider owner only)' })
  setImages(
    @Param('id') id: string,
    @Req() req: any,
    @Body() body: SetImagesDto,
  ) {
    return this.listingsService.setImages(id, req.user.id, body.images)
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a listing' })
  update(
    @Param('id') id: string,
    @Req() req: any,
    @Body() body: {
      title?: string
      description?: string
      category?: MarketplaceCategory
      price?: number
      priceUnit?: string
    },
  ) {
    return this.listingsService.update(id, req.user.id, body)
  }

  @Patch(':id/promotion')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Set or clear a flash-sale promotion on a listing' })
  setPromotion(
    @Param('id') id: string,
    @Req() req: any,
    @Body() body: { discountPercent: number | null; discountEndsAt: string | null },
  ) {
    return this.listingsService.setPromotion(id, req.user.id, body)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete (deactivate) a listing' })
  remove(@Param('id') id: string, @Req() req: any) {
    return this.listingsService.remove(id, req.user.id)
  }
}
