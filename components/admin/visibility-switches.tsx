"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { setSectionVisibility } from "@/lib/actions/display";
import { SECTIONS, type SectionKey, type Visibility } from "@/lib/visibility";

const GROUPS = [
  { group: "page", title: "เมนูและหน้าเว็บ", hint: "หน้าที่ปิดจะหายจากเมนู และเปิดลิงก์ตรงไม่ได้" },
  { group: "home", title: "ส่วนต่าง ๆ ในหน้าแรก", hint: "เรียงตามลำดับที่แสดงบนหน้าแรก" },
] as const;

/** One switch per public section; each flip saves immediately. */
export function VisibilitySwitches({ visibility }: { visibility: Visibility }) {
  const [state, setState] = useState(visibility);
  const [pending, startTransition] = useTransition();

  function toggle(key: SectionKey, visible: boolean) {
    setState((prev) => ({ ...prev, [key]: visible }));
    startTransition(async () => {
      const result = await setSectionVisibility(key, visible);
      if (result.ok) {
        toast.success(result.message);
      } else {
        setState((prev) => ({ ...prev, [key]: !visible }));
        toast.error(result.message ?? "บันทึกไม่สำเร็จ");
      }
    });
  }

  return (
    <div className="divide-y">
      {GROUPS.map(({ group, title, hint }) => (
        <fieldset key={group} className="px-4 py-4 sm:px-6">
          <legend className="sr-only">{title}</legend>
          <p className="text-sm font-semibold" aria-hidden>
            {title}
          </p>
          <p className="mb-2 text-xs text-muted-foreground">{hint}</p>
          <ul className="divide-y">
            {SECTIONS.filter((s) => s.group === group).map((section) => {
              const id = `visibility-${section.key}`;
              return (
                <li key={section.key} className="flex items-center justify-between gap-4 py-2.5">
                  <label htmlFor={id} className="min-w-0 text-sm">
                    {section.label}
                    {"href" in section && (
                      <span className="ml-2 text-xs text-muted-foreground">{section.href}</span>
                    )}
                  </label>
                  <div className="flex shrink-0 items-center gap-2.5">
                    <span className="w-6 text-right text-xs text-muted-foreground">
                      {state[section.key] ? "เปิด" : "ปิด"}
                    </span>
                    <Switch
                      id={id}
                      checked={state[section.key]}
                      disabled={pending}
                      onCheckedChange={(checked) => toggle(section.key, checked)}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </fieldset>
      ))}
    </div>
  );
}
