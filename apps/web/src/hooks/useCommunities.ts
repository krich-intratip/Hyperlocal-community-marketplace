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
  region: 'ภาคกลาง' | 'ภาคเหนือ' | 'ภาคอีสาน' | 'ภาคตะวันออก' | 'ภาคใต้'
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

// ── Province → Region mapping ─────────────────────────────────────────────────
const PROVINCE_REGION: Record<string, MockCommunity['region']> = {
  'กรุงเทพฯ': 'ภาคกลาง', 'นนทบุรี': 'ภาคกลาง', 'ปทุมธานี': 'ภาคกลาง',
  'สมุทรปราการ': 'ภาคกลาง', 'นครสวรรค์': 'ภาคกลาง', 'กาญจนบุรี': 'ภาคกลาง',
  'เชียงใหม่': 'ภาคเหนือ', 'เชียงราย': 'ภาคเหนือ', 'แม่ฮ่องสอน': 'ภาคเหนือ',
  'น่าน': 'ภาคเหนือ', 'ลำปาง': 'ภาคเหนือ', 'แพร่': 'ภาคเหนือ',
  'อุตรดิตถ์': 'ภาคเหนือ', 'พิษณุโลก': 'ภาคเหนือ', 'เพชรบูรณ์': 'ภาคเหนือ',
  'ตาก': 'ภาคเหนือ',
  'ขอนแก่น': 'ภาคอีสาน', 'นครราชสีมา': 'ภาคอีสาน', 'อุดรธานี': 'ภาคอีสาน',
  'อุบลราชธานี': 'ภาคอีสาน', 'บึงกาฬ': 'ภาคอีสาน', 'นครพนม': 'ภาคอีสาน',
  'สกลนคร': 'ภาคอีสาน', 'ยโสธร': 'ภาคอีสาน', 'ร้อยเอ็ด': 'ภาคอีสาน',
  'มหาสารคาม': 'ภาคอีสาน', 'ชัยภูมิ': 'ภาคอีสาน', 'สุรินทร์': 'ภาคอีสาน',
  'บุรีรัมย์': 'ภาคอีสาน', 'เลย': 'ภาคอีสาน',
  'ชลบุรี': 'ภาคตะวันออก', 'ระยอง': 'ภาคตะวันออก', 'ตราด': 'ภาคตะวันออก',
  'จันทบุรี': 'ภาคตะวันออก', 'สระแก้ว': 'ภาคตะวันออก',
  'ภูเก็ต': 'ภาคใต้', 'สงขลา': 'ภาคใต้', 'สุราษฎร์ธานี': 'ภาคใต้',
  'นครศรีธรรมราช': 'ภาคใต้', 'สตูล': 'ภาคใต้',
}

export function getRegion(province: string): MockCommunity['region'] {
  return PROVINCE_REGION[province] ?? 'ภาคกลาง'
}

