export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-purple-100/60 ${className}`}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-oria-card rounded-xl p-5 border border-oria shadow-card space-y-3">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-8 w-2/3" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  );
}
