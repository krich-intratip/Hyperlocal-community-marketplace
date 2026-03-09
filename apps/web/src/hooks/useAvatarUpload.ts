'use client'

import { useState } from 'react'
import { uploadApi } from '@/lib/api'

const USE_REAL_API = !!process.env.NEXT_PUBLIC_API_BASE_URL
const MAX_SIZE_BYTES = 5 * 1024 * 1024 // 5 MB

/**
 * Hook for uploading avatar images.
 * - Real API mode: requests presigned URL → PUT to R2/Supabase → returns publicUrl
 * - Mock mode: creates blob URL, simulates delay, returns blob URL
 *
 * Returns `publicUrl` (or blob URL) on success, `null` on failure.
 * The caller is responsible for persisting the URL via usersApi.updateProfile / updateUser.
 */
export function useAvatarUpload() {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)

  async function upload(file: File): Promise<string | null> {
    if (!file.type.startsWith('image/')) {
      setUploadError('กรุณาเลือกไฟล์รูปภาพเท่านั้น')
      return null
    }
    if (file.size > MAX_SIZE_BYTES) {
      setUploadError('ขนาดไฟล์ต้องไม่เกิน 5 MB')
      return null
    }

    setUploadError(null)
    setUploading(true)

    // Show local preview immediately
    const blobUrl = URL.createObjectURL(file)
    setPreview(blobUrl)

    try {
      if (USE_REAL_API) {
        // 1. Request presigned URL from backend
        const presignRes = await uploadApi.presignAvatar(file.name, file.type)
        const { uploadUrl, publicUrl } = presignRes.data.data

        // 2. Upload directly to object storage
        const putRes = await fetch(uploadUrl, {
          method: 'PUT',
          body: file,
          headers: { 'Content-Type': file.type },
        })
        if (!putRes.ok) throw new Error('Storage upload failed')

        return publicUrl
      } else {
        // Mock: simulate upload delay
        await new Promise((r) => setTimeout(r, 800))
        return blobUrl
      }
    } catch {
      setUploadError('อัปโหลดไม่สำเร็จ กรุณาลองใหม่')
      setPreview(null)
      return null
    } finally {
      setUploading(false)
    }
  }

  return { upload, uploading, preview, uploadError }
}
