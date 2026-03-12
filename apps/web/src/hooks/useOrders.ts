import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ordersApi } from '@/lib/api'
import type { CreateOrderDto } from '@/types'

// ─── Query keys ───────────────────────────────────────────────────────────────

export const orderKeys = {
  all:  ['orders'] as const,
  my:   () => [...orderKeys.all, 'my'] as const,
  one:  (id: string) => [...orderKeys.all, id] as const,
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

/** List all orders for the authenticated customer */
export function useMyOrders() {
  return useQuery({
    queryKey: orderKeys.my(),
    queryFn: () => ordersApi.listMy(),
  })
}

/** Get a single order by ID */
export function useOrder(id: string) {
  return useQuery({
    queryKey: orderKeys.one(id),
    queryFn: () => ordersApi.get(id),
    enabled: !!id,
  })
}

/**
 * Create a new multi-item order from the cart.
 * On success, invalidates "orders" queries so lists refresh automatically.
 */
export function useCreateOrder() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (dto: CreateOrderDto) => ordersApi.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all })
    },
  })
}
