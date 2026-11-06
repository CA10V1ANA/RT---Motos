import { z } from "zod";
import type { ConfigLoja, MotoPublica } from "./data/schemas";
import { formatarMoeda } from "./format";
export const trocaSchema = z.object({
  modelo: z.string().trim().min(1),
  ano: z.number().int().min(1900).max(2100),
  faixaKm: z.string().min(1),
  estado: z.enum(["Ótimo", "Bom", "Precisa de reparos"]),
  financiarDiferenca: z.boolean(),
});
export const financiamentoSchema = z.object({
  entrada: z.number().nonnegative().optional(),
  prazo: z.union([z.literal(24), z.literal(36), z.literal(48)]),
});
export function linkWhatsApp(numero: string, mensagem: string) {
  if (!/^55\d{10,11}$/.test(numero))
    throw new Error("Informe um WhatsApp válido com DDI e DDD.");
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
}
const identificacao = (config: ConfigLoja, moto: MotoPublica) =>
  `${moto.marca} ${moto.modelo}${moto.versao ? ` ${moto.versao}` : ""} ${moto.anoFabricacao}/${moto.anoModelo}\nCódigo: ${moto.codigo} • ${formatarMoeda(moto.preco)}\nLink: ${config.urlBase.replace(/\/$/, "")}/motos/${moto.slug}`;
export function mensagemInteresse(config: ConfigLoja, moto: MotoPublica) {
  return moto.disponibilidade === "reservada"
    ? `Olá, ${config.nome}! Vi que a moto ${moto.codigo} está reservada. Pode me avisar se ela liberar?\n${identificacao(config, moto)}`
    : `Olá, ${config.nome}! Vi no catálogo e tenho interesse nesta moto:\n${identificacao(config, moto)}`;
}
export function mensagemTroca(
  config: ConfigLoja,
  moto: MotoPublica,
  dados: z.infer<typeof trocaSchema>,
) {
  const d = trocaSchema.parse(dados);
  return `Olá, ${config.nome}! Quero oferecer minha moto na troca:\n${d.modelo} • ${d.ano}\nKM: ${d.faixaKm}\nEstado: ${d.estado}\nFinanciar a diferença: ${d.financiarDiferenca ? "Sim" : "Não"}\nMoto de interesse:\n${identificacao(config, moto)}\nEntendo que a avaliação é feita pela equipe da loja.`;
}
export function mensagemFinanciamento(
  config: ConfigLoja,
  moto: MotoPublica,
  dados: z.infer<typeof financiamentoSchema>,
) {
  const d = financiamentoSchema.parse(dados);
  return `Olá, ${config.nome}! Gostaria de consultar uma simulação de financiamento:\n${identificacao(config, moto)}\nEntrada pretendida: ${d.entrada === undefined ? "A combinar" : formatarMoeda(d.entrada)}\nPrazo de interesse: ${d.prazo}x\nAguardo as condições da equipe.`;
}
export const mensagemContato = (config: ConfigLoja) =>
  `Olá, ${config.nome}! Vi o catálogo e gostaria de falar com a equipe.`;
