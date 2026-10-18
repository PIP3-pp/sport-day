"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

/**
 * Event key visual at the very top of the home page. Its bottom edge is
 * always lost in white fog, and as the visitor scrolls the fog rolls up over
 * the whole picture so it dissolves into the regular page below.
 */
export function Banner() {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", reduceMotion ? "0%" : "18%"]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, reduceMotion ? 1 : 1.06]);
  const fogOpacity = useTransform(scrollYProgress, [0, 0.75], [0, 1]);
  const cloudsY = useTransform(scrollYProgress, [0, 1], ["0%", reduceMotion ? "0%" : "-35%"]);

  return (
    <section ref={ref} aria-label="แคแสดสองแควเกมส์" className="relative overflow-hidden">
      <motion.div style={{ y: imageY, scale: imageScale }} className="relative">
        <Image
          src="/banner.webp"
          alt="กีฬาสีภายใน แคแสดสองแควเกมส์ โรงเรียนวิทยาศาสตร์จุฬาภรณราชวิทยาลัย พิษณุโลก และกำแพงเพชร"
          width={2000}
          height={1316}
          priority
          sizes="100vw"
          className="h-auto w-full object-cover object-top sm:max-h-[calc(100svh-3.5rem)]"
        />
      </motion.div>

      {/* Fog thickening over the whole picture as the page scrolls. */}
      <motion.div
        aria-hidden
        style={{ opacity: fogOpacity }}
        className="pointer-events-none absolute inset-0 bg-background"
      />

      {/* Soft cloud bank that always swallows the bottom of the picture. */}
      <motion.div
        aria-hidden
        style={{ y: cloudsY }}
        className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/70 to-background" />
        <div className="absolute -bottom-10 -left-[10%] h-48 w-[60%] animate-cloud-drift rounded-full bg-white/80 blur-3xl" />
        <div className="absolute -right-[10%] -bottom-12 h-56 w-[65%] animate-cloud-drift-reverse rounded-full bg-white/80 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 h-32 w-1/2 rounded-full bg-white blur-2xl" />
      </motion.div>
    </section>
  );
}
