import {
  IsString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsDateString,
  Min,
  MaxLength,
} from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { CouponType, CouponScope } from '../entities/coupon.entity'

export class CreateCouponDto {
  @ApiProperty({ example: 'SUMMER20' })
  @IsString()
  @MaxLength(50)
  code: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string

  @ApiProperty({ enum: ['PERCENT', 'FIXED', 'FREE_DELIVERY'] })
  @IsEnum(['PERCENT', 'FIXED', 'FREE_DELIVERY'])
  type: CouponType

  @ApiProperty({ description: '% for PERCENT, ฿ for FIXED, 0 for FREE_DELIVERY', example: 20 })
  @IsNumber()
  @Min(0)
  discountValue: number

  @ApiPropertyOptional({ description: 'Minimum order amount to use coupon', default: 0 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  minOrderAmount?: number

  @ApiPropertyOptional({ description: 'Max ฿ discount for PERCENT type' })
  @IsNumber()
  @IsOptional()
  @Min(0)
  maxDiscountAmount?: number

  @ApiProperty({ enum: ['PLATFORM', 'PROVIDER'], default: 'PLATFORM' })
  @IsEnum(['PLATFORM', 'PROVIDER'])
  @IsOptional()
  scope?: CouponScope

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  providerId?: string

  @ApiPropertyOptional({ description: 'Max total uses (null=unlimited)' })
  @IsNumber()
  @IsOptional()
  @Min(1)
  maxUses?: number

  @ApiPropertyOptional({ default: 1 })
  @IsNumber()
  @IsOptional()
  @Min(1)
  maxUsesPerUser?: number

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  startsAt?: string

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  expiresAt?: string
}
