"use client";
import { toast } from "sonner";
import type { MotoPublica } from "@/lib/data/schemas";
import { useConfigLoja } from "@/lib/data/hooks";
import { registrarAtendimento } from "@/lib/data/attendance";
import {
  mensagemContato,
  mensagemInteresse,
  linkWhatsApp,
} from "@/lib/whatsapp";
import { Button } from "../ui/button";
export function WhatsAppLink({
  moto,
  children,
  secondary = false,
}: {
  moto?: MotoPublica;
  children?: React.ReactNode;
  secondary?: boolean;
}) {
  const config = useConfigLoja();
  const mensagem = moto
    ? mensagemInteresse(config, moto)
    : mensagemContato(config);
  return (
    <Button variant={secondary ? "secondary" : "primary"} asChild>
      <a
        href={linkWhatsApp(config.whatsapp, mensagem)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => {
          try {
            registrarAtendimento(
              config.whatsapp,
              mensagem,
              moto ? "interesse" : "contato_geral",
              moto?.id,
            );
          } catch {
            e.preventDefault();
            toast.error(
              "Não foi possível registrar o clique. Tente novamente.",
            );
          }
        }}
      >
        {children ??
          (moto?.disponibilidade === "reservada"
            ? "Avise-me se liberar"
            : moto
              ? "Tenho interesse nesta moto"
              : "Falar no WhatsApp")}
      </a>
    </Button>
  );
}
