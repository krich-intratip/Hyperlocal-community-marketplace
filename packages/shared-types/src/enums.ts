export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  COMMUNITY_ADMIN = 'COMMUNITY_ADMIN',
  PROVIDER = 'PROVIDER',
  CUSTOMER = 'CUSTOMER',
}

export enum VerificationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

/**
 * Operational status of a Provider profile.
 * Independent of VerificationStatus (approval by admin).
 *
 * ACTIVE      — ให้บริการได้ตามปกติ
 * SUSPENDED   — หยุดให้บริการชั่วคราว (กลับมา ACTIVE ได้เอง)
 * INACTIVE    — เลิกกิจการ (ต้องให้ Admin re-activate)
 * LEFT        — ออกจากชุมชนนี้แล้ว (เช่น ย้ายที่อยู่) บัญชียังอยู่ แต่สมัครชุมชนใหม่ได้
 */
export enum ProviderStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  INACTIVE = 'INACTIVE',
  LEFT = 'LEFT',
}

/**
 * KYC / Identity verification status for any user account.
 * Used to prevent fraudulent sign-ups.
 *
 * UNVERIFIED  — ยังไม่ยืนยันตัวตน
 * PENDING     — ส่งเอกสารรอตรวจสอบ
 * VERIFIED    — ผ่านการยืนยันแล้ว
 * REJECTED    — ไม่ผ่าน (ส่งใหม่ได้)
 */
export enum KycStatus {
  UNVERIFIED = 'UNVERIFIED',
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
}

/**
 * Full booking lifecycle state machine.
 *
 * Happy path:
 *   PENDING_PAYMENT → PAYMENT_HELD → CONFIRMED → IN_PROGRESS → PENDING_CONFIRMATION → COMPLETED
 *
 * No-show path (provider doesn't show within 12h):
 *   IN_PROGRESS → NO_SHOW → REFUNDED
 *
 * Dispute path:
 *   PENDING_CONFIRMATION → DISPUTED → DISPUTE_RESOLVED → COMPLETED | REFUNDED
 *
 * Cancellation:
 *   PENDING_PAYMENT | CONFIRMED → CANCELLED_BY_CUSTOMER | CANCELLED_BY_PROVIDER
 *
 * Variable pricing:
 *   IN_PROGRESS → PRICE_ADJUSTMENT_REQUESTED → PRICE_ADJUSTMENT_APPROVED → PENDING_CONFIRMATION
 *
 * Auto-release:
 *   PENDING_CONFIRMATION → COMPLETED (auto after 72h if no dispute/confirmation)
 *
 * Ban:
 *   any → BANNED_AND_REFUNDED  (platform detects collusion / fraud)
 */
export enum BookingStatus {
  /* ── Booking request ── */
  PENDING_PAYMENT = 'PENDING_PAYMENT',           // รอลูกค้าชำระเงิน
  PAYMENT_HELD = 'PAYMENT_HELD',              // ชำระแล้ว เงินถูก hold ใน escrow
  CONFIRMED = 'CONFIRMED',                 // Provider ยืนยันนัดแล้ว รอวันนัด

  /* ── Service in-progress ── */
  IN_PROGRESS = 'IN_PROGRESS',               // Provider กำลังให้บริการ
  PRICE_ADJUSTMENT_REQUESTED = 'PRICE_ADJUSTMENT_REQUESTED', // Provider ขอปรับราคา (variable pricing)
  PRICE_ADJUSTMENT_APPROVED = 'PRICE_ADJUSTMENT_APPROVED',  // CA อนุมัติราคาใหม่แล้ว

  /* ── Awaiting confirmation ── */
  PENDING_CONFIRMATION = 'PENDING_CONFIRMATION',      // Provider กดเสร็จแล้ว รอลูกค้ายืนยัน

