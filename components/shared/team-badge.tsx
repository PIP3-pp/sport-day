import Image from "next/image";
import type { TeamRef } from "@/lib/queries/teams";
import { cn } from "@/lib/utils";

/** Team color dot + name. The name is always shown, so color is never the only cue. */
export function TeamBadge({
  team,
  className,
  reverse = false,
}: {
  team: Pick<TeamRef, "name" | "color">;
  className?: string;
  reverse?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex min-w-0 items-center gap-2",
        reverse && "flex-row-reverse",
        className,
      )}
    >
      <span
        aria-hidden
        className="size-2.5 shrink-0 rounded-full"
        style={{ backgroundColor: team.color }}
      />
      <span className="truncate">{team.name}</span>
    </span>
  );
}

/** Team logo, or a color block with the team's initial (R/G/S/P) when no logo is uploaded. */
export function TeamLogo({
  team,
  size = 48,
  className,
}: {
  team: Pick<TeamRef, "name" | "slug" | "color" | "logoUrl">;
  size?: number;
  className?: string;
}) {
  if (team.logoUrl) {
    return (
      <Image
        src={team.logoUrl}
        alt={`โลโก้${team.name}`}
        width={size}
        height={size}
        className={cn("shrink-0 rounded-md object-cover", className)}
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <span
      aria-hidden
      className={cn(
        "grid shrink-0 place-items-center rounded-md font-bold text-white",
        className,
      )}
      style={{
        backgroundColor: team.color,
        width: size,
        height: size,
        fontSize: size * 0.4,
      }}
    >
      {team.slug.charAt(0).toUpperCase()}
    </span>
  );
}
