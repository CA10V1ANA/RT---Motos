"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMoto, useMotosPublicas, useDadosProntos } from "@/lib/data/hooks";
import { retornoSeguro } from "@/lib/catalog";
import { SiteHeader, SiteFooter } from "./site-header";
import { MotoPresentation } from "./moto-presentation";
import { MotoCard } from "./moto-card";
import { Skeleton } from "../ui/primitives";
export function MotoDetail({ slug }: { slug: string }) {
  const moto = useMoto(slug);
  const motos = useMotosPublicas();
  const pronto = useDadosProntos();
  const search = useSearchParams();
  const retorno = retornoSeguro(search.get("retorno"));
  if (!pronto && !moto)
    return (
      <main id="conteudo" className="container-shell py-10">
        <Skeleton className="h-96" />
      </main>
    );
  const semelhantes = moto
    ? motos
        .filter(
          (m) =>
            m.id !== moto.id &&
            (m.marca === moto.marca ||
              (moto.preco !== null &&
                m.preco !== null &&
                Math.abs(m.preco - moto.preco) < moto.preco * 0.3)),
        )
        .slice(0, 3)
    : [];
  return (
    <>
      <SiteHeader />
      <main id="conteudo" className="container-shell detail-main">
        <nav className="breadcrumb" aria-label="Caminho">
          <Link href={retorno}>← Voltar ao estoque</Link>
          {moto && (
            <span>
              / {moto.marca} / {moto.modelo}
            </span>
          )}
        </nav>
        {moto ? (
          <>
            {(moto.disponibilidade === "vendida" || moto.arquivada) && (
              <div role="status" className="notice">
                {moto.disponibilidade === "vendida"
                  ? "Esta moto já foi vendida"
                  : "Esta moto foi arquivada e não está disponível"}
                . Explore outras opções da loja.
              </div>
            )}
            <MotoPresentation moto={moto} />
            {semelhantes.length > 0 && (
              <section className="py-12">
                <h2 className="section-title mb-6">
                  Outros caminhos para você.
                </h2>
                <div className="moto-grid">
                  {semelhantes.map((m) => (
                    <MotoCard key={m.id} moto={m} />
                  ))}
                </div>
              </section>
            )}
          </>
        ) : (
          <div className="empty-state">
            <h1>Anúncio indisponível</h1>
            <p>
              Este anúncio não foi publicado ou não está disponível neste
              navegador.
            </p>
            <Link className="button button-secondary" href="/">
              Ver estoque
            </Link>
          </div>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
