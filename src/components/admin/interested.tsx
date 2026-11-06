"use client";
import { useState } from "react";
import { useCliques, useMotosAdmin } from "@/lib/data/hooks";
import { formatarData } from "@/lib/format";
import { Field, Select } from "../ui/field";
import { Input } from "../ui/primitives";
const tipos = {
  interesse: "Interesse",
  troca: "Troca",
  financiamento: "Financiamento",
  contato_geral: "Contato geral",
};
export function Interested() {
  const cliques = useCliques();
  const motos = useMotosAdmin();
  const [tipo, setTipo] = useState("");
  const [motoId, setMotoId] = useState("");
  const [inicio, setInicio] = useState("");
  const [fim, setFim] = useState("");
  const lista = cliques
    .filter(
      (c) =>
        (!tipo || c.tipo === tipo) &&
        (!motoId || c.motoId === motoId) &&
        (!inicio ||
          Date.parse(c.data) >= Date.parse(`${inicio}T00:00:00-03:00`)) &&
        (!fim || Date.parse(c.data) <= Date.parse(`${fim}T23:59:59-03:00`)),
    )
    .sort((a, b) => Date.parse(b.data) - Date.parse(a.data));
  return (
    <>
      <p className="eyebrow">Procura / atendimento</p>
      <h1 className="page-title mt-3 mb-6">
        O primeiro passo de cada interesse.
      </h1>
      <p className="notice">
        Registra cliques no botão do WhatsApp. Conversas e vendas são
        acompanhadas pela equipe.
      </p>
      <div className="form-grid mb-6">
        <Field label="Tipo de clique">
          <Select value={tipo} onChange={(e) => setTipo(e.target.value)}>
            <option value="">Todos</option>
            {Object.entries(tipos).map(([v, t]) => (
              <option key={v} value={v}>
                {t}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Moto">
          <Select value={motoId} onChange={(e) => setMotoId(e.target.value)}>
            <option value="">Todas as motos</option>
            {motos.map((m) => (
              <option key={m.id} value={m.id}>
                {m.codigo} · {m.modelo}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="De">
          <Input
            type="date"
            value={inicio}
            onChange={(e) => setInicio(e.target.value)}
          />
        </Field>
        <Field label="Até">
          <Input
            type="date"
            value={fim}
            onChange={(e) => setFim(e.target.value)}
          />
        </Field>
      </div>
      <p className="text-xs text-muted mb-4">
        {lista.length} cliques para atendimento
      </p>
      <div className="surface rounded-2xl overflow-hidden">
        <div className="interest-row interest-heading">
          <span>Data</span>
          <span>Moto</span>
          <span>Tipo de clique</span>
        </div>
        {lista.map((c) => {
          const m = motos.find((m) => m.id === c.motoId);
          return (
            <div key={c.id} className="interest-row">
              <span className="font-mono text-xs">{formatarData(c.data)}</span>
              <span>{m ? `${m.codigo} · ${m.modelo}` : "Contato geral"}</span>
              <span className="text-muted">{tipos[c.tipo]}</span>
            </div>
          );
        })}
        {!lista.length && (
          <div className="empty-state">
            <h2>Nenhum clique neste período.</h2>
            <p>Os cliques nos botões de atendimento aparecerão aqui.</p>
          </div>
        )}
      </div>
    </>
  );
}
