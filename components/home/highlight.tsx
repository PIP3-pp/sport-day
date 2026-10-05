import { Star } from "lucide-react";
import Image from "next/image";
import { MatchTeams, SportLabel } from "@/components/shared/match-card";
import type { Highlight } from "@/lib/queries/highlights";
import type { MatchView } from "@/lib/queries/matches";

export function HighlightCard({
  highlight,
  match,
}: {
  highlight: Highlight;
  match: MatchView | null;
}) {
  return (
    <article className="group overflow-hidden rounded-lg border bg-card transition-shadow duration-300 hover:shadow-md sm:grid sm:grid-cols-5">
      {highlight.imageUrl && (
        <div className="relative aspect-video overflow-hidden sm:col-span-2 sm:aspect-auto">
          <Image
            src={highlight.imageUrl}
            alt=""
            fill
            sizes="(min-width: 640px) 40vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}
      <div className={highlight.imageUrl ? "p-5 sm:col-span-3 sm:p-7" : "p-5 sm:col-span-5 sm:p-7"}>
        <p className="eyebrow mb-3 flex items-center gap-1.5">
          <Star aria-hidden className="size-3.5 fill-current" />
          Highlight of the Day
        </p>
        <h3 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
          {highlight.title}
        </h3>
        {highlight.description && (
          <p className="mt-2 max-w-prose whitespace-pre-line text-muted-foreground">
            {highlight.description}
          </p>
        )}
        {match && (
          <div className="mt-5 space-y-3 border-t pt-5">
            <SportLabel match={match} />
            <MatchTeams match={match} size="lg" />
          </div>
        )}
      </div>
    </article>
  );
}
