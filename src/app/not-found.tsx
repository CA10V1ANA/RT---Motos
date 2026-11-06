import Link from "next/link";
export default function NotFound() {
  return (
    <main id="conteudo" className="empty-state relative">
      <p className="eyebrow">RT Motos / 404</p>
      <h1>Esse caminho ainda não existe.</h1>
      <p>Volte ao estoque para encontrar sua próxima moto.</p>
      <Link className="button button-secondary" href="/">
        Voltar ao catálogo
      </Link>
    </main>
  );
}
