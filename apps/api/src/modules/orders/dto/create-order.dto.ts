import {
  IsString,
  IsInt,
  IsOptional,
  Min,
  Max,
  ArrayMinSize,
  ValidateNested,
  IsNotEmpty,
} from 'class-validator'
import { Type } from 'class-transformer'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CreateOrderItemDto {
  @ApiProperty({ description: 'ID of the listing to order' })
  @IsString()
  @IsNotEmpty()
  listingId: string

  @ApiProperty({ description: 'Quantity (1–99)', minimum: 1, maximum: 99 })
  @IsInt()
  @Min(1)
  @Max(99)
  qty: number

  @ApiPropertyOptional({ description: 'Optional note for this item' })
  @IsString()
  @IsOptional()
  note?: string
}

export class CreateOrderDto {
  @ApiProperty({ description: 'Provider UUID fulfilling the order' })
  @IsString()
  @IsNotEmpty()
  providerId: string

  @ApiProperty({ description: 'Community UUID the order belongs to' })
  @IsString()
  @IsNotEmpty()
  communityId: string

  @ApiProperty({ type: [CreateOrderItemDto], description: 'At least one item required' })
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  @ArrayMinSize(1)
  items: CreateOrderItemDto[]

  @ApiPropertyOptional({ description: 'Delivery address (if needed)' })
  @IsString()
  @IsOptional()
  deliveryAddress?: string

  @ApiPropertyOptional({ description: 'Payment method', default: 'PROMPTPAY' })
  @IsString()
  @IsOptional()
  paymentMethod?: string

  @ApiPropertyOptional({ description: 'Order-level note' })
  @IsString()
  @IsOptional()
  note?: string
}
