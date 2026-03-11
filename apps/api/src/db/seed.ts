/**
 * Seed script for CHM development database (SQLite3).
 * Run: pnpm --filter api seed
 *
 * Seeds: platform_modules, business_templates, users, communities,
 *        community_members, providers, listings, store_markets,
 *        market_modules, store_modules
 */

import 'reflect-metadata'
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../../.env.development') })

import { DataSource } from 'typeorm'

// ─── Entity imports ──────────────────────────────────────────────────────────
import { User } from '../modules/users/entities/user.entity'
import { Community } from '../modules/communities/entities/community.entity'
import { CommunityMember } from '../modules/communities/entities/community-member.entity'
import { Provider } from '../modules/providers/entities/provider.entity'
import { Listing } from '../modules/listings/entities/listing.entity'
import { BusinessTemplate } from '../modules/business-templates/entities/business-template.entity'
import { PlatformModule } from '../modules/platform-modules/entities/platform-module.entity'
import { MarketModule } from '../modules/market-modules/entities/market-module.entity'
import { StoreMarket } from '../modules/store-markets/entities/store-market.entity'
import { StoreModule } from '../modules/store-modules/entities/store-module.entity'

// ─── DataSource ───────────────────────────────────────────────────────────────
const AppDataSource = new DataSource({
  type: 'better-sqlite3',
  database: process.env.SQLITE_PATH ?? './dev.db',
  entities: [
    User, Community, CommunityMember, Provider, Listing,
    BusinessTemplate, PlatformModule, MarketModule, StoreMarket, StoreModule,
  ],
  synchronize: true,
  logging: false,
})

// ─── Seed data ────────────────────────────────────────────────────────────────

const PLATFORM_MODULES = [
  { code: 'POS', name: 'Point of Sale (POS)', category: 'COMMERCE', isCore: false },
  { code: 'ONLINE_ORDER', name: 'Online Ordering', category: 'COMMERCE', isCore: true },
  { code: 'PROMOTIONS', name: 'Promotions & Discounts', category: 'COMMERCE', isCore: false },
  { code: 'LOYALTY', name: 'Loyalty Program', category: 'COMMERCE', isCore: false },
  { code: 'RECEIPT', name: 'Digital Receipt', category: 'COMMERCE', isCore: true },
  { code: 'CATALOG', name: 'Product Catalog', category: 'CATALOG', isCore: true },
  { code: 'INVENTORY', name: 'Inventory Management', category: 'CATALOG', isCore: false },
  { code: 'SUPPLIER', name: 'Supplier Management', category: 'CATALOG', isCore: false },
  { code: 'BOOKING', name: 'Booking & Scheduling', category: 'SERVICES', isCore: true },
  { code: 'DISPATCH', name: 'Dispatch & Delivery', category: 'SERVICES', isCore: false },
  { code: 'JOB_TRACKING', name: 'Job Tracking', category: 'SERVICES', isCore: false },
  { code: 'MARKETPLACE', name: 'Marketplace Listing', category: 'MARKETPLACE', isCore: true },
  { code: 'SEARCH', name: 'Search & Discovery', category: 'MARKETPLACE', isCore: true },
  { code: 'REVIEWS', name: 'Reviews & Ratings', category: 'MARKETPLACE', isCore: true },
  { code: 'ANNOUNCEMENTS', name: 'Community Announcements', category: 'MARKETPLACE', isCore: false },
  { code: 'EXPORT', name: 'Data Export', category: 'FINANCE', isCore: false },
  { code: 'STATEMENT', name: 'Financial Statement', category: 'FINANCE', isCore: false },
]

