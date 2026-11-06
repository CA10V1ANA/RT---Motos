import { z } from "zod";
import { motoSchema, type Moto } from "./schemas";
const schema = motoSchema.safeExtend({
  marca: z.string(),
  modelo: z.string(),
  cor: z.string(),
});
const chave = (id: string) => `rt-motos-rascunho-${id}`;
export const rascunhoRepository = {
  obter(id: string): Moto | undefined {
    try {
      const raw = localStorage.getItem(chave(id));
      if (!raw) return;
      const parsed = schema.safeParse(JSON.parse(raw));
      return parsed.success ? parsed.data : undefined;
    } catch {
      return;
    }
  },
  salvar(id: string, moto: Moto) {
    localStorage.setItem(chave(id), JSON.stringify(schema.parse(moto)));
  },
  remover(id: string) {
    localStorage.removeItem(chave(id));
  },
  limpar() {
    for (const key of Object.keys(localStorage))
      if (key.startsWith("rt-motos-rascunho-")) localStorage.removeItem(key);
  },
};
export function criarRascunho(): Moto {
  const now = new Date().toISOString();
  return {
    id: "nova",
    codigo: "RT-000",
    slug: "nova",
    marca: "",
    modelo: "",
    versao: "",
    anoFabricacao: 2026,
    anoModelo: 2026,
    km: 0,
    cilindrada: 160,
    cor: "",
    combustivel: "Flex",
    partida: "Elétrica",
    freios: "",
    condicao: "seminova",
    modalidade: "estoque_proprio",
    preco: null,
    aceitaTroca: true,
    financiamento: true,
    descricao: "",
    acessorios: [],
    documentacao: "",
    fotos: [],
    hotspots: [],
    destaque: false,
    publicacao: "rascunho",
    disponibilidade: "disponivel",
    arquivada: false,
    custos: {
      aquisicao: 0,
      oficina: 0,
      estetica: 0,
      documentacao: 0,
      outros: 0,
    },
    dataEntrada: now,
    atualizadoEm: now,
  };
}
