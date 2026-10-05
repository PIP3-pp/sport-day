import { RevealItem } from "@/components/shared/motion";
import { MatchCard } from "@/components/shared/match-card";
import type { MatchView } from "@/lib/queries/matches";
import { formatDisplayDate } from "@/lib/date";

/** Completed matches grouped under a heading per date (input is newest first). */
export function ResultList({ matches }: { matches: MatchView[] }) {
  const groups = new Map<string, MatchView[]>();
  for (const match of matches) {
    groups.set(match.date, [...(groups.get(match.date) ?? []), match]);
  }

  return (
    <div className="space-y-10">
      {[...groups].map(([date, items]) => (
        <section key={date}>
          <h2 className="mb-4 text-xl font-bold tracking-tight">
            <time dateTime={date}>{formatDisplayDate(date)}</time>
          </h2>
          <div className="space-y-3">
            {items.map((match, i) => (
              <RevealItem key={match.id} index={i}>
                <MatchCard match={match} />
              </RevealItem>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
