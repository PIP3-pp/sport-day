import type { MatchView } from "@/lib/queries/matches";
import { formatTime } from "@/lib/date";
import { cn } from "@/lib/utils";
import { StatusBadge } from "./status-badge";
import { TeamBadge } from "./team-badge";

export function SportLabel({
  match,
  className,
}: {
  match: Pick<MatchView, "sport" | "round">;
  className?: string;
}) {
  return (
    <div className={cn("min-w-0", className)}>
      <p className="truncate font-semibold">
        {match.sport.icon && (
          <span aria-hidden className="mr-1.5">
            {match.sport.icon}
          </span>
        )}
        {match.sport.name}
      </p>
      <p className="truncate text-sm text-muted-foreground">{match.round}</p>
    </div>
  );
}

/**
 * The competing teams of a match, with scores or finishing positions once a
 * result exists. `size="lg"` is the scoreboard treatment used in the slider
 * and the highlight.
 */
export function MatchTeams({
  match,
  size = "md",
}: {
  match: MatchView;
  size?: "md" | "lg";
}) {
  const hasResult = match.lines.length > 0;

  if (match.format === "all_teams") {
    if (!hasResult) {
      return <p className="text-sm text-muted-foreground">ทุกสีลงแข่งขัน</p>;
    }
    return (
      <ol
        className={cn(
          "grid grid-cols-2 gap-x-4 gap-y-1.5",
          size === "md" && "sm:grid-cols-4",
        )}
      >
        {match.lines.map((line) => (
          <li key={line.team.id} className="flex min-w-0 items-center gap-2 text-sm">
            <span
              className={cn(
                "w-4 shrink-0 text-right font-bold tabular-nums",
                line.position !== 1 && "text-muted-foreground",
              )}
            >
              <span className="sr-only">อันดับ </span>
              {line.position}
            </span>
            <TeamBadge
              team={line.team}
              className={cn(line.position === 1 && "font-semibold")}
            />
          </li>
        ))}
      </ol>
    );
  }

  if (!match.teamA || !match.teamB) return null;
  const { teamA, teamB } = match;
  const scoreA = match.lines.find((l) => l.team.id === teamA.id)?.score ?? null;
  const scoreB = match.lines.find((l) => l.team.id === teamB.id)?.score ?? null;
  const scored = scoreA !== null && scoreB !== null;
  const nameClass =
    size === "lg" ? "text-base font-semibold sm:text-lg" : "text-sm font-medium";

  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
      <TeamBadge
        team={teamA}
        className={cn(nameClass, scored && scoreA < scoreB && "text-muted-foreground")}
      />
      {scored ? (
        <p
          className={cn(
            "font-bold tabular-nums",
            size === "lg" ? "text-3xl sm:text-4xl" : "text-lg",
          )}
        >
          <span className="sr-only">
            {teamA.name} {scoreA} {teamB.name} {scoreB}
          </span>
          <span aria-hidden>
            {scoreA} <span className="text-muted-foreground">—</span> {scoreB}
          </span>
        </p>
      ) : (
        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          vs
        </span>
      )}
      <TeamBadge
        team={teamB}
        reverse
        className={cn(
          nameClass,
          "justify-self-end",
          scored && scoreB < scoreA && "text-muted-foreground",
        )}
      />
    </div>
  );
}

/** One row of a schedule or result list. */
export function MatchCard({ match }: { match: MatchView }) {
  return (
    <article className="grid gap-3 rounded-lg border bg-card p-4 sm:grid-cols-[4.5rem_1fr] sm:gap-5">
      <div className="flex items-center justify-between sm:block">
        <p className="text-lg font-bold tabular-nums sm:text-xl">
          <time>{formatTime(match.startTime)}</time>
        </p>
        <StatusBadge status={match.status} className="sm:hidden" />
      </div>
      <div className="min-w-0 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <SportLabel match={match} />
          <StatusBadge status={match.status} className="hidden sm:inline-flex" />
        </div>
        <MatchTeams match={match} />
      </div>
    </article>
  );
}
