import { z } from "zod";

const dinheiro = z.number().finite().nonnegative();
const iso = z.iso.datetime({ offset: true });
export const fotoSchema = z.object({
  id: z.string().min(1),
  src: z.string().regex(/^(\/motos\/|idb:)/),
  legenda: z.string().optional(),
});
export const hotspotSchema = z.object({
  id: z.string(),
  fotoId: z.string(),
  x: z.number().min(0).max(100),
  y: z.number().min(0).max(100),
  titulo: z.string().min(1),
  descricao: z.string().optional(),
});
export const custosSchema = z.object({
  aquisicao: dinheiro,
  oficina: dinheiro,
  estetica: dinheiro,
  documentacao: dinheiro,
  outros: dinheiro,
  observacoes: z.string().optional(),
});
export const vendaSchema = z.object({
  valorFinal: dinheiro,
  data: iso,
  forma: z.enum(["a_vista", "financiada", "com_troca", "outra"]).optional(),
  observacao: z.string().optional(),
});
export const motoSchema = z
  .object({
    id: z.string().min(1),
    codigo: z.string().regex(/^RT-\d{3,}$/),
    slug: z.string().min(1),
    marca: z.string().min(1),
    modelo: z.string().min(1),
    versao: z.string().optional(),
    anoFabricacao: z.number().int().min(1900).max(2100),
    anoModelo: z.number().int().min(1900).max(2100),
    km: z.number().int().nonnegative(),
    cilindrada: z.number().positive(),
    cor: z.string().min(1),
    combustivel: z.enum(["Flex", "Gasolina", "Elétrica"]),
    partida: z.enum(["Elétrica", "Pedal", "Elétrica e pedal"]).optional(),
    freios: z.string().optional(),
    condicao: z.enum(["seminova", "nova"]),
    modalidade: z.enum(["estoque_proprio", "repasse"]),
    preco: dinheiro.nullable(),
    aceitaTroca: z.boolean(),
    financiamento: z.boolean(),
    condicoesTexto: z.string().optional(),
    descricao: z.string(),
    acessorios: z.array(z.string()),
    documentacao: z.string().optional(),
    fotos: z.array(fotoSchema),
    hotspots: z.array(hotspotSchema),
    destaque: z.boolean(),
    publicacao: z.enum(["rascunho", "publicado"]),
    disponibilidade: z.enum(["disponivel", "reservada", "vendida"]),
    arquivada: z.boolean(),
    custos: custosSchema,
    venda: vendaSchema.optional(),
    dataEntrada: iso,
    atualizadoEm: iso,
  })
  .superRefine((moto, ctx) => {
    if (moto.disponibilidade === "vendida" && !moto.venda)
      ctx.addIssue({
        code: "custom",
        path: ["venda"],
        message: "Informe os dados da venda.",
      });
    if (moto.disponibilidade !== "vendida" && moto.venda)
      ctx.addIssue({
        code: "custom",
        path: ["venda"],
        message: "Uma venda exige o status vendida.",
      });
    if (moto.hotspots.some((p) => !moto.fotos.some((f) => f.id === p.fotoId)))
      ctx.addIssue({
        code: "custom",
        path: ["hotspots"],
        message: "Selecione uma foto existente.",
      });
  });
export const identificacaoSchema = z
  .object(motoSchema.shape)
  .pick({
    marca: true,
    modelo: true,
    cor: true,
    anoFabricacao: true,
    anoModelo: true,
    km: true,
    cilindrada: true,
    combustivel: true,
    condicao: true,
  });
export const configSchema = z.object({
  nome: z.string().min(1),
  whatsapp: z.string().regex(/^55\d{10,11}$/),
  cidade: z.string().min(1),
  endereco: z.string(),
  horario: z.string(),
  instagram: z.string(),
  apresentacao: z.string(),
  urlBase: z.url().refine((v) => /^https?:/.test(v)),
});
export const cliqueSchema = z.object({
  id: z.string(),
  motoId: z.string().optional(),
  tipo: z.enum(["interesse", "troca", "financiamento", "contato_geral"]),
  data: iso,
});
export const dadosSchema = z.object({
  geracao: z.number().default(0),
  motos: z.array(motoSchema),
  config: configSchema,
  cliques: z.array(cliqueSchema),
  proximoCodigo: z.number().int().positive(),
});
export type Moto = z.infer<typeof motoSchema>;
export type Custos = z.infer<typeof custosSchema>;
export type Venda = z.infer<typeof vendaSchema>;
export type ConfigLoja = z.infer<typeof configSchema>;
export type CliqueAtendimento = z.infer<typeof cliqueSchema>;
export type DadosDemo = z.infer<typeof dadosSchema>;
export type MotoPublica = Omit<Moto, "custos" | "venda">;
export type Disponibilidade = Moto["disponibilidade"];
export type Publicacao = Moto["publicacao"];
export type Modalidade = Moto["modalidade"];
export type Condicao = Moto["condicao"];
export type Foto = z.infer<typeof fotoSchema>;
export type Hotspot = z.infer<typeof hotspotSchema>;
export type TipoClique = CliqueAtendimento["tipo"];
