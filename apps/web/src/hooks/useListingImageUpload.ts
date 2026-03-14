'use client'

import { useState } from 'react'
import { uploadApi } from '@/lib/api'

const USE_REAL_API = !!process.env.NEXT_PUBLIC_API_BASE_URL
const MAX_SIZE_BYTES = 8 * 1024 * 1024 // 8 MB
const MAX_IMAGES = 5

/**
 * Hook for uploading listing images (up to MAX_IMAGES).
 * - Real API mode: requests presigned URL → PUT to R2 → returns publicUrl
 * - Mock/dev mode: creates blob URLs, simulates delay
 *
 * `images`: current list of uploaded image URLs
 * `addImages(files)`: upload new files (appends to existing)
 * `removeImage(index)`: remove by index
 */
export function useListingImageUpload(initialImages: string[] = []) {
  const [images, setImages] = useState<string[]>(initialImages)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function addImages(files: FileList | File[]) {
    const fileArr = Array.from(files)
    const remaining = MAX_IMAGES - images.length
    if (remaining <= 0) {
      setError(`อัปโหลดได้สูงสุด ${MAX_IMAGES} รูป`)
      return
    }

    const toUpload = fileArr.slice(0, remaining)
    for (const file of toUpload) {
      if (!file.type.startsWith('image/')) {
        setError('กรุณาเลือกไฟล์รูปภาพเท่านั้น')
        return
      }
      if (file.size > MAX_SIZE_BYTES) {
        setError('ขนาดไฟล์ต้องไม่เกิน 8 MB')
        return
      }
    }

    setError(null)
    setUploading(true)

    try {
      const results: string[] = []
      for (const file of toUpload) {
        if (USE_REAL_API) {
          const presignRes = await uploadApi.presignListing(file.name, file.type)
          const { uploadUrl, publicUrl } = presignRes.data.data
          const putRes = await fetch(uploadUrl, {
            method: 'PUT',
            body: file,
            headers: { 'Content-Type': file.type },
          })
          if (!putRes.ok) throw new Error('Storage upload failed')
          results.push(publicUrl)
        } else {
          // Mock: use blob URL + simulate delay
          await new Promise((r) => setTimeout(r, 600))
          results.push(URL.createObjectURL(file))
        }
      }
      setImages((prev) => [...prev, ...results])
    } catch {
      setError('อัปโหลดไม่สำเร็จ กรุณาลองใหม่')
    } finally {
      setUploading(false)
    }
  }

  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  function reset() {
    setImages(initialImages)
    setError(null)
  }

  function setExternalImages(urls: string[]) {
    setImages(urls)
    setError(null)
  }

  return { images, uploading, error, addImages, removeImage, reset, setExternalImages }
}
