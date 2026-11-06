"use client";
import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import type { Moto } from "@/lib/data/schemas";
import { motoRepository } from "@/lib/data/repository";
import { ProfitEditor } from "./profit-editor";
import { PhotoSorter } from "./photo-sorter";
import { SaleDialog } from "./sale-dialog";
import { MotoImage } from "../public/moto-image";
import { MotoStatus } from "../public/moto-card";
import { Segmented } from "../ui/segmented";
import { Toggle } from "../ui/toggle";
import { Button } from "../ui/button";
export function Inspector({
  original,
  onClose,
}: {
  original: Moto;
  onClose: () => void;
}) {
  const [moto, setMoto] = useState(original);
  const [sale, setSale] = useState(false);
  function salvar() {
    try {
      motoRepository.atualizar(moto.id, moto);
      toast.success("Alterações salvas no catálogo.");
      onClose();
    } catch {
      toast.error("Confira os dados antes de salvar.");
    }
  }
  return (
    <div className="inspector-content">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="eyebrow">{moto.codigo} / edição rápida</p>
          <h2 className="text-xl font-bold mt-2">
            {moto.marca} {moto.modelo}
          </h2>
        </div>
        <MotoStatus moto={moto} />
      </div>
      <div className="inspector-cover">
        <MotoImage src={moto.fotos[0]?.src} alt={moto.modelo} contain />
      </div>
      <PhotoSorter moto={moto} onChange={setMoto} upload={false} />
      <ProfitEditor moto={moto} onChange={setMoto} />
      <div className="space-y-4">
        <Segmented
          label="Publicação"
          value={moto.publicacao}
          options={[
            { value: "rascunho", label: "Rascunho" },
            { value: "publicado", label: "Publicado" },
          ]}
          onChange={(value) =>
            setMoto({ ...moto, publicacao: value as Moto["publicacao"] })
          }
        />
        <Segmented
          label="Disponibilidade"
          value={moto.disponibilidade}
          options={[
            { value: "disponivel", label: "Disponível" },
            { value: "reservada", label: "Reservada" },
            { value: "vendida", label: "Vendida" },
          ]}
          onChange={(value) => {
            if (value === "vendida") setSale(true);
            else
              setMoto({
                ...moto,
                disponibilidade: value as Moto["disponibilidade"],
                venda: undefined,
              });
          }}
        />
        <Toggle
          label="Moto de repasse"
          checked={moto.modalidade === "repasse"}
          onCheckedChange={(checked) =>
            setMoto({
              ...moto,
              modalidade: checked ? "repasse" : "estoque_proprio",
            })
          }
        />
        <Toggle
          label="Destaque no catálogo"
          checked={moto.destaque}
          onCheckedChange={(checked) => setMoto({ ...moto, destaque: checked })}
        />
      </div>
      <div className="grid gap-3">
        <Button onClick={salvar}>Salvar alterações</Button>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" asChild>
            <Link href={`/admin/motos/${moto.id}`}>Editar completo</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link target="_blank" href={`/motos/${moto.slug}`}>
              Ver no catálogo ↗
            </Link>
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              try {
                const copia = motoRepository.duplicar(moto.id);
                toast.success(`Rascunho ${copia.codigo} criado.`);
                onClose();
              } catch {
                toast.error("Não foi possível duplicar.");
              }
            }}
          >
            Duplicar
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              try {
                motoRepository.arquivar(moto.id, !moto.arquivada);
                toast.success(
                  moto.arquivada ? "Moto reativada." : "Moto arquivada.",
                  {
                    action: {
                      label: "Desfazer",
                      onClick: () =>
                        motoRepository.arquivar(moto.id, moto.arquivada),
                    },
                  },
                );
                onClose();
              } catch {
                toast.error("Não foi possível arquivar.");
              }
            }}
          >
            {moto.arquivada ? "Reativar" : "Arquivar"}
          </Button>
        </div>
      </div>
      <SaleDialog
        key={`${moto.id}-${sale}`}
        moto={original}
        open={sale}
        onOpenChange={setSale}
        onSold={onClose}
      />
    </div>
  );
}