  /* ── Resolution ── */
  COMPLETED = 'COMPLETED',                 // สำเร็จ — ระบบโอนเงินให้ Provider
  DISPUTED = 'DISPUTED',                  // ลูกค้าปฏิเสธ/ร้องเรียน
  DISPUTE_RESOLVED = 'DISPUTE_RESOLVED',          // CA แก้ข้อพิพาทเรียบร้อย

  /* ── Cancellations ── */
  CANCELLED_BY_CUSTOMER = 'CANCELLED_BY_CUSTOMER',     // ลูกค้ายกเลิก (ก่อนนัด)
  CANCELLED_BY_PROVIDER = 'CANCELLED_BY_PROVIDER',     // Provider ยกเลิก
  NO_SHOW = 'NO_SHOW',                   // Provider ไม่มาตามนัด (ลูกค้าแจ้งหลัง 12h)
  REFUNDED = 'REFUNDED',                  // คืนเงินลูกค้าแล้ว

  /* ── Fraud/ban ── */
  BANNED_AND_REFUNDED = 'BANNED_AND_REFUNDED',       // ตรวจพบ collusion — แบนทั้งคู่ + คืนเงิน
}

/**
 * Escrow payment lifecycle — tracks the money, not the booking state.
 *
 * PENDING     → รอชำระ
 * HELD        → เงินถูก hold ไว้ในระบบ (ยังไม่โอนให้ Provider)
 * RELEASED    → โอนเงินให้ Provider เรียบร้อย (หลัง COMPLETED)
 * REFUNDED    → คืนเงินให้ลูกค้า
 * PARTIAL_REFUND → คืนบางส่วน (หลังจบข้อพิพาท)
 * FAILED      → การชำระล้มเหลว
 */
export enum EscrowStatus {
  PENDING = 'PENDING',
  HELD = 'HELD',
  RELEASED = 'RELEASED',
  REFUNDED = 'REFUNDED',
  PARTIAL_REFUND = 'PARTIAL_REFUND',
  FAILED = 'FAILED',
}

/** @deprecated use EscrowStatus. Kept for backward compatibility. */
export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  REFUNDED = 'REFUNDED',
  FAILED = 'FAILED',
}

export enum MarketplaceCategory {
  FOOD = 'FOOD',
  REPAIR = 'REPAIR',
  ELDERLY_CARE = 'ELDERLY_CARE',
  HOME_SERVICES = 'HOME_SERVICES',
  TUTORING = 'TUTORING',
  HANDMADE = 'HANDMADE',
  HEALTH_WELLNESS = 'HEALTH_WELLNESS',
  AGRICULTURE = 'AGRICULTURE',
  FREELANCE = 'FREELANCE',
  COMMUNITY_SHARING = 'COMMUNITY_SHARING',
}

export enum ListingStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PENDING_REVIEW = 'PENDING_REVIEW',
}

export enum MembershipRole {
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
}

/**
 * Dispute status — tracks the dispute resolution lifecycle.
 *
 * OPEN         → ลูกค้าเปิดข้อพิพาท
 * UNDER_REVIEW → Community Admin รับเรื่องแล้ว กำลังสอบสวน
 * RESOLVED_FOR_CUSTOMER  → CA ตัดสินให้ลูกค้า → คืนเงิน
 * RESOLVED_FOR_PROVIDER  → CA ตัดสินให้ Provider → โอนเงิน
 * RESOLVED_PARTIAL       → แก้ไขราคา/คืนบางส่วน
 * ESCALATED    → CA ส่งเรื่องต่อ Super Admin (กรณี fraud/ban)
 * CLOSED       → ปิดเรื่องแล้ว
 */
export enum DisputeStatus {
  OPEN = 'OPEN',
  UNDER_REVIEW = 'UNDER_REVIEW',
  RESOLVED_FOR_CUSTOMER = 'RESOLVED_FOR_CUSTOMER',
  RESOLVED_FOR_PROVIDER = 'RESOLVED_FOR_PROVIDER',
  RESOLVED_PARTIAL = 'RESOLVED_PARTIAL',
  ESCALATED = 'ESCALATED',
  CLOSED = 'CLOSED',
}

