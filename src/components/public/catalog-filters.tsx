"use client";
import { useState, useRef, useEffect } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import type { MotoPublica } from "@/lib/data/schemas";
import { Button } from "../ui/button";
import { Input } from "../ui/primitives";
import { Field, Select } from "../ui/field";
import { ResponsivePanel } from "../ui/responsive-panel";
export function CatalogFilters({
  motos,
  params,
  update,
}: {
  motos: MotoPublica[];
  params: URLSearchParams;
  update: (key: string, value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [busca, setBusca] = useState(params.get("busca") ?? "");
  const buscaUrl = params.get("busca") ?? "";
  const [ultimaBuscaUrl, setUltimaBuscaUrl] = useState(buscaUrl);
  if (buscaUrl !== ultimaBuscaUrl) {
    setUltimaBuscaUrl(buscaUrl);
    if (buscaUrl !== busca) setBusca(buscaUrl);
  }
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  const marcas = [...new Set(motos.map((m) => m.marca))];
  const avancados = (
    <div className="filter-fields">
      <Field label="Preço mínimo">
        <Input
          type="number"
          min="0"
          value={params.get("min") ?? ""}
          onChange={(e) => update("min", e.target.value)}
          placeholder="R$ 0"
        />
      </Field>
      <Field label="Preço máximo">
        <Input
          type="number"
          min="0"
          value={params.get("max") ?? ""}
          onChange={(e) => update("max", e.target.value)}
          placeholder="Sem limite"
        />
      </Field>
      <Field label="Ano mínimo">
        <Input
          type="number"
          min="1900"
          max="2100"
          value={params.get("anoMin") ?? ""}
          onChange={(e) => update("anoMin", e.target.value)}
        />
      </Field>
      <Field label="Ano máximo">
        <Input
          type="number"
          min="1900"
          max="2100"
          value={params.get("anoMax") ?? ""}
          onChange={(e) => update("anoMax", e.target.value)}
        />
      </Field>
      <Field label="Condição">
        <Select
          value={params.get("condicao") ?? ""}
          onChange={(e) => update("condicao", e.target.value)}
        >
          <option value="">Todas</option>
          <option value="seminova">Seminova</option>
          <option value="nova">Nova</option>
        </Select>
      </Field>
      <Field label="Modalidade">
        <Select
          value={params.get("modalidade") ?? ""}
          onChange={(e) => update("modalidade", e.target.value)}
        >
          <option value="">Todas</option>
          <option value="estoque_proprio">Estoque próprio</option>
          <option value="repasse">Repasse</option>
        </Select>
      </Field>
    </div>
  );
  return (
    <div className="catalog-filters">
      <div className="filter-main">
        <label className="search-field">
          <Search size={18} />
          <input
            aria-label="Buscar motos"
            placeholder="Buscar por modelo, marca ou ano…"
            value={busca}
            onChange={(e) => {
              const value = e.target.value;
              setBusca(value);
              if (timer.current) clearTimeout(timer.current);
              timer.current = setTimeout(() => update("busca", value), 250);
            }}
          />
        </label>
        <div className="brand-pills">
          <button
            onClick={() => update("marca", "")}
            aria-pressed={!params.get("marca")}
          >
            Todas ({motos.length})
          </button>
          {marcas.map((m) => (
            <button
              key={m}
              aria-pressed={params.get("marca") === m}
              onClick={() => update("marca", m)}
            >
              {m} ({motos.filter((x) => x.marca === m).length})
            </button>
          ))}
          <button
            aria-pressed={params.get("max") === "20000"}
            onClick={() =>
              update("max", params.get("max") === "20000" ? "" : "20000")
            }
          >
            Até R$ 20 mil
          </button>
        </div>
        <Button variant="secondary" onClick={() => setOpen(true)}>
          <SlidersHorizontal size={16} />
          Filtros
        </Button>
      </div>
      <div className="mt-3 flex items-center justify-between gap-3">
        <span className="text-xs text-muted">Estoque próprio e repasse</span>
        <Select
          className="w-auto max-w-52 text-xs"
          aria-label="Ordenar motos"
          value={params.get("ordem") ?? ""}
          onChange={(e) => update("ordem", e.target.value)}
        >
          <option value="">Mais recentes no estoque</option>
          <option value="preco">Menor preço</option>
          <option value="preco-desc">Maior preço</option>
          <option value="km">Menor KM</option>
          <option value="ano">Mais novas</option>
        </Select>
      </div>
      <ResponsivePanel
        open={open}
        onOpenChange={setOpen}
        title="Encontre a sua moto"
        description="Combine os filtros para explorar o estoque."
      >
        {avancados}
        <Button className="mt-6 w-full" onClick={() => setOpen(false)}>
          Ver resultados
        </Button>
      </ResponsivePanel>
    </div>
  );
}
