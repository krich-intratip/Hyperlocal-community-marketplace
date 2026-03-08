'use client'

import { useQuery } from '@tanstack/react-query'

export interface MockCommunity {
  id: string
  name: string
  type: 'village' | 'condo' | 'city'
  province: string
  members: number
  providers: number
  activeListings: number
  image: string
  description: string
  lat: number
  lng: number
}

const MOCK_COMMUNITIES: MockCommunity[] = [
  { id: '1', name: 'หมู่บ้านศรีนคร', type: 'village', province: 'กรุงเทพฯ', members: 342, providers: 18, activeListings: 24, image: '🏘️', description: 'หมู่บ้านจัดสรรขนาดกลาง ใกล้รถไฟฟ้า ชุมชนเข้มแข็ง', lat: 13.7563, lng: 100.5018 },
  { id: '2', name: 'คอนโด The Base', type: 'condo', province: 'กรุงเทพฯ', members: 520, providers: 12, activeListings: 15, image: '🏢', description: 'คอนโดมิเนียมระดับพรีเมียม ใจกลางเมือง ผู้พักอาศัยหลากหลาย', lat: 13.7460, lng: 100.5340 },
  { id: '3', name: 'ชุมชนเมืองทอง', type: 'village', province: 'นนทบุรี', members: 890, providers: 45, activeListings: 67, image: '🌆', description: 'ชุมชนขนาดใหญ่ ครบครัน ตลาดชุมชนที่คึกคักที่สุด', lat: 13.8696, lng: 100.5472 },
  { id: '4', name: 'หมู่บ้านกรีนวิลล์', type: 'village', province: 'สมุทรปราการ', members: 215, providers: 9, activeListings: 12, image: '🌿', description: 'หมู่บ้านสไตล์ธรรมชาติ บรรยากาศร่มรื่น เหมาะสำหรับครอบครัว', lat: 13.5990, lng: 100.6060 },
  { id: '5', name: 'ชุมชนริมน้ำ', type: 'village', province: 'นนทบุรี', members: 178, providers: 7, activeListings: 9, image: '🌊', description: 'ชุมชนริมแม่น้ำเจ้าพระยา วิถีชีวิตเรียบง่าย ผลิตภัณฑ์ชุมชนดั้งเดิม', lat: 13.8000, lng: 100.4900 },
  { id: '6', name: 'เมืองเชียงใหม่ซิตี้', type: 'city', province: 'เชียงใหม่', members: 1240, providers: 78, activeListings: 112, image: '🏔️', description: 'ศูนย์กลางบริการชุมชนภาคเหนือ อาหาร วัฒนธรรม และบริการหลากหลาย', lat: 18.7883, lng: 98.9853 },
]

export const communityKeys = {
  all: ['communities'] as const,
  list: () => [...communityKeys.all, 'list'] as const,
  detail: (id: string) => [...communityKeys.all, 'detail', id] as const,
}

async function fetchCommunities(): Promise<MockCommunity[]> {
  await new Promise((r) => setTimeout(r, 150))
  return MOCK_COMMUNITIES
}

async function fetchCommunityById(id: string): Promise<MockCommunity | null> {
  await new Promise((r) => setTimeout(r, 100))
  return MOCK_COMMUNITIES.find((c) => c.id === id) ?? null
}

export function useCommunities() {
  return useQuery({
    queryKey: communityKeys.list(),
    queryFn: fetchCommunities,
    staleTime: 5 * 60 * 1000,
  })
}

export function useCommunity(id: string) {
  return useQuery({
    queryKey: communityKeys.detail(id),
    queryFn: () => fetchCommunityById(id),
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
  })
}