/**
 * How the booking price is determined.
 *
 * FIXED    → ราคาตายตัว กำหนดไว้ใน Listing
 * VARIABLE → ประเมินราคาขั้นต้นก่อน อัพเดตได้เมื่อถึงโลเคชั่น (ต้อง CA อนุมัติ)
 */
export enum PricingType {
  FIXED = 'FIXED',
  VARIABLE = 'VARIABLE',
}

export enum NotificationType {
  /* ── Booking lifecycle ── */
  BOOKING_CREATED = 'BOOKING_CREATED',
  BOOKING_PAYMENT_REQUIRED = 'BOOKING_PAYMENT_REQUIRED',
  BOOKING_PAYMENT_HELD = 'BOOKING_PAYMENT_HELD',
  BOOKING_CONFIRMED = 'BOOKING_CONFIRMED',
  BOOKING_IN_PROGRESS = 'BOOKING_IN_PROGRESS',
  BOOKING_COMPLETED_BY_PROVIDER = 'BOOKING_COMPLETED_BY_PROVIDER',  // กรุณายืนยันภายใน 72h
  BOOKING_CONFIRMATION_REMINDER = 'BOOKING_CONFIRMATION_REMINDER',  // เตือนก่อน auto-release
  BOOKING_AUTO_RELEASED = 'BOOKING_AUTO_RELEASED',          // auto-release 72h
  BOOKING_COMPLETED = 'BOOKING_COMPLETED',
  BOOKING_CANCELLED = 'BOOKING_CANCELLED',
  BOOKING_ACCEPTED = 'BOOKING_ACCEPTED',
  BOOKING_REJECTED = 'BOOKING_REJECTED',
  /* ── No-show ── */
  BOOKING_NO_SHOW_WARNING = 'BOOKING_NO_SHOW_WARNING',        // เตือนลูกค้าหลัง 12h
  BOOKING_NO_SHOW_CONFIRMED = 'BOOKING_NO_SHOW_CONFIRMED',
  BOOKING_TIME_EXTENDED = 'BOOKING_TIME_EXTENDED',          // ลูกค้าขยายเวลา
  /* ── Variable pricing ── */
  PRICE_ADJUSTMENT_REQUESTED = 'PRICE_ADJUSTMENT_REQUESTED',     // Provider ขอปรับราคา
  PRICE_ADJUSTMENT_APPROVED = 'PRICE_ADJUSTMENT_APPROVED',
  PRICE_ADJUSTMENT_REJECTED = 'PRICE_ADJUSTMENT_REJECTED',
  /* ── Dispute ── */
  DISPUTE_OPENED = 'DISPUTE_OPENED',
  DISPUTE_UNDER_REVIEW = 'DISPUTE_UNDER_REVIEW',
  DISPUTE_RESOLVED = 'DISPUTE_RESOLVED',
  DISPUTE_ESCALATED = 'DISPUTE_ESCALATED',
  /* ── Provider ── */
  PROVIDER_APPROVED = 'PROVIDER_APPROVED',
  PROVIDER_REJECTED = 'PROVIDER_REJECTED',
  /* ── Promotions / Coupons ── */
  PROMOTION_PENDING_APPROVAL = 'PROMOTION_PENDING_APPROVAL',    // Provider ส่งโปรให้ CA approve
  PROMOTION_APPROVED = 'PROMOTION_APPROVED',            // CA อนุมัติโปรแล้ว
  PROMOTION_REJECTED = 'PROMOTION_REJECTED',
  PROMOTION_BROADCAST = 'PROMOTION_BROADCAST',           // CA broadcast → แจ้งลูกค้าในชุมชน
  PROMOTION_EXPIRING_SOON = 'PROMOTION_EXPIRING_SOON',       // เตือน Provider ว่าโปรจะหมดอายุ
  PROMOTION_EXPIRED = 'PROMOTION_EXPIRED',
  /* ── Tax updates ── */
  TAX_CONFIG_UPDATED = 'TAX_CONFIG_UPDATED',            // SA อัพเดต tax rate → แจ้งทุก CA
  /* ── Other ── */
  REVIEW_RECEIVED = 'REVIEW_RECEIVED',
  ACCOUNT_BANNED = 'ACCOUNT_BANNED',
}

