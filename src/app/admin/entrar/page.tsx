"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Brand } from "@/components/brand";
import { Card } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { entrarDemo } from "@/lib/data/session";
import { toast } from "sonner";
export default function Entrar() {
  const router = useRouter();
  return (
    <main id="conteudo" className="login-page">
      <Card className="w-full max-w-md p-8">
        <Brand />
        <p className="eyebrow mt-8">A loja nas suas mãos</p>
        <h1 className="page-title mt-3">Bem-vindo ao painel.</h1>
        <p className="text-muted text-sm leading-relaxed my-6">
          Acesso de demonstração — na versão contratada haverá login com usuário
          e senha.
        </p>
        <Button
          className="w-full"
          onClick={() => {
            try {
              entrarDemo();
              router.push("/admin");
            } catch {
              toast.error(
                "Permita o armazenamento de sessão no navegador para entrar.",
              );
            }
          }}
        >
          Entrar no painel (demo)
        </Button>
        <Link href="/" className="nav-link text-sm mt-4">
          ← Voltar ao catálogo
        </Link>
      </Card>
    </main>
  );
}
