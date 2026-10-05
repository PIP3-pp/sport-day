import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { SiteConfig } from "@/lib/queries/config";
import type { TeamRef } from "@/lib/queries/teams";

export function Hero({ config, teams }: { config: SiteConfig; teams: TeamRef[] }) {
  return (
    <section className="bg-foreground text-background">
      <div className="container-page py-12 sm:py-16">
        {config.slogan && (
          <p className="mb-4 animate-in fade-in slide-in-from-bottom-3 text-xs font-semibold tracking-[0.2em] text-background/60 uppercase duration-700 fill-mode-backwards">
            {config.slogan}
          </p>
        )}
        <h1 className="animate-in fade-in slide-in-from-bottom-4 text-5xl leading-[0.95] font-black tracking-tighter uppercase sm:text-7xl delay-100 duration-700 fill-mode-backwards">
          {config.eventName}
          <span className="block text-background/50">{config.eventYear}</span>
        </h1>
        <Link
          href="/schedule"
          className="group mt-8 inline-flex h-11 animate-in fade-in slide-in-from-bottom-4 items-center gap-2 rounded-md bg-background px-5 text-sm font-semibold text-foreground transition-all delay-200 duration-700 fill-mode-backwards hover:bg-background/85 focus-visible:outline-background active:scale-95"
        >
          ดูตารางการแข่งขัน
          <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
      {/* The four team identities, as a thin accent only. */}
      <div aria-hidden className="flex h-1.5">
        {teams.map((team, i) => (
          <span
            key={team.id}
            className="flex-1 origin-left animate-grow-x"
            style={{ backgroundColor: team.color, animationDelay: `${300 + i * 120}ms` }}
          />
        ))}
      </div>
    </section>
  );
}
