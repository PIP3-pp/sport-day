"use client";

import { Loader2, Play } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { startMatch } from "@/lib/actions/matches";
import { initialActionState } from "@/lib/action-state";

/** One-tap kick-off: marks the match "in progress" so the public site shows it as live. */
export function StartMatchButton({ matchId }: { matchId: number }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          const formData = new FormData();
          formData.set("id", String(matchId));
          const result = await startMatch(initialActionState, formData);
          if (result.ok) {
            toast.success(result.message ?? "เริ่มการแข่งขันแล้ว");
            router.refresh();
          } else {
            toast.error(result.message ?? "ไม่สามารถบันทึกข้อมูลได้");
          }
        })
      }
    >
      {pending ? <Loader2 aria-hidden className="animate-spin" /> : <Play aria-hidden />}
      เริ่มแข่ง
    </Button>
  );
}
