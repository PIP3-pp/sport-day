import Link from "next/link";
import type { Team } from "@/lib/queries/teams";
import { cn } from "@/lib/utils";

/** "All teams" + one chip per team color. Plain links, so it works without JavaScript. */
export function TeamFilter({
  teams,
  selectedId,
  hrefFor,
}: {
  teams: Pick<Team, "id" | "name" | "color">[];
  selectedId: number | undefined;
  /** Builds the link for a team, or for "all" when called with undefined. */
  hrefFor: (teamId: number | undefined) => string;
}) {
  if (teams.length === 0) return null;

  return (
    <nav aria-label="กรองตามทีมสี">
      <ul className="scrollbar-none -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
        {[{ id: undefined, name: "ทุกสี", color: null }, ...teams].map((team) => {
          const active = team.id === selectedId;
          return (
            <li key={team.id ?? "all"}>
              <Link
                href={hrefFor(team.id)}
                aria-current={active ? "true" : undefined}
                className={cn(
                  "inline-flex h-9 items-center gap-2 rounded-full border bg-card px-4 text-sm font-medium whitespace-nowrap transition-all duration-200 hover:border-foreground active:scale-95",
                  active && "border-foreground bg-foreground text-background",
                )}
              >
                {team.color && (
                  <span
                    aria-hidden
                    className="size-2.5 rounded-full ring-1 ring-background/60"
                    style={{ backgroundColor: team.color }}
                  />
                )}
                {team.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
