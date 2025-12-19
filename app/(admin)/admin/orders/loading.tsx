export default function AdminOrdersLoading() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-48 bg-zinc-800 rounded animate-pulse" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 bg-zinc-900/50 border border-zinc-800/50 rounded-xl animate-pulse" />
        ))}
      </div>
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-zinc-900/50 border border-zinc-800/50 rounded-xl animate-pulse" />
        ))}
      </div>
    </div>
  )
}
