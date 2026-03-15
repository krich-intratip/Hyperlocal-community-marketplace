import { IsNumber, Min, Max } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'

export class InBoundsQueryDto {
  @ApiProperty({ description: 'North latitude boundary', example: 14.0 })
  @IsNumber() @Min(-90) @Max(90) @Type(() => Number)
  north: number

  @ApiProperty({ description: 'South latitude boundary', example: 13.5 })
  @IsNumber() @Min(-90) @Max(90) @Type(() => Number)
  south: number

  @ApiProperty({ description: 'East longitude boundary', example: 101.0 })
  @IsNumber() @Min(-180) @Max(180) @Type(() => Number)
  east: number

  @ApiProperty({ description: 'West longitude boundary', example: 100.2 })
  @IsNumber() @Min(-180) @Max(180) @Type(() => Number)
  west: number
}
