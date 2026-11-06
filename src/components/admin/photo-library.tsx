"use client";
import { useState } from "react";
import { acervoLoja } from "@/lib/data/media";
import type { Foto } from "@/lib/data/schemas";
import { Field, Select } from "../ui/field";
import { Button } from "../ui/button";
import { MotoImage } from "../public/moto-image";
export function PhotoLibrary({ onAdd }: { onAdd: (fotos: Foto[]) => void }) {
  const [index, setIndex] = useState(0);
  const grupo = acervoLoja[index];
  return (
    <details className="photo-library">
      <summary>Usar fotos fornecidas pela loja</summary>
      <div className="space-y-4 py-4">
        <p className="text-xs text-muted">
          Confira se as fotos correspondem à moto deste cadastro. Ano, preço e
          quilometragem não são extraídos das imagens.
        </p>
        <Field label="Conjunto de fotos">
          <Select
            value={index}
            onChange={(e) => setIndex(Number(e.target.value))}
          >
            {acervoLoja.map((g, i) => (
              <option value={i} key={g.nome}>
                {g.nome}
              </option>
            ))}
          </Select>
        </Field>
        <div className="grid grid-cols-3 gap-2">
          {grupo.fotos.map((f) => (
            <div
              className="relative aspect-square rounded-xl overflow-hidden"
              key={f.src}
            >
              <MotoImage src={f.src} alt={`${grupo.nome} · ${f.legenda}`} />
            </div>
          ))}
        </div>
        <Button
          type="button"
          variant="secondary"
          onClick={() =>
            onAdd(grupo.fotos.map((f) => ({ ...f, id: crypto.randomUUID() })))
          }
        >
          Adicionar fotos deste conjunto
        </Button>
      </div>
    </details>
  );
}
