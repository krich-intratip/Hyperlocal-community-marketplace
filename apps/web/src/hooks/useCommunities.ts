'use client'

import { useQuery } from '@tanstack/react-query'
import { communitiesApi } from '@/lib/api'

const USE_REAL_API = !!process.env.NEXT_PUBLIC_API_BASE_URL

// ── Unified MockCommunity — covers both communities/page.tsx and communities/[id]/page.tsx ──
export interface MockCommunity {
  id: string
  name: string
  type: 'village' | 'condo' | 'city'
  province: string
  area: string
  members: number
  providers: number
  activeListings: number
  image: string        // emoji (used as icon)
  description: string
  lat: number
  lng: number
  // communities/page.tsx fields
  rating: number
  emoji: string        // same as image but used as visual icon in grid
  tags: string[]
  trial: boolean
  trialEnd: string | null
  serviceRadius: number  // km
}

// ── 25 canonical communities (merged data from hook + page mock) ──
const MOCK_COMMUNITIES: MockCommunity[] = [
  // ── กรุงเทพฯ และปริมณฑล
  { id: '1',  name: 'หมู่บ้านศรีนคร',       type: 'village', province: 'กรุงเทพฯ',        area: 'บางแค, กรุงเทพฯ',       members: 342,  providers: 34,  activeListings: 24,  image: '🏘️', emoji: '🏘️', description: 'หมู่บ้านจัดสรรขนาดกลาง ใกล้รถไฟฟ้า ชุมชนเข้มแข็ง บริการหลากหลาย',       lat: 13.7200, lng: 100.4200, rating: 4.8, tags: ['อาหาร', 'งานช่าง', 'งานบ้าน'],            trial: true,  trialEnd: '30 เม.ย. 2569', serviceRadius: 5  },
  { id: '2',  name: 'คอนโด The Base',        type: 'condo',   province: 'กรุงเทพฯ',        area: 'ลาดพร้าว, กรุงเทพฯ',    members: 520,  providers: 22,  activeListings: 15,  image: '🏢', emoji: '🏙️', description: 'คอนโดมิเนียมระดับพรีเมียม ใจกลางเมือง ผู้พักอาศัยหลากหลาย',               lat: 13.8150, lng: 100.5700, rating: 4.9, tags: ['อาหาร', 'ติวเตอร์', 'สุขภาพ'],           trial: true,  trialEnd: '15 มี.ค. 2569', serviceRadius: 3  },
  { id: '3',  name: 'ชุมชนเมืองทอง',         type: 'village', province: 'นนทบุรี',          area: 'เมืองทอง, นนทบุรี',      members: 890,  providers: 45,  activeListings: 67,  image: '🌆', emoji: '🌳', description: 'ชุมชนขนาดใหญ่ ครบครัน ตลาดชุมชนที่คึกคักที่สุดในระบบ',                  lat: 13.8800, lng: 100.5400, rating: 4.7, tags: ['อาหาร', 'งานช่าง', 'เกษตร'],            trial: false, trialEnd: null,            serviceRadius: 8  },
  { id: '4',  name: 'หมู่บ้านกรีนวิลล์',     type: 'village', province: 'กรุงเทพฯ',        area: 'บึงกุ่ม, กรุงเทพฯ',      members: 215,  providers: 18,  activeListings: 12,  image: '🌿', emoji: '🌿', description: 'หมู่บ้านสไตล์ธรรมชาติ บรรยากาศร่มรื่น เหมาะสำหรับครอบครัว',           lat: 13.5990, lng: 100.6100, rating: 4.6, tags: ['งานบ้าน', 'ดูแลผู้สูงอายุ'],             trial: true,  trialEnd: '01 มิ.ย. 2569', serviceRadius: 4  },
  { id: '5',  name: 'ชุมชนริมน้ำ',            type: 'village', province: 'ปทุมธานี',         area: 'ปทุมธานี',               members: 178,  providers: 12,  activeListings: 9,   image: '🌊', emoji: '🌊', description: 'ชุมชนริมแม่น้ำเจ้าพระยา วิถีชีวิตเรียบง่าย เน้นเกษตรอินทรีย์',           lat: 14.0200, lng: 100.5300, rating: 4.5, tags: ['เกษตร', 'อาหาร', 'Community Sharing'], trial: true,  trialEnd: '20 พ.ค. 2569', serviceRadius: 6  },
  // ── ภาคเหนือ
  { id: '6',  name: 'เมืองเชียงใหม่ซิตี้',   type: 'city',    province: 'เชียงใหม่',        area: 'เมือง, เชียงใหม่',       members: 1240, providers: 78,  activeListings: 112, image: '🏔️', emoji: '⛰️', description: 'ศูนย์กลางบริการชุมชนภาคเหนือ อาหาร วัฒนธรรม และบริการหลากหลาย',        lat: 18.7900, lng: 98.9800,  rating: 4.8, tags: ['อาหาร', 'สินค้าทำมือ', 'ท่องเที่ยว'], trial: false, trialEnd: null,            serviceRadius: 10 },
  { id: '7',  name: 'นิมมานเฮมิน วิลเลจ',    type: 'condo',   province: 'เชียงใหม่',        area: 'นิมมานเฮมิน, เชียงใหม่', members: 420,  providers: 35,  activeListings: 38,  image: '☕', emoji: '☕', description: 'ย่านฮิปสเตอร์นิมมาน สปา คาเฟ่ ฟรีแลนซ์ สำหรับ Digital Nomad',           lat: 18.7960, lng: 98.9680,  rating: 4.7, tags: ['คาเฟ่', 'ฟรีแลนซ์', 'สุขภาพ'],        trial: false, trialEnd: null,            serviceRadius: 3  },
  { id: '8',  name: 'ป่าตอง ซีไซด์',         type: 'city',    province: 'ภูเก็ต',           area: 'ป่าตอง, ภูเก็ต',         members: 680,  providers: 42,  activeListings: 55,  image: '🏖️', emoji: '🏖️', description: 'ชุมชนริมทะเลภูเก็ต อาหารทะเลสด ดำน้ำ กีฬาทางน้ำ',                      lat: 7.8804,  lng: 98.2922,  rating: 4.9, tags: ['อาหารทะเล', 'ท่องเที่ยว', 'สุขภาพ'],   trial: false, trialEnd: null,            serviceRadius: 6  },
  { id: '9',  name: 'ขอนแก่น อัพทาวน์',      type: 'city',    province: 'ขอนแก่น',          area: 'เมือง, ขอนแก่น',         members: 560,  providers: 38,  activeListings: 36,  image: '🌶️', emoji: '🌶️', description: 'ศูนย์กลางอีสานตอนบน อาหารอีสานแท้ ซ่อมแซม สอนพิเศษ',                   lat: 16.4322, lng: 102.8236, rating: 4.6, tags: ['อาหาร', 'งานช่าง', 'ติวเตอร์'],        trial: true,  trialEnd: '30 เม.ย. 2569', serviceRadius: 7  },
  { id: '10', name: 'หาดใหญ่ สมาร์ทซิตี้',   type: 'city',    province: 'สงขลา',            area: 'หาดใหญ่, สงขลา',         members: 720,  providers: 48,  activeListings: 45,  image: '🌴', emoji: '🌴', description: 'ศูนย์กลางภาคใต้ตอนล่าง อาหารใต้ ซ่อมแซม สุขภาพ และการศึกษา',          lat: 7.0086,  lng: 100.4770, rating: 4.7, tags: ['อาหาร', 'ซ่อมแซม', 'การศึกษา'],        trial: false, trialEnd: null,            serviceRadius: 8  },
  { id: '11', name: 'สุขุมวิท อาร์บัน',       type: 'condo',   province: 'กรุงเทพฯ',        area: 'สุขุมวิท, กรุงเทพฯ',     members: 780,  providers: 52,  activeListings: 48,  image: '🏙️', emoji: '🏙️', description: 'ชุมชนคนเมืองย่านสุขุมวิท ฟรีแลนซ์ IT และบริการระดับพรีเมียม',           lat: 13.7400, lng: 100.5710, rating: 4.8, tags: ['ฟรีแลนซ์', 'สุขภาพ', 'อาหาร'],         trial: false, trialEnd: null,            serviceRadius: 4  },
  { id: '12', name: 'เชียงราย เมืองเก่า',     type: 'city',    province: 'เชียงราย',         area: 'เมือง, เชียงราย',        members: 340,  providers: 28,  activeListings: 22,  image: '🌸', emoji: '🌸', description: 'แหล่งท่องเที่ยวเชียงราย OTOP งานหัตถกรรม ชาดอยสูง',                     lat: 19.9105, lng: 99.8406,  rating: 4.5, tags: ['หัตถกรรม', 'อาหาร', 'ท่องเที่ยว'],     trial: true,  trialEnd: '30 เม.ย. 2569', serviceRadius: 6  },
  { id: '13', name: 'โคราช พลาซ่า',           type: 'city',    province: 'นครราชสีมา',       area: 'เมือง, นครราชสีมา',      members: 650,  providers: 40,  activeListings: 38,  image: '🦁', emoji: '🦁', description: 'ประตูอีสาน เมืองโคราช อาหาร ช่าง งานบ้าน ใกล้รถไฟความเร็วสูง',         lat: 14.9700, lng: 102.1011, rating: 4.6, tags: ['อาหาร', 'งานช่าง', 'งานบ้าน'],         trial: true,  trialEnd: '30 เม.ย. 2569', serviceRadius: 7  },
  { id: '14', name: 'ระยอง ซีวิว',            type: 'village', province: 'ระยอง',            area: 'เมือง, ระยอง',           members: 290,  providers: 22,  activeListings: 18,  image: '⚓', emoji: '⚓', description: 'เมืองท่าระยอง อาหารทะเล ผลไม้เมืองร้อน เกษตรกรรม',                     lat: 12.6840, lng: 101.2520, rating: 4.5, tags: ['อาหารทะเล', 'เกษตร', 'ท่องเที่ยว'],    trial: false, trialEnd: null,            serviceRadius: 5  },
  { id: '15', name: 'เกาะสมุย บีชซิตี้',      type: 'city',    province: 'สุราษฎร์ธานี',    area: 'เกาะสมุย, สุราษฎร์ธานี', members: 480,  providers: 38,  activeListings: 42,  image: '🌊', emoji: '🌊', description: 'จุดหมายปลายทางยอดนิยม สปา อาหารทะเล กีฬาทางน้ำ ท่องเที่ยวธรรมชาติ',    lat: 9.5400,  lng: 100.0640, rating: 4.8, tags: ['สปา', 'อาหารทะเล', 'ท่องเที่ยว'],      trial: false, trialEnd: null,            serviceRadius: 8  },
  // ── Phase 13: ชุมชนทั่วประเทศ 16–25
  { id: '16', name: 'อุดรธานี คิตี้ซิตี้',   type: 'city',    province: 'อุดรธานี',         area: 'เมือง, อุดรธานี',        members: 342,  providers: 20,  activeListings: 26,  image: '🛍️', emoji: '🛍️', description: 'ศูนย์กลางอีสานตอนบน ตลาดกลางคืน Korean Town อาหาร ช้อปปิ้ง',          lat: 17.4138, lng: 102.7869, rating: 4.5, tags: ['อาหาร', 'ช้อปปิ้ง', 'บันเทิง'],        trial: true,  trialEnd: '30 เม.ย. 2569', serviceRadius: 6  },
  { id: '17', name: 'อุบลราชธานี เมืองเก่า',  type: 'city',    province: 'อุบลราชธานี',      area: 'เมือง, อุบลราชธานี',     members: 198,  providers: 14,  activeListings: 11,  image: '🏛️', emoji: '🏛️', description: 'เมืองเก่าริมแม่น้ำมูล ประเพณีแห่เทียนพรรษา วัฒนธรรมอีสาน',             lat: 15.2448, lng: 104.8453, rating: 4.4, tags: ['วัฒนธรรม', 'อาหาร', 'ท่องเที่ยว'],     trial: true,  trialEnd: '30 เม.ย. 2569', serviceRadius: 5  },
  { id: '18', name: 'พัทยา บีชซิตี้',         type: 'city',    province: 'ชลบุรี',           area: 'พัทยา, ชลบุรี',          members: 456,  providers: 35,  activeListings: 44,  image: '🎡', emoji: '🎡', description: 'เมืองท่องเที่ยวระดับโลก ชายหาด ดำน้ำ กีฬาทางน้ำ งานช่างครบ',           lat: 12.9350, lng: 100.8825, rating: 4.7, tags: ['ท่องเที่ยว', 'งานช่าง', 'สุขภาพ'],     trial: false, trialEnd: null,            serviceRadius: 7  },
  { id: '19', name: 'สุราษฎร์ธานี เมือง',      type: 'city',    province: 'สุราษฎร์ธานี',    area: 'เมือง, สุราษฎร์ธานี',   members: 267,  providers: 18,  activeListings: 19,  image: '🍊', emoji: '🍊', description: 'ประตูสู่เกาะสมุย ดุเรียน เงาะ มังคุด ผลไม้ขึ้นชื่อ บริการชุมชน',        lat: 9.1400,  lng: 99.3275,  rating: 4.5, tags: ['ผลไม้', 'เกษตร', 'อาหาร'],             trial: true,  trialEnd: '30 เม.ย. 2569', serviceRadius: 5  },
  { id: '20', name: 'ลำปาง เซรามิค',          type: 'city',    province: 'ลำปาง',            area: 'เมือง, ลำปาง',           members: 178,  providers: 12,  activeListings: 10,  image: '🏺', emoji: '🏺', description: 'เมืองม้าขาว งานหัตถกรรมเซรามิคระดับประเทศ วัดสำคัญ บรรยากาศเมืองเก่า',  lat: 18.2888, lng: 99.4977,  rating: 4.5, tags: ['หัตถกรรม', 'เซรามิค', 'ท่องเที่ยว'],   trial: false, trialEnd: null,            serviceRadius: 4  },
  { id: '21', name: 'นครสวรรค์ เมือง',         type: 'city',    province: 'นครสวรรค์',        area: 'เมือง, นครสวรรค์',       members: 312,  providers: 22,  activeListings: 21,  image: '🐉', emoji: '🐉', description: 'เมืองปากน้ำโพ ก๋วยเตี๋ยวเนื้อชื่อดัง งานตรุษจีน สินค้า OTOP',           lat: 15.7047, lng: 100.1368, rating: 4.5, tags: ['อาหาร', 'OTOP', 'วัฒนธรรม'],           trial: true,  trialEnd: '30 เม.ย. 2569', serviceRadius: 5  },
  { id: '22', name: 'สมุทรปราการ เมือง',        type: 'city',    province: 'สมุทรปราการ',      area: 'บางปู, สมุทรปราการ',     members: 445,  providers: 28,  activeListings: 33,  image: '🏭', emoji: '🏭', description: 'เมืองอุตสาหกรรมใกล้กรุงเทพฯ บางปู ตลาดอาหารทะเล BTS สายสีเขียว',      lat: 13.5990, lng: 100.6000, rating: 4.4, tags: ['อาหารทะเล', 'งานช่าง', 'งานบ้าน'],     trial: false, trialEnd: null,            serviceRadius: 6  },
  { id: '23', name: 'นครศรีธรรมราช',           type: 'city',    province: 'นครศรีธรรมราช',   area: 'เมือง, นครศรีธรรมราช',  members: 289,  providers: 20,  activeListings: 18,  image: '🕌', emoji: '🕌', description: 'เมืองประวัติศาสตร์ภาคใต้ วัดพระมหาธาตุ หนังตะลุง อาหารทะเล',          lat: 8.4304,  lng: 99.9631,  rating: 4.5, tags: ['วัฒนธรรม', 'อาหารทะเล', 'ท่องเที่ยว'], trial: true,  trialEnd: '30 เม.ย. 2569', serviceRadius: 5  },
  { id: '24', name: 'กาญจนบุรี ริเวอร์',       type: 'city',    province: 'กาญจนบุรี',        area: 'เมือง, กาญจนบุรี',       members: 234,  providers: 16,  activeListings: 16,  image: '🛶', emoji: '🛶', description: 'ริมแม่น้ำแคว ล่องแก่ง น้ำตก สะพานข้ามแม่น้ำแคว ธรรมชาติสมบูรณ์',      lat: 14.0063, lng: 99.5481,  rating: 4.6, tags: ['ท่องเที่ยว', 'ธรรมชาติ', 'เกษตร'],     trial: false, trialEnd: null,            serviceRadius: 6  },
  { id: '25', name: 'บึงกาฬ ริมโขง',           type: 'city',    province: 'บึงกาฬ',           area: 'เมือง, บึงกาฬ',          members: 124,  providers: 8,   activeListings: 7,   image: '🌲', emoji: '🌲', description: 'จังหวัดน้องใหม่ที่สุดของไทย ริมโขง เขตรักษาพันธุ์สัตว์ป่า เกษตรออร์แกนิค', lat: 18.3609, lng: 103.6521, rating: 4.3, tags: ['เกษตร', 'ธรรมชาติ', 'ท่องเที่ยว'],     trial: true,  trialEnd: '30 เม.ย. 2569', serviceRadius: 8  },
]

