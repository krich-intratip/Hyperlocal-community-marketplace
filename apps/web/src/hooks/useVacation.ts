'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { vacationApi } from '@/lib/api'

export function useSetVacation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (dto: {
      shopStatus: 'OPEN' | 'VACATION' | 'CLOSED'
      vacationMessage?: string
      vacationUntil?: string
    }) => vacationApi.set(dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['provider', 'me'] })
      qc.invalidateQueries({ queryKey: ['providers'] })
    },
  })
}
