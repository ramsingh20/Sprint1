import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Card, Typography } from "@material-tailwind/react";
import { Skeleton } from "@/components/ui/skeleton";

const ReportKpiCard = ({ title, value, change, trend, description, loading = false }) => {
  const isPositive = trend === "up";

  return (
    <Card className="border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <Typography variant="small" className="font-medium text-muted-foreground">{title}</Typography>
      </div>

      <div className="mt-3 flex items-end justify-between gap-3">
        {loading ? <Skeleton className="h-8 w-28" /> : <Typography variant="h4" className="font-semibold text-foreground">{value}</Typography>}
        {!loading && <div className={`flex items-center gap-1 text-sm font-medium ${isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
          {isPositive ? (<ArrowUpRight className="size-4" />) : (<ArrowDownRight className="size-4" />)}
          {change}
        </div>}
      </div>
      {loading ? <Skeleton className="mt-2 h-4 w-24" /> : <Typography variant="small" className="mt-2 font-normal text-muted-foreground">{description}</Typography>}
    </Card>
  );
};

export default ReportKpiCard;

