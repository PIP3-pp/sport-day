"use client";

import {
  animate,
  MotionConfig,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";
import { useEffect } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Makes every motion component honour the visitor's "reduce motion" setting. */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

/**
 * Shows `value`. It starts at the real number (so the server HTML and a
 * no-JavaScript visitor see correct scores) and tweens when the value
 * changes, e.g. after a live refresh.
 */
export function CountUp({ value, className }: { value: number; className?: string }) {
  const reduceMotion = useReducedMotion();
  const count = useMotionValue(value);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    if (reduceMotion) {
      count.set(value);
      return;
    }
    const controls = animate(count, value, { duration: 0.9, ease: EASE });
    return () => controls.stop();
  }, [reduceMotion, value, count]);

  return <motion.span className={className}>{rounded}</motion.span>;
}
