import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { ReportStatus } from '@chm/shared-types'

export class ResolveReportDto {
  @ApiProperty({ enum: [ReportStatus.RESOLVED, ReportStatus.DISMISSED] })
  @IsEnum(ReportStatus)
  status: ReportStatus.RESOLVED | ReportStatus.DISMISSED

  @ApiProperty({ required: false, maxLength: 500 })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  adminNote?: string
}
