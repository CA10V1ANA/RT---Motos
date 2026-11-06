"use client";
import { useState } from "react";
import type { Moto, Hotspot } from "@/lib/data/schemas";
import { MotoImage } from "../public/moto-image";
import { Field, Select, Textarea } from "../ui/field";
import { Input } from "../ui/primitives";
import { Button } from "../ui/button";
export function HotspotEditor({
  moto,
  onChange,
}: {
  moto: Moto;
  onChange: (m: Moto) => void;
}) {
  const [fotoId, setFotoId] = useState(moto.fotos[0]?.id ?? "");
  const [selected, setSelected] = useState<string | null>(null);
  const foto = moto.fotos.find((f) => f.id === fotoId) ?? moto.fotos[0];
  const point = moto.hotspots.find((h) => h.id === selected);
  function atualizar(id: string, patch: Partial<Hotspot>) {
    onChange({
      ...moto,
      hotspots: moto.hotspots.map((p) =>
        p.id === id ? { ...p, ...patch } : p,
      ),
    });
  }
  function coordenadas(e: React.PointerEvent, rect: DOMRect) {
    return {
      x: Math.max(
        0,
        Math.min(100, ((e.clientX - rect.left) / rect.width) * 100),
      ),
      y: Math.max(
        0,
        Math.min(100, ((e.clientY - rect.top) / rect.height) * 100),
      ),
    };
  }
  if (!foto)
    return (
      <p className="text-muted text-sm">
        Adicione uma foto para criar pontos de Raio-X.
      </p>
    );
  return (
    <section className="space-y-4 mt-8">
      <h2 className="text-xl font-bold">Editor de Raio-X</h2>
      <p className="text-xs text-muted">
        Toque na foto para adicionar um ponto. Arraste-o ou use as setas do
        teclado para reposicionar.
      </p>
      <Field label="Foto dos pontos">
        <Select
          value={foto.id}
          onChange={(e) => {
            setFotoId(e.target.value);
            setSelected(null);
          }}
        >
          {moto.fotos.map((f) => (
            <option key={f.id} value={f.id}>
              {f.legenda || "Foto"}
            </option>
          ))}
        </Select>
      </Field>
      <div
        className="hotspot-editor-stage"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const id = crypto.randomUUID();
          const x = Math.max(
            0,
            Math.min(100, ((e.clientX - rect.left) / rect.width) * 100),
          );
          const y = Math.max(
            0,
            Math.min(100, ((e.clientY - rect.top) / rect.height) * 100),
          );
          onChange({
            ...moto,
            hotspots: [
              ...moto.hotspots,
              {
                id,
                fotoId: foto.id,
                x,
                y,
                titulo: "Novo ponto",
                descricao: "",
              },
            ],
          });
          setSelected(id);
        }}
      >
        <MotoImage
          src={foto.src}
          alt="Foto para posicionar os pontos de Raio-X"
          contain
        />
        {moto.hotspots
          .filter((h) => h.fotoId === foto.id)
          .map((p) => (
            <button
              key={p.id}
              className="hotspot editor-point"
              style={{ left: `${p.x}%`, top: `${p.y}%`, touchAction: "none" }}
              aria-label={`Editar ponto ${p.titulo}`}
              onClick={(e) => {
                e.stopPropagation();
                setSelected(p.id);
              }}
              onPointerDown={(e) => {
                e.stopPropagation();
                e.currentTarget.setPointerCapture(e.pointerId);
                setSelected(p.id);
              }}
              onPointerMove={(e) => {
                if (
                  e.buttons === 1 &&
                  e.currentTarget.hasPointerCapture(e.pointerId)
                )
                  atualizar(
                    p.id,
                    coordenadas(
                      e,
                      e.currentTarget.parentElement!.getBoundingClientRect(),
                    ),
                  );
              }}
              onKeyDown={(e) => {
                if (
                  ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(
                    e.key,
                  )
                ) {
                  e.preventDefault();
                  atualizar(p.id, {
                    x: Math.max(
                      0,
                      Math.min(
                        100,
                        p.x +
                          (e.key === "ArrowRight"
                            ? 1
                            : e.key === "ArrowLeft"
                              ? -1
                              : 0),
                      ),
                    ),
                    y: Math.max(
                      0,
                      Math.min(
                        100,
                        p.y +
                          (e.key === "ArrowDown"
                            ? 1
                            : e.key === "ArrowUp"
                              ? -1
                              : 0),
                      ),
                    ),
                  });
                }
              }}
            >
              <span />
            </button>
          ))}
      </div>
      <Button
        type="button"
        variant="secondary"
        onClick={() => {
          const id = crypto.randomUUID();
          onChange({
            ...moto,
            hotspots: [
              ...moto.hotspots,
              {
                id,
                fotoId: foto.id,
                x: 50,
                y: 50,
                titulo: "Novo ponto",
                descricao: "",
              },
            ],
          });
          setSelected(id);
        }}
      >
        Criar ponto no centro
      </Button>
      {point && (
        <div className="surface rounded-xl p-4 space-y-4">
          <Field label="Título do ponto">
            <Input
              value={point.titulo}
              onChange={(e) => atualizar(point.id, { titulo: e.target.value })}
            />
          </Field>
          <Field label="Descrição do ponto">
            <Textarea
              value={point.descricao ?? ""}
              onChange={(e) =>
                atualizar(point.id, { descricao: e.target.value })
              }
            />
          </Field>
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              onChange({
                ...moto,
                hotspots: moto.hotspots.filter((p) => p.id !== point.id),
              });
              setSelected(null);
            }}
          >
            Remover ponto
          </Button>
        </div>
      )}
    </section>
  );
}
