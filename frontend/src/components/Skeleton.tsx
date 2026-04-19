export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`skeleton-shimmer rounded-md ${className}`} />;
}

export function CardSkeleton() {
  return (
    <div className="bg-oria-card rounded-xl p-5 border border-oria shadow-card space-y-3">
      <Skeleton className="h-3 w-1/3" />
      <Skeleton className="h-9 w-2/3" />
      <Skeleton className="h-3 w-1/2" />
      <Skeleton className="h-2 w-full mt-1" />
    </div>
  );
}

export function ErrorCard({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="bg-oria-card rounded-xl p-6 border border-oria shadow-card flex flex-col items-center gap-3 text-center">
      <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
        </svg>
      </div>
      <div>
        <p className="text-sm font-semibold text-text-primary">Failed to load</p>
        <p className="text-xs text-text-muted mt-0.5">Check your connection and try again</p>
      </div>
      <button
        onClick={onRetry}
        className="text-sm font-semibold text-white gradient-brand px-5 py-2 rounded-lg shadow-button cursor-pointer border-none min-h-[44px]"
      >
        Retry
      </button>
    </div>
  );
}
