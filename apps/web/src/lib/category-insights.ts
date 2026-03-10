// Category-specific insight engine for Provider Command Center (Phase 14)
// Each of the 10 business categories gets unique KPIs, AI narrative, and recommendations.

// ── Shared Types ─────────────────────────────────────────────────────────────────

export interface CategoryKPI {
  label: string
  value: string
  unit: string
  trend: number        // percentage change vs prev period (positive = up)
  trendUp: boolean     // true = higher is better
  icon: string         // emoji
}

export interface CategoryRecommendation {
  priority: 'high' | 'medium' | 'low'
  title: string
  description: string
  icon: string
}

export interface CategoryInsight {
  category: string
  categoryLabel: string
  categoryEmoji: string
  performanceScore: number   // 0–100
  performanceBand: 'excellent' | 'good' | 'fair' | 'needs_improvement'
  aiNarrative: string
  kpis: CategoryKPI[]
  recommendations: CategoryRecommendation[]
}

// ── Helper ───────────────────────────────────────────────────────────────────────

function band(score: number): CategoryInsight['performanceBand'] {
  if (score >= 85) return 'excellent'
  if (score >= 70) return 'good'
  if (score >= 50) return 'fair'
  return 'needs_improvement'
}

// ── 10-Category Insight Records ──────────────────────────────────────────────────

