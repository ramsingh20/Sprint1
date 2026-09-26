import { Skeleton } from "@/components/ui/skeleton";

const DataTableSkeleton = ({ columns = 5, rows = 5 }) => (
  <div role="status" aria-label="Loading records" aria-busy="true" className="space-y-3 p-3 md:p-4">
    <div className="hidden space-y-3 md:block">
      <div className="grid gap-4 border-b pb-3" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
        {Array.from({ length: columns }, (_, index) => <Skeleton key={`header-${index}`} className="h-4 w-3/4" />)}
      </div>
      {Array.from({ length: rows }, (_, row) => (
        <div key={row} className="grid items-center gap-4 border-b py-3 last:border-0" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
          {Array.from({ length: columns }, (_, column) => <Skeleton key={`${row}-${column}`} className={column === 0 ? "h-5 w-4/5" : "h-4 w-2/3"} />)}
        </div>
      ))}
    </div>
    <div className="space-y-3 md:hidden">
      {Array.from({ length: Math.min(rows, 4) }, (_, index) => (
        <div key={index} className="space-y-3 rounded-lg border p-4">
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-4 w-4/5" />
          <div className="flex justify-between gap-4"><Skeleton className="h-4 w-1/3" /><Skeleton className="h-4 w-1/3" /></div>
        </div>
      ))}
    </div>
    <span className="sr-only">Loading data</span>
  </div>
);

export default DataTableSkeleton;
