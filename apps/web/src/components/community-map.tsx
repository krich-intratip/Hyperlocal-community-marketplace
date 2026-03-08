'use client'

import { useEffect, useRef } from 'react'

export interface MapMarker {
  id: string
  lat: number
  lng: number
  title: string
  description?: string
  color?: 'blue' | 'green' | 'amber' | 'red'
}

interface CommunityMapProps {
  markers: MapMarker[]
  center?: [number, number]
  zoom?: number
  className?: string
  onMarkerClick?: (id: string) => void
}

const COLOR_HEX: Record<string, string> = {
  blue: '#2563eb',
  green: '#16a34a',
  amber: '#d97706',
  red: '#dc2626',
}

export function CommunityMap({
  markers,
  center = [13.7563, 100.5018],
  zoom = 11,
  className = 'h-64 w-full rounded-2xl overflow-hidden',
  onMarkerClick,
}: CommunityMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<import('leaflet').Map | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined' || !mapRef.current) return
    if (mapInstanceRef.current) return

    import('leaflet').then((L) => {
      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link')
        link.id = 'leaflet-css'
        link.rel = 'stylesheet'
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
        document.head.appendChild(link)
      }

      const map = L.map(mapRef.current!, {
        center,
        zoom,
        zoomControl: true,
        scrollWheelZoom: false,
      })

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://openstreetmap.org">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map)

      markers.forEach((m) => {
        const color = COLOR_HEX[m.color ?? 'blue']
        const icon = L.divIcon({
          html: `<div style="
            width:32px;height:32px;border-radius:50% 50% 50% 0;
            background:${color};border:3px solid white;
            box-shadow:0 2px 8px rgba(0,0,0,0.3);
            transform:rotate(-45deg);cursor:pointer;
          "></div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 32],
          className: '',
        })

        const marker = L.marker([m.lat, m.lng], { icon })
          .addTo(map)
          .bindPopup(`<b style="font-family:system-ui;font-size:13px">${m.title}</b>${m.description ? `<br/><span style="font-size:11px;color:#64748b">${m.description}</span>` : ''}`)

        if (onMarkerClick) {
          marker.on('click', () => onMarkerClick(m.id))
        }
      })

      mapInstanceRef.current = map
    })

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (!mapInstanceRef.current) return
    mapInstanceRef.current.setView(center, zoom)
  }, [center, zoom])

  return <div ref={mapRef} className={className} />
}
