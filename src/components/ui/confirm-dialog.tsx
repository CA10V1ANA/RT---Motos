"use client";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { Button } from "./button";
import { useDialogFocus } from "./use-dialog-focus";
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  busy,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onConfirm: () => void;
  busy?: boolean;
}) {
  const focus = useDialogFocus();
  return (
    <Dialog.Root open={open} onOpenChange={busy ? undefined : onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay" />
        <Dialog.Content className="dialog-content" {...focus}>
          <Dialog.Title className="font-display text-2xl font-bold pr-10">
            {title}
          </Dialog.Title>
          <Dialog.Description className="text-muted my-4 leading-relaxed">
            {description}
          </Dialog.Description>
          <div className="flex flex-wrap justify-end gap-3">
            <Dialog.Close asChild>
              <Button variant="secondary" disabled={busy}>
                Cancelar
              </Button>
            </Dialog.Close>
            <Button onClick={onConfirm} disabled={busy}>
              {busy ? "Restaurando…" : "Restaurar dados"}
            </Button>
          </div>
          <Dialog.Close asChild>
            <Button
              className="absolute right-3 top-3 px-3"
              variant="ghost"
              aria-label="Fechar confirmação"
              disabled={busy}
            >
              <X size={20} />
            </Button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
