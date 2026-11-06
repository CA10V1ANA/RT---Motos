"use client";
import { motion } from "motion/react";
import {
  CalendarDays,
  Gauge,
  Fuel,
  Zap,
  ShieldCheck,
  Bike,
} from "lucide-react";
import type { MotoPublica } from "@/lib/data/schemas";
import { formatarKm } from "@/lib/format";
import { Gallery } from "./gallery";
import { MotoStatus } from "./moto-card";
import { AnimatedNumber } from "../ui/animated-number";
import { Badge } from "../ui/primitives";
import { WhatsAppLink } from "./whatsapp-link";
import { ContactFlow } from "./contact";
export function MotoPresentation({
  moto,
  preview = false,
}: {
  moto: MotoPublica;
  preview?: boolean;
}) {
  const encerrada = moto.disponibilidade === "vendida" || moto.arquivada;
  const ficha = [
    [CalendarDays, "Ano", `${moto.anoFabricacao}/${moto.anoModelo}`],
    [Gauge, "Quilometragem", formatarKm(moto.km)],
    [Bike, "Cilindrada", `${moto.cilindrada} cc`],
    [Fuel, "Combustível", moto.combustivel],
    [
      Zap,
      "Partida / freios",
      `${moto.partida ?? "Não informado"} / ${moto.freios ?? "Não informado"}`,
    ],
    [ShieldCheck, "Documentação", moto.documentacao || "Consulte a equipe"],
  ] as const;
  return (
    <>
      <div className="moto-detail-grid">
        <div>
          <Gallery moto={moto} preview={preview} />
          <section className="detail-copy">
            <h2>Sobre esta moto</h2>
            <p>{moto.descricao || "Descrição em preparação."}</p>
            {moto.acessorios.length > 0 && (
              <>
                <h2>Acessórios</h2>
                <div className="flex flex-wrap gap-2">
                  {moto.acessorios.map((a) => (
                    <Badge key={a}>{a}</Badge>
                  ))}
                </div>
              </>
            )}
            <h2>Condições</h2>
            <p>
              {moto.condicoesTexto ||
                "Consulte a equipe sobre condições e disponibilidade."}
            </p>
            {moto.modalidade === "repasse" && (
              <p className="text-warning">
                Moto de repasse, sem garantia da loja.
              </p>
            )}
            <p className="text-xs text-muted">
              Dados fictícios para demonstração. As condições reais devem ser
              confirmadas com a RT Motos.
            </p>
          </section>
        </div>
        <aside className="detail-info surface rounded-2xl">
          <div className="flex flex-wrap items-center gap-2 mb-5">
            <span className="font-mono text-xs text-muted">{moto.codigo}</span>
            <MotoStatus moto={moto} />
            <Badge tone={moto.modalidade === "repasse" ? "warning" : "neutral"}>
              {moto.modalidade === "repasse" ? "Repasse" : "Estoque próprio"}
            </Badge>
          </div>
          <motion.h1
            layoutId={preview ? undefined : `titulo-${moto.id}`}
            className="page-title"
          >
            {moto.marca}
            <br />
            {moto.modelo} {moto.versao}
          </motion.h1>
          <div className="detail-price" data-testid="preco-publico">
            {moto.preco === null ? (
              "Consulte o valor"
            ) : (
              <AnimatedNumber currency value={moto.preco} />
            )}
          </div>
          <dl className="spec-grid">
            {ficha.map(([Icon, label, value]) => (
              <div key={label}>
                <dt>
                  <Icon size={16} />
                  {label}
                </dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
          <div className="flex flex-wrap gap-2 my-5">
            {moto.aceitaTroca && <Badge>Aceita troca</Badge>}
            {moto.financiamento && <Badge>Financiamento</Badge>}
          </div>
          {!encerrada && !preview && (
            <div className="detail-actions">
              <WhatsAppLink moto={moto} />
              {moto.aceitaTroca && <ContactFlow moto={moto} tipo="troca" />}
              {moto.financiamento && (
                <ContactFlow moto={moto} tipo="financiamento" />
              )}
            </div>
          )}
          {encerrada && (
            <p className="text-warning">
              Esta moto já não está disponível. Veja outras opções abaixo.
            </p>
          )}
        </aside>
      </div>
      {!preview && !encerrada && (
        <div className="mobile-dock">
          <WhatsAppLink moto={moto} />
          {moto.aceitaTroca && (
            <ContactFlow moto={moto} tipo="troca">
              Troca
            </ContactFlow>
          )}
        </div>
      )}
    </>
  );
}
