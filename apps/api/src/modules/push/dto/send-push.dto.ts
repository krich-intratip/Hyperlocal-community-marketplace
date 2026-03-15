import { IsString, IsOptional, MaxLength, IsArray } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class SendPushDto {
  @ApiProperty({ description: 'Target user IDs (empty = broadcast to all active)' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  userIds?: string[]

  @ApiProperty({ description: 'Notification title' })
  @IsString()
  @MaxLength(100)
  title: string

  @ApiProperty({ description: 'Notification body' })
  @IsString()
  @MaxLength(300)
  body: string

  @ApiProperty({ required: false, description: 'URL to open on click' })
  @IsOptional()
  @IsString()
  url?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  icon?: string
}
