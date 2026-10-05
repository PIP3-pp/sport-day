"use client";

import { Loader2 } from "lucide-react";
import {
  createContext,
  startTransition,
  useActionState,
  useContext,
  useEffect,
  useState,
} from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { initialActionState, type ActionState } from "@/lib/action-state";

export type FormAction = (prev: ActionState, formData: FormData) => Promise<ActionState>;

const FieldErrorsContext = createContext<ActionState["fieldErrors"]>(undefined);

/** Errors for one field of the surrounding ActionForm. */
export function useFieldErrors(name: string): string[] | undefined {
  return useContext(FieldErrorsContext)?.[name];
}

/**
 * A form bound to a server action. Shows the action's message and field
 * errors, and keeps what the admin typed when validation fails.
 */
export function ActionForm({
  action,
  children,
  submitLabel = "บันทึก",
  destructive = false,
  onSuccess,
  onCancel,
}: {
  action: FormAction;
  children: React.ReactNode;
  submitLabel?: string;
  destructive?: boolean;
  onSuccess?: () => void;
  onCancel?: () => void;
}) {
  const [state, formAction, pending] = useActionState(action, initialActionState);

  useEffect(() => {
    if (!state.ok) return;
    toast.success(state.message ?? "บันทึกแล้ว");
    onSuccess?.();
    // Runs once per action result; onSuccess identity is irrelevant.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <form
      noValidate
      className="grid gap-4"
      onSubmit={(event) => {
        // Submitting manually (instead of <form action>) stops React from
        // resetting the fields when the server returns validation errors.
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        startTransition(() => formAction(formData));
      }}
    >
      <FieldErrorsContext value={state.fieldErrors}>{children}</FieldErrorsContext>
      {!state.ok && state.message && (
        <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-800">
          {state.message}
        </p>
      )}
      {!state.ok && state.fieldErrors?.form && (
        <p role="alert" className="text-sm text-destructive">
          {state.fieldErrors.form.join(" ")}
        </p>
      )}
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        {onCancel && (
          <Button type="button" variant="outline" size="lg" onClick={onCancel}>
            ยกเลิก
          </Button>
        )}
        <Button
          type="submit"
          size="lg"
          disabled={pending}
          className={
            destructive ? "bg-destructive text-white hover:bg-destructive/85" : undefined
          }
        >
          {pending && <Loader2 aria-hidden className="animate-spin" />}
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}

/** A button that opens an ActionForm in a dialog and closes it on success. */
export function FormDialog({
  action,
  title,
  description,
  trigger,
  triggerLabel,
  submitLabel,
  destructive,
  children,
}: {
  action: FormAction;
  title: string;
  description?: string;
  /** The trigger element, e.g. `<Button variant="outline" />`. */
  trigger: React.ReactElement;
  triggerLabel: React.ReactNode;
  submitLabel?: string;
  destructive?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger}>{triggerLabel}</DialogTrigger>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {/* Mounted only while open, so every open starts from a clean state. */}
        <ActionForm
          action={action}
          submitLabel={submitLabel}
          destructive={destructive}
          onSuccess={() => setOpen(false)}
          onCancel={() => setOpen(false)}
        >
          {children}
        </ActionForm>
      </DialogContent>
    </Dialog>
  );
}

/** Confirmation dialog for a delete action that takes an `id`. */
export function DeleteDialog({
  action,
  id,
  title,
  description,
  triggerLabel,
}: {
  action: FormAction;
  id: number;
  title: string;
  description: string;
  triggerLabel: React.ReactNode;
}) {
  return (
    <FormDialog
      action={action}
      title={title}
      description={description}
      trigger={<Button variant="destructive" size="sm" />}
      triggerLabel={triggerLabel}
      submitLabel="ยืนยันการลบ"
      destructive
    >
      <input type="hidden" name="id" value={id} />
    </FormDialog>
  );
}