const BUSINESS_TEMPLATES = [
  {
    code: 'FOOD', name: 'Food & Beverage', icon: '🍱',
    description: 'ร้านอาหาร คาเฟ่ อาหารกล่อง ของหวาน เครื่องดื่ม',
    inventoryPolicy: 'COUNT',
    defaultModules: ['ONLINE_ORDER', 'CATALOG', 'INVENTORY', 'BOOKING', 'MARKETPLACE', 'SEARCH', 'REVIEWS', 'PROMOTIONS', 'RECEIPT', 'POS'],
  },
  {
    code: 'REPAIR', name: 'Repair & Maintenance', icon: '🔧',
    description: 'ช่างซ่อม งานไฟฟ้า ประปา แอร์ เครื่องใช้ไฟฟ้า',
    inventoryPolicy: 'NONE',
    defaultModules: ['BOOKING', 'JOB_TRACKING', 'MARKETPLACE', 'SEARCH', 'REVIEWS', 'RECEIPT', 'CATALOG'],
  },
  {
    code: 'HOME_SERVICES', name: 'Home Services', icon: '🏠',
    description: 'ทำความสะอาด ดูแลสวน จัดบ้าน รักษาความปลอดภัย',
    inventoryPolicy: 'NONE',
    defaultModules: ['BOOKING', 'JOB_TRACKING', 'MARKETPLACE', 'SEARCH', 'REVIEWS', 'RECEIPT', 'DISPATCH'],
  },
  {
    code: 'TUTORING', name: 'Education & Tutoring', icon: '📚',
    description: 'สอนพิเศษ ติวเตอร์ คลาสออนไลน์ ฝึกอบรม',
    inventoryPolicy: 'NONE',
    defaultModules: ['BOOKING', 'MARKETPLACE', 'SEARCH', 'REVIEWS', 'RECEIPT', 'CATALOG', 'ANNOUNCEMENTS'],
  },
  {
    code: 'ELDERLY_CARE', name: 'Elderly & Patient Care', icon: '👵',
    description: 'ดูแลผู้สูงอายุ ผู้ป่วย พยาบาลเกษียณ กายภาพบำบัด',
    inventoryPolicy: 'NONE',
    defaultModules: ['BOOKING', 'JOB_TRACKING', 'MARKETPLACE', 'SEARCH', 'REVIEWS', 'RECEIPT'],
  },
  {
    code: 'HANDMADE', name: 'Handmade & Crafts', icon: '🎨',
    description: 'งานฝีมือ หัตถกรรม OTOP สินค้าท้องถิ่น ของที่ระลึก',
    inventoryPolicy: 'COUNT',
    defaultModules: ['CATALOG', 'INVENTORY', 'MARKETPLACE', 'SEARCH', 'REVIEWS', 'ONLINE_ORDER', 'RECEIPT', 'PROMOTIONS'],
  },
  {
    code: 'HEALTH_WELLNESS', name: 'Health & Wellness', icon: '💆',
    description: 'นวด สปา โยคะ ฟิตเนส อาหารสุขภาพ ความงาม',
    inventoryPolicy: 'NONE',
    defaultModules: ['BOOKING', 'MARKETPLACE', 'SEARCH', 'REVIEWS', 'RECEIPT', 'LOYALTY', 'PROMOTIONS'],
  },
  {
    code: 'AGRICULTURE', name: 'Agriculture & Farming', icon: '🌿',
    description: 'เกษตรอินทรีย์ ผักสวนครัว ผลไม้ ปศุสัตว์ ส่งตรงผู้บริโภค',
    inventoryPolicy: 'COUNT',
    defaultModules: ['CATALOG', 'INVENTORY', 'MARKETPLACE', 'SEARCH', 'REVIEWS', 'ONLINE_ORDER', 'RECEIPT'],
  },
  {
    code: 'FREELANCE', name: 'Freelance & Digital', icon: '💻',
    description: 'ออกแบบ เขียนโค้ด เขียนคอนเทนต์ SEO ถ่ายภาพ วิดีโอ',
    inventoryPolicy: 'NONE',
    defaultModules: ['CATALOG', 'MARKETPLACE', 'SEARCH', 'REVIEWS', 'RECEIPT', 'BOOKING', 'ANNOUNCEMENTS'],
  },
  {
    code: 'COMMUNITY_SHARING', name: 'Community Sharing', icon: '🤝',
    description: 'ยืม-คืนอุปกรณ์ แบ่งปันทรัพยากร เศรษฐกิจหมุนเวียน',
    inventoryPolicy: 'COUNT',
    defaultModules: ['CATALOG', 'INVENTORY', 'MARKETPLACE', 'SEARCH', 'REVIEWS', 'BOOKING', 'ANNOUNCEMENTS'],
  },
]

