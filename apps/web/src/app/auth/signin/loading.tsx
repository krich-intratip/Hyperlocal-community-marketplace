export default function SignInLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
      <div className="w-full max-w-md px-6 space-y-5 animate-pulse">
        <div className="h-10 w-48 bg-slate-100 dark:bg-slate-800 rounded-xl mx-auto" />
        <div className="h-5 w-64 bg-slate-100 dark:bg-slate-800 rounded-lg mx-auto" />
        <div className="space-y-3 mt-6">
          <div className="h-12 bg-slate-100 dark:bg-slate-800 rounded-xl" />
          <div className="h-12 bg-slate-100 dark:bg-slate-800 rounded-xl" />
          <div className="h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl" />
        </div>
      </div>
    </div>
  )
}
