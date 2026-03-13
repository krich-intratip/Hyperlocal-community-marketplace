import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ordersApi } from '@/lib/api'
import type { CreateOrderDto, Order } from '@/types'

// ─── Query keys ───────────────────────────────────────────────────────────────

export const orderKeys = {
  all:              ['orders'] as const,
  my:               () => [...orderKeys.all, 'my'] as const,
  providerIncoming: () => [...orderKeys.all, 'provider-incoming'] as const,
  one:              (id: string) => [...orderKeys.all, id] as const,
  delivery:         (id: string) => [...orderKeys.all, id, 'delivery'] as const,
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

/** List all orders for the authenticated customer */
export function useMyOrders() {
  return useQuery<Order[]>({
    queryKey: orderKeys.my(),
    queryFn: () => ordersApi.listMy().then((res) => res.data),
  })
}

/** List all orders assigned to the authenticated provider */
export function useProviderOrders() {
  return useQuery<Order[]>({
    queryKey: orderKeys.providerIncoming(),
    queryFn: () => ordersApi.listProviderIncoming().then((res) => res.data),
  })
}

/** Get a single order by ID */
export function useOrder(id: string) {
  return useQuery<Order>({
    queryKey: orderKeys.one(id),
    queryFn: () => ordersApi.get(id).then((res) => res.data),
    enabled: !!id,
  })
}

/** Get delivery info + tracking ID for an order */
export function useOrderDelivery(id: string) {
  return useQuery({
    queryKey: orderKeys.delivery(id),
    queryFn: () => ordersApi.getDelivery(id).then((res) => res.data),
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
    mutationFn: (dto: CreateOrderDto) => ordersApi.create(dto).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all })
    },
  })
}

/**
 * Update order status (role-gated on the server).
 * On success, invalidates the specific order + lists.
 */
export function useUpdateOrderStatus(orderId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (status: string) => ordersApi.updateStatus(orderId, status).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.one(orderId) })
      queryClient.invalidateQueries({ queryKey: orderKeys.providerIncoming() })
      queryClient.invalidateQueries({ queryKey: orderKeys.my() })
    },
  })
}
