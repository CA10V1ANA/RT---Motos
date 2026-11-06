import { demoStore, consumirErroPersistencia } from "./store";
import { criarSeed, slugMoto } from "./seed";
import {
  motoSchema,
  configSchema,
  cliqueSchema,
  vendaSchema,
  type Moto,
  type ConfigLoja,
  type CliqueAtendimento,
  type Venda,
  type Disponibilidade,
  type Publicacao,
} from "./schemas";
import { limparFotos } from "./photos";
import { rascunhoRepository } from "./drafts";

type EntradaMoto = Omit<Moto, "id" | "codigo" | "slug" | "atualizadoEm">;
export interface MotoRepository {
  listar(): Moto[];
  obter(id: string): Moto | undefined;
  obterPorSlug(slug: string): Moto | undefined;
  criar(dados: EntradaMoto): Moto;
  atualizar(id: string, dados: Partial<EntradaMoto>): Moto;
  alterarStatus(
    id: string,
    status: {
      publicacao?: Publicacao;
      disponibilidade?: Exclude<Disponibilidade, "vendida">;
    },
  ): Moto;
  registrarVenda(id: string, venda: Venda): Moto;
  arquivar(id: string, arquivada?: boolean): Moto;
  duplicar(id: string): Moto;
  excluirRascunho(id: string): void;
}
export interface ConfigRepository {
  obter(): ConfigLoja;
  atualizar(dados: Partial<ConfigLoja>): ConfigLoja;
}
export interface CliqueRepository {
  listar(): CliqueAtendimento[];
  registrar(
    tipo: CliqueAtendimento["tipo"],
    motoId?: string,
  ): CliqueAtendimento;
}
const copia = <T>(valor: T): T => structuredClone(valor);
function salvar(
  motos: Moto[],
  proximoCodigo = demoStore.getState().proximoCodigo,
) {
  demoStore.setState({ motos, proximoCodigo });
  const erro = consumirErroPersistencia();
  if (erro) throw new Error(erro);
}
function obter(id: string) {
  const moto = demoStore.getState().motos.find((m) => m.id === id);
  if (!moto) throw new Error("Moto não encontrada.");
  return moto;
}
function substituir(id: string, dados: Partial<Moto>) {
  const moto = motoSchema.parse({
    ...obter(id),
    ...dados,
    atualizadoEm: new Date().toISOString(),
  });
  salvar(demoStore.getState().motos.map((m) => (m.id === id ? moto : m)));
  return copia(moto);
}
export const motoRepository: MotoRepository = {
  listar: () => copia(demoStore.getState().motos),
  obter: (id) => copia(demoStore.getState().motos.find((m) => m.id === id)),
  obterPorSlug: (slug) =>
    copia(demoStore.getState().motos.find((m) => m.slug === slug)),
  criar(dados) {
    const estado = demoStore.getState();
    const n = estado.proximoCodigo;
    const codigo = `RT-${String(n).padStart(3, "0")}`;
    const moto = motoSchema.parse({
      ...dados,
      id: crypto.randomUUID(),
      codigo,
      slug: slugMoto(dados.marca, dados.modelo, dados.anoModelo, codigo),
      atualizadoEm: new Date().toISOString(),
    });
    salvar([...estado.motos, moto], n + 1);
    return copia(moto);
  },
  atualizar: (id, dados) => {
    const permitidos = { ...dados } as Partial<Moto>;
    delete permitidos.id;
    delete permitidos.codigo;
    delete permitidos.slug;
    return substituir(id, permitidos);
  },
  alterarStatus: (id, status) =>
    substituir(id, {
      ...status,
      ...(status.disponibilidade ? { venda: undefined } : {}),
    }),
  registrarVenda: (id, venda) =>
    substituir(id, {
      venda: vendaSchema.parse(venda),
      disponibilidade: "vendida",
    }),
  arquivar: (id, arquivada = true) => substituir(id, { arquivada }),
  duplicar(id) {
    const m = obter(id);
    return this.criar({
      ...copia(m),
      publicacao: "rascunho",
      disponibilidade: "disponivel",
      arquivada: false,
      destaque: false,
      venda: undefined,
      dataEntrada: new Date().toISOString(),
    });
  },
  excluirRascunho(id) {
    if (obter(id).publicacao !== "rascunho")
      throw new Error("Somente rascunhos podem ser excluídos.");
    salvar(demoStore.getState().motos.filter((m) => m.id !== id));
  },
};
export const configRepository: ConfigRepository = {
  obter: () => copia(demoStore.getState().config),
  atualizar(dados) {
    const config = configSchema.parse({
      ...demoStore.getState().config,
      ...dados,
    });
    demoStore.setState({ config });
    const erro = consumirErroPersistencia();
    if (erro) throw new Error(erro);
    return copia(config);
  },
};
export const cliqueRepository: CliqueRepository = {
  listar: () => copia(demoStore.getState().cliques),
  registrar(tipo, motoId) {
    if (motoId) obter(motoId);
    const clique = cliqueSchema.parse({
      id: crypto.randomUUID(),
      tipo,
      motoId,
      data: new Date().toISOString(),
    });
    demoStore.setState((s) => ({ cliques: [...s.cliques, clique] }));
    const erro = consumirErroPersistencia();
    if (erro) throw new Error(erro);
    return copia(clique);
  },
};
export async function restaurarDemo() {
  await limparFotos();
  rascunhoRepository.limpar();
  demoStore.setState({ ...criarSeed(), geracao: Date.now() }, true);
  const erro = consumirErroPersistencia();
  if (erro) throw new Error(erro);
}