export enum TrialStatus {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  NOT_STARTED = 'NOT_STARTED',
}

/**
 * Status of a Community Admin's request to manage an additional community.
 * Requires Super Admin approval before the admin can create/manage the new community.
 *
 * PENDING   — รอ Super Admin อนุมัติ
 * APPROVED  — อนุมัติแล้ว สามารถสร้างตลาดชุมชนใหม่ได้
 * REJECTED  — ไม่อนุมัติ
 * REVOKED   — ถูกเพิกถอนสิทธิ์ภายหลัง (Super Admin)
 */
export enum CommunityAdminGrantStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  REVOKED = 'REVOKED',
}

/**
 * Type of discount a Provider can offer.
 *
 * PERCENTAGE  — ลด % จากราคาปกติ (เช่น ลด 20%)
 * FIXED_AMOUNT — ลดจำนวนเงินคงที่ (เช่น ลด ฿50)
 * COUPON_CODE — คูปองที่ลูกค้าต้องกรอกโค้ด
 * BROADCAST   — Community Admin ประกาศโปรโมชั่นเป็น card ใน community landing page
 */
export enum PromotionType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED_AMOUNT = 'FIXED_AMOUNT',
  COUPON_CODE = 'COUPON_CODE',
  BROADCAST = 'BROADCAST',
}

/**
 * Lifecycle of a promotion/campaign.
 *
 * DRAFT     — Provider สร้างแต่ยังไม่ส่ง CA
 * PENDING   — รอ Community Admin อนุมัติ
 * APPROVED  — CA อนุมัติแล้ว ใช้ได้เมื่อถึงวันเริ่ม
 * ACTIVE    — กำลังดำเนินการ (อยู่ในช่วงเวลา)
 * REJECTED  — CA ไม่อนุมัติ
 * EXPIRED   — หมดอายุตามวันที่กำหนด
 * CANCELLED — Provider หรือ CA ยกเลิกก่อนหมดอายุ
 */
export enum PromotionStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  ACTIVE = 'ACTIVE',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED',
}

/**
 * Type of tax applied to a booking.
 *
 * VAT        — ภาษีมูลค่าเพิ่ม (7% standard ในไทย)
 * WITHHOLDING — ภาษีหัก ณ ที่จ่าย (ถ้ารายได้เกิน threshold)
 * CUSTOM     — ภาษีหรือค่าธรรมเนียมอื่นๆ ที่ SA กำหนด
 */
export enum TaxType {
  VAT = 'VAT',
  WITHHOLDING = 'WITHHOLDING',
  CUSTOM = 'CUSTOM',
}

/**
 * Determines which part of the booking amount this tax/fee applies to.
 *
 * TOTAL_AMOUNT    — คิดจากยอดรวมทั้งหมดก่อนหักส่วนลด
 * AFTER_DISCOUNT  — คิดจากยอดหลังหักส่วนลดแล้ว (ปกติใช้ VAT)
 * PROVIDER_PAYOUT — คิดจากยอดที่จะโอนให้ Provider (เช่น withholding)
 * PLATFORM_FEE    — คิดจาก commission ของ platform
 */
export enum TaxApplyTo {
  TOTAL_AMOUNT = 'TOTAL_AMOUNT',
  AFTER_DISCOUNT = 'AFTER_DISCOUNT',
  PROVIDER_PAYOUT = 'PROVIDER_PAYOUT',
  PLATFORM_FEE = 'PLATFORM_FEE',
}

// ─── Feature: Invite Link System ────────────────────────────────────────────

/**
 * Approval status for a member joining a community via invite or direct signup.
 * Customers: auto-approved (APPROVED) at signup.
 * Providers/Traders: start as PENDING, require CA or Super Admin approval.
 */