// 25 communities derived from mock-communities-data.ts
const COMMUNITIES_DATA = [
  { id: '1', name: 'หมู่บ้านศรีนคร', slug: 'ban-srinakorn', area: 'บางแค, กรุงเทพฯ', adminName: 'คุณประเสริฐ วงศ์สมบัติ', commissionRate: 5, revenueShareRate: 40, trial: true },
  { id: '2', name: 'คอนโด The Base', slug: 'condo-the-base', area: 'ลาดพร้าว, กรุงเทพฯ', adminName: 'คุณสุนิสา ศรีสุวรรณ', commissionRate: 5, revenueShareRate: 40, trial: true },
  { id: '3', name: 'ชุมชนเมืองทอง', slug: 'mueang-thong', area: 'เมืองทอง, นนทบุรี', adminName: 'คุณวิรัตน์ ตั้งใจดี', commissionRate: 8, revenueShareRate: 40, trial: false },
  { id: '4', name: 'หมู่บ้านกรีนวิลล์', slug: 'green-ville', area: 'บึงกุ่ม, กรุงเทพฯ', adminName: 'คุณปรัชญา เขียวสด', commissionRate: 5, revenueShareRate: 40, trial: true },
  { id: '5', name: 'ชุมชนริมน้ำ', slug: 'rim-nam', area: 'ปทุมธานี', adminName: 'คุณทองคำ เกษตรกร', commissionRate: 5, revenueShareRate: 35, trial: true },
  { id: '6', name: 'เมืองเชียงใหม่ซิตี้', slug: 'chiangmai-city', area: 'เมือง, เชียงใหม่', adminName: 'คุณชาญชัย ล้านนา', commissionRate: 8, revenueShareRate: 45, trial: false },
  { id: '7', name: 'นิมมานเฮมิน วิลเลจ', slug: 'nimman-village', area: 'นิมมานเฮมิน, เชียงใหม่', adminName: 'คุณอรุณี พฤกษา', commissionRate: 7, revenueShareRate: 40, trial: false },
  { id: '8', name: 'เกาะสมุย รีสอร์ท', slug: 'koh-samui', area: 'เกาะสมุย, สุราษฎร์ธานี', adminName: 'คุณธนากร ทะเลสวย', commissionRate: 10, revenueShareRate: 50, trial: false },
  { id: '9', name: 'ชุมชนขอนแก่น', slug: 'khon-kaen', area: 'เมือง, ขอนแก่น', adminName: 'คุณสมชาย อีสาน', commissionRate: 5, revenueShareRate: 40, trial: true },
  { id: '10', name: 'หาดใหญ่ซิตี้', slug: 'hatyai-city', area: 'หาดใหญ่, สงขลา', adminName: 'คุณมาลีรัตน์ ใต้สุข', commissionRate: 6, revenueShareRate: 40, trial: false },
  { id: '11', name: 'สุขุมวิท พาร์ค', slug: 'sukhumvit-park', area: 'สุขุมวิท, กรุงเทพฯ', adminName: 'คุณณัฐพล เมืองหลวง', commissionRate: 8, revenueShareRate: 45, trial: false },
  { id: '12', name: 'เชียงราย เฮ้าส์', slug: 'chiangrai', area: 'เมือง, เชียงราย', adminName: 'คุณกฤษฎา ดอยหลวง', commissionRate: 5, revenueShareRate: 40, trial: true },
  { id: '13', name: 'ภูเก็ต เบย์ วิว', slug: 'phuket-bay', area: 'เมือง, ภูเก็ต', adminName: 'คุณวิไล อันดามัน', commissionRate: 10, revenueShareRate: 50, trial: false },
  { id: '14', name: 'อยุธยา เฮอริเทจ', slug: 'ayutthaya', area: 'พระนครศรีอยุธยา', adminName: 'คุณประวิทย์ โบราณ', commissionRate: 5, revenueShareRate: 40, trial: true },
  { id: '15', name: 'หัวหิน บีช ทาวน์', slug: 'hua-hin', area: 'หัวหิน, ประจวบคีรีขันธ์', adminName: 'คุณสุกัญญา ทะเล', commissionRate: 7, revenueShareRate: 40, trial: false },
  { id: '16', name: 'พัทยา รีสอร์ท', slug: 'pattaya', area: 'พัทยา, ชลบุรี', adminName: 'คุณจิรายุ ชลบุรี', commissionRate: 8, revenueShareRate: 45, trial: false },
  { id: '17', name: 'อุดรธานี เกต', slug: 'udon-thani', area: 'เมือง, อุดรธานี', adminName: 'คุณเพชรอุดร วัฒนา', commissionRate: 5, revenueShareRate: 40, trial: true },
  { id: '18', name: 'นครราชสีมา โคราช', slug: 'nakhon-ratchasima', area: 'เมือง, นครราชสีมา', adminName: 'คุณสุดา โคราช', commissionRate: 5, revenueShareRate: 40, trial: true },
  { id: '19', name: 'สุพรรณบุรี ดรีม', slug: 'suphan-buri', area: 'เมือง, สุพรรณบุรี', adminName: 'คุณมงคล สุพรรณ', commissionRate: 5, revenueShareRate: 35, trial: true },
  { id: '20', name: 'บางใหญ่ ซิตี้', slug: 'bang-yai', area: 'บางใหญ่, นนทบุรี', adminName: 'คุณรัตนา นนทบุรี', commissionRate: 6, revenueShareRate: 40, trial: false },
  { id: '21', name: 'ลำปาง เฮอริเทจ', slug: 'lampang', area: 'เมือง, ลำปาง', adminName: 'คุณชวนพิศ รถม้า', commissionRate: 5, revenueShareRate: 40, trial: true },
  { id: '22', name: 'นครสวรรค์ เกต', slug: 'nakhon-sawan', area: 'เมือง, นครสวรรค์', adminName: 'คุณศักดิ์ชัย สวรรค์', commissionRate: 5, revenueShareRate: 35, trial: true },
  { id: '23', name: 'สงขลา เลคไซด์', slug: 'songkhla', area: 'เมือง, สงขลา', adminName: 'คุณนฤมล สงขลา', commissionRate: 5, revenueShareRate: 40, trial: true },
  { id: '24', name: 'ระยอง บีช', slug: 'rayong', area: 'เมือง, ระยอง', adminName: 'คุณวรรณา ระยอง', commissionRate: 6, revenueShareRate: 40, trial: false },
  { id: '25', name: 'กาญจนบุรี เนเจอร์', slug: 'kanchanaburi', area: 'เมือง, กาญจนบุรี', adminName: 'คุณไพรัตน์ ป่าไม้', commissionRate: 5, revenueShareRate: 40, trial: true },
]

