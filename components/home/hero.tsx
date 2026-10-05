import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { SiteConfig } from "@/lib/queries/config";
import type { TeamRef } from "@/lib/queries/teams";

export function Hero({ config, teams }: { config: SiteConfig; teams: TeamRef[] }) {
  return (
    <section className="bg-foreground text-background">
      <div className="container-page animate-in fade-in slide-in-from-bottom-2 py-12 duration-500 sm:py-16">
        {config.slogan && (
          <p className="mb-4 text-xs font-semibold tracking-[0.2em] text-background/60 uppercase">
            {config.slogan}
          </p>
        )}
        <h1 className="text-5xl leading-[0.95] font-black tracking-tighter uppercase sm:text-7xl">
          {config.eventName}
          <span className="block text-background/50">{config.eventYear}</span>
        </h1>
        <Link
          href="/schedule"
          className="mt-8 inline-flex h-11 items-center gap-2 rounded-md bg-background px-5 text-sm font-semibold text-foreground transition-colors hover:bg-background/85 focus-visible:outline-background"
        >
          ดูตารางการแข่งขัน
          <ArrowRight aria-hidden className="size-4" />
        </Link>
      </div>
      {/* The four team identities, as a thin accent only. */}
      <div aria-hidden className="flex h-1.5">
        {teams.map((team) => (
          <span key={team.id} className="flex-1" style={{ backgroundColor: team.color }} />
        ))}
      </div>
    </section>
  );
}
