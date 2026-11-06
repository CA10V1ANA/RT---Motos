"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { ConfirmDialog } from "./ui/confirm-dialog";
import { restaurarDemo } from "@/lib/data/repository";
export function DemoBanner() {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const admin = usePathname().startsWith("/admin");
  async function restaurar() {
    setBusy(true);
    try {
      await restaurarDemo();
      setOpen(false);
      toast.success("Dados de exemplo restaurados.");
    } catch {
      toast.error(
        "Não foi possível restaurar. Verifique as permissões de armazenamento do navegador.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <aside className="demo-banner" aria-label="Modo demonstração">
        <div className="container-shell demo-inner">
          <span className="demo-label">
            <span className="status-dot" />
            Demonstração <span className="text-subtle">• dados fictícios</span>
          </span>
          <nav aria-label="Experiência da demonstração" className="demo-switch">
            <Link href="/" aria-current={!admin ? "page" : undefined}>
              Catálogo
            </Link>
            <Link href="/admin" aria-current={admin ? "page" : undefined}>
              Painel
            </Link>
          </nav>
          <Button
            variant="ghost"
            className="restore-button"
            onClick={() => setOpen(true)}
            aria-label="Restaurar dados de exemplo"
          >
            <RotateCcw size={14} />
            <span>Restaurar dados</span>
          </Button>
        </div>
      </aside>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="Restaurar a demonstração?"
        description="As alterações e fotos enviadas neste navegador serão removidas. As motos, vendas e configurações voltarão aos exemplos iniciais. Essa ação também atualiza as outras abas abertas."
        onConfirm={() => void restaurar()}
        busy={busy}
      />
    </>
  );
}
