"use client";

import { Minus, Plus, Trophy } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useId, useState } from "react";
import { TeamBadge } from "@/components/shared/team-badge";
import type { Standing } from "@/lib/queries/standings";
import { cn } from "@/lib/utils";

/** Overall standings. Collapsed by default, as specified. */
export function Standings({ standings }: { standings: Standing[] }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <section aria-label="ตารางคะแนนรวม" className="rounded-lg border bg-card">
      <h2>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((value) => !value)}
          className="flex w-full items-center justify-between gap-4 rounded-lg px-4 py-4 text-left sm:px-5"
        >
          <span className="flex items-center gap-2.5 text-lg font-bold tracking-tight sm:text-xl">
            <Trophy aria-hidden className="size-5" />
            ตารางคะแนนรวม
          </span>
          {open ? (
            <Minus aria-hidden className="size-5" />
          ) : (
            <Plus aria-hidden className="size-5" />
          )}
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
              {standings.map((row) => (
                <li
                  key={row.id}
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
                    {row.total}
                    <span className="ml-1 text-xs font-semibold text-muted-foreground">
                      PTS
                    </span>
                  </span>
                </li>
              ))}
            </ol>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
