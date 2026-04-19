export default function AppLoading() {
  return (
    <div className="flex flex-col gap-4 pt-[2px]">
      {/* Page title placeholder */}
      <div className="pb-2">
        <div className="h-3.5 w-28 skeleton-shimmer rounded-full" />
        <div className="h-7 w-36 skeleton-shimmer rounded-full mt-2" />
      </div>

      {/* Hero card skeleton */}
      <div className="bg-white/85 rounded-xl p-6 border border-purple-100/50 shadow-card space-y-3">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-3 w-24 skeleton-shimmer rounded-full" />
            <div className="h-12 w-20 skeleton-shimmer rounded-lg" />
            <div className="h-3 w-16 skeleton-shimmer rounded-full" />
          </div>
          <div className="w-[100px] h-[100px] skeleton-shimmer rounded-full" />
        </div>
        <div className="flex gap-2 mt-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex-1 h-2 skeleton-shimmer rounded-full" />
          ))}
        </div>
      </div>

      {/* Progress card skeleton */}
      <div className="bg-white/85 rounded-xl p-5 border border-purple-100/50 shadow-card space-y-3">
        <div className="flex items-center justify-between">
          <div className="space-y-1.5">
            <div className="h-3 w-16 skeleton-shimmer rounded-full" />
            <div className="h-8 w-28 skeleton-shimmer rounded-lg" />
          </div>
          <div className="w-12 h-12 skeleton-shimmer rounded-full" />
        </div>
        <div className="h-2 skeleton-shimmer rounded-full" />
      </div>

      {/* Two stat cards */}
      <div className="grid grid-cols-2 gap-3">
        {[0, 1].map((i) => (
          <div key={i} className="bg-white/85 rounded-xl p-4 border border-purple-100/50 shadow-card space-y-1.5">
            <div className="h-3 w-14 skeleton-shimmer rounded-full" />
            <div className="h-8 w-20 skeleton-shimmer rounded-lg" />
            <div className="h-2.5 w-16 skeleton-shimmer rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
