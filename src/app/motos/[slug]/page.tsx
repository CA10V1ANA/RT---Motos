import { Suspense } from "react";
import type { Metadata } from "next";
import { criarSeed } from "@/lib/data/seed";
import { formatarMoeda } from "@/lib/format";
import { MotoDetail } from "@/components/public/moto-detail";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const moto = criarSeed().motos.find(
    (m) => m.slug === slug && m.publicacao === "publicado",
  );
  if (!moto)
    return {
      title: "Catálogo de motos",
      description: "Consulte as motos disponíveis na demonstração da RT Motos.",
    };
  const title = `${moto.marca} ${moto.modelo} ${moto.anoModelo}`;
  const description = `${formatarMoeda(moto.preco)} · ${moto.codigo} · Demonstração com dados fictícios.`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: moto.fotos[0] ? [moto.fotos[0].src] : [],
    },
  };
}
export default async function MotoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <Suspense>
      <MotoDetail slug={slug} />
    </Suspense>
  );
}
