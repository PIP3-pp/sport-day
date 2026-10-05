"use client";

import { ChevronDown } from "lucide-react";
import { useId } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useFieldErrors } from "./action-form";

/** Wires a label, hint and server-side error message to one control. */
function useField(name: string) {
  const id = useId();
  const errors = useFieldErrors(name);
  return {
    id,
    errors,
    control: {
      id,
      name,
      "aria-invalid": errors ? true : undefined,
      "aria-describedby": errors ? `${id}-error` : undefined,
    },
  };
}

function FieldShell({
  id,
  label,
  hint,
  errors,
  className,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  errors?: string[];
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("grid gap-1.5", className)}>
      <Label htmlFor={id}>{label}</Label>
      {children}
      {hint && !errors && <p className="text-xs text-muted-foreground">{hint}</p>}
      {errors && (
        <p id={`${id}-error`} className="text-xs text-destructive">
          {errors.join(" ")}
        </p>
      )}
    </div>
  );
}

type BaseProps = { name: string; label: string; hint?: string; className?: string };

export function TextField({
  name,
  label,
  hint,
  className,
  ...props
}: BaseProps & Omit<React.ComponentProps<"input">, "name" | "id" | "className">) {
  const field = useField(name);
  return (
    <FieldShell id={field.id} label={label} hint={hint} errors={field.errors} className={className}>
      <Input className="h-10" {...field.control} {...props} />
    </FieldShell>
  );
}

export function TextareaField({
  name,
  label,
  hint,
  className,
  ...props
}: BaseProps & Omit<React.ComponentProps<"textarea">, "name" | "id" | "className">) {
  const field = useField(name);
  return (
    <FieldShell id={field.id} label={label} hint={hint} errors={field.errors} className={className}>
      <Textarea rows={4} {...field.control} {...props} />
    </FieldShell>
  );
}

/** Native select: reliable on phones and submits with the form as-is. */
export function SelectField({
  name,
  label,
  hint,
  className,
  children,
  ...props
}: BaseProps & Omit<React.ComponentProps<"select">, "name" | "id" | "className">) {
  const field = useField(name);
  return (
    <FieldShell id={field.id} label={label} hint={hint} errors={field.errors} className={className}>
      <div className="relative">
        <select
          className="h-10 w-full appearance-none rounded-lg border border-input bg-transparent pr-9 pl-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive"
          {...field.control}
          {...props}
        >
          {children}
        </select>
        <ChevronDown
          aria-hidden
          className="pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2 text-muted-foreground"
        />
      </div>
    </FieldShell>
  );
}

export function CheckboxField({
  name,
  label,
  hint,
  defaultChecked,
}: {
  name: string;
  label: string;
  hint?: string;
  defaultChecked?: boolean;
}) {
  const id = useId();
  return (
    <div className="flex items-start gap-2.5">
      <input
        id={id}
        name={name}
        type="checkbox"
        defaultChecked={defaultChecked}
        className="mt-0.5 size-4 accent-foreground"
      />
      <div className="grid gap-0.5">
        <Label htmlFor={id}>{label}</Label>
        {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      </div>
    </div>
  );
}

/** Optional image upload, with a "remove current image" checkbox when one exists. */
export function ImageField({
  name,
  label,
  removeName,
  currentUrl,
}: {
  name: string;
  label: string;
  removeName: string;
  currentUrl: string | null;
}) {
  const field = useField(name);
  return (
    <FieldShell
      id={field.id}
      label={label}
      hint="PNG, JPG หรือ WebP ขนาดไม่เกิน 2 MB"
      errors={field.errors}
    >
      <Input
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="h-10 pt-2"
        {...field.control}
      />
      {currentUrl && (
        <CheckboxField name={removeName} label="ลบรูปปัจจุบัน" />
      )}
    </FieldShell>
  );
}
