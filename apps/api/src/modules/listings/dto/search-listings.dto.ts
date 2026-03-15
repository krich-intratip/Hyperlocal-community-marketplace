import { IsString, IsOptional, IsNumber, IsEnum, Min, Max } from 'class-validator'
import { Type } from 'class-transformer'
import { ApiPropertyOptional } from '@nestjs/swagger'

export type SortBy = 'newest' | 'price_asc' | 'price_desc' | 'rating' | 'popular'

export class SearchListingsDto {
  @ApiPropertyOptional({ description: 'Full-text search query' })
  @IsString() @IsOptional()
  q?: string

  @ApiPropertyOptional({ description: 'Filter by category slug' })
  @IsString() @IsOptional()
  category?: string

  @ApiPropertyOptional({ description: 'Filter by community ID' })
  @IsString() @IsOptional()
  communityId?: string

  @ApiPropertyOptional({ description: 'Minimum price (฿)' })
  @IsNumber() @IsOptional() @Min(0) @Type(() => Number)
  minPrice?: number

  @ApiPropertyOptional({ description: 'Maximum price (฿)' })
  @IsNumber() @IsOptional() @Min(0) @Type(() => Number)
  maxPrice?: number

  @ApiPropertyOptional({ description: 'Minimum rating (1-5)' })
  @IsNumber() @IsOptional() @Min(1) @Max(5) @Type(() => Number)
  minRating?: number

  @ApiPropertyOptional({ enum: ['newest', 'price_asc', 'price_desc', 'rating', 'popular'], default: 'newest' })
  @IsEnum(['newest', 'price_asc', 'price_desc', 'rating', 'popular']) @IsOptional()
  sortBy?: SortBy

  @ApiPropertyOptional({ default: 1 })
  @IsNumber() @IsOptional() @Min(1) @Type(() => Number)
  page?: number

  @ApiPropertyOptional({ default: 20, maximum: 50 })
  @IsNumber() @IsOptional() @Min(1) @Max(50) @Type(() => Number)
  limit?: number
}
