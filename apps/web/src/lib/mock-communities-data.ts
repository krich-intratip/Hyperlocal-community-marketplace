/**
 * Detailed community data indexed by ID (1-15).
 * Used by /communities/[id]/_community-page.tsx for per-ID lookup.
 */

export interface CommunityInfo {
  id: string
  name: string
  area: string
  emoji: string
  description: string
  members: number
  providers: number
  rating: number
  totalBookings: number
  trial: boolean
  trialEnd: string
  admin: string
  founded: string
  tags: string[]
}

export interface CommunityProvider {
  id: string
  name: string
  service: string
  rating: number
  reviews: number
  emoji: string
  verified: boolean
  category: string
}

export interface CommunityRecent {
  emoji: string
  title: string
  provider: string
  price: number
}

export interface CommunityCategory {
  slug: string
  name: string
  icon: string
  color: string
  bar: string
  count: number
}

export interface CommunityAnnouncement {
  id: number
  fromSA: boolean
  authorName: string
  authorBadge: string
  title: string
  createdAt: string
  body: string
}

export interface CommunityDetail {
  community: CommunityInfo
  providers: CommunityProvider[]
  recent: CommunityRecent[]
  categories: CommunityCategory[]
  announcements: CommunityAnnouncement[]
}

export const COMMUNITY_DETAIL_MAP: Record<string, CommunityDetail> = {
  '1': {
    community: {
      id: '1', name: 'หมู่บ้านศรีนคร', area: 'บางแค, กรุงเทพฯ', emoji: '🏘️',
      description: 'ชุมชนอยู่อาศัยขนาดกลางในเขตบางแค กรุงเทพฯ มีผู้ให้บริการหลากหลายทั้งอาหาร ช่าง และบริการในบ้าน รองรับสมาชิกกว่า 248 ครัวเรือน',
      members: 248, providers: 34, rating: 4.8, totalBookings: 1204,
      trial: true, trialEnd: '30 เม.ย. 2569',
      admin: 'คุณประเสริฐ วงศ์สมบัติ', founded: 'ม.ค. 2567',
      tags: ['อาหาร', 'งานช่าง', 'งานบ้าน', 'สุขภาพ'],
    },
    providers: [
      { id: '1', name: 'คุณแม่สมใจ', service: 'อาหารกล่อง ส้มตำ ลาบ', rating: 4.9, reviews: 128, emoji: '👩‍🍳', verified: true, category: 'FOOD' },
      { id: '2', name: 'ช่างสมชาย', service: 'ซ่อมแอร์ / ประปา', rating: 4.8, reviews: 87, emoji: '👨‍🔧', verified: true, category: 'REPAIR' },
      { id: '11', name: 'ช่างวิชัย', service: 'ซ่อมท่อน้ำ-ประปา', rating: 4.6, reviews: 52, emoji: '🔧', verified: true, category: 'REPAIR' },
      { id: '3', name: 'แม่บ้านสาวิตรี', service: 'ทำความสะอาดบ้าน', rating: 4.7, reviews: 64, emoji: '🧹', verified: true, category: 'HOME_SERVICES' },
    ],
    recent: [
      { emoji: '🍱', title: 'อาหารกล่องส่งถึงบ้าน', provider: 'คุณแม่สมใจ', price: 80 },
      { emoji: '🔧', title: 'ล้างแอร์ + ตรวจระบบ', provider: 'ช่างสมชาย', price: 500 },
      { emoji: '🔧', title: 'ซ่อมก๊อกน้ำรั่ว', provider: 'ช่างวิชัย', price: 400 },
    ],
    categories: [
      { slug: 'FOOD', name: 'อาหาร', icon: '🍱', color: 'bg-orange-50 border-orange-100', bar: 'bg-orange-400', count: 10 },
      { slug: 'REPAIR', name: 'งานช่าง', icon: '🔧', color: 'bg-blue-50 border-blue-100', bar: 'bg-blue-400', count: 8 },
      { slug: 'HOME_SERVICES', name: 'งานบ้าน', icon: '🏠', color: 'bg-green-50 border-green-100', bar: 'bg-green-400', count: 7 },
      { slug: 'HEALTH_WELLNESS', name: 'สุขภาพ', icon: '💆', color: 'bg-pink-50 border-pink-100', bar: 'bg-pink-400', count: 5 },
      { slug: 'TUTORING', name: 'สอนพิเศษ', icon: '📚', color: 'bg-purple-50 border-purple-100', bar: 'bg-purple-400', count: 4 },
    ],
    announcements: [
      {
        id: 1, fromSA: true, authorName: 'Super Admin', authorBadge: 'Platform',
        title: 'ช่วงทดลองใช้งาน 90 วัน', createdAt: '10 มี.ค. 2569',
        body: 'ทุกชุมชนได้รับช่วงทดลองใช้งานระบบฟรี 90 วัน ไม่มีค่าธรรมเนียมและค่า Commission ในช่วงนี้',
      },
      {
        id: 2, fromSA: false, authorName: 'คุณประเสริฐ วงศ์สมบัติ', authorBadge: 'Community Admin',
        title: 'ประกาศรับสมัครผู้ให้บริการอาหาร', createdAt: '15 มี.ค. 2569',
        body: 'ชุมชนหมู่บ้านศรีนครต้องการผู้ให้บริการอาหาร เช่น ข้าวกล่อง ขนม อาหารเช้า เพิ่มเติม สนใจสมัครได้ที่เมนู "สมัครเป็นผู้ให้บริการ"',
      },
    ],
  },

  '2': {
    community: {
      id: '2', name: 'คอนโด The Base', area: 'ลาดพร้าว, กรุงเทพฯ', emoji: '🏢',
      description: 'คอนโดมิเนียมระดับพรีเมียม ใจกลางเมืองลาดพร้าว ผู้พักอาศัยหลากหลายอาชีพ ทั้ง ฟรีแลนซ์ นักเรียน และมืออาชีพ มี Co-Working Space และสิ่งอำนวยความสะดวกครบครัน',
      members: 520, providers: 22, rating: 4.7, totalBookings: 892,
      trial: true, trialEnd: '15 พ.ค. 2569',
      admin: 'คุณสุนิสา ศรีสุวรรณ', founded: 'มี.ค. 2567',
      tags: ['ฟรีแลนซ์', 'สอนพิเศษ', 'อาหาร', 'งานบ้าน'],
    },
    providers: [
      { id: '3', name: 'ครูน้องใหม่', service: 'สอนภาษาอังกฤษ-คณิต', rating: 5.0, reviews: 42, emoji: '👩‍🏫', verified: true, category: 'TUTORING' },
      { id: '4', name: 'บริษัท Clean Home', service: 'ทำความสะอาดบ้าน', rating: 4.7, reviews: 203, emoji: '🧹', verified: true, category: 'HOME_SERVICES' },
      { id: '9', name: 'ดีไซเนอร์เอ', service: 'ออกแบบ Logo & Brand', rating: 4.8, reviews: 19, emoji: '👨‍💻', verified: true, category: 'FREELANCE' },
      { id: '12', name: 'ครัวคลีนคลีน', service: 'อาหารคลีนออเดอร์ล่วงหน้า', rating: 4.9, reviews: 95, emoji: '🥗', verified: true, category: 'FOOD' },
    ],
    recent: [
      { emoji: '📚', title: 'สอน IELTS Listening', provider: 'ครูน้องใหม่', price: 300 },
      { emoji: '🥗', title: 'เซ็ตคลีนสัปดาห์', provider: 'ครัวคลีนคลีน', price: 120 },
      { emoji: '💻', title: 'ออกแบบ Pitch Deck', provider: 'ดีไซเนอร์เอ', price: 3500 },
    ],
    categories: [
      { slug: 'TUTORING', name: 'สอนพิเศษ', icon: '📚', color: 'bg-purple-50 border-purple-100', bar: 'bg-purple-400', count: 8 },
      { slug: 'FOOD', name: 'อาหาร', icon: '🍱', color: 'bg-orange-50 border-orange-100', bar: 'bg-orange-400', count: 6 },
      { slug: 'FREELANCE', name: 'ฟรีแลนซ์', icon: '💻', color: 'bg-indigo-50 border-indigo-100', bar: 'bg-indigo-400', count: 5 },
      { slug: 'HOME_SERVICES', name: 'งานบ้าน', icon: '🏠', color: 'bg-green-50 border-green-100', bar: 'bg-green-400', count: 3 },
    ],
    announcements: [
      {
        id: 1, fromSA: true, authorName: 'Super Admin', authorBadge: 'Platform',
        title: 'ฟีเจอร์ใหม่: จองออนไลน์แบบ Real-time', createdAt: '12 มี.ค. 2569',
        body: 'ระบบจองออนไลน์ได้รับการอัปเดต สามารถดูสถานะงานแบบ Real-time ผ่านหน้า "การจองของฉัน" ได้เลย',
      },
      {
        id: 2, fromSA: false, authorName: 'คุณสุนิสา ศรีสุวรรณ', authorBadge: 'Community Admin',
        title: 'เปิดรับครูสอนพิเศษเพิ่มเติม', createdAt: '18 มี.ค. 2569',
        body: 'มีผู้ปกครองหลายท่านต้องการครูสอนพิเศษวิชาวิทยาศาสตร์และฟิสิกส์ ระดับมัธยม สนใจสมัครได้เลย',
      },
    ],
  },

  '3': {
    community: {
      id: '3', name: 'ชุมชนเมืองทอง', area: 'เมืองทอง, นนทบุรี', emoji: '🌆',
      description: 'ชุมชนขนาดใหญ่ที่สุดในระบบ ครบครันด้วยบริการหลากหลาย ตลาดชุมชนคึกคักทุกวัน รองรับทั้งครอบครัว ผู้สูงอายุ และวัยทำงาน มีสิ่งอำนวยความสะดวกและสาธารณูปโภคครบถ้วน',
      members: 890, providers: 45, rating: 4.9, totalBookings: 3512,
      trial: false, trialEnd: '',
      admin: 'คุณวิรัตน์ ตั้งใจดี', founded: 'ส.ค. 2566',
      tags: ['อาหาร', 'งานบ้าน', 'ดูแลผู้สูงอายุ', 'ซ่อมแซม', 'Community Sharing'],
    },
    providers: [
      { id: '5', name: 'คุณสมศรี', service: 'ดูแลผู้สูงอายุกลางวัน', rating: 4.9, reviews: 31, emoji: '👩‍⚕️', verified: false, category: 'ELDERLY_CARE' },
      { id: '10', name: 'Community Pool', service: 'ยืม-คืนอุปกรณ์ชุมชน', rating: 4.6, reviews: 22, emoji: '🤝', verified: false, category: 'COMMUNITY_SHARING' },
      { id: '20', name: 'สวนสวยบางใหญ่', service: 'จัดสวน ดูแลสวนรายเดือน', rating: 4.6, reviews: 33, emoji: '🌳', verified: true, category: 'HOME_SERVICES' },
      { id: '4', name: 'บริษัท Clean Home', service: 'ทำความสะอาดบ้าน', rating: 4.7, reviews: 203, emoji: '🧹', verified: true, category: 'HOME_SERVICES' },
    ],
    recent: [
      { emoji: '👴', title: 'ดูแลผู้สูงอายุ 1 วัน', provider: 'คุณสมศรี', price: 1200 },
      { emoji: '🤝', title: 'ยืมหม้อทอดไร้น้ำมัน', provider: 'Community Pool', price: 80 },
      { emoji: '🌳', title: 'ตัดแต่งสวนรายเดือน', provider: 'สวนสวยบางใหญ่', price: 800 },
    ],
    categories: [
      { slug: 'HOME_SERVICES', name: 'งานบ้าน', icon: '🏠', color: 'bg-green-50 border-green-100', bar: 'bg-green-400', count: 12 },
      { slug: 'FOOD', name: 'อาหาร', icon: '🍱', color: 'bg-orange-50 border-orange-100', bar: 'bg-orange-400', count: 10 },
      { slug: 'ELDERLY_CARE', name: 'ดูแลผู้สูงอายุ', icon: '👵', color: 'bg-teal-50 border-teal-100', bar: 'bg-teal-400', count: 6 },
      { slug: 'REPAIR', name: 'งานช่าง', icon: '🔧', color: 'bg-blue-50 border-blue-100', bar: 'bg-blue-400', count: 8 },
      { slug: 'COMMUNITY_SHARING', name: 'Community Sharing', icon: '🤝', color: 'bg-amber-50 border-amber-100', bar: 'bg-amber-400', count: 5 },
      { slug: 'AGRICULTURE', name: 'เกษตรกรรม', icon: '🌿', color: 'bg-lime-50 border-lime-100', bar: 'bg-lime-400', count: 4 },
    ],
    announcements: [
      {
        id: 1, fromSA: true, authorName: 'Super Admin', authorBadge: 'Platform',
        title: 'ชุมชนเมืองทองผ่าน Trial แล้ว! 🎉', createdAt: '5 มี.ค. 2569',
        body: 'ยินดีด้วย! ชุมชนเมืองทองผ่านช่วง Trial เป็นชุมชนแรกในระบบ ขอบคุณสมาชิกทุกท่านที่ให้ความไว้วางใจ',
      },
      {
        id: 2, fromSA: false, authorName: 'คุณวิรัตน์ ตั้งใจดี', authorBadge: 'Community Admin',
        title: 'งาน Community Day วันที่ 30 มี.ค.', createdAt: '20 มี.ค. 2569',
        body: 'ขอเชิญสมาชิกทุกท่านร่วมงาน Community Day วันเสาร์ที่ 30 มีนาคม 2569 มีกิจกรรมมากมาย ทั้งตลาดนัด โชว์ความสามารถ และลุ้นของรางวัล',
      },
    ],
  },

  '4': {
    community: {
      id: '4', name: 'หมู่บ้านกรีนวิลล์', area: 'บึงกุ่ม, กรุงเทพฯ', emoji: '🌿',
      description: 'หมู่บ้านสไตล์ธรรมชาติ บรรยากาศร่มรื่น ล้อมรอบด้วยสวนและพื้นที่สีเขียว เหมาะสำหรับครอบครัว มุ่งเน้นบริการสุขภาพ นวดบำบัด และสิ่งแวดล้อม',
      members: 215, providers: 18, rating: 4.8, totalBookings: 678,
      trial: true, trialEnd: '31 พ.ค. 2569',
      admin: 'คุณปรัชญา เขียวสด', founded: 'พ.ย. 2567',
      tags: ['สุขภาพ', 'นวด', 'งานบ้าน', 'ธรรมชาติ'],
    },
    providers: [
      { id: '7', name: 'หมอนวดประเสริฐ', service: 'นวดแผนไทย ออกนอกสถานที่', rating: 4.9, reviews: 74, emoji: '🧘', verified: true, category: 'HEALTH_WELLNESS' },
      { id: '4', name: 'บริษัท Clean Home', service: 'ทำความสะอาดบ้านและสวน', rating: 4.7, reviews: 203, emoji: '🧹', verified: true, category: 'HOME_SERVICES' },
      { id: '20', name: 'สวนสวยบางใหญ่', service: 'จัดสวนและตัดหญ้า', rating: 4.6, reviews: 33, emoji: '🌳', verified: true, category: 'HOME_SERVICES' },
    ],
    recent: [
      { emoji: '💆', title: 'นวดแผนไทย 2 ชั่วโมง', provider: 'หมอนวดประเสริฐ', price: 400 },
      { emoji: '🧹', title: 'ทำความสะอาดบ้าน', provider: 'บริษัท Clean Home', price: 800 },
      { emoji: '🌳', title: 'ตัดแต่งสวนหน้าบ้าน', provider: 'สวนสวยบางใหญ่', price: 500 },
    ],
    categories: [
      { slug: 'HEALTH_WELLNESS', name: 'สุขภาพ', icon: '💆', color: 'bg-pink-50 border-pink-100', bar: 'bg-pink-400', count: 7 },
      { slug: 'HOME_SERVICES', name: 'งานบ้าน', icon: '🏠', color: 'bg-green-50 border-green-100', bar: 'bg-green-400', count: 6 },
      { slug: 'REPAIR', name: 'งานช่าง', icon: '🔧', color: 'bg-blue-50 border-blue-100', bar: 'bg-blue-400', count: 3 },
      { slug: 'ELDERLY_CARE', name: 'ดูแลผู้สูงอายุ', icon: '👵', color: 'bg-teal-50 border-teal-100', bar: 'bg-teal-400', count: 2 },
    ],
    announcements: [
      {
        id: 1, fromSA: false, authorName: 'คุณปรัชญา เขียวสด', authorBadge: 'Community Admin',
        title: 'คลาสโยคะชุมชนทุกวันเสาร์', createdAt: '14 มี.ค. 2569',
        body: 'เริ่มต้น 22 มีนาคมนี้ มีคลาสโยคะฟรีสำหรับสมาชิกชุมชนทุกวันเสาร์ เวลา 07:00–08:00 น. ที่สวนส่วนกลาง',
      },
    ],
  },

  '5': {
    community: {
      id: '5', name: 'ชุมชนริมน้ำ', area: 'ปทุมธานี', emoji: '🌊',
      description: 'ชุมชนริมแม่น้ำเจ้าพระยา วิถีชีวิตเรียบง่าย ผลิตภัณฑ์ชุมชนดั้งเดิม เน้นเกษตรอินทรีย์ งานฝีมือ และการแบ่งปันทรัพยากรในชุมชน',
      members: 178, providers: 12, rating: 4.6, totalBookings: 345,
      trial: true, trialEnd: '30 มิ.ย. 2569',
      admin: 'คุณทองคำ เกษตรกร', founded: 'ต.ค. 2567',
      tags: ['เกษตรอินทรีย์', 'ผักสด', 'ของชุมชน', 'แบ่งปัน'],
    },
    providers: [
      { id: '8', name: 'สวนคุณลุงทอง', service: 'ผักออร์แกนิคส่งรายสัปดาห์', rating: 4.7, reviews: 38, emoji: '👨‍🌾', verified: false, category: 'AGRICULTURE' },
      { id: '10', name: 'Community Pool', service: 'ยืม-คืนอุปกรณ์การเกษตร', rating: 4.6, reviews: 22, emoji: '🤝', verified: false, category: 'COMMUNITY_SHARING' },
    ],
    recent: [
      { emoji: '🌿', title: 'เซ็ตผักออร์แกนิค 5 ชนิด', provider: 'สวนคุณลุงทอง', price: 250 },
      { emoji: '🤝', title: 'ยืมเครื่องมือสวน', provider: 'Community Pool', price: 50 },
    ],
    categories: [
      { slug: 'AGRICULTURE', name: 'เกษตรกรรม', icon: '🌿', color: 'bg-lime-50 border-lime-100', bar: 'bg-lime-400', count: 5 },
      { slug: 'COMMUNITY_SHARING', name: 'Community Sharing', icon: '🤝', color: 'bg-amber-50 border-amber-100', bar: 'bg-amber-400', count: 4 },
      { slug: 'FOOD', name: 'อาหาร', icon: '🍱', color: 'bg-orange-50 border-orange-100', bar: 'bg-orange-400', count: 3 },
    ],
    announcements: [
      {
        id: 1, fromSA: false, authorName: 'คุณทองคำ เกษตรกร', authorBadge: 'Community Admin',
        title: 'ตลาดสินค้าชุมชน ทุกวันอาทิตย์', createdAt: '11 มี.ค. 2569',
        body: 'ขอเชิญสมาชิกนำผลิตภัณฑ์ชุมชนมาจำหน่ายที่ตลาดนัดริมน้ำทุกวันอาทิตย์ 06:00–10:00 น. ฟรีค่าที่ตั้งสำหรับสมาชิก',
      },
    ],
  },

  '6': {
    community: {
      id: '6', name: 'เมืองเชียงใหม่ซิตี้', area: 'เมือง, เชียงใหม่', emoji: '🏔️',
      description: 'ศูนย์กลางบริการชุมชนภาคเหนือ รวบรวมผู้ให้บริการกว่า 78 ราย ทั้งอาหารเหนือ งานฝีมือ ท่องเที่ยว และการศึกษา เป็นชุมชนที่ใหญ่ที่สุดในภาคเหนือ',
      members: 1240, providers: 78, rating: 4.8, totalBookings: 4120,
      trial: false, trialEnd: '',
      admin: 'คุณชาญชัย ล้านนา', founded: 'มิ.ย. 2566',
      tags: ['อาหารเหนือ', 'งานฝีมือ', 'ท่องเที่ยว', 'สอนพิเศษ', 'ช่าง'],
    },
    providers: [
      { id: '6', name: 'ร้านป้าแดง', service: 'กระเป๋าผ้าทอมือ handmade', rating: 4.8, reviews: 56, emoji: '👩‍🎨', verified: true, category: 'HANDMADE' },
      { id: '13', name: 'เชฟนุ้ย ครัวเหนือ', service: 'คลาสทำอาหารเหนือ', rating: 4.8, reviews: 47, emoji: '👨‍🍳', verified: true, category: 'FOOD' },
      { id: '15', name: 'ไกด์นุ ดอยสุเทพ', service: 'ไกด์เดินป่าดอยสุเทพ', rating: 4.7, reviews: 63, emoji: '🏔️', verified: true, category: 'RECREATION' },
      { id: '19', name: 'ช่างไฟวิมล', service: 'ช่างไฟฟ้า ติดตั้ง ซ่อม', rating: 4.7, reviews: 41, emoji: '⚡', verified: true, category: 'REPAIR' },
    ],
    recent: [
      { emoji: '🎨', title: 'กระเป๋าผ้าทอ (L)', provider: 'ร้านป้าแดง', price: 420 },
      { emoji: '🫕', title: 'คลาสทำข้าวซอย', provider: 'เชฟนุ้ย ครัวเหนือ', price: 800 },
      { emoji: '⛰️', title: 'ไกด์เดินป่าดอยสุเทพ', provider: 'ไกด์นุ ดอยสุเทพ', price: 600 },
    ],
    categories: [
      { slug: 'FOOD', name: 'อาหาร', icon: '🍱', color: 'bg-orange-50 border-orange-100', bar: 'bg-orange-400', count: 20 },
      { slug: 'HANDMADE', name: 'งานฝีมือ', icon: '🎨', color: 'bg-rose-50 border-rose-100', bar: 'bg-rose-400', count: 15 },
      { slug: 'RECREATION', name: 'ท่องเที่ยว', icon: '⛰️', color: 'bg-sky-50 border-sky-100', bar: 'bg-sky-400', count: 12 },
      { slug: 'TUTORING', name: 'สอนพิเศษ', icon: '📚', color: 'bg-purple-50 border-purple-100', bar: 'bg-purple-400', count: 8 },
      { slug: 'REPAIR', name: 'งานช่าง', icon: '🔧', color: 'bg-blue-50 border-blue-100', bar: 'bg-blue-400', count: 10 },
      { slug: 'HEALTH_WELLNESS', name: 'สุขภาพ', icon: '💆', color: 'bg-pink-50 border-pink-100', bar: 'bg-pink-400', count: 7 },
      { slug: 'AGRICULTURE', name: 'เกษตร', icon: '🌿', color: 'bg-lime-50 border-lime-100', bar: 'bg-lime-400', count: 6 },
    ],
    announcements: [
      {
        id: 1, fromSA: true, authorName: 'Super Admin', authorBadge: 'Platform',
        title: 'เมืองเชียงใหม่ซิตี้: ชุมชน Top 1 ภาคเหนือ 🏆', createdAt: '8 มี.ค. 2569',
        body: 'เมืองเชียงใหม่ซิตี้ได้รับรางวัลชุมชนอันดับ 1 ของภาคเหนือ จากจำนวนธุรกรรมและความพึงพอใจของสมาชิก',
      },
      {
        id: 2, fromSA: false, authorName: 'คุณชาญชัย ล้านนา', authorBadge: 'Community Admin',
        title: 'เทศกาลผู้ให้บริการเชียงใหม่ มิ.ย. 2569', createdAt: '15 มี.ค. 2569',
        body: 'เตรียมพบกับงานแสดงสินค้าและบริการชุมชนครั้งยิ่งใหญ่ มิถุนายน 2569 ณ ถนนนิมมานเฮมิน เชิญชวนผู้ให้บริการและลูกค้าร่วมงาน',
      },
    ],
  },

  '7': {
    community: {
      id: '7', name: 'นิมมานเฮมิน วิลเลจ', area: 'นิมมานเฮมิน, เชียงใหม่', emoji: '☕',
      description: 'ชุมชนย่านฮิปสเตอร์ในใจกลางนิมมานเฮมิน เชียงใหม่ เต็มไปด้วยร้านกาแฟ สปา ฟรีแลนซ์ และบริการไลฟ์สไตล์คุณภาพสูง เหมาะสำหรับ Digital Nomad และ Creative',
      members: 420, providers: 35, rating: 4.9, totalBookings: 1560,
      trial: true, trialEnd: '30 มิ.ย. 2569',
      admin: 'คุณภาวิตา ครีเอทีฟ', founded: 'พ.ค. 2567',
      tags: ['สปา', 'ฟรีแลนซ์', 'ไลฟ์สไตล์', 'Digital Nomad'],
    },
    providers: [
      { id: '14', name: 'สปาล้านนา', service: 'สปา นวด อโรมา', rating: 4.9, reviews: 112, emoji: '🌸', verified: true, category: 'HEALTH_WELLNESS' },
      { id: '9', name: 'ดีไซเนอร์เอ', service: 'Graphic Design & Brand', rating: 4.8, reviews: 19, emoji: '👨‍💻', verified: true, category: 'FREELANCE' },
    ],
    recent: [
      { emoji: '🌺', title: 'สปาอโรมา 90 นาที', provider: 'สปาล้านนา', price: 1200 },
      { emoji: '💻', title: 'Social Media Design', provider: 'ดีไซเนอร์เอ', price: 1500 },
    ],
    categories: [
      { slug: 'HEALTH_WELLNESS', name: 'สปา & สุขภาพ', icon: '🌸', color: 'bg-pink-50 border-pink-100', bar: 'bg-pink-400', count: 12 },
      { slug: 'FREELANCE', name: 'ฟรีแลนซ์', icon: '💻', color: 'bg-indigo-50 border-indigo-100', bar: 'bg-indigo-400', count: 10 },
      { slug: 'FOOD', name: 'คาเฟ่ & อาหาร', icon: '☕', color: 'bg-amber-50 border-amber-100', bar: 'bg-amber-400', count: 8 },
      { slug: 'TUTORING', name: 'สอน', icon: '📚', color: 'bg-purple-50 border-purple-100', bar: 'bg-purple-400', count: 5 },
    ],
    announcements: [
      {
        id: 1, fromSA: false, authorName: 'คุณภาวิตา ครีเอทีฟ', authorBadge: 'Community Admin',
        title: 'Nimman Creative Night Market 🌙', createdAt: '16 มี.ค. 2569',
        body: 'ขอเชิญทุกท่านร่วมงาน Nimman Creative Night Market วันศุกร์สุดท้ายของเดือน เวลา 17:00–22:00 น. มีสินค้า Creative ราคาพิเศษ',
      },
    ],
  },

  '8': {
    community: {
      id: '8', name: 'ป่าตอง ซีไซด์', area: 'ป่าตอง, ภูเก็ต', emoji: '🏖️',
      description: 'ชุมชนริมทะเลภูเก็ต ย่านป่าตอง รวบรวมบริการด้านทะเล อาหารทะเลสด กีฬาทางน้ำ และท่องเที่ยว เหมาะสำหรับนักท่องเที่ยวและผู้อยู่อาศัย',
      members: 680, providers: 42, rating: 4.8, totalBookings: 2890,
      trial: true, trialEnd: '15 ก.ค. 2569',
      admin: 'คุณวันชัย ทะเลงาม', founded: 'ก.พ. 2567',
      tags: ['อาหารทะเล', 'ดำน้ำ', 'ท่องเที่ยว', 'กีฬาทางน้ำ'],
    },
    providers: [
      { id: '16', name: 'ป้าหนู อาหารทะเล', service: 'อาหารทะเลสด ปากน้ำ', rating: 4.8, reviews: 89, emoji: '🦞', verified: true, category: 'FOOD' },
      { id: '17', name: 'ครูดำน้ำภูเก็ต', service: 'สอนดำน้ำ PADI Open Water', rating: 4.9, reviews: 78, emoji: '🤿', verified: true, category: 'FITNESS' },
    ],
    recent: [
      { emoji: '🦐', title: 'กุ้งเผา 500 กรัม', provider: 'ป้าหนู อาหารทะเล', price: 350 },
      { emoji: '🤿', title: 'Snorkeling Day Trip', provider: 'ครูดำน้ำภูเก็ต', price: 1200 },
    ],
    categories: [
      { slug: 'FOOD', name: 'อาหารทะเล', icon: '🦐', color: 'bg-orange-50 border-orange-100', bar: 'bg-orange-400', count: 14 },
      { slug: 'FITNESS', name: 'กีฬาทางน้ำ', icon: '🤿', color: 'bg-blue-50 border-blue-100', bar: 'bg-blue-400', count: 10 },
      { slug: 'RECREATION', name: 'ท่องเที่ยว', icon: '⛵', color: 'bg-sky-50 border-sky-100', bar: 'bg-sky-400', count: 12 },
      { slug: 'HEALTH_WELLNESS', name: 'สปา', icon: '🌺', color: 'bg-pink-50 border-pink-100', bar: 'bg-pink-400', count: 6 },
    ],
    announcements: [
      {
        id: 1, fromSA: true, authorName: 'Super Admin', authorBadge: 'Platform',
        title: 'ป่าตองซีไซด์: ชุมชน Top 1 ภาคใต้ 🏆', createdAt: '10 มี.ค. 2569',
        body: 'ยินดีด้วย ชุมชนป่าตองซีไซด์ได้รับรางวัลชุมชนที่เติบโตเร็วที่สุดในภาคใต้',
      },
      {
        id: 2, fromSA: false, authorName: 'คุณวันชัย ทะเลงาม', authorBadge: 'Community Admin',
        title: 'ฤดูกาลท่องเที่ยว High Season เริ่มแล้ว!', createdAt: '17 มี.ค. 2569',
        body: 'High Season เริ่มต้นแล้ว! ผู้ให้บริการควรเพิ่มสต็อคและแจ้งช่วงเวลาว่างเพื่อรองรับนักท่องเที่ยว',
      },
    ],
  },

  '9': {
    community: {
      id: '9', name: 'ขอนแก่น อัพทาวน์', area: 'เมือง, ขอนแก่น', emoji: '🌶️',
      description: 'ชุมชนใจกลางขอนแก่น เมืองใหญ่อันดับ 1 ของภาคอีสาน รวบรวมบริการอาหารอีสานแท้ ช่างซ่อม และสอนพิเศษ สะดวกเดินทาง ใกล้แหล่งช้อปปิ้งและมหาวิทยาลัย',
      members: 560, providers: 38, rating: 4.7, totalBookings: 1820,
      trial: true, trialEnd: '31 ก.ค. 2569',
      admin: 'คุณสมบูรณ์ ขอนแก่น', founded: 'ก.ย. 2567',
      tags: ['อาหารอีสาน', 'ซ่อมแซม', 'สอนพิเศษ', 'เกษตร'],
    },
    providers: [
      { id: '18', name: 'ร้านส้มตำยายแดง', service: 'ส้มตำ ลาบ อีสานแท้', rating: 4.7, reviews: 64, emoji: '🌶️', verified: true, category: 'FOOD' },
      { id: '8', name: 'สวนคุณลุงทอง', service: 'ผักออร์แกนิค รายสัปดาห์', rating: 4.7, reviews: 38, emoji: '👨‍🌾', verified: false, category: 'AGRICULTURE' },
    ],
    recent: [
      { emoji: '🥗', title: 'ส้มตำไทย + ข้าวเหนียว', provider: 'ร้านส้มตำยายแดง', price: 60 },
      { emoji: '🌿', title: 'เซ็ตผักออร์แกนิค', provider: 'สวนคุณลุงทอง', price: 280 },
    ],
    categories: [
      { slug: 'FOOD', name: 'อาหาร', icon: '🍱', color: 'bg-orange-50 border-orange-100', bar: 'bg-orange-400', count: 14 },
      { slug: 'REPAIR', name: 'งานช่าง', icon: '🔧', color: 'bg-blue-50 border-blue-100', bar: 'bg-blue-400', count: 8 },
      { slug: 'TUTORING', name: 'สอนพิเศษ', icon: '📚', color: 'bg-purple-50 border-purple-100', bar: 'bg-purple-400', count: 7 },
      { slug: 'AGRICULTURE', name: 'เกษตร', icon: '🌿', color: 'bg-lime-50 border-lime-100', bar: 'bg-lime-400', count: 5 },
      { slug: 'HOME_SERVICES', name: 'งานบ้าน', icon: '🏠', color: 'bg-green-50 border-green-100', bar: 'bg-green-400', count: 4 },
    ],
    announcements: [
      {
        id: 1, fromSA: false, authorName: 'คุณสมบูรณ์ ขอนแก่น', authorBadge: 'Community Admin',
        title: 'งาน OTOP ขอนแก่น อีสาน Expo', createdAt: '19 มี.ค. 2569',
        body: 'ขอเชิญผู้ให้บริการร่วมแสดงสินค้าในงาน OTOP ขอนแก่น Expo เดือนเมษายน ลงทะเบียนได้ที่ Admin',
      },
    ],
  },

  '10': {
    community: {
      id: '10', name: 'หาดใหญ่ สมาร์ทซิตี้', area: 'หาดใหญ่, สงขลา', emoji: '🌴',
      description: 'ชุมชนศูนย์กลางภาคใต้ตอนล่าง หาดใหญ่เป็นเมืองการค้าขนาดใหญ่ รวบรวมบริการหลากหลาย ทั้งอาหารใต้ บริการซ่อมแซม สุขภาพ และการศึกษา',
      members: 720, providers: 48, rating: 4.7, totalBookings: 2140,
      trial: false, trialEnd: '',
      admin: 'คุณสุวิทย์ ภาคใต้', founded: 'ก.ค. 2566',
      tags: ['อาหารใต้', 'ซ่อมแซม', 'สุขภาพ', 'สอนพิเศษ'],
    },
    providers: [
      { id: '7', name: 'หมอนวดประเสริฐ', service: 'นวดแผนไทย', rating: 4.9, reviews: 74, emoji: '🧘', verified: true, category: 'HEALTH_WELLNESS' },
      { id: '2', name: 'ช่างสมชาย', service: 'ซ่อมแอร์ / ประปา', rating: 4.8, reviews: 87, emoji: '👨‍🔧', verified: true, category: 'REPAIR' },
      { id: '3', name: 'ครูน้องใหม่', service: 'สอนภาษาอังกฤษ', rating: 5.0, reviews: 42, emoji: '👩‍🏫', verified: true, category: 'TUTORING' },
    ],
    recent: [
      { emoji: '🍜', title: 'ข้าวยำปักษ์ใต้', provider: 'แม่ครัวภาคใต้', price: 70 },
      { emoji: '🔧', title: 'ล้างแอร์ครั้งใหญ่', provider: 'ช่างสมชาย', price: 600 },
      { emoji: '📚', title: 'สอน TOEIC', provider: 'ครูน้องใหม่', price: 350 },
    ],
    categories: [
      { slug: 'FOOD', name: 'อาหาร', icon: '🍱', color: 'bg-orange-50 border-orange-100', bar: 'bg-orange-400', count: 16 },
      { slug: 'REPAIR', name: 'งานช่าง', icon: '🔧', color: 'bg-blue-50 border-blue-100', bar: 'bg-blue-400', count: 12 },
      { slug: 'HEALTH_WELLNESS', name: 'สุขภาพ', icon: '💆', color: 'bg-pink-50 border-pink-100', bar: 'bg-pink-400', count: 9 },
      { slug: 'TUTORING', name: 'สอนพิเศษ', icon: '📚', color: 'bg-purple-50 border-purple-100', bar: 'bg-purple-400', count: 8 },
      { slug: 'HOME_SERVICES', name: 'งานบ้าน', icon: '🏠', color: 'bg-green-50 border-green-100', bar: 'bg-green-400', count: 3 },
    ],
    announcements: [
      {
        id: 1, fromSA: true, authorName: 'Super Admin', authorBadge: 'Platform',
        title: 'ขยายการให้บริการ: เพิ่มพื้นที่ภาคใต้', createdAt: '13 มี.ค. 2569',
        body: 'Platform กำลังขยายตัวในภาคใต้ หาดใหญ่เป็นหัวเมืองสำคัญ เตรียมรับฟีเจอร์ใหม่เร็วๆ นี้',
      },
    ],
  },

  '11': {
    community: {
      id: '11', name: 'สุขุมวิท อาร์บัน', area: 'สุขุมวิท, กรุงเทพฯ', emoji: '🏙️',
      description: 'ชุมชนคนเมืองในย่านสุขุมวิท ศูนย์กลางธุรกิจและไลฟ์สไตล์ รวบรวมฟรีแลนซ์ครีเอทีฟ ผู้เชี่ยวชาญด้าน IT และบริการระดับพรีเมียม เหมาะสำหรับมืออาชีพ',
      members: 780, providers: 52, rating: 4.8, totalBookings: 2680,
      trial: false, trialEnd: '',
      admin: 'คุณนภา อาร์บัน', founded: 'ก.พ. 2567',
      tags: ['ฟรีแลนซ์', 'IT', 'สอนพิเศษ', 'ฟิตเนส', 'อาหาร'],
    },
    providers: [
      { id: '9', name: 'ดีไซเนอร์เอ', service: 'Logo & Brand Design', rating: 4.8, reviews: 19, emoji: '👨‍💻', verified: true, category: 'FREELANCE' },
      { id: '3', name: 'ครูน้องใหม่', service: 'สอนภาษาอังกฤษ', rating: 5.0, reviews: 42, emoji: '👩‍🏫', verified: true, category: 'TUTORING' },
      { id: '12', name: 'ครัวคลีนคลีน', service: 'อาหารคลีน Delivery', rating: 4.9, reviews: 95, emoji: '🥗', verified: true, category: 'FOOD' },
    ],
    recent: [
      { emoji: '💻', title: 'ออกแบบ UX/UI App', provider: 'ดีไซเนอร์เอ', price: 5000 },
      { emoji: '🥗', title: 'เซ็ตคีโต 5 วัน', provider: 'ครัวคลีนคลีน', price: 900 },
      { emoji: '📚', title: 'สอน Business English', provider: 'ครูน้องใหม่', price: 400 },
    ],
    categories: [
      { slug: 'FREELANCE', name: 'ฟรีแลนซ์', icon: '💻', color: 'bg-indigo-50 border-indigo-100', bar: 'bg-indigo-400', count: 15 },
      { slug: 'TUTORING', name: 'สอนพิเศษ', icon: '📚', color: 'bg-purple-50 border-purple-100', bar: 'bg-purple-400', count: 12 },
      { slug: 'FOOD', name: 'อาหาร', icon: '🍱', color: 'bg-orange-50 border-orange-100', bar: 'bg-orange-400', count: 10 },
      { slug: 'FITNESS', name: 'ฟิตเนส', icon: '💪', color: 'bg-blue-50 border-blue-100', bar: 'bg-blue-400', count: 8 },
      { slug: 'HEALTH_WELLNESS', name: 'สุขภาพ', icon: '💆', color: 'bg-pink-50 border-pink-100', bar: 'bg-pink-400', count: 7 },
    ],
    announcements: [
      {
        id: 1, fromSA: false, authorName: 'คุณนภา อาร์บัน', authorBadge: 'Community Admin',
        title: 'Sukhumvit Freelancer Meetup', createdAt: '18 มี.ค. 2569',
        body: 'ขอเชิญ Freelancer ทุกท่านร่วม Meetup ครั้งแรกของชุมชน เนื้อหา: การหา Client และ Pricing Strategy วันเสาร์ที่ 5 เมษายน เวลา 14:00 น.',
      },
    ],
  },

  '12': {
    community: {
      id: '12', name: 'เชียงราย เมืองเก่า', area: 'เมือง, เชียงราย', emoji: '🌸',
      description: 'ชุมชนในเมืองเก่าเชียงราย แหล่งท่องเที่ยวชื่อดัง รวบรวมผลิตภัณฑ์ OTOP งานหัตถกรรม ชา กาแฟดอยสูง และบริการท่องเที่ยวหลากหลาย',
      members: 340, providers: 28, rating: 4.8, totalBookings: 980,
      trial: true, trialEnd: '31 ส.ค. 2569',
      admin: 'คุณพิมพ์ดาว เชียงราย', founded: 'ก.ค. 2567',
      tags: ['OTOP', 'งานหัตถกรรม', 'ชาดอย', 'ท่องเที่ยว'],
    },
    providers: [
      { id: '6', name: 'ร้านป้าแดง', service: 'กระเป๋าผ้าทอมือ', rating: 4.8, reviews: 56, emoji: '👩‍🎨', verified: true, category: 'HANDMADE' },
      { id: '8', name: 'สวนคุณลุงทอง', service: 'ผักออร์แกนิคดอย', rating: 4.7, reviews: 38, emoji: '👨‍🌾', verified: false, category: 'AGRICULTURE' },
    ],
    recent: [
      { emoji: '🎨', title: 'กระเป๋าผ้าซิ่น', provider: 'ร้านป้าแดง', price: 350 },
      { emoji: '🌿', title: 'ชาดอยชุด Premium', provider: 'สวนชาอาข่า', price: 480 },
    ],
    categories: [
      { slug: 'HANDMADE', name: 'งานฝีมือ', icon: '🎨', color: 'bg-rose-50 border-rose-100', bar: 'bg-rose-400', count: 10 },
      { slug: 'AGRICULTURE', name: 'เกษตร', icon: '🌿', color: 'bg-lime-50 border-lime-100', bar: 'bg-lime-400', count: 8 },
      { slug: 'FOOD', name: 'อาหาร', icon: '🍱', color: 'bg-orange-50 border-orange-100', bar: 'bg-orange-400', count: 7 },
      { slug: 'RECREATION', name: 'ท่องเที่ยว', icon: '🗺️', color: 'bg-sky-50 border-sky-100', bar: 'bg-sky-400', count: 3 },
    ],
    announcements: [
      {
        id: 1, fromSA: false, authorName: 'คุณพิมพ์ดาว เชียงราย', authorBadge: 'Community Admin',
        title: 'เทศกาลดอกไม้เชียงราย Flower Festival', createdAt: '21 มี.ค. 2569',
        body: 'ขอเชิญร่วมงานเทศกาลดอกไม้และผลิตภัณฑ์ชุมชน ณ สวนตุงติง เชียงราย เดือนเมษายน 2569',
      },
    ],
  },

  '13': {
    community: {
      id: '13', name: 'โคราช พลาซ่า', area: 'เมือง, นครราชสีมา', emoji: '🦁',
      description: 'ชุมชนใจกลางโคราช เมืองหลวงของอีสาน รวบรวมบริการอาหาร ซ่อมแซม งานบ้าน และสอนพิเศษ ประตูสู่ภาคอีสาน เดินทางสะดวกผ่านรถไฟความเร็วสูง',
      members: 650, providers: 40, rating: 4.7, totalBookings: 1740,
      trial: true, trialEnd: '30 ก.ย. 2569',
      admin: 'คุณสำรวย โคราช', founded: 'ส.ค. 2567',
      tags: ['อาหาร', 'ซ่อมแซม', 'งานบ้าน', 'สอนพิเศษ'],
    },
    providers: [
      { id: '2', name: 'ช่างสมชาย', service: 'ซ่อมแอร์และประปา', rating: 4.8, reviews: 87, emoji: '👨‍🔧', verified: true, category: 'REPAIR' },
      { id: '1', name: 'คุณแม่สมใจ', service: 'อาหารกล่องส่งถึงบ้าน', rating: 4.9, reviews: 128, emoji: '👩‍🍳', verified: true, category: 'FOOD' },
      { id: '4', name: 'บริษัท Clean Home', service: 'ทำความสะอาดบ้าน', rating: 4.7, reviews: 203, emoji: '🧹', verified: true, category: 'HOME_SERVICES' },
    ],
    recent: [
      { emoji: '🍱', title: 'อาหารกล่องส่งถึงบ้าน', provider: 'คุณแม่สมใจ', price: 80 },
      { emoji: '🔧', title: 'ซ่อมแอร์ตรวจระบบ', provider: 'ช่างสมชาย', price: 550 },
      { emoji: '🧹', title: 'ทำความสะอาดรายสัปดาห์', provider: 'บริษัท Clean Home', price: 800 },
    ],
    categories: [
      { slug: 'FOOD', name: 'อาหาร', icon: '🍱', color: 'bg-orange-50 border-orange-100', bar: 'bg-orange-400', count: 13 },
      { slug: 'REPAIR', name: 'งานช่าง', icon: '🔧', color: 'bg-blue-50 border-blue-100', bar: 'bg-blue-400', count: 11 },
      { slug: 'HOME_SERVICES', name: 'งานบ้าน', icon: '🏠', color: 'bg-green-50 border-green-100', bar: 'bg-green-400', count: 8 },
      { slug: 'TUTORING', name: 'สอนพิเศษ', icon: '📚', color: 'bg-purple-50 border-purple-100', bar: 'bg-purple-400', count: 6 },
      { slug: 'HEALTH_WELLNESS', name: 'สุขภาพ', icon: '💆', color: 'bg-pink-50 border-pink-100', bar: 'bg-pink-400', count: 2 },
    ],
    announcements: [
      {
        id: 1, fromSA: false, authorName: 'คุณสำรวย โคราช', authorBadge: 'Community Admin',
        title: 'รถไฟความเร็วสูงเปิดให้บริการ — โอกาสทอง!', createdAt: '22 มี.ค. 2569',
        body: 'รถไฟความเร็วสูงกรุงเทพ-โคราชพร้อมให้บริการ เป็นโอกาสสำหรับผู้ประกอบการในชุมชน เตรียมรองรับนักท่องเที่ยวที่จะเพิ่มขึ้น',
      },
    ],
  },

  '14': {
    community: {
      id: '14', name: 'ระยอง ซีวิว', area: 'เมือง, ระยอง', emoji: '⚓',
      description: 'ชุมชนเมืองท่าระยอง แหล่งอุตสาหกรรมและการท่องเที่ยว บริการหลากหลายทั้งอาหารทะเล เกษตร และบริการสำหรับครอบครัว ใกล้ชายหาดและสวนผลไม้',
      members: 290, providers: 22, rating: 4.6, totalBookings: 620,
      trial: true, trialEnd: '31 ต.ค. 2569',
      admin: 'คุณธีรศักดิ์ ระยอง', founded: 'ต.ค. 2567',
      tags: ['อาหารทะเล', 'ผลไม้', 'เกษตร', 'ท่องเที่ยว'],
    },
    providers: [
      { id: '16', name: 'ป้าหนู อาหารทะเล', service: 'อาหารทะเลสด', rating: 4.8, reviews: 89, emoji: '🦞', verified: true, category: 'FOOD' },
      { id: '8', name: 'สวนคุณลุงทอง', service: 'ผักและผลไม้ออร์แกนิค', rating: 4.7, reviews: 38, emoji: '👨‍🌾', verified: false, category: 'AGRICULTURE' },
    ],
    recent: [
      { emoji: '🦞', title: 'กุ้งมังกรอบเนย', provider: 'ป้าหนู อาหารทะเล', price: 850 },
      { emoji: '🌿', title: 'ผลไม้ตะกร้า Premium', provider: 'สวนคุณลุงทอง', price: 380 },
    ],
    categories: [
      { slug: 'FOOD', name: 'อาหารทะเล', icon: '🦐', color: 'bg-orange-50 border-orange-100', bar: 'bg-orange-400', count: 9 },
      { slug: 'AGRICULTURE', name: 'เกษตรและผลไม้', icon: '🍊', color: 'bg-lime-50 border-lime-100', bar: 'bg-lime-400', count: 7 },
      { slug: 'RECREATION', name: 'ท่องเที่ยว', icon: '⛵', color: 'bg-sky-50 border-sky-100', bar: 'bg-sky-400', count: 4 },
      { slug: 'HOME_SERVICES', name: 'งานบ้าน', icon: '🏠', color: 'bg-green-50 border-green-100', bar: 'bg-green-400', count: 2 },
    ],
    announcements: [
      {
        id: 1, fromSA: false, authorName: 'คุณธีรศักดิ์ ระยอง', authorBadge: 'Community Admin',
        title: 'เทศกาลผลไม้ระยอง ฤดูกาลมังคุด', createdAt: '23 มี.ค. 2569',
        body: 'ฤดูกาลผลไม้ระยองมาถึงแล้ว! ผู้ให้บริการด้านการเกษตรสามารถลงสินค้าได้เลย มังคุด เงาะ ทุเรียน รอสั่งซื้อจากลูกค้าทั่วประเทศ',
      },
    ],
  },

  '15': {
    community: {
      id: '15', name: 'เกาะสมุย บีชซิตี้', area: 'เกาะสมุย, สุราษฎร์ธานี', emoji: '🌊',
      description: 'ชุมชนบนเกาะสมุย จุดหมายปลายทางยอดนิยมของนักท่องเที่ยวทั่วโลก รวบรวมบริการสปา อาหารทะเล กีฬาทางน้ำ และการท่องเที่ยวเชิงธรรมชาติ',
      members: 480, providers: 38, rating: 4.9, totalBookings: 2320,
      trial: true, trialEnd: '30 พ.ย. 2569',
      admin: 'คุณอรัญ สมุย', founded: 'ก.ย. 2567',
      tags: ['สปา', 'อาหารทะเล', 'ดำน้ำ', 'ท่องเที่ยว'],
    },
    providers: [
      { id: '14', name: 'สปาล้านนา', service: 'สปา นวด อโรมา', rating: 4.9, reviews: 112, emoji: '🌸', verified: true, category: 'HEALTH_WELLNESS' },
      { id: '17', name: 'ครูดำน้ำภูเก็ต', service: 'Snorkeling & Diving', rating: 4.9, reviews: 78, emoji: '🤿', verified: true, category: 'FITNESS' },
      { id: '16', name: 'ป้าหนู อาหารทะเล', service: 'อาหารทะเลสดรสใต้', rating: 4.8, reviews: 89, emoji: '🦞', verified: true, category: 'FOOD' },
    ],
    recent: [
      { emoji: '🌺', title: 'Body Scrub + นวดไทย 2 ชั่วโมง', provider: 'สปาล้านนา', price: 1800 },
      { emoji: '🤿', title: 'Snorkeling เกาะแตน', provider: 'ครูดำน้ำภูเก็ต', price: 1200 },
      { emoji: '🦞', title: 'ซีฟู้ดบาร์บีคิว', provider: 'ป้าหนู อาหารทะเล', price: 650 },
    ],
    categories: [
      { slug: 'HEALTH_WELLNESS', name: 'สปา & นวด', icon: '🌺', color: 'bg-pink-50 border-pink-100', bar: 'bg-pink-400', count: 12 },
      { slug: 'FITNESS', name: 'กีฬาทางน้ำ', icon: '🤿', color: 'bg-blue-50 border-blue-100', bar: 'bg-blue-400', count: 10 },
      { slug: 'FOOD', name: 'อาหารทะเล', icon: '🦐', color: 'bg-orange-50 border-orange-100', bar: 'bg-orange-400', count: 10 },
      { slug: 'RECREATION', name: 'ท่องเที่ยว', icon: '🏖️', color: 'bg-sky-50 border-sky-100', bar: 'bg-sky-400', count: 6 },
    ],
    announcements: [
      {
        id: 1, fromSA: true, authorName: 'Super Admin', authorBadge: 'Platform',
        title: 'เกาะสมุย: ชุมชน Top Rated ในระบบ ⭐', createdAt: '9 มี.ค. 2569',
        body: 'เกาะสมุย บีชซิตี้ได้รับคะแนนสูงสุดในระบบ 4.9 ดาว เป็นตัวอย่างที่ดีของชุมชนที่มีบริการคุณภาพสูง',
      },
      {
        id: 2, fromSA: false, authorName: 'คุณอรัญ สมุย', authorBadge: 'Community Admin',
        title: 'Koh Samui High Season: เพิ่มสต็อคได้เลย!', createdAt: '20 มี.ค. 2569',
        body: 'High Season กำลังมา! ผู้ให้บริการสปาและดำน้ำควรเพิ่มสล็อตการจอง นักท่องเที่ยวต้องการบริการเพิ่มมากขึ้น',
      },
    ],
  },

  // ── Phase 13: ชุมชนทั่วประเทศ 16–25 ─────────────────────────────────────

  '16': {
    community: {
      id: '16', name: 'อุดรธานี คิตี้ซิตี้', area: 'เมือง, อุดรธานี', emoji: '🛍️',
      description: 'ศูนย์กลางชุมชนอีสานตอนบน ตลาดกลางคืน Korean Town และ UD Town ผู้ให้บริการอาหาร ช่าง และบริการครบวงจร',
      members: 342, providers: 20, rating: 4.6, totalBookings: 678,
      trial: true, trialEnd: '31 ก.ค. 2569',
      admin: 'คุณปรียา ภูธร', founded: 'ก.พ. 2568',
      tags: ['อาหาร', 'ตลาดกลางคืน', 'ช้อปปิ้ง', 'บริการ'],
    },
    providers: [
      { id: '21', name: 'ร้านก๋วยเตี๋ยวนครสวรรค์', service: 'ก๋วยเตี๋ยวเนื้อ หมู แบบอีสาน', rating: 4.7, reviews: 45, emoji: '🍜', verified: true, category: 'FOOD' },
      { id: '22', name: 'ช่างพัทยา ครบวงจร', service: 'ซ่อมแซม ไฟฟ้า ประปา', rating: 4.6, reviews: 38, emoji: '🔩', verified: true, category: 'REPAIR' },
    ],
    recent: [
      { emoji: '🍜', title: 'ก๋วยเตี๋ยวเนื้อต้มยำ', provider: 'ร้านก๋วยเตี๋ยวนครสวรรค์', price: 60 },
      { emoji: '🔧', title: 'ซ่อมก๊อกน้ำรั่ว', provider: 'ช่างพัทยา ครบวงจร', price: 350 },
      { emoji: '🌙', title: 'อาหารตลาดกลางคืน (Set 2 ที่)', provider: 'ร้านก๋วยเตี๋ยวนครสวรรค์', price: 120 },
    ],
    categories: [
      { slug: 'FOOD', name: 'อาหาร', icon: '🍜', color: 'bg-orange-50 border-orange-100', bar: 'bg-orange-400', count: 9 },
      { slug: 'REPAIR', name: 'งานช่าง', icon: '🔧', color: 'bg-slate-50 border-slate-200', bar: 'bg-slate-400', count: 6 },
      { slug: 'HOME_SERVICE', name: 'งานบ้าน', icon: '🏠', color: 'bg-green-50 border-green-100', bar: 'bg-green-400', count: 5 },
    ],
    announcements: [
      {
        id: 1, fromSA: true, authorName: 'Super Admin', authorBadge: 'Platform',
        title: 'อุดรธานี: ชุมชนใหม่ไฟแรงภาคอีสานตอนบน 🌟', createdAt: '1 มี.ค. 2569',
        body: 'อุดรธานี คิตี้ซิตี้เข้าร่วมระบบ CHM อย่างเป็นทางการแล้ว เมืองศูนย์กลางอีสานตอนบนพร้อมเติบโตด้วยกัน',
      },
      {
        id: 2, fromSA: false, authorName: 'คุณปรียา ภูธร', authorBadge: 'Community Admin',
        title: 'ต้องการผู้ให้บริการนวด สปา และบิวตี้เพิ่ม!', createdAt: '5 มี.ค. 2569',
        body: 'ชุมชนเรามีสมาชิกใหม่เพิ่มมากขึ้นทุกสัปดาห์ หากคุณให้บริการด้านสุขภาพและความงาม ลงทะเบียนได้เลย',
      },
    ],
  },

  '17': {
    community: {
      id: '17', name: 'อุบลราชธานี เมืองเก่า', area: 'วารินชำราบ, อุบลราชธานี', emoji: '🏛️',
      description: 'เมืองเก่าริมแม่น้ำมูล แหล่งท่องเที่ยวทางวัฒนธรรม ประเพณีแห่เทียนพรรษา และอาหารอีสานแท้',
      members: 198, providers: 14, rating: 4.4, totalBookings: 312,
      trial: true, trialEnd: '31 ก.ค. 2569',
      admin: 'คุณสมหวัง ดอกบัว', founded: 'มี.ค. 2568',
      tags: ['วัฒนธรรม', 'อาหาร', 'ท่องเที่ยว', 'งานช่าง'],
    },
    providers: [
      { id: '13', name: 'ตลาดนัดชุมชนโคราช', service: 'จัดตลาด OTOP สินค้าชุมชน', rating: 4.5, reviews: 32, emoji: '🛒', verified: true, category: 'MARKETPLACE' },
      { id: '19', name: 'โฮมสเตย์ทุ่งศรีเมือง', service: 'ที่พักโฮมสเตย์ ชมธรรมชาติ', rating: 4.6, reviews: 27, emoji: '🌿', verified: true, category: 'RECREATION' },
    ],
    recent: [
      { emoji: '🌿', title: 'โฮมสเตย์ริมมูล 1 คืน', provider: 'โฮมสเตย์ทุ่งศรีเมือง', price: 600 },
      { emoji: '🛒', title: 'ซื้อสินค้า OTOP ชุมชน', provider: 'ตลาดนัดชุมชนโคราช', price: 250 },
      { emoji: '🕯️', title: 'ทัวร์วัดและประเพณี', provider: 'โฮมสเตย์ทุ่งศรีเมือง', price: 400 },
    ],
    categories: [
      { slug: 'RECREATION', name: 'ท่องเที่ยว', icon: '🌿', color: 'bg-green-50 border-green-100', bar: 'bg-green-400', count: 6 },
      { slug: 'FOOD', name: 'อาหารอีสาน', icon: '🌶️', color: 'bg-red-50 border-red-100', bar: 'bg-red-400', count: 5 },
      { slug: 'HOME_SERVICE', name: 'งานบ้าน', icon: '🏠', color: 'bg-sky-50 border-sky-100', bar: 'bg-sky-400', count: 3 },
    ],
    announcements: [
      {
        id: 1, fromSA: true, authorName: 'Super Admin', authorBadge: 'Platform',
        title: 'อุบลราชธานี: เมืองวัฒนธรรมเข้าร่วม CHM แล้ว 🏛️', createdAt: '2 มี.ค. 2569',
        body: 'ยินดีต้อนรับอุบลราชธานี เมืองเก่าสู่แพลตฟอร์ม CHM เราหวังว่าจะช่วยส่งเสริมวัฒนธรรมและการท่องเที่ยวของชุมชน',
      },
      {
        id: 2, fromSA: false, authorName: 'คุณสมหวัง ดอกบัว', authorBadge: 'Community Admin',
        title: 'เตรียมพร้อมงานเทศกาลแห่เทียนพรรษา ก.ค. นี้', createdAt: '8 มี.ค. 2569',
        body: 'ผู้ให้บริการท่องเที่ยวและโฮมสเตย์ เตรียมเปิดรับนักท่องเที่ยวช่วงงานแห่เทียนพรรษา กรุณาเพิ่มสล็อตรองรับ',
      },
    ],
  },

  '18': {
    community: {
      id: '18', name: 'พัทยา บีชซิตี้', area: 'เมืองพัทยา, ชลบุรี', emoji: '🎡',
      description: 'เมืองท่องเที่ยวระดับโลก ชายหาด ดำน้ำ กีฬาทางน้ำ และบริการซ่อมแซมครบวงจรสำหรับผู้พักอาศัย',
      members: 456, providers: 35, rating: 4.7, totalBookings: 1205,
      trial: false, trialEnd: '',
      admin: 'คุณวันชนะ พัทยา', founded: 'ส.ค. 2567',
      tags: ['ท่องเที่ยว', 'งานช่าง', 'ที่พัก', 'อาหาร'],
    },
    providers: [
      { id: '22', name: 'ช่างพัทยา ครบวงจร', service: 'ซ่อมแซม แอร์ ประปา ไฟฟ้า', rating: 4.6, reviews: 38, emoji: '🔩', verified: true, category: 'REPAIR' },
      { id: '17', name: 'ครูดำน้ำภูเก็ต', service: 'Snorkeling & Diving พัทยา', rating: 4.9, reviews: 78, emoji: '🤿', verified: true, category: 'FITNESS' },
    ],
    recent: [
      { emoji: '🤿', title: 'Snorkeling เกาะล้าน Half Day', provider: 'ครูดำน้ำภูเก็ต', price: 950 },
      { emoji: '❄️', title: 'ซ่อมแอร์ + เติมน้ำยา', provider: 'ช่างพัทยา ครบวงจร', price: 1200 },
      { emoji: '🏄', title: 'Jet Ski 30 นาที', provider: 'ครูดำน้ำภูเก็ต', price: 800 },
    ],
    categories: [
      { slug: 'RECREATION', name: 'กีฬาทางน้ำ', icon: '🤿', color: 'bg-blue-50 border-blue-100', bar: 'bg-blue-400', count: 14 },
      { slug: 'REPAIR', name: 'งานช่าง', icon: '🔧', color: 'bg-slate-50 border-slate-200', bar: 'bg-slate-400', count: 10 },
      { slug: 'FOOD', name: 'อาหาร', icon: '🍤', color: 'bg-orange-50 border-orange-100', bar: 'bg-orange-400', count: 11 },
    ],
    announcements: [
      {
        id: 1, fromSA: true, authorName: 'Super Admin', authorBadge: 'Platform',
        title: 'พัทยา: ชุมชนยอดนิยมอันดับต้นๆ ของระบบ 🏖️', createdAt: '5 มี.ค. 2569',
        body: 'พัทยา บีชซิตี้มีการเติบโตอย่างก้าวกระโดด โดยมียอดจองเพิ่มขึ้น 40% เมื่อเดือนที่ผ่านมา',
      },
      {
        id: 2, fromSA: false, authorName: 'คุณวันชนะ พัทยา', authorBadge: 'Community Admin',
        title: 'ฤดูท่องเที่ยว: เพิ่มสล็อตบริการด่วน!', createdAt: '9 มี.ค. 2569',
        body: 'นักท่องเที่ยวล้นเมืองช่วงนี้ ผู้ให้บริการทุกท่านควรเปิดสล็อตเพิ่ม และตอบรับจองให้เร็วที่สุด',
      },
    ],
  },

  '19': {
    community: {
      id: '19', name: 'สุราษฎร์ธานี เมือง', area: 'เมือง, สุราษฎร์ธานี', emoji: '🍊',
      description: 'ประตูสู่เกาะสมุย ดุเรียน เงาะ มังคุด ผลไม้ขึ้นชื่อ และบริการชุมชนเมืองท่าปีะ',
      members: 267, providers: 18, rating: 4.5, totalBookings: 534,
      trial: true, trialEnd: '30 มิ.ย. 2569',
      admin: 'คุณศิริพร ชุมพร', founded: 'ธ.ค. 2567',
      tags: ['เกษตรกรรม', 'อาหาร', 'ผลไม้', 'งานช่าง'],
    },
    providers: [
      { id: '24', name: 'สวนผลไม้สุราษฎร์', service: 'ดุเรียน เงาะ มังคุด ส่งตรงสวน', rating: 4.8, reviews: 62, emoji: '🍊', verified: true, category: 'FOOD' },
      { id: '16', name: 'ป้าหนู อาหารทะเล', service: 'อาหารทะเลสดรสใต้', rating: 4.8, reviews: 89, emoji: '🦞', verified: true, category: 'FOOD' },
    ],
    recent: [
      { emoji: '🍊', title: 'ดุเรียนหมอนทอง 5 กก.', provider: 'สวนผลไม้สุราษฎร์', price: 650 },
      { emoji: '🦞', title: 'กุ้งแม่น้ำทอดกระเทียม', provider: 'ป้าหนู อาหารทะเล', price: 380 },
      { emoji: '🌺', title: 'ผลไม้ตามฤดูกาล (Set)', provider: 'สวนผลไม้สุราษฎร์', price: 290 },
    ],
    categories: [
      { slug: 'FOOD', name: 'อาหารและผลไม้', icon: '🍊', color: 'bg-orange-50 border-orange-100', bar: 'bg-orange-400', count: 10 },
      { slug: 'AGRICULTURE', name: 'เกษตรกรรม', icon: '🌱', color: 'bg-green-50 border-green-100', bar: 'bg-green-400', count: 5 },
      { slug: 'HOME_SERVICE', name: 'งานบ้าน', icon: '🏠', color: 'bg-blue-50 border-blue-100', bar: 'bg-blue-400', count: 3 },
    ],
    announcements: [
      {
        id: 1, fromSA: true, authorName: 'Super Admin', authorBadge: 'Platform',
        title: 'สุราษฎร์ธานี: แหล่งผลไม้ดีที่สุดในระบบ 🍊', createdAt: '3 มี.ค. 2569',
        body: 'สุราษฎร์ธานีมีผู้ให้บริการด้านผลไม้และเกษตรกรรมที่ดีที่สุดในระบบ ขนส่งตรงจากสวนถึงบ้านคุณ',
      },
      {
        id: 2, fromSA: false, authorName: 'คุณศิริพร ชุมพร', authorBadge: 'Community Admin',
        title: 'ฤดูดุเรียนมาแล้ว! จองล่วงหน้าได้เลย 🌟', createdAt: '7 มี.ค. 2569',
        body: 'ดุเรียนหมอนทองปีนี้ผลผลิตดีมาก สั่งจองล่วงหน้าได้ที่ร้านสวนผลไม้สุราษฎร์ ราคาสวนไม่ผ่านพ่อค้าคนกลาง',
      },
    ],
  },

  '20': {
    community: {
      id: '20', name: 'ลำปาง เซรามิค', area: 'เมือง, ลำปาง', emoji: '🏺',
      description: 'เมืองม้าขาว แหล่งเซรามิคชื่อดัง งานหัตถกรรมระดับประเทศ วัดสำคัญ และบรรยากาศเมืองเก่า',
      members: 178, providers: 12, rating: 4.5, totalBookings: 289,
      trial: true, trialEnd: '31 ส.ค. 2569',
      admin: 'คุณอุไร ม้าขาว', founded: 'เม.ย. 2568',
      tags: ['งานฝีมือ', 'เซรามิค', 'อาหาร', 'งานช่าง'],
    },
    providers: [
      { id: '25', name: 'เซรามิคลำปาง ช่างบุ', service: 'ถ้วยชาม แจกัน เซรามิคสั่งทำ', rating: 4.9, reviews: 53, emoji: '🏺', verified: true, category: 'CRAFT' },
      { id: '6', name: 'ร้านป้าแดง', service: 'อาหารเหนือ ข้าวซอย น้ำเงี้ยว', rating: 4.9, reviews: 215, emoji: '🍲', verified: true, category: 'FOOD' },
    ],
    recent: [
      { emoji: '🏺', title: 'แจกันดินเผาลายไทย', provider: 'เซรามิคลำปาง ช่างบุ', price: 450 },
      { emoji: '🍲', title: 'ข้าวซอยไก่ + น้ำพริก', provider: 'ร้านป้าแดง', price: 80 },
      { emoji: '🎁', title: 'ชุดเซรามิคของขวัญ (6 ชิ้น)', provider: 'เซรามิคลำปาง ช่างบุ', price: 1200 },
    ],
    categories: [
      { slug: 'CRAFT', name: 'งานฝีมือ', icon: '🏺', color: 'bg-amber-50 border-amber-100', bar: 'bg-amber-400', count: 6 },
      { slug: 'FOOD', name: 'อาหารเหนือ', icon: '🍲', color: 'bg-orange-50 border-orange-100', bar: 'bg-orange-400', count: 4 },
      { slug: 'REPAIR', name: 'งานช่าง', icon: '🔧', color: 'bg-slate-50 border-slate-200', bar: 'bg-slate-400', count: 2 },
    ],
    announcements: [
      {
        id: 1, fromSA: true, authorName: 'Super Admin', authorBadge: 'Platform',
        title: 'ลำปาง: งานหัตถกรรมระดับประเทศบน CHM 🏺', createdAt: '4 มี.ค. 2569',
        body: 'เซรามิคลำปางเป็นที่ขึ้นชื่อทั่วประเทศ ตอนนี้สั่งซื้อออนไลน์ได้แล้วผ่านแพลตฟอร์ม CHM',
      },
      {
        id: 2, fromSA: false, authorName: 'คุณอุไร ม้าขาว', authorBadge: 'Community Admin',
        title: 'งาน Lampang Craft Fair มีนาคม 2569', createdAt: '6 มี.ค. 2569',
        body: 'เชิญชวนลูกค้าและผู้สนใจมาร่วมงาน Lampang Craft Fair วันที่ 25-27 มีนาคมนี้ มีสาธิตการทำเซรามิคฟรี',
      },
    ],
  },

  '21': {
    community: {
      id: '21', name: 'นครสวรรค์ เมือง', area: 'เมือง, นครสวรรค์', emoji: '🐉',
      description: 'เมืองปากน้ำโพ ขึ้นชื่อเรื่องงานตรุษจีนและขบวนมังกร ก๋วยเตี๋ยวเนื้อสไตล์นครสวรรค์ และสินค้า OTOP',
      members: 312, providers: 22, rating: 4.6, totalBookings: 623,
      trial: true, trialEnd: '31 พ.ค. 2569',
      admin: 'คุณศักดา ปากน้ำโพ', founded: 'พ.ย. 2567',
      tags: ['อาหาร', 'วัฒนธรรม', 'ช้อปปิ้ง', 'งานช่าง'],
    },
    providers: [
      { id: '21', name: 'ร้านก๋วยเตี๋ยวนครสวรรค์', service: 'ก๋วยเตี๋ยวเนื้อ หมู สไตล์นคร', rating: 4.7, reviews: 45, emoji: '🍜', verified: true, category: 'FOOD' },
      { id: '8', name: 'สวนคุณลุงทอง', service: 'ผักปลอดสาร ผลไม้ตามฤดู', rating: 4.7, reviews: 63, emoji: '🥬', verified: true, category: 'FOOD' },
    ],
    recent: [
      { emoji: '🍜', title: 'ก๋วยเตี๋ยวเนื้อต้มยำ ชามใหญ่', provider: 'ร้านก๋วยเตี๋ยวนครสวรรค์', price: 65 },
      { emoji: '🥬', title: 'ผักออร์แกนิค (กล่อง 1 กก.)', provider: 'สวนคุณลุงทอง', price: 120 },
      { emoji: '🐟', title: 'น้ำพริกปลาทู + ผักต้ม', provider: 'ร้านก๋วยเตี๋ยวนครสวรรค์', price: 80 },
    ],
    categories: [
      { slug: 'FOOD', name: 'อาหาร', icon: '🍜', color: 'bg-orange-50 border-orange-100', bar: 'bg-orange-400', count: 11 },
      { slug: 'AGRICULTURE', name: 'เกษตร', icon: '🌱', color: 'bg-green-50 border-green-100', bar: 'bg-green-400', count: 6 },
      { slug: 'HOME_SERVICE', name: 'งานบ้าน', icon: '🏠', color: 'bg-blue-50 border-blue-100', bar: 'bg-blue-400', count: 5 },
    ],
    announcements: [
      {
        id: 1, fromSA: true, authorName: 'Super Admin', authorBadge: 'Platform',
        title: 'นครสวรรค์: เมืองก๋วยเตี๋ยวชื่อดังบน CHM 🐉', createdAt: '2 มี.ค. 2569',
        body: 'ก๋วยเตี๋ยวเนื้อสไตล์นครสวรรค์เป็นที่รู้จักทั่วประเทศ ตอนนี้สั่งได้ออนไลน์ผ่านแพลตฟอร์ม CHM แล้ว',
      },
      {
        id: 2, fromSA: false, authorName: 'คุณศักดา ปากน้ำโพ', authorBadge: 'Community Admin',
        title: 'เตรียมตัวรับนักท่องเที่ยวงานตรุษจีน', createdAt: '8 มี.ค. 2569',
        body: 'งานตรุษจีนนครสวรรค์ปีนี้จะใหญ่กว่าทุกปี ผู้ให้บริการอาหารและที่พักเตรียมรองรับนักท่องเที่ยวจำนวนมากด้วย',
      },
    ],
  },

  '22': {
    community: {
      id: '22', name: 'สมุทรปราการ เมือง', area: 'เมือง, สมุทรปราการ', emoji: '🏭',
      description: 'เมืองอุตสาหกรรมใกล้กรุงเทพฯ บางปู ตลาดอาหารทะเล การเดินทางสะดวก BTS สายสีเขียว',
      members: 445, providers: 28, rating: 4.5, totalBookings: 876,
      trial: false, trialEnd: '',
      admin: 'คุณนภัทร สมุทร', founded: 'พ.ค. 2567',
      tags: ['งานบ้าน', 'อาหาร', 'ซ่อมแซม', 'บริการ'],
    },
    providers: [
      { id: '4', name: 'Clean Home Pro', service: 'ทำความสะอาดบ้าน คอนโด', rating: 4.9, reviews: 156, emoji: '🧹', verified: true, category: 'HOME_SERVICE' },
      { id: '12', name: 'ครัวคลีนคลีน', service: 'อาหารคลีน Delivery', rating: 4.7, reviews: 93, emoji: '🥗', verified: true, category: 'FOOD' },
    ],
    recent: [
      { emoji: '🧹', title: 'ทำความสะอาดบ้าน 3 ห้องนอน', provider: 'Clean Home Pro', price: 1200 },
      { emoji: '🥗', title: 'อาหารคลีน 5 วัน (ส่งทุกวัน)', provider: 'ครัวคลีนคลีน', price: 950 },
      { emoji: '🪟', title: 'เช็ดกระจกคอนโด ทุกบาน', provider: 'Clean Home Pro', price: 800 },
    ],
    categories: [
      { slug: 'HOME_SERVICE', name: 'งานบ้าน', icon: '🏠', color: 'bg-sky-50 border-sky-100', bar: 'bg-sky-400', count: 12 },
      { slug: 'FOOD', name: 'อาหาร', icon: '🥗', color: 'bg-green-50 border-green-100', bar: 'bg-green-400', count: 9 },
      { slug: 'REPAIR', name: 'งานช่าง', icon: '🔧', color: 'bg-slate-50 border-slate-200', bar: 'bg-slate-400', count: 7 },
    ],
    announcements: [
      {
        id: 1, fromSA: true, authorName: 'Super Admin', authorBadge: 'Platform',
        title: 'สมุทรปราการ: เชื่อมต่อกรุงเทพฯ ด้วย CHM 🏭', createdAt: '1 มี.ค. 2569',
        body: 'สมุทรปราการเป็นเมืองที่มีประชากรหนาแน่นและเชื่อมต่อกับกรุงเทพฯ ได้ดี CHM พร้อมให้บริการผู้ใช้ทุกท่าน',
      },
      {
        id: 2, fromSA: false, authorName: 'คุณนภัทร สมุทร', authorBadge: 'Community Admin',
        title: 'ต้องการผู้ให้บริการซ่อมแซมเพิ่ม!', createdAt: '6 มี.ค. 2569',
        body: 'สมาชิกในชุมชนต้องการบริการซ่อมแซมบ้าน แอร์ และประปา อีกมาก ช่างที่สนใจสมัครเพิ่มได้เลยครับ',
      },
    ],
  },

  '23': {
    community: {
      id: '23', name: 'นครศรีธรรมราช', area: 'เมือง, นครศรีธรรมราช', emoji: '🕌',
      description: 'เมืองประวัติศาสตร์ภาคใต้ วัดพระมหาธาตุ หนังตะลุง ผ้าไหมยกดอก อาหารทะเลสดและผลไม้',
      members: 289, providers: 20, rating: 4.6, totalBookings: 467,
      trial: true, trialEnd: '30 มิ.ย. 2569',
      admin: 'คุณอภิชาต นครฯ', founded: 'ม.ค. 2568',
      tags: ['อาหาร', 'วัฒนธรรม', 'งานช่าง', 'ท่องเที่ยว'],
    },
    providers: [
      { id: '16', name: 'ป้าหนู อาหารทะเล', service: 'อาหารทะเลสด อาหารใต้แท้', rating: 4.8, reviews: 89, emoji: '🦞', verified: true, category: 'FOOD' },
      { id: '24', name: 'สวนผลไม้สุราษฎร์', service: 'ผลไม้ใต้ สดตรงสวน', rating: 4.8, reviews: 62, emoji: '🍊', verified: true, category: 'FOOD' },
    ],
    recent: [
      { emoji: '🦞', title: 'กุ้งทอดกระเทียม + ปูผัดผงกะหรี่', provider: 'ป้าหนู อาหารทะเล', price: 420 },
      { emoji: '🍍', title: 'สับปะรดนครฯ กล่องใหญ่', provider: 'สวนผลไม้สุราษฎร์', price: 180 },
      { emoji: '🎭', title: 'ทัวร์หนังตะลุง วัฒนธรรม', provider: 'ป้าหนู อาหารทะเล', price: 350 },
    ],
    categories: [
      { slug: 'FOOD', name: 'อาหารทะเลใต้', icon: '🦐', color: 'bg-orange-50 border-orange-100', bar: 'bg-orange-400', count: 9 },
      { slug: 'CRAFT', name: 'หัตถกรรมพื้นบ้าน', icon: '🎭', color: 'bg-amber-50 border-amber-100', bar: 'bg-amber-400', count: 6 },
      { slug: 'RECREATION', name: 'ท่องเที่ยว', icon: '🕌', color: 'bg-teal-50 border-teal-100', bar: 'bg-teal-400', count: 5 },
    ],
    announcements: [
      {
        id: 1, fromSA: true, authorName: 'Super Admin', authorBadge: 'Platform',
        title: 'นครศรีฯ: มรดกวัฒนธรรมภาคใต้บน CHM 🕌', createdAt: '3 มี.ค. 2569',
        body: 'นครศรีธรรมราชเป็นเมืองที่มีวัฒนธรรมและประวัติศาสตร์อันยาวนาน เรายินดีต้อนรับชุมชนนี้สู่แพลตฟอร์ม CHM',
      },
      {
        id: 2, fromSA: false, authorName: 'คุณอภิชาต นครฯ', authorBadge: 'Community Admin',
        title: 'ต้อนรับนักท่องเที่ยวสู่นครศรีฯ ปีการท่องเที่ยว 2569', createdAt: '9 มี.ค. 2569',
        body: 'ปีนี้นครศรีฯ ตั้งเป้าต้อนรับนักท่องเที่ยว 2 ล้านคน ผู้ให้บริการโฮมสเตย์ อาหาร และไกด์ท้องถิ่น สมัครได้เลย',
      },
    ],
  },

  '24': {
    community: {
      id: '24', name: 'กาญจนบุรี ริเวอร์', area: 'เมือง, กาญจนบุรี', emoji: '🛶',
      description: 'ริมแม่น้ำแคว ล่องแก่ง น้ำตก สะพานข้ามแม่น้ำแคว ประวัติศาสตร์ WWII และธรรมชาติที่สมบูรณ์',
      members: 234, providers: 16, rating: 4.7, totalBookings: 523,
      trial: true, trialEnd: '30 มิ.ย. 2569',
      admin: 'คุณธนภัทร แควน้อย', founded: 'ก.ย. 2567',
      tags: ['ท่องเที่ยว', 'งานช่าง', 'อาหาร', 'ธรรมชาติ'],
    },
    providers: [
      { id: '23', name: 'ไกด์ล่องแก่งกาญจน์', service: 'ล่องแก่ง ไวท์วอเตอร์ แคมปิ้ง', rating: 4.9, reviews: 87, emoji: '🛶', verified: true, category: 'RECREATION' },
      { id: '15', name: 'ช่างไม้คุณบุญ', service: 'งานไม้ เฟอร์นิเจอร์ รั้วบ้าน', rating: 4.7, reviews: 41, emoji: '🪚', verified: true, category: 'REPAIR' },
    ],
    recent: [
      { emoji: '🛶', title: 'ล่องแก่งแม่น้ำแควน้อย (ครึ่งวัน)', provider: 'ไกด์ล่องแก่งกาญจน์', price: 850 },
      { emoji: '🏕️', title: 'แคมปิ้ง Riverside 2 วัน 1 คืน', provider: 'ไกด์ล่องแก่งกาญจน์', price: 1800 },
      { emoji: '🪚', title: 'ทำโต๊ะไม้สักตามสั่ง', provider: 'ช่างไม้คุณบุญ', price: 3500 },
    ],
    categories: [
      { slug: 'RECREATION', name: 'ท่องเที่ยวธรรมชาติ', icon: '🛶', color: 'bg-teal-50 border-teal-100', bar: 'bg-teal-400', count: 8 },
      { slug: 'REPAIR', name: 'งานช่าง', icon: '🪚', color: 'bg-amber-50 border-amber-100', bar: 'bg-amber-400', count: 5 },
      { slug: 'FOOD', name: 'อาหาร', icon: '🍱', color: 'bg-orange-50 border-orange-100', bar: 'bg-orange-400', count: 3 },
    ],
    announcements: [
      {
        id: 1, fromSA: true, authorName: 'Super Admin', authorBadge: 'Platform',
        title: 'กาญจนบุรี: แหล่งท่องเที่ยวธรรมชาติยอดนิยม 🛶', createdAt: '5 มี.ค. 2569',
        body: 'กาญจนบุรีเป็นแหล่งท่องเที่ยวที่นักท่องเที่ยวชื่นชอบทั่วประเทศ ขณะนี้บริการล่องแก่งสามารถจองผ่าน CHM ได้แล้ว',
      },
      {
        id: 2, fromSA: false, authorName: 'คุณธนภัทร แควน้อย', authorBadge: 'Community Admin',
        title: 'น้ำป่าฤดูฝน: ระดับน้ำเหมาะล่องแก่งแล้ว! 🌊', createdAt: '8 มี.ค. 2569',
        body: 'หลังฝนตกหนักช่วงนี้ ระดับน้ำในแก่งกำลังเหมาะสมสำหรับการล่องแก่ง ช่วงนี้ถือเป็น Peak Season ของกิจกรรมนี้',
      },
    ],
  },

  '25': {
    community: {
      id: '25', name: 'บึงกาฬ ริมโขง', area: 'เมือง, บึงกาฬ', emoji: '🌲',
      description: 'จังหวัดน้องใหม่ที่สุดของไทย ริมแม่น้ำโขง เขตรักษาพันธุ์สัตว์ป่าภูวัว ยางพาราและเกษตรออร์แกนิค',
      members: 124, providers: 8, rating: 4.3, totalBookings: 156,
      trial: true, trialEnd: '30 ก.ย. 2569',
      admin: 'คุณวิทยา ริมโขง', founded: 'มิ.ย. 2568',
      tags: ['เกษตรกรรม', 'ท่องเที่ยว', 'อาหาร', 'งานช่าง'],
    },
    providers: [
      { id: '21', name: 'ร้านก๋วยเตี๋ยวนครสวรรค์', service: 'ก๋วยเตี๋ยวแบบอีสานริมโขง', rating: 4.7, reviews: 45, emoji: '🍜', verified: true, category: 'FOOD' },
      { id: '13', name: 'ตลาดนัดชุมชนโคราช', service: 'สินค้าชุมชน ของฝาก OTOP', rating: 4.5, reviews: 32, emoji: '🛒', verified: true, category: 'MARKETPLACE' },
    ],
    recent: [
      { emoji: '🌊', title: 'ล่องเรือชมแม่น้ำโขงยามเย็น', provider: 'ตลาดนัดชุมชนโคราช', price: 300 },
      { emoji: '🍜', title: 'ก๋วยเตี๋ยวอีสานริมโขง', provider: 'ร้านก๋วยเตี๋ยวนครสวรรค์', price: 60 },
      { emoji: '🌱', title: 'ยางพาราออร์แกนิค (5 กก.)', provider: 'ตลาดนัดชุมชนโคราช', price: 420 },
    ],
    categories: [
      { slug: 'FOOD', name: 'อาหาร', icon: '🍜', color: 'bg-orange-50 border-orange-100', bar: 'bg-orange-400', count: 3 },
      { slug: 'AGRICULTURE', name: 'เกษตร', icon: '🌱', color: 'bg-green-50 border-green-100', bar: 'bg-green-400', count: 3 },
      { slug: 'RECREATION', name: 'ท่องเที่ยว', icon: '🌊', color: 'bg-teal-50 border-teal-100', bar: 'bg-teal-400', count: 2 },
    ],
    announcements: [
      {
        id: 1, fromSA: true, authorName: 'Super Admin', authorBadge: 'Platform',
        title: 'บึงกาฬ: จังหวัดน้องใหม่บน CHM แล้ว! 🌲', createdAt: '6 มี.ค. 2569',
        body: 'บึงกาฬเป็นจังหวัดที่อายุน้อยที่สุดของไทย แต่มีทรัพยากรธรรมชาติและวัฒนธรรมที่น่าสนใจมาก ยินดีต้อนรับสู่ CHM',
      },
      {
        id: 2, fromSA: false, authorName: 'คุณวิทยา ริมโขง', authorBadge: 'Community Admin',
        title: 'ชุมชนเล็กแต่ใจใหญ่ — ต้องการสมาชิกเพิ่ม!', createdAt: '9 มี.ค. 2569',
        body: 'บึงกาฬยังเป็นชุมชนที่กำลังเติบโต เชิญชวนผู้ให้บริการในพื้นที่มาลงทะเบียน ไม่ว่าจะเป็นเกษตรกร ไกด์ หรืองานช่าง',
      },
    ],
  },
}

export function getCommunityDetail(id: string): CommunityDetail | undefined {
  return COMMUNITY_DETAIL_MAP[id]
}
