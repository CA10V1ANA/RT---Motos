"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowUpRight, CircleAlert } from "lucide-react";
import { useMotosAdmin, useCliques } from "@/lib/data/hooks";
import {
  calcularKpis,
  lucroMoto,
  serieMensal,
  rankingProcura,
  type Periodo,
} from "@/lib/finance";
import { formatarData, formatarMoeda, formatarPercentual } from "@/lib/format";
import { AnimatedNumber } from "../ui/animated-number";
import { Card, Skeleton } from "../ui/primitives";
import { Select } from "../ui/field";
import { MotoImage } from "../public/moto-image";
const Chart = dynamic(() => import("./sales-chart").then((m) => m.SalesChart), {
  ssr: false,
  loading: () => <Skeleton className="h-80" />,
});
export function Dashboard() {
  const motos = useMotosAdmin();
  const cliques = useCliques();
  const [periodo, setPeriodo] = useState<Periodo>("mes");
  const [agora, setAgora] = useState(() => new Date());
  useEffect(() => {
    const timer = setInterval(() => setAgora(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);
  const k = calcularKpis(motos, periodo, agora);
  const ranking = rankingProcura(motos, cliques, periodo, agora).slice(0, 5);
  const meses =
    periodo === "mes"
      ? 1
      : periodo === "3meses"
        ? 3
        : periodo === "6meses"
          ? 6
          : Math.max(
              6,
              Math.round(
                (agora.getTime() -
                  Math.min(
                    ...motos.map((m) =>
                      Date.parse(m.venda?.data ?? m.dataEntrada),
                    ),
                    agora.getTime(),
                  )) /
                  (30 * 86400000),
              ) + 1,
            );
  const cards = [
    {
      label: "Faturamento",
      value: k.faturamento,
      note:
        k.variacaoFaturamento === null
          ? "Sem base comparável no período anterior"
          : `${formatarPercentual(k.variacaoFaturamento)} vs. período anterior equivalente`,
    },
    {
      label: "Custos das motos vendidas",
      value: k.custos,
      note: `${k.ultimasVendas.length} vendas no período`,
    },
    {
      label: "Lucro realizado",
      value: k.lucroRealizado,
      note: `Margem média ${formatarPercentual(k.margemMedia)}`,
      profit: true,
    },
    {
      label: "Capital em estoque",
      value: k.capitalEstoque,
      note: `${k.quantidadeEstoque} motos ativas, incluindo rascunhos`,
    },
    {
      label: "Lucro potencial em estoque",
      value: k.lucroPotencial,
      note: k.semPreco
        ? `${k.semPreco} motos sob consulta fora do cálculo`
        : "Preços anunciados menos custos totais",
    },
    {
      label: "Giro médio",
      value: k.giroMedioDias,
      note: "Da entrada no estoque até a venda",
      days: true,
    },
  ];
  const alertas = [
    ...k.alertas.paradas.map((m) => ({
      moto: m,
      texto: "Mais de 60 dias no estoque",
    })),
    ...k.alertas.margemBaixa.map((m) => ({
      moto: m,
      texto: "Margem abaixo de 10%",
    })),
    ...k.alertas.semFoto.map((m) => ({ moto: m, texto: "Rascunho sem foto" })),
  ];
  return (
    <>
      <div className="section-heading">
        <div>
          <p className="eyebrow">Visão geral & lucros</p>
          <h1 className="page-title mt-3">O próximo passo, em números.</h1>
          <p className="text-xs text-muted mt-3">
            Dados de demonstração · atualizado em{" "}
            {formatarData(agora.toISOString())}
          </p>
        </div>
        <Select
          className="w-auto"
          aria-label="Período da dashboard"
          value={periodo}
          onChange={(e) => setPeriodo(e.target.value as Periodo)}
        >
          <option value="mes">Este mês</option>
          <option value="3meses">Últimos 3 meses</option>
          <option value="6meses">Últimos 6 meses</option>
          <option value="tudo">Tudo</option>
        </Select>
      </div>
      <div className="kpi-grid">
        {cards.map((c) => (
          <Card
            key={c.label}
            className={`kpi-card ${c.profit ? "kpi-profit" : ""}`}
          >
            <h2>{c.label}</h2>
            <div className="kpi-value" data-testid={`kpi-${c.label}`}>
              <AnimatedNumber
                value={c.value}
                currency={!c.days}
                suffix={c.days ? " dias" : undefined}
              />
            </div>
            <p>{c.note}</p>
          </Card>
        ))}
      </div>
      <div className="dashboard-middle">
        <Card className="p-5 min-w-0">
          <div className="section-heading mb-3">
            <h2 className="text-xl font-bold">Receita, custos e resultado.</h2>
            <span className="eyebrow">Mensal / R$</span>
          </div>
          <Chart dados={serieMensal(motos, meses, agora)} />
        </Card>
        <Card className="p-5">
          <h2 className="text-xl font-bold">Termômetro de procura</h2>
          <p className="text-xs text-muted mt-2 mb-5">
            Cliques para atendimento no período
          </p>
          <div className="space-y-5">
            {ranking.map(({ moto, cliques: total }) => (
              <Link
                className="ranking-row"
                key={moto.id}
                href={`/admin/motos/${moto.id}`}
              >
                <div className="ranking-photo">
                  <MotoImage src={moto.fotos[0]?.src} alt={moto.modelo} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm truncate">{moto.modelo}</p>
                  <div className="ranking-bar">
                    <span
                      style={{
                        width: `${(total / Math.max(1, ranking[0].cliques)) * 100}%`,
                      }}
                    />
                  </div>
                  <p className="text-xs text-muted mt-2">{total} cliques</p>
                </div>
              </Link>
            ))}
            {!ranking.length && (
              <p className="text-sm text-muted py-8">
                Ainda não há cliques neste período.
              </p>
            )}
          </div>
        </Card>
      </div>
      <div className="dashboard-bottom">
        <Card className="p-5">
          <h2 className="text-xl font-bold mb-5">Situação do estoque</h2>
          <dl className="stock-summary">
            {Object.entries(k.situacao).map(([label, value]) => (
              <div key={label}>
                <dt>
                  {
                    {
                      disponiveis: "Disponíveis",
                      reservadas: "Reservadas",
                      rascunhos: "Rascunhos",
                      vendidas: "Vendidas no período",
                    }[label]
                  }
                </dt>
                <dd>
                  <AnimatedNumber value={value} />
                </dd>
              </div>
            ))}
          </dl>
          <Link href="/admin/motos" className="nav-link text-xs gap-2 mt-5">
            Abrir estoque <ArrowUpRight size={15} />
          </Link>
        </Card>
        <Card className="p-5">
          <h2 className="text-xl font-bold mb-4">Merecem sua atenção</h2>
          {alertas.length ? (
            <ul className="space-y-3">
              {alertas.map((a, i) => (
                <li key={`${a.moto.id}-${i}`}>
                  <Link
                    href={`/admin/motos/${a.moto.id}`}
                    className="alert-row"
                  >
                    <CircleAlert size={17} className="text-warning shrink-0" />
                    <span>
                      <strong>
                        {a.moto.codigo} · {a.moto.modelo}
                      </strong>
                      <small>{a.texto}</small>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted">
              Tudo em ordem. Nenhum alerta no estoque.
            </p>
          )}
        </Card>
      </div>
      <Card className="p-5 mt-6">
        <h2 className="text-xl font-bold mb-5">Últimas vendas</h2>
        {k.ultimasVendas.slice(0, 8).map((m) => (
          <div className="sale-row" key={m.id}>
            <div>
              <strong>
                {m.marca} {m.modelo}
              </strong>
              <p>
                {m.codigo} · {formatarData(m.venda!.data)}
              </p>
            </div>
            <span className="font-mono">
              {formatarMoeda(m.venda!.valorFinal)}
            </span>
            <span className="font-mono text-success">
              {formatarMoeda(lucroMoto(m))} de lucro
            </span>
          </div>
        ))}
        {!k.ultimasVendas.length && (
          <p className="text-sm text-muted py-6">
            Nenhuma venda registrada neste período.
          </p>
        )}
      </Card>
    </>
  );
}
