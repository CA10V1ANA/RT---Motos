"use client";
import { useEffect } from "react";
import { MotionConfig, LayoutGroup } from "motion/react";
import { Toaster, toast } from "sonner";
import { useGeracaoDemo } from "@/lib/data/hooks";
import {
  consumirErroPersistencia,
  iniciarDados,
  sincronizarAbas,
} from "@/lib/data/store";
export function Providers({ children }: { children: React.ReactNode }) {
  const geracao = useGeracaoDemo();
  useEffect(() => {
    void iniciarDados().then(() => {
      const erro = consumirErroPersistencia();
      if (erro) toast.error(erro);
    });
    return sincronizarAbas();
  }, []);
  return (
    <MotionConfig
      reducedMotion="user"
      transition={{ type: "spring", stiffness: 380, damping: 32 }}
    >
      <LayoutGroup key={geracao}>{children}</LayoutGroup>
      <Toaster theme="dark" richColors closeButton />
    </MotionConfig>
  );
}
