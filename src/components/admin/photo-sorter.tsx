"use client";
import { useState } from "react";
import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Star, Trash2, Camera, Upload } from "lucide-react";
import { toast } from "sonner";
import type { Moto, Foto } from "@/lib/data/schemas";
import { salvarFoto } from "@/lib/data/photos";
import { MotoImage } from "../public/moto-image";
import { Button } from "../ui/button";
import { Input } from "../ui/primitives";
import { PhotoLibrary } from "./photo-library";
function SortablePhoto({
  foto,
  capa,
  onCaption,
  onCover,
  onRemove,
}: {
  foto: Foto;
  capa: boolean;
  onCaption: (v: string) => void;
  onCover: () => void;
  onRemove: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
  } = useSortable({ id: foto.id });
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className="photo-tile"
    >
      <div className="photo-tile-image">
        <MotoImage src={foto.src} alt={foto.legenda || "Foto enviada"} />
        <button
          type="button"
          ref={setActivatorNodeRef}
          {...attributes}
          {...listeners}
          className="photo-handle"
          aria-label={`Reordenar ${foto.legenda || "foto"}`}
        >
          <GripVertical size={19} />
        </button>
        {capa && <span className="cover-badge">CAPA</span>}
      </div>
      <Input
        aria-label="Legenda da foto"
        value={foto.legenda ?? ""}
        onChange={(e) => onCaption(e.target.value)}
        placeholder="Legenda"
      />
      <div className="flex gap-1">
        <Button
          type="button"
          variant="ghost"
          onClick={onCover}
          aria-label="Usar como capa"
          className="px-3"
        >
          <Star size={16} fill={capa ? "currentColor" : "none"} />
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={onRemove}
          aria-label="Remover foto"
          className="px-3"
        >
          <Trash2 size={16} />
        </Button>
      </div>
    </div>
  );
}
export function PhotoSorter({
  moto,
  onChange,
  upload = true,
}: {
  moto: Moto;
  onChange: (m: Moto) => void;
  upload?: boolean;
}) {
  const [busy, setBusy] = useState(false);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );
  async function enviar(files: FileList | File[]) {
    setBusy(true);
    try {
      const fotos: Foto[] = [];
      for (const file of Array.from(files)) {
        const src = await salvarFoto(file);
        fotos.push({
          id: crypto.randomUUID(),
          src,
          legenda: `Foto ${moto.fotos.length + fotos.length + 1}`,
        });
      }
      onChange({ ...moto, fotos: [...moto.fotos, ...fotos] });
      toast.success("Fotos adicionadas.");
    } catch {
      toast.error(
        "Não foi possível enviar a foto. Use JPEG, PNG ou WebP e confira o espaço do navegador.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="min-w-0 max-w-full">
      {upload && (
        <div
          className="upload-zone"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (!busy) void enviar(e.dataTransfer.files);
          }}
        >
          <Upload size={22} />
          <p>
            {busy
              ? "Preparando fotos…"
              : "Arraste suas fotos ou selecione arquivos"}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <label className="button button-secondary">
              Selecionar fotos
              <input
                type="file"
                accept="image/*"
                multiple
                disabled={busy}
                className="sr-only"
                onChange={(e) => {
                  if (e.target.files) void enviar(e.target.files);
                  e.target.value = "";
                }}
              />
            </label>
            <label className="button button-secondary">
              <Camera size={16} />
              Usar câmera
              <input
                type="file"
                accept="image/*"
                capture="environment"
                disabled={busy}
                className="sr-only"
                onChange={(e) => {
                  if (e.target.files) void enviar(e.target.files);
                  e.target.value = "";
                }}
              />
            </label>
          </div>
          <p className="text-xs text-muted">
            Até 1600px · JPEG otimizado · salvo neste navegador
          </p>
        </div>
      )}
      {upload && (
        <PhotoLibrary
          onAdd={(fotos) =>
            onChange({ ...moto, fotos: [...moto.fotos, ...fotos] })
          }
        />
      )}
      <DndContext
        accessibility={{
          screenReaderInstructions: {
            draggable:
              "Para mover esta foto, pressione espaço. Use as setas para reordenar e espaço para soltar. Escape cancela.",
          },
          announcements: {
            onDragStart: () => "Foto selecionada para reordenar.",
            onDragOver: ({ over }) =>
              over
                ? `Foto movida para posição ${moto.fotos.findIndex(f => f.id === over.id) + 1} de ${moto.fotos.length}.`
                : "Foto fora da área de ordenação.",
            onDragEnd: () => "Nova posição da foto confirmada.",
            onDragCancel: () => "Ordenação cancelada.",
          },
        }}
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={({ active, over }) => {
          if (over && active.id !== over.id)
            onChange({
              ...moto,
              fotos: arrayMove(
                moto.fotos,
                moto.fotos.findIndex((f) => f.id === active.id),
                moto.fotos.findIndex((f) => f.id === over.id),
              ),
            });
        }}
      >
        <SortableContext
          items={moto.fotos.map((f) => f.id)}
          strategy={rectSortingStrategy}
        >
          <div className="photo-sorter">
            {moto.fotos.map((foto, i) => (
              <SortablePhoto
                key={foto.id}
                foto={foto}
                capa={i === 0}
                onCaption={(v) =>
                  onChange({
                    ...moto,
                    fotos: moto.fotos.map((f) =>
                      f.id === foto.id ? { ...f, legenda: v } : f,
                    ),
                  })
                }
                onCover={() =>
                  onChange({
                    ...moto,
                    fotos: [
                      foto,
                      ...moto.fotos.filter((f) => f.id !== foto.id),
                    ],
                  })
                }
                onRemove={() =>
                  onChange({
                    ...moto,
                    fotos: moto.fotos.filter((f) => f.id !== foto.id),
                    hotspots: moto.hotspots.filter((h) => h.fotoId !== foto.id),
                  })
                }
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
      {!moto.fotos.length && (
        <p className="text-sm text-muted my-4">Nenhuma foto adicionada.</p>
      )}
    </section>
  );
}
