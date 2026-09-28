import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

const EmptyState = ({
  icon: Icon = SearchX,
  title = "Nothing here yet",
  description = "There is no data to display.",
  actionLabel,
  onAction,
  className = "",
}) => (
  <div className={`flex flex-col items-center justify-center gap-2 px-5 py-8 text-center ${className}`}>
    <span className="mb-1 flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground"><Icon className="size-5" aria-hidden="true" /></span>
    <p className="font-medium">{title}</p>
    <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
    {actionLabel && onAction && <Button type="button" variant="outline" size="sm" className="mt-2" onClick={onAction}>{actionLabel}</Button>}
  </div>
);

export default EmptyState;
