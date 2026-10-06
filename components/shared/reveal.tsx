import { cn } from "@/lib/utils";

/**
 * Fades and lifts its content in. Pure CSS (see `.reveal` in globals.css), so
 * the content is in the server HTML and stays visible if JavaScript is slow or
 * fails to load. Browsers with scroll-driven animations play it as the block
 * scrolls into view; the others play it once on load.
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  /** Seconds. Only applies where the animation plays on load. */
  delay?: number;
  className?: string;
}) {
  return (
    <div
      className={cn("reveal", className)}
      style={delay ? ({ "--reveal-delay": `${delay}s` } as React.CSSProperties) : undefined}
    >
      {children}
    </div>
  );
}

/** A reveal whose delay grows with its position, capped so long lists stay snappy. */
export function RevealItem({
  index,
  children,
  className,
}: {
  index: number;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Reveal delay={Math.min(index, 6) * 0.05} className={className}>
      {children}
    </Reveal>
  );
}