// ── 45 canonical communities ───────────────────────────────────────────────────
const MOCK_COMMUNITIES: MockCommunity[] = [
  // ── ภาคกลาง + ปริมณฑล
  { id: '1',  name: 'หมู่บ้านศรีนคร',       type: 'village', province: 'กรุงเทพฯ',       region: 'ภาคกลาง',    area: 'บางแค, กรุงเทพฯ',       members: 342,  providers: 34, activeListings: 24,  image: '🏘️', emoji: '🏘️', description: 'หมู่บ้านจัดสรรขนาดกลาง ใกล้รถไฟฟ้า ชุมชนเข้มแข็ง',       lat: 13.7200, lng: 100.4200, rating: 4.8, tags: ['อาหาร', 'งานช่าง', 'งานบ้าน'],            trial: true,  trialEnd: '30 เม.ย. 2569', serviceRadius: 5  },
  { id: '2',  name: 'คอนโด The Base',        type: 'condo',   province: 'กรุงเทพฯ',       region: 'ภาคกลาง',    area: 'ลาดพร้าว, กรุงเทพฯ',    members: 520,  providers: 22, activeListings: 15,  image: '🏢', emoji: '🏙️', description: 'คอนโดมิเนียมระดับพรีเมียม ใจกลางเมือง ผู้พักอาศัยหลากหลาย', lat: 13.8150, lng: 100.5700, rating: 4.9, tags: ['อาหาร', 'ติวเตอร์', 'สุขภาพ'],           trial: true,  trialEnd: '15 มี.ค. 2569', serviceRadius: 3  },
  { id: '3',  name: 'ชุมชนเมืองทอง',         type: 'village', province: 'นนทบุรี',         region: 'ภาคกลาง',    area: 'เมืองทอง, นนทบุรี',      members: 890,  providers: 45, activeListings: 67,  image: '🌆', emoji: '🌳', description: 'ชุมชนขนาดใหญ่ ครบครัน ตลาดชุมชนที่คึกคักที่สุดในระบบ',    lat: 13.8800, lng: 100.5400, rating: 4.7, tags: ['อาหาร', 'งานช่าง', 'เกษตร'],            trial: false, trialEnd: null,            serviceRadius: 8  },
  { id: '4',  name: 'หมู่บ้านกรีนวิลล์',     type: 'village', province: 'กรุงเทพฯ',       region: 'ภาคกลาง',    area: 'บึงกุ่ม, กรุงเทพฯ',      members: 215,  providers: 18, activeListings: 12,  image: '🌿', emoji: '🌿', description: 'หมู่บ้านสไตล์ธรรมชาติ บรรยากาศร่มรื่น เหมาะสำหรับครอบครัว', lat: 13.5990, lng: 100.6100, rating: 4.6, tags: ['งานบ้าน', 'ดูแลผู้สูงอายุ'],             trial: true,  trialEnd: '01 มิ.ย. 2569', serviceRadius: 4  },
  { id: '5',  name: 'ชุมชนริมน้ำ',            type: 'village', province: 'ปทุมธานี',        region: 'ภาคกลาง',    area: 'ปทุมธานี',               members: 178,  providers: 12, activeListings: 9,   image: '🌊', emoji: '🌊', description: 'ชุมชนริมแม่น้ำเจ้าพระยา วิถีชีวิตเรียบง่าย เน้นเกษตรอินทรีย์', lat: 14.0200, lng: 100.5300, rating: 4.5, tags: ['เกษตร', 'อาหาร', 'Community Sharing'], trial: true,  trialEnd: '20 พ.ค. 2569', serviceRadius: 6  },
  // ── ภาคเหนือ
  { id: '6',  name: 'เมืองเชียงใหม่ซิตี้',   type: 'city',    province: 'เชียงใหม่',       region: 'ภาคเหนือ',   area: 'เมือง, เชียงใหม่',       members: 1240, providers: 78, activeListings: 112, image: '🏔️', emoji: '⛰️', description: 'ศูนย์กลางบริการชุมชนภาคเหนือ อาหาร วัฒนธรรม บริการหลากหลาย', lat: 18.7900, lng: 98.9800,  rating: 4.8, tags: ['อาหาร', 'สินค้าทำมือ', 'ท่องเที่ยว'], trial: false, trialEnd: null,            serviceRadius: 10 },
  { id: '7',  name: 'นิมมานเฮมิน วิลเลจ',    type: 'condo',   province: 'เชียงใหม่',       region: 'ภาคเหนือ',   area: 'นิมมานเฮมิน, เชียงใหม่', members: 420,  providers: 35, activeListings: 38,  image: '☕', emoji: '☕', description: 'ย่านฮิปสเตอร์นิมมาน สปา คาเฟ่ ฟรีแลนซ์ Digital Nomad',    lat: 18.7960, lng: 98.9680,  rating: 4.7, tags: ['คาเฟ่', 'ฟรีแลนซ์', 'สุขภาพ'],        trial: false, trialEnd: null,            serviceRadius: 3  },
  // ── ภาคใต้
  { id: '8',  name: 'ป่าตอง ซีไซด์',         type: 'city',    province: 'ภูเก็ต',          region: 'ภาคใต้',     area: 'ป่าตอง, ภูเก็ต',         members: 680,  providers: 42, activeListings: 55,  image: '🏖️', emoji: '🏖️', description: 'ชุมชนริมทะเลภูเก็ต อาหารทะเลสด ดำน้ำ กีฬาทางน้ำ',         lat: 7.8804,  lng: 98.2922,  rating: 4.9, tags: ['อาหารทะเล', 'ท่องเที่ยว', 'สุขภาพ'],   trial: false, trialEnd: null,            serviceRadius: 6  },
  // ── ภาคอีสาน
  { id: '9',  name: 'ขอนแก่น อัพทาวน์',      type: 'city',    province: 'ขอนแก่น',         region: 'ภาคอีสาน',   area: 'เมือง, ขอนแก่น',         members: 560,  providers: 38, activeListings: 36,  image: '🌶️', emoji: '🌶️', description: 'ศูนย์กลางอีสานตอนบน อาหารอีสานแท้ ซ่อมแซม สอนพิเศษ',   lat: 16.4322, lng: 102.8236, rating: 4.6, tags: ['อาหาร', 'งานช่าง', 'ติวเตอร์'],        trial: true,  trialEnd: '30 เม.ย. 2569', serviceRadius: 7  },
  // ── ภาคใต้
  { id: '10', name: 'หาดใหญ่ สมาร์ทซิตี้',   type: 'city',    province: 'สงขลา',           region: 'ภาคใต้',     area: 'หาดใหญ่, สงขลา',         members: 720,  providers: 48, activeListings: 45,  image: '🌴', emoji: '🌴', description: 'ศูนย์กลางภาคใต้ตอนล่าง อาหารใต้ ซ่อมแซม สุขภาพ การศึกษา', lat: 7.0086,  lng: 100.4770, rating: 4.7, tags: ['อาหาร', 'ซ่อมแซม', 'การศึกษา'],        trial: false, trialEnd: null,            serviceRadius: 8  },
  // ── ภาคกลาง
  { id: '11', name: 'สุขุมวิท อาร์บัน',       type: 'condo',   province: 'กรุงเทพฯ',       region: 'ภาคกลาง',    area: 'สุขุมวิท, กรุงเทพฯ',     members: 780,  providers: 52, activeListings: 48,  image: '🏙️', emoji: '🏙️', description: 'ชุมชนคนเมืองย่านสุขุมวิท ฟรีแลนซ์ IT บริการระดับพรีเมียม', lat: 13.7400, lng: 100.5710, rating: 4.8, tags: ['ฟรีแลนซ์', 'สุขภาพ', 'อาหาร'],         trial: false, trialEnd: null,            serviceRadius: 4  },
  // ── ภาคเหนือ
  { id: '12', name: 'เชียงราย เมืองเก่า',     type: 'city',    province: 'เชียงราย',        region: 'ภาคเหนือ',   area: 'เมือง, เชียงราย',        members: 340,  providers: 28, activeListings: 22,  image: '🌸', emoji: '🌸', description: 'แหล่งท่องเที่ยวเชียงราย OTOP งานหัตถกรรม ชาดอยสูง',       lat: 19.9105, lng: 99.8406,  rating: 4.5, tags: ['หัตถกรรม', 'อาหาร', 'ท่องเที่ยว'],     trial: true,  trialEnd: '30 เม.ย. 2569', serviceRadius: 6  },
  // ── ภาคอีสาน
  { id: '13', name: 'โคราช พลาซ่า',           type: 'city',    province: 'นครราชสีมา',      region: 'ภาคอีสาน',   area: 'เมือง, นครราชสีมา',      members: 650,  providers: 40, activeListings: 38,  image: '🦁', emoji: '🦁', description: 'ประตูอีสาน เมืองโคราช อาหาร ช่าง งานบ้าน ใกล้รถไฟความเร็วสูง', lat: 14.9700, lng: 102.1011, rating: 4.6, tags: ['อาหาร', 'งานช่าง', 'งานบ้าน'],         trial: true,  trialEnd: '30 เม.ย. 2569', serviceRadius: 7  },
  // ── ภาคตะวันออก
  { id: '14', name: 'ระยอง ซีวิว',            type: 'village', province: 'ระยอง',           region: 'ภาคตะวันออก', area: 'เมือง, ระยอง',           members: 290,  providers: 22, activeListings: 18,  image: '⚓', emoji: '⚓', description: 'เมืองท่าระยอง อาหารทะเล ผลไม้เมืองร้อน เกษตรกรรม',         lat: 12.6840, lng: 101.2520, rating: 4.5, tags: ['อาหารทะเล', 'เกษตร', 'ท่องเที่ยว'],    trial: false, trialEnd: null,            serviceRadius: 5  },
  // ── ภาคใต้
  { id: '15', name: 'เกาะสมุย บีชซิตี้',      type: 'city',    province: 'สุราษฎร์ธานี',   region: 'ภาคใต้',     area: 'เกาะสมุย, สุราษฎร์ธานี', members: 480,  providers: 38, activeListings: 42,  image: '🌊', emoji: '🌊', description: 'จุดหมายปลายทางยอดนิยม สปา อาหารทะเล กีฬาทางน้ำ',          lat: 9.5400,  lng: 100.0640, rating: 4.8, tags: ['สปา', 'อาหารทะเล', 'ท่องเที่ยว'],      trial: false, trialEnd: null,            serviceRadius: 8  },
  // ── ภาคอีสาน
  { id: '16', name: 'อุดรธานี คิตี้ซิตี้',   type: 'city',    province: 'อุดรธานี',        region: 'ภาคอีสาน',   area: 'เมือง, อุดรธานี',        members: 342,  providers: 20, activeListings: 26,  image: '🛍️', emoji: '🛍️', description: 'ศูนย์กลางอีสานตอนบน ตลาดกลางคืน Korean Town อาหาร ช้อปปิ้ง', lat: 17.4138, lng: 102.7869, rating: 4.5, tags: ['อาหาร', 'ช้อปปิ้ง', 'บันเทิง'],        trial: true,  trialEnd: '30 เม.ย. 2569', serviceRadius: 6  },
  { id: '17', name: 'อุบลราชธานี เมืองเก่า',  type: 'city',    province: 'อุบลราชธานี',     region: 'ภาคอีสาน',   area: 'เมือง, อุบลราชธานี',     members: 198,  providers: 14, activeListings: 11,  image: '🏛️', emoji: '🏛️', description: 'เมืองเก่าริมแม่น้ำมูล ประเพณีแห่เทียนพรรษา วัฒนธรรมอีสาน', lat: 15.2448, lng: 104.8453, rating: 4.4, tags: ['วัฒนธรรม', 'อาหาร', 'ท่องเที่ยว'],     trial: true,  trialEnd: '30 เม.ย. 2569', serviceRadius: 5  },
  // ── ภาคตะวันออก
  { id: '18', name: 'พัทยา บีชซิตี้',         type: 'city',    province: 'ชลบุรี',          region: 'ภาคตะวันออก', area: 'พัทยา, ชลบุรี',          members: 456,  providers: 35, activeListings: 44,  image: '🎡', emoji: '🎡', description: 'เมืองท่องเที่ยวระดับโลก ชายหาด ดำน้ำ กีฬาทางน้ำ งานช่างครบ', lat: 12.9350, lng: 100.8825, rating: 4.7, tags: ['ท่องเที่ยว', 'งานช่าง', 'สุขภาพ'],     trial: false, trialEnd: null,            serviceRadius: 7  },
  // ── ภาคใต้
  { id: '19', name: 'สุราษฎร์ธานี เมือง',      type: 'city',    province: 'สุราษฎร์ธานี',   region: 'ภาคใต้',     area: 'เมือง, สุราษฎร์ธานี',   members: 267,  providers: 18, activeListings: 19,  image: '🍊', emoji: '🍊', description: 'ประตูสู่เกาะสมุย ดุเรียน เงาะ มังคุด ผลไม้ขึ้นชื่อ บริการชุมชน', lat: 9.1400,  lng: 99.3275,  rating: 4.5, tags: ['ผลไม้', 'เกษตร', 'อาหาร'],             trial: true,  trialEnd: '30 เม.ย. 2569', serviceRadius: 5  },
  // ── ภาคเหนือ
  { id: '20', name: 'ลำปาง เซรามิค',          type: 'city',    province: 'ลำปาง',           region: 'ภาคเหนือ',   area: 'เมือง, ลำปาง',           members: 178,  providers: 12, activeListings: 10,  image: '🏺', emoji: '🏺', description: 'เมืองม้าขาว งานหัตถกรรมเซรามิคระดับประเทศ บรรยากาศเมืองเก่า', lat: 18.2888, lng: 99.4977,  rating: 4.5, tags: ['หัตถกรรม', 'เซรามิค', 'ท่องเที่ยว'],   trial: false, trialEnd: null,            serviceRadius: 4  },
  // ── ภาคกลาง
  { id: '21', name: 'นครสวรรค์ เมือง',         type: 'city',    province: 'นครสวรรค์',       region: 'ภาคกลาง',    area: 'เมือง, นครสวรรค์',       members: 312,  providers: 22, activeListings: 21,  image: '🐉', emoji: '🐉', description: 'เมืองปากน้ำโพ ก๋วยเตี๋ยวเนื้อชื่อดัง งานตรุษจีน สินค้า OTOP', lat: 15.7047, lng: 100.1368, rating: 4.5, tags: ['อาหาร', 'OTOP', 'วัฒนธรรม'],           trial: true,  trialEnd: '30 เม.ย. 2569', serviceRadius: 5  },
  { id: '22', name: 'สมุทรปราการ เมือง',        type: 'city',    province: 'สมุทรปราการ',     region: 'ภาคกลาง',    area: 'บางปู, สมุทรปราการ',     members: 445,  providers: 28, activeListings: 33,  image: '🏭', emoji: '🏭', description: 'เมืองอุตสาหกรรมใกล้กรุงเทพฯ บางปู ตลาดอาหารทะเล BTS สายสีเขียว', lat: 13.5990, lng: 100.6000, rating: 4.4, tags: ['อาหารทะเล', 'งานช่าง', 'งานบ้าน'],     trial: false, trialEnd: null,            serviceRadius: 6  },
  // ── ภาคใต้
  { id: '23', name: 'นครศรีธรรมราช',           type: 'city',    province: 'นครศรีธรรมราช',  region: 'ภาคใต้',     area: 'เมือง, นครศรีธรรมราช',  members: 289,  providers: 20, activeListings: 18,  image: '🕌', emoji: '🕌', description: 'เมืองประวัติศาสตร์ภาคใต้ วัดพระมหาธาตุ หนังตะลุง อาหารทะเล', lat: 8.4304,  lng: 99.9631,  rating: 4.5, tags: ['วัฒนธรรม', 'อาหารทะเล', 'ท่องเที่ยว'], trial: true,  trialEnd: '30 เม.ย. 2569', serviceRadius: 5  },
  // ── ภาคกลาง
  { id: '24', name: 'กาญจนบุรี ริเวอร์',       type: 'city',    province: 'กาญจนบุรี',       region: 'ภาคกลาง',    area: 'เมือง, กาญจนบุรี',       members: 234,  providers: 16, activeListings: 16,  image: '🛶', emoji: '🛶', description: 'ริมแม่น้ำแคว ล่องแก่ง น้ำตก สะพานข้ามแม่น้ำแคว ธรรมชาติสมบูรณ์', lat: 14.0063, lng: 99.5481,  rating: 4.6, tags: ['ท่องเที่ยว', 'ธรรมชาติ', 'เกษตร'],     trial: false, trialEnd: null,            serviceRadius: 6  },
  // ── ภาคอีสาน
  { id: '25', name: 'บึงกาฬ ริมโขง',           type: 'city',    province: 'บึงกาฬ',          region: 'ภาคอีสาน',   area: 'เมือง, บึงกาฬ',          members: 124,  providers: 8,  activeListings: 7,   image: '🌲', emoji: '🌲', description: 'จังหวัดน้องใหม่ที่สุดของไทย ริมโขง เขตรักษาพันธุ์สัตว์ป่า',  lat: 18.3609, lng: 103.6521, rating: 4.3, tags: ['เกษตร', 'ธรรมชาติ', 'ท่องเที่ยว'],     trial: true,  trialEnd: '30 เม.ย. 2569', serviceRadius: 8  },
  // ── 20 ชุมชนเพิ่มเติม ─────────────────────────────────────────────────────
  // ── ภาคใต้
  { id: '26', name: 'สตูล ชายแดน',             type: 'city',    province: 'สตูล',            region: 'ภาคใต้',     area: 'เมือง, สตูล',            members: 198,  providers: 14, activeListings: 10,  image: '🌊', emoji: '🌊', description: 'ชายแดนใต้สุดของไทย อาหารทะเล วัฒนธรรมมลายู เกาะสวยงาม', lat: 6.6238,  lng: 100.0673, rating: 4.4, tags: ['อาหารทะเล', 'วัฒนธรรม', 'ท่องเที่ยว'],  trial: true,  trialEnd: '30 เม.ย. 2569', serviceRadius: 5  },
  // ── ภาคเหนือ
  { id: '27', name: 'แม่ฮ่องสอน เมืองหมอก',    type: 'city',    province: 'แม่ฮ่องสอน',     region: 'ภาคเหนือ',   area: 'เมือง, แม่ฮ่องสอน',     members: 145,  providers: 10, activeListings: 8,   image: '⛰️', emoji: '⛰️', description: 'เมืองหมอกชายแดน หัตถกรรมชาวเขา ท่องเที่ยวธรรมชาติ',     lat: 19.3020, lng: 97.9654,  rating: 4.5, tags: ['หัตถกรรมชาวเขา', 'ท่องเที่ยว', 'เกษตร'],trial: true,  trialEnd: '30 เม.ย. 2569', serviceRadius: 6  },
  { id: '28', name: 'น่าน เมืองเก่า',           type: 'city',    province: 'น่าน',            region: 'ภาคเหนือ',   area: 'เมือง, น่าน',            members: 234,  providers: 18, activeListings: 14,  image: '🏛️', emoji: '🏛️', description: 'เมืองเก่าบรรยากาศคลาสสิก วัดสำคัญ งานหัตถกรรมไทลื้อ',   lat: 18.7756, lng: 100.7730, rating: 4.6, tags: ['วัฒนธรรม', 'หัตถกรรม', 'ท่องเที่ยว'],   trial: false, trialEnd: null,            serviceRadius: 5  },
  // ── ภาคอีสาน
  { id: '29', name: 'เลย ภูกระดึง',             type: 'city',    province: 'เลย',             region: 'ภาคอีสาน',   area: 'เมือง, เลย',             members: 167,  providers: 12, activeListings: 9,   image: '🏔️', emoji: '🏔️', description: 'เมืองหน้าหนาว ภูกระดึง เกษตรอินทรีย์ ธรรมชาติงดงาม',     lat: 17.4879, lng: 101.7216, rating: 4.4, tags: ['เกษตร', 'ท่องเที่ยว', 'ธรรมชาติ'],       trial: true,  trialEnd: '30 เม.ย. 2569', serviceRadius: 7  },
  { id: '30', name: 'นครพนม ริมโขง',            type: 'city',    province: 'นครพนม',          region: 'ภาคอีสาน',   area: 'เมือง, นครพนม',          members: 189,  providers: 14, activeListings: 11,  image: '🐉', emoji: '🐉', description: 'เมืองริมโขง วัดพระธาตุพนม ก๋วยเตี๋ยวนครพนมชื่อดัง',       lat: 17.3910, lng: 104.7774, rating: 4.4, tags: ['อาหาร', 'วัฒนธรรม', 'ท่องเที่ยว'],       trial: true,  trialEnd: '30 เม.ย. 2569', serviceRadius: 5  },
  { id: '31', name: 'สกลนคร เมือง',             type: 'city',    province: 'สกลนคร',          region: 'ภาคอีสาน',   area: 'เมือง, สกลนคร',          members: 221,  providers: 16, activeListings: 13,  image: '🦢', emoji: '🦢', description: 'ผ้าไหมมัดหมี่ขึ้นชื่อ ทะเลสาบหนองหาน วัฒนธรรมอีสาน',      lat: 17.1548, lng: 104.1348, rating: 4.3, tags: ['ผ้าไหม', 'อาหาร', 'วัฒนธรรม'],           trial: true,  trialEnd: '30 เม.ย. 2569', serviceRadius: 5  },
  { id: '32', name: 'ยโสธร เมือง',              type: 'city',    province: 'ยโสธร',           region: 'ภาคอีสาน',   area: 'เมือง, ยโสธร',           members: 156,  providers: 10, activeListings: 7,   image: '🪅', emoji: '🪅', description: 'เมืองยาว บุญบั้งไฟ อาหารอีสานแท้ งาน OTOP',               lat: 15.7926, lng: 104.1456, rating: 4.3, tags: ['งานบ้าน', 'อาหาร', 'OTOP'],              trial: true,  trialEnd: '30 เม.ย. 2569', serviceRadius: 4  },
  { id: '33', name: 'ร้อยเอ็ด เมือง',           type: 'city',    province: 'ร้อยเอ็ด',        region: 'ภาคอีสาน',   area: 'เมือง, ร้อยเอ็ด',        members: 267,  providers: 18, activeListings: 14,  image: '🌾', emoji: '🌾', description: 'เมืองร้อยพันประตู ข้าวหอมมะลิขึ้นชื่อ งานช่างในชุมชน',    lat: 16.0538, lng: 103.6520, rating: 4.4, tags: ['งานช่าง', 'อาหาร', 'เกษตร'],             trial: false, trialEnd: null,            serviceRadius: 5  },
  { id: '34', name: 'มหาสารคาม เมือง',          type: 'city',    province: 'มหาสารคาม',       region: 'ภาคอีสาน',   area: 'เมือง, มหาสารคาม',       members: 312,  providers: 22, activeListings: 18,  image: '🎓', emoji: '🎓', description: 'มหาวิทยาลัยมหาสารคาม เมืองวิชาการ ติวเตอร์ อาหารนิสิต',  lat: 16.1851, lng: 103.3000, rating: 4.4, tags: ['การศึกษา', 'อาหาร', 'วัฒนธรรม'],          trial: true,  trialEnd: '30 เม.ย. 2569', serviceRadius: 4  },
  { id: '35', name: 'ชัยภูมิ เมือง',            type: 'city',    province: 'ชัยภูมิ',         region: 'ภาคอีสาน',   area: 'เมือง, ชัยภูมิ',         members: 178,  providers: 12, activeListings: 9,   image: '🌻', emoji: '🌻', description: 'ดอกกระเจียวบาน เกษตรอินทรีย์ หัตถกรรมพื้นเมือง ชุมชนเข้มแข็ง', lat: 15.8070, lng: 102.0310, rating: 4.3, tags: ['เกษตร', 'หัตถกรรม', 'OTOP'],             trial: true,  trialEnd: '30 เม.ย. 2569', serviceRadius: 5  },
  { id: '36', name: 'สุรินทร์ เมือง',           type: 'city',    province: 'สุรินทร์',        region: 'ภาคอีสาน',   area: 'เมือง, สุรินทร์',        members: 298,  providers: 22, activeListings: 16,  image: '🐘', emoji: '🐘', description: 'เมืองช้าง ผ้าไหมพื้นเมือง ประเพณีช้างงาม วัฒนธรรมเขมร',   lat: 14.8825, lng: 103.4936, rating: 4.5, tags: ['ผ้าไหม', 'วัฒนธรรม', 'ท่องเที่ยว'],      trial: false, trialEnd: null,            serviceRadius: 5  },
  { id: '37', name: 'บุรีรัมย์ เมือง',           type: 'city',    province: 'บุรีรัมย์',       region: 'ภาคอีสาน',   area: 'เมือง, บุรีรัมย์',       members: 345,  providers: 24, activeListings: 19,  image: '⚽', emoji: '⚽', description: 'เมืองสนามช้าง อาหารพื้นเมือง ท่องเที่ยวปราสาทขอม งานช่าง', lat: 14.9935, lng: 103.1026, rating: 4.4, tags: ['อาหาร', 'ท่องเที่ยว', 'งานช่าง'],         trial: false, trialEnd: null,            serviceRadius: 6  },
  // ── ภาคตะวันออก
  { id: '38', name: 'ตราด ชายทะเล',             type: 'city',    province: 'ตราด',            region: 'ภาคตะวันออก', area: 'เมือง, ตราด',            members: 213,  providers: 16, activeListings: 12,  image: '🦞', emoji: '🦞', description: 'อ่าวตราดสวยงาม กุ้งล็อบสเตอร์สด เกาะช้าง อาหารทะเลสด', lat: 12.2428, lng: 102.5178, rating: 4.5, tags: ['อาหารทะเล', 'ท่องเที่ยว', 'ผลไม้'],       trial: false, trialEnd: null,            serviceRadius: 5  },
  { id: '39', name: 'สระแก้ว เมือง',            type: 'city',    province: 'สระแก้ว',         region: 'ภาคตะวันออก', area: 'เมือง, สระแก้ว',         members: 189,  providers: 14, activeListings: 10,  image: '🌿', emoji: '🌿', description: 'ชายแดนตะวันออก สวนผลไม้ เกษตรอินทรีย์ งานช่างชุมชน',     lat: 13.8240, lng: 102.0645, rating: 4.3, tags: ['เกษตร', 'ผลไม้', 'งานช่าง'],             trial: true,  trialEnd: '30 เม.ย. 2569', serviceRadius: 6  },
  { id: '40', name: 'จันทบุรี ผลไม้',           type: 'city',    province: 'จันทบุรี',        region: 'ภาคตะวันออก', area: 'เมือง, จันทบุรี',        members: 267,  providers: 20, activeListings: 15,  image: '🍈', emoji: '🍈', description: 'ราชธานีผลไม้ไทย ทุเรียน มังคุด อัญมณี บรรยากาศเมืองเก่า', lat: 12.6096, lng: 102.1046, rating: 4.6, tags: ['ผลไม้', 'เกษตร', 'อัญมณี'],               trial: false, trialEnd: null,            serviceRadius: 6  },
  // ── ภาคเหนือ (เพิ่มเติม)
  { id: '41', name: 'เพชรบูรณ์ เมือง',          type: 'city',    province: 'เพชรบูรณ์',       region: 'ภาคเหนือ',   area: 'เมือง, เพชรบูรณ์',       members: 198,  providers: 14, activeListings: 10,  image: '💎', emoji: '💎', description: 'เมืองดอกไม้งาม นวดสมุนไพร เกษตรบนดอย ธรรมชาติสมบูรณ์',  lat: 16.4192, lng: 101.1585, rating: 4.4, tags: ['สุขภาพ', 'เกษตร', 'ธรรมชาติ'],            trial: true,  trialEnd: '30 เม.ย. 2569', serviceRadius: 5  },
  { id: '42', name: 'พิษณุโลก เมือง',           type: 'city',    province: 'พิษณุโลก',        region: 'ภาคเหนือ',   area: 'เมือง, พิษณุโลก',        members: 345,  providers: 24, activeListings: 18,  image: '⚔️', emoji: '⚔️', description: 'เมืองสองแคว วัดพระศรีรัตนมหาธาตุ งานช่างฝีมือ อาหารพื้นเมือง', lat: 16.8272, lng: 100.2659, rating: 4.5, tags: ['งานช่าง', 'อาหาร', 'ท่องเที่ยว'],         trial: false, trialEnd: null,            serviceRadius: 6  },
  { id: '43', name: 'อุตรดิตถ์ เมือง',          type: 'city',    province: 'อุตรดิตถ์',       region: 'ภาคเหนือ',   area: 'เมือง, อุตรดิตถ์',       members: 167,  providers: 12, activeListings: 9,   image: '🍑', emoji: '🍑', description: 'ลางสาดพันธุ์ดีขึ้นชื่อ ผลไม้เมืองเหนือ งานช่างในชุมชน',   lat: 17.6217, lng: 100.0994, rating: 4.4, tags: ['ผลไม้', 'เกษตร', 'อาหาร'],               trial: true,  trialEnd: '30 เม.ย. 2569', serviceRadius: 5  },
  { id: '44', name: 'แพร่ เมืองผ้าหม้อห้อม',    type: 'city',    province: 'แพร่',            region: 'ภาคเหนือ',   area: 'เมือง, แพร่',            members: 223,  providers: 16, activeListings: 12,  image: '👘', emoji: '👘', description: 'ผ้าหม้อห้อมย้อมธรรมชาติขึ้นชื่อ เมืองเก่าบรรยากาศดี',      lat: 18.1443, lng: 100.1408, rating: 4.5, tags: ['ผ้าหม้อห้อม', 'หัตถกรรม', 'ท่องเที่ยว'],  trial: false, trialEnd: null,            serviceRadius: 4  },
  { id: '45', name: 'ตาก เมือง',                type: 'city',    province: 'ตาก',             region: 'ภาคเหนือ',   area: 'เมือง, ตาก',             members: 145,  providers: 10, activeListings: 8,   image: '🌲', emoji: '🌲', description: 'ประตูสู่ชายแดนพม่า เกษตรอินทรีย์บนดอย ธรรมชาติสมบูรณ์',  lat: 16.8697, lng: 99.1259,  rating: 4.3, tags: ['เกษตร', 'ธรรมชาติ', 'ท่องเที่ยว'],       trial: true,  trialEnd: '30 เม.ย. 2569', serviceRadius: 7  },
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
  const province = s.province ?? fallback?.province ?? ''
  return {
    id: c.id,
    name: c.name,
    type: s.type ?? fallback?.type ?? 'city',
    province,
    region: fallback?.region ?? getRegion(province),
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
