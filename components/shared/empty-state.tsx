import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function EmptyState({
  icon: Icon,
  message,
  className,
}: {
  icon: LucideIcon;
  message: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3 rounded-lg border border-dashed bg-card px-6 py-10 text-center text-sm text-muted-foreground",
        className,
      )}
    >
      <Icon aria-hidden className="size-6" />
      <p>{message}</p>
    </div>
  );
}
