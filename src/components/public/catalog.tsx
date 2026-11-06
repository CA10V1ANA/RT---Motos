"use client";
import { useSearchParams } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { useMotosPublicas } from "@/lib/data/hooks";
import { filtrarMotos } from "@/lib/catalog";
import { SiteHeader, SiteFooter, TrustStrip, AboutStore } from "./site-header";
import { CatalogHero } from "./catalog-hero";
import { CatalogFilters } from "./catalog-filters";
import { MotoCard } from "./moto-card";
import { ContactFlow } from "./contact";
import { Button } from "../ui/button";
export function Catalog() {
  const motos = useMotosPublicas();
  const search = useSearchParams();
  const params = new URLSearchParams(search.toString());
  const list = filtrarMotos(motos, params);
  const reduced = useReducedMotion();
  function update(key: string, value: string) {
    const next = new URLSearchParams(window.location.search);
    if (value) next.set(key, value);
    else next.delete(key);
    window.history.replaceState(
      null,
      "",
      `/${next.size ? `?${next}` : ""}#estoque`,
    );
  }
  const retorno = `/${params.size ? `?${params}` : ""}#estoque`;
  return (
    <>
      <SiteHeader />
      <main id="conteudo" className="container-shell relative">
        <CatalogHero motos={motos} />
        <TrustStrip />
        <section id="estoque" className="py-12">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Escolha seu próximo caminho</p>
              <h2 className="section-title mt-3">Nosso estoque.</h2>
            </div>
            <p className="font-mono text-xs text-muted" aria-live="polite">
              {list.length}{" "}
              {list.length === 1 ? "moto encontrada" : "motos encontradas"}
            </p>
          </div>
          <CatalogFilters motos={motos} params={params} update={update} />
          <div className="moto-grid">
            {list.map((moto, i) => (
              <motion.div
                key={moto.id}
                layout={!reduced}
                className="catalog-item"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reduced ? 0.15 : 0.25, delay: reduced ? 0 : i * 0.05 }}
              >
                <MotoCard moto={moto} retorno={retorno} />
              </motion.div>
            ))}
          </div>
          {!list.length && (
            <div className="empty-state">
              <h3>Nenhuma moto com esses filtros.</h3>
              <p>Tente outra combinação para encontrar seu próximo caminho.</p>
              <Button
                variant="secondary"
                onClick={() =>
                  window.history.replaceState(null, "", "/#estoque")
                }
              >
                Limpar filtros
              </Button>
            </div>
          )}
        </section>
        <section id="troca" className="trade-section surface rounded-2xl">
          <div>
            <p className="eyebrow">Sua moto faz parte dessa história</p>
            <h2 className="section-title mt-3">
              De uma boa troca,
              <br />
              um novo começo.
            </h2>
            <p className="text-muted mt-4">
              Conte à equipe qual é a sua moto. A avaliação é feita pela loja,
              com atenção a cada detalhe.
            </p>
          </div>
          {motos[0] && <ContactFlow moto={motos[0]} tipo="troca" />}
        </section>
        <AboutStore />
      </main>
      <SiteFooter />
    </>
  );
}
