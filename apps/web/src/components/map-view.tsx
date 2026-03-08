'use client'

import { useEffect, useRef } from 'react'
import { MapPin } from 'lucide-react'

export interface MapListing {
  id: string
  title: string
  provider: string
  price: number
  unit: string
  lat: number
  lng: number
  category: string
  status: 'available' | 'busy' | 'offline'
  rating: number
  image: string
}

interface MapViewProps {
  listings: MapListing[]
  onSelect?: (id: string) => void
  selectedId?: string
  centerLat?: number
  centerLng?: number
  zoom?: number
}

export function MapView({ listings, onSelect, selectedId, centerLat = 13.724, centerLng = 100.484, zoom = 14 }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<unknown>(null)

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    // Dynamically import leaflet to avoid SSR issues
    import('leaflet').then((L) => {
      if (!mapRef.current) return

      // Fix default icon path issue with webpack
      delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      })

      const map = L.map(mapRef.current!).setView([centerLat, centerLng], zoom)

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map)

      const statusColor: Record<string, string> = {
        available: '#16a34a',
        busy: '#d97706',
        offline: '#94a3b8',
      }

      listings.forEach((listing) => {
        const color = statusColor[listing.status] ?? '#3b82f6'
        const icon = L.divIcon({
          html: `<div style="
            background:${color};
            color:#fff;
            border:2px solid #fff;
            border-radius:50% 50% 50% 0;
            transform:rotate(-45deg);
            width:32px;height:32px;
            display:flex;align-items:center;justify-content:center;
            box-shadow:0 2px 8px rgba(0,0,0,0.25);
            font-size:14px;
            cursor:pointer;
          ">
            <span style="transform:rotate(45deg)">${listing.image}</span>
          </div>`,
          className: '',
          iconSize: [32, 32],
          iconAnchor: [16, 32],
          popupAnchor: [0, -36],
        })

        const marker = L.marker([listing.lat, listing.lng], { icon })
          .addTo(map)
          .bindPopup(
            `<div style="min-width:160px;font-family:Sarabun,sans-serif">
              <div style="font-weight:700;font-size:14px;margin-bottom:4px">${listing.title}</div>
              <div style="font-size:12px;color:#64748b;margin-bottom:4px">${listing.provider}</div>
              <div style="font-size:13px;font-weight:700;color:#1d4ed8">฿${listing.price}/${listing.unit}</div>
              <div style="font-size:11px;margin-top:4px">⭐ ${listing.rating}</div>
              <button onclick="window.__chmSelectListing('${listing.id}')" style="
                margin-top:8px;width:100%;padding:6px;
                background:#2563eb;color:#fff;border:none;border-radius:6px;
                font-size:12px;cursor:pointer;font-weight:600
              ">ดูรายละเอียด</button>
            </div>`,
            { maxWidth: 220 }
          )

        marker.on('click', () => onSelect?.(listing.id))
      })

      mapInstanceRef.current = map

      // Global callback for popup button
      ;(window as unknown as Record<string, unknown>).__chmSelectListing = (id: string) => onSelect?.(id)
    })

    return () => {
      if (mapInstanceRef.current) {
        ;(mapInstanceRef.current as { remove: () => void }).remove()
        mapInstanceRef.current = null
      }
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm">
      <div ref={mapRef} className="w-full h-[480px]" />
      {/* Legend overlay */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2 shadow-md">
        <div className="text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">สถานะผู้ให้บริการ</div>
        {[
          { color: '#16a34a', label: 'ว่างรับงาน' },
          { color: '#d97706', label: 'ไม่ว่างตอนนี้' },
          { color: '#94a3b8', label: 'หยุดชั่วคราว' },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1.5 mb-0.5">
            <div className="w-3 h-3 rounded-full" style={{ background: item.color }} />
            <span className="text-xs text-slate-600 dark:text-slate-300">{item.label}</span>
          </div>
        ))}
      </div>
      <div className="absolute top-4 right-4 z-[1000] bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-lg border border-slate-200 dark:border-slate-700 px-2 py-1 shadow-sm">
        <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
          <MapPin className="h-3 w-3" />
          {listings.length} บริการ
        </div>
      </div>
    </div>
  )
}