export const CATEGORY_INSIGHTS: Record<string, CategoryInsight> = {

  FOOD: {
    category: 'FOOD',
    categoryLabel: 'อาหาร',
    categoryEmoji: '🍱',
    performanceScore: 82,
    performanceBand: band(82),
    aiNarrative:
      'ธุรกิจอาหารของคุณอยู่ในเกณฑ์ดีมาก ยอดขายเดือนนี้เติบโต +16.2% เมื่อเทียบกับเดือนก่อน ' +
      'โดยมีช่วง 11:00–13:00 น. เป็น Peak Hour ที่สร้างรายได้สูงสุดถึง 48% ของรายได้รวม ' +
      'ลูกค้าประจำคิดเป็น 67% ของออเดอร์ทั้งหมด ซึ่งบ่งชี้ว่าคุณภาพสินค้าดึงดูดการกลับมาซื้อซ้ำได้ดี ' +
      'อย่างไรก็ตาม พบว่าช่วงเย็น 17:00–19:00 น. ยังมีศักยภาพที่ยังไม่ถูกใช้เต็มที่ ' +
      'การเพิ่มโปรโมชันในช่วงเย็นอาจช่วยเพิ่มรายได้อีก 15–20% ต่อเดือน',
    kpis: [
      { label: 'ช่วงขายดีสุด',       value: '11:00–13:00',  unit: 'น.',           trend: 0,    trendUp: true,  icon: '⏰' },
      { label: 'ลูกค้ากลับมาซื้อซ้ำ', value: '67',           unit: '%',            trend: 8,    trendUp: true,  icon: '🔄' },
      { label: 'ขนาดออเดอร์เฉลี่ย',   value: '2.8',          unit: 'กล่อง/ออเดอร์', trend: 5,    trendUp: true,  icon: '📦' },
      { label: 'อัตรายกเลิก',         value: '4.2',          unit: '%',            trend: -1.3, trendUp: false, icon: '❌' },
    ],
    recommendations: [
      {
        priority: 'high',
        title: 'เปิดรับออเดอร์ช่วงเย็น 17:00–19:00 น.',
        description: 'ข้อมูลพฤติกรรมลูกค้าชี้ว่าช่วงเย็นมีความต้องการสูงแต่ Supply ต่ำ การเพิ่ม Slot ช่วงเย็นอาจเพิ่มรายได้ 15–20%',
        icon: '🌙',
      },
      {
        priority: 'high',
        title: 'เพิ่มโปรแกรม Loyalty สำหรับลูกค้าประจำ',
        description: 'ลูกค้าประจำ 67% คือสินทรัพย์หลัก การสร้างระบบสะสมแต้ม เช่น ซื้อครบ 10 ครั้ง ได้ฟรี 1 ครั้ง จะช่วยรักษาฐานลูกค้า',
        icon: '⭐',
      },
      {
        priority: 'medium',
        title: 'เพิ่มตัวเลือกเมนูอาหารเย็น',
        description: 'เมนูปัจจุบันเน้นมื้อกลางวัน การเพิ่มเมนูที่เหมาะกับมื้อเย็นจะขยายกลุ่มเป้าหมายใหม่',
        icon: '📋',
      },
      {
        priority: 'low',
        title: 'ปรับบรรจุภัณฑ์ให้ Eco-friendly',
        description: 'ลูกค้ากลุ่มรักษ์โลกกำลังเพิ่มขึ้น การใช้กล่องย่อยสลายได้อาจเพิ่มความดึงดูดและเหตุผลในการตั้งราคาสูงขึ้น',
        icon: '♻️',
      },
    ],
  },

  REPAIR: {
    category: 'REPAIR',
    categoryLabel: 'งานช่าง',
    categoryEmoji: '🔧',
    performanceScore: 76,
    performanceBand: band(76),
    aiNarrative:
      'ธุรกิจงานช่างของคุณมีอัตราความสำเร็จงาน 91% ซึ่งอยู่เหนือค่าเฉลี่ยของแพลตฟอร์มที่ 85% ' +
      'เวลาตอบสนองลูกค้าเฉลี่ย 22 นาที บ่งชี้ถึงความมืออาชีพและความรับผิดชอบสูง ' +
      'งานซ่อมไฟฟ้าและประปาคิดเป็น 74% ของงานทั้งหมด ซึ่งอาจมีโอกาสขยายไปยังงานก่อสร้างขนาดเล็ก ' +
      'ค่าแรงเฉลี่ยต่องาน ฿850 ยังต่ำกว่าค่าเฉลี่ยตลาด ฿1,100 อยู่ 23% ' +
      'การปรับราคาให้สอดคล้องกับตลาดโดยไม่กระทบคุณภาพงานจะช่วยเพิ่มรายได้อย่างมีนัยสำคัญ',
    kpis: [
      { label: 'อัตราสำเร็จงาน',    value: '91',   unit: '%',       trend: 3,    trendUp: true,  icon: '✅' },
      { label: 'เวลาตอบสนองเฉลี่ย', value: '22',   unit: 'นาที',    trend: -5,   trendUp: false, icon: '⚡' },
      { label: 'ค่าแรงเฉลี่ย/งาน',  value: '850',  unit: 'บาท',     trend: 8,    trendUp: true,  icon: '💰' },
      { label: 'อัตราเรียกช่างซ้ำ', value: '58',   unit: '%',       trend: 6,    trendUp: true,  icon: '🔄' },
    ],
    recommendations: [
      {
        priority: 'high',
        title: 'ปรับอัตราค่าแรงให้สอดคล้องกับตลาด',
        description: 'ค่าแรงของคุณต่ำกว่าตลาด 23% ทั้งที่คุณภาพงานดีกว่าค่าเฉลี่ย การปรับราคาขึ้น 15–20% จะเพิ่มรายได้โดยไม่เสียลูกค้า',
        icon: '💵',
      },
      {
        priority: 'high',
        title: 'สร้าง Package งานบำรุงรักษาประจำเดือน',
        description: 'ลูกค้า 58% เรียกซ้ำ การเสนอ Package ตรวจสอบประจำเดือน (฿500/เดือน) จะสร้างรายได้แบบ Recurring',
        icon: '📅',
      },
      {
        priority: 'medium',
        title: 'ขยายขอบเขตงานสู่งานก่อสร้างเล็กน้อย',
        description: 'งานไฟฟ้า-ประปา 74% ของงาน การเพิ่มบริการงานก่อสร้างเล็กน้อย เช่น ต่อเติม ซ่อมพื้น จะเพิ่มมูลค่าต่อออเดอร์',
        icon: '🏗️',
      },
      {
        priority: 'low',
        title: 'ถ่ายภาพ Before/After และแชร์ใน Profile',
        description: 'ภาพผลงานเป็นหลักฐานคุณภาพที่ดีที่สุด การแสดง Before/After จะเพิ่มความน่าเชื่อถือและอัตราการจองใหม่',
        icon: '📸',
      },
    ],
  },

  HOME_SERVICES: {
    category: 'HOME_SERVICES',
    categoryLabel: 'งานบ้าน',
    categoryEmoji: '🏠',
    performanceScore: 79,
    performanceBand: band(79),
    aiNarrative:
      'บริการงานบ้านของคุณมีฐานลูกค้าประจำที่แข็งแกร่ง 72% ของลูกค้าจองบริการซ้ำทุกเดือน ' +
      'การทำความสะอาดเป็นบริการยอดนิยมคิดเป็น 61% แต่บริการซักรีดมีอัตราการจองเพิ่มขึ้น +28% ' +
      'ลูกค้ามักจองล่วงหน้า 3–5 วัน ซึ่งช่วยให้วางแผนงานได้ดี ' +
      'แต่พบว่าวันศุกร์และเสาร์มีความต้องการสูงกว่าความสามารถในการให้บริการ ' +
      'การรับผู้ช่วยงานในช่วง Peak จะช่วยเพิ่มรายได้และความพึงพอใจลูกค้า',
    kpis: [
      { label: 'ลูกค้าจองประจำ/เดือน', value: '72', unit: '%',    trend: 4,  trendUp: true,  icon: '🔄' },
      { label: 'จองล่วงหน้าเฉลี่ย',    value: '3.8', unit: 'วัน', trend: 0,  trendUp: true,  icon: '📅' },
      { label: 'บริการ Bundle (2+)',    value: '34',  unit: '%',    trend: 12, trendUp: true,  icon: '📦' },
      { label: 'อัตราการยกเลิก',       value: '5.1', unit: '%',    trend: -2, trendUp: false, icon: '❌' },
    ],
    recommendations: [
      {
        priority: 'high',
        title: 'เพิ่มช่วงให้บริการวันหยุดสุดสัปดาห์',
        description: 'วันเสาร์-อาทิตย์มีความต้องการเกินกำลัง ลูกค้าบางส่วนจำยอมยกเลิก การรับงานเพิ่มจะลดการสูญเสียโอกาสรายได้',
        icon: '📈',
      },
      {
        priority: 'high',
        title: 'เสนอ Package รายเดือนในราคาพิเศษ',
        description: 'ลูกค้าจองประจำ 72% แต่ยังเป็นการจองรายครั้ง การเสนอ Package 4 ครั้ง/เดือน ลด 10% จะเพิ่ม Commitment',
        icon: '🎁',
      },
      {
        priority: 'medium',
        title: 'เพิ่มบริการซักรีดและรีดผ้า',
        description: 'บริการซักรีดเติบโต +28% แต่ยังเป็นบริการรอง การยกระดับเป็นบริการหลักจะขยายตลาด',
        icon: '👕',
      },
      {
        priority: 'low',
        title: 'ให้บริการจัดบ้านสำหรับย้ายเข้าใหม่',
        description: 'ตลาดนิชสำหรับคนย้ายบ้าน หรือตกแต่งใหม่มีความต้องการเฉพาะ และยินดีจ่ายราคาพิเศษ',
        icon: '🏡',
      },
    ],
  },

  TUTORING: {
    category: 'TUTORING',
    categoryLabel: 'สอนพิเศษ',
    categoryEmoji: '📚',
    performanceScore: 88,
    performanceBand: band(88),
    aiNarrative:
      'ธุรกิจสอนพิเศษของคุณอยู่ในระดับ Excellent โดยอัตราการรักษานักเรียน 84% สูงกว่าค่าเฉลี่ยแพลตฟอร์มอย่างมาก ' +
      'คะแนนพัฒนาการนักเรียนเฉลี่ย +18% ต่อเทอมสะท้อนถึงคุณภาพการสอนที่แท้จริง ' +
      'วิชาคณิตศาสตร์และภาษาอังกฤษมีความต้องการสูงสุด โดยเฉพาะช่วงใกล้สอบ ' +
      'การขยายไปสู่วิชา Coding และ AI สำหรับเด็กกำลังเป็น Trend ที่เติบโตในตลาด ' +
      'และอาจเปิดโอกาสรายได้ใหม่สูงถึง +30% หากเริ่มในปีการศึกษาหน้า',
    kpis: [
      { label: 'นักเรียนต่อเนื่อง/เทอม', value: '84', unit: '%',      trend: 6,  trendUp: true, icon: '🎓' },
      { label: 'พัฒนาการนักเรียมเฉลี่ย', value: '+18', unit: '%/เทอม', trend: 3,  trendUp: true, icon: '📈' },
      { label: 'ความพึงพอใจผู้ปกครอง',   value: '4.88', unit: '⭐',    trend: 2,  trendUp: true, icon: '👨‍👩‍👧' },
      { label: 'อัตราใช้ Class ครบ',      value: '91',  unit: '%',      trend: 1,  trendUp: true, icon: '✅' },
    ],
    recommendations: [
      {
        priority: 'high',
        title: 'เปิดคอร์ส Coding & AI สำหรับเด็ก',
        description: 'ตลาด STEM Education เติบโตสูง ผู้ปกครองยุคใหม่ต้องการให้บุตรเรียน Coding ราคา 800–1,200 บาท/ครั้งยอมจ่าย',
        icon: '💻',
      },
      {
        priority: 'high',
        title: 'เพิ่มคลาสกลุ่ม (4–6 คน) เพื่อลดต้นทุนลูกค้า',
        description: 'ลูกค้าบางส่วนไม่จองเพราะค่าเรียนสูง การเปิดคลาสกลุ่มเล็กที่ราคาต่อคนน้อยลงจะขยายฐาน',
        icon: '👥',
      },
      {
        priority: 'medium',
        title: 'สร้าง Online Module สำหรับทบทวนบทเรียน',
        description: 'วิดีโอสรุปบทเรียนที่นักเรียนเล่นซ้ำได้เพิ่มคุณค่าบริการโดยไม่เพิ่มเวลาสอน',
        icon: '🎬',
      },
      {
        priority: 'low',
        title: 'จัดโปรโมชัน Early Bird สำหรับเทอมใหม่',
        description: 'ออกโปรก่อนเปิดเทอม 1 เดือน ลด 15% จะช่วยให้วางแผนตารางสอนล่วงหน้าได้ดีขึ้น',
        icon: '🏃',
      },
    ],
  },

  ELDERLY_CARE: {
    category: 'ELDERLY_CARE',
    categoryLabel: 'ดูแลผู้สูงอายุ',
    categoryEmoji: '👴',
    performanceScore: 91,
    performanceBand: band(91),
    aiNarrative:
      'บริการดูแลผู้สูงอายุของคุณอยู่ในระดับ Excellent — สูงสุดในหมวดนี้บนแพลตฟอร์ม ' +
      'ครอบครัวผู้ใช้บริการ 89% ต่ออายุสัญญาครบ 3 เดือน แสดงถึงความไว้วางใจสูงมาก ' +
      'ชั่วโมงดูแลเฉลี่ย 38 ชั่วโมง/สัปดาห์/ครอบครัว บ่งชี้ว่าต้องการการดูแลเต็มรูปแบบ ' +
      'คะแนนความพึงพอใจครอบครัว 4.95 ดาว เป็นสิ่งที่ควรนำมาสร้างเป็น Trust Signal ' +
      'ในการดึงดูดลูกค้าใหม่ผ่านรีวิวและกรณีศึกษา เนื่องจากตลาดนี้ตัดสินใจจากความไว้วางใจเป็นหลัก',
    kpis: [
      { label: 'ต่ออายุสัญญา 3+ เดือน', value: '89', unit: '%',   trend: 5,  trendUp: true, icon: '🔄' },
      { label: 'ชั่วโมงดูแล/สัปดาห์',   value: '38', unit: 'ชม.', trend: 2,  trendUp: true, icon: '⏱️' },
      { label: 'ความพึงพอใจครอบครัว',    value: '4.95', unit: '⭐', trend: 0.1, trendUp: true, icon: '❤️' },
      { label: 'อัตราการส่งรายงาน',       value: '100', unit: '%',  trend: 0,  trendUp: true, icon: '📋' },
    ],
    recommendations: [
      {
        priority: 'high',
        title: 'ขอ Testimonial จากครอบครัวที่ไว้วางใจเพื่อสร้าง Social Proof',
        description: 'รีวิวจากครอบครัวจริงมีอิทธิพลสูงในการตัดสินใจ ขอวิดีโอ Testimonial สั้น 1–2 นาที',
        icon: '💬',
      },
      {
        priority: 'high',
        title: 'เพิ่มบริการประสานงานแพทย์และนัดหมาย',
        description: 'ครอบครัวต้องการผู้ดูแลที่ช่วยนัดหมายแพทย์ พาไปตรวจ การเพิ่มบริการนี้จะเพิ่มมูลค่าและความจำเป็น',
        icon: '🏥',
      },
      {
        priority: 'medium',
        title: 'สร้างรายงานดูแลรายวันดิจิทัล',
        description: 'Application รายงานสุขภาพ กิจกรรม และยาที่รับประทานประจำวันจะเพิ่มความโปร่งใสและไว้วางใจ',
        icon: '📱',
      },
      {
        priority: 'low',
        title: 'ขยายรับดูแลผู้ป่วยหลังผ่าตัด',
        description: 'ตลาด Post-surgical Care ในชุมชนใกล้บ้านมีความต้องการสูง เป็น Niche ที่ยังไม่มีผู้ให้บริการเต็มที่',
        icon: '🩺',
      },
    ],
  },

  HANDMADE: {
    category: 'HANDMADE',
    categoryLabel: 'สินค้าทำมือ',
    categoryEmoji: '🎨',
    performanceScore: 74,
    performanceBand: band(74),
    aiNarrative:
      'ธุรกิจสินค้าทำมือของคุณมีจุดแข็งในด้านงาน Custom Order 43% ของยอดขายมาจากออเดอร์พิเศษ ' +
      'ซึ่งมีมูลค่าเฉลี่ยสูงกว่าสินค้า Stock ถึง 2.3 เท่า แสดงว่าลูกค้าให้คุณค่ากับงานเฉพาะ ' +
      'อย่างไรก็ตาม เวลาผลิตเฉลี่ย 8 วันต่อชิ้น อาจทำให้บางออเดอร์เสียโอกาส ' +
      'การบริหารจัดการคิวงานที่ดีขึ้นและการขึ้นราคาสำหรับ Rush Order จะช่วยเพิ่มทั้งรายได้และความพึงพอใจ',
    kpis: [
      { label: 'สัดส่วน Custom Order', value: '43', unit: '%',   trend: 8, trendUp: true,  icon: '✏️' },
      { label: 'มูลค่า Custom vs Stock', value: '2.3', unit: 'เท่า', trend: 0, trendUp: true, icon: '💰' },
      { label: 'เวลาผลิตเฉลี่ย',       value: '8',  unit: 'วัน', trend: -1, trendUp: false, icon: '⏳' },
      { label: 'Portfolio ผลงาน',      value: '47', unit: 'ชิ้น', trend: 12, trendUp: true, icon: '🖼️' },
    ],
    recommendations: [
      {
        priority: 'high',
        title: 'เปิด Rush Order ราคาพรีเมียม (+30%)',
        description: 'ลูกค้าที่ต้องการงานเร่งด่วนยินดีจ่ายเพิ่ม การเปิดตัวเลือก Rush 3–5 วัน ราคา+30% จะเพิ่มรายได้',
        icon: '⚡',
      },
      {
        priority: 'high',
        title: 'สร้าง Digital Portfolio ใน Listing',
        description: 'ลูกค้า Custom Order ตัดสินใจจากผลงานก่อน การแสดง Portfolio 20+ ชิ้น จะเพิ่มอัตราการ Inquiry',
        icon: '📸',
      },
      {
        priority: 'medium',
        title: 'สร้าง Template Design ให้ลูกค้าเลือก',
        description: 'ลดเวลาสื่อสาร Back-and-forth ด้วยการมีแบบ Template 10–15 แบบ ลูกค้าเลือกแล้ว Customize รายละเอียด',
        icon: '🗂️',
      },
      {
        priority: 'low',
        title: 'เข้าร่วม Craft Fair ออนไลน์ใน Platform อื่น',
        description: 'การแสดงสินค้าใน Etsy, Shopee, หรือ Line Shopping ควบคู่กับ Marketplace จะขยายฐานลูกค้าอย่างมาก',
        icon: '🌐',
      },
    ],
  },

  HEALTH_WELLNESS: {
    category: 'HEALTH_WELLNESS',
    categoryLabel: 'สุขภาพ',
    categoryEmoji: '💆',
    performanceScore: 85,
    performanceBand: band(85),
    aiNarrative:
      'ธุรกิจสุขภาพของคุณมีอัตราการซื้อ Package เพิ่มขึ้น +22% ซึ่งแสดงว่าลูกค้าเริ่มเชื่อมั่นในคุณค่าระยะยาว ' +
      'ความหนาแน่นการจองเฉลี่ย 5.2 Session/สัปดาห์ ใกล้ถึง Capacity สูงสุดของคุณแล้ว ' +
      'ลูกค้า 68% กลับมาภายใน 30 วัน สูงมากเมื่อเทียบกับค่าเฉลี่ยหมวดนี้ที่ 45% ' +
      'นอกจากนี้พบว่า Wellness Package ที่รวมนวด + โยคะ มีความต้องการแต่ยังไม่มีให้บริการ ' +
      'การสร้าง Integrated Package จะเพิ่มมูลค่าออเดอร์เฉลี่ยได้อย่างมีนัยสำคัญ',
    kpis: [
      { label: 'ลูกค้ากลับใน 30 วัน',  value: '68', unit: '%',            trend: 8,  trendUp: true, icon: '🔄' },
      { label: 'อัตราซื้อ Package',     value: '41', unit: '%',            trend: 22, trendUp: true, icon: '📦' },
      { label: 'Session/สัปดาห์',       value: '5.2', unit: 'ครั้ง',       trend: 10, trendUp: true, icon: '📅' },
      { label: 'มูลค่า Package เฉลี่ย', value: '2,400', unit: 'บาท/แพ็ก', trend: 5,  trendUp: true, icon: '💰' },
    ],
    recommendations: [
      {
        priority: 'high',
        title: 'สร้าง Wellness Package รวมหลายบริการ',
        description: 'Package นวด+โยคะ+อาหารสุขภาพ ราคา 2,500–3,500 บาท/เดือน มีความต้องการสูงแต่ยังไม่มีผู้ให้บริการในชุมชน',
        icon: '🌿',
      },
      {
        priority: 'high',
        title: 'เพิ่มช่วงเวลาให้บริการเช้าตรู่ 06:00–08:00 น.',
        description: 'กลุ่ม Working Professional ต้องการ Session ก่อนไปทำงาน ราคา Premium +20% เป็นที่ยอมรับในกลุ่มนี้',
        icon: '🌅',
      },
      {
        priority: 'medium',
        title: 'ให้คำปรึกษาออนไลน์ 30 นาที (ฟรีสำหรับสมาชิก)',
        description: 'การให้คำปรึกษาออนไลน์เป็น Value-add ที่เพิ่มความผูกพัน และนำไปสู่การจองบริการเพิ่ม',
        icon: '💻',
      },
      {
        priority: 'low',
        title: 'บันทึกวิดีโอ Wellness Tips สั้น ๆ สำหรับ Community',
        description: 'วิดีโอ 2–3 นาทีต่อสัปดาห์จะเพิ่ม Brand Awareness และสร้างความน่าเชื่อถือในชุมชน',
        icon: '📹',
      },
    ],
  },

  AGRICULTURE: {
    category: 'AGRICULTURE',
    categoryLabel: 'เกษตร',
    categoryEmoji: '🌾',
    performanceScore: 71,
    performanceBand: band(71),
    aiNarrative:
      'ธุรกิจเกษตรของคุณมีจุดแข็งในด้านความสดใหม่ของสินค้า ด้วยระยะเวลาเฉลี่ยจากเก็บเกี่ยวถึงมือลูกค้าเพียง 18 ชั่วโมง ' +
      'ซึ่งเป็นข้อได้เปรียบสำคัญที่ควรสื่อสารออกไป ออเดอร์ Bulk ขนาดใหญ่คิดเป็น 38% ของรายได้ ' +
      'แต่ช่วงนอก Season หลัก (ม.ค.–มี.ค.) รายได้ลดลง 40% ' +
      'การปลูกพืชหมุนเวียนหรือเพิ่มสินค้าแปรรูปจะช่วยลดความผันผวนของรายได้ตามฤดูกาลได้อย่างมีประสิทธิภาพ',
    kpis: [
      { label: 'เก็บเกี่ยว → ถึงมือลูกค้า', value: '18', unit: 'ชม.',  trend: -3, trendUp: false, icon: '🚚' },
      { label: 'สัดส่วน Bulk Order',      value: '38', unit: '%',     trend: 5,  trendUp: true,  icon: '📦' },
      { label: 'ดัชนีความสดใหม่',         value: '94', unit: 'คะแนน', trend: 2,  trendUp: true,  icon: '🌿' },
      { label: 'ลูกค้าสมัครรับประจำ',    value: '29', unit: '%',     trend: 15, trendUp: true,  icon: '🔄' },
    ],
    recommendations: [
      {
        priority: 'high',
        title: 'เปิด Subscription รายสัปดาห์ (ตะกร้าผัก/ผลไม้)',
        description: 'ลูกค้า 29% ต้องการสั่งประจำ การสร้าง Weekly Subscription Box ราคา 250–400 บาท จะสร้างรายได้ Recurring ที่มั่นคง',
        icon: '🧺',
      },
      {
        priority: 'high',
        title: 'เพิ่มสินค้าแปรรูปเพื่อรักษารายได้ช่วง Off-season',
        description: 'แยม ผักดอง น้ำผักผลไม้ NFC เป็นสินค้าที่ขายได้ตลอดปี และมีมูลค่าสูงกว่าสินค้าสด 3–4 เท่า',
        icon: '🏺',
      },
      {
        priority: 'medium',
        title: 'เน้นสื่อสาร "ตรงจากแปลง" เพื่อสร้าง Premium Positioning',
        description: 'ระยะเวลาเก็บเกี่ยว 18 ชม. คือ USP ที่แข็งแกร่งมาก ควรแสดงในทุก Listing พร้อมภาพแปลงเกษตรจริง',
        icon: '📍',
      },
      {
        priority: 'low',
        title: 'เข้าร่วมโครงการ GI หรือสินค้า Organic Certified',
        description: 'การได้รับใบรับรองสินค้าอินทรีย์จากหน่วยงานรัฐจะเพิ่ม Credibility และเปิดตลาดห้างสรรพสินค้า',
        icon: '📜',
      },
    ],
  },

  FREELANCE: {
    category: 'FREELANCE',
    categoryLabel: 'ฟรีแลนซ์',
    categoryEmoji: '💼',
    performanceScore: 78,
    performanceBand: band(78),
    aiNarrative:
      'ธุรกิจฟรีแลนซ์ของคุณมีอัตราส่งงานตรงเวลา 87% สูงกว่าค่าเฉลี่ยแพลตฟอร์ม 76% ' +
      'จำนวน Revision เฉลี่ย 1.4 ครั้งต่อโปรเจกต์ แสดงว่าการสื่อสาร Requirement ค่อนข้างดี ' +
      'อย่างไรก็ตาม อัตราค่าบริการของคุณยังต่ำกว่าค่าเฉลี่ยตลาด 18% ' +
      'และพบว่าลูกค้าที่ได้ Portfolio ที่หลากหลายมักจะ Upsell เป็นโปรเจกต์ใหญ่ขึ้น 34% ของกรณี ' +
      'การสร้าง Case Study ที่แสดง ROI ให้ลูกค้าเห็นจะช่วยสนับสนุนการตั้งราคาที่สูงขึ้น',
    kpis: [
      { label: 'ส่งงานตรงเวลา',      value: '87',  unit: '%',           trend: 4,   trendUp: true,  icon: '⏰' },
      { label: 'Revision เฉลี่ย',     value: '1.4', unit: 'ครั้ง/โปรเจกต์', trend: -0.2, trendUp: false, icon: '✏️' },
      { label: 'อัตราค่าบริการเฉลี่ย', value: '950', unit: 'บาท/ชม.',     trend: 12, trendUp: true,  icon: '💰' },
      { label: 'Upsell สำเร็จ',       value: '34',  unit: '%',           trend: 8,   trendUp: true,  icon: '📈' },
    ],
    recommendations: [
      {
        priority: 'high',
        title: 'ปรับค่าบริการให้สอดคล้องกับตลาด (เพิ่ม 15–20%)',
        description: 'คุณภาพงานของคุณเหนือกว่าค่าเฉลี่ย แต่ราคาต่ำกว่า 18% ลูกค้าที่ดีจะยังอยู่ ส่วนที่เสียจะเป็นลูกค้าที่ไม่คุ้มค่า',
        icon: '💵',
      },
      {
        priority: 'high',
        title: 'สร้าง Case Study พร้อม ROI สำหรับ 5 โปรเจกต์ล่าสุด',
        description: 'ลูกค้า B2B ตัดสินใจจาก Business Impact ไม่ใช่แค่ Portfolio สวย การแสดงผลลัพธ์เป็นตัวเลขจะเพิ่มการปิดงาน',
        icon: '📊',
      },
      {
        priority: 'medium',
        title: 'เพิ่มบริการ Retainer Monthly แทนโปรเจกต์รายครั้ง',
        description: 'ลูกค้า 34% Upsell ได้แล้ว แต่ยังเป็นรายครั้ง การเสนอ Monthly Retainer จะสร้างรายได้ที่คาดเดาได้',
        icon: '📅',
      },
      {
        priority: 'low',
        title: 'รับงานเฉพาะกลุ่ม Niche เพื่อสร้าง Expertise',
        description: 'การเป็น Expert ในด้านเดียว เช่น Social Media สำหรับร้านอาหาร จะทำให้ตั้งราคาได้สูงและ Convert ได้ง่ายขึ้น',
        icon: '🎯',
      },
    ],
  },

  COMMUNITY_SHARING: {
    category: 'COMMUNITY_SHARING',
    categoryLabel: 'Community Sharing',
    categoryEmoji: '🤝',
    performanceScore: 93,
    performanceBand: band(93),
    aiNarrative:
      'กิจกรรม Community Sharing ของคุณสร้างผลกระทบเชิงบวกในชุมชนสูงมาก ' +
      'ด้วยอัตราแลกเปลี่ยน 8.4 ครั้ง/เดือน สูงกว่าค่าเฉลี่ยชุมชนอื่นถึง 2.1 เท่า ' +
      'ผู้เข้าร่วม 78% ทั้งให้และรับบริการ สะท้อนถึงระบบนิเวศที่สมดุลและยั่งยืน ' +
      'คะแนน Community Impact 96/100 แสดงถึงการยอมรับและความไว้วางใจของชุมชนระดับสูงมาก ' +
      'โอกาสขยายคือการดึงสมาชิกใหม่ที่ยังไม่เข้าร่วม ซึ่งยังมีอีก 40% ของชุมชน',
    kpis: [
      { label: 'การแลกเปลี่ยน/เดือน',   value: '8.4', unit: 'ครั้ง', trend: 12, trendUp: true, icon: '🔄' },
      { label: 'Reciprocity Rate',       value: '78',  unit: '%',     trend: 5,  trendUp: true, icon: '⚖️' },
      { label: 'Community Impact Score', value: '96',  unit: '/100',  trend: 3,  trendUp: true, icon: '🌟' },
      { label: 'สมาชิกใหม่ที่ชักชวน',   value: '14',  unit: 'คน',    trend: 40, trendUp: true, icon: '👥' },
    ],
    recommendations: [
      {
        priority: 'high',
        title: 'จัดกิจกรรม "Community Fair" รายไตรมาส',
        description: 'งาน Fair ในชุมชนจะดึงสมาชิก 40% ที่ยังไม่เข้าร่วมให้ได้ทดลองระบบ Sharing ในบรรยากาศที่เป็นมิตร',
        icon: '🎉',
      },
      {
        priority: 'high',
        title: 'สร้าง Skill Map ของชุมชน',
        description: 'แผนที่ทักษะสมาชิกทั้งหมดช่วยให้จับคู่ Need/Offer ได้แม่นยำขึ้น ลดเวลาค้นหาและเพิ่มการแลกเปลี่ยน',
        icon: '🗺️',
      },
      {
        priority: 'medium',
        title: 'เพิ่มระบบ Time Banking',
        description: 'ระบบ Time Credit ที่ทุก 1 ชั่วโมงที่ให้ = 1 Credit ที่รับได้ จะจูงใจสมาชิกใหม่ที่ยังไม่แน่ใจ',
        icon: '🕐',
      },
      {
        priority: 'low',
        title: 'จัดทำ Newsletter ชุมชนประจำสัปดาห์',
        description: 'สรุปการแลกเปลี่ยนที่เกิดขึ้น เรื่องราว Success Story และประกาศ Need ใหม่จะสร้าง Engagement ต่อเนื่อง',
        icon: '📰',
      },
    ],
  },
}

