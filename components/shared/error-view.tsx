"use client";

import { RotateCw, TriangleAlert } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

/** Friendly error screen; the raw error is logged, never shown. */
export function ErrorView({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container-page py-16">
      <div
        role="alert"
        className="mx-auto flex max-w-md flex-col items-center gap-4 rounded-lg border bg-card px-6 py-10 text-center"
      >
        <TriangleAlert aria-hidden className="size-7" />
        <div>
          <p className="text-lg font-bold">ไม่สามารถโหลดข้อมูลได้</p>
          <p className="text-muted-foreground">กรุณาลองใหม่อีกครั้ง</p>
        </div>
        <Button size="lg" onClick={reset}>
          <RotateCw aria-hidden />
          ลองใหม่
        </Button>
      </div>
    </div>
  );
}
