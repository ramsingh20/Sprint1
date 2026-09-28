import { Card, Typography } from "@material-tailwind/react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const StatsCard = ({ title, value, change, description, icon: Icon, loading = false }) => {
  const isNegative = typeof change === "string" && change.startsWith("-");
  const TrendIcon = isNegative ? TrendingDown : TrendingUp;
  return (
    <Card className="border border-border bg-card p-5 text-card-foreground shadow-sm">
      <div className="flex items-center justify-between">
        <Typography variant="small" className="font-medium text-muted-foreground">{title}</Typography>
        {Icon && <div className="rounded-lg bg-muted p-2"><Icon className="h-4 w-4" /></div>}
      </div>
      <div className="mt-4">
        {loading ? <Skeleton className="mt-4 h-8 w-28" /> : <Typography variant="h4" className="mt-4 font-semibold tracking-tight">{value}</Typography>}
        <div className="mt-1 flex items-center gap-2 text-sm">
          {loading ? <Skeleton className="h-4 w-20" /> : change && <span className={`flex items-center gap-1 font-medium ${isNegative ? "text-destructive" : "text-green-600"}`}><TrendIcon className="h-4 w-4" />{change}</span>}
          <span className="text-muted-foreground">{description}</span>
        </div>
      </div>
    </Card>
  );
};

export default StatsCard;

