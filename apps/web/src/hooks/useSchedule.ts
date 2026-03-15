'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { scheduleApi, type DaySchedule, type ProviderHolidayEntry, type PublicSchedule } from '@/lib/api'
import { useAuthStore } from '@/store/auth.store'

const USE_REAL_API = Boolean(process.env.NEXT_PUBLIC_API_BASE_URL)

const DEFAULT_SCHEDULE: DaySchedule[] = [
  { dayOfWeek: 0, isOpen: false, openTime: '09:00', closeTime: '18:00' },
  { dayOfWeek: 1, isOpen: true,  openTime: '09:00', closeTime: '18:00' },
  { dayOfWeek: 2, isOpen: true,  openTime: '09:00', closeTime: '18:00' },
  { dayOfWeek: 3, isOpen: true,  openTime: '09:00', closeTime: '18:00' },
  { dayOfWeek: 4, isOpen: true,  openTime: '09:00', closeTime: '18:00' },
  { dayOfWeek: 5, isOpen: true,  openTime: '09:00', closeTime: '18:00' },
  { dayOfWeek: 6, isOpen: false, openTime: '09:00', closeTime: '18:00' },
]

export function useMySchedule() {
  const user = useAuthStore(s => s.user)
  return useQuery<DaySchedule[]>({
    queryKey: ['schedule', 'me'],
    queryFn: async () => {
      if (!USE_REAL_API) return DEFAULT_SCHEDULE
      const res = await scheduleApi.getMySchedule()
      return (res.data ?? res) as unknown as DaySchedule[]
    },
    enabled: !!user,
    staleTime: 5 * 60_000,
  })
}

export function useMyHolidays() {
  const user = useAuthStore(s => s.user)
  return useQuery<ProviderHolidayEntry[]>({
    queryKey: ['schedule', 'holidays'],
    queryFn: async () => {
      if (!USE_REAL_API) return []
      const res = await scheduleApi.getMyHolidays()
      return (res.data ?? res) as unknown as ProviderHolidayEntry[]
    },
    enabled: !!user,
    staleTime: 5 * 60_000,
  })
}

export function useUpdateSchedule() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (days: DaySchedule[]) => scheduleApi.setMySchedule(days),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['schedule'] }),
  })
}

export function useAddHoliday() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ date, reason }: { date: string; reason?: string }) =>
      scheduleApi.addHoliday(date, reason),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['schedule', 'holidays'] }),
  })
}

export function useRemoveHoliday() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (date: string) => scheduleApi.removeHoliday(date),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['schedule', 'holidays'] }),
  })
}

export function useProviderPublicSchedule(providerId: string) {
  return useQuery<PublicSchedule>({
    queryKey: ['schedule', 'public', providerId],
    queryFn: async () => {
      if (!USE_REAL_API) return {
        schedule: DEFAULT_SCHEDULE,
        holidays: [],
        todayOpen: true,
        todayHours: '09:00 – 18:00',
      }
      const res = await scheduleApi.getPublicSchedule(providerId)
      return (res.data ?? res) as unknown as PublicSchedule
    },
    enabled: !!providerId,
    staleTime: 5 * 60_000,
  })
}
