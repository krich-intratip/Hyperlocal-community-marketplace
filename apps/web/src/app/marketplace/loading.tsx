export default function MarketplaceLoading() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20">
        {/* Search bar skeleton */}
        <div className="h-12 w-full bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse mb-8" />
        {/* Grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden animate-pulse">
              <div className="h-36 bg-slate-100 dark:bg-slate-800" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-3/4" />
                <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-1/2" />
                <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
