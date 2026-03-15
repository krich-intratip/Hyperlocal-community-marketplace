import { IsEnum, IsString, IsOptional, MaxLength, MinLength } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { ReportType, ReportReason } from '@chm/shared-types'

export class CreateReportDto {
  @ApiProperty({ enum: ReportType })
  @IsEnum(ReportType)
  type: ReportType

  @ApiProperty({ description: 'ID of the entity being reported' })
  @IsString()
  @MinLength(1)
  targetId: string

  @ApiProperty({ enum: ReportReason })
  @IsEnum(ReportReason)
  reason: ReportReason

  @ApiProperty({ required: false, maxLength: 500 })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string
}
