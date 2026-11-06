"use client";
import { useCallback, useSyncExternalStore } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Drawer } from "vaul";
import { X } from "lucide-react";
import { Button } from "./button";
import { useDialogFocus } from "./use-dialog-focus";
/** Celulares (abaixo de 768px). */
export const MOBILE_QUERY = "(max-width: 767px)";
/** Celulares e tablets (abaixo de 1024px). */
export const TABLET_DOWN_QUERY = "(max-width: 1023px)";
export function useMobile(query: string = MOBILE_QUERY) {
  const subscribe = useCallback(
    (callback: () => void) => {
      const media = matchMedia(query);
      media.addEventListener("change", callback);
      return () => media.removeEventListener("change", callback);
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () => matchMedia(query).matches,
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
  if (mobile)
    return (
      // Sem snap points: com eles o vaul trava a rolagem do conteúdo até o
      // painel estar 100% aberto, o que impedia descer no celular.
      <Drawer.Root open={open} onOpenChange={onOpenChange}>
        <Drawer.Portal>
          <Drawer.Overlay className="dialog-overlay" />
          <Drawer.Content className="drawer-content" {...focus}>
            {/* Cabeçalho fixo: é por aqui que o usuário arrasta para fechar. */}
            <div className="drawer-header">
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
              <Drawer.Description className="text-sm text-muted mt-2">
                {description ?? "Explore as opções abaixo."}
              </Drawer.Description>
            </div>
            {/* Corpo rolável: data-vaul-no-drag libera a rolagem nativa. */}
            <div className="drawer-body" data-vaul-no-drag>
              {children}
            </div>
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
