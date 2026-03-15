'use client'
import { useState } from 'react'

interface ImageGalleryProps {
  images: string[]
  alt?: string
  className?: string
}

const PLACEHOLDER = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'

export function ImageGallery({ images, alt = 'รูปภาพ', className = '' }: ImageGalleryProps) {
  const allImages = images.length > 0 ? images : [PLACEHOLDER]
  const [activeIdx, setActiveIdx] = useState(0)

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {/* Main image */}
      <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-slate-100">
        <img
          src={allImages[activeIdx]}
          alt={`${alt} ${activeIdx + 1}`}
          className="w-full h-full object-cover transition-opacity duration-200"
          onError={e => { (e.target as HTMLImageElement).src = PLACEHOLDER }}
        />
        {allImages.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full">
            {activeIdx + 1} / {allImages.length}
          </div>
        )}
        {/* Arrow navigation */}
        {allImages.length > 1 && (
          <>
            <button
              onClick={() => setActiveIdx(i => (i - 1 + allImages.length) % allImages.length)}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full w-8 h-8 flex items-center justify-center transition-colors"
            >
              ‹
            </button>
            <button
              onClick={() => setActiveIdx(i => (i + 1) % allImages.length)}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full w-8 h-8 flex items-center justify-center transition-colors"
            >
              ›
            </button>
          </>
        )}
      </div>

      {/* Thumbnail strip (only if > 1 image) */}
      {allImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {allImages.map((src, i) => (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              className={`flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                i === activeIdx ? 'border-primary shadow-md' : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <img
                src={src}
                alt={`${alt} thumbnail ${i + 1}`}
                className="w-full h-full object-cover"
                onError={e => { (e.target as HTMLImageElement).src = PLACEHOLDER }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
