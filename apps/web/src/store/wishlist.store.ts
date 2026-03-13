import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface WishlistItem {
  id: string
  title: string
  price: number
  priceUnit: string
  image: string
  provider: string
  community: string
  category: string
  rating: number
  addedAt: string
}

interface WishlistStore {
  items: WishlistItem[]
  add: (item: WishlistItem) => void
  remove: (id: string) => void
  toggle: (item: WishlistItem) => void
  has: (id: string) => boolean
  count: () => number
  clear: () => void
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      add: (item) =>
        set((s) => ({
          items: s.items.some((i) => i.id === item.id)
            ? s.items
            : [{ ...item, addedAt: new Date().toISOString() }, ...s.items],
        })),

      remove: (id) =>
        set((s) => ({ items: s.items.filter((i) => i.id !== id) })),

      toggle: (item) => {
        const { has, add, remove } = get()
        has(item.id) ? remove(item.id) : add(item)
      },

      has: (id) => get().items.some((i) => i.id === id),

      count: () => get().items.length,

      clear: () => set({ items: [] }),
    }),
    { name: 'chm-wishlist' },
  ),
)
