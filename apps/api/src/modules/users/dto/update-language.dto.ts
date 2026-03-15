import { IsIn } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateLanguageDto {
  @ApiProperty({ enum: ['th', 'en'], description: 'Preferred language code' })
  @IsIn(['th', 'en'])
  language: 'th' | 'en'
}
