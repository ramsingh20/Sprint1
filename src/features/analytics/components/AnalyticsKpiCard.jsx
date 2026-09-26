import { TrendingUp } from "lucide-react";
import { Card, Typography } from "@material-tailwind/react";
import { Skeleton } from "@/components/ui/skeleton";

const AnalyticsKpiCard = ({ title, value, change, description, loading = false }) => {
  return (
    <Card className="border border-border bg-card p-5 text-card-foreground shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <Typography variant="small" className="font-medium text-muted-foreground">
            {title}
          </Typography>

          {loading ? <Skeleton className="mt-2 h-8 w-28" /> : <Typography variant="h4" className="mt-2 font-semibold">{value}</Typography>}
        </div>

        {!loading && <div className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700 dark:bg-green-950 dark:text-green-400">
          <TrendingUp className="h-3.5 w-3.5" />
          {change}
        </div>}
      </div>

      {loading ? <Skeleton className="mt-3 h-4 w-24" /> : <p className="mt-3 text-xs text-muted-foreground">{description}</p>}
    </Card>
  );
};

export default AnalyticsKpiCard;