export enum MemberApprovalStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

// ─── Feature: Commission & Revenue Share ────────────────────────────────────

/**
 * Lifecycle of a CommissionLedger entry (one per booking).
 * PENDING   = booking paid; SETTLED = booking COMPLETED; CANCELLED = refunded.
 */
export enum CommissionLedgerStatus {
  PENDING = 'PENDING',
  SETTLED = 'SETTLED',
  CANCELLED = 'CANCELLED',
}

/**
 * Lifecycle of a monthly payout to a Community Admin (franchise revenue share).
 * Flow: DRAFT → PENDING_APPROVAL → APPROVED → PROCESSING → PAID | FAILED
 */
export enum PayoutStatus {
  DRAFT = 'DRAFT',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED',
  PROCESSING = 'PROCESSING',
  PAID = 'PAID',
  FAILED = 'FAILED',
}

// ─── Feature: Franchise-as-a-Platform ───────────────────────────────────────

/**
 * 10 Business Templates — one per MarketplaceCategory.
 * Each template defines default catalog schema, order flow, and recommended modules.
 */
export enum BusinessTemplateCode {
  FOOD = 'FOOD',
  REPAIR = 'REPAIR',
  HOME_SERVICES = 'HOME_SERVICES',
  TUTORING = 'TUTORING',
  ELDERLY_CARE = 'ELDERLY_CARE',
  HANDMADE = 'HANDMADE',
  HEALTH_WELLNESS = 'HEALTH_WELLNESS',
  AGRICULTURE = 'AGRICULTURE',
  FREELANCE = 'FREELANCE',
  COMMUNITY_SHARING = 'COMMUNITY_SHARING',
}

/**
 * Platform module codes — capability units that can be enabled/disabled per market or store.
 * Core modules are required for every market; optional modules can be added as plugins.
 */
export enum ModuleCode {
  // Commerce
  POS = 'POS',
  ONLINE_ORDER = 'ONLINE_ORDER',
  PROMOTIONS = 'PROMOTIONS',
  LOYALTY = 'LOYALTY',
  RECEIPT = 'RECEIPT',
  // Catalog & Inventory
  CATALOG = 'CATALOG',
  INVENTORY = 'INVENTORY',
  SUPPLIER = 'SUPPLIER',
  // Services
  BOOKING = 'BOOKING',
  DISPATCH = 'DISPATCH',
  JOB_TRACKING = 'JOB_TRACKING',
  // Marketplace
  MARKETPLACE = 'MARKETPLACE',
  SEARCH = 'SEARCH',
  REVIEWS = 'REVIEWS',
  ANNOUNCEMENTS = 'ANNOUNCEMENTS',
  // Finance
  EXPORT = 'EXPORT',
  STATEMENT = 'STATEMENT',
}

export enum ModuleCategory {
  COMMERCE = 'COMMERCE',
  CATALOG = 'CATALOG',
  SERVICES = 'SERVICES',
  MARKETPLACE = 'MARKETPLACE',
  FINANCE = 'FINANCE',
}

/** Subscription plan tier for a Market (Community). */
export enum PlanType {
  STARTER = 'STARTER',
  GROWTH = 'GROWTH',
  PRO = 'PRO',
}

/** Operational status of a Store's membership in a specific Market. */
export enum StoreMarketStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
}

/** How a Store tracks its product/service stock. */
export enum InventoryPolicy {
  NONE = 'NONE',       // บริการ / ไม่ต้องนับ
  COUNT = 'COUNT',     // นับชิ้น/ล็อต
  INGREDIENT = 'INGREDIENT', // นับวัตถุดิบ (ร้านอาหาร)
}

// ─── Feature: Delivery / Logistics (future-ready) ───────────────────────────

/**
 * Shipping/delivery status for cross-community or delivery-required orders.
 * NOT_APPLICABLE = no delivery needed (in-person service / same-location).
 */
