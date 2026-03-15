'use client'
import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import type { NearbyProvider } from '@/lib/api'

// Fix Leaflet default icon for Next.js (no SSR, so require is safe here)
function fixLeafletIcon() {
  if (typeof window === 'undefined') return
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const L = require('leaflet') as typeof import('leaflet')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete (L.Icon.Default.prototype as any)._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  })
}

interface ProvidersMapProps {
  providers: NearbyProvider[]
  center: [number, number]
  zoom?: number
  className?: string
}

export function ProvidersMap({ providers, center, zoom = 13, className = '' }: ProvidersMapProps) {
  useEffect(() => {
    fixLeafletIcon()
  }, [])

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      className={`h-full w-full rounded-xl ${className}`}
      style={{ minHeight: '400px' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {providers.map(p => (
        <Marker key={p.id} position={[p.latitude, p.longitude]}>
          <Popup>
            <div className="min-w-[160px]">
              <p className="font-semibold text-sm">{p.displayName}</p>
              {p.rating > 0 && (
                <p className="text-xs text-amber-600">⭐ {p.rating.toFixed(1)} ({p.reviewCount})</p>
              )}
              <p className="text-xs text-slate-500">
                📍 {p.distanceKm.toFixed(1)} กม.
              </p>
              <a
                href={`/providers/${p.id}`}
                className="mt-2 block text-center text-xs bg-primary text-white rounded px-2 py-1"
              >
                ดูร้าน →
              </a>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
