import { IsArray, IsBoolean, IsIn, IsInt, IsOptional, IsString, Matches, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class DayScheduleDto {
  @ApiProperty({ description: 'Day of week 0=Sun 6=Sat', minimum: 0, maximum: 6 })
  @IsInt() @IsIn([0, 1, 2, 3, 4, 5, 6])
  dayOfWeek: number

  @ApiProperty()
  @IsBoolean()
  isOpen: boolean

  @ApiPropertyOptional()
  @IsString() @IsOptional()
  @Matches(/^\d{2}:\d{2}$/, { message: 'openTime must be HH:mm' })
  openTime?: string

  @ApiPropertyOptional()
  @IsString() @IsOptional()
  @Matches(/^\d{2}:\d{2}$/, { message: 'closeTime must be HH:mm' })
  closeTime?: string
}

export class SetScheduleDto {
  @ApiProperty({ type: [DayScheduleDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DayScheduleDto)
  days: DayScheduleDto[]
}