// ── Accessor function ─────────────────────────────────────────────────────────────

export function getCategoryInsight(category: string): CategoryInsight {
  return CATEGORY_INSIGHTS[category] ?? CATEGORY_INSIGHTS['FOOD']
}

// ── Performance band color helpers ───────────────────────────────────────────────

export const PERFORMANCE_BAND_CONFIG = {
  excellent:        { label: 'ยอดเยี่ยม',         color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', ring: 'stroke-emerald-500' },
  good:             { label: 'ดี',                 color: 'text-blue-600',    bg: 'bg-blue-50',    border: 'border-blue-200',    ring: 'stroke-blue-500'    },
  fair:             { label: 'พอใช้',              color: 'text-amber-600',   bg: 'bg-amber-50',   border: 'border-amber-200',   ring: 'stroke-amber-500'   },
  needs_improvement:{ label: 'ควรปรับปรุง',        color: 'text-red-600',     bg: 'bg-red-50',     border: 'border-red-200',     ring: 'stroke-red-500'     },
} as const

export const PRIORITY_CONFIG = {
  high:   { label: 'สำคัญมาก', bg: 'bg-red-50',    text: 'text-red-700',    border: 'border-red-200',    dot: 'bg-red-500'    },
  medium: { label: 'ปานกลาง',  bg: 'bg-amber-50',  text: 'text-amber-700',  border: 'border-amber-200',  dot: 'bg-amber-400'  },
  low:    { label: 'ระยะยาว',  bg: 'bg-slate-50',  text: 'text-slate-600',  border: 'border-slate-200',  dot: 'bg-slate-400'  },
} as const

// ── All categories list (for selector) ───────────────────────────────────────────

export const ALL_CATEGORIES = [
  'FOOD', 'REPAIR', 'HOME_SERVICES', 'TUTORING', 'ELDERLY_CARE',
  'HANDMADE', 'HEALTH_WELLNESS', 'AGRICULTURE', 'FREELANCE', 'COMMUNITY_SHARING',
] as const

export type ProviderCategory = typeof ALL_CATEGORIES[number]
