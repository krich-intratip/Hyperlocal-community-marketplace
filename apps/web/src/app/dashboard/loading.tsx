import { PageSkeleton } from '@/components/skeleton'

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <div className="h-16 border-b border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 animate-pulse" />
      <PageSkeleton />
    </div>
  )
}
