import { Controller, Post, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { IsString, IsIn, IsOptional } from 'class-validator'
import { UploadService } from './upload.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

class PresignDto {
  @IsString()
  filename: string

  @IsString()
  contentType: string

  @IsOptional()
  @IsIn(['avatar', 'listing'])
  purpose?: 'avatar' | 'listing'
}

@ApiTags('Upload')
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('presign')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get presigned URL for direct upload to R2 object storage' })
  async presign(@Body() body: PresignDto) {
    const result = await this.uploadService.getPresignedUrl(
      body.filename,
      body.contentType,
      body.purpose ?? 'avatar',
    )
    return { data: result }
  }
}
