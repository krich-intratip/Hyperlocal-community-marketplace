'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { systemApi } from '@/lib/api'

const USE_REAL_API = !!process.env.NEXT_PUBLIC_API_BASE_URL

export const systemModeKey = ['system', 'mode'] as const

/** Returns current system mode. Defaults to training mode when API is unavailable. */
export function useSystemMode() {
  return useQuery({
    queryKey: systemModeKey,
    queryFn: async () => {
      if (!USE_REAL_API) return { mode: 'training' as const, isTrainingMode: true }
      try {
        const res = await systemApi.getMode()
        return res.data
      } catch {
        // fail-safe: if API is down, default to training mode (never accidentally drop the banner)
        return { mode: 'training' as const, isTrainingMode: true }
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes — mode doesn't change frequently
  })
}

/** Super Admin mutation — toggle training mode on or off. */
export function useSetSystemMode() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (trainingMode: boolean) => systemApi.setMode(trainingMode),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: systemModeKey })
    },
  })
}
