'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { returnsApi } from '@/lib/api'

// ─── Customer hooks ────────────────────────────────────────────────────────────

export function useOrderReturn(orderId: string | undefined) {
  return useQuery({
    queryKey: ['return', 'order', orderId],
    queryFn: () => returnsApi.getByOrder(orderId!),
    enabled: !!orderId,
  })
}

export function useCreateReturn() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (dto: {
      orderId: string
      reason: string
      description: string
      evidenceImages?: string[]
    }) => returnsApi.create(dto),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ['return', 'order', variables.orderId] })
    },
  })
}

// ─── Admin hooks ───────────────────────────────────────────────────────────────

export function useAdminReturns(params?: { status?: string; page?: number; limit?: number }) {
  return useQuery({
    queryKey: ['returns', 'admin', params],
    queryFn: () => returnsApi.listAll(params),
  })
}

export function useUpdateReturnStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      ...dto
    }: { id: string; status: string; refundAmount?: number; resolutionNote?: string }) =>
      returnsApi.updateStatus(id, dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['returns', 'admin'] })
    },
  })
}