// 25 providers from mock-providers.ts (condensed)
const PROVIDERS_DATA = [
  { idx: 1, name: 'คุณแม่สมใจ', avatar: '👩‍🍳', category: 'FOOD', template: 'FOOD', trustScore: 0.98, rating: 4.9, communityIdx: 1, extraCommunities: [] },
  { idx: 2, name: 'ช่างสมชาย', avatar: '👨‍🔧', category: 'REPAIR', template: 'REPAIR', trustScore: 0.92, rating: 4.8, communityIdx: 1, extraCommunities: [] },
  { idx: 3, name: 'ครูน้องใหม่', avatar: '👩‍🏫', category: 'TUTORING', template: 'TUTORING', trustScore: 0.95, rating: 5.0, communityIdx: 2, extraCommunities: [] },
  { idx: 4, name: 'บริษัท Clean Home', avatar: '🧹', category: 'HOME_SERVICES', template: 'HOME_SERVICES', trustScore: 0.96, rating: 4.7, communityIdx: 2, extraCommunities: [3, 11] },
  { idx: 5, name: 'คุณสมศรี', avatar: '👩‍⚕️', category: 'ELDERLY_CARE', template: 'ELDERLY_CARE', trustScore: 0.75, rating: 4.9, communityIdx: 3, extraCommunities: [] },
  { idx: 6, name: 'ร้านป้าแดง', avatar: '👩‍🎨', category: 'HANDMADE', template: 'HANDMADE', trustScore: 0.88, rating: 4.8, communityIdx: 6, extraCommunities: [12] },
  { idx: 7, name: 'หมอนวดประเสริฐ', avatar: '🧘', category: 'HEALTH_WELLNESS', template: 'HEALTH_WELLNESS', trustScore: 0.97, rating: 4.9, communityIdx: 4, extraCommunities: [10] },
  { idx: 8, name: 'สวนคุณลุงทอง', avatar: '👨‍🌾', category: 'AGRICULTURE', template: 'AGRICULTURE', trustScore: 0.80, rating: 4.7, communityIdx: 5, extraCommunities: [9] },
  { idx: 9, name: 'ดีไซเนอร์เอ', avatar: '👨‍💻', category: 'FREELANCE', template: 'FREELANCE', trustScore: 0.90, rating: 4.8, communityIdx: 2, extraCommunities: [7, 11] },
  { idx: 10, name: 'Community Pool', avatar: '🤝', category: 'COMMUNITY_SHARING', template: 'COMMUNITY_SHARING', trustScore: 0.72, rating: 4.6, communityIdx: 3, extraCommunities: [] },
  { idx: 11, name: 'ช่างวิชัย', avatar: '🔧', category: 'REPAIR', template: 'REPAIR', trustScore: 0.89, rating: 4.6, communityIdx: 1, extraCommunities: [] },
  { idx: 12, name: 'ครัวคลีนคลีน', avatar: '👩‍🍳', category: 'FOOD', template: 'FOOD', trustScore: 0.94, rating: 4.9, communityIdx: 2, extraCommunities: [11] },
  { idx: 13, name: 'เชฟนุ้ย ครัวเหนือ', avatar: '👨‍🍳', category: 'FOOD', template: 'FOOD', trustScore: 0.91, rating: 4.8, communityIdx: 6, extraCommunities: [] },
  { idx: 14, name: 'สปาล้านนา', avatar: '🌸', category: 'HEALTH_WELLNESS', template: 'HEALTH_WELLNESS', trustScore: 0.93, rating: 4.9, communityIdx: 7, extraCommunities: [15] },
  { idx: 15, name: 'ไกด์นุ ดอยสุเทพ', avatar: '🏔️', category: 'FREELANCE', template: 'FREELANCE', trustScore: 0.85, rating: 4.7, communityIdx: 6, extraCommunities: [] },
  { idx: 16, name: 'แม่บ้านสาวิตรี', avatar: '🧹', category: 'HOME_SERVICES', template: 'HOME_SERVICES', trustScore: 0.82, rating: 4.7, communityIdx: 8, extraCommunities: [] },
  { idx: 17, name: 'ช่างไฟหนุ่ม', avatar: '⚡', category: 'REPAIR', template: 'REPAIR', trustScore: 0.86, rating: 4.7, communityIdx: 9, extraCommunities: [] },
  { idx: 18, name: 'ร้านขนมไทยคุณยาย', avatar: '🍮', category: 'FOOD', template: 'FOOD', trustScore: 0.78, rating: 4.6, communityIdx: 10, extraCommunities: [] },
  { idx: 19, name: 'ช่างไฟวิมล', avatar: '⚡', category: 'REPAIR', template: 'REPAIR', trustScore: 0.87, rating: 4.7, communityIdx: 6, extraCommunities: [] },
  { idx: 20, name: 'สวนสวยบางใหญ่', avatar: '🌳', category: 'HOME_SERVICES', template: 'HOME_SERVICES', trustScore: 0.84, rating: 4.6, communityIdx: 20, extraCommunities: [3, 4] },
  { idx: 21, name: 'ครูสอนโยคะ', avatar: '🧘‍♀️', category: 'HEALTH_WELLNESS', template: 'HEALTH_WELLNESS', trustScore: 0.88, rating: 4.8, communityIdx: 13, extraCommunities: [] },
  { idx: 22, name: 'เกษตรอินทรีย์อีสาน', avatar: '🌾', category: 'AGRICULTURE', template: 'AGRICULTURE', trustScore: 0.76, rating: 4.5, communityIdx: 17, extraCommunities: [9] },
  { idx: 23, name: 'ช่างซ่อมเกาะสมุย', avatar: '🔧', category: 'REPAIR', template: 'REPAIR', trustScore: 0.81, rating: 4.6, communityIdx: 8, extraCommunities: [] },
  { idx: 24, name: 'ฟรีแลนซ์โค้ด', avatar: '💻', category: 'FREELANCE', template: 'FREELANCE', trustScore: 0.92, rating: 4.8, communityIdx: 11, extraCommunities: [] },
  { idx: 25, name: 'ตลาดชุมชนระยอง', avatar: '🛒', category: 'COMMUNITY_SHARING', template: 'COMMUNITY_SHARING', trustScore: 0.77, rating: 4.5, communityIdx: 24, extraCommunities: [] },
]

