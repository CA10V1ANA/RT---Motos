import { Skeleton } from "@/components/ui/primitives";
export default function Loading() {
  return (
    <main
      id="conteudo"
      className="container-shell py-10"
      aria-label="Carregando"
    >
      <Skeleton className="h-12 w-60 mb-6" />
      <Skeleton className="h-96" />
    </main>
  );
}
