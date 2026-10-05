"use client";

import { Plus, Trophy } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useId, useState } from "react";
import { CountUp } from "@/components/shared/motion";
import { TeamBadge } from "@/components/shared/team-badge";
import type { Standing } from "@/lib/queries/standings";
import { cn } from "@/lib/utils";

/** Overall standings. Collapsed by default, as specified. */
export function Standings({ standings }: { standings: Standing[] }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <section aria-label="ตารางคะแนนรวม" className="rounded-lg border bg-card transition-shadow hover:shadow-sm">
      <h2>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((value) => !value)}
          className="flex w-full items-center justify-between gap-4 rounded-lg px-4 py-4 text-left transition-colors hover:bg-muted/50 sm:px-5"
        >
          <span className="flex items-center gap-2.5 text-lg font-bold tracking-tight sm:text-xl">
            <Trophy aria-hidden className="size-5" />
            ตารางคะแนนรวม
          </span>
          <Plus
            aria-hidden
            className={cn("size-5 transition-transform duration-300", open && "rotate-45")}
          />
        </button>
      </h2>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <ol className="border-t">
              {standings.map((row, i) => (
                <motion.li
                  key={row.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut", delay: 0.08 + i * 0.06 }}
                  className="flex items-center gap-4 border-b px-4 py-3.5 last:border-b-0 sm:px-5"
                >
                  <span
                    className={cn(
                      "w-6 text-2xl font-black tabular-nums",
                      row.rank !== 1 && "text-muted-foreground",
                    )}
                  >
                    <span className="sr-only">อันดับ </span>
                    {row.rank}
                  </span>
                  <TeamBadge team={row} className="flex-1 text-base font-semibold" />
                  <span className="text-2xl font-black tabular-nums">
                    <CountUp value={row.total} />
                    <span className="ml-1 text-xs font-semibold text-muted-foreground">
                      PTS
                    </span>
                  </span>
                </motion.li>
              ))}
            </ol>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
