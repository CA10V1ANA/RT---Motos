"use client";
import { useState, useSyncExternalStore } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Drawer } from "vaul";
import { X } from "lucide-react";
import { Button } from "./button";
import { useDialogFocus } from "./use-dialog-focus";
const subscribe = (callback: () => void) => {
  const media = matchMedia("(max-width: 767px)");
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
};
export function useMobile() {
  return useSyncExternalStore(
    subscribe,
    () => matchMedia("(max-width: 767px)").matches,
    () => false,
  );
}
export function ResponsivePanel({
  open,
  onOpenChange,
  title,
  description,
  children,
  wide = false,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  const mobile = useMobile();
  const focus = useDialogFocus();
  const [snap, setSnap] = useState<number | string | null>(0.95);
  if (mobile)
    return (
      <Drawer.Root
        open={open}
        onOpenChange={onOpenChange}
        snapPoints={[0.55, 0.95]}
        activeSnapPoint={snap}
        setActiveSnapPoint={setSnap}
      >
        <Drawer.Portal>
          <Drawer.Overlay className="dialog-overlay" />
          <Drawer.Content className="drawer-content" {...focus}>
            <div className="drawer-handle" />
            <div className="flex justify-between items-start gap-4">
              <Drawer.Title className="text-2xl font-display font-bold">
                {title}
              </Drawer.Title>
              <Drawer.Close asChild>
                <Button variant="ghost" aria-label="Fechar" className="px-3">
                  <X size={20} />
                </Button>
              </Drawer.Close>
            </div>
            <Drawer.Description className="text-sm text-muted mt-2 mb-5">
              {description ?? "Explore as opções abaixo."}
            </Drawer.Description>
            {children}
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    );
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay" />
        <Dialog.Content
          {...focus}
          className={`dialog-content scroll-panel ${wide ? "panel-wide" : ""}`}
        >
          <Dialog.Title className="text-2xl font-display font-bold pr-10">
            {title}
          </Dialog.Title>
          <Dialog.Description className="text-sm text-muted mt-2 mb-5">
            {description ?? "Explore as opções abaixo."}
          </Dialog.Description>
          {children}
          <Dialog.Close asChild>
            <Button
              variant="ghost"
              className="absolute top-3 right-3 px-3"
              aria-label="Fechar"
            >
              <X size={20} />
            </Button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
