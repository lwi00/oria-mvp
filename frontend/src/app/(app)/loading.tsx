import { CardSkeleton } from "@/components/Skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col gap-4">
      <div className="pt-[2px] pb-2">
        <div className="h-4 w-32 animate-pulse bg-purple-100/60 rounded" />
        <div className="h-7 w-40 animate-pulse bg-purple-100/60 rounded mt-2" />
      </div>
      <CardSkeleton />
      <CardSkeleton />
      <div className="grid grid-cols-2 gap-3">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </div>
  );
}
