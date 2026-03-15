import { IsString, IsNumber, IsOptional, Min } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class ValidateCouponDto {
  @ApiProperty({ example: 'SUMMER20' })
  @IsString()
  code: string

  @ApiProperty({ description: 'Cart total before discount', example: 500 })
  @IsNumber()
  @Min(0)
  orderTotal: number

  @ApiPropertyOptional({ description: 'Provider ID if ordering from specific provider' })
  @IsString()
  @IsOptional()
  providerId?: string
}
