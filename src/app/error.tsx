"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main id="conteudo" className="empty-state relative">
      <h1>Não foi possível abrir esta página.</h1>
      <p>Tente novamente ou volte ao catálogo.</p>
      <Button onClick={reset}>Tentar novamente</Button>
      <Link className="nav-link" href="/">
        Voltar ao catálogo
      </Link>
    </main>
  );
}