export enum DeliveryStatus {
  NOT_APPLICABLE = 'NOT_APPLICABLE',
  PENDING = 'PENDING',
  PICKED_UP = 'PICKED_UP',
  IN_TRANSIT = 'IN_TRANSIT',
  DELIVERED = 'DELIVERED',
  FAILED = 'FAILED',
}

/**
 * Status of a multi-item cart order (CART-7).
 */
export enum OrderStatus {
  PENDING_PAYMENT = 'PENDING_PAYMENT',
  PAID            = 'PAID',
  PROCESSING      = 'PROCESSING',
  READY           = 'READY',
  COMPLETED       = 'COMPLETED',
  CANCELLED       = 'CANCELLED',
}

// ─── Feature: Return / Refund System (RETURN-1) ─────────────────────────────

/**
 * Reason a customer is requesting a return.
 * Applies to cart orders (physical goods). Services use dispute flow.
 */
export enum ReturnReason {
  NOT_AS_DESCRIBED = 'NOT_AS_DESCRIBED', // สินค้าไม่ตรงปก
  DAMAGED          = 'DAMAGED',          // สินค้าเสียหาย / ชำรุด
  WRONG_ITEM       = 'WRONG_ITEM',       // ได้รับสินค้าผิด
  MISSING_ITEM     = 'MISSING_ITEM',     // ได้รับของไม่ครบ
  OTHER            = 'OTHER',            // อื่นๆ
}

/**
 * Lifecycle of a return request.
 * PENDING → UNDER_REVIEW → APPROVED → REFUNDED
 *                        → REJECTED
 */
export enum ReturnStatus {
  PENDING      = 'PENDING',       // รอการตรวจสอบ
  UNDER_REVIEW = 'UNDER_REVIEW',  // Community Admin กำลังตรวจสอบ
  APPROVED     = 'APPROVED',      // อนุมัติ — รอโอนเงินคืน
  REFUNDED     = 'REFUNDED',      // คืนเงินแล้ว
  REJECTED     = 'REJECTED',      // ปฏิเสธ
}

// ─── Feature: Provider Vacation / Temporary Closure (VAC-1) ─────────────────

/**
 * Operational state of a provider's shop/storefront.
 * OPEN    = ให้บริการตามปกติ
 * VACATION = หยุดพักร้อนชั่วคราว — แสดง banner + popup ให้ลูกค้า
 * CLOSED  = ปิดกิจการ (ถาวร)
 */
export enum ShopStatus {
  OPEN     = 'OPEN',
  VACATION = 'VACATION',
  CLOSED   = 'CLOSED',
}

// ─── Feature: Provider Subscription Plans (SUB-1) ───────────────────────────

/**
 * Subscription tier for a Provider account.
 * FREE      = ฟรี (default)
 * BASIC     = พื้นฐาน (299 THB/mo)
 * PRO       = โปร (699 THB/mo)
 * ENTERPRISE = องค์กร (1,999 THB/mo)
 */
export enum SubscriptionTier {
  FREE       = 'FREE',
  BASIC      = 'BASIC',
  PRO        = 'PRO',
  ENTERPRISE = 'ENTERPRISE',
}

// ─── Feature: Report & Flag System (REPORT-1) ────────────────────────────────

export enum ReportType {
  LISTING  = 'LISTING',
  PROVIDER = 'PROVIDER',
  REVIEW   = 'REVIEW',
  MESSAGE  = 'MESSAGE',
}

export enum ReportReason {
  SPAM          = 'SPAM',
  INAPPROPRIATE = 'INAPPROPRIATE',
  FAKE          = 'FAKE',
  SCAM          = 'SCAM',
  HARASSMENT    = 'HARASSMENT',
  OTHER         = 'OTHER',
}

export enum ReportStatus {
  PENDING   = 'PENDING',
  REVIEWED  = 'REVIEWED',
  RESOLVED  = 'RESOLVED',
  DISMISSED = 'DISMISSED',
}
