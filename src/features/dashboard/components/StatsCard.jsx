import { Card, Typography } from "@material-tailwind/react";
import { TrendingUp } from "lucide-react";

const StatsCard = ({title, value, change, description, icon: Icon,}) => {
  return (
    <Card className="border border-border bg-card p-5 text-card-foreground shadow-sm">
      <div className="flex items-center justify-between">
        <Typography
          variant="small"
          className="font-medium text-muted-foreground"
        >
          {title}
        </Typography>

        {Icon && (
          <div className="rounded-lg bg-muted p-2">
            <Icon className="h-4 w-4" />
          </div>
        )}
      </div>

      <div className="mt-4">
        <Typography
          variant="h4"
          className="font-semibold tracking-tight"
        >
          {value}
        </Typography>

        <div className="mt-1 flex items-center gap-2 text-sm">
          <span className="flex items-center gap-1 font-medium text-green-600">
            <TrendingUp className="h-4 w-4" />
            {change}
          </span>

          <span className="text-muted-foreground">
            {description}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default StatsCard;