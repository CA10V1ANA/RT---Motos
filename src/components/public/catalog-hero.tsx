"use client";
import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { MotoPublica } from "@/lib/data/schemas";
import { formatarKm, formatarMoeda } from "@/lib/format";
import { Button } from "../ui/button";
import { MetallicText } from "../effects/metallic-text";
import { MotoImage } from "./moto-image";
import { ContactFlow } from "./contact";
export function CatalogHero({ motos }: { motos: MotoPublica[] }) {
  const destaques = motos.filter((m) => m.destaque);
  const itens = destaques.length ? destaques : motos.slice(0, 1);
  const [index, setIndex] = useState(0);
  const moto = itens[index % itens.length];
  const reduced = useReducedMotion();
  if (!moto)
    return (
      <section className="py-16">
        <h1 className="page-title">Sua próxima história começa aqui.</h1>
        <p className="text-muted mt-4">
          Estamos preparando novas motos para você.
        </p>
      </section>
    );
  return (
    <section className="catalog-hero">
      <div>
        <p className="eyebrow flex items-center gap-3">
          <span className="h-px w-8 bg-red" />
          Seleção RT / seminovas
        </p>
        <h1>
          SEU PRÓXIMO
          <br />
          DESTINO COMEÇA
          <br />
          <MetallicText>AQUI.</MetallicText>
        </h1>
        <p className="text-muted max-w-md leading-relaxed">
          Motos com história. Novos caminhos pela frente. Encontre a sua na
          seleção da RT Motos.
        </p>
        <div className="hero-telemetry">
          <strong>
            {moto.marca} {moto.modelo} {moto.versao}
          </strong>
          <span>
            {moto.anoModelo} · {formatarKm(moto.km)} ·{" "}
            {formatarMoeda(moto.preco)}
          </span>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href={`/motos/${moto.slug}`}>Ver detalhes da moto ↗</Link>
          </Button>
          <ContactFlow moto={moto} tipo="troca" />
        </div>
      </div>
      <div className="stage">
        <AnimatePresence mode="wait">
          <motion.div
            key={moto.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0.15 : 0.25 }}
            className="stage-photo"
          >
            <MotoImage
              src={moto.fotos[0]?.src}
              fallbackSrc="/motos/hero.jpg"
              alt={`${moto.marca} ${moto.modelo} em destaque na RT Motos`}
              priority
              className="object-cover object-[50%_52%]"
              sizes="(min-width:1024px) 480px, 100vw"
            />
          </motion.div>
        </AnimatePresence>
        <div className="pedestal" />
        <div className="stage-indicators" aria-label="Motos em destaque">
          {itens.map((item, i) => (
            <button
              key={item.id}
              className={i === index ? "active" : ""}
              aria-label={`Mostrar destaque ${item.modelo}`}
              aria-pressed={i === index}
              onClick={() => setIndex(i)}
            >
              <span />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
