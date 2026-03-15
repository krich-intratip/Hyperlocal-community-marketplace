import { IsArray, IsString, MaxLength, ArrayMaxSize } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class SetImagesDto {
  @ApiProperty({
    description: 'Array of image URLs (max 20 items, each URL max 500 chars)',
    type: [String],
    example: ['https://example.com/img1.jpg', 'https://example.com/img2.jpg'],
  })
  @IsArray()
  @ArrayMaxSize(20, { message: 'Cannot have more than 20 images per listing' })
  @IsString({ each: true })
  @MaxLength(500, { each: true, message: 'Each image URL must be at most 500 characters' })
  images: string[]
}
