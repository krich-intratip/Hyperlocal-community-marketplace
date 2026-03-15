import { IsNumber, Min, Max } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'

export class SetLocationDto {
  @ApiProperty({ description: 'Latitude (-90 to 90)', example: 13.7563 })
  @IsNumber() @Min(-90) @Max(90) @Type(() => Number)
  latitude: number

  @ApiProperty({ description: 'Longitude (-180 to 180)', example: 100.5018 })
  @IsNumber() @Min(-180) @Max(180) @Type(() => Number)
  longitude: number
}
