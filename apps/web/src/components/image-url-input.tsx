'use client'
import { useState } from 'react'

interface ImageUrlInputProps {
  value: string[]
  onChange: (urls: string[]) => void
  maxImages?: number
  label?: string
}

export function ImageUrlInput({ value, onChange, maxImages = 20, label = 'รูปภาพ' }: ImageUrlInputProps) {
  const [newUrl, setNewUrl] = useState('')

  const addUrl = () => {
    const trimmed = newUrl.trim()
    if (!trimmed) return
    if (value.length >= maxImages) return
    if (value.includes(trimmed)) return
    onChange([...value, trimmed])
    setNewUrl('')
  }

  const removeUrl = (idx: number) => {
    onChange(value.filter((_, i) => i !== idx))
  }

  const moveUp = (idx: number) => {
    if (idx === 0) return
    const next = [...value]
    ;[next[idx - 1], next[idx]] = [next[idx], next[idx - 1]]
    onChange(next)
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-700">{label} ({value.length}/{maxImages})</label>

      {/* Existing URLs */}
      {value.map((url, i) => (
        <div key={i} className="flex items-center gap-2 glass-sm rounded-lg px-3 py-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt=""
            className="w-10 h-8 object-cover rounded flex-shrink-0"
            onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
          <span className="flex-1 text-xs text-slate-600 truncate">{url}</span>
          <div className="flex gap-1">
            {i > 0 && (
              <button onClick={() => moveUp(i)} className="text-slate-400 hover:text-slate-600 text-xs px-1">↑</button>
            )}
            {i === 0 && <span className="text-xs text-primary px-1">ปก</span>}
            <button onClick={() => removeUrl(i)} className="text-red-400 hover:text-red-600 text-xs px-1">✕</button>
          </div>
        </div>
      ))}

      {/* Add new URL */}
      {value.length < maxImages && (
        <div className="flex gap-2">
          <input
            type="url"
            value={newUrl}
            onChange={e => setNewUrl(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addUrl())}
            placeholder="https://example.com/image.jpg"
            className="flex-1 px-3 py-2 glass-sm rounded-lg text-sm border border-white/30 focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <button
            type="button"
            onClick={addUrl}
            disabled={!newUrl.trim()}
            className="px-3 py-2 bg-primary text-white rounded-lg text-sm disabled:opacity-40"
          >
            + เพิ่ม
          </button>
        </div>
      )}
    </div>
  )
}
