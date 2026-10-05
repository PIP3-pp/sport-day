import { Ban, CalendarClock, CircleCheck, Clock } from "lucide-react";
import type { MatchStatus } from "@/lib/match-constants";
import { STATUS_LABELS } from "@/lib/labels";
import { cn } from "@/lib/utils";

const STYLES: Record<MatchStatus, { icon: typeof Clock; className: string }> = {
  scheduled: { icon: Clock, className: "bg-muted text-foreground" },
  completed: { icon: CircleCheck, className: "bg-foreground text-background" },
  postponed: { icon: CalendarClock, className: "bg-amber-100 text-amber-900" },
  cancelled: { icon: Ban, className: "bg-red-100 text-red-900" },
};

export function StatusBadge({
  status,
  className,
}: {
  status: MatchStatus;
  className?: string;
}) {
  const { icon: Icon, className: tone } = STYLES[status];
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1 rounded-sm px-2 py-1 text-xs font-medium whitespace-nowrap",
        tone,
        className,
      )}
    >
      <Icon aria-hidden className="size-3.5" />
      {STATUS_LABELS[status]}
    </span>
  );
}
