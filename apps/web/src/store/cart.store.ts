import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string
  listingId: string
  listingTitle: string
  listingImage: string
  provider: string
  providerId: string
  providerAvatar: string
  community: string
  menuName?: string
  price: number
  unit: string
  qty: number
  note?: string
}

interface CartState {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'id' | 'qty'> & { id?: string; qty?: number }) => void
  removeItem: (id: string) => void
  updateQty: (id: string, qty: number) => void
  updateNote: (id: string, note: string) => void
  clearCart: () => void
  clearProvider: (providerId: string) => void
  totalItems: () => number
  totalPrice: () => number
  itemsByProvider: () => Record<string, CartItem[]>
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (incoming) => {
        const key = incoming.menuName
          ? `${incoming.listingId}__${incoming.menuName}`
          : incoming.listingId
        set((s) => {
          const existing = s.items.find((i) => i.id === key)
          if (existing) {
            return {
              items: s.items.map((i) =>
                i.id === key ? { ...i, qty: i.qty + (incoming.qty ?? 1) } : i
              ),
            }
          }
          return {
            items: [...s.items, { ...incoming, id: key, qty: incoming.qty ?? 1 }],
          }
        })
      },

      removeItem: (id) =>
        set((s) => ({ items: s.items.filter((i) => i.id !== id) })),

      updateQty: (id, qty) =>
        set((s) => ({
          items: qty <= 0
            ? s.items.filter((i) => i.id !== id)
            : s.items.map((i) => (i.id === id ? { ...i, qty } : i)),
        })),

      updateNote: (id, note) =>
        set((s) => ({
          items: s.items.map((i) => (i.id === id ? { ...i, note } : i)),
        })),

      clearCart: () => set({ items: [] }),

      clearProvider: (providerId) =>
        set((s) => ({ items: s.items.filter((i) => i.providerId !== providerId) })),

      totalItems: () => get().items.reduce((sum, i) => sum + i.qty, 0),

      totalPrice: () => get().items.reduce((sum, i) => sum + i.price * i.qty, 0),

      itemsByProvider: () =>
        get().items.reduce<Record<string, CartItem[]>>((acc, item) => {
          if (!acc[item.providerId]) acc[item.providerId] = []
          acc[item.providerId].push(item)
          return acc
        }, {}),
    }),
    { name: 'chm-cart' }
  )
)
