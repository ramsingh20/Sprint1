import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

const ErrorState = ({
  title = "Could not load this data",
  message = "Please try again.",
  onRetry,
  className = "",
}) => (
  <div role="alert" className={`flex min-h-40 flex-col items-center justify-center gap-2 rounded-xl border border-destructive/25 bg-destructive/5 p-6 text-center ${className}`}>
    <AlertTriangle className="size-5 text-destructive" aria-hidden="true" />
    <p className="font-medium">{title}</p>
    <p className="max-w-lg text-sm text-muted-foreground">{message}</p>
    {onRetry && <Button type="button" variant="outline" size="sm" className="mt-1" onClick={onRetry}>Try again</Button>}
  </div>
);

export default ErrorState;
