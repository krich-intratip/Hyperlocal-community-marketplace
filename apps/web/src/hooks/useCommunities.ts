'use client'

import { useQuery } from '@tanstack/react-query'
import { communitiesApi } from '@/lib/api'

const USE_REAL_API = !!process.env.NEXT_PUBLIC_API_BASE_URL

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
  // ── กรุงเทพฯ และปริมณฑล ────────────────────────────────────────────
  { id: '1', name: 'หมู่บ้านศรีนคร', type: 'village', province: 'กรุงเทพฯ', members: 342, providers: 34, activeListings: 24, image: '🏘️', description: 'หมู่บ้านจัดสรรขนาดกลาง ใกล้รถไฟฟ้า ชุมชนเข้มแข็ง บริการหลากหลาย', lat: 13.7563, lng: 100.5018 },
  { id: '2', name: 'คอนโด The Base', type: 'condo', province: 'กรุงเทพฯ', members: 520, providers: 22, activeListings: 15, image: '🏢', description: 'คอนโดมิเนียมระดับพรีเมียม ใจกลางเมือง ผู้พักอาศัยหลากหลาย', lat: 13.7460, lng: 100.5340 },
  { id: '3', name: 'ชุมชนเมืองทอง', type: 'village', province: 'นนทบุรี', members: 890, providers: 45, activeListings: 67, image: '🌆', description: 'ชุมชนขนาดใหญ่ ครบครัน ตลาดชุมชนที่คึกคักที่สุดในระบบ', lat: 13.8696, lng: 100.5472 },
  { id: '4', name: 'หมู่บ้านกรีนวิลล์', type: 'village', province: 'กรุงเทพฯ', members: 215, providers: 18, activeListings: 12, image: '🌿', description: 'หมู่บ้านสไตล์ธรรมชาติ บรรยากาศร่มรื่น เหมาะสำหรับครอบครัว', lat: 13.7590, lng: 100.6060 },
  { id: '5', name: 'ชุมชนริมน้ำ', type: 'village', province: 'ปทุมธานี', members: 178, providers: 12, activeListings: 9, image: '🌊', description: 'ชุมชนริมแม่น้ำเจ้าพระยา วิถีชีวิตเรียบง่าย เน้นเกษตรอินทรีย์', lat: 13.8000, lng: 100.4900 },
  { id: '11', name: 'สุขุมวิท อาร์บัน', type: 'condo', province: 'กรุงเทพฯ', members: 780, providers: 52, activeListings: 48, image: '🏙️', description: 'ชุมชนคนเมืองย่านสุขุมวิท ฟรีแลนซ์ IT และบริการระดับพรีเมียม', lat: 13.7400, lng: 100.5710 },
  // ── ภาคเหนือ ────────────────────────────────────────────────────────
  { id: '6', name: 'เมืองเชียงใหม่ซิตี้', type: 'city', province: 'เชียงใหม่', members: 1240, providers: 78, activeListings: 112, image: '🏔️', description: 'ศูนย์กลางบริการชุมชนภาคเหนือ อาหาร วัฒนธรรม และบริการหลากหลาย', lat: 18.7883, lng: 98.9853 },
  { id: '7', name: 'นิมมานเฮมิน วิลเลจ', type: 'condo', province: 'เชียงใหม่', members: 420, providers: 35, activeListings: 38, image: '☕', description: 'ย่านฮิปสเตอร์นิมมานเฮมิน สปา คาเฟ่ ฟรีแลนซ์ สำหรับ Digital Nomad', lat: 18.7960, lng: 98.9680 },
  { id: '12', name: 'เชียงราย เมืองเก่า', type: 'city', province: 'เชียงราย', members: 340, providers: 28, activeListings: 22, image: '🌸', description: 'แหล่งท่องเที่ยวเชียงราย OTOP งานหัตถกรรม ชาดอยสูง', lat: 19.9105, lng: 99.8406 },
  // ── ภาคใต้ ──────────────────────────────────────────────────────────
  { id: '8', name: 'ป่าตอง ซีไซด์', type: 'city', province: 'ภูเก็ต', members: 680, providers: 42, activeListings: 55, image: '🏖️', description: 'ชุมชนริมทะเลภูเก็ต อาหารทะเลสด ดำน้ำ กีฬาทางน้ำ', lat: 7.8804, lng: 98.2922 },
  { id: '10', name: 'หาดใหญ่ สมาร์ทซิตี้', type: 'city', province: 'สงขลา', members: 720, providers: 48, activeListings: 45, image: '🌴', description: 'ศูนย์กลางภาคใต้ตอนล่าง อาหารใต้ ซ่อมแซม สุขภาพ และการศึกษา', lat: 7.0086, lng: 100.4770 },
  { id: '15', name: 'เกาะสมุย บีชซิตี้', type: 'city', province: 'สุราษฎร์ธานี', members: 480, providers: 38, activeListings: 42, image: '🌊', description: 'จุดหมายปลายทางยอดนิยม สปา อาหารทะเล กีฬาทางน้ำ ท่องเที่ยวธรรมชาติ', lat: 9.5400, lng: 100.0640 },
  // ── ภาคอีสาน ────────────────────────────────────────────────────────
  { id: '9', name: 'ขอนแก่น อัพทาวน์', type: 'city', province: 'ขอนแก่น', members: 560, providers: 38, activeListings: 36, image: '🌶️', description: 'ศูนย์กลางอีสานตอนบน อาหารอีสานแท้ ซ่อมแซม สอนพิเศษ', lat: 16.4322, lng: 102.8236 },
  { id: '13', name: 'โคราช พลาซ่า', type: 'city', province: 'นครราชสีมา', members: 650, providers: 40, activeListings: 38, image: '🦁', description: 'ประตูอีสาน เมืองโคราช อาหาร ช่าง งานบ้าน ใกล้รถไฟความเร็วสูง', lat: 14.9700, lng: 102.1011 },
  // ── ภาคตะวันออก ─────────────────────────────────────────────────────
  { id: '14', name: 'ระยอง ซีวิว', type: 'village', province: 'ระยอง', members: 290, providers: 22, activeListings: 18, image: '⚓', description: 'เมืองท่าระยอง อาหารทะเล ผลไม้เมืองร้อน เกษตรกรรม', lat: 12.6840, lng: 101.2520 },
]

export const communityKeys = {
  all: ['communities'] as const,
  list: () => [...communityKeys.all, 'list'] as const,
  detail: (id: string) => [...communityKeys.all, 'detail', id] as const,
}

async function fetchCommunities(): Promise<MockCommunity[]> {
  if (USE_REAL_API) {
    const res = await communitiesApi.list()
    return res.data.data as unknown as MockCommunity[]
  }
  await new Promise((r) => setTimeout(r, 150))
  return MOCK_COMMUNITIES
}

async function fetchCommunityById(id: string): Promise<MockCommunity | null> {
  if (USE_REAL_API) {
    const res = await communitiesApi.get(id)
    return res.data.data as unknown as MockCommunity
  }
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
