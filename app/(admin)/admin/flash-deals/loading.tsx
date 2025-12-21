export default function FlashDealsLoading() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-48 bg-[#1a1a1a] rounded animate-pulse" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-[#1a1a1a] rounded-xl animate-pulse" />
        ))}
      </div>
      <div className="h-96 bg-[#1a1a1a] rounded-xl animate-pulse" />
    </div>
  )
}
