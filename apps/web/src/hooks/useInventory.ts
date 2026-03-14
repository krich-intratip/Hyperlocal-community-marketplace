/**
 * useInventory.ts — INVENTORY-1 Provider Inventory Management hooks
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { inventoryApi, type InventoryListing } from '@/lib/api'

const USE_REAL_API = Boolean(process.env.NEXT_PUBLIC_API_BASE_URL)

// ── Mock listings ──────────────────────────────────────────────────────────────

const MOCK_INVENTORY: InventoryListing[] = [
  { id: '1',  title: 'อาหารกล่องข้าวไข่ดาว',    category: 'FOOD',            price: 80,   priceUnit: 'กล่อง',   status: 'ACTIVE',   stockQty: 24,  lowStockThreshold: 5,  images: null, isPromoted: true,  communityId: '1' },
  { id: '2',  title: 'ผักออร์แกนิคสด',           category: 'FOOD',            price: 150,  priceUnit: 'ชุด',     status: 'ACTIVE',   stockQty: 4,   lowStockThreshold: 5,  images: null, isPromoted: false, communityId: '1' },
  { id: '3',  title: 'ซ่อมพัดลม / เครื่องใช้ไฟฟ้า', category: 'REPAIR',       price: 300,  priceUnit: 'ครั้ง',   status: 'ACTIVE',   stockQty: null, lowStockThreshold: 5, images: null, isPromoted: false, communityId: '2' },
  { id: '4',  title: 'อาหารคลีนลดน้ำหนัก',       category: 'HEALTH_WELLNESS', price: 120,  priceUnit: 'กล่อง',   status: 'ACTIVE',   stockQty: 2,   lowStockThreshold: 5,  images: null, isPromoted: true,  communityId: '1' },
  { id: '5',  title: 'สอนภาษาอังกฤษออนไลน์',     category: 'TUTORING',        price: 500,  priceUnit: 'ชั่วโมง', status: 'ACTIVE',   stockQty: null, lowStockThreshold: 5, images: null, isPromoted: false, communityId: '3' },
  { id: '6',  title: 'นมวัวสดจากฟาร์ม',           category: 'FOOD',            price: 60,   priceUnit: 'ขวด',    status: 'INACTIVE', stockQty: 0,   lowStockThreshold: 5,  images: null, isPromoted: false, communityId: '4' },
  { id: '7',  title: 'ทำความสะอาดบ้าน',           category: 'HOME_SERVICES',   price: 600,  priceUnit: 'ครั้ง',   status: 'ACTIVE',   stockQty: null, lowStockThreshold: 5, images: null, isPromoted: false, communityId: '2' },
  { id: '8',  title: 'กระเป๋าถักมือ',             category: 'HANDMADE',        price: 450,  priceUnit: 'ใบ',      status: 'ACTIVE',   stockQty: 12,  lowStockThreshold: 3,  images: null, isPromoted: false, communityId: '5' },
]

// ── Hooks ──────────────────────────────────────────────────────────────────────

export function useProviderInventory() {
  return useQuery<InventoryListing[]>({
    queryKey: ['provider', 'inventory'],
    queryFn: async () => {
      if (!USE_REAL_API) return MOCK_INVENTORY
      const res = await inventoryApi.getMyListings()
      return (res.data ?? res) as unknown as InventoryListing[]
    },
    staleTime: 60_000,
  })
}

export function useProviderLowStock() {
  return useQuery<InventoryListing[]>({
    queryKey: ['provider', 'inventory', 'low-stock'],
    queryFn: async () => {
      if (!USE_REAL_API) return MOCK_INVENTORY.filter(l => l.stockQty !== null && l.stockQty <= l.lowStockThreshold)
      const res = await inventoryApi.getLowStock()
      return (res.data ?? res) as unknown as InventoryListing[]
    },
    staleTime: 60_000,
  })
}

export function useUpdateStock() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { stockQty: number | null; lowStockThreshold?: number } }) =>
      inventoryApi.updateStock(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['provider', 'inventory'] })
    },
  })
}
