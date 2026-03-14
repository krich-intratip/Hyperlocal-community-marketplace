import { Injectable, ServiceUnavailableException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { v4 as uuid } from 'uuid'

type UploadPurpose = 'avatar' | 'listing'

@Injectable()
export class UploadService {
  constructor(private readonly configService: ConfigService) {}

  async getPresignedUrl(
    filename: string,
    contentType: string,
    purpose: UploadPurpose,
  ): Promise<{ uploadUrl: string; publicUrl: string }> {
    const accountId = this.configService.get<string>('R2_ACCOUNT_ID')
    const accessKeyId = this.configService.get<string>('R2_ACCESS_KEY_ID')
    const secretAccessKey = this.configService.get<string>('R2_SECRET_ACCESS_KEY')
    const bucket = this.configService.get<string>('R2_BUCKET_NAME')
    const publicBase = this.configService.get<string>('R2_PUBLIC_BASE_URL')

    if (!accountId || !accessKeyId || !secretAccessKey || !bucket) {
      throw new ServiceUnavailableException(
        'ระบบ storage ยังไม่ถูกตั้งค่า (R2 credentials missing)',
      )
    }

    const ext = filename.split('.').pop() ?? 'jpg'
    const key = `${purpose}/${uuid()}.${ext}`

    const client = new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: { accessKeyId, secretAccessKey },
    })

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: contentType,
    })

    const uploadUrl = await getSignedUrl(client, command, { expiresIn: 300 })
    const publicUrl = publicBase
      ? `${publicBase.replace(/\/$/, '')}/${key}`
      : `https://${bucket}.${accountId}.r2.cloudflarestorage.com/${key}`

    return { uploadUrl, publicUrl }
  }
}
