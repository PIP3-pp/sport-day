import { TeamBadge } from "@/components/shared/team-badge";
import type { MatchView } from "@/lib/queries/matches";
import { formatThaiDate, formatTime } from "@/lib/date";

/** Compact "when / what / who" cells shared by the admin match tables. */
export function MatchWhen({ match }: { match: MatchView }) {
  return (
    <div className="whitespace-nowrap">
      <p className="font-medium">{formatThaiDate(match.date)}</p>
      <p className="text-muted-foreground tabular-nums">{formatTime(match.startTime)}</p>
    </div>
  );
}

export function MatchWhat({ match }: { match: MatchView }) {
  return (
    <div className="min-w-36">
      <p className="font-medium">
        <span aria-hidden className="mr-1.5">
          {match.sport.icon}
        </span>
        {match.sport.name}
      </p>
      <p className="text-muted-foreground">{match.round}</p>
    </div>
  );
}

export function MatchWho({ match }: { match: MatchView }) {
  if (match.format === "all_teams") {
    if (match.lines.length === 0) return <span className="text-muted-foreground">ทุกสี</span>;
    return (
      <ol className="grid gap-0.5">
        {match.lines.map((line) => (
          <li key={line.team.id} className="flex items-center gap-2 whitespace-nowrap">
            <span className="w-3 font-semibold tabular-nums">{line.position}</span>
            <TeamBadge team={line.team} />
            <span className="text-muted-foreground tabular-nums">+{line.points}</span>
          </li>
        ))}
      </ol>
    );
  }
  const lineOf = (teamId?: number) => match.lines.find((l) => l.team.id === teamId);
  return (
    <ul className="grid gap-0.5">
      {[match.teamA, match.teamB].map(
        (team) =>
          team && (
            <li key={team.id} className="flex items-center gap-2 whitespace-nowrap">
              <TeamBadge team={team} />
              {lineOf(team.id) && (
                <>
                  <span className="font-semibold tabular-nums">{lineOf(team.id)!.score}</span>
                  <span className="text-muted-foreground tabular-nums">
                    +{lineOf(team.id)!.points}
                  </span>
                </>
              )}
            </li>
          ),
      )}
    </ul>
  );
}