// ── Query keys ────────────────────────────────────────────────────────────────
export const communityKeys = {
  all: ['communities'] as const,
  list: () => [...communityKeys.all, 'list'] as const,
  detail: (id: string) => [...communityKeys.all, 'detail', id] as const,
}

// ── API adapter: Community entity → MockCommunity ─────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function apiCommunityToMock(c: any): MockCommunity {
  const s = c.settings ?? {}
  const fallback = MOCK_COMMUNITIES.find((m) => m.id === c.id)
  return {
    id: c.id,
    name: c.name,
    type: s.type ?? fallback?.type ?? 'city',
    province: s.province ?? fallback?.province ?? '',
    area: s.area ?? fallback?.area ?? c.name,
    members: s.memberCount ?? fallback?.members ?? 0,
    providers: s.providerCount ?? fallback?.providers ?? 0,
    activeListings: s.activeListings ?? fallback?.activeListings ?? 0,
    image: s.emoji ?? fallback?.image ?? '🏘️',
    emoji: s.emoji ?? fallback?.emoji ?? '🏘️',
    description: c.description ?? fallback?.description ?? '',
    lat: s.lat ?? fallback?.lat ?? 13.75,
    lng: s.lng ?? fallback?.lng ?? 100.52,
    rating: s.rating ?? fallback?.rating ?? 4.5,
    tags: s.tags ?? fallback?.tags ?? [],
    trial: c.trialStatus === 'ACTIVE',
    trialEnd: s.trialEndText ?? fallback?.trialEnd ?? null,
    serviceRadius: s.serviceRadius ?? fallback?.serviceRadius ?? 5,
  }
}

// ── Fetchers ──────────────────────────────────────────────────────────────────
async function fetchCommunities(): Promise<MockCommunity[]> {
  if (USE_REAL_API) {
    const res = await communitiesApi.list()
    // API returns Community[] directly (not paginated)
    const communities = res.data as unknown as any[]
    return communities.map(apiCommunityToMock)
  }
  await new Promise((r) => setTimeout(r, 150))
  return MOCK_COMMUNITIES
}

async function fetchCommunityById(id: string): Promise<MockCommunity | null> {
  if (USE_REAL_API) {
    const res = await communitiesApi.get(id)
    // API returns single Community entity directly
    return apiCommunityToMock(res.data)
  }
  await new Promise((r) => setTimeout(r, 100))
  return MOCK_COMMUNITIES.find((c) => c.id === id) ?? null
}

// ── Hooks ─────────────────────────────────────────────────────────────────────
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
