"use client";

import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { MatchTeams, SportLabel } from "@/components/shared/match-card";
import { Button } from "@/components/ui/button";
import type { MatchView } from "@/lib/queries/matches";
import { formatThaiDate } from "@/lib/date";
import { cn } from "@/lib/utils";

const AUTO_SLIDE_MS = 6000;

/** Carousel of the latest completed results (never upcoming matches). */
export function LatestResults({ matches }: { matches: MatchView[] }) {
  const [[index, direction], setSlide] = useState<[number, number]>([0, 1]);
  const [paused, setPaused] = useState(false);
  // Pause control for touch and keyboard users, who cannot hover (WCAG 2.2.2).
  const [stopped, setStopped] = useState(false);
  const reduceMotion = useReducedMotion();
  const count = matches.length;

  const go = (step: number) =>
    setSlide(([current]) => [(current + step + count) % count, step]);

  useEffect(() => {
    if (paused || stopped || reduceMotion || count < 2) return;
    const timer = setInterval(
      () => setSlide(([current]) => [(current + 1) % count, 1]),
      AUTO_SLIDE_MS,
    );
    return () => clearInterval(timer);
  }, [paused, stopped, reduceMotion, count]);

  // A live refresh can shrink the list (e.g. a result is deleted).
  const current = Math.min(index, count - 1);
  const match = matches[current];
  const offset = reduceMotion ? 0 : 32;

  return (
    <div
      role="group"
      aria-roledescription="carousel"
      aria-label="ผลการแข่งขันล่าสุด"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="overflow-hidden rounded-lg border bg-card">
        <AnimatePresence mode="wait" initial={false} custom={direction}>
          <motion.article
            key={match.id}
            aria-roledescription="slide"
            aria-label={`${current + 1} จาก ${count}`}
            initial={{ opacity: 0, x: direction * offset }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -direction * offset }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="flex min-h-52 flex-col justify-between gap-6 p-5 sm:p-7"
          >
            <div className="flex items-start justify-between gap-3">
              <SportLabel match={match} className="uppercase" />
              <span className="shrink-0 rounded-sm bg-foreground px-2 py-1 text-xs font-bold tracking-widest text-background">
                FINAL
              </span>
            </div>
            <MatchTeams match={match} size="lg" />
            <p className="text-xs text-muted-foreground">
              <time dateTime={match.date}>{formatThaiDate(match.date)}</time>
            </p>
          </motion.article>
        </AnimatePresence>
      </div>

      {count > 1 && (
        <div className="mt-3 flex items-center justify-between">
          <div className="flex gap-1">
            {matches.map((item, i) => (
              <button
                key={item.id}
                type="button"
                aria-label={`ไปยังผลการแข่งขันที่ ${i + 1}`}
                aria-current={i === current ? "true" : undefined}
                onClick={() => setSlide([i, i > index ? 1 : -1])}
                className="grid size-6 place-items-center rounded-full"
              >
                <span
                  className={cn(
                    "h-1.5 rounded-full transition-all",
                    i === current ? "w-5 bg-foreground" : "w-1.5 bg-foreground/25",
                  )}
                />
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            {!reduceMotion && (
              <Button
                variant="outline"
                size="icon-lg"
                aria-label={stopped ? "เล่นสไลด์อัตโนมัติ" : "หยุดสไลด์อัตโนมัติ"}
                aria-pressed={stopped}
                onClick={() => setStopped((value) => !value)}
              >
                {stopped ? <Play /> : <Pause />}
              </Button>
            )}
            <Button
              variant="outline"
              size="icon-lg"
              aria-label="ผลการแข่งขันก่อนหน้า"
              onClick={() => go(-1)}
            >
              <ChevronLeft />
            </Button>
            <Button
              variant="outline"
              size="icon-lg"
              aria-label="ผลการแข่งขันถัดไป"
              onClick={() => go(1)}
            >
              <ChevronRight />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
