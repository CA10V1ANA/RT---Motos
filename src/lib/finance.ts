import type { Custos, Moto, CliqueAtendimento } from "./data/schemas";
import { REFERENCIA_DEMO } from "./data/seed";
export type Periodo = "mes" | "3meses" | "6meses" | "tudo";
export const custoTotal = (custos: Custos) =>
  custos.aquisicao +
  custos.oficina +
  custos.estetica +
  custos.documentacao +
  custos.outros;
export const lucroMoto = (m: Moto, valor = m.venda?.valorFinal ?? m.preco) =>
  valor === null ? null : valor - custoTotal(m.custos);
export const margemMoto = (m: Moto, valor = m.venda?.valorFinal ?? m.preco) =>
  valor === null || valor === 0
    ? null
    : ((valor - custoTotal(m.custos)) / valor) * 100;
const dia = 86400000;
function calendarioFortaleza(data: Date) {
  return new Date(data.getTime() - 3 * 3600000);
}
function inicioMes(ano: number, mes: number) {
  return Date.UTC(ano, mes, 1, 3);
}
export function limitesPeriodo(periodo: Periodo, agora: Date) {
  if (periodo === "tudo")
    return { inicio: -Infinity, fim: agora.getTime() + 1, anterior: -Infinity };
  const meses = periodo === "mes" ? 1 : periodo === "3meses" ? 3 : 6;
  const local = calendarioFortaleza(agora);
  const ano = local.getUTCFullYear();
  const mes = local.getUTCMonth();
  const inicio = inicioMes(ano, mes - meses + 1);
  const anterior = inicioMes(ano, mes - 2 * meses + 1);
  const fimAnterior = Math.min(
    inicio,
    anterior + (agora.getTime() + 1 - inicio),
  );
  return { inicio, fim: agora.getTime() + 1, anterior, fimAnterior };
}
export function calcularKpis(
  motos: Moto[],
  periodo: Periodo,
  agora = new Date(REFERENCIA_DEMO),
) {
  const limites = limitesPeriodo(periodo, agora);
  const vendas = motos.filter(
    (m) =>
      m.disponibilidade === "vendida" &&
      m.venda &&
      Date.parse(m.venda.data) >= limites.inicio &&
      Date.parse(m.venda.data) < limites.fim,
  );
  const anteriores =
    periodo === "tudo"
      ? []
      : motos.filter(
          (m) =>
            m.venda &&
            Date.parse(m.venda.data) >= limites.anterior &&
            Date.parse(m.venda.data) < (limites.fimAnterior ?? limites.inicio),
        );
  const receita = (lista: Moto[]) =>
    lista.reduce((s, m) => s + (m.venda?.valorFinal ?? 0), 0);
  const faturamento = receita(vendas);
  const faturamentoAnterior = receita(anteriores);
  const custos = vendas.reduce((s, m) => s + custoTotal(m.custos), 0);
  const estoque = motos.filter(
    (m) => !m.arquivada && m.disponibilidade !== "vendida",
  );
  const comPreco = estoque.filter((m) => m.preco !== null);
  return {
    faturamento,
    custos,
    lucroRealizado: faturamento - custos,
    margemMedia: vendas.length
      ? vendas.reduce((s, m) => s + (margemMoto(m) ?? 0), 0) / vendas.length
      : 0,
    variacaoFaturamento:
      periodo === "tudo" || !faturamentoAnterior
        ? null
        : ((faturamento - faturamentoAnterior) / faturamentoAnterior) * 100,
    capitalEstoque: estoque.reduce((s, m) => s + custoTotal(m.custos), 0),
    quantidadeEstoque: estoque.length,
    lucroPotencial: comPreco.reduce((s, m) => s + (lucroMoto(m) ?? 0), 0),
    semPreco: estoque.length - comPreco.length,
    giroMedioDias: vendas.length
      ? vendas.reduce(
          (s, m) =>
            s +
            Math.max(
              0,
              (Date.parse(m.venda!.data) - Date.parse(m.dataEntrada)) / dia,
            ),
          0,
        ) / vendas.length
      : 0,
    ultimasVendas: [...vendas].sort(
      (a, b) => Date.parse(b.venda!.data) - Date.parse(a.venda!.data),
    ),
    situacao: {
      disponiveis: estoque.filter(
        (m) =>
          m.publicacao === "publicado" && m.disponibilidade === "disponivel",
      ).length,
      reservadas: estoque.filter(
        (m) =>
          m.publicacao === "publicado" && m.disponibilidade === "reservada",
      ).length,
      rascunhos: estoque.filter((m) => m.publicacao === "rascunho").length,
      vendidas: vendas.length,
    },
    alertas: {
      paradas: estoque.filter(
        (m) => agora.getTime() - Date.parse(m.dataEntrada) > 60 * dia,
      ),
      margemBaixa: comPreco.filter((m) => (margemMoto(m) ?? 100) < 10),
      semFoto: estoque.filter(
        (m) => m.publicacao === "rascunho" && !m.fotos.length,
      ),
    },
  };
}
export function serieMensal(
  motos: Moto[],
  meses = 6,
  agora = new Date(REFERENCIA_DEMO),
) {
  const local = calendarioFortaleza(agora);
  return Array.from({ length: meses }, (_, i) => {
    const inicio = inicioMes(
      local.getUTCFullYear(),
      local.getUTCMonth() - meses + 1 + i,
    );
    const fim = Math.min(
      inicioMes(local.getUTCFullYear(), local.getUTCMonth() - meses + 2 + i),
      agora.getTime() + 1,
    );
    const vendidas = motos.filter(
      (m) =>
        m.venda &&
        Date.parse(m.venda.data) >= inicio &&
        Date.parse(m.venda.data) < fim,
    );
    const receita = vendidas.reduce((s, m) => s + m.venda!.valorFinal, 0);
    const custo = vendidas.reduce((s, m) => s + custoTotal(m.custos), 0);
    return {
      mes: new Intl.DateTimeFormat("pt-BR", {
        month: "short",
        timeZone: "America/Fortaleza",
      }).format(new Date(inicio)),
      receita,
      custo,
      lucro: receita - custo,
    };
  });
}
export function rankingProcura(
  motos: Moto[],
  cliques: CliqueAtendimento[],
  periodo: Periodo = "mes",
  agora = new Date(REFERENCIA_DEMO),
) {
  const { inicio, fim } = limitesPeriodo(periodo, agora);
  return motos
    .map((moto) => ({
      moto,
      cliques: cliques.filter(
        (c) =>
          c.motoId === moto.id &&
          Date.parse(c.data) >= inicio &&
          Date.parse(c.data) < fim,
      ).length,
    }))
    .filter((m) => m.cliques > 0)
    .sort((a, b) => b.cliques - a.cliques);
}
