import { IsString, Matches, IsOptional } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class AddHolidayDto {
  @ApiProperty({ description: 'Date in YYYY-MM-DD format', example: '2026-04-13' })
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'date must be YYYY-MM-DD' })
  date: string

  @ApiPropertyOptional()
  @IsString() @IsOptional()
  reason?: string
}
