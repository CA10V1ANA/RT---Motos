"use client";
import { useRef } from "react";
export function useDialogFocus() {
  const trigger = useRef<HTMLElement | null>(null);
  return {
    onOpenAutoFocus: () => {
      trigger.current =
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null;
    },
    onCloseAutoFocus: (event: Event) => {
      event.preventDefault();
      trigger.current?.focus({ preventScroll: true });
    },
  };
}
