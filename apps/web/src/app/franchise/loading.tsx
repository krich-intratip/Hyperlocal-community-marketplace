export default function FranchiseLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin" />
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">กำลังโหลด...</p>
      </div>
    </div>
  )
}
