'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { couponApi, type CouponV2, type CouponValidation } from '@/lib/api'
import { useAuthStore } from '@/store/auth.store'

const USE_REAL_API = Boolean(process.env.NEXT_PUBLIC_API_BASE_URL)

const MOCK_COUPONS: CouponV2[] = [
  {
    id: '1', code: 'WELCOME50', description: 'ส่วนลดต้อนรับสมาชิกใหม่',
    type: 'FIXED', discountValue: 50, minOrderAmount: 200, maxDiscountAmount: null,
    scope: 'PLATFORM', providerId: null, maxUses: 1000, maxUsesPerUser: 1,
    usedCount: 342, isActive: true, startsAt: null,
    expiresAt: '2026-12-31T23:59:59.000Z', createdAt: new Date().toISOString(),
  },
  {
    id: '2', code: 'SUMMER20', description: 'ลด 20% ฤดูร้อน',
    type: 'PERCENT', discountValue: 20, minOrderAmount: 300, maxDiscountAmount: 150,
    scope: 'PLATFORM', providerId: null, maxUses: 500, maxUsesPerUser: 1,
    usedCount: 128, isActive: true, startsAt: null,
    expiresAt: '2026-06-30T23:59:59.000Z', createdAt: new Date().toISOString(),
  },
  {
    id: '3', code: 'FREESHIP', description: 'ฟรีค่าส่ง',
    type: 'FREE_DELIVERY', discountValue: 0, minOrderAmount: 100, maxDiscountAmount: null,
    scope: 'PLATFORM', providerId: null, maxUses: null, maxUsesPerUser: 3,
    usedCount: 89, isActive: false, startsAt: null,
    expiresAt: null, createdAt: new Date().toISOString(),
  },
]

export function useAdminCoupons() {
  const user = useAuthStore(s => s.user)
  return useQuery<CouponV2[]>({
    queryKey: ['coupons', 'admin'],
    queryFn: async () => {
      if (!USE_REAL_API) return MOCK_COUPONS
      const res = await couponApi.list()
      return (res.data ?? res) as unknown as CouponV2[]
    },
    enabled: !!user && ['admin', 'superadmin'].includes(user.role),
    staleTime: 60_000,
  })
}

export function useValidateCoupon() {
  return useMutation<CouponValidation, Error, { code: string; orderTotal: number; providerId?: string }>({
    mutationFn: async ({ code, orderTotal, providerId }) => {
      if (!USE_REAL_API) {
        // Mock validation
        const mock = MOCK_COUPONS.find(c => c.code === code.toUpperCase() && c.isActive)
        if (!mock) return { valid: false, discountAmount: 0, message: 'ไม่พบคูปองหรือคูปองหมดอายุ' }
        if (orderTotal < mock.minOrderAmount) {
          return { valid: false, discountAmount: 0, message: `ยอดสั่งซื้อขั้นต่ำ ฿${mock.minOrderAmount}` }
        }
        const discount =
          mock.type === 'FIXED' ? mock.discountValue
          : mock.type === 'PERCENT' ? Math.min((mock.discountValue / 100) * orderTotal, mock.maxDiscountAmount ?? Infinity)
          : 0
        return {
          valid: true,
          coupon: mock,
          discountAmount: discount,
          message: `ลด ${mock.type === 'PERCENT' ? mock.discountValue + '%' : '฿' + mock.discountValue}`,
        }
      }
      const res = await couponApi.validate(code, orderTotal, providerId)
      return (res.data ?? res) as unknown as CouponValidation
    },
  })
}

export function useCreateCoupon() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (dto: Parameters<typeof couponApi.create>[0]) => couponApi.create(dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['coupons'] }),
  })
}

export function useToggleCoupon() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) =>
      active ? couponApi.deactivate(id) : couponApi.activate(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['coupons'] }),
  })
}
