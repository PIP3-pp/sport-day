"use client";

import { useRouter } from "next/navigation";
import { startTransition, useEffect } from "react";

const REFRESH_MS = 45_000;

/**
 * Keeps a public page current during the event: re-renders the server
 * components every 45 s while the tab is visible and online, and straight
 * away when the visitor returns to a tab that has been in the background.
 * Reads are served from the tag-invalidated cache, so this is cheap.
 */
export function AutoRefresh() {
  const router = useRouter();

  useEffect(() => {
    let lastRefresh = Date.now();

    const refresh = () => {
      if (document.visibilityState !== "visible" || !navigator.onLine) return;
      lastRefresh = Date.now();
      startTransition(() => router.refresh());
    };

    const timer = setInterval(refresh, REFRESH_MS);
    const onVisible = () => {
      if (document.visibilityState === "visible" && Date.now() - lastRefresh >= REFRESH_MS) {
        refresh();
      }
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [router]);

  return null;
}