// 25 listings from mock-listings.ts (condensed)
const LISTINGS_DATA = [
  { idx: 1, providerIdx: 1, title: 'ทำอาหารกล่องส่งถึงที่', category: 'FOOD', price: 80, unit: 'กล่อง', image: '🍱', isPromoted: true, tags: ['ข้าว', 'ส้มตำ', 'อาหารตามสั่ง'], availableDays: [0,1,2,3,4], openTime: '07:00', closeTime: '17:00', lat: 13.726, lng: 100.482 },
  { idx: 2, providerIdx: 2, title: 'ซ่อมแอร์บ้าน ล้างแอร์', category: 'REPAIR', price: 500, unit: 'ครั้ง', image: '🔧', isPromoted: false, tags: ['แอร์', 'ซ่อม', 'ล้าง'], availableDays: [0,1,2,3,4,5], openTime: '08:00', closeTime: '18:00', lat: 13.721, lng: 100.487 },
  { idx: 3, providerIdx: 3, title: 'สอนภาษาอังกฤษเด็กประถม', category: 'TUTORING', price: 300, unit: 'ชั่วโมง', image: '📚', isPromoted: true, tags: ['ภาษาอังกฤษ', 'ประถม'], availableDays: [1,2,3,4,5,6], openTime: '14:00', closeTime: '20:00', lat: 13.729, lng: 100.479 },
  { idx: 4, providerIdx: 4, title: 'ทำความสะอาดบ้านรายวัน', category: 'HOME_SERVICES', price: 800, unit: 'ครั้ง', image: '🏠', isPromoted: false, tags: ['บ้าน', 'คอนโด', 'รายวัน'], availableDays: [0,1,2,3,4,5], openTime: '08:00', closeTime: '17:00', lat: 13.724, lng: 100.490 },
  { idx: 5, providerIdx: 5, title: 'ดูแลผู้สูงอายุกลางวัน', category: 'ELDERLY_CARE', price: 1200, unit: 'วัน', image: '👴', isPromoted: false, tags: ['ผู้สูงอายุ', 'ดูแล'], availableDays: [0,1,2,3,4], openTime: '08:00', closeTime: '17:00', lat: 13.875, lng: 100.520 },
  { idx: 6, providerIdx: 6, title: 'กระเป๋าผ้าทอมือ handmade', category: 'HANDMADE', price: 350, unit: 'ใบ', image: '🎨', isPromoted: true, tags: ['ผ้าทอ', 'OTOP', 'ของที่ระลึก'], availableDays: [0,1,2,3,4,5,6], openTime: '09:00', closeTime: '18:00', lat: 18.787, lng: 98.993 },
  { idx: 7, providerIdx: 7, title: 'นวดแผนไทย ออกนอกสถานที่', category: 'HEALTH_WELLNESS', price: 400, unit: 'ชั่วโมง', image: '💆', isPromoted: false, tags: ['นวด', 'แผนไทย', 'ออกนอกสถานที่'], availableDays: [1,2,3,4,5,6], openTime: '10:00', closeTime: '21:00', lat: 13.813, lng: 100.617 },
  { idx: 8, providerIdx: 8, title: 'ผักออร์แกนิคส่งรายสัปดาห์', category: 'AGRICULTURE', price: 250, unit: 'ชุด', image: '🌿', isPromoted: false, tags: ['ผักออร์แกนิค', 'ส่งถึงบ้าน'], availableDays: [0,3,6], openTime: '06:00', closeTime: '10:00', lat: 14.012, lng: 100.524 },
  { idx: 9, providerIdx: 9, title: 'ออกแบบ Logo & Brand Identity', category: 'FREELANCE', price: 3500, unit: 'งาน', image: '💻', isPromoted: true, tags: ['โลโก้', 'ออกแบบ', 'Brand'], availableDays: [0,1,2,3,4], openTime: '09:00', closeTime: '18:00', lat: 13.764, lng: 100.538 },
  { idx: 10, providerIdx: 10, title: 'ยืม-คืนอุปกรณ์ทำครัว', category: 'COMMUNITY_SHARING', price: 50, unit: 'วัน', image: '🤝', isPromoted: false, tags: ['ยืม', 'อุปกรณ์', 'ชุมชน'], availableDays: [0,1,2,3,4,5,6], openTime: '08:00', closeTime: '20:00', lat: 13.884, lng: 100.527 },
  { idx: 11, providerIdx: 11, title: 'ซ่อมท่อน้ำ-ประปา', category: 'REPAIR', price: 400, unit: 'ครั้ง', image: '🔧', isPromoted: false, tags: ['ประปา', 'ซ่อม', 'ด่วน'], availableDays: [0,1,2,3,4,5], openTime: '07:00', closeTime: '19:00', lat: 13.732, lng: 100.476 },
  { idx: 12, providerIdx: 12, title: 'อาหารคลีนออเดอร์ล่วงหน้า', category: 'FOOD', price: 120, unit: 'กล่อง', image: '🥗', isPromoted: false, tags: ['คลีน', 'สุขภาพ', 'คาโลรี่'], availableDays: [0,1,2,3,4], openTime: '08:00', closeTime: '14:00', lat: 13.768, lng: 100.542 },
  { idx: 13, providerIdx: 13, title: 'คลาสทำอาหารเหนือ เชียงใหม่', category: 'FOOD', price: 800, unit: 'คน', image: '🫕', isPromoted: false, tags: ['คลาส', 'อาหารเหนือ', 'ท่องเที่ยว'], availableDays: [2,4,6,0], openTime: '09:00', closeTime: '14:00', lat: 18.790, lng: 99.000 },
  { idx: 14, providerIdx: 14, title: 'สปานวดล้านนา อโรมาเทอราพี', category: 'HEALTH_WELLNESS', price: 1200, unit: 'ชั่วโมง', image: '🌺', isPromoted: true, tags: ['สปา', 'นวด', 'อโรมา'], availableDays: [0,1,2,3,4,5,6], openTime: '10:00', closeTime: '21:00', lat: 18.793, lng: 99.008 },
  { idx: 15, providerIdx: 15, title: 'ไกด์เดินป่าดอยสุเทพ', category: 'FREELANCE', price: 600, unit: 'คน', image: '⛰️', isPromoted: false, tags: ['ไกด์', 'เดินป่า', 'ท่องเที่ยว'], availableDays: [0,3,6], openTime: '06:00', closeTime: '16:00', lat: 18.805, lng: 98.921 },
  { idx: 16, providerIdx: 16, title: 'บริการแม่บ้านเกาะสมุย', category: 'HOME_SERVICES', price: 900, unit: 'ครั้ง', image: '🏡', isPromoted: false, tags: ['แม่บ้าน', 'เกาะสมุย', 'สะอาด'], availableDays: [0,1,2,3,4,5], openTime: '08:00', closeTime: '17:00', lat: 9.540, lng: 100.069 },
  { idx: 17, providerIdx: 17, title: 'ซ่อมไฟฟ้าบ้าน ขอนแก่น', category: 'REPAIR', price: 350, unit: 'ครั้ง', image: '⚡', isPromoted: false, tags: ['ไฟฟ้า', 'ซ่อม', 'ขอนแก่น'], availableDays: [0,1,2,3,4,5], openTime: '08:00', closeTime: '18:00', lat: 16.432, lng: 102.828 },
  { idx: 18, providerIdx: 18, title: 'ขนมไทยโบราณ สั่งทำ', category: 'FOOD', price: 200, unit: 'กล่อง', image: '🍮', isPromoted: false, tags: ['ขนมไทย', 'โบราณ', 'สั่งทำ'], availableDays: [0,1,2,3,4,5,6], openTime: '09:00', closeTime: '17:00', lat: 7.008, lng: 100.473 },
  { idx: 19, providerIdx: 19, title: 'ช่างไฟมืออาชีพ เชียงใหม่', category: 'REPAIR', price: 450, unit: 'ครั้ง', image: '⚡', isPromoted: false, tags: ['ช่างไฟ', 'มืออาชีพ', 'เชียงใหม่'], availableDays: [0,1,2,3,4,5], openTime: '08:00', closeTime: '18:00', lat: 18.800, lng: 98.980 },
  { idx: 20, providerIdx: 20, title: 'จัดสวน ดูแลต้นไม้', category: 'HOME_SERVICES', price: 800, unit: 'ครั้ง', image: '🌳', isPromoted: false, tags: ['สวน', 'ต้นไม้', 'ดูแล'], availableDays: [0,1,2,3,4,5], openTime: '07:00', closeTime: '17:00', lat: 13.898, lng: 100.394 },
  { idx: 21, providerIdx: 21, title: 'คลาสโยคะส่วนตัว ภูเก็ต', category: 'HEALTH_WELLNESS', price: 500, unit: 'ชั่วโมง', image: '🧘‍♀️', isPromoted: false, tags: ['โยคะ', 'ภูเก็ต', 'สุขภาพ'], availableDays: [0,1,2,3,4,5,6], openTime: '07:00', closeTime: '20:00', lat: 7.879, lng: 98.390 },
  { idx: 22, providerIdx: 22, title: 'ผักอีสานสด ส่งรายสัปดาห์', category: 'AGRICULTURE', price: 180, unit: 'ชุด', image: '🌾', isPromoted: false, tags: ['ผักอีสาน', 'ออร์แกนิค', 'ส่งบ้าน'], availableDays: [0,3,6], openTime: '06:00', closeTime: '10:00', lat: 17.408, lng: 102.787 },
  { idx: 23, providerIdx: 23, title: 'ซ่อมเครื่องใช้ไฟฟ้า เกาะสมุย', category: 'REPAIR', price: 600, unit: 'ครั้ง', image: '🔌', isPromoted: false, tags: ['ช่างซ่อม', 'เครื่องใช้ไฟฟ้า', 'เกาะสมุย'], availableDays: [0,1,2,3,4,5], openTime: '09:00', closeTime: '18:00', lat: 9.535, lng: 100.063 },
  { idx: 24, providerIdx: 24, title: 'พัฒนา App / Website', category: 'FREELANCE', price: 15000, unit: 'โปรเจค', image: '💻', isPromoted: true, tags: ['App', 'Website', 'Next.js'], availableDays: [0,1,2,3,4], openTime: '09:00', closeTime: '18:00', lat: 13.756, lng: 100.563 },
  { idx: 25, providerIdx: 25, title: 'ตลาดนัดชุมชนระยอง', category: 'COMMUNITY_SHARING', price: 100, unit: 'บูธ', image: '🛒', isPromoted: false, tags: ['ตลาดนัด', 'ชุมชน', 'ระยอง'], availableDays: [0,6], openTime: '07:00', closeTime: '12:00', lat: 12.680, lng: 101.282 },
]

