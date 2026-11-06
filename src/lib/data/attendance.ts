import { cliqueRepository } from "./repository";
import type { TipoClique } from "./schemas";
import { linkWhatsApp } from "../whatsapp";
export function registrarAtendimento(
  numero: string,
  mensagem: string,
  tipo: TipoClique,
  motoId?: string,
) {
  const href = linkWhatsApp(numero, mensagem);
  cliqueRepository.registrar(tipo, motoId);
  return href;
}
