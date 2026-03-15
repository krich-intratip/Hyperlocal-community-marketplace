import { IsString, IsUrl, MinLength } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class SubscribeDto {
  @ApiProperty({ description: 'Browser push endpoint URL' })
  @IsUrl()
  endpoint: string

  @ApiProperty({ description: 'p256dh public key' })
  @IsString()
  @MinLength(10)
  p256dh: string

  @ApiProperty({ description: 'auth secret' })
  @IsString()
  @MinLength(4)
  auth: string

  @ApiProperty({ required: false })
  @IsString()
  userAgent?: string
}
