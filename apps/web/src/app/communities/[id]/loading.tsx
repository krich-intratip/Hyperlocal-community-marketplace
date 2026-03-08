export default function CommunityDetailLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-slate-900 dark:to-slate-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-5">
            <div className="rounded-3xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-6 space-y-4 animate-pulse">
              <div className="h-8 w-2/3 bg-slate-100 dark:bg-slate-700 rounded-xl" />
              <div className="h-4 w-1/3 bg-slate-100 dark:bg-slate-700 rounded-lg" />
              <div className="grid grid-cols-3 gap-3 mt-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-16 bg-slate-100 dark:bg-slate-700 rounded-2xl" />
                ))}
              </div>
            </div>
            <div className="rounded-3xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-6 space-y-3 animate-pulse">
              <div className="h-5 w-40 bg-slate-100 dark:bg-slate-700 rounded-lg" />
              {[1, 2].map(i => (
                <div key={i} className="h-20 bg-slate-100 dark:bg-slate-700 rounded-2xl" />
              ))}
            </div>
          </div>
          {/* Right column */}
          <div className="space-y-5">
            <div className="rounded-3xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-6 space-y-3 animate-pulse">
              <div className="h-5 w-32 bg-slate-100 dark:bg-slate-700 rounded-lg" />
              <div className="h-10 bg-slate-100 dark:bg-slate-700 rounded-xl" />
              <div className="h-10 bg-slate-100 dark:bg-slate-700 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