// ─── Main seed function ───────────────────────────────────────────────────────

async function seed() {
  console.log('🌱 Connecting to database...')
  await AppDataSource.initialize()
  console.log('✅ Connected to', process.env.SQLITE_PATH ?? './dev.db')

  const userRepo = AppDataSource.getRepository(User)
  const communityRepo = AppDataSource.getRepository(Community)
  const memberRepo = AppDataSource.getRepository(CommunityMember)
  const providerRepo = AppDataSource.getRepository(Provider)
  const listingRepo = AppDataSource.getRepository(Listing)
  const btRepo = AppDataSource.getRepository(BusinessTemplate)
  const pmRepo = AppDataSource.getRepository(PlatformModule)
  const mmRepo = AppDataSource.getRepository(MarketModule)
  const smRepo = AppDataSource.getRepository(StoreMarket)
  const stoModRepo = AppDataSource.getRepository(StoreModule)

  // ── 1. Platform Modules ──────────────────────────────────────────────────
  console.log('\n📦 Seeding platform modules...')
  const savedModules: PlatformModule[] = []
  for (const m of PLATFORM_MODULES) {
    const existing = await pmRepo.findOne({ where: { code: m.code } })
    if (existing) { savedModules.push(existing); continue }
    const saved = await pmRepo.save(pmRepo.create({ ...m, isActive: true }))
    savedModules.push(saved)
    process.stdout.write('.')
  }
  console.log(`\n  ✅ ${savedModules.length} platform modules`)

  // ── 2. Business Templates ────────────────────────────────────────────────
  console.log('\n📋 Seeding business templates...')
  for (const bt of BUSINESS_TEMPLATES) {
    const existing = await btRepo.findOne({ where: { code: bt.code } })
    if (existing) continue
    await btRepo.save(btRepo.create({
      code: bt.code, name: bt.name, icon: bt.icon,
      description: bt.description, inventoryPolicy: bt.inventoryPolicy,
      defaultModules: bt.defaultModules,
    }))
    process.stdout.write('.')
  }
  console.log(`\n  ✅ ${BUSINESS_TEMPLATES.length} business templates`)

  // ── 3. Super Admin User ──────────────────────────────────────────────────
  console.log('\n👑 Seeding super admin...')
  let saUser = await userRepo.findOne({ where: { email: 'sa@chm.dev' } })
  if (!saUser) {
    saUser = await userRepo.save(userRepo.create({
      email: 'sa@chm.dev', displayName: 'Super Admin',
      role: 'SUPER_ADMIN' as any, loginProvider: 'local', isActive: true,
    }))
    console.log('  ✅ sa@chm.dev created')
  } else {
    console.log('  ✓ sa@chm.dev already exists')
  }

  // ── 4. Communities + Admin Users ─────────────────────────────────────────
  console.log('\n🏘️  Seeding communities + admin users...')
  const communityIdMap: Record<string, string> = {} // idx → db UUID
  const adminUserMap: Record<string, User> = {}

  for (const cd of COMMUNITIES_DATA) {
    const email = `admin-c${cd.id}@chm.dev`

    // Admin user
    let adminUser = await userRepo.findOne({ where: { email } })
    if (!adminUser) {
      adminUser = await userRepo.save(userRepo.create({
        email, displayName: cd.adminName,
        role: 'COMMUNITY_ADMIN' as any, loginProvider: 'local', isActive: true,
      }))
    }
    adminUserMap[cd.id] = adminUser

    // Community
    let community = await communityRepo.findOne({ where: { slug: cd.slug } })
    if (!community) {
      community = await communityRepo.save(communityRepo.create({
        name: cd.name, slug: cd.slug, adminId: adminUser.id,
        commissionRate: cd.commissionRate, revenueShareRate: cd.revenueShareRate,
        isActive: true, planType: 'STARTER',
        trialStatus: cd.trial ? 'ACTIVE' : 'NOT_STARTED' as any,
        trialStartDate: cd.trial ? new Date('2026-01-01') : undefined,
        trialEndDate: cd.trial ? new Date('2026-04-30') : undefined,
      }))
    }
    communityIdMap[cd.id] = community.id

    // Admin as community member
    const existingMember = await memberRepo.findOne({ where: { communityId: community.id, userId: adminUser.id } })
    if (!existingMember) {
      await memberRepo.save(memberRepo.create({
        communityId: community.id, userId: adminUser.id,
        role: 'ADMIN' as any, approvalStatus: 'APPROVED' as any,
      }))
    }
    process.stdout.write('.')
  }
  console.log(`\n  ✅ ${COMMUNITIES_DATA.length} communities + admin users`)

  // ── 5. Provider Users + Provider + StoreMarket ───────────────────────────
  console.log('\n🏪 Seeding providers + store markets...')
  const providerIdMap: Record<number, string> = {} // idx → db UUID

  for (const pd of PROVIDERS_DATA) {
    const email = `provider-${pd.idx}@chm.dev`
    const mainCommunityDbId = communityIdMap[String(pd.communityIdx)]

    // Provider user
    let provUser = await userRepo.findOne({ where: { email } })
    if (!provUser) {
      provUser = await userRepo.save(userRepo.create({
        email, displayName: pd.name,
        role: 'PROVIDER' as any, loginProvider: 'local', isActive: true,
      }))
    }

    // Provider profile
    let provider = await providerRepo.findOne({ where: { userId: provUser.id, communityId: mainCommunityDbId } })
    if (!provider) {
      provider = await providerRepo.save(providerRepo.create({
        userId: provUser.id, communityId: mainCommunityDbId,
        displayName: pd.name, bio: `${pd.avatar} ผู้ให้บริการหมวด${pd.category}`,
        trustScore: pd.trustScore, averageRating: pd.rating, isActive: true,
        verificationStatus: 'APPROVED' as any, providerStatus: 'ACTIVE' as any,
        businessTemplateCode: pd.template,
      }))
    }
    providerIdMap[pd.idx] = provider.id

    // Provider as community member (main)
    const existingMember = await memberRepo.findOne({ where: { communityId: mainCommunityDbId, userId: provUser.id } })
    if (!existingMember) {
      await memberRepo.save(memberRepo.create({
        communityId: mainCommunityDbId, userId: provUser.id,
        role: 'MEMBER' as any, approvalStatus: 'APPROVED' as any,
      }))
    }

    // StoreMarket: main branch
    const existingMain = await smRepo.findOne({ where: { storeId: provider.id, marketId: mainCommunityDbId } })
    if (!existingMain) {
      await smRepo.save(smRepo.create({ storeId: provider.id, marketId: mainCommunityDbId, isMainBranch: true, status: 'ACTIVE' }))
    }

    // StoreMarket: extra branches
    for (const extraCidx of pd.extraCommunities) {
      const extraDbId = communityIdMap[String(extraCidx)]
      if (!extraDbId) continue
      const existingExtra = await smRepo.findOne({ where: { storeId: provider.id, marketId: extraDbId } })
      if (!existingExtra) {
        await smRepo.save(smRepo.create({ storeId: provider.id, marketId: extraDbId, isMainBranch: false, status: 'ACTIVE' }))
      }
    }

    process.stdout.write('.')
  }
  console.log(`\n  ✅ ${PROVIDERS_DATA.length} providers + store markets`)

  // ── 6. Listings ──────────────────────────────────────────────────────────
  console.log('\n📝 Seeding listings...')
  for (const ld of LISTINGS_DATA) {
    const providerDbId = providerIdMap[ld.providerIdx]
    const pd = PROVIDERS_DATA.find(p => p.idx === ld.providerIdx)!
    const communityDbId = communityIdMap[String(pd.communityIdx)]

    const existingListing = await listingRepo.findOne({ where: { providerId: providerDbId, title: ld.title } })
    if (!existingListing) {
      await listingRepo.save(listingRepo.create({
        providerId: providerDbId,
        communityId: communityDbId,
        title: ld.title,
        description: `บริการ${ld.title} โดย ${pd.name}`,
        category: ld.category as any,
        price: ld.price,
        priceUnit: ld.unit,
        status: 'ACTIVE' as any,
        images: [ld.image],
        isPromoted: ld.isPromoted,
        tags: ld.tags,
        availableDays: ld.availableDays,
        openTime: ld.openTime,
        closeTime: ld.closeTime,
        locationLat: ld.lat,
        locationLng: ld.lng,
      }))
    }
    process.stdout.write('.')
  }
  console.log(`\n  ✅ ${LISTINGS_DATA.length} listings`)

  // ── 7. Market Modules (enable ALL for ALL communities) ───────────────────
  console.log('\n🔌 Seeding market modules...')
  let mmCount = 0
  for (const cd of COMMUNITIES_DATA) {
    const marketDbId = communityIdMap[cd.id]
    for (const pm of savedModules) {
      const existing = await mmRepo.findOne({ where: { marketId: marketDbId, moduleId: pm.id } })
      if (!existing) {
        await mmRepo.save(mmRepo.create({ marketId: marketDbId, moduleId: pm.id, isEnabled: true, enabledBy: saUser.id }))
        mmCount++
      }
    }
  }
  console.log(`  ✅ ${mmCount} market-module entries`)

  // ── 8. Store Modules (enable ALL for ALL providers) ──────────────────────
  console.log('\n🔧 Seeding store modules...')
  let stoModCount = 0
  for (const pd of PROVIDERS_DATA) {
    const provDbId = providerIdMap[pd.idx]
    for (const pm of savedModules) {
      const existing = await stoModRepo.findOne({ where: { storeId: provDbId, moduleId: pm.id } })
      if (!existing) {
        await stoModRepo.save(stoModRepo.create({ storeId: provDbId, moduleId: pm.id, isEnabled: true }))
        stoModCount++
      }
    }
  }
  console.log(`  ✅ ${stoModCount} store-module entries`)

  // ── Done ─────────────────────────────────────────────────────────────────
  console.log('\n🎉 Seed complete!')
  console.log(`   Platform modules: ${savedModules.length}`)
  console.log(`   Business templates: ${BUSINESS_TEMPLATES.length}`)
  console.log(`   Communities: ${COMMUNITIES_DATA.length}`)
  console.log(`   Providers: ${PROVIDERS_DATA.length}`)
  console.log(`   Listings: ${LISTINGS_DATA.length}`)
  console.log(`   Market-module entries: ${mmCount}`)
  console.log(`   Store-module entries: ${stoModCount}`)

  await AppDataSource.destroy()
}

seed().catch(err => {
  console.error('❌ Seed failed:', err)
  process.exit(1)
})
