import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Card, Typography } from "@material-tailwind/react";

const ReportKpiCard = ({ title, value, change, trend, description, }) => {
  const isPositive = trend === "up";

  return (
    <Card className="border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <Typography variant="small" className="font-medium text-muted-foreground">{title}</Typography>
      </div>

      <div className="mt-3 flex items-end justify-between gap-3">
        <Typography variant="h4" className="font-semibold text-foreground">{value}</Typography>
        <div className={`flex items-center gap-1 text-sm font-medium ${isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
          {isPositive ? (<ArrowUpRight className="size-4" />) : (<ArrowDownRight className="size-4" />)}
          {change}
        </div>
      </div>
      <Typography variant="small" className="mt-2 font-normal text-muted-foreground">{description}</Typography>
    </Card>
  );
};

export default ReportKpiCard;