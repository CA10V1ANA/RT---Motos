"use client";
import Link from "next/link";
import { motion } from "motion/react";
import type { MotoPublica } from "@/lib/data/schemas";
import { formatarKm } from "@/lib/format";
import { Badge } from "../ui/primitives";
import { AnimatedNumber } from "../ui/animated-number";
import { SpotlightCard } from "../effects/spotlight-card";
import { BorderBeam } from "../effects/border-beam";
import { MotoImage } from "./moto-image";
export function MotoStatus({ moto }: { moto: MotoPublica }) {
  return (
    <Badge
      tone={
        moto.publicacao === "rascunho" || moto.arquivada
          ? "neutral"
          : moto.disponibilidade === "disponivel"
            ? "success"
            : moto.disponibilidade === "reservada"
              ? "warning"
              : "danger"
      }
    >
      {moto.arquivada
        ? "Arquivada"
        : moto.publicacao === "rascunho"
          ? "Rascunho"
          : moto.disponibilidade === "disponivel"
            ? "Disponível"
            : moto.disponibilidade === "reservada"
              ? "Reservada"
              : "Vendida"}
    </Badge>
  );
}
export function MotoCard({
  moto,
  retorno = "/",
  preview = false,
}: {
  moto: MotoPublica;
  retorno?: string;
  preview?: boolean;
}) {
  return (
    <SpotlightCard className="moto-card">
      <motion.div
        layoutId={preview ? undefined : `foto-${moto.id}`}
        className="card-photo"
      >
        <MotoImage
          src={moto.fotos[0]?.src}
          alt={`${moto.marca} ${moto.modelo}, ${moto.cor}`}
        />
        <div className="absolute right-3 top-3">
          <MotoStatus moto={moto} />
        </div>
      </motion.div>
      <div className="p-5">
        <p className="eyebrow mb-2">
          {moto.codigo} /{" "}
          {moto.modalidade === "repasse" ? "Repasse" : "Estoque próprio"}
        </p>
        <motion.h3
          layoutId={preview ? undefined : `titulo-${moto.id}`}
          className="text-xl font-bold"
        >
          {moto.marca} {moto.modelo} {moto.versao}
        </motion.h3>
        <p className="font-mono text-xs text-muted mt-3">
          {moto.anoFabricacao}/{moto.anoModelo} <span className="mx-2">•</span>
          {formatarKm(moto.km)}
        </p>
        <div className="flex items-center justify-between flex-wrap gap-3 mt-5">
          <div className="text-xl">
            {moto.preco === null ? (
              <span className="text-sm">Consulte o valor</span>
            ) : (
              <AnimatedNumber value={moto.preco} currency />
            )}
          </div>
          {!preview && (
            <Link
              className="card-detail-link"
              href={`/motos/${moto.slug}?retorno=${encodeURIComponent(retorno)}`}
              aria-label={`Ver detalhes de ${moto.marca} ${moto.modelo}`}
            >
              Ver detalhes <span aria-hidden>↗</span>
            </Link>
          )}
        </div>
      </div>
      {moto.destaque && <BorderBeam />}
    </SpotlightCard>
  );
}
