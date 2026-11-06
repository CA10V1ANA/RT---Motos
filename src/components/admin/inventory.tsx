"use client";
import { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";
import { useMotosAdmin } from "@/lib/data/hooks";
import { motoRepository } from "@/lib/data/repository";
import type { Moto } from "@/lib/data/schemas";
import { custoTotal, lucroMoto, margemMoto } from "@/lib/finance";
import { formatarMoeda, formatarPercentual } from "@/lib/format";
import { Button } from "../ui/button";
import { Input } from "../ui/primitives";
import { ResponsivePanel, useMobile } from "../ui/responsive-panel";
import { MotoStatus } from "../public/moto-card";
import { MotoImage } from "../public/moto-image";
import { Inspector } from "./inspector";
import { SaleDialog } from "./sale-dialog";
const abas = [
  "Todas",
  "Disponíveis",
  "Reservadas",
  "Vendidas",
  "Rascunhos",
  "Arquivadas",
];
function corresponde(m: Moto, aba: string) {
  switch (aba) {
    case "Disponíveis":
      return (
        !m.arquivada &&
        m.publicacao === "publicado" &&
        m.disponibilidade === "disponivel"
      );
    case "Reservadas":
      return !m.arquivada && m.disponibilidade === "reservada";
    case "Vendidas":
      return m.disponibilidade === "vendida";
    case "Rascunhos":
      return m.publicacao === "rascunho" && !m.arquivada;
    case "Arquivadas":
      return m.arquivada;
    default:
      return true;
  }
}
export function Inventory() {
  const motos = useMotosAdmin();
  const [aba, setAba] = useState("Todas");
  const [busca, setBusca] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [sale, setSale] = useState<Moto | null>(null);
  const mobile = useMobile();
  const reduced = useReducedMotion();
  const moto = motos.find((m) => m.id === selected);
  const lista = motos.filter(
    (m) =>
      corresponde(m, aba) &&
      `${m.marca} ${m.modelo} ${m.codigo}`
        .toLowerCase()
        .includes(busca.toLowerCase()),
  );
  function arquivar(m: Moto) {
    try {
      motoRepository.arquivar(m.id, !m.arquivada);
      toast.success(m.arquivada ? "Moto reativada." : "Moto arquivada.", {
        action: {
          label: "Desfazer",
          onClick: () => motoRepository.arquivar(m.id, m.arquivada),
        },
      });
    } catch {
      toast.error("Não foi possível alterar o arquivamento.");
    }
  }
  return (
    <>
      <div className="section-heading">
        <div>
          <p className="eyebrow">Gestão / estoque</p>
          <h1 className="page-title mt-3">Cada moto, no seu controle.</h1>
        </div>
        <Button asChild>
          <Link href="/admin/motos/nova">
            <Plus size={16} />
            Cadastrar moto
          </Link>
        </Button>
      </div>
      <div className="inventory-layout" data-inspector={!!moto && !mobile}>
        <section className="min-w-0">
          <div className="segments inventory-tabs">
            {abas.map((a) => (
              <button
                key={a}
                aria-pressed={aba === a}
                onClick={() => setAba(a)}
              >
                {a} ({motos.filter((m) => corresponde(m, a)).length})
              </button>
            ))}
          </div>
          <Input
            className="my-4"
            placeholder="Buscar modelo ou código…"
            aria-label="Buscar no estoque"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
          <div className="inventory-list">
            {lista.map((m) => {
              const lucro = lucroMoto(m);
              const margem = margemMoto(m);
              return (
                <article
                  key={m.id}
                  className={`inventory-row ${selected === m.id ? "selected" : ""}`}
                >
                  <button
                    className="inventory-open"
                    onClick={() => setSelected(m.id)}
                    aria-label={`Editar ${m.codigo} ${m.modelo}`}
                  >
                    <div className="inventory-image">
                      <MotoImage src={m.fotos[0]?.src} alt={m.modelo} />
                    </div>
                    <div>
                      <h2 className="font-display font-bold text-lg">
                        {m.marca} {m.modelo}
                      </h2>
                      <p className="font-mono text-xs text-muted my-2">
                        {m.codigo} · {m.anoModelo}
                      </p>
                      <MotoStatus moto={m} />
                    </div>
                  </button>
                  <dl className="inventory-values">
                    <div>
                      <dt>Custo total</dt>
                      <dd>{formatarMoeda(custoTotal(m.custos))}</dd>
                    </div>
                    <div>
                      <dt>{m.venda ? "Venda final" : "Preço"}</dt>
                      <dd>{formatarMoeda(m.venda?.valorFinal ?? m.preco)}</dd>
                    </div>
                    <div>
                      <dt>Lucro</dt>
                      <dd
                        className={
                          lucro !== null && lucro < 0
                            ? "text-danger"
                            : margem !== null && margem < 10
                              ? "text-warning"
                              : "text-success"
                        }
                      >
                        {formatarMoeda(lucro)}
                        <small>
                          {margem === null ? "—" : formatarPercentual(margem)}
                        </small>
                      </dd>
                    </div>
                  </dl>
                  <div className="inventory-actions">
                    <Button variant="ghost" onClick={() => setSelected(m.id)}>
                      Editar preço
                    </Button>
                    {m.disponibilidade !== "vendida" && (
                      <>
                        <Button
                          variant="ghost"
                          onClick={() => {
                            try {
                              motoRepository.alterarStatus(m.id, {
                                disponibilidade:
                                  m.disponibilidade === "reservada"
                                    ? "disponivel"
                                    : "reservada",
                              });
                              toast.success("Disponibilidade atualizada.");
                            } catch {
                              toast.error("Não foi possível alterar o status.");
                            }
                          }}
                        >
                          {m.disponibilidade === "reservada"
                            ? "Liberar"
                            : "Reservar"}
                        </Button>
                        <Button variant="ghost" onClick={() => setSale(m)}>
                          Marcar como vendida
                        </Button>
                      </>
                    )}
                    <Button variant="ghost" onClick={() => arquivar(m)}>
                      {m.arquivada ? "Reativar" : "Arquivar"}
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>
          {!lista.length && (
            <div className="empty-state">
              <h2>Nenhuma moto nesta seleção.</h2>
              <Button
                variant="secondary"
                onClick={() => {
                  setAba("Todas");
                  setBusca("");
                }}
              >
                Limpar busca
              </Button>
            </div>
          )}
        </section>
        {moto && !mobile && (
          <motion.aside
            initial={{ x: reduced ? 0 : 24, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="inventory-inspector"
          >
            <div className="flex justify-end">
              <Button
                variant="ghost"
                aria-label="Fechar inspetor"
                onClick={() => setSelected(null)}
              >
                <X size={18} />
              </Button>
            </div>
            <Inspector
              key={`${moto.id}-${moto.atualizadoEm}`}
              original={moto}
              onClose={() => setSelected(null)}
            />
          </motion.aside>
        )}
      </div>
      {mobile && (
        <ResponsivePanel
          open={!!moto}
          onOpenChange={(v) => {
            if (!v) setSelected(null);
          }}
          title="Edição rápida"
          description="Preço, custos e disponibilidade no mesmo lugar."
        >
          {moto && (
            <Inspector
              key={`${moto.id}-${moto.atualizadoEm}`}
              original={moto}
              onClose={() => setSelected(null)}
            />
          )}
        </ResponsivePanel>
      )}
      {sale && (
        <SaleDialog
          key={sale.id}
          moto={sale}
          open={!!sale}
          onOpenChange={(v) => {
            if (!v) setSale(null);
          }}
        />
      )}
    </>
  );
}
