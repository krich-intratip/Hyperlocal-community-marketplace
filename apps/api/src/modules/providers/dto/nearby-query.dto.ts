import { IsNumber, IsOptional, Min, Max } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'

export class NearbyQueryDto {
  @ApiProperty({ description: 'User latitude', example: 13.7563 })
  @IsNumber() @Min(-90) @Max(90) @Type(() => Number)
  lat: number

  @ApiProperty({ description: 'User longitude', example: 100.5018 })
  @IsNumber() @Min(-180) @Max(180) @Type(() => Number)
  lng: number

  @ApiPropertyOptional({ description: 'Search radius in km (default 10, max 50)', default: 10 })
  @IsNumber() @IsOptional() @Min(1) @Max(50) @Type(() => Number)
  radius?: number

  @ApiPropertyOptional({ description: 'Filter by category' })
  @IsOptional()
  category?: string
}
