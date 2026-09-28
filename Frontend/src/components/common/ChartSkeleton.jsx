import { Skeleton } from "@/components/ui/skeleton";

const ChartSkeleton = ({ title = "Loading chart data..." }) => (
  <div role="status" aria-label={title} aria-busy="true" className="rounded-xl border bg-card p-6">
    <Skeleton className="h-5 w-40" />
    <Skeleton className="mt-2 h-4 w-64 max-w-full" />
    <div className="mt-8 flex h-[280px] items-end gap-2 border-b border-l px-2">
      {[35, 52, 42, 70, 56, 83, 63, 91, 72, 48, 78, 60].map((height, index) => (
        <Skeleton key={index} className="min-w-2 flex-1 rounded-t-sm" style={{ height: `${height}%` }} />
      ))}
    </div>
    <span className="sr-only">Loading chart data</span>
  </div>
);

export default ChartSkeleton;
