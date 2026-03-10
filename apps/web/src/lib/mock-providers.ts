/**
 * Mock provider profiles indexed by ID (1-25).
 * Used by /providers/[id]/_provider-profile.tsx for ID-based lookup.
 */

export interface MockProviderReview {
  id: string
  user: string
  rating: number
  comment: string
  date: string
  avatar: string
}

export interface MockProviderListing {
  id: string
  title: string
  price: number
  unit: string
  image: string
  rating: number
  reviews: number
  available: boolean
}

export interface MockProviderDetail {
  id: string
  name: string
  avatar: string
  tagline: string
  bio: string
  verified: boolean
  online: boolean
  trustScore: number
  rating: number
  reviews: number
  completedBookings: number
  memberSince: string
  community: string
  communityIds: string[]
  area: string
  responseTime: string
  category: string
  badges: string[]
  availableDays: number[]
  openTime: string
  closeTime: string
  listings: MockProviderListing[]
  providerReviews: MockProviderReview[]
}

export const MOCK_PROVIDER_MAP: Record<string, MockProviderDetail> = {
  '1': {
    id: '1', name: 'คุณแม่สมใจ', avatar: '👩‍🍳',
    tagline: 'อาหารกล่องทำมือ ส่งตรงถึงบ้าน',
    bio: 'รับทำอาหารกล่องหลากหลายเมนู ทั้งข้าวราดแกง อาหารตามสั่ง ส้มตำ ลาบ ทำจากวัตถุดิบสดใหม่ทุกวัน ประสบการณ์กว่า 15 ปี ลูกค้าประจำกว่า 80 ครัวเรือน',
    verified: true, online: true, trustScore: 98, rating: 4.9, reviews: 128, completedBookings: 342,
    memberSince: 'ม.ค. 2567', community: 'หมู่บ้านศรีนคร', communityIds: ['1'], area: 'บางแค, กรุงเทพฯ',
    responseTime: '< 1 ชั่วโมง', category: 'อาหารและเครื่องดื่ม',
    badges: ['ยืนยันตัวตน', 'Top Provider', 'ส่งตรงเวลา 100%'],
    availableDays: [0,1,2,3,4], openTime: '07:00', closeTime: '17:00',
    listings: [
      { id: '1', title: 'ทำอาหารกล่องส่งถึงที่', price: 80, unit: 'กล่อง', image: '🍱', rating: 4.9, reviews: 128, available: true },
    ],
    providerReviews: [
      { id: 'r1', user: 'คุณวิภา', rating: 5, comment: 'อร่อยมาก ส้มตำรสจัดถูกใจ ส่งตรงเวลาทุกวัน', date: '5 มี.ค. 2569', avatar: '👩' },
      { id: 'r2', user: 'คุณสมศักดิ์', rating: 5, comment: 'สั่งรายเดือนมา 3 เดือนแล้ว ไม่เคยผิดหวัง ราคาคุ้มมาก', date: '28 ก.พ. 2569', avatar: '👨' },
      { id: 'r3', user: 'คุณนิตยา', rating: 4, comment: 'รสชาติดี วัตถุดิบสด ปริมาณพอดี แนะนำเมนูลาบ', date: '20 ก.พ. 2569', avatar: '👩‍💼' },
    ],
  },
  '2': {
    id: '2', name: 'ช่างสมชาย', avatar: '👨‍🔧',
    tagline: 'ซ่อมแอร์ ประปา ไฟฟ้า ครบวงจร',
    bio: 'ช่างมืออาชีพ ใบรับรองช่างไฟฟ้า ประสบการณ์กว่า 10 ปี ซ่อมแอร์ทุกยี่ห้อ งานประปา ไฟฟ้า พร้อมรับประกันงาน 3 เดือน บริการถึงบ้านในเขตกรุงเทพและปริมณฑล',
    verified: true, online: true, trustScore: 92, rating: 4.8, reviews: 87, completedBookings: 215,
    memberSince: 'มี.ค. 2566', community: 'หมู่บ้านศรีนคร', communityIds: ['1'], area: 'บางแค, กรุงเทพฯ',
    responseTime: '< 2 ชั่วโมง', category: 'งานช่าง',
    badges: ['ยืนยันตัวตน', 'ใบรับรองช่างไฟฟ้า'],
    availableDays: [0,1,2,3,4,5], openTime: '08:00', closeTime: '18:00',
    listings: [
      { id: '2', title: 'ซ่อมแอร์บ้าน ล้างแอร์', price: 500, unit: 'ครั้ง', image: '🔧', rating: 4.8, reviews: 87, available: false },
      { id: '11', title: 'ซ่อมท่อน้ำ-ประปา', price: 400, unit: 'ครั้ง', image: '🔧', rating: 4.6, reviews: 52, available: true },
    ],
    providerReviews: [
      { id: 'r1', user: 'คุณมนัส', rating: 5, comment: 'ช่างมาตรงเวลา ทำงานสะอาด ราคาตรงไปตรงมา', date: '1 มี.ค. 2569', avatar: '👨' },
      { id: 'r2', user: 'คุณปราณี', rating: 4, comment: 'แอร์เย็นขึ้นเยอะ พอใจมาก จะเรียกใช้อีกแน่นอน', date: '20 ก.พ. 2569', avatar: '👩' },
      { id: 'r3', user: 'คุณอำนาจ', rating: 5, comment: 'มืออาชีพมาก รู้เรื่องดี แก้ปัญหาได้ถูกจุด', date: '10 ก.พ. 2569', avatar: '👴' },
    ],
  },
  '3': {
    id: '3', name: 'ครูน้องใหม่', avatar: '👩‍🏫',
    tagline: 'สอนภาษาอังกฤษ คณิตศาสตร์ เด็กประถม',
    bio: 'ครูภาษาอังกฤษและคณิตศาสตร์ระดับประถม วุฒิ ป.บัณฑิต ผ่านการอบรม TEFL ลูกศิษย์ประจำ 50+ คน สอนทั้งออนไลน์และที่บ้านนักเรียน เน้นความเข้าใจจริง ไม่ท่องจำ',
    verified: true, online: false, trustScore: 95, rating: 5.0, reviews: 42, completedBookings: 128,
    memberSince: 'มิ.ย. 2567', community: 'คอนโด The Base', communityIds: ['2'], area: 'ลาดพร้าว, กรุงเทพฯ',
    responseTime: '< 30 นาที', category: 'การศึกษา',
    badges: ['ยืนยันตัวตน', 'คะแนน 5 ดาว', 'ครูยอดเยี่ยม'],
    availableDays: [1,2,3,4,5,6], openTime: '14:00', closeTime: '20:00',
    listings: [
      { id: '3', title: 'สอนภาษาอังกฤษเด็กประถม', price: 300, unit: 'ชั่วโมง', image: '📚', rating: 5.0, reviews: 42, available: true },
    ],
    providerReviews: [
      { id: 'r1', user: 'คุณแม่อรวรรณ', rating: 5, comment: 'ลูกชอบครูมาก เรียนสนุก คะแนนดีขึ้นเยอะ', date: '3 มี.ค. 2569', avatar: '👩' },
      { id: 'r2', user: 'คุณพ่อวรวุฒิ', rating: 5, comment: 'ครูใจดี อดทน สอนเด็กได้เก่งมาก', date: '22 ก.พ. 2569', avatar: '👨' },
      { id: 'r3', user: 'คุณนารี', rating: 5, comment: 'สอนดีมาก เด็กเข้าใจง่าย ราคาไม่แพง', date: '14 ก.พ. 2569', avatar: '👩‍💼' },
    ],
  },
  '4': {
    id: '4', name: 'บริษัท Clean Home', avatar: '🧹',
    tagline: 'ทำความสะอาดบ้าน คอนโด สำนักงาน',
    bio: 'บริษัทบริการทำความสะอาดมืออาชีพ ทีมงาน 20 คน ตรวจสอบประวัติแล้วทุกคน ใช้อุปกรณ์และน้ำยามาตรฐาน ISO ประสบการณ์ 10 ปี งาน 5,000+ ครั้ง ให้บริการหลายชุมชนในกรุงเทพฯ',
    verified: true, online: true, trustScore: 96, rating: 4.7, reviews: 203, completedBookings: 1240,
    memberSince: 'ก.ค. 2565', community: 'คอนโด The Base', communityIds: ['2', '3', '11'], area: 'ลาดพร้าว, กรุงเทพฯ',
    responseTime: '< 1 ชั่วโมง', category: 'งานบ้าน',
    badges: ['ยืนยันตัวตน', 'บริษัทจดทะเบียน', 'ISO Certified', 'หลายชุมชน'],
    availableDays: [0,1,2,3,4,5], openTime: '08:00', closeTime: '17:00',
    listings: [
      { id: '4', title: 'ทำความสะอาดบ้านรายวัน', price: 800, unit: 'ครั้ง', image: '🏠', rating: 4.7, reviews: 203, available: true },
    ],
    providerReviews: [
      { id: 'r1', user: 'คุณกาญจนา', rating: 5, comment: 'ทีมงานสุภาพ ทำงานละเอียด บ้านสะอาดมาก', date: '5 มี.ค. 2569', avatar: '👩' },
      { id: 'r2', user: 'คุณสุรชัย', rating: 4, comment: 'ราคาสมเหตุสมผล คุณภาพดี จะใช้บริการต่อ', date: '26 ก.พ. 2569', avatar: '👨' },
      { id: 'r3', user: 'คุณลลิตา', rating: 5, comment: 'ใช้บริการรายเดือนมา 6 เดือน พอใจมาก ตรงเวลาทุกครั้ง', date: '15 ก.พ. 2569', avatar: '👩‍💼' },
    ],
  },
  '5': {
    id: '5', name: 'คุณสมศรี', avatar: '👩‍⚕️',
    tagline: 'ดูแลผู้สูงอายุ ผู้ป่วย พยาบาลเกษียณ',
    bio: 'พยาบาลวิชาชีพเกษียณ ประสบการณ์ดูแลผู้สูงอายุและผู้ป่วยมากกว่า 15 ปี มีใบรับรองการดูแลผู้สูงอายุจากกรมสนับสนุนบริการสุขภาพ ดูแลด้วยความใส่ใจเหมือนครอบครัว',
    verified: false, online: false, trustScore: 75, rating: 4.9, reviews: 31, completedBookings: 67,
    memberSince: 'ก.พ. 2568', community: 'ชุมชนเมืองทอง', communityIds: ['3'], area: 'เมืองทอง, นนทบุรี',
    responseTime: '< 3 ชั่วโมง', category: 'ดูแลผู้สูงอายุ',
    badges: ['ใบรับรองดูแลผู้สูงอายุ'],
    availableDays: [0,1,2,3,4], openTime: '08:00', closeTime: '17:00',
    listings: [
      { id: '5', title: 'ดูแลผู้สูงอายุกลางวัน', price: 1200, unit: 'วัน', image: '👴', rating: 4.9, reviews: 31, available: false },
    ],
    providerReviews: [
      { id: 'r1', user: 'คุณวัชรา', rating: 5, comment: 'ดูแลคุณพ่อดีมาก ใจเย็น ใส่ใจ พ่อชอบมาก', date: '28 ก.พ. 2569', avatar: '👨' },
      { id: 'r2', user: 'คุณนภา', rating: 5, comment: 'เชื่อถือได้ ตรงเวลา ดูแลผู้สูงอายุเป็นอย่างดี', date: '10 ก.พ. 2569', avatar: '👩' },
    ],
  },
  '6': {
    id: '6', name: 'ร้านป้าแดง', avatar: '👩‍🎨',
    tagline: 'กระเป๋าผ้าทอมือ งานฝีมือชาวเหนือ',
    bio: 'ช่างทอผ้าลายเหนือ ประสบการณ์ 20 ปี ผ้าฝ้ายแท้ 100% สีธรรมชาติ ลวดลายไทยเอกลักษณ์ รับออเดอร์พิเศษและสั่งทำลายเฉพาะ ส่งทั่วประเทศและต่างประเทศ มีจำหน่ายทั้งที่เชียงใหม่และเชียงราย',
    verified: true, online: true, trustScore: 88, rating: 4.8, reviews: 56, completedBookings: 180,
    memberSince: 'ส.ค. 2566', community: 'เมืองเชียงใหม่ซิตี้', communityIds: ['6', '12'], area: 'เมือง, เชียงใหม่',
    responseTime: '< 2 ชั่วโมง', category: 'งานฝีมือ',
    badges: ['ยืนยันตัวตน', 'OTOP', 'งานหัตถกรรมไทย', 'หลายชุมชน'],
    availableDays: [0,1,2,3,4,5,6], openTime: '09:00', closeTime: '18:00',
    listings: [
      { id: '6', title: 'กระเป๋าผ้าทอมือ handmade', price: 350, unit: 'ใบ', image: '🎨', rating: 4.8, reviews: 56, available: true },
    ],
    providerReviews: [
      { id: 'r1', user: 'คุณสายชล', rating: 5, comment: 'สวยมาก ผ้าคุณภาพดี ลวดลายสวยงาม สั่งเพิ่มอีกแน่นอน', date: '4 มี.ค. 2569', avatar: '👩' },
      { id: 'r2', user: 'Ms. Sarah', rating: 5, comment: 'Beautiful handcraft! Bought as souvenir, very unique.', date: '20 ก.พ. 2569', avatar: '👩‍🦱' },
      { id: 'r3', user: 'คุณวิมล', rating: 4, comment: 'งานละเอียด สีสวย ขนส่งดี แพคกิ้งพิถีพิถัน', date: '8 ก.พ. 2569', avatar: '👩‍💼' },
    ],
  },
  '7': {
    id: '7', name: 'หมอนวดประเสริฐ', avatar: '🧘',
    tagline: 'นวดแผนไทย นวดสปา ออกนอกสถานที่',
    bio: 'ครูนวดแผนไทย ใบรับรองจากกรมการแพทย์แผนไทยและการแพทย์ทางเลือก ประสบการณ์ 8 ปี ลูกค้าประจำ 200+ คน มีอุปกรณ์และน้ำมันนวดอย่างดีครบ บริการถึงบ้าน ให้บริการทั้งในกรุงเทพฯ และหาดใหญ่',
    verified: true, online: true, trustScore: 97, rating: 4.9, reviews: 74, completedBookings: 310,
    memberSince: 'พ.ย. 2566', community: 'หมู่บ้านกรีนวิลล์', communityIds: ['4', '10'], area: 'บึงกุ่ม, กรุงเทพฯ',
    responseTime: '< 1 ชั่วโมง', category: 'สุขภาพ & ความงาม',
    badges: ['ยืนยันตัวตน', 'ใบรับรองจากกรมการแพทย์', 'Top Rated', 'หลายชุมชน'],
    availableDays: [1,2,3,4,5,6], openTime: '10:00', closeTime: '21:00',
    listings: [
      { id: '7', title: 'นวดแผนไทย ออกนอกสถานที่', price: 400, unit: 'ชั่วโมง', image: '💆', rating: 4.9, reviews: 74, available: true },
    ],
    providerReviews: [
      { id: 'r1', user: 'คุณรัชนี', rating: 5, comment: 'นวดแก้ปวดคอได้ผลดีมาก มืออาชีพมาก', date: '6 มี.ค. 2569', avatar: '👩' },
      { id: 'r2', user: 'คุณธนา', rating: 5, comment: 'บริการดี มาตรงเวลา หมอนวดฝีมือดีมาก', date: '25 ก.พ. 2569', avatar: '👨' },
      { id: 'r3', user: 'คุณมาลี', rating: 5, comment: 'ผ่อนคลายมาก หลับได้เลยตอนนวด ดีมากๆ', date: '14 ก.พ. 2569', avatar: '👩‍🦳' },
    ],
  },
  '8': {
    id: '8', name: 'สวนคุณลุงทอง', avatar: '👨‍🌾',
    tagline: 'ผักออร์แกนิคสด ส่งรายสัปดาห์',
    bio: 'เกษตรกรออร์แกนิคสวนผัก 2 ไร่ ปลูกมา 6 ปี ไม่ใช้สารเคมีทุกชนิด ผ่านการรับรอง Organic Thailand ตัดสดทุกเช้า จัดเซ็ตหมุนเวียนตามฤดูกาล ส่งให้ทั้งในปทุมธานีและขอนแก่น',
    verified: false, online: false, trustScore: 80, rating: 4.7, reviews: 38, completedBookings: 145,
    memberSince: 'ม.ค. 2567', community: 'ชุมชนริมน้ำ', communityIds: ['5', '9'], area: 'ปทุมธานี',
    responseTime: '< 4 ชั่วโมง', category: 'เกษตรกรรม',
    badges: ['Organic Thailand Certified', 'หลายชุมชน'],
    availableDays: [0,3,6], openTime: '06:00', closeTime: '10:00',
    listings: [
      { id: '8', title: 'ผักออร์แกนิคส่งรายสัปดาห์', price: 250, unit: 'ชุด', image: '🌿', rating: 4.7, reviews: 38, available: false },
    ],
    providerReviews: [
      { id: 'r1', user: 'คุณกัลยา', rating: 5, comment: 'ผักสดมาก ปลอดสาร รสชาติดีกว่าในตลาดเยอะ', date: '3 มี.ค. 2569', avatar: '👩' },
      { id: 'r2', user: 'คุณเดชา', rating: 4, comment: 'คุ้มค่ามาก ผักสดส่งถึงบ้าน ไม่ต้องออกไปซื้อ', date: '18 ก.พ. 2569', avatar: '👨' },
    ],
  },
  '9': {
    id: '9', name: 'ดีไซเนอร์เอ', avatar: '👨‍💻',
    tagline: 'ออกแบบ Logo Brand Graphic Design',
    bio: 'นักออกแบบ Graphic Design มืออาชีพ ประสบการณ์ 7 ปี ผลงาน Portfolio 300+ งาน ลูกค้าทั่วไทย รับทั้งโลโก้ สื่อสิ่งพิมพ์ โซเชียล และ Brand Identity ครบวงจร ทำงาน Remote ได้ทุกที่',
    verified: true, online: true, trustScore: 90, rating: 4.8, reviews: 19, completedBookings: 58,
    memberSince: 'ก.ย. 2567', community: 'คอนโด The Base', communityIds: ['2', '7', '11'], area: 'ลาดพร้าว, กรุงเทพฯ',
    responseTime: '< 2 ชั่วโมง', category: 'ฟรีแลนซ์',
    badges: ['ยืนยันตัวตน', 'Graphic Design Pro', 'หลายชุมชน'],
    availableDays: [0,1,2,3,4], openTime: '09:00', closeTime: '18:00',
    listings: [
      { id: '9', title: 'ออกแบบ Logo & Brand Identity', price: 3500, unit: 'งาน', image: '💻', rating: 4.8, reviews: 19, available: true },
    ],
    providerReviews: [
      { id: 'r1', user: 'คุณสมบัติ', rating: 5, comment: 'โลโก้สวยมาก ตรงกับที่ต้องการ แก้ไขทันทีเลย', date: '7 มี.ค. 2569', avatar: '👨‍💼' },
      { id: 'r2', user: 'คุณพิมพ์ใจ', rating: 4, comment: 'ผลงานดี สื่อสารชัด เข้าใจ brand เราดี', date: '21 ก.พ. 2569', avatar: '👩' },
    ],
  },
  '10': {
    id: '10', name: 'Community Pool', avatar: '🤝',
    tagline: 'ยืม-คืนอุปกรณ์ชุมชน ลดค่าใช้จ่าย',
    bio: 'โครงการ Community Sharing ชุมชนเมืองทอง บริหารโดยคณะกรรมการหมู่บ้าน มีอุปกรณ์ครัว เครื่องใช้ไฟฟ้า อุปกรณ์จัดงาน ให้ยืมรายวัน ราคาถูก ช่วยลดการซื้อของซ้ำในชุมชน',
    verified: false, online: true, trustScore: 72, rating: 4.6, reviews: 22, completedBookings: 89,
    memberSince: 'เม.ย. 2568', community: 'ชุมชนเมืองทอง', communityIds: ['3'], area: 'เมืองทอง, นนทบุรี',
    responseTime: '< 3 ชั่วโมง', category: 'Community Sharing',
    badges: ['Community Approved'],
    availableDays: [0,1,2,3,4,5,6], openTime: '08:00', closeTime: '20:00',
    listings: [
      { id: '10', title: 'ยืม-คืนอุปกรณ์ทำครัว', price: 50, unit: 'วัน', image: '🤝', rating: 4.6, reviews: 22, available: true },
    ],
    providerReviews: [
      { id: 'r1', user: 'คุณธิดา', rating: 5, comment: 'ประหยัดมาก ไม่ต้องซื้ออุปกรณ์แพงๆ ใช้แค่ครั้งเดียว', date: '2 มี.ค. 2569', avatar: '👩' },
      { id: 'r2', user: 'คุณวีระ', rating: 4, comment: 'อุปกรณ์สะอาด สภาพดี คืนง่าย บริการดี', date: '12 ก.พ. 2569', avatar: '👨' },
    ],
  },
  '11': {
    id: '11', name: 'ช่างวิชัย', avatar: '🔧',
    tagline: 'ซ่อมท่อน้ำ ประปา ด่วน ทุกวัน',
    bio: 'ช่างประปาใบรับรอง ประสบการณ์ 12 ปี แก้ปัญหาท่อรั่ว ท่อแตก ท่ออุดตัน สุขภัณฑ์ทุกชนิด งานสะอาด เรียบร้อย รับประกัน 30 วัน เรียกได้ทุกวันรวมถึงวันหยุด',
    verified: true, online: true, trustScore: 89, rating: 4.6, reviews: 52, completedBookings: 178,
    memberSince: 'ก.พ. 2567', community: 'หมู่บ้านศรีนคร', communityIds: ['1'], area: 'บางแค, กรุงเทพฯ',
    responseTime: '< 1 ชั่วโมง', category: 'งานช่าง',
    badges: ['ยืนยันตัวตน', 'ใบรับรองช่างประปา'],
    availableDays: [0,1,2,3,4,5], openTime: '07:00', closeTime: '19:00',
    listings: [
      { id: '11', title: 'ซ่อมท่อน้ำ-ประปา', price: 400, unit: 'ครั้ง', image: '🔧', rating: 4.6, reviews: 52, available: true },
    ],
    providerReviews: [
      { id: 'r1', user: 'คุณศิริ', rating: 5, comment: 'มาไวมาก แก้ปัญหาท่อรั่วได้ทันที ขอบคุณมาก', date: '5 มี.ค. 2569', avatar: '👩' },
      { id: 'r2', user: 'คุณบรรเทิง', rating: 4, comment: 'ราคาโอเค งานดี ไม่นานก็เสร็จ', date: '24 ก.พ. 2569', avatar: '👨' },
      { id: 'r3', user: 'คุณสุพร', rating: 5, comment: 'ช่างใจดี อธิบายปัญหาให้เข้าใจก่อนซ่อม', date: '11 ก.พ. 2569', avatar: '👩‍🦳' },
    ],
  },
  '12': {
    id: '12', name: 'ครัวคลีนคลีน', avatar: '👩‍🍳',
    tagline: 'อาหารคลีนรายวัน คำนวณแคลอรี่ครบ',
    bio: 'นักโภชนาการและเชฟอาหารสุขภาพ Nutrition Certificate รับรอง ทุกเมนูคำนวณแคลอรี่ครบถ้วน รองรับอาหารพิเศษ: คีโต ลดน้ำหนัก เบาหวาน ส่งทุกเช้าก่อน 8:00 น. ให้บริการทั้งย่านลาดพร้าวและสุขุมวิท',
    verified: true, online: false, trustScore: 94, rating: 4.9, reviews: 95, completedBookings: 267,
    memberSince: 'ต.ค. 2567', community: 'คอนโด The Base', communityIds: ['2', '11'], area: 'ลาดพร้าว, กรุงเทพฯ',
    responseTime: '< 1 ชั่วโมง', category: 'อาหารและเครื่องดื่ม',
    badges: ['ยืนยันตัวตน', 'Nutrition Certified', 'Top Provider', 'หลายชุมชน'],
    availableDays: [0,1,2,3,4], openTime: '08:00', closeTime: '14:00',
    listings: [
      { id: '12', title: 'อาหารคลีนออเดอร์ล่วงหน้า', price: 120, unit: 'กล่อง', image: '🥗', rating: 4.9, reviews: 95, available: false },
    ],
    providerReviews: [
      { id: 'r1', user: 'คุณนลินี', rating: 5, comment: 'ลดน้ำหนักได้จริง อร่อยด้วย สั่งมา 2 เดือนแล้ว', date: '4 มี.ค. 2569', avatar: '👩' },
      { id: 'r2', user: 'คุณสมบูรณ์', rating: 5, comment: 'ควบคุมน้ำตาลได้ดี เมนูหลากหลาย ไม่เบื่อ', date: '23 ก.พ. 2569', avatar: '👨' },
      { id: 'r3', user: 'คุณรัตนา', rating: 4, comment: 'อาหารสะอาด สด ส่งตรงเวลาทุกวัน', date: '12 ก.พ. 2569', avatar: '👩‍💼' },
    ],
  },
  '13': {
    id: '13', name: 'เชฟนุ้ย ครัวเหนือ', avatar: '👨‍🍳',
    tagline: 'คลาสทำอาหารเหนือ เชียงใหม่สไตล์',
    bio: 'เชฟอาหารเหนือมืออาชีพ ประสบการณ์ 12 ปี เปิดคลาสอาหารเหนือสำหรับนักท่องเที่ยวและคนท้องถิ่น เมนูขึ้นชื่อ: ขนมจีนน้ำเงี้ยว แกงฮังเล ซุปหน่อไม้',
    verified: true, online: true, trustScore: 91, rating: 4.8, reviews: 47, completedBookings: 156,
    memberSince: 'เม.ย. 2567', community: 'เมืองเชียงใหม่ซิตี้', communityIds: ['6'], area: 'เมือง, เชียงใหม่',
    responseTime: '< 1 ชั่วโมง', category: 'อาหารและเครื่องดื่ม',
    badges: ['ยืนยันตัวตน', 'เชฟมืออาชีพ', 'ขึ้นชื่อเมืองเหนือ'],
    availableDays: [2,4,6,0], openTime: '09:00', closeTime: '14:00',
    listings: [
      { id: '13', title: 'คลาสทำอาหารเหนือ เชียงใหม่', price: 800, unit: 'คน', image: '🫕', rating: 4.8, reviews: 47, available: true },
    ],
    providerReviews: [
      { id: 'r1', user: 'Mr. James', rating: 5, comment: 'Amazing experience! Learned to cook Khao Soi. Highly recommend!', date: '7 มี.ค. 2569', avatar: '👨‍🦱' },
      { id: 'r2', user: 'คุณปวีณา', rating: 5, comment: 'สนุกมาก เชฟสอนละเอียด ได้กินอาหารที่ทำเองด้วย', date: '27 ก.พ. 2569', avatar: '👩' },
      { id: 'r3', user: 'คุณธีรยุทธ', rating: 4, comment: 'ได้ความรู้เพิ่ม บรรยากาศดีมาก เมนูอาหารเหนือหลากหลาย', date: '15 ก.พ. 2569', avatar: '👨' },
    ],
  },
  '14': {
    id: '14', name: 'สปาล้านนา', avatar: '🌸',
    tagline: 'สปา นวด อโรมา ล้านนาสไตล์',
    bio: 'สปาระดับพรีเมียม ย่านนิมมานเฮมิน บรรยากาศล้านนา ใช้สมุนไพรท้องถิ่น ทีมบำบัดผ่านการรับรองระดับนานาชาติ บริการนวดหน้า สปาตัว ล้างผิว และแพ็กเกจคู่ มีสาขาที่เกาะสมุย',
    verified: true, online: true, trustScore: 93, rating: 4.9, reviews: 112, completedBookings: 420,
    memberSince: 'ก.พ. 2566', community: 'นิมมานเฮมิน วิลเลจ', communityIds: ['7', '15'], area: 'นิมมานเฮมิน, เชียงใหม่',
    responseTime: '< 2 ชั่วโมง', category: 'สุขภาพ & ความงาม',
    badges: ['ยืนยันตัวตน', 'Premium Spa', 'International Certified', 'หลายชุมชน'],
    availableDays: [0,1,2,3,4,5,6], openTime: '10:00', closeTime: '21:00',
    listings: [
      { id: '14', title: 'สปานวดล้านนา อโรมาเทอราพี', price: 1200, unit: 'ชั่วโมง', image: '🌺', rating: 4.9, reviews: 112, available: true },
    ],
    providerReviews: [
      { id: 'r1', user: 'คุณชลิดา', rating: 5, comment: 'บรรยากาศดีมาก กลิ่นสมุนไพรหอม นวดเพลินมาก', date: '6 มี.ค. 2569', avatar: '👩' },
      { id: 'r2', user: 'Ms. Emily', rating: 5, comment: 'Best spa experience in Chiang Mai! Very relaxing atmosphere.', date: '1 มี.ค. 2569', avatar: '👩‍🦱' },
      { id: 'r3', user: 'คุณพรรณนิภา', rating: 5, comment: 'มาเป็นคู่ แพ็กเกจคู่คุ้มมาก จะมาอีกแน่นอน', date: '20 ก.พ. 2569', avatar: '👩‍💼' },
    ],
  },
  '15': {
    id: '15', name: 'ไกด์นุ ดอยสุเทพ', avatar: '🏔️',
    tagline: 'ไกด์เดินป่า ดอยสุเทพ ธรรมชาติเชียงใหม่',
    bio: 'ไกด์เดินป่ามืออาชีพ ใบอนุญาตนำเที่ยว ประสบการณ์ 8 ปี ความรู้ด้านพฤกษศาสตร์ สัตว์ป่า และวัฒนธรรมท้องถิ่น เส้นทางดอยสุเทพ น้ำตก และหมู่บ้านชาวเขา',
    verified: true, online: true, trustScore: 87, rating: 4.7, reviews: 63, completedBookings: 215,
    memberSince: 'ก.ย. 2566', community: 'เมืองเชียงใหม่ซิตี้', communityIds: ['6'], area: 'เมือง, เชียงใหม่',
    responseTime: '< 2 ชั่วโมง', category: 'ท่องเที่ยว',
    badges: ['ยืนยันตัวตน', 'ใบอนุญาตนำเที่ยว TAT'],
    availableDays: [0,2,4,6], openTime: '06:00', closeTime: '17:00',
    listings: [
      { id: '15', title: 'ไกด์เดินป่าดอยสุเทพ', price: 600, unit: 'คน/วัน', image: '⛰️', rating: 4.7, reviews: 63, available: true },
    ],
    providerReviews: [
      { id: 'r1', user: 'คุณกวิน', rating: 5, comment: 'ไกด์รู้ทาง ให้ความรู้ดี ปลอดภัยมาก', date: '3 มี.ค. 2569', avatar: '👨' },
      { id: 'r2', user: 'Mr. David', rating: 5, comment: 'Excellent guide! Very knowledgeable about local flora and fauna.', date: '25 ก.พ. 2569', avatar: '👨‍🦲' },
    ],
  },
  '16': {
    id: '16', name: 'ป้าหนู อาหารทะเล', avatar: '🦞',
    tagline: 'อาหารทะเลสด ปากน้ำภูเก็ต',
    bio: 'ร้านอาหารทะเลสดริมทะเล ภูเก็ต วัตถุดิบสดจากชาวประมงโดยตรงทุกเช้า ปรุงตามสั่ง รสชาติต้นตำรับใต้แท้ๆ รับทำกล่องอาหารส่ง และจัดเลี้ยงงานกลุ่ม มีบริการที่ระยองและเกาะสมุยด้วย',
    verified: true, online: true, trustScore: 90, rating: 4.8, reviews: 89, completedBookings: 312,
    memberSince: 'ก.พ. 2567', community: 'ป่าตอง ซีไซด์', communityIds: ['8', '14', '15'], area: 'ป่าตอง, ภูเก็ต',
    responseTime: '< 1 ชั่วโมง', category: 'อาหารและเครื่องดื่ม',
    badges: ['ยืนยันตัวตน', 'วัตถุดิบสดตรงประมง', 'รสชาติใต้แท้', 'หลายชุมชน'],
    availableDays: [0,1,2,3,4,5,6], openTime: '10:00', closeTime: '21:00',
    listings: [
      { id: '16', title: 'อาหารทะเลสด ปากน้ำ ภูเก็ต', price: 350, unit: 'จาน', image: '🦐', rating: 4.8, reviews: 89, available: true },
    ],
    providerReviews: [
      { id: 'r1', user: 'คุณสุทธิ', rating: 5, comment: 'กุ้งสดมาก ปรุงรสอร่อย ราคาสมเหตุสมผล', date: '8 มี.ค. 2569', avatar: '👨' },
      { id: 'r2', user: 'Mr. Tom', rating: 5, comment: 'Best seafood in Patong! Super fresh and delicious!', date: '2 มี.ค. 2569', avatar: '👨‍🦱' },
      { id: 'r3', user: 'คุณรวิพร', rating: 4, comment: 'รสชาติดีมาก บริการรวดเร็ว ที่นั่งสวย', date: '19 ก.พ. 2569', avatar: '👩' },
    ],
  },
  '17': {
    id: '17', name: 'ครูดำน้ำภูเก็ต', avatar: '🤿',
    tagline: 'สอนดำน้ำ PADI Open Water ภูเก็ต',
    bio: 'ครูสอนดำน้ำ PADI Instructor ประสบการณ์ 10 ปี สอนทั้ง Scuba Diving และ Snorkeling นักเรียนกว่า 500 คน บรรยากาศเป็นกันเอง อุปกรณ์มาตรฐานสากล ปลอดภัย 100% มีหลักสูตรที่เกาะสมุยด้วย',
    verified: true, online: true, trustScore: 95, rating: 4.9, reviews: 78, completedBookings: 290,
    memberSince: 'พ.ย. 2565', community: 'ป่าตอง ซีไซด์', communityIds: ['8', '15'], area: 'ป่าตอง, ภูเก็ต',
    responseTime: '< 1 ชั่วโมง', category: 'กีฬา & ฟิตเนส',
    badges: ['ยืนยันตัวตน', 'PADI Instructor', 'Safety First', 'หลายชุมชน'],
    availableDays: [0,1,2,3,4,5,6], openTime: '07:00', closeTime: '17:00',
    listings: [
      { id: '17', title: 'เรียนดำน้ำ PADI Open Water ภูเก็ต', price: 3500, unit: 'คอร์ส', image: '🤿', rating: 4.9, reviews: 78, available: true },
    ],
    providerReviews: [
      { id: 'r1', user: 'คุณศักดิ์สิทธิ์', rating: 5, comment: 'ครูสอนดี อดทน ปลอดภัยมาก ได้ Certificate แล้ว', date: '9 มี.ค. 2569', avatar: '👨' },
      { id: 'r2', user: 'Ms. Lisa', rating: 5, comment: 'Amazing instructor! Very patient and professional. Love diving now!', date: '4 มี.ค. 2569', avatar: '👩‍🦱' },
    ],
  },
  '18': {
    id: '18', name: 'ร้านส้มตำยายแดง', avatar: '🌶️',
    tagline: 'ส้มตำ ลาบ ก้อย รสอีสานแท้ ขอนแก่น',
    bio: 'ร้านส้มตำอีสานแท้ สูตรลับจากบ้านเกิดจังหวัดขอนแก่น ส้มตำรสจัด ลาบหมูดิบ ลาบสุก ก้อยปลา เมนูขึ้นชื่อ ลูกค้าประจำ 100+ ราย ส่งถึงบ้านและรับที่ร้าน',
    verified: true, online: true, trustScore: 85, rating: 4.7, reviews: 64, completedBookings: 188,
    memberSince: 'ม.ค. 2568', community: 'ขอนแก่น อัพทาวน์', communityIds: ['9'], area: 'เมือง, ขอนแก่น',
    responseTime: '< 1 ชั่วโมง', category: 'อาหารและเครื่องดื่ม',
    badges: ['ยืนยันตัวตน', 'รสอีสานแท้'],
    availableDays: [0,1,2,3,4,5,6], openTime: '10:00', closeTime: '20:00',
    listings: [
      { id: '18', title: 'ส้มตำ ลาบ อีสานแท้ ขอนแก่น', price: 60, unit: 'จาน', image: '🥗', rating: 4.7, reviews: 64, available: true },
    ],
    providerReviews: [
      { id: 'r1', user: 'คุณบุญมา', rating: 5, comment: 'ส้มตำรสเด็ด เผ็ดถูกใจ ส่งเร็ว ราคาถูก', date: '6 มี.ค. 2569', avatar: '👨' },
      { id: 'r2', user: 'คุณอรพิน', rating: 4, comment: 'ลาบหมูอร่อยมาก รสชาติเหมือนบ้าน ดีมาก', date: '22 ก.พ. 2569', avatar: '👩' },
      { id: 'r3', user: 'คุณเกรียงศักดิ์', rating: 5, comment: 'ปริมาณเยอะ ราคาถูก รสชาติอีสานแท้ๆ', date: '11 ก.พ. 2569', avatar: '👨‍🦳' },
    ],
  },
  '19': {
    id: '19', name: 'ช่างไฟวิมล', avatar: '⚡',
    tagline: 'ช่างไฟฟ้า ติดตั้ง ซ่อม เชียงใหม่',
    bio: 'ช่างไฟฟ้าใบอนุญาต กฟน. ประสบการณ์ 9 ปี ติดตั้งระบบไฟฟ้าบ้าน คอนโด ซ่อมบอร์ด ติดตั้งปลั๊ก สวิตช์ ระบบแอร์ ติดตั้งโซลาร์เซลล์ รับประกัน 1 ปี',
    verified: true, online: false, trustScore: 88, rating: 4.7, reviews: 41, completedBookings: 134,
    memberSince: 'มิ.ย. 2567', community: 'เมืองเชียงใหม่ซิตี้', communityIds: ['6'], area: 'เมือง, เชียงใหม่',
    responseTime: '< 2 ชั่วโมง', category: 'งานช่าง',
    badges: ['ยืนยันตัวตน', 'ใบอนุญาต กฟน.', 'Solar Certified'],
    availableDays: [0,1,2,3,4,5], openTime: '08:00', closeTime: '18:00',
    listings: [
      { id: '19', title: 'ช่างไฟฟ้าบ้าน ติดตั้ง ซ่อม เชียงใหม่', price: 500, unit: 'ครั้ง', image: '⚡', rating: 4.7, reviews: 41, available: false },
    ],
    providerReviews: [
      { id: 'r1', user: 'คุณสมหมาย', rating: 5, comment: 'งานเรียบร้อย รวดเร็ว ปลอดภัย ราคาตรงไปตรงมา', date: '4 มี.ค. 2569', avatar: '👨' },
      { id: 'r2', user: 'คุณลาวัณย์', rating: 4, comment: 'ช่างมืออาชีพ อธิบายปัญหาก่อนลงมือซ่อม', date: '23 ก.พ. 2569', avatar: '👩' },
    ],
  },
  '20': {
    id: '20', name: 'สวนสวยบางใหญ่', avatar: '🌳',
    tagline: 'จัดสวน ตัดหญ้า ดูแลสวนรายเดือน',
    bio: 'บริการจัดสวนและดูแลสวนครบวงจร ออกแบบสวน ปลูกต้นไม้ ตัดแต่ง ดูแลรายเดือน ใช้ปุ๋ยอินทรีย์ ไม่ใช้ยาฆ่าแมลงอันตราย ประสบการณ์ 7 ปี งาน 200+ สวน',
    verified: true, online: true, trustScore: 82, rating: 4.6, reviews: 33, completedBookings: 112,
    memberSince: 'ก.ค. 2567', community: 'ชุมชนเมืองทอง', communityIds: ['3'], area: 'บางใหญ่, นนทบุรี',
    responseTime: '< 3 ชั่วโมง', category: 'สวนและภูมิทัศน์',
    badges: ['ยืนยันตัวตน', 'ปุ๋ยอินทรีย์'],
    availableDays: [0,1,2,3,4,5], openTime: '07:00', closeTime: '17:00',
    listings: [
      { id: '20', title: 'จัดสวน ดูแลสวนรายเดือน', price: 800, unit: 'ครั้ง', image: '🌳', rating: 4.6, reviews: 33, available: true },
    ],
    providerReviews: [
      { id: 'r1', user: 'คุณอรทัย', rating: 5, comment: 'สวนสวยขึ้นมาก ทีมงานขยัน รับผิดชอบ', date: '7 มี.ค. 2569', avatar: '👩' },
      { id: 'r2', user: 'คุณประชา', rating: 4, comment: 'ราคาสมเหตุสมผล งานดี มาตรงเวลา', date: '26 ก.พ. 2569', avatar: '👨' },
    ],
  },
  // ── ผู้ให้บริการใหม่: ภาคกลาง, ตะวันออก, ตะวันตก ─────────────────────────
  '21': {
    id: '21', name: 'ร้านก๋วยเตี๋ยวนครสวรรค์', avatar: '🍜',
    tagline: 'ก๋วยเตี๋ยวเนื้อ หมู นครสวรรค์สไตล์',
    bio: 'ร้านก๋วยเตี๋ยวชื่อดังในนครสวรรค์ สูตรน้ำซุปเข้มข้นสไตล์ภาคกลาง ทั้งก๋วยเตี๋ยวเนื้อ หมู ไก่ เส้นหมี่ เส้นใหญ่ เส้นเล็ก รสเด็ด ลูกค้าประจำ 200+ ราย ส่งถึงบ้านรัศมี 5 กม.',
    verified: true, online: true, trustScore: 86, rating: 4.7, reviews: 52, completedBookings: 198,
    memberSince: 'มี.ค. 2568', community: 'นครสวรรค์ เมือง', communityIds: ['21'], area: 'เมือง, นครสวรรค์',
    responseTime: '< 1 ชั่วโมง', category: 'อาหารและเครื่องดื่ม',
    badges: ['ยืนยันตัวตน', 'สูตรต้นตำรับ'],
    availableDays: [0,1,2,3,4,5,6], openTime: '07:00', closeTime: '15:00',
    listings: [
      { id: '21', title: 'ก๋วยเตี๋ยวส่งถึงบ้าน นครสวรรค์', price: 55, unit: 'ชาม', image: '🍜', rating: 4.7, reviews: 52, available: true },
    ],
    providerReviews: [
      { id: 'r1', user: 'คุณสมจิตร', rating: 5, comment: 'น้ำซุปหอม เส้นนุ่ม เนื้อนุ่ม อร่อยมากๆ', date: '8 มี.ค. 2569', avatar: '👩' },
      { id: 'r2', user: 'คุณวิรัช', rating: 4, comment: 'ส่งเร็ว ร้อนดี รสชาติดีมาก ราคาคุ้ม', date: '25 ก.พ. 2569', avatar: '👨' },
      { id: 'r3', user: 'คุณจีรนันท์', rating: 5, comment: 'กินแล้วอยากกินอีก รสชาติเหมือนนั่งกินที่ร้านเลย', date: '14 ก.พ. 2569', avatar: '👩‍💼' },
    ],
  },
  '22': {
    id: '22', name: 'ช่างพัทยา ครบวงจร', avatar: '🔩',
    tagline: 'ช่างซ่อม ติดตั้ง แอร์ ไฟฟ้า พัทยา',
    bio: 'ช่างมืออาชีพครบทุกงาน ทั้งแอร์ ไฟฟ้า ประปา สีบ้าน งานไม้ ประสบการณ์ 8 ปีในเมืองพัทยา รองรับลูกค้าทั้งชาวไทยและต่างชาติ สื่อสารได้ภาษาอังกฤษ รับประกัน 6 เดือน',
    verified: true, online: true, trustScore: 87, rating: 4.6, reviews: 45, completedBookings: 167,
    memberSince: 'พ.ค. 2567', community: 'พัทยา บีชซิตี้', communityIds: ['18'], area: 'พัทยา, ชลบุรี',
    responseTime: '< 2 ชั่วโมง', category: 'งานช่าง',
    badges: ['ยืนยันตัวตน', 'ภาษาอังกฤษได้', 'รับประกัน 6 เดือน'],
    availableDays: [0,1,2,3,4,5], openTime: '08:00', closeTime: '18:00',
    listings: [
      { id: '22', title: 'ช่างซ่อม-ติดตั้ง ครบวงจร พัทยา', price: 600, unit: 'ครั้ง', image: '🔩', rating: 4.6, reviews: 45, available: true },
    ],
    providerReviews: [
      { id: 'r1', user: 'Mr. Richard', rating: 5, comment: 'Very professional! Fixed my AC in 1 hour. Speaks English well.', date: '7 มี.ค. 2569', avatar: '👨‍🦱' },
      { id: 'r2', user: 'คุณวิทยา', rating: 4, comment: 'งานดี ตรงเวลา ราคาชัดเจน ไม่บวกเพิ่ม', date: '24 ก.พ. 2569', avatar: '👨' },
      { id: 'r3', user: 'Ms. Maria', rating: 5, comment: 'Fixed the plumbing fast. Good price, reliable service.', date: '12 ก.พ. 2569', avatar: '👩‍🦱' },
    ],
  },
  '23': {
    id: '23', name: 'ไกด์ล่องแก่งกาญจน์', avatar: '🛶',
    tagline: 'ล่องแก่ง เดินป่า ล้ำธรรมชาติ กาญจนบุรี',
    bio: 'ไกด์มืออาชีพกาญจนบุรี ใบอนุญาตนำเที่ยว ประสบการณ์ 10 ปี โปรแกรมล่องแก่ง เดินป่า ชมน้ำตก ถ้ำกาญจน์ สะพานข้ามแม่น้ำแคว และหมู่บ้านชาวกะเหรี่ยง อุปกรณ์ครบ ปลอดภัย',
    verified: true, online: true, trustScore: 89, rating: 4.8, reviews: 38, completedBookings: 142,
    memberSince: 'ต.ค. 2567', community: 'กาญจนบุรี ริเวอร์', communityIds: ['24'], area: 'เมือง, กาญจนบุรี',
    responseTime: '< 2 ชั่วโมง', category: 'ท่องเที่ยว',
    badges: ['ยืนยันตัวตน', 'ใบอนุญาตนำเที่ยว TAT', 'ความปลอดภัยสูงสุด'],
    availableDays: [0,5,6], openTime: '07:00', closeTime: '17:00',
    listings: [
      { id: '23', title: 'ล่องแก่ง เดินป่า กาญจนบุรี', price: 1500, unit: 'คน/วัน', image: '🛶', rating: 4.8, reviews: 38, available: true },
    ],
    providerReviews: [
      { id: 'r1', user: 'คุณปิยวัฒน์', rating: 5, comment: 'ประสบการณ์ล่องแก่งสุดตื่นเต้น ไกด์ดูแลดีมาก ปลอดภัย', date: '5 มี.ค. 2569', avatar: '👨' },
      { id: 'r2', user: 'คุณอภิษฎา', rating: 5, comment: 'ธรรมชาติสวยงามมาก ไกด์อธิบายประวัติศาสตร์ด้วย น่าประทับใจ', date: '20 ก.พ. 2569', avatar: '👩' },
      { id: 'r3', user: 'Mr. Kevin', rating: 4, comment: 'Great experience! River rafting was thrilling. Will come back.', date: '10 ก.พ. 2569', avatar: '👨‍🦲' },
    ],
  },
  '24': {
    id: '24', name: 'สวนผลไม้สุราษฎร์', avatar: '🍊',
    tagline: 'ผลไม้ใต้สด ทุเรียน มังคุด เงาะ ส่งทั่วไทย',
    bio: 'สวนผลไม้ครอบครัวขนาด 20 ไร่ ผลิตทุเรียน มังคุด เงาะ ลองกอง จังหวัดสุราษฎร์ธานี ไม่ใช้สารกระตุ้น เก็บเมื่อสุกแก่ตามธรรมชาติ ส่งเย็น บรรจุพิเศษ ถึงบ้านสดใหม่ รับออเดอร์รายปี',
    verified: true, online: true, trustScore: 84, rating: 4.8, reviews: 61, completedBookings: 230,
    memberSince: 'พ.ย. 2567', community: 'สุราษฎร์ธานี เมือง', communityIds: ['19'], area: 'เมือง, สุราษฎร์ธานี',
    responseTime: '< 3 ชั่วโมง', category: 'เกษตรกรรม',
    badges: ['ยืนยันตัวตน', 'ผลไม้ธรรมชาติ', 'ส่งทั่วประเทศ'],
    availableDays: [0,1,2,3,4,5,6], openTime: '07:00', closeTime: '17:00',
    listings: [
      { id: '24', title: 'ผลไม้ใต้ส่งตรงจากสวน สุราษฎร์', price: 450, unit: 'กิโลกรัม', image: '🍊', rating: 4.8, reviews: 61, available: true },
    ],
    providerReviews: [
      { id: 'r1', user: 'คุณอัมพร', rating: 5, comment: 'ทุเรียนสุกพอดี หอมมาก ส่งถึงบ้านในกล่องสวยงาม', date: '9 มี.ค. 2569', avatar: '👩' },
      { id: 'r2', user: 'คุณสมชาย', rating: 5, comment: 'มังคุดอร่อยมาก ไม่ยาว รสชาติดีกว่าในห้างเยอะ', date: '3 มี.ค. 2569', avatar: '👨' },
      { id: 'r3', user: 'คุณนภาพร', rating: 4, comment: 'ส่งเร็ว บรรจุดี ผลไม้สดทุกชิ้น สั่งซ้ำทุกฤดูกาล', date: '22 ก.พ. 2569', avatar: '👩‍💼' },
    ],
  },
  '25': {
    id: '25', name: 'เซรามิคลำปาง ช่างบุ', avatar: '🏺',
    tagline: 'เครื่องเคลือบ เซรามิค งานปั้นมือ ลำปาง',
    bio: 'ช่างปั้นเครื่องเคลือบดินเผาลำปาง สืบทอดศิลปะจากบรรพบุรุษ 3 ชั่วคน วัสดุดินขาวลำปางแท้ รับออเดอร์พิเศษ เซ็ตของขวัญ เครื่องใช้โต๊ะอาหาร แก้วน้ำ ชุดชา OTOP ระดับ 5 ดาว ส่งทั่วโลก',
    verified: true, online: false, trustScore: 91, rating: 4.9, reviews: 44, completedBookings: 178,
    memberSince: 'ก.ย. 2567', community: 'ลำปาง เซรามิค', communityIds: ['20'], area: 'เมือง, ลำปาง',
    responseTime: '< 4 ชั่วโมง', category: 'งานฝีมือ',
    badges: ['ยืนยันตัวตน', 'OTOP 5 ดาว', 'มรดกวัฒนธรรม', 'ส่งทั่วโลก'],
    availableDays: [0,1,2,3,4], openTime: '09:00', closeTime: '17:00',
    listings: [
      { id: '25', title: 'เครื่องเคลือบดินเผาลำปาง มือปั้น', price: 280, unit: 'ชิ้น', image: '🏺', rating: 4.9, reviews: 44, available: false },
    ],
    providerReviews: [
      { id: 'r1', user: 'คุณนิภา', rating: 5, comment: 'ของสวยมาก ปั้นมือแท้ๆ รายละเอียดประณีต ซื้อเป็นของฝากเพื่อน', date: '6 มี.ค. 2569', avatar: '👩' },
      { id: 'r2', user: 'Ms. Yuki', rating: 5, comment: 'Beautiful ceramics! Very unique design. Shipped carefully to Japan.', date: '28 ก.พ. 2569', avatar: '👩‍🦱' },
      { id: 'r3', user: 'คุณกิตติ', rating: 5, comment: 'ชุดกาแฟสวยงามมาก ใช้แล้วรู้สึกถึงงานฝีมือแท้', date: '15 ก.พ. 2569', avatar: '👨' },
    ],
  },
}

export function getProviderById(id: string): MockProviderDetail | undefined {
  return MOCK_PROVIDER_MAP[id]
}
