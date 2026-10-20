"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { bannerKind, DEFAULT_BANNER_URL, fileExtension } from "@/lib/banner";

const MEDIA_CLASS = "h-auto w-full object-cover object-top sm:max-h-[calc(100svh-3.5rem)]";

/**
 * Event key visual at the very top of the home page: the uploaded cover
 * (image, GIF, SVG or video) or the bundled default, with a gentle parallax.
 */
export function Banner({ url, alt }: { url: string | null; alt: string }) {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const mediaY = useTransform(scrollYProgress, [0, 1], ["0%", reduceMotion ? "0%" : "18%"]);
  const mediaScale = useTransform(scrollYProgress, [0, 1], [1, reduceMotion ? 1 : 1.06]);

  const src = url ?? DEFAULT_BANNER_URL;
  // The optimizer would flatten GIF animation and refuses SVG; serve both as-is.
  const unoptimized = ["gif", "svg"].includes(fileExtension(new URL(src, "https://x").pathname));

  return (
    <section ref={ref} aria-label={alt} className="relative overflow-hidden">
      <motion.div style={{ y: mediaY, scale: mediaScale }} className="relative">
        {bannerKind(src) === "video" ? (
          <video
            src={src}
            aria-label={alt}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className={MEDIA_CLASS}
          />
        ) : (
          <Image
            src={src}
            alt={alt}
            width={2000}
            height={1316}
            priority
            unoptimized={unoptimized}
            sizes="100vw"
            className={MEDIA_CLASS}
          />
        )}
      </motion.div>
    </section>
  );
}
