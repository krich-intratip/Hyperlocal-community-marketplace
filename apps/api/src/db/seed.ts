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
import { SystemConfig } from '../modules/system/entities/system-config.entity'
import { ReturnRequest } from '../modules/returns/entities/return-request.entity'

// ─── DataSource ───────────────────────────────────────────────────────────────
const AppDataSource = new DataSource({
  type: 'better-sqlite3',
  database: process.env.SQLITE_PATH ?? './dev.db',
  entities: [
    User, Community, CommunityMember, Provider, Listing,
    BusinessTemplate, PlatformModule, MarketModule, StoreMarket, StoreModule, SystemConfig,
    ReturnRequest,
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

// 25 communities — names, IDs, and settings match the web app canonical data
const COMMUNITIES_DATA = [
  { id: '1',  name: 'หมู่บ้านศรีนคร',       slug: 'ban-srinakorn',     adminName: 'คุณประเสริฐ วงศ์สมบัติ', commissionRate: 5,  revenueShareRate: 40, trial: true,  settings: { type: 'village', province: 'กรุงเทพฯ',       area: 'บางแค, กรุงเทพฯ',       lat: 13.7200, lng: 100.4200, emoji: '🏘️', tags: ['อาหาร', 'งานช่าง', 'งานบ้าน'],            rating: 4.8, serviceRadius: 5,  memberCount: 342,  providerCount: 34,  trialEndText: '30 เม.ย. 2569' } },
  { id: '2',  name: 'คอนโด The Base',        slug: 'condo-the-base',    adminName: 'คุณสุนิสา ศรีสุวรรณ',   commissionRate: 5,  revenueShareRate: 40, trial: true,  settings: { type: 'condo',   province: 'กรุงเทพฯ',       area: 'ลาดพร้าว, กรุงเทพฯ',    lat: 13.8150, lng: 100.5700, emoji: '🏙️', tags: ['อาหาร', 'ติวเตอร์', 'สุขภาพ'],           rating: 4.9, serviceRadius: 3,  memberCount: 520,  providerCount: 22,  trialEndText: '15 มี.ค. 2569' } },
  { id: '3',  name: 'ชุมชนเมืองทอง',         slug: 'mueang-thong',      adminName: 'คุณวิรัตน์ ตั้งใจดี',   commissionRate: 8,  revenueShareRate: 40, trial: false, settings: { type: 'village', province: 'นนทบุรี',          area: 'เมืองทอง, นนทบุรี',      lat: 13.8800, lng: 100.5400, emoji: '🌳', tags: ['อาหาร', 'งานช่าง', 'เกษตร'],            rating: 4.7, serviceRadius: 8,  memberCount: 890,  providerCount: 45,  trialEndText: null } },
  { id: '4',  name: 'หมู่บ้านกรีนวิลล์',     slug: 'green-ville',       adminName: 'คุณปรัชญา เขียวสด',     commissionRate: 5,  revenueShareRate: 40, trial: true,  settings: { type: 'village', province: 'กรุงเทพฯ',       area: 'บึงกุ่ม, กรุงเทพฯ',      lat: 13.5990, lng: 100.6100, emoji: '🌿', tags: ['งานบ้าน', 'ดูแลผู้สูงอายุ'],             rating: 4.6, serviceRadius: 4,  memberCount: 215,  providerCount: 18,  trialEndText: '01 มิ.ย. 2569' } },
  { id: '5',  name: 'ชุมชนริมน้ำ',            slug: 'rim-nam',           adminName: 'คุณทองคำ เกษตรกร',      commissionRate: 5,  revenueShareRate: 35, trial: true,  settings: { type: 'village', province: 'ปทุมธานี',         area: 'ปทุมธานี',               lat: 14.0200, lng: 100.5300, emoji: '🌊', tags: ['เกษตร', 'อาหาร', 'Community Sharing'],  rating: 4.5, serviceRadius: 6,  memberCount: 178,  providerCount: 12,  trialEndText: '20 พ.ค. 2569' } },
  { id: '6',  name: 'เมืองเชียงใหม่ซิตี้',   slug: 'chiangmai-city',    adminName: 'คุณชาญชัย ล้านนา',      commissionRate: 8,  revenueShareRate: 45, trial: false, settings: { type: 'city',    province: 'เชียงใหม่',        area: 'เมือง, เชียงใหม่',       lat: 18.7900, lng: 98.9800,  emoji: '⛰️', tags: ['อาหาร', 'สินค้าทำมือ', 'ท่องเที่ยว'], rating: 4.8, serviceRadius: 10, memberCount: 1240, providerCount: 78,  trialEndText: null } },
  { id: '7',  name: 'นิมมานเฮมิน วิลเลจ',    slug: 'nimman-village',    adminName: 'คุณอรุณี พฤกษา',        commissionRate: 7,  revenueShareRate: 40, trial: false, settings: { type: 'condo',   province: 'เชียงใหม่',        area: 'นิมมานเฮมิน, เชียงใหม่', lat: 18.7960, lng: 98.9680,  emoji: '☕', tags: ['คาเฟ่', 'ฟรีแลนซ์', 'สุขภาพ'],         rating: 4.7, serviceRadius: 3,  memberCount: 420,  providerCount: 35,  trialEndText: null } },
  { id: '8',  name: 'ป่าตอง ซีไซด์',         slug: 'patong-seaside',    adminName: 'คุณธนากร ทะเลสวย',      commissionRate: 10, revenueShareRate: 50, trial: false, settings: { type: 'city',    province: 'ภูเก็ต',           area: 'ป่าตอง, ภูเก็ต',         lat: 7.8804,  lng: 98.2922,  emoji: '🏖️', tags: ['อาหารทะเล', 'ท่องเที่ยว', 'สุขภาพ'],   rating: 4.9, serviceRadius: 6,  memberCount: 680,  providerCount: 42,  trialEndText: null } },
  { id: '9',  name: 'ขอนแก่น อัพทาวน์',      slug: 'khon-kaen-uptown',  adminName: 'คุณสมชาย อีสาน',        commissionRate: 5,  revenueShareRate: 40, trial: true,  settings: { type: 'city',    province: 'ขอนแก่น',          area: 'เมือง, ขอนแก่น',         lat: 16.4322, lng: 102.8236, emoji: '🌶️', tags: ['อาหาร', 'งานช่าง', 'ติวเตอร์'],         rating: 4.6, serviceRadius: 7,  memberCount: 560,  providerCount: 38,  trialEndText: '30 เม.ย. 2569' } },
  { id: '10', name: 'หาดใหญ่ สมาร์ทซิตี้',   slug: 'hatyai-smartcity',  adminName: 'คุณมาลีรัตน์ ใต้สุข',  commissionRate: 6,  revenueShareRate: 40, trial: false, settings: { type: 'city',    province: 'สงขลา',            area: 'หาดใหญ่, สงขลา',         lat: 7.0086,  lng: 100.4770, emoji: '🌴', tags: ['อาหาร', 'ซ่อมแซม', 'การศึกษา'],         rating: 4.7, serviceRadius: 8,  memberCount: 720,  providerCount: 48,  trialEndText: null } },
  { id: '11', name: 'สุขุมวิท อาร์บัน',       slug: 'sukhumvit-urban',   adminName: 'คุณณัฐพล เมืองหลวง',   commissionRate: 8,  revenueShareRate: 45, trial: false, settings: { type: 'condo',   province: 'กรุงเทพฯ',       area: 'สุขุมวิท, กรุงเทพฯ',     lat: 13.7400, lng: 100.5710, emoji: '🏙️', tags: ['ฟรีแลนซ์', 'สุขภาพ', 'อาหาร'],          rating: 4.8, serviceRadius: 4,  memberCount: 780,  providerCount: 52,  trialEndText: null } },
  { id: '12', name: 'เชียงราย เมืองเก่า',     slug: 'chiangrai-oldtown', adminName: 'คุณกฤษฎา ดอยหลวง',     commissionRate: 5,  revenueShareRate: 40, trial: true,  settings: { type: 'city',    province: 'เชียงราย',         area: 'เมือง, เชียงราย',        lat: 19.9105, lng: 99.8406,  emoji: '🌸', tags: ['หัตถกรรม', 'อาหาร', 'ท่องเที่ยว'],      rating: 4.5, serviceRadius: 6,  memberCount: 340,  providerCount: 28,  trialEndText: '30 เม.ย. 2569' } },
  { id: '13', name: 'โคราช พลาซ่า',           slug: 'korat-plaza',       adminName: 'คุณสุดา โคราช',         commissionRate: 5,  revenueShareRate: 40, trial: true,  settings: { type: 'city',    province: 'นครราชสีมา',       area: 'เมือง, นครราชสีมา',      lat: 14.9700, lng: 102.1011, emoji: '🦁', tags: ['อาหาร', 'งานช่าง', 'งานบ้าน'],          rating: 4.6, serviceRadius: 7,  memberCount: 650,  providerCount: 40,  trialEndText: '30 เม.ย. 2569' } },
  { id: '14', name: 'ระยอง ซีวิว',            slug: 'rayong-seaview',    adminName: 'คุณวรรณา ระยอง',        commissionRate: 6,  revenueShareRate: 40, trial: false, settings: { type: 'village', province: 'ระยอง',            area: 'เมือง, ระยอง',           lat: 12.6840, lng: 101.2520, emoji: '⚓', tags: ['อาหารทะเล', 'เกษตร', 'ท่องเที่ยว'],     rating: 4.5, serviceRadius: 5,  memberCount: 290,  providerCount: 22,  trialEndText: null } },
  { id: '15', name: 'เกาะสมุย บีชซิตี้',      slug: 'koh-samui-beach',   adminName: 'คุณธนากร เกาะสมุย',     commissionRate: 10, revenueShareRate: 50, trial: false, settings: { type: 'city',    province: 'สุราษฎร์ธานี',    area: 'เกาะสมุย, สุราษฎร์ธานี', lat: 9.5400,  lng: 100.0640, emoji: '🌊', tags: ['สปา', 'อาหารทะเล', 'ท่องเที่ยว'],        rating: 4.8, serviceRadius: 8,  memberCount: 480,  providerCount: 38,  trialEndText: null } },
  { id: '16', name: 'อุดรธานี คิตี้ซิตี้',   slug: 'udon-kitty-city',   adminName: 'คุณเพชรอุดร วัฒนา',     commissionRate: 5,  revenueShareRate: 40, trial: true,  settings: { type: 'city',    province: 'อุดรธานี',         area: 'เมือง, อุดรธานี',        lat: 17.4138, lng: 102.7869, emoji: '🛍️', tags: ['อาหาร', 'ช้อปปิ้ง', 'บันเทิง'],          rating: 4.5, serviceRadius: 6,  memberCount: 342,  providerCount: 20,  trialEndText: '30 เม.ย. 2569' } },
  { id: '17', name: 'อุบลราชธานี เมืองเก่า',  slug: 'ubon-oldtown',      adminName: 'คุณมงคล อีสาน',         commissionRate: 5,  revenueShareRate: 35, trial: true,  settings: { type: 'city',    province: 'อุบลราชธานี',      area: 'เมือง, อุบลราชธานี',     lat: 15.2448, lng: 104.8453, emoji: '🏛️', tags: ['วัฒนธรรม', 'อาหาร', 'ท่องเที่ยว'],      rating: 4.4, serviceRadius: 5,  memberCount: 198,  providerCount: 14,  trialEndText: '30 เม.ย. 2569' } },
  { id: '18', name: 'พัทยา บีชซิตี้',         slug: 'pattaya-beach',     adminName: 'คุณจิรายุ ชลบุรี',      commissionRate: 8,  revenueShareRate: 45, trial: false, settings: { type: 'city',    province: 'ชลบุรี',           area: 'พัทยา, ชลบุรี',          lat: 12.9350, lng: 100.8825, emoji: '🎡', tags: ['ท่องเที่ยว', 'งานช่าง', 'สุขภาพ'],       rating: 4.7, serviceRadius: 7,  memberCount: 456,  providerCount: 35,  trialEndText: null } },
  { id: '19', name: 'สุราษฎร์ธานี เมือง',      slug: 'suratthani-mueang', adminName: 'คุณสุกัญญา ทะเลใต้',    commissionRate: 5,  revenueShareRate: 35, trial: true,  settings: { type: 'city',    province: 'สุราษฎร์ธานี',    area: 'เมือง, สุราษฎร์ธานี',   lat: 9.1400,  lng: 99.3275,  emoji: '🍊', tags: ['ผลไม้', 'เกษตร', 'อาหาร'],              rating: 4.5, serviceRadius: 5,  memberCount: 267,  providerCount: 18,  trialEndText: '30 เม.ย. 2569' } },
  { id: '20', name: 'ลำปาง เซรามิค',          slug: 'lampang-ceramic',   adminName: 'คุณชวนพิศ รถม้า',       commissionRate: 5,  revenueShareRate: 40, trial: false, settings: { type: 'city',    province: 'ลำปาง',            area: 'เมือง, ลำปาง',           lat: 18.2888, lng: 99.4977,  emoji: '🏺', tags: ['หัตถกรรม', 'เซรามิค', 'ท่องเที่ยว'],    rating: 4.5, serviceRadius: 4,  memberCount: 178,  providerCount: 12,  trialEndText: null } },
  { id: '21', name: 'นครสวรรค์ เมือง',         slug: 'nakhon-sawan',      adminName: 'คุณศักดิ์ชัย สวรรค์',  commissionRate: 5,  revenueShareRate: 35, trial: true,  settings: { type: 'city',    province: 'นครสวรรค์',        area: 'เมือง, นครสวรรค์',       lat: 15.7047, lng: 100.1368, emoji: '🐉', tags: ['อาหาร', 'OTOP', 'วัฒนธรรม'],            rating: 4.5, serviceRadius: 5,  memberCount: 312,  providerCount: 22,  trialEndText: '30 เม.ย. 2569' } },
  { id: '22', name: 'สมุทรปราการ เมือง',        slug: 'samut-prakan',      adminName: 'คุณรัตนา นนทบุรี',      commissionRate: 6,  revenueShareRate: 40, trial: false, settings: { type: 'city',    province: 'สมุทรปราการ',      area: 'บางปู, สมุทรปราการ',     lat: 13.5990, lng: 100.6000, emoji: '🏭', tags: ['อาหารทะเล', 'งานช่าง', 'งานบ้าน'],      rating: 4.4, serviceRadius: 6,  memberCount: 445,  providerCount: 28,  trialEndText: null } },
  { id: '23', name: 'นครศรีธรรมราช',           slug: 'nakhon-si',         adminName: 'คุณนฤมล สงขลา',         commissionRate: 5,  revenueShareRate: 40, trial: true,  settings: { type: 'city',    province: 'นครศรีธรรมราช',   area: 'เมือง, นครศรีธรรมราช',  lat: 8.4304,  lng: 99.9631,  emoji: '🕌', tags: ['วัฒนธรรม', 'อาหารทะเล', 'ท่องเที่ยว'],  rating: 4.5, serviceRadius: 5,  memberCount: 289,  providerCount: 20,  trialEndText: '30 เม.ย. 2569' } },
  { id: '24', name: 'กาญจนบุรี ริเวอร์',       slug: 'kanchanaburi-river',adminName: 'คุณไพรัตน์ ป่าไม้',     commissionRate: 5,  revenueShareRate: 40, trial: false, settings: { type: 'city',    province: 'กาญจนบุรี',        area: 'เมือง, กาญจนบุรี',       lat: 14.0063, lng: 99.5481,  emoji: '🛶', tags: ['ท่องเที่ยว', 'ธรรมชาติ', 'เกษตร'],       rating: 4.6, serviceRadius: 6,  memberCount: 234,  providerCount: 16,  trialEndText: null } },
  { id: '25', name: 'บึงกาฬ ริมโขง',           slug: 'bueng-kan-mekong',  adminName: 'คุณประสิทธิ์ ริมโขง',   commissionRate: 5,  revenueShareRate: 40, trial: true,  settings: { type: 'city',    province: 'บึงกาฬ',           area: 'เมือง, บึงกาฬ',          lat: 18.3609, lng: 103.6521, emoji: '🌲', tags: ['เกษตร', 'ธรรมชาติ', 'ท่องเที่ยว'],       rating: 4.3, serviceRadius: 8,  memberCount: 124,  providerCount: 8,   trialEndText: '30 เม.ย. 2569' } },
  // ── 20 additional community markets ────────────────────────────────────────
  { id: '26', name: 'สตูล ชายแดน',             slug: 'satun-border',       adminName: 'คุณอับดุลเลาะ สตูล',    commissionRate: 5,  revenueShareRate: 35, trial: true,  settings: { type: 'city',    province: 'สตูล',             area: 'เมือง, สตูล',            lat: 6.6238,  lng: 100.0673, emoji: '🌊', tags: ['อาหารทะเล', 'วัฒนธรรม', 'ท่องเที่ยว'],  rating: 4.4, serviceRadius: 5,  memberCount: 198,  providerCount: 14,  trialEndText: '30 เม.ย. 2569' } },
  { id: '27', name: 'แม่ฮ่องสอน เมืองหมอก',    slug: 'mae-hong-son',       adminName: 'คุณบัวแก้ว ล้านนา',     commissionRate: 5,  revenueShareRate: 35, trial: true,  settings: { type: 'city',    province: 'แม่ฮ่องสอน',      area: 'เมือง, แม่ฮ่องสอน',     lat: 19.3020, lng: 97.9654,  emoji: '⛰️', tags: ['หัตถกรรมชาวเขา', 'ท่องเที่ยว', 'เกษตร'],rating: 4.5, serviceRadius: 6,  memberCount: 145,  providerCount: 10,  trialEndText: '30 เม.ย. 2569' } },
  { id: '28', name: 'น่าน เมืองเก่า',           slug: 'nan-oldtown',        adminName: 'คุณศรีน่าน โบราณ',      commissionRate: 5,  revenueShareRate: 40, trial: false, settings: { type: 'city',    province: 'น่าน',             area: 'เมือง, น่าน',            lat: 18.7756, lng: 100.7730, emoji: '🏛️', tags: ['วัฒนธรรม', 'หัตถกรรม', 'ท่องเที่ยว'],   rating: 4.6, serviceRadius: 5,  memberCount: 234,  providerCount: 18,  trialEndText: null } },
  { id: '29', name: 'เลย ภูกระดึง',             slug: 'loei-phu-kradueng', adminName: 'คุณภูกฤษ เลย',          commissionRate: 5,  revenueShareRate: 35, trial: true,  settings: { type: 'city',    province: 'เลย',              area: 'เมือง, เลย',             lat: 17.4879, lng: 101.7216, emoji: '🏔️', tags: ['เกษตร', 'ท่องเที่ยว', 'ธรรมชาติ'],       rating: 4.4, serviceRadius: 7,  memberCount: 167,  providerCount: 12,  trialEndText: '30 เม.ย. 2569' } },
  { id: '30', name: 'นครพนม ริมโขง',            slug: 'nakhon-phanom',     adminName: 'คุณพนมกร ริมโขง',        commissionRate: 5,  revenueShareRate: 35, trial: true,  settings: { type: 'city',    province: 'นครพนม',           area: 'เมือง, นครพนม',          lat: 17.3910, lng: 104.7774, emoji: '🐉', tags: ['อาหาร', 'วัฒนธรรม', 'ท่องเที่ยว'],       rating: 4.4, serviceRadius: 5,  memberCount: 189,  providerCount: 14,  trialEndText: '30 เม.ย. 2569' } },
  { id: '31', name: 'สกลนคร เมือง',             slug: 'sakon-nakhon',      adminName: 'คุณสกล อิสาน',           commissionRate: 5,  revenueShareRate: 35, trial: true,  settings: { type: 'city',    province: 'สกลนคร',           area: 'เมือง, สกลนคร',          lat: 17.1548, lng: 104.1348, emoji: '🦢', tags: ['ผ้าไหม', 'อาหาร', 'วัฒนธรรม'],           rating: 4.3, serviceRadius: 5,  memberCount: 221,  providerCount: 16,  trialEndText: '30 เม.ย. 2569' } },
  { id: '32', name: 'ยโสธร เมือง',              slug: 'yasothon',          adminName: 'คุณยโส ธรรมดา',          commissionRate: 5,  revenueShareRate: 35, trial: true,  settings: { type: 'city',    province: 'ยโสธร',            area: 'เมือง, ยโสธร',           lat: 15.7926, lng: 104.1456, emoji: '🪅', tags: ['งานบ้าน', 'อาหาร', 'OTOP'],              rating: 4.3, serviceRadius: 4,  memberCount: 156,  providerCount: 10,  trialEndText: '30 เม.ย. 2569' } },
  { id: '33', name: 'ร้อยเอ็ด เมือง',           slug: 'roi-et',            adminName: 'คุณเอ็ดวิลัย ร้อยเอ็ด', commissionRate: 5,  revenueShareRate: 35, trial: false, settings: { type: 'city',    province: 'ร้อยเอ็ด',         area: 'เมือง, ร้อยเอ็ด',        lat: 16.0538, lng: 103.6520, emoji: '🌾', tags: ['งานช่าง', 'อาหาร', 'เกษตร'],             rating: 4.4, serviceRadius: 5,  memberCount: 267,  providerCount: 18,  trialEndText: null } },
  { id: '34', name: 'มหาสารคาม เมือง',          slug: 'maha-sarakham',     adminName: 'คุณสารคาม สาระ',         commissionRate: 5,  revenueShareRate: 35, trial: true,  settings: { type: 'city',    province: 'มหาสารคาม',        area: 'เมือง, มหาสารคาม',       lat: 16.1851, lng: 103.3000, emoji: '🎓', tags: ['การศึกษา', 'อาหาร', 'วัฒนธรรม'],          rating: 4.4, serviceRadius: 4,  memberCount: 312,  providerCount: 22,  trialEndText: '30 เม.ย. 2569' } },
  { id: '35', name: 'ชัยภูมิ เมือง',            slug: 'chaiyaphum',        adminName: 'คุณภูมิชัย ชัยภูมิ',    commissionRate: 5,  revenueShareRate: 35, trial: true,  settings: { type: 'city',    province: 'ชัยภูมิ',          area: 'เมือง, ชัยภูมิ',         lat: 15.8070, lng: 102.0310, emoji: '🌻', tags: ['เกษตร', 'หัตถกรรม', 'OTOP'],             rating: 4.3, serviceRadius: 5,  memberCount: 178,  providerCount: 12,  trialEndText: '30 เม.ย. 2569' } },
  { id: '36', name: 'สุรินทร์ เมือง',           slug: 'surin',             adminName: 'คุณสุรินทร์ เขมร',       commissionRate: 5,  revenueShareRate: 40, trial: false, settings: { type: 'city',    province: 'สุรินทร์',         area: 'เมือง, สุรินทร์',        lat: 14.8825, lng: 103.4936, emoji: '🐘', tags: ['ผ้าไหม', 'วัฒนธรรม', 'ท่องเที่ยว'],      rating: 4.5, serviceRadius: 5,  memberCount: 298,  providerCount: 22,  trialEndText: null } },
  { id: '37', name: 'บุรีรัมย์ เมือง',           slug: 'buri-ram',          adminName: 'คุณบุรีรัมย์ สนาม',      commissionRate: 5,  revenueShareRate: 40, trial: false, settings: { type: 'city',    province: 'บุรีรัมย์',         area: 'เมือง, บุรีรัมย์',       lat: 14.9935, lng: 103.1026, emoji: '⚽', tags: ['อาหาร', 'ท่องเที่ยว', 'งานช่าง'],         rating: 4.4, serviceRadius: 6,  memberCount: 345,  providerCount: 24,  trialEndText: null } },
  { id: '38', name: 'ตราด ชายทะเล',             slug: 'trat-seaside',      adminName: 'คุณตราด ทะเลตะวันออก',  commissionRate: 6,  revenueShareRate: 40, trial: false, settings: { type: 'city',    province: 'ตราด',             area: 'เมือง, ตราด',            lat: 12.2428, lng: 102.5178, emoji: '🦞', tags: ['อาหารทะเล', 'ท่องเที่ยว', 'ผลไม้'],       rating: 4.5, serviceRadius: 5,  memberCount: 213,  providerCount: 16,  trialEndText: null } },
  { id: '39', name: 'สระแก้ว เมือง',            slug: 'sa-kaeo',           adminName: 'คุณสระแก้ว ชายแดน',      commissionRate: 5,  revenueShareRate: 35, trial: true,  settings: { type: 'city',    province: 'สระแก้ว',          area: 'เมือง, สระแก้ว',         lat: 13.8240, lng: 102.0645, emoji: '🌿', tags: ['เกษตร', 'ผลไม้', 'งานช่าง'],             rating: 4.3, serviceRadius: 6,  memberCount: 189,  providerCount: 14,  trialEndText: '30 เม.ย. 2569' } },
  { id: '40', name: 'จันทบุรี ผลไม้',           slug: 'chanthaburi-fruit', adminName: 'คุณจันทน์ บุรี',         commissionRate: 5,  revenueShareRate: 40, trial: false, settings: { type: 'city',    province: 'จันทบุรี',         area: 'เมือง, จันทบุรี',        lat: 12.6096, lng: 102.1046, emoji: '🍊', tags: ['ผลไม้', 'เกษตร', 'อัญมณี'],               rating: 4.6, serviceRadius: 6,  memberCount: 267,  providerCount: 20,  trialEndText: null } },
  { id: '41', name: 'เพชรบูรณ์ เมือง',          slug: 'phetchabun',        adminName: 'คุณเพชร บูรณ์',          commissionRate: 5,  revenueShareRate: 35, trial: true,  settings: { type: 'city',    province: 'เพชรบูรณ์',        area: 'เมือง, เพชรบูรณ์',       lat: 16.4192, lng: 101.1585, emoji: '💎', tags: ['สุขภาพ', 'เกษตร', 'ธรรมชาติ'],            rating: 4.4, serviceRadius: 5,  memberCount: 198,  providerCount: 14,  trialEndText: '30 เม.ย. 2569' } },
  { id: '42', name: 'พิษณุโลก เมือง',           slug: 'phitsanulok',       adminName: 'คุณพิษณุ โลก',           commissionRate: 6,  revenueShareRate: 40, trial: false, settings: { type: 'city',    province: 'พิษณุโลก',         area: 'เมือง, พิษณุโลก',        lat: 16.8272, lng: 100.2659, emoji: '⚔️', tags: ['งานช่าง', 'อาหาร', 'ท่องเที่ยว'],         rating: 4.5, serviceRadius: 6,  memberCount: 345,  providerCount: 24,  trialEndText: null } },
  { id: '43', name: 'อุตรดิตถ์ เมือง',          slug: 'uttaradit',         adminName: 'คุณอุตร ดิตถ์',          commissionRate: 5,  revenueShareRate: 35, trial: true,  settings: { type: 'city',    province: 'อุตรดิตถ์',        area: 'เมือง, อุตรดิตถ์',       lat: 17.6217, lng: 100.0994, emoji: '🍑', tags: ['ผลไม้', 'เกษตร', 'อาหาร'],               rating: 4.4, serviceRadius: 5,  memberCount: 167,  providerCount: 12,  trialEndText: '30 เม.ย. 2569' } },
  { id: '44', name: 'แพร่ เมืองผ้าหม้อห้อม',    slug: 'phrae-hmom',        adminName: 'คุณแพร่ หม้อห้อม',       commissionRate: 5,  revenueShareRate: 40, trial: false, settings: { type: 'city',    province: 'แพร่',             area: 'เมือง, แพร่',            lat: 18.1443, lng: 100.1408, emoji: '👘', tags: ['ผ้าหม้อห้อม', 'หัตถกรรม', 'ท่องเที่ยว'],  rating: 4.5, serviceRadius: 4,  memberCount: 223,  providerCount: 16,  trialEndText: null } },
  { id: '45', name: 'ตาก เมือง',                slug: 'tak-mueang',        adminName: 'คุณตาก ชายแดน',          commissionRate: 5,  revenueShareRate: 35, trial: true,  settings: { type: 'city',    province: 'ตาก',              area: 'เมือง, ตาก',             lat: 16.8697, lng: 99.1259,  emoji: '🌲', tags: ['เกษตร', 'ธรรมชาติ', 'ท่องเที่ยว'],       rating: 4.3, serviceRadius: 7,  memberCount: 145,  providerCount: 10,  trialEndText: '30 เม.ย. 2569' } },
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
  // ── providers for 20 new communities ────────────────────────────────────────
  { idx: 26, name: 'ครัวปักษ์ใต้สตูล', avatar: '🍖', category: 'FOOD', template: 'FOOD', trustScore: 0.82, rating: 4.5, communityIdx: 26, extraCommunities: [] },
  { idx: 27, name: 'หัตถกรรมชาวเขา', avatar: '🪡', category: 'HANDMADE', template: 'HANDMADE', trustScore: 0.79, rating: 4.6, communityIdx: 27, extraCommunities: [] },
  { idx: 28, name: 'ช่างน่านมืออาชีพ', avatar: '🔨', category: 'REPAIR', template: 'REPAIR', trustScore: 0.84, rating: 4.5, communityIdx: 28, extraCommunities: [] },
  { idx: 29, name: 'เกษตรอินทรีย์เลย', avatar: '🥦', category: 'AGRICULTURE', template: 'AGRICULTURE', trustScore: 0.78, rating: 4.4, communityIdx: 29, extraCommunities: [] },
  { idx: 30, name: 'ครัวนครพนม', avatar: '🍜', category: 'FOOD', template: 'FOOD', trustScore: 0.80, rating: 4.5, communityIdx: 30, extraCommunities: [] },
  { idx: 31, name: 'ผ้าไหมสกลนคร', avatar: '🧵', category: 'HANDMADE', template: 'HANDMADE', trustScore: 0.85, rating: 4.7, communityIdx: 31, extraCommunities: [] },
  { idx: 32, name: 'แม่บ้านยโสธร', avatar: '🧹', category: 'HOME_SERVICES', template: 'HOME_SERVICES', trustScore: 0.76, rating: 4.3, communityIdx: 32, extraCommunities: [] },
  { idx: 33, name: 'ช่างซ่อมร้อยเอ็ด', avatar: '🛠️', category: 'REPAIR', template: 'REPAIR', trustScore: 0.81, rating: 4.4, communityIdx: 33, extraCommunities: [] },
  { idx: 34, name: 'ครูมหาสารคาม', avatar: '📖', category: 'TUTORING', template: 'TUTORING', trustScore: 0.88, rating: 4.7, communityIdx: 34, extraCommunities: [] },
  { idx: 35, name: 'ดอกไม้ชัยภูมิ', avatar: '🌸', category: 'HANDMADE', template: 'HANDMADE', trustScore: 0.77, rating: 4.4, communityIdx: 35, extraCommunities: [] },
  { idx: 36, name: 'ผ้าไหมสุรินทร์', avatar: '🪢', category: 'HANDMADE', template: 'HANDMADE', trustScore: 0.87, rating: 4.8, communityIdx: 36, extraCommunities: [] },
  { idx: 37, name: 'ครัวบุรีรัมย์', avatar: '🍛', category: 'FOOD', template: 'FOOD', trustScore: 0.81, rating: 4.5, communityIdx: 37, extraCommunities: [] },
  { idx: 38, name: 'อาหารทะเลสดตราด', avatar: '🦐', category: 'FOOD', template: 'FOOD', trustScore: 0.86, rating: 4.7, communityIdx: 38, extraCommunities: [] },
  { idx: 39, name: 'สวนผลไม้สระแก้ว', avatar: '🌾', category: 'AGRICULTURE', template: 'AGRICULTURE', trustScore: 0.79, rating: 4.4, communityIdx: 39, extraCommunities: [] },
  { idx: 40, name: 'ผลไม้จันทบุรี', avatar: '🍈', category: 'AGRICULTURE', template: 'AGRICULTURE', trustScore: 0.83, rating: 4.6, communityIdx: 40, extraCommunities: [] },
  { idx: 41, name: 'นวดสมุนไพรเพชรบูรณ์', avatar: '🌿', category: 'HEALTH_WELLNESS', template: 'HEALTH_WELLNESS', trustScore: 0.82, rating: 4.5, communityIdx: 41, extraCommunities: [] },
  { idx: 42, name: 'ช่างไฟพิษณุโลก', avatar: '⚡', category: 'REPAIR', template: 'REPAIR', trustScore: 0.85, rating: 4.6, communityIdx: 42, extraCommunities: [] },
  { idx: 43, name: 'ลางสาดอุตรดิตถ์', avatar: '🍊', category: 'FOOD', template: 'FOOD', trustScore: 0.78, rating: 4.4, communityIdx: 43, extraCommunities: [] },
  { idx: 44, name: 'ผ้าหม้อห้อมแพร่', avatar: '👘', category: 'HANDMADE', template: 'HANDMADE', trustScore: 0.88, rating: 4.7, communityIdx: 44, extraCommunities: [] },
  { idx: 45, name: 'เกษตรอินทรีย์ตาก', avatar: '🥬', category: 'AGRICULTURE', template: 'AGRICULTURE', trustScore: 0.76, rating: 4.3, communityIdx: 45, extraCommunities: [] },
]

// 25 listings from mock-listings.ts (condensed)
const LISTINGS_DATA = [
  { idx: 1, providerIdx: 1, title: 'ทำอาหารกล่องส่งถึงที่', category: 'FOOD', price: 80, unit: 'กล่อง', image: '🍱', isPromoted: true, tags: ['ข้าว', 'ส้มตำ', 'อาหารตามสั่ง'], availableDays: [0,1,2,3,4], openTime: '07:00', closeTime: '17:00', lat: 13.726, lng: 100.482, calories: 450, protein: 15, carbs: 60, fat: 12, isHealthOption: false },
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
  { idx: 12, providerIdx: 12, title: 'อาหารคลีนออเดอร์ล่วงหน้า', category: 'FOOD', price: 120, unit: 'กล่อง', image: '🥗', isPromoted: false, tags: ['คลีน', 'สุขภาพ', 'คาโลรี่'], availableDays: [0,1,2,3,4], openTime: '08:00', closeTime: '14:00', lat: 13.768, lng: 100.542, calories: 350, protein: 30, carbs: 28, fat: 8, isHealthOption: true },
  { idx: 13, providerIdx: 13, title: 'คลาสทำอาหารเหนือ เชียงใหม่', category: 'FOOD', price: 800, unit: 'คน', image: '🫕', isPromoted: false, tags: ['คลาส', 'อาหารเหนือ', 'ท่องเที่ยว'], availableDays: [2,4,6,0], openTime: '09:00', closeTime: '14:00', lat: 18.790, lng: 99.000, calories: 620, protein: 22, carbs: 75, fat: 20, isHealthOption: false },
  { idx: 14, providerIdx: 14, title: 'สปานวดล้านนา อโรมาเทอราพี', category: 'HEALTH_WELLNESS', price: 1200, unit: 'ชั่วโมง', image: '🌺', isPromoted: true, tags: ['สปา', 'นวด', 'อโรมา'], availableDays: [0,1,2,3,4,5,6], openTime: '10:00', closeTime: '21:00', lat: 18.793, lng: 99.008 },
  { idx: 15, providerIdx: 15, title: 'ไกด์เดินป่าดอยสุเทพ', category: 'FREELANCE', price: 600, unit: 'คน', image: '⛰️', isPromoted: false, tags: ['ไกด์', 'เดินป่า', 'ท่องเที่ยว'], availableDays: [0,3,6], openTime: '06:00', closeTime: '16:00', lat: 18.805, lng: 98.921 },
  { idx: 16, providerIdx: 16, title: 'บริการแม่บ้านเกาะสมุย', category: 'HOME_SERVICES', price: 900, unit: 'ครั้ง', image: '🏡', isPromoted: false, tags: ['แม่บ้าน', 'เกาะสมุย', 'สะอาด'], availableDays: [0,1,2,3,4,5], openTime: '08:00', closeTime: '17:00', lat: 9.540, lng: 100.069 },
  { idx: 17, providerIdx: 17, title: 'ซ่อมไฟฟ้าบ้าน ขอนแก่น', category: 'REPAIR', price: 350, unit: 'ครั้ง', image: '⚡', isPromoted: false, tags: ['ไฟฟ้า', 'ซ่อม', 'ขอนแก่น'], availableDays: [0,1,2,3,4,5], openTime: '08:00', closeTime: '18:00', lat: 16.432, lng: 102.828 },
  { idx: 18, providerIdx: 18, title: 'ขนมไทยโบราณ สั่งทำ', category: 'FOOD', price: 200, unit: 'กล่อง', image: '🍮', isPromoted: false, tags: ['ขนมไทย', 'โบราณ', 'สั่งทำ'], availableDays: [0,1,2,3,4,5,6], openTime: '09:00', closeTime: '17:00', lat: 7.008, lng: 100.473, calories: 280, protein: 4, carbs: 52, fat: 7, isHealthOption: false },
  { idx: 19, providerIdx: 19, title: 'ช่างไฟมืออาชีพ เชียงใหม่', category: 'REPAIR', price: 450, unit: 'ครั้ง', image: '⚡', isPromoted: false, tags: ['ช่างไฟ', 'มืออาชีพ', 'เชียงใหม่'], availableDays: [0,1,2,3,4,5], openTime: '08:00', closeTime: '18:00', lat: 18.800, lng: 98.980 },
  { idx: 20, providerIdx: 20, title: 'จัดสวน ดูแลต้นไม้', category: 'HOME_SERVICES', price: 800, unit: 'ครั้ง', image: '🌳', isPromoted: false, tags: ['สวน', 'ต้นไม้', 'ดูแล'], availableDays: [0,1,2,3,4,5], openTime: '07:00', closeTime: '17:00', lat: 13.898, lng: 100.394 },
  { idx: 21, providerIdx: 21, title: 'คลาสโยคะส่วนตัว ภูเก็ต', category: 'HEALTH_WELLNESS', price: 500, unit: 'ชั่วโมง', image: '🧘‍♀️', isPromoted: false, tags: ['โยคะ', 'ภูเก็ต', 'สุขภาพ'], availableDays: [0,1,2,3,4,5,6], openTime: '07:00', closeTime: '20:00', lat: 7.879, lng: 98.390 },
  { idx: 22, providerIdx: 22, title: 'ผักอีสานสด ส่งรายสัปดาห์', category: 'AGRICULTURE', price: 180, unit: 'ชุด', image: '🌾', isPromoted: false, tags: ['ผักอีสาน', 'ออร์แกนิค', 'ส่งบ้าน'], availableDays: [0,3,6], openTime: '06:00', closeTime: '10:00', lat: 17.408, lng: 102.787 },
  { idx: 23, providerIdx: 23, title: 'ซ่อมเครื่องใช้ไฟฟ้า เกาะสมุย', category: 'REPAIR', price: 600, unit: 'ครั้ง', image: '🔌', isPromoted: false, tags: ['ช่างซ่อม', 'เครื่องใช้ไฟฟ้า', 'เกาะสมุย'], availableDays: [0,1,2,3,4,5], openTime: '09:00', closeTime: '18:00', lat: 9.535, lng: 100.063 },
  { idx: 24, providerIdx: 24, title: 'พัฒนา App / Website', category: 'FREELANCE', price: 15000, unit: 'โปรเจค', image: '💻', isPromoted: true, tags: ['App', 'Website', 'Next.js'], availableDays: [0,1,2,3,4], openTime: '09:00', closeTime: '18:00', lat: 13.756, lng: 100.563 },
  { idx: 25, providerIdx: 25, title: 'ตลาดนัดชุมชนระยอง', category: 'COMMUNITY_SHARING', price: 100, unit: 'บูธ', image: '🛒', isPromoted: false, tags: ['ตลาดนัด', 'ชุมชน', 'ระยอง'], availableDays: [0,6], openTime: '07:00', closeTime: '12:00', lat: 12.680, lng: 101.282 },
  // ── listings for 20 new communities ─────────────────────────────────────────
  { idx: 26, providerIdx: 26, title: 'ข้าวแกงปักษ์ใต้สูตรสตูล', category: 'FOOD', price: 70, unit: 'จาน', image: '🍛', isPromoted: false, tags: ['ปักษ์ใต้', 'ข้าวแกง', 'ฮาลาล'], availableDays: [0,1,2,3,4,5,6], openTime: '07:00', closeTime: '15:00', lat: 6.624, lng: 100.067, calories: 520, protein: 18, carbs: 65, fat: 16, isHealthOption: false },
  { idx: 27, providerIdx: 27, title: 'กระเป๋าปักชาวเขา แม่ฮ่องสอน', category: 'HANDMADE', price: 480, unit: 'ใบ', image: '🎒', isPromoted: false, tags: ['ชาวเขา', 'ปัก', 'ของฝาก'], availableDays: [0,1,2,3,4,5,6], openTime: '09:00', closeTime: '18:00', lat: 19.302, lng: 97.965 },
  { idx: 28, providerIdx: 28, title: 'ซ่อมเครื่องใช้ไฟฟ้า น่าน', category: 'REPAIR', price: 400, unit: 'ครั้ง', image: '🔌', isPromoted: false, tags: ['ซ่อม', 'ไฟฟ้า', 'น่าน'], availableDays: [0,1,2,3,4,5], openTime: '08:00', closeTime: '18:00', lat: 18.776, lng: 100.773 },
  { idx: 29, providerIdx: 29, title: 'ผักออร์แกนิคภูกระดึง ส่งบ้าน', category: 'AGRICULTURE', price: 200, unit: 'ชุด', image: '🥬', isPromoted: false, tags: ['ออร์แกนิค', 'ภูกระดึง', 'เลย'], availableDays: [0,3,6], openTime: '06:00', closeTime: '11:00', lat: 17.488, lng: 101.722 },
  { idx: 30, providerIdx: 30, title: 'ก๋วยเตี๋ยวนครพนม สูตรโบราณ', category: 'FOOD', price: 60, unit: 'ชาม', image: '🍜', isPromoted: true, tags: ['ก๋วยเตี๋ยว', 'นครพนม', 'โบราณ'], availableDays: [0,1,2,3,4,5,6], openTime: '06:00', closeTime: '14:00', lat: 17.391, lng: 104.777, calories: 380, protein: 16, carbs: 55, fat: 9, isHealthOption: false },
  { idx: 31, providerIdx: 31, title: 'ผ้าไหมมัดหมี่สกลนคร', category: 'HANDMADE', price: 1200, unit: 'ผืน', image: '🧵', isPromoted: true, tags: ['ผ้าไหม', 'มัดหมี่', 'OTOP'], availableDays: [0,1,2,3,4,5,6], openTime: '09:00', closeTime: '18:00', lat: 17.155, lng: 104.135 },
  { idx: 32, providerIdx: 32, title: 'ทำความสะอาดบ้านยโสธร', category: 'HOME_SERVICES', price: 700, unit: 'ครั้ง', image: '🏠', isPromoted: false, tags: ['ทำความสะอาด', 'ยโสธร', 'บ้าน'], availableDays: [0,1,2,3,4,5], openTime: '08:00', closeTime: '17:00', lat: 15.793, lng: 104.146 },
  { idx: 33, providerIdx: 33, title: 'ซ่อมแซมบ้านร้อยเอ็ด', category: 'REPAIR', price: 350, unit: 'ครั้ง', image: '🔧', isPromoted: false, tags: ['ซ่อมบ้าน', 'งานช่าง', 'ร้อยเอ็ด'], availableDays: [0,1,2,3,4,5], openTime: '08:00', closeTime: '18:00', lat: 16.054, lng: 103.652 },
  { idx: 34, providerIdx: 34, title: 'ติวคณิต-วิทย์ มหาสารคาม', category: 'TUTORING', price: 250, unit: 'ชั่วโมง', image: '📐', isPromoted: false, tags: ['ติวเตอร์', 'คณิต', 'วิทยาศาสตร์'], availableDays: [1,2,3,4,5,6], openTime: '14:00', closeTime: '20:00', lat: 16.185, lng: 103.300 },
  { idx: 35, providerIdx: 35, title: 'จัดดอกไม้งานพิธีชัยภูมิ', category: 'HANDMADE', price: 800, unit: 'ชุด', image: '💐', isPromoted: false, tags: ['ดอกไม้', 'จัดงาน', 'พิธี'], availableDays: [0,1,2,3,4,5,6], openTime: '08:00', closeTime: '18:00', lat: 15.807, lng: 102.031 },
  { idx: 36, providerIdx: 36, title: 'ผ้าไหมพื้นเมืองสุรินทร์', category: 'HANDMADE', price: 950, unit: 'ผืน', image: '🪢', isPromoted: true, tags: ['ผ้าไหม', 'สุรินทร์', 'เขมร'], availableDays: [0,1,2,3,4,5,6], openTime: '09:00', closeTime: '17:00', lat: 14.883, lng: 103.494 },
  { idx: 37, providerIdx: 37, title: 'ข้าวหมูกระเทียมบุรีรัมย์', category: 'FOOD', price: 65, unit: 'จาน', image: '🍚', isPromoted: false, tags: ['ข้าว', 'หมูกระเทียม', 'บุรีรัมย์'], availableDays: [0,1,2,3,4,5,6], openTime: '07:00', closeTime: '15:00', lat: 14.994, lng: 103.103, calories: 480, protein: 22, carbs: 58, fat: 14, isHealthOption: false },
  { idx: 38, providerIdx: 38, title: 'กุ้งล็อบสเตอร์สดตราด', category: 'FOOD', price: 1200, unit: 'กก.', image: '🦞', isPromoted: true, tags: ['กุ้งล็อบสเตอร์', 'ทะเลสด', 'ตราด'], availableDays: [0,1,2,3,4,5,6], openTime: '07:00', closeTime: '18:00', lat: 12.243, lng: 102.518, calories: 120, protein: 24, carbs: 1, fat: 2, isHealthOption: true },
  { idx: 39, providerIdx: 39, title: 'มันสำปะหลังและผลไม้สระแก้ว', category: 'AGRICULTURE', price: 150, unit: 'กก.', image: '🥭', isPromoted: false, tags: ['ผลไม้', 'สระแก้ว', 'สด'], availableDays: [0,3,6], openTime: '06:00', closeTime: '12:00', lat: 13.824, lng: 102.065 },
  { idx: 40, providerIdx: 40, title: 'ทุเรียนมังคุดจันทบุรี ส่งถึงบ้าน', category: 'AGRICULTURE', price: 350, unit: 'กก.', image: '🍈', isPromoted: true, tags: ['ทุเรียน', 'มังคุด', 'จันทบุรี'], availableDays: [0,1,2,3,4,5,6], openTime: '08:00', closeTime: '18:00', lat: 12.610, lng: 102.105 },
  { idx: 41, providerIdx: 41, title: 'นวดสมุนไพรเพชรบูรณ์', category: 'HEALTH_WELLNESS', price: 350, unit: 'ชั่วโมง', image: '🌿', isPromoted: false, tags: ['นวด', 'สมุนไพร', 'เพชรบูรณ์'], availableDays: [0,1,2,3,4,5,6], openTime: '09:00', closeTime: '20:00', lat: 16.419, lng: 101.159 },
  { idx: 42, providerIdx: 42, title: 'ติดตั้งไฟฟ้าพิษณุโลก', category: 'REPAIR', price: 600, unit: 'ครั้ง', image: '💡', isPromoted: false, tags: ['ไฟฟ้า', 'ติดตั้ง', 'พิษณุโลก'], availableDays: [0,1,2,3,4,5], openTime: '08:00', closeTime: '18:00', lat: 16.827, lng: 100.266 },
  { idx: 43, providerIdx: 43, title: 'ลางสาดพันธุ์ดีอุตรดิตถ์', category: 'FOOD', price: 120, unit: 'กก.', image: '🍊', isPromoted: false, tags: ['ลางสาด', 'ผลไม้', 'อุตรดิตถ์'], availableDays: [0,1,2,3,4,5,6], openTime: '08:00', closeTime: '17:00', lat: 17.622, lng: 100.099, calories: 75, protein: 1, carbs: 17, fat: 0, isHealthOption: true },
  { idx: 44, providerIdx: 44, title: 'ผ้าหม้อห้อมแพร่ ย้อมธรรมชาติ', category: 'HANDMADE', price: 550, unit: 'ชิ้น', image: '👘', isPromoted: true, tags: ['หม้อห้อม', 'ย้อมธรรมชาติ', 'แพร่'], availableDays: [0,1,2,3,4,5,6], openTime: '09:00', closeTime: '18:00', lat: 18.144, lng: 100.141 },
  { idx: 45, providerIdx: 45, title: 'ผักออร์แกนิคตาก ส่งรายสัปดาห์', category: 'AGRICULTURE', price: 220, unit: 'ชุด', image: '🥦', isPromoted: false, tags: ['ออร์แกนิค', 'ตาก', 'ปลอดสาร'], availableDays: [0,3,6], openTime: '06:00', closeTime: '11:00', lat: 16.870, lng: 99.126 },
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
        id: cd.id,
        name: cd.name, slug: cd.slug, adminId: adminUser.id,
        settings: cd.settings as any,
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
      const ldAny = ld as any
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
        caloriesPerServing: ldAny.calories ?? null,
        proteinGrams: ldAny.protein ?? null,
        carbsGrams: ldAny.carbs ?? null,
        fatGrams: ldAny.fat ?? null,
        isHealthOption: ldAny.isHealthOption ?? false,
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

  // ── System Config — default to training mode ─────────────────────────────
  const sysRepo = AppDataSource.getRepository(SystemConfig)
  await sysRepo.upsert({ key: 'TRAINING_MODE_ACTIVE', value: 'true' }, ['key'])
  console.log('  ✅ system_config: TRAINING_MODE_ACTIVE=true')

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
